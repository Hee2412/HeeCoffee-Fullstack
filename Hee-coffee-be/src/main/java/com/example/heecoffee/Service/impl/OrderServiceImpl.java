package com.example.heecoffee.Service.impl;

import com.example.heecoffee.Dto.Request.CheckoutRequest;
import com.example.heecoffee.Dto.Request.SalesReportRequest;
import com.example.heecoffee.Dto.Response.OrderItemResponse;
import com.example.heecoffee.Dto.Response.OrderResponse;
import com.example.heecoffee.Dto.Response.SalesReportResponse;
import com.example.heecoffee.Exception.ErrorCodeConstant;
import com.example.heecoffee.Exception.NotFoundException;
import com.example.heecoffee.Model.*;
import com.example.heecoffee.Repository.OrderRepository;
import com.example.heecoffee.Repository.ProductRepository;
import com.example.heecoffee.Repository.UserRepository;
import com.example.heecoffee.Service.CartService;
import com.example.heecoffee.Service.Notification.NotificationService;
import com.example.heecoffee.Service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);
    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final BankProperties bankProperties;
    private final NotificationService notificationService;

    public OrderServiceImpl(OrderRepository orderRepository,
                            CartService cartService,
                            UserRepository userRepository,
                            ProductRepository productRepository,
                            BankProperties bankProperties, NotificationService notificationService
                            ) {
        this.orderRepository = orderRepository;
        this.cartService = cartService;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.bankProperties = bankProperties;
        this.notificationService = notificationService;
    }

    // Mapping method
    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(oi -> new OrderItemResponse(
                        oi.getId(),
                        oi.getProduct().getProductName(),
                        oi.getQuantity(),
                        oi.getUnitPrice()
                ))
                .toList();

        OrderResponse response = new OrderResponse(
                order.getId(),
                order.getCustomerName(),
                order.getCustomerEmail(),
                order.getCustomerAddress(),
                order.getGuest_phone(),
                order.getTotalAmount(),
                order.getPaymentMethod() != null ? order.getPaymentMethod().name() : null,
                order.getOrderStatus() != null ? order.getOrderStatus().name() : null,
                order.getCreatedAt(),
                items
        );
        response.setIsPaid(order.getIsPaid());
        response.setPaidAt(order.getPaidAt());

        //calculate paid time
        if (order.getPaidAt() != null) {
            long minutes = java.time.Duration.between(order.getPaidAt(), LocalDateTime.now()).toMinutes();
            response.setMinutesSincePaid(minutes);
        }
        return response;
    }

    // Status changing method
    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Integer orderId, Order.OrderStatus orderStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Not found", ErrorCodeConstant.ORDER_NOT_FOUND));

        Order.OrderStatus oldStatus = order.getOrderStatus();
        order.setOrderStatus(orderStatus);

        if (orderStatus == Order.OrderStatus.ACTIVE && !order.getIsPaid()) {
            order.setIsPaid(true);
            order.setPaidAt(LocalDateTime.now());
        }
        Order savedOrder = orderRepository.save(order);
        try {
            if (oldStatus != orderStatus) {
                notificationService.notifyOrderStatusUpdate(savedOrder);
                log.info("Status update notification sent for order #{}: {} -> {}",
                        savedOrder.getId(), oldStatus, orderStatus);
            }
        } catch (Exception e) {
            log.error("Failed to send status update notification for order #{}. Error: {}",
                    savedOrder.getId(), e.getMessage(), e);
        }
        return mapToOrderResponse(savedOrder);
    }

    // Payment QR
    @Override
    public String generateQrCode(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Not found", ErrorCodeConstant.ORDER_NOT_FOUND));

        String encodedName = URLEncoder.encode(bankProperties.getAccountName(), StandardCharsets.UTF_8);

        return String.format(
                "https://img.vietqr.io/image/%s-%s-compact2.png?amount=%s&addInfo=ORDER%d&accountName=%s",
                bankProperties.getBankCode(),
                bankProperties.getAccountNo(),
                order.getTotalAmount().longValue(),
                order.getId(),
                encodedName
        );
    }

    //Get all orders (admin)
    @Override
    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream().map(this::mapToOrderResponse).toList();
    }

    @Override
    public List<OrderResponse> getOrderByStatus(Order.OrderStatus orderStatus) {
        List<Order> orders = orderRepository.findByOrderStatus(orderStatus);
        return orders.stream().map(this::mapToOrderResponse).toList();
    }

    @Override
    public List<OrderResponse> getNewOrder() {
        LocalDateTime yesterday = LocalDateTime.now().minusHours(24);
        List<Order> orders = orderRepository.findNewOrders(yesterday);
        return orders.stream().map(this::mapToOrderResponse).toList();
    }

    @Override
    public Long getNewOrderCount() {
        LocalDateTime yesterday = LocalDateTime.now().minusHours(24);
        return orderRepository.countNewOrders(yesterday);
    }

    @Override
    @Transactional
    public OrderResponse checkout(CheckoutRequest dto) {

        Order order = new Order();
        order.setPaymentMethod(dto.getPaymentMethod());
        order.setOrderStatus(Order.OrderStatus.PENDING_PAYMENT);
        order.setCreatedAt(LocalDateTime.now());

        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new NotFoundException("User not found", ErrorCodeConstant.USER_NOT_FOUND));
            order.setUser(user);
            order.setGuest_name(dto.getGuestName());
            order.setGuest_email(dto.getGuestEmail());
            order.setGuest_address(dto.getGuestAddress());
            order.setGuest_phone(dto.getGuestPhone());
        } else {
            if (dto.getGuestName() == null || dto.getGuestEmail() == null || dto.getGuestAddress() == null) {
                throw new IllegalArgumentException("Guest information is required");
            }
            order.setGuest_name(dto.getGuestName());
            order.setGuest_address(dto.getGuestAddress());
            order.setGuest_email(dto.getGuestEmail());
            order.setGuest_phone(dto.getGuestPhone());
        }

        List<OrderItem> orderItems;

        if (dto.getItems() != null && !dto.getItems().isEmpty()) {
            orderItems = dto.getItems().stream().map(itemDto -> {
                Product product = productRepository.findById(itemDto.getProductId())
                        .orElseThrow(() -> new NotFoundException("Product not found", "PRODUCT_NOT_FOUND"));
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setQuantity(itemDto.getQuantity());
                orderItem.setUnitPrice(itemDto.getPrice());
                return orderItem;
            }).collect(Collectors.toList());
        } else if (dto.getUserId() != null) {
            Cart cart = cartService.getActiveCart(dto.getUserId());
            if (cart.getCartItems().isEmpty()) {
                throw new IllegalStateException("Cart is empty");
            }
            orderItems = cart.getCartItems().stream().map(ci -> {
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(ci.getProduct());
                orderItem.setQuantity(ci.getQuantity());
                orderItem.setUnitPrice(ci.getUnitPrice());
                return orderItem;
            }).collect(Collectors.toList());
        } else {
            throw new IllegalArgumentException("No items in checkout request");
        }

        order.setItems(orderItems);
        BigDecimal total = orderItems.stream()
                .map(oi -> oi.getUnitPrice().multiply(BigDecimal.valueOf(oi.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(total);

        Order savedOrder = orderRepository.save(order);
        try {
            notificationService.notifyNewOrder(savedOrder);
            log.info("Notification sent successfully for new order #{} by {}",
                    savedOrder.getId(), savedOrder.getGuest_name());
        } catch (Exception e) {
            log.error("Failed to send notification for order #{}. Error: {}",
                    savedOrder.getId(), e.getMessage(), e);
        }
        return mapToOrderResponse(savedOrder);
    }

    // Get all orders from userId
    @Override
    public List<OrderResponse> findByUserId(Integer userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream().map(this::mapToOrderResponse).toList();
    }

    // Get order details
    @Override
    public OrderResponse getOrderById(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Not found", ErrorCodeConstant.ORDER_NOT_FOUND));
        return mapToOrderResponse(order);
    }

    // Sync new user with recent order
    @Override
    public void syncGuestOrderToUser(String guestEmail, User newUser) {
        List<Order> guestOrders = orderRepository.findGuestOrdersByEmail(guestEmail);
        if (guestOrders.isEmpty()) {
            return;
        }
        for (Order order : guestOrders) {
            order.setUser(newUser);
            order.setGuest_name(null);
            orderRepository.save(order);
        }
    }

    // Sale report
    @Override
    public SalesReportResponse getSalesReport(SalesReportRequest request) {
        LocalDateTime startDate = request.getDateFrom().atStartOfDay();
        LocalDateTime endDate = request.getDateTo().atTime(23, 59, 59);

        List<Order> orders = orderRepository.findByCreatedAtBetweenAndOrderStatus(
                startDate, endDate, Order.OrderStatus.COMPLETED
        );

        Map<Integer, ProductSalesData> salesMap = new HashMap<>();
        for (Order order : orders) {
            for (OrderItem item : order.getItems()) {
                Integer productId = item.getProduct().getId();

                // Filter theo productIds nếu có
                if (!request.getProductIds().isEmpty() &&
                        !request.getProductIds().contains(productId)) {
                    continue;
                }

                ProductSalesData data = salesMap.getOrDefault(productId,
                        new ProductSalesData(
                                productId,
                                item.getProduct().getProductName(),
                                item.getProduct().getImg(),
                                item.getUnitPrice(),
                                0,
                                BigDecimal.ZERO
                        ));

                data.setQuantitySold(data.getQuantitySold() + item.getQuantity());
                data.setTotalRevenue(data.getTotalRevenue().add(
                        item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()))
                ));

                salesMap.put(productId, data);
            }
        }

        List<ProductSalesData> productList = new ArrayList<>(salesMap.values());

        // Tính summary
        SalesSummary summary = new SalesSummary();
        summary.setTotalQuantity(productList.stream()
                .mapToInt(ProductSalesData::getQuantitySold).sum());
        summary.setTotalRevenue(productList.stream()
                .map(ProductSalesData::getTotalRevenue)
                .reduce(BigDecimal.ZERO, BigDecimal::add));

        return new SalesReportResponse(productList, summary);
    }
}