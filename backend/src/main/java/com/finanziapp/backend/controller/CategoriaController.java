package com.finanziapp.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.finanziapp.backend.entity.Categoria;
import com.finanziapp.backend.entity.TipoTransaccion;
import com.finanziapp.backend.repository.CategoriaRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;

    @GetMapping
    public ResponseEntity<List<Categoria>> obtenerTodas() {
        return ResponseEntity.ok(categoriaRepository.findAll());
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Categoria>> obtenerPorTipo(@PathVariable TipoTransaccion tipo) {
        return ResponseEntity.ok(categoriaRepository.findByTipo(tipo));
    }
}