package com.example.backend.controllers;

import com.example.backend.dto.CustomerDTO;
import com.example.backend.services.CustomerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable Long id) {
        CustomerDTO customer = customerService.getCustomerById(id);
        return customer != null ? 
                ResponseEntity.ok(customer) : 
                ResponseEntity.notFound().build();
    }

    @GetMapping("/code/{customerCode}")
    public ResponseEntity<CustomerDTO> getCustomerByCode(@PathVariable String customerCode) {
        CustomerDTO customer = customerService.getCustomerByCode(customerCode);
        return customer != null ? 
                ResponseEntity.ok(customer) : 
                ResponseEntity.notFound().build();
    }

    @GetMapping("/type")
    public ResponseEntity<List<CustomerDTO>> getCustomersByType(
            @RequestParam(required = false) boolean organization,
            @RequestParam(required = false) boolean person) {
        return ResponseEntity.ok(customerService.getCustomersByType(organization, person));
    }

    @GetMapping("/parent/{parentCustomerCode}")
    public ResponseEntity<List<CustomerDTO>> getChildCustomers(@PathVariable String parentCustomerCode) {
        return ResponseEntity.ok(customerService.getChildCustomers(parentCustomerCode));
    }

    @PostMapping
    public ResponseEntity<CustomerDTO> createCustomer(@Valid @RequestBody CustomerDTO customerDTO) {
        CustomerDTO createdCustomer = customerService.createCustomer(customerDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCustomer);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CustomerDTO> patchCustomer(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        CustomerDTO updatedCustomer = customerService.patchCustomer(id, updates);
        return updatedCustomer != null ? 
                ResponseEntity.ok(updatedCustomer) : 
                ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        try {
            boolean deleted = customerService.deleteCustomer(id);
            return deleted ? 
                    ResponseEntity.noContent().build() : 
                    ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .header("X-Error-Message", e.getMessage())
                    .build();
        }
    }
}