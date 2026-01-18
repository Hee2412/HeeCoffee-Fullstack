package com.example.heecoffee.Dto.Request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequest {
    @Schema(description = "Tên sản phẩm")
    private String productName;
    private String description;
    private BigDecimal price;
    private String img;
    private String status;
    private List<Integer> typeIds; // Frontend gửi array of type IDs
}