package com.finanziapp.backend.service;

import com.finanziapp.backend.dto.LoginRequest;
import com.finanziapp.backend.dto.RegisterRequest;
import com.finanziapp.backend.dto.AuthResponse;
import com.finanziapp.backend.entity.Usuario;
import com.finanziapp.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public AuthResponse registrar(RegisterRequest request) {
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new IllegalArgumentException("El correo ya se encuentra registrado.");
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .correo(request.getCorreo())
                .contrasena(request.getContrasena()) // NOTA: Más adelante integraremos Spring Security / BCrypt
                .build();

        Usuario guardado = usuarioRepository.save(usuario);

        return AuthResponse.builder()
                .message("Usuario registrado exitosamente")
                .idUsuario(guardado.getIdUsuario())
                .nombre(guardado.getNombre())
                .correo(guardado.getCorreo())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));

        if (!usuario.getContrasena().equals(request.getContrasena())) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }

        return AuthResponse.builder()
                .message("Inicio de sesión exitoso")
                .idUsuario(usuario.getIdUsuario())
                .nombre(usuario.getNombre())
                .correo(usuario.getCorreo())
                .build();
    }
}
