package com.example.heecoffee.Model;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SalesSummary {
    private Integer totalQuantity;
    private BigDecimal totalRevenue;
}
