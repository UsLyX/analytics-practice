package com.example.backend.config;

import com.example.backend.enums.CurrencyCode;
import org.jooq.Converter;

public class CurrencyCodeConverter implements Converter<String, CurrencyCode> {
    @Override
    public CurrencyCode from(String databaseObject) {
        return databaseObject == null ? null : CurrencyCode.valueOf(databaseObject);
    }

    @Override
    public String to(CurrencyCode userObject) {
        return userObject == null ? null : userObject.name();
    }

    @Override
    public Class<String> fromType() {
        return String.class;
    }

    @Override
    public Class<CurrencyCode> toType() {
        return CurrencyCode.class;
    }
}