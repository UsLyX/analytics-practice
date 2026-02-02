package com.example.backend.enums;

public enum NdsRate {
    WITHOUT_NDS("Без НДС"),
    RATE_18("18%"),
    RATE_20("20%");
    
    private final String displayName;
    
    NdsRate(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public static NdsRate fromDisplayName(String displayName) {
        for (NdsRate rate : values()) {
            if (rate.displayName.equals(displayName)) {
                return rate;
            }
        }
        throw new IllegalArgumentException("Unknown NDS rate: " + displayName);
    }
}