package com.example.backend.services;

import com.example.backend.dto.CustomerDTO;

import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.example.backend.jooq.tables.Customer.CUSTOMER;;

@Service
public class CustomerService {

    @Autowired
    private DSLContext dsl;

    public List<CustomerDTO> getAllCustomers() {
        return dsl.selectFrom(CUSTOMER)
                .orderBy(CUSTOMER.CUSTOMER_NAME.asc())
                .fetch()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CustomerDTO getCustomerById(Long id) {
        return dsl.selectFrom(CUSTOMER)
                .where(CUSTOMER.ID.eq(id))
                .fetchOptional()
                .map(this::mapToDTO)
                .orElse(null);
    }

    public CustomerDTO getCustomerByCode(String customerCode) {
        return dsl.selectFrom(CUSTOMER)
                .where(CUSTOMER.CUSTOMER_CODE.eq(customerCode))
                .fetchOptional()
                .map(this::mapToDTO)
                .orElse(null);
    }

    public List<CustomerDTO> getCustomersByType(boolean isOrganization, boolean isPerson) {
        return dsl.selectFrom(CUSTOMER)
                .where(CUSTOMER.IS_ORGANIZATION.eq(isOrganization)
                        .and(CUSTOMER.IS_PERSON.eq(isPerson)))
                .orderBy(CUSTOMER.CUSTOMER_NAME.asc())
                .fetch()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<CustomerDTO> getChildCustomers(String parentCustomerCode) {
        return dsl.selectFrom(CUSTOMER)
                .where(CUSTOMER.CUSTOMER_CODE_MAIN.eq(parentCustomerCode))
                .orderBy(CUSTOMER.CUSTOMER_NAME.asc())
                .fetch()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        // Проверяем уникальность кода
        boolean exists = dsl.selectCount()
                .from(CUSTOMER)
                .where(CUSTOMER.CUSTOMER_CODE.eq(customerDTO.getCustomerCode()))
                .fetchOne(0, int.class) > 0;
        
        if (exists) {
            throw new IllegalArgumentException("Customer with code " + customerDTO.getCustomerCode() + " already exists");
        }
        
        Long id = dsl.insertInto(CUSTOMER)
                .set(CUSTOMER.CUSTOMER_CODE, customerDTO.getCustomerCode())
                .set(CUSTOMER.CUSTOMER_NAME, customerDTO.getCustomerName())
                .set(CUSTOMER.CUSTOMER_INN, customerDTO.getCustomerInn())
                .set(CUSTOMER.CUSTOMER_KPP, customerDTO.getCustomerKpp())
                .set(CUSTOMER.CUSTOMER_LEGAL_ADDRESS, customerDTO.getCustomerLegalAddress())
                .set(CUSTOMER.CUSTOMER_POSTAL_ADDRESS, customerDTO.getCustomerPostalAddress())
                .set(CUSTOMER.CUSTOMER_EMAIL, customerDTO.getCustomerEmail())
                .set(CUSTOMER.CUSTOMER_CODE_MAIN, customerDTO.getCustomerCodeMain())
                .set(CUSTOMER.IS_ORGANIZATION, customerDTO.getIsOrganization())
                .set(CUSTOMER.IS_PERSON, customerDTO.getIsPerson())
                .returning(CUSTOMER.ID)
                .fetchOne()
                .getId();

        return getCustomerById(id);
    }

    @Transactional
public CustomerDTO patchCustomer(Long id, Map<String, Object> updates) {
    // Получаем существующего клиента
    CustomerDTO existing = getCustomerById(id);
    if (existing == null) {
        return null;
    }
    
    // Создаем новый DTO с текущими значениями
    CustomerDTO updateDTO = new CustomerDTO();
    
    // Копируем ВСЕ поля из существующего клиента
    updateDTO.setId(id);
    updateDTO.setCustomerCode(existing.getCustomerCode());
    updateDTO.setCustomerName(existing.getCustomerName());
    updateDTO.setCustomerInn(existing.getCustomerInn());
    updateDTO.setCustomerKpp(existing.getCustomerKpp());
    updateDTO.setCustomerLegalAddress(existing.getCustomerLegalAddress());
    updateDTO.setCustomerPostalAddress(existing.getCustomerPostalAddress());
    updateDTO.setCustomerEmail(existing.getCustomerEmail());
    updateDTO.setCustomerCodeMain(existing.getCustomerCodeMain());
    updateDTO.setIsOrganization(existing.getIsOrganization());
    updateDTO.setIsPerson(existing.getIsPerson());
    
    // Обновляем только те поля, которые пришли в updates
    if (updates.containsKey("customerName")) {
        updateDTO.setCustomerName((String) updates.get("customerName"));
    }
    if (updates.containsKey("customerInn")) {
        updateDTO.setCustomerInn((String) updates.get("customerInn"));
    }
    if (updates.containsKey("customerKpp")) {
        updateDTO.setCustomerKpp((String) updates.get("customerKpp"));
    }
    if (updates.containsKey("customerLegalAddress")) {
        updateDTO.setCustomerLegalAddress((String) updates.get("customerLegalAddress"));
    }
    if (updates.containsKey("customerPostalAddress")) {
        updateDTO.setCustomerPostalAddress((String) updates.get("customerPostalAddress"));
    }
    if (updates.containsKey("customerEmail")) {
        updateDTO.setCustomerEmail((String) updates.get("customerEmail"));
    }
    if (updates.containsKey("customerCodeMain")) {
        updateDTO.setCustomerCodeMain((String) updates.get("customerCodeMain"));
    }
    if (updates.containsKey("isOrganization")) {
        updateDTO.setIsOrganization((Boolean) updates.get("isOrganization"));
    }
    if (updates.containsKey("isPerson")) {
        updateDTO.setIsPerson((Boolean) updates.get("isPerson"));
    }
    
    // Используем существующий метод updateCustomer
    return updateCustomer(id, updateDTO);
}
    @Transactional
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        int updated = dsl.update(CUSTOMER)
                .set(CUSTOMER.CUSTOMER_NAME, customerDTO.getCustomerName())
                .set(CUSTOMER.CUSTOMER_INN, customerDTO.getCustomerInn())
                .set(CUSTOMER.CUSTOMER_KPP, customerDTO.getCustomerKpp())
                .set(CUSTOMER.CUSTOMER_LEGAL_ADDRESS, customerDTO.getCustomerLegalAddress())
                .set(CUSTOMER.CUSTOMER_POSTAL_ADDRESS, customerDTO.getCustomerPostalAddress())
                .set(CUSTOMER.CUSTOMER_EMAIL, customerDTO.getCustomerEmail())
                .set(CUSTOMER.CUSTOMER_CODE_MAIN, customerDTO.getCustomerCodeMain())
                .set(CUSTOMER.IS_ORGANIZATION, customerDTO.getIsOrganization())
                .set(CUSTOMER.IS_PERSON, customerDTO.getIsPerson())
                .set(CUSTOMER.UPDATED_AT, java.time.LocalDateTime.now())
                .where(CUSTOMER.ID.eq(id))
                .execute();

        if (updated > 0) {
            return getCustomerById(id);
        }
        return null;
    }

    @Transactional
    public boolean deleteCustomer(Long id) {
        // Проверяем, есть ли зависимые лоты
        boolean hasLots = dsl.selectCount()
                .from(com.example.backend.jooq.Tables.LOT)
                .where(com.example.backend.jooq.Tables.LOT.CUSTOMER_CODE.eq(
                    dsl.select(CUSTOMER.CUSTOMER_CODE)
                            .from(CUSTOMER)
                            .where(CUSTOMER.ID.eq(id))
                ))
                .fetchOne(0, int.class) > 0;
        
        if (hasLots) {
            throw new IllegalStateException("Cannot delete customer with existing lots");
        }
        
        int deleted = dsl.deleteFrom(CUSTOMER)
                .where(CUSTOMER.ID.eq(id))
                .execute();
        return deleted > 0;
    }

    private CustomerDTO mapToDTO(org.jooq.Record record) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(record.get(CUSTOMER.ID));
        dto.setCustomerCode(record.get(CUSTOMER.CUSTOMER_CODE));
        dto.setCustomerName(record.get(CUSTOMER.CUSTOMER_NAME));
        dto.setCustomerInn(record.get(CUSTOMER.CUSTOMER_INN));
        dto.setCustomerKpp(record.get(CUSTOMER.CUSTOMER_KPP));
        dto.setCustomerLegalAddress(record.get(CUSTOMER.CUSTOMER_LEGAL_ADDRESS));
        dto.setCustomerPostalAddress(record.get(CUSTOMER.CUSTOMER_POSTAL_ADDRESS));
        dto.setCustomerEmail(record.get(CUSTOMER.CUSTOMER_EMAIL));
        dto.setCustomerCodeMain(record.get(CUSTOMER.CUSTOMER_CODE_MAIN));
        dto.setIsOrganization(record.get(CUSTOMER.IS_ORGANIZATION));
        dto.setIsPerson(record.get(CUSTOMER.IS_PERSON));
        dto.setCreatedAt(record.get(CUSTOMER.CREATED_AT));
        dto.setUpdatedAt(record.get(CUSTOMER.UPDATED_AT));
        return dto;
    }
}