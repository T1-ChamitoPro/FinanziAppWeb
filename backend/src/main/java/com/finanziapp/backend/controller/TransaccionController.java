package com.finanziapp.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finanziapp.backend.dto.BalanceResponse;
import com.finanziapp.backend.dto.TransaccionRequest;
import com.finanziapp.backend.entity.Transaccion;
import com.finanziapp.backend.service.TransaccionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transacciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TransaccionController {

    private final TransaccionService transaccionService;

    @PostMapping
    public ResponseEntity<?> crearTransaccion(@Valid @RequestBody TransaccionRequest request) {
        try {
            Transaccion guardada = transaccionService.registrarTransaccion(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Transaccion>> obtenerTransacciones(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(transaccionService.obtenerPorUsuario(idUsuario));
    }

    @GetMapping("/balance/usuario/{idUsuario}")
    public ResponseEntity<BalanceResponse> obtenerBalance(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(transaccionService.obtenerBalance(idUsuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarTransaccion(@PathVariable Long id, @Valid @RequestBody TransaccionRequest request) {
        try {
            Transaccion actualizada = transaccionService.actualizarTransaccion(id, request);
            return ResponseEntity.ok(actualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarTransaccion(@PathVariable Long id) {
        try {
            transaccionService.eliminarTransaccion(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}