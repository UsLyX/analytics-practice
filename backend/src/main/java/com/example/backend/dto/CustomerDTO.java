package com.example.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class CustomerDTO {
    private Long id;
    
    @NotBlank(message = "Код контрагента обязателен")
    @Size(min = 1, max = 50, message = "Код контрагента должен быть от 1 до 50 символов")
    private String customerCode;
    
    @NotBlank(message = "Наименование обязательно")
    @Size(min = 1, max = 255, message = "Наименование должно быть от 1 до 255 символов")
    private String customerName;
    
    @Pattern(regexp = "\\d{10}|\\d{12}|^$", message = "ИНН должен быть 10 или 12 цифр")
    private String customerInn;
    
    @Pattern(regexp = "\\d{9}|^$", message = "КПП должен быть 9 цифр")
    private String customerKpp;
    
    @Size(max = 500, message = "Юридический адрес не должен превышать 500 символов")
    private String customerLegalAddress;
    
    @Size(max = 500, message = "Почтовый адрес не должен превышать 500 символов")
    private String customerPostalAddress;
    
    @Email(message = "Некорректный email адрес")
    @Size(max = 100, message = "Email не должен превышать 100 символов")
    private String customerEmail;
    
    private String customerCodeMain;
    
    @JsonProperty("isOrganization")
    private Boolean isOrganization;
    
    @JsonProperty("isPerson")
    private Boolean isPerson;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}