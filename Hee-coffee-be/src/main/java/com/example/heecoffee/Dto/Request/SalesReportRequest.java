package com.example.heecoffee.Dto.Request;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class SalesReportRequest {
    private LocalDate dateFrom;
    private LocalDate dateTo;
    private List<Integer> productIds;
}
