package com.finanziapp.backend.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class BalanceResponse {
    private BigDecimal totalIngresos;
    private BigDecimal totalGastos;
    private BigDecimal balanceTotal;
}
