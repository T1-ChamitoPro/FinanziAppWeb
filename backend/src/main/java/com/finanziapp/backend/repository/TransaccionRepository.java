package com.finanziapp.backend.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.finanziapp.backend.entity.Transaccion;

public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {

    List<Transaccion> findByUsuarioIdUsuarioOrderByFechaDesc(Long idUsuario);

    @Query("SELECT SUM(t.monto) FROM Transaccion t WHERE t.usuario.idUsuario = :idUsuario AND t.categoria.tipo = 'INGRESO'")
    BigDecimal obtenerTotalIngresosPorUsuario(@Param("idUsuario") Long idUsuario);

    @Query("SELECT SUM(t.monto) FROM Transaccion t WHERE t.usuario.idUsuario = :idUsuario AND t.categoria.tipo = 'GASTO'")
    BigDecimal obtenerTotalGastosPorUsuario(@Param("idUsuario") Long idUsuario);
}
