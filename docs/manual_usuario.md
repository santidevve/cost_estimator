# Manual de Usuario - Estimador de Costos para Comida Rápida

¡Bienvenido al **Estimador de Costos**! Este sistema móvil-primero está diseñado para ayudarle a tomar el control financiero de su negocio de comida rápida de una manera simple, intuitiva y profesional. 

Con esta aplicación podrá calcular el costo exacto de sus platillos (hamburguesas, combos, papas, etc.), fijar precios de venta que garanticen ganancias, registrar sus gastos operativos (renta, sueldos, servicios) y simular sus ingresos mensuales netos basados en el volumen de ventas diarias.

---

## Índice
1. [Primeros Pasos e Instalación en Teléfono Android (PWA)](#1-primeros-pasos-e-instalación-en-teléfono-android-pwa)
2. [Gestión de Insumos (Materia Prima)](#2-gestión-de-insumos-materia-prima)
3. [Creación de Recetas (Costeo de Menú)](#3-creación-de-recetas-costeo-de-menú)
4. [Control de Gastos Operativos Fijos](#4-control-de-gastos-operativos-fijos)
5. [Simulación de Ventas y Proyecciones de Ganancia](#5-simulación-de-ventas-y-proyecciones-de-ganancia)
6. [Dashboard (Resumen Ejecutivo de Rendimiento)](#6-dashboard-resumen-ejecutivo-de-rendimiento)

---

## 1. Primeros Pasos e Instalación en Teléfono Android (PWA)

La aplicación está diseñada bajo el estándar de **Aplicación Web Progresiva (PWA)**. Esto significa que puede usarla en el navegador de su computadora o instalarla en su teléfono celular para que funcione como una aplicación nativa.

### Cómo instalarla en su teléfono Android:
1. Asegúrese de que su teléfono y su computadora estén conectados a la **misma red Wi-Fi**.
2. Abra el navegador **Google Chrome** en su teléfono.
3. Ingrese la dirección IP de red local que le proporciona su consola al iniciar el frontend (por ejemplo, `http://192.168.1.45:5173/`).
4. Una vez cargada la página, presione el menú de **tres puntos verticales** de Chrome (esquina superior derecha).
5. Seleccione la opción **"Instalar aplicación"** o **"Agregar a la pantalla principal"**.
6. Confirme la instalación. Aparecerá un ícono con forma de hamburguesa (🍔) en el escritorio de su celular. Al abrirlo, la app se mostrará a pantalla completa sin barras de navegación del navegador web.

### Registro e Inicio de Sesión:
*   **Crear Cuenta**: En la pantalla inicial, pulse en **"¿No tienes cuenta? Registrate aquí"**, ingrese su correo electrónico, el nombre de su negocio y una contraseña (mínimo 6 caracteres). Presione **"Registrar Negocio"**.
*   **Iniciar Sesión**: Ingrese sus credenciales de acceso y presione **"Iniciar Sesión"**. Su sesión permanecerá guardada de forma segura para que no tenga que loguearse cada vez que abra la aplicación.
*   **Cerrar Sesión**: Si desea salir, presione el botón de cierre de sesión (puerta roja/flecha) ubicado en la esquina superior derecha de la barra de cabecera.

---

## 2. Gestión de Insumos (Materia Prima)

Antes de costear sus recetas, debe registrar los insumos o materias primas que compra a sus proveedores.

### Crear un Insumo:
1. Vaya a la pestaña **Insumos** (ícono de carpeta corazón) en la barra de navegación inferior.
2. Presione el botón **"+"** (esquina superior derecha).
3. Complete los campos del formulario:
    *   **Nombre del Insumo**: Sea específico (ej. *Carne de Res 80/20*, *Queso Cheddar rebanado*, *Aceite de canola*).
    *   **Precio Compra ($)**: Lo que le cuesta el empaque o bulto cerrado (ej. `$150.00`).
    *   **Cantidad Compra**: El peso, volumen o unidades que contiene el empaque (ej. `$2.5` de un paquete de 2.5 kg).
    *   **Unidad de Compra**: Seleccione la unidad del empaque (kilogramos, gramos, litros, mililitros, libras, onzas o unidades).
4. Presione **Crear Insumo**.

### Calculadora / Conversor de Granel Integrado:
Si compra sus insumos en unidades grandes (ej. bultos de harina de 25 kg o cajas de queso de 20 lbs) pero los utiliza en porciones pequeñas (ej. gramos u onzas), el sistema incluye una calculadora integrada en el modal:
1. Al crear o editar un insumo, presione **"Abrir Calculadora Granel"**.
2. Rellene los campos con la información de su proveedor (ej. Caja de queso cheddar de `20` `lb` por `$80.00`).
3. Rellene la porción que usa normalmente (ej. `1.5` `oz`).
4. Pulse **"Calcular Costo Porción"**: Verá de inmediato que esa porción exacta le cuesta `$0.375`.
5. Si está de acuerdo, pulse **"Cargar en Insumo"** y los datos de compra se rellenarán automáticamente en el formulario principal.

---

## 3. Creación de Recetas (Costeo de Menú)

En esta pestaña diseñará sus hamburguesas, papas fritas, bebidas o combos, combinando los insumos cargados y calculando el costo exacto de producción (COGS).

### Crear una Receta:
1. Vaya a la pestaña **Recetas** (ícono de sombrero de chef).
2. Presione el botón **"+"**.
3. Ingrese los datos principales:
    *   **Nombre del Platillo**: Nombre comercial (ej. *Cheeseburger Clásica*).
    *   **Costo Objetivo (%)**: El porcentaje ideal de costo que desea mantener (el estándar en comida rápida es 30%).
    *   **Precio de Venta ($)**: El precio al que planea vender el plato al público (ej. `$85.00`).
4. **Añadir Insumos al Platillo**:
    *   En el panel "Armar Receta", elija un insumo del menú desplegable.
    *   Ingrese la cantidad de porción exacta que lleva el platillo (ej. `150` si usa 150 gramos de carne).
    *   Seleccione la unidad de la porción (ej. gramos `g`).
    *   Presione **"Añadir"**. El ingrediente se listará abajo mostrando su costo calculado.
5. Repita para todos los ingredientes del platillo (incluyendo aderezos, pan, vegetales y empaques desechables).
6. Presione **Crear Receta**.

### Cómo interpretar los resultados de la receta:
En la pantalla principal de Recetas o dentro del editor verá un cuadro de resumen:
*   **Costo Total de Alimentos (COGS)**: Lo que le cuesta fabricar el platillo (ej. `$25.50`).
*   **Precio de Venta Sugerido**: El precio recomendado al que debería vender el plato para cumplir con su porcentaje objetivo.
*   **Porcentaje de Costo Real**: Qué tan eficiente es su precio actual. Si su costo real supera la meta (ej. 38% vs 30% meta), el número se mostrará en **rojo** para alertarle que debe subir el precio de venta o reducir porciones. Si está en su meta o por debajo, se mostrará en **verde** (rentable).
*   **Margen de Ganancia Bruta**: El dinero líquido que le queda por cada venta individual una vez restado el costo de los alimentos.

---

## 4. Control de Gastos Operativos Fijos

Para saber si su negocio es realmente rentable, no basta con saber cuánto le cuesta la comida; también debe cubrir sus costos operativos mensuales (gastos fijos).

### Registrar un Gasto Fijo:
1. Vaya a la pestaña **Gastos** (ícono de recibo de pago).
2. Presione **"Agregar Gasto"**.
3. Ingrese:
    *   **Nombre**: Concepto claro (ej. *Alquiler del local*, *Sueldo de cajero*, *Luz del mes*, *Gas diario*).
    *   **Monto ($)**: El valor monetario del gasto.
    *   **Frecuencia**: Seleccione si paga este monto de manera **Mensual**, **Semanal** o **Diaria**.
4. Presione **Crear Gasto**.

### Normalización de Gastos:
El sistema unifica automáticamente todos los gastos a su equivalente diario y mensual. Por ejemplo:
*   Si ingresa una renta de `$6,000.00` mensual, el sistema calcula un costo diario de `$200.00`.
*   Si paga `$200.00` semanales a un ayudante, el sistema calcula un costo mensual consolidado de `$866.00` ($200 \times 4.33$ semanas promedio por mes) y `$28.57` diarios.

La tarjeta superior en esta pestaña le mostrará la suma total de gastos fijos mensuales y diarios que su negocio debe generar para comenzar a registrar ganancias netas (su punto de equilibrio).

---

## 5. Simulación de Ventas y Proyecciones de Ganancia

El **Simulador** (pestaña de gráfica de tendencia) le permite ingresar proyecciones estimadas de ventas diarias de cada platillo del menú para calcular la rentabilidad consolidada de su negocio.

### Cómo realizar una simulación:
1. Vaya a la pestaña **Simulador**.
2. En cada platillo del menú, ingrese la cantidad aproximada de unidades que vende al día (ej. `25` Cheeseburgers, `15` Papas Fritas).
3. Presione el botón **"Guardar"**.
4. Revise el panel de resumen superior en tiempo real:
    *   **Ingresos Brutos**: Ventas totales esperadas en el mes.
    *   **Costo de Alimentos**: Gasto en compra de ingredientes para cubrir esas ventas.
    *   **Gastos Fijos Local**: Sumatoria de todos los costos operativos de su pestaña de Gastos.
    *   **Ganancia Neta**: El dinero neto que realmente le queda en el bolsillo a fin de mes. Si el valor es positivo, se mostrará en **verde** (negocio rentable). Si es negativo, se mostrará en **rojo** (está perdiendo dinero).

---

## 6. Dashboard (Resumen Ejecutivo de Rendimiento)

La pestaña **Inicio** (ícono de tablero) recopila los datos más importantes de su negocio en una sola pantalla:

*   **Rentabilidad Mensual**: Muestra su ganancia neta proyectada basada en la última simulación que guardó.
*   **Costo de Alimentos Ponderado**: El porcentaje de costo promedio de todo su menú.
*   **Gastos Fijos**: El total mensual que debe pagar para operar.
*   **Catálogo Activo**: Conteo rápido de sus insumos y recetas registradas.
*   **Consejos Inteligentes**: El sistema analiza sus números de forma automatizada y le proporciona alertas si su porcentaje de costo de comida promedio es demasiado alto o si necesita ajustar precios para maximizar sus beneficios.
