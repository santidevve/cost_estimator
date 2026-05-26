# Requerimiento de Testeo - Sistema Estimador de Costos

Este documento establece el plan de pruebas y casos de verificación para validar que el Sistema Estimador de Costos funcione correctamente de acuerdo con las especificaciones técnicas y requerimientos del negocio.

---

## 1. Objetivos del Testeo

*   Validar el aislamiento de datos multiusuario (seguridad JWT).
*   Verificar la exactitud matemática de las conversiones de unidades y costos de porción.
*   Asegurar la persistencia de datos (ingredientes, recetas, gastos y simulaciones) en la base de datos Neon Postgres.
*   Confirmar que el simulador financiero compute la ganancia neta restando insumos y gastos operativos.
*   Probar la adaptabilidad en pantallas móviles y la viabilidad de instalación PWA en Android.

---

## 2. Entorno de Prueba

*   **Servidor de la API**: Node.js + Express (corriendo en `http://localhost:5000` o IP de red local).
*   **Base de Datos**: Neon Postgres (en la nube).
*   **Frontend**: React + Vite (corriendo en `http://localhost:5173`).
*   **Dispositivos de Prueba**:
    *   Computadora (Chrome / Firefox / Edge).
    *   Teléfono Android (Google Chrome, conectado a la misma red Wi-Fi).

---

## 3. Casos de Prueba (Matriz de Verificación)

### Caso de Prueba 1: Registro e Inicio de Sesión (Módulo Auth)
*   **Acción**:
    1.  Ir a la pantalla de inicio, hacer clic en "Registrate aquí" y registrar un nuevo usuario con un correo y una contraseña de 6 caracteres.
    2.  Cerrar la sesión con el botón superior derecho.
    3.  Intentar iniciar sesión con las credenciales creadas.
    4.  *(Opcional)* Registrar un segundo usuario y verificar que no pueda ver los datos cargados por el primer usuario.
*   **Resultado Esperado**:
    *   El registro crea el usuario y redirige al Dashboard de forma instantánea.
    *   El login funciona y mantiene la sesión activa en el teléfono (LocalStorage).
    *   Los datos de insumos y recetas de un usuario están completamente aislados y son inaccesibles para otros.

---

### Caso de Prueba 2: Catálogo de Insumos y Conversión de Granel
*   **Acción**:
    1.  En la pestaña **Insumos**, agregar un nuevo ingrediente: *Carne de Res* a un precio de `$1200.00` por `10` `kg`.
    2.  Abrir la "Calculadora Granel" dentro del modal.
    3.  Ingresar: Compra de `10 kg` a `$1200.00`, y porción usada de `150 g`. Dar clic en "Calcular Costo Porción".
    4.  Hacer clic en "Cargar en Insumo" y guardar el ingrediente.
*   **Resultado Esperado**:
    *   El insumo debe listarse mostrando un costo unitario calculado de `$120.0000 / kg`.
    *   La Calculadora Granel debe estimar un costo por porción de `150g` igual a `$18.000`.
    *   El ingrediente se persiste correctamente y permite ser buscado en la barra de filtros.

---

### Caso de Prueba 3: Ensamblado y Cálculo de Costo de Recetas
*   **Acción**:
    1.  En la pestaña **Recetas**, crear una receta llamada *Hamburguesa Clásica*.
    2.  Establecer un Costo Objetivo del `30.00%`.
    3.  Fijar un Precio de Venta manual de `$70.00`.
    4.  Añadir el ingrediente *Carne de Res* del catálogo con una porción de `150 g`.
    5.  Añadir otro ingrediente de prueba (ej. *Pan de Hamburguesa* a `$3.00` la unidad, usando `1 unidad`).
    6.  Observar el resumen de cálculos y guardar la receta.
*   **Resultado Esperado**:
    *   El costo total de la comida (COGS) para la receta debe ser `$21.00` (carne: `$18.00` + pan: `$3.00`).
    *   El precio sugerido al 30% debe indicar `$70.00` ($\$21.00 / 0.30$).
    *   El porcentaje de costo real calculado debe ser `30.0%` ($\$21.00 / \$70.00 \times 100$).
    *   Si se baja el precio de venta manual (ej. a `$50.00`), el indicador de Costo Real % debe subir a `42.0%` y cambiar visualmente a color rojo de advertencia (al superar la meta del 30%).

---

### Caso de Prueba 4: Registro y Normalización de Gastos Fijos (Overhead)
*   **Acción**:
    1.  En la pestaña **Gastos**, agregar *Renta del Local* por `$6000.00` al mes (`Mensual`).
    2.  Agregar *Sueldo Ayudante* por `$200.00` a la semana (`Semanal`).
    3.  Agregar *Gas del día* por `$30.00` al día (`Diario`).
*   **Resultado Esperado**:
    *   La app debe normalizar todos los gastos a mensual y diario.
    *   *Renta*: `$6000.00/mes` y `$200.00/día`.
    *   *Ayudante*: `$866.00/mes` (calculado como $200 \times 4.33$ semanas) y `$28.57/día` (calculado como $200 / 7$ días).
    *   *Gas*: `$900.00/mes` ($30 \times 30$) y `$30.00/día`.
    *   La tarjeta de resumen en la parte superior debe mostrar el total sumado de todos los gastos fijos mensuales normalizados.

---

### Caso de Prueba 5: Simulador de Ventas y Margen Neto
*   **Acción**:
    1.  En la pestaña **Simulador**, ingresar un volumen diario de ventas para la *Hamburguesa Clásica* de `20` unidades al día.
    2.  Hacer clic en "Guardar" para almacenar la simulación.
    3.  Ir a la pestaña **Inicio (Dashboard)** y observar las tarjetas de KPI.
*   **Resultado Esperado**:
    *   Con 20 hamburguesas al día:
        *   Ingreso mensual: `$42,000.00` ($20 \times \$70 \times 30$ días).
        *   Costo de alimentos mensual: `$12,600.00` ($20 \times \$21 \times 30$ días).
        *   Margen Bruto mensual: `$29,400.00`.
    *   El simulador financiero debe restar los Gastos Fijos totales mensuales (calculados en el Caso 4) del Margen Bruto mensual para dar la **Ganancia Neta Mensual**.
    *   La Ganancia Neta debe actualizarse y mostrarse correctamente en la tarjeta principal del **Dashboard** una vez guardada.

---

### Caso de Prueba 6: Experiencia Móvil e Instalación PWA
*   **Acción**:
    1.  Abrir la dirección local de la red desde un teléfono Android.
    2.  Verificar que la barra de navegación inferior quede fija, al alcance del pulgar, y que todo el contenido se ajuste correctamente a la pantalla sin necesidad de hacer zoom horizontal.
    3.  Presionar "Instalar aplicación" desde Chrome y abrirla desde el acceso directo del teléfono.
*   **Resultado Esperado**:
    *   Diseño responsivo móvil sin desborde horizontal.
    *   Navegación fluida y botones táctiles con tamaño adecuado para dedos.
    *   La aplicación PWA instalada se abre a pantalla completa (modo standalone) sin barra de direcciones del navegador.
