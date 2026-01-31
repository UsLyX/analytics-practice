package com.example.backend.config;

import com.example.backend.enums.NdsRate;
import org.jooq.Converter;

public class NdsRateConverter implements Converter<String, NdsRate> {
    @Override
    public NdsRate from(String databaseObject) {
        return databaseObject == null ? null : NdsRate.fromDisplayName(databaseObject);
    }

    @Override
    public String to(NdsRate userObject) {
        return userObject == null ? null : userObject.getDisplayName();
    }

    @Override
    public Class<String> fromType() {
        return String.class;
    }

    @Override
    public Class<NdsRate> toType() {
        return NdsRate.class;
    }
}