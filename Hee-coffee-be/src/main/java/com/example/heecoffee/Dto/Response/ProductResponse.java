package com.example.heecoffee.Dto.Response;

import com.example.heecoffee.Model.Product;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductResponse {
    private Integer id;
    private String productName;
    private String description;
    private BigDecimal price;
    private String img;
    private String status;
    private List<TypeResponse> types;

    public ProductResponse(Integer id, String productName, String description, BigDecimal price, String img, List<TypeResponse> types) {
        this.id = id;
        this.productName = productName;
        this.description = description;
        this.price = price;
        this.img = img;
        this.types = types;
    }

    public ProductResponse(Integer id, String productName, String description, BigDecimal price, String img, Product.ProductStatus status, List<TypeResponse> list) {
        this.id = id;
        this.productName = productName;
        this.description = description;
        this.price = price;
        this.img = img;
        this.status = status.toString();
        this.types = list;
    }
}

