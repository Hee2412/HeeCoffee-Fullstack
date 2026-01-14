package com.example.heecoffee.Dto.Response;

import com.example.heecoffee.Model.ProductSalesData;
import com.example.heecoffee.Model.SalesSummary;
import lombok.Data;

import java.util.List;

@Data
public class SalesReportResponse {
    private List<ProductSalesData> products;
    private SalesSummary summary;

    public SalesReportResponse(List<ProductSalesData> productList, SalesSummary summary) {
        this.products = productList;
        this.summary = summary;
    }
}
