package com.example.heecoffee.Model;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductSalesData {
    private Integer productId;
    private String productName;
    private String productImage;
    private BigDecimal price;
    private Integer quantitySold;
    private BigDecimal totalRevenue;

    public ProductSalesData(Integer productId, String productName, String img, BigDecimal unitPrice, int i, BigDecimal zero) {
        this.productId = productId;
        this.productName = productName;
        this.productImage = img;
        this.price = unitPrice;
        this.quantitySold = i;
        this.totalRevenue = zero;
    }
}
