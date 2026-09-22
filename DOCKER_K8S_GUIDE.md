# 🐳 Guía Completa de Dockerización y Kubernetes para FinanziAppWeb 🚀

Esta guía contiene las instrucciones detalladas paso a paso para compilar, empaquetar, ejecutar en local mediante **Docker Compose** y desplegar en un clúster de **Kubernetes (K8s)** la aplicación **FinanziAppWeb**.

---

## 📐 Arquitectura de Contenedores

La plataforma se divide en 3 servicios desacoplados:

1. **`postgres`**: Base de datos relacional PostgreSQL 17 Alpine con almacenamiento persistente.
2. **`backend`**: API REST en Spring Boot 4.1.0 + Java 25 (OpenJDK Temurin), empaquetada mediante compilación multi-stage y ejecutada con un usuario seguro sin privilegios (`spring`).
3. **`frontend`**: Interfaz de usuario Single Page Application (SPA) en React 19 + Vite + TypeScript, compilada y servida con un servidor Nginx 1.27 Alpine de alto rendimiento con enrutamiento SPA y compresión Gzip.

---

## ⚡ Opción 1: Ejecución Rápida con Docker Compose (Recomendado para Desarrollo Local)

Docker Compose te permite levantar toda la pila (PostgreSQL, Backend y Frontend) con un solo comando.

### 1. Variables de Entorno (Opcional)
Puedes revisar o personalizar las variables en el archivo `.env.example` o crear tu `.env`:
```bash
cp .env.example .env
```

### 2. Construir y Levantar los Contenedores
Ejecuta en la raíz del proyecto:
```bash
docker compose up --build -d
```

### 3. Verificar el Estado de los Servicios
```bash
docker compose ps
```

