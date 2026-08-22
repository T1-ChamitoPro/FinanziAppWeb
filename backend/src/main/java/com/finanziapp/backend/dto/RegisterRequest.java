package com.finanziapp.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "El nombre no puede estar vacío")
    private String nombre;

    @Email(message = "Correo no válido")
    @NotBlank(message = "El correo no puede estar vacío")
    private String correo;

    @NotBlank(message = "La contraseña no puede estar vacía")
    private String contrasena;
}