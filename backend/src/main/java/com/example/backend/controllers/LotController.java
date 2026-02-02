package com.example.backend.controllers;

import com.example.backend.dto.LotDTO;
import com.example.backend.enums.CurrencyCode;
import com.example.backend.enums.NdsRate;
import com.example.backend.services.LotService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/lots")
@CrossOrigin(origins = "*")
public class LotController {

    @Autowired
    private LotService lotService;

    @GetMapping
    public ResponseEntity<List<LotDTO>> getAllLots() {
        return ResponseEntity.ok(lotService.getAllLots());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LotDTO> getLotById(@PathVariable Long id) {
        LotDTO lot = lotService.getLotById(id);
        return lot != null ? 
                ResponseEntity.ok(lot) : 
                ResponseEntity.notFound().build();
    }

    @GetMapping("/customer/{customerCode}")
    public ResponseEntity<List<LotDTO>> getLotsByCustomerCode(@PathVariable String customerCode) {
        return ResponseEntity.ok(lotService.getLotsByCustomerCode(customerCode));
    }

    @GetMapping("/currency/{currencyCode}")
    public ResponseEntity<List<LotDTO>> getLotsByCurrency(@PathVariable CurrencyCode currencyCode) {
        return ResponseEntity.ok(lotService.getLotsByCurrency(currencyCode));
    }

    @GetMapping("/nds/{ndsRate}")
    public ResponseEntity<List<LotDTO>> getLotsByNdsRate(@PathVariable NdsRate ndsRate) {
        return ResponseEntity.ok(lotService.getLotsByNdsRate(ndsRate));
    }

    @PostMapping
    public ResponseEntity<LotDTO> createLot(@Valid @RequestBody LotDTO lotDTO) {
        LotDTO createdLot = lotService.createLot(lotDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLot);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<LotDTO> patchLot(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        LotDTO updatedLot = lotService.patchLot(id, updates);
        return updatedLot != null ? 
                ResponseEntity.ok(updatedLot) : 
                ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLot(@PathVariable Long id) {
        boolean deleted = lotService.deleteLot(id);
        return deleted ? 
                ResponseEntity.noContent().build() : 
                ResponseEntity.notFound().build();
    }
}
