package com.example.backend.services;

import com.example.backend.dto.LotDTO;
import com.example.backend.enums.CurrencyCode;
import com.example.backend.enums.NdsRate;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.example.backend.jooq.tables.Customer.CUSTOMER;
import static com.example.backend.jooq.tables.Lot.LOT;


@Service
public class LotService {

    @Autowired
    private DSLContext dsl;

    public List<LotDTO> getAllLots() {
        return dsl.select()
                .from(LOT)
                .join(CUSTOMER).on(LOT.CUSTOMER_CODE.eq(CUSTOMER.CUSTOMER_CODE))
                .orderBy(LOT.CREATED_AT.desc())
                .fetch()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public LotDTO getLotById(Long id) {
        return dsl.select()
                .from(LOT)
                .join(CUSTOMER).on(LOT.CUSTOMER_CODE.eq(CUSTOMER.CUSTOMER_CODE))
                .where(LOT.ID.eq(id))
                .fetchOptional()
                .map(this::mapToDTO)
                .orElse(null);
    }

    public List<LotDTO> getLotsByCustomerCode(String customerCode) {
        return dsl.select()
                .from(LOT)
                .join(CUSTOMER).on(LOT.CUSTOMER_CODE.eq(CUSTOMER.CUSTOMER_CODE))
                .where(LOT.CUSTOMER_CODE.eq(customerCode))
                .orderBy(LOT.CREATED_AT.desc())
                .fetch()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<LotDTO> getLotsByCurrency(CurrencyCode currencyCode) {
        return dsl.select()
                .from(LOT)
                .join(CUSTOMER).on(LOT.CUSTOMER_CODE.eq(CUSTOMER.CUSTOMER_CODE))
                .where(LOT.CURRENCY_CODE.eq(currencyCode.name()))
                .orderBy(LOT.CREATED_AT.desc())
                .fetch()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<LotDTO> getLotsByNdsRate(NdsRate ndsRate) {
        return dsl.select()
                .from(LOT)
                .join(CUSTOMER).on(LOT.CUSTOMER_CODE.eq(CUSTOMER.CUSTOMER_CODE))
                .where(LOT.NDS_RATE.eq(ndsRate.getDisplayName()))
                .orderBy(LOT.CREATED_AT.desc())
                .fetch()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public LotDTO createLot(LotDTO lotDTO) {
        // Проверяем существование контрагента
        boolean customerExists = dsl.selectCount()
                .from(CUSTOMER)
                .where(CUSTOMER.CUSTOMER_CODE.eq(lotDTO.getCustomerCode()))
                .fetchOne(0, int.class) > 0;
        
        if (!customerExists) {
            throw new IllegalArgumentException("Customer with code " + lotDTO.getCustomerCode() + " not found");
        }
        
        Long id = dsl.insertInto(LOT)
                .set(LOT.LOT_NAME, lotDTO.getLotName())
                .set(LOT.CUSTOMER_CODE, lotDTO.getCustomerCode())
                .set(LOT.PRICE, lotDTO.getPrice())
                .set(LOT.CURRENCY_CODE, lotDTO.getCurrencyCode().name())
                .set(LOT.NDS_RATE, lotDTO.getNdsRate().getDisplayName())
                .set(LOT.PLACE_DELIVERY, lotDTO.getPlaceDelivery())
                .set(LOT.DATE_DELIVERY, lotDTO.getDateDelivery())
                .returning(LOT.ID)
                .fetchOne()
                .getId();

        return getLotById(id);
    }

    @Transactional
    public LotDTO updateLot(Long id, LotDTO lotDTO) {
        // Проверяем существование контрагента при обновлении
        if (lotDTO.getCustomerCode() != null) {
            boolean customerExists = dsl.selectCount()
                    .from(CUSTOMER)
                    .where(CUSTOMER.CUSTOMER_CODE.eq(lotDTO.getCustomerCode()))
                    .fetchOne(0, int.class) > 0;
            
            if (!customerExists) {
                throw new IllegalArgumentException("Customer with code " + lotDTO.getCustomerCode() + " not found");
            }
        }
        
        int updated = dsl.update(LOT)
                .set(LOT.LOT_NAME, lotDTO.getLotName())
                .set(LOT.CUSTOMER_CODE, lotDTO.getCustomerCode())
                .set(LOT.PRICE, lotDTO.getPrice())
                .set(LOT.CURRENCY_CODE, lotDTO.getCurrencyCode().name())
                .set(LOT.NDS_RATE, lotDTO.getNdsRate().getDisplayName())
                .set(LOT.PLACE_DELIVERY, lotDTO.getPlaceDelivery())
                .set(LOT.DATE_DELIVERY, lotDTO.getDateDelivery())
                .set(LOT.UPDATED_AT, java.time.LocalDateTime.now())
                .where(LOT.ID.eq(id))
                .execute();

        if (updated > 0) {
            return getLotById(id);
        }
        return null;
    }

    @Transactional
public LotDTO patchLot(Long id, Map<String, Object> updates) {
    // Получаем существующий лот
    LotDTO existing = getLotById(id);
    if (existing == null) {
        return null;
    }
    
    // Если нет обновлений
    if (updates == null || updates.isEmpty()) {
        return existing;
    }
    
    // Создаем DTO с текущими значениями
    LotDTO updateDTO = new LotDTO();
    updateDTO.setId(id);
    
    // Копируем все поля
    updateDTO.setLotName(existing.getLotName());
    updateDTO.setCustomerCode(existing.getCustomerCode());
    updateDTO.setPrice(existing.getPrice());
    updateDTO.setCurrencyCode(existing.getCurrencyCode());
    updateDTO.setNdsRate(existing.getNdsRate());
    updateDTO.setPlaceDelivery(existing.getPlaceDelivery());
    updateDTO.setDateDelivery(existing.getDateDelivery());
    
    // Обновляем только переданные поля
    if (updates.containsKey("lotName")) {
        updateDTO.setLotName((String) updates.get("lotName"));
    }
    if (updates.containsKey("customerCode")) {
        String customerCode = (String) updates.get("customerCode");
        if (customerCode != null) {
            // Проверяем существование контрагента
            boolean customerExists = dsl.selectCount()
                    .from(CUSTOMER)
                    .where(CUSTOMER.CUSTOMER_CODE.eq(customerCode))
                    .fetchOne(0, int.class) > 0;
            
            if (!customerExists) {
                throw new IllegalArgumentException("Customer with code " + customerCode + " not found");
            }
            updateDTO.setCustomerCode(customerCode);
        }
    }
    if (updates.containsKey("price")) {
        Object priceObj = updates.get("price");
        if (priceObj != null) {
            BigDecimal price = priceObj instanceof BigDecimal ? 
                    (BigDecimal) priceObj : new BigDecimal(priceObj.toString());
            updateDTO.setPrice(price);
        }
    }
    if (updates.containsKey("currencyCode")) {
        String currencyStr = (String) updates.get("currencyCode");
        if (currencyStr != null) {
            try {
                updateDTO.setCurrencyCode(CurrencyCode.valueOf(currencyStr));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid currency code: " + currencyStr);
            }
        }
    }
    if (updates.containsKey("ndsRate")) {
        String ndsRateStr = (String) updates.get("ndsRate");
        if (ndsRateStr != null) {
            try {
                updateDTO.setNdsRate(NdsRate.fromDisplayName(ndsRateStr));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid NDS rate: " + ndsRateStr);
            }
        }
    }
    if (updates.containsKey("placeDelivery")) {
        updateDTO.setPlaceDelivery((String) updates.get("placeDelivery"));
    }
    if (updates.containsKey("dateDelivery")) {
        Object dateObj = updates.get("dateDelivery");
        if (dateObj != null) {
            LocalDateTime date = dateObj instanceof LocalDateTime ? 
                    (LocalDateTime) dateObj : LocalDateTime.parse(dateObj.toString());
            updateDTO.setDateDelivery(date);
        }
    }
    
    return updateLot(id, updateDTO);
}

    @Transactional
    public boolean deleteLot(Long id) {
        int deleted = dsl.deleteFrom(LOT)
                .where(LOT.ID.eq(id))
                .execute();
        return deleted > 0;
    }

    private LotDTO mapToDTO(org.jooq.Record record) {
        LotDTO dto = new LotDTO();
        dto.setId(record.get(LOT.ID));
        dto.setLotName(record.get(LOT.LOT_NAME));
        dto.setCustomerCode(record.get(LOT.CUSTOMER_CODE));
        dto.setPrice(record.get(LOT.PRICE));
        dto.setCurrencyCode(CurrencyCode.valueOf(record.get(LOT.CURRENCY_CODE)));
        dto.setNdsRate(NdsRate.fromDisplayName(record.get(LOT.NDS_RATE)));
        dto.setPlaceDelivery(record.get(LOT.PLACE_DELIVERY));
        dto.setDateDelivery(record.get(LOT.DATE_DELIVERY));
        dto.setCreatedAt(record.get(LOT.CREATED_AT));
        dto.setUpdatedAt(record.get(LOT.UPDATED_AT));
        return dto;
    }
}