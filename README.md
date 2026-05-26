# Estimador de Costos para Comida Rápida (PWA)

Este proyecto es un sistema móvil-primero diseñado para ayudar a los dueños de pequeños negocios de comida rápida a calcular costos de recetas, márgenes de ganancia, costos fijos y proyecciones de volumen de ventas mensuales.

El sistema se compone de un cliente **React + Vite** y una API **Node.js + Express** respaldada por una base de datos **PostgreSQL**.

---

## Requisitos Previos

- **Node.js** (v18 o superior)
- **NPM** (v9 o superior)
- **PostgreSQL** (v13 o superior) instalado y corriendo en su máquina o en la nube.

---

## Configuración de la Base de Datos

1. Abra su gestor de bases de datos PostgreSQL (ej. pgAdmin, DBeaver, o la terminal `psql`).
2. Cree una base de datos vacía para la aplicación:
   ```sql
   CREATE DATABASE cost_estimator_db;
   ```
3. No es necesario crear tablas manualmente. El servidor backend creará las tablas automáticamente al conectarse por primera vez.

---

## Configuración y Ejecución del Backend

1. Navegue al directorio `backend/`:
   ```bash
   cd backend
   ```
2. Instale las dependencias de desarrollo y producción:
   ```bash
   npm install
   ```
3. Cree o modifique el archivo `.env` basado en `.env.example`. Asegúrese de ingresar sus credenciales correctas de PostgreSQL:
   ```env
   PORT=5000
   JWT_SECRET=tu_secreto_para_jwt
   
   # Conexión local por defecto
   PGHOST=localhost
   PGUSER=postgres
   PGPASSWORD=ingresa_tu_contraseña_aqui
   PGDATABASE=cost_estimator_db
   PGPORT=5432
   ```
4. Inicie el servidor de desarrollo del backend:
   ```bash
   npm run dev
   ```
   El servidor arrancará en `http://localhost:5000` y creará la base de datos de manera automática.

---

## Configuración y Ejecución del Frontend

1. Navegue al directorio `frontend/`:
   ```bash
   cd ../frontend
   ```
2. Instale las dependencias:
   ```bash
   npm install
   ```
3. Inicie el servidor de desarrollo del frontend:
   ```bash
   npm run dev
   ```
   Por defecto, Vite levantará el servicio en `http://localhost:5173`.

---

## Cómo Probar en su Teléfono Android (Red Local)

Dado que es una Aplicación Web Progresiva (PWA), puede instalarla directamente en su teléfono Android para usarla como una app nativa:

1. Conecte su computadora y su teléfono Android a la **misma red Wi-Fi**.
2. Al ejecutar `npm run dev` en el frontend, Vite mostrará una salida en la consola similar a:
   ```
   ➜  Local:   http://localhost:5173/
   ➜  Network: http://192.168.1.45:5173/
   ```
3. Abra el navegador **Google Chrome** en su teléfono Android y entre a la dirección de la red (`http://192.168.x.x:5173/`).
4. Para instalar la aplicación en su pantalla de inicio:
   - Toque el menú de tres puntos verticales en la esquina superior derecha de Chrome.
   - Seleccione la opción **"Agregar a la pantalla principal"** o **"Instalar aplicación"**.
   - ¡Listo! Se creará un ícono en su teléfono que abrirá la calculadora de costos a pantalla completa y sin barra de direcciones, como una app nativa.
