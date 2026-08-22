package com.finanziapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String message;
    private Long idUsuario;
    private String nombre;
    private String correo;
}
