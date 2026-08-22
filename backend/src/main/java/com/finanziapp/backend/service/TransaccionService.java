package com.finanziapp.backend.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.finanziapp.backend.dto.BalanceResponse;
import com.finanziapp.backend.dto.TransaccionRequest;
import com.finanziapp.backend.entity.Categoria;
import com.finanziapp.backend.entity.Transaccion;
import com.finanziapp.backend.entity.Usuario;
import com.finanziapp.backend.repository.CategoriaRepository;
import com.finanziapp.backend.repository.TransaccionRepository;
import com.finanziapp.backend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransaccionService {

    private final TransaccionRepository transaccionRepository;
    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;

    public Transaccion registrarTransaccion(TransaccionRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        Categoria categoria = categoriaRepository.findById(request.getIdCategoria())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));

        Transaccion transaccion = Transaccion.builder()
                .monto(request.getMonto())
                .descripcion(request.getDescripcion())
                .fecha(request.getFecha())
                .usuario(usuario)
                .categoria(categoria)
                .build();

        return transaccionRepository.save(transaccion);
    }

    public List<Transaccion> obtenerPorUsuario(Long idUsuario) {
        return transaccionRepository.findByUsuarioIdUsuarioOrderByFechaDesc(idUsuario);
    }

    public BalanceResponse obtenerBalance(Long idUsuario) {
        BigDecimal ingresos = transaccionRepository.obtenerTotalIngresosPorUsuario(idUsuario);
        BigDecimal gastos = transaccionRepository.obtenerTotalGastosPorUsuario(idUsuario);

        if (ingresos == null) ingresos = BigDecimal.ZERO;
        if (gastos == null) gastos = BigDecimal.ZERO;

        BigDecimal balance = ingresos.subtract(gastos);

        return BalanceResponse.builder()
                .totalIngresos(ingresos)
                .totalGastos(gastos)
                .balanceTotal(balance)
                .build();
    }
}