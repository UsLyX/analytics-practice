package com.example.backend.enums;

public enum CurrencyCode {
    RUB("Российский рубль"),
    USD("Доллар США"),
    EUR("Евро");
    
    private final String description;
    
    CurrencyCode(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}