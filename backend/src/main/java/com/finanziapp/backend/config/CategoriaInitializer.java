package com.finanziapp.backend.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.finanziapp.backend.entity.Categoria;
import com.finanziapp.backend.entity.TipoTransaccion;
import com.finanziapp.backend.repository.CategoriaRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CategoriaInitializer implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;

    @Override
    public void run(String... args) {
        if (categoriaRepository.count() == 0) {
            List<Categoria> categoriasIniciales = List.of(
                // Ingresos
                Categoria.builder().nombre("Salario").tipo(TipoTransaccion.INGRESO).build(),
                Categoria.builder().nombre("Ventas").tipo(TipoTransaccion.INGRESO).build(),
                Categoria.builder().nombre("Inversiones").tipo(TipoTransaccion.INGRESO).build(),
                Categoria.builder().nombre("Otros Ingresos").tipo(TipoTransaccion.INGRESO).build(),

                // Gastos
                Categoria.builder().nombre("Alimentación").tipo(TipoTransaccion.GASTO).build(),
                Categoria.builder().nombre("Vivienda / Arriendo").tipo(TipoTransaccion.GASTO).build(),
                Categoria.builder().nombre("Servicios Públicos").tipo(TipoTransaccion.GASTO).build(),
                Categoria.builder().nombre("Transporte").tipo(TipoTransaccion.GASTO).build(),
                Categoria.builder().nombre("Entretenimiento").tipo(TipoTransaccion.GASTO).build(),
                Categoria.builder().nombre("Salud").tipo(TipoTransaccion.GASTO).build(),
                Categoria.builder().nombre("Educación").tipo(TipoTransaccion.GASTO).build(),
                Categoria.builder().nombre("Otros Gastos").tipo(TipoTransaccion.GASTO).build()
            );

            categoriaRepository.saveAll(categoriasIniciales);
            System.out.println(">>> Categorías por defecto inicializadas con éxito.");
        }
    }
}