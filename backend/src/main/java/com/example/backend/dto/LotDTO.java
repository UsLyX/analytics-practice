package com.example.backend.dto;

import com.example.backend.enums.CurrencyCode;
import com.example.backend.enums.NdsRate;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class LotDTO {
    private Long id;
    
    @NotBlank(message = "Наименование лота обязательно")
    @Size(min = 1, max = 255, message = "Наименование лота должно быть от 1 до 255 символов")
    private String lotName;
    
    @NotBlank(message = "Код контрагента обязателен")
    @Size(min = 1, max = 50, message = "Код контрагента должен быть от 1 до 50 символов")
    private String customerCode;
    
    @NotNull(message = "Начальная стоимость обязательна")
    @DecimalMin(value = "0.01", message = "Стоимость должна быть больше 0")
    private BigDecimal price;
    
    @NotNull(message = "Валюта обязательна")
    private CurrencyCode currencyCode;
    
    @NotNull(message = "Ставка НДС обязательна")
    private NdsRate ndsRate;
    
    @Size(max = 500, message = "Грузополучатель не должен превышать 500 символов")
    private String placeDelivery;
    
    private LocalDateTime dateDelivery;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}