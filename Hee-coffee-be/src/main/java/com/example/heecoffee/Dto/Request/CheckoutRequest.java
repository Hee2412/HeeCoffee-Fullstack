package com.example.heecoffee.Dto.Request;

import com.example.heecoffee.Model.Order;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class CheckoutRequest {
    private Integer userId;
    private String guestName;
    private String guestAddress;
    private String guestEmail;
    private String guestPhone;

    private Order.PaymentMethod paymentMethod;

    private List<CheckoutItemRequest> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CheckoutItemRequest {
        private Integer productId;
        private String productName;
        private Integer quantity;
        private BigDecimal price;
    }
}