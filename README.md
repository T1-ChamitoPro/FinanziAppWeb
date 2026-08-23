# FinanziApp 📊

**FinanziApp** es una plataforma web moderna e intuitiva para la gestión de finanzas personales. Diseñada con un enfoque panóptico en formato dark mode y layout panorámico, permite visualizar balances en tiempo real, rastrear transacciones por categoría, establecer límites presupuestarios y gestionar metas de ahorro de forma eficiente.

---

## 🚀 Características Principales

* **Autenticación de Usuarios:** Sistema de inicio de sesión y registro de usuarios con interfaz centrada y limpia.
* **Dashboard Panorámico:** Diseño adaptativo que aprovecha el 100% del ancho de la pantalla con visualizaciones claras.
* **Resumen Financiero en Tiempo Real:**
  * Tarjetas de **Ingresos Totales**, **Gastos Totales** y **Balance Disponible** (NET).
  * Código de colores intuitivo para un monitoreo de liquidez rápido.
* **Control de Presupuesto Mensual:**
  * Indicador de presupuesto activo con alertas de sobrecosto en caso de superar el límite configurado.
* **Módulo de Metas de Ahorro:**
  * Creación de objetivos específicos con seguimiento porcentual e indicadores de progreso visuales.
* **Análisis Gráfico:**
  * Gráficos interactivos de distribución de gastos por categoría e ingresos vs. gastos.
* **Gestión de Transacciones:**
  * Registro rápido de ingresos y egresos con asociación a categorías y descripciones opcionales.
  * Modales para la adición de categorías personalizadas en caliente.
* **Filtros Avanzados y Exportación:**
  * Búsqueda por descripción, tipo (Ingreso/Gasto) y categoría.
  * Exportación de historiales a formato CSV.

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** React, TypeScript, CSS3 (Custom Properties / Flexbox / CSS Grid)
* **Build Tool:** Vite
* **UI/Diseño:** Dark Mode temático personalizable (Inspirado en IDEs modernos)

---

## 📂 Estructura del Proyecto

```text
src/
├── components/
│   ├── FinanceCharts.tsx       # Gráficos de distribución e ingresos vs gastos
│   ├── MetasAhorro.tsx         # Módulo de objetivos financieros
│   ├── ModalCategoria.tsx      # Diálogo para crear nuevas categorías
│   └── PresupuestoBarra.tsx    # Indicador y alerta de presupuesto mensual
├── pages/
│   ├── Dashboard.tsx           # Vista principal de la aplicación (layout panorámico)
│   ├── Login.tsx               # Control de acceso de usuario
│   └── Register.tsx            # Registro de usuarios
├── index.css                   # Sistema global de estilos, variables y resets
└── main.tsx                    # Punto de entrada de la aplicación