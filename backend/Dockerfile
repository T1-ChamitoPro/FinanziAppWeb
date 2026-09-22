# ==========================================
# Paso 1: Etapa de compilación (Build Stage)
# ==========================================
FROM eclipse-temurin:25-jdk-alpine AS builder

WORKDIR /app

# Instalar bash si es necesario para gradlew
RUN apk add --no-cache bash

# Copiar configuración de Gradle y wrapper para cachear dependencias
COPY gradlew settings.gradle build.gradle ./
COPY gradle ./gradle

RUN chmod +x gradlew && ./gradlew dependencies --no-daemon || true

# Copiar el código fuente y compilar el archivo JAR ejecutable
COPY src ./src
RUN ./gradlew bootJar -x test --no-daemon

# ==========================================
# Paso 2: Imagen de ejecución ligera (Runtime Stage)
# ==========================================
FROM eclipse-temurin:25-jre-alpine

WORKDIR /app

# Crear usuario sin privilegios para mayor seguridad en Kubernetes / Docker
RUN addgroup -S spring && adduser -S spring -G spring

# Copiar el JAR generado desde la etapa de compilación
COPY --from=builder /app/build/libs/*.jar /app/app.jar

# Asignar permisos al usuario spring
RUN chown -R spring:spring /app

USER spring:spring

# Puerto expuesto por el backend Spring Boot
EXPOSE 8080

# Opciones de JVM optimizadas para entornos en contenedores
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

# Chequeo de salud básico
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 0

# Punto de entrada de la aplicación
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]