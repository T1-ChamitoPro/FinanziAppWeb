package com.finanziapp.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.finanziapp.backend.dto.AuthResponse;
import com.finanziapp.backend.dto.RegisterRequest;
import com.finanziapp.backend.dto.TransaccionRequest;
import com.finanziapp.backend.entity.Categoria;
import com.finanziapp.backend.entity.Transaccion;
import com.finanziapp.backend.entity.Usuario;
import com.finanziapp.backend.repository.CategoriaRepository;
import com.finanziapp.backend.repository.TransaccionRepository;
import com.finanziapp.backend.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
class FinanziappServiceTest {

    // Mocks para UsuarioService
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @InjectMocks private UsuarioService usuarioService;

    // Mocks para TransaccionService
    @Mock private TransaccionRepository transaccionRepository;
    @Mock private CategoriaRepository categoriaRepository;
    @InjectMocks private TransaccionService transaccionService;

    private RegisterRequest registerRequest;
    private TransaccionRequest transaccionRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setNombre("Ana Gómez");
        registerRequest.setCorreo("ana@test.com");
        registerRequest.setContrasena("123456");

        transaccionRequest = new TransaccionRequest();
        transaccionRequest.setMonto(new BigDecimal("150000"));
        transaccionRequest.setDescripcion("Pago de arriendo");
        transaccionRequest.setFecha(LocalDate.of(2026, 8, 20));
        transaccionRequest.setIdUsuario(1L);
        transaccionRequest.setIdCategoria(2L);
    }

    // ==========================================
    // PRUEBAS DE USUARIO SERVICE
    // ==========================================

    @Test
    void CP01_usuario_registraUsuarioCuandoCorreoNoExiste() {
        when(usuarioRepository.existsByCorreo("ana@test.com")).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("HASH123");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> {
            Usuario u = inv.getArgument(0);
            u.setIdUsuario(1L);
            return u;
        });

        AuthResponse response = usuarioService.registrar(registerRequest);

        assertEquals("Usuario registrado exitosamente", response.getMessage());
        assertEquals(1L, response.getIdUsuario());
        verify(usuarioRepository).save(any(Usuario.class));
    }

    // PRUEBA FALLIDA / REGLA DE NEGOCIO: Correo duplicado
    @Test
    void CP02_usuario_lanzaExcepcionCuandoCorreoYaExiste() {
        when(usuarioRepository.existsByCorreo("ana@test.com")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> usuarioService.registrar(registerRequest));

        assertEquals("El correo ya se encuentra registrado.", ex.getMessage());
        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void CP03_usuario_encriptaLaContrasenaAntesDeGuardar() {
        when(usuarioRepository.existsByCorreo("ana@test.com")).thenReturn(false);
        when(passwordEncoder.encode("123456")).thenReturn("HASHED");
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(inv -> inv.getArgument(0));

        usuarioService.registrar(registerRequest);

        verify(passwordEncoder).encode("123456");
    }

    // ==========================================
    // PRUEBAS DE TRANSACCION SERVICE
    // ==========================================

    @Test
    void CP01_transaccion_registraTransaccionCuandoUsuarioYCategoriaExisten() {
        Usuario usuario = Usuario.builder().idUsuario(1L).nombre("Ana").build();
        Categoria categoria = Categoria.builder().idCategoria(2L).nombre("Vivienda").build();

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(categoriaRepository.findById(2L)).thenReturn(Optional.of(categoria));
        when(transaccionRepository.save(any(Transaccion.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        Transaccion resultado = transaccionService.registrarTransaccion(transaccionRequest);

        assertEquals(new BigDecimal("150000"), resultado.getMonto());
        verify(transaccionRepository).save(any(Transaccion.class));
    }

    // PRUEBA FALLIDA: Usuario no encontrado
    @Test
    void CP02_transaccion_lanzaExcepcionCuandoUsuarioNoExiste() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> transaccionService.registrarTransaccion(transaccionRequest));

        assertEquals("Usuario no encontrado", ex.getMessage());
        verify(categoriaRepository, never()).findById(any());
        verify(transaccionRepository, never()).save(any());
    }

    // PRUEBA FALLIDA: Categoría no encontrada
    @Test
    void CP03_transaccion_lanzaExcepcionКогдаCategoriaNoExiste() {
        Usuario usuario = Usuario.builder().idUsuario(1L).nombre("Ana").build();
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(categoriaRepository.findById(2L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> transaccionService.registrarTransaccion(transaccionRequest));

        assertEquals("Categoría no encontrada", ex.getMessage());
        verify(transaccionRepository, never()).save(any());
    }

    @Test
    void CP04_transaccion_aceptaMontoEnElLimiteSuperior() {
        transaccionRequest.setMonto(new BigDecimal("9999999999.99"));
        Usuario usuario = Usuario.builder().idUsuario(1L).build();
        Categoria categoria = Categoria.builder().idCategoria(2L).build();

        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(categoriaRepository.findById(2L)).thenReturn(Optional.of(categoria));
        when(transaccionRepository.save(any(Transaccion.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        Transaccion resultado = transaccionService.registrarTransaccion(transaccionRequest);

        assertEquals(new BigDecimal("9999999999.99"), resultado.getMonto());
    }
}