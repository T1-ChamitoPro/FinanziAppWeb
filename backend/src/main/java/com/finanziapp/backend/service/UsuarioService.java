package com.finanziapp.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.finanziapp.backend.dto.AuthResponse;
import com.finanziapp.backend.dto.LoginRequest;
import com.finanziapp.backend.dto.RegisterRequest;
import com.finanziapp.backend.entity.Usuario;
import com.finanziapp.backend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder; // Inyectamos el encriptador

    public AuthResponse registrar(RegisterRequest request) {
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new IllegalArgumentException("El correo ya se encuentra registrado.");
        }

        // Hasheamos la contraseña con BCrypt antes de guardar
        String contrasenaEncriptada = passwordEncoder.encode(request.getContrasena());

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .correo(request.getCorreo())
                .contrasena(contrasenaEncriptada)
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

        // Comparamos el texto plano entrante contra el hash de la base de datos
        if (!passwordEncoder.matches(request.getContrasena(), usuario.getContrasena())) {
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