### 4. Acceso a la Aplicación
- 🌐 **Frontend (Web):** [http://localhost](http://localhost) o [http://localhost:3000](http://localhost:3000)
- ⚙️ **Backend API:** [http://localhost:8080/api](http://localhost:8080/api)
- 🗄️ **Base de Datos PostgreSQL:** `localhost:5432` (Base de datos: `finanziapp_db`, Usuario: `postgres`, Contraseña: `postgres`)

### 5. Ver Logs en Tiempo Real
```bash
# Todos los servicios
docker compose logs -f

# Solo Backend
docker compose logs -f backend

# Solo Frontend
docker compose logs -f frontend
```

### 6. Detener los Contenedores
```bash
# Detener y mantener datos
docker compose down

# Detener y borrar volúmenes de base de datos
docker compose down -v
```

---

## ☸️ Opción 2: Despliegue en Kubernetes (K8s)

Los manifiestos de Kubernetes se encuentran organizados en el directorio `/k8s`.

### 1. Construir y Etiquetar las Imágenes Docker

Antes de desplegar en Kubernetes, debes compilar las imágenes Docker:

#### Frontend:
```bash
# Desde la carpeta FinanziAppWeb/frontend
docker build -t finanziapp-frontend:latest .

# Si vas a usar Docker Hub o un registry remoto:
# docker tag finanziapp-frontend:latest <tu-usuario-dockerhub>/finanziapp-frontend:latest
# docker push <tu-usuario-dockerhub>/finanziapp-frontend:latest
```

#### Backend:
```bash
# Desde la carpeta FinanziAppWeb/backend
docker build -t finanziapp-backend:latest .

# Si vas a usar Docker Hub o un registry remoto:
# docker tag finanziapp-backend:latest <tu-usuario-dockerhub>/finanziapp-backend:latest
# docker push <tu-usuario-dockerhub>/finanziapp-backend:latest
```

> **Nota para Minikube:** Si usas Minikube local, puedes construir las imágenes directamente en el daemon de Minikube sin subirlas a un registry:
> ```bash
> minikube image build -t finanziapp-frontend:latest ./FinanziAppWeb/frontend
> minikube image build -t finanziapp-backend:latest ./FinanziAppWeb/backend
> ```
> O apuntar tu terminal al Docker daemon de Minikube:
> `& minikube -p minikube docker-env --shell powershell | Invoke-Expression` (PowerShell) o `eval $(minikube docker-env)` (Bash).

---

### 2. Desplegar en el Clúster con Kustomize

Puedes aplicar toda la infraestructura con **un solo comando**:

```bash
kubectl apply -k FinanziAppWeb/k8s/
```

O si estás dentro de la carpeta `FinanziAppWeb`:
```bash
kubectl apply -k k8s/
```

Esto creará:
- ✅ Namespace `finanziapp`
- ✅ PostgreSQL: PersistentVolumeClaim (5Gi), Secret, ConfigMap, Deployment y Service ClusterIP
- ✅ Backend: ConfigMap, Secret, Deployment (2 réplicas con Probes) y Service ClusterIP
- ✅ Frontend: ConfigMap, Deployment (2 réplicas con Probes) y Service ClusterIP
- ✅ Ingress Controller Routing

---

### 3. Verificar el Despliegue en Kubernetes

```bash
# Ver todos los recursos en el namespace finanziapp
kubectl get all -n finanziapp

# Ver pods con estado detallado
kubectl get pods -n finanziapp -w

# Ver almacenamiento persistente
kubectl get pvc -n finanziapp
```

---

### 4. Acceso Local a los Servicios en Kubernetes

#### Método A: Port-Forwarding (Más directo para pruebas)

Para acceder al Frontend:
```bash
kubectl port-forward svc/frontend-service 8080:80 -n finanziapp
```
*(Abre [http://localhost:8080](http://localhost:8080))*

Para acceder al Backend API:
```bash
kubectl port-forward svc/backend-service 8081:8080 -n finanziapp
```
*(Abre [http://localhost:8081/api](http://localhost:8081/api))*

Para acceder a PostgreSQL:
```bash
kubectl port-forward svc/postgres-service 5433:5432 -n finanziapp
```

#### Método B: Mediante Ingress Controller (Minikube / Nginx Ingress)

Si usas Minikube:
```bash
minikube addons enable ingress
minikube tunnel
```
Podrás acceder a través de las rutas definidas en `k8s/ingress.yaml`:
- `/` -> Frontend React
- `/api` -> Backend API

#### Método C: Cambiar Service a NodePort o LoadBalancer
En `k8s/frontend/frontend-service.yaml`, cambia `type: ClusterIP` por `type: NodePort` o `type: LoadBalancer`.

---

### 5. Inspección y Depuración en Kubernetes

```bash
# Ver logs del backend
kubectl logs -l app=backend -n finanziapp -f

# Ver logs del frontend
kubectl logs -l app=frontend -n finanziapp -f

# Ver logs de la base de datos
kubectl logs -l app=postgres -n finanziapp -f

# Describir un pod si tiene problemas (ej. CrashLoopBackOff)
kubectl describe pod <nombre-del-pod> -n finanziapp

# Abrir una terminal interactiva dentro del pod de backend
kubectl exec -it deployment/backend-deployment -n finanziapp -- /bin/sh
```

---

### 6. Eliminar el Despliegue de Kubernetes

Para limpiar todos los recursos creados:
```bash
kubectl delete -k FinanziAppWeb/k8s/
```
O eliminar el namespace completo:
```bash
kubectl delete namespace finanziapp
```

---

## 🛡️ Buenas Prácticas Aplicadas

1. **Multi-Stage Builds**: Imágenes reducidas al mínimo tamaño sin herramientas de compilación en tiempo de ejecución.
2. **Ejecución No-Root**: El backend corre bajo el usuario `spring:spring` mitigando vulnerabilidades de escalado de privilegios en el nodo de Kubernetes.
3. **Health Probes**: Configuración de `livenessProbe`, `readinessProbe` y `startupProbe` para que Kubernetes gestione reinicios y balanceo de tráfico de forma automática y segura.
4. **Almacenamiento Persistente**: `PersistentVolumeClaim` para garantizar que la información de PostgreSQL no se pierda al reiniciar o reubicar pods.
5. **Configuración Desacoplada**: Secretos y variables de configuración separados en `Secrets` y `ConfigMaps`.
6. **Optimización Nginx**: Compresión Gzip, caché inmutable de bundles Vite con hash y manejo de rutas SPA con `try_files`.
