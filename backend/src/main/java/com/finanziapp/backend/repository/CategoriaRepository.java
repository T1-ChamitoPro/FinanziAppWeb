package com.finanziapp.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.finanziapp.backend.entity.Categoria;
import com.finanziapp.backend.entity.TipoTransaccion;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    List<Categoria> findByTipo(TipoTransaccion tipo);
}