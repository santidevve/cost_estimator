# Guía del Desarrollador - Cost Estimator System

Este documento describe la arquitectura interna, el esquema de datos y el flujo de procesamiento de la aplicación.

---

## Arquitectura de la Aplicación

La aplicación se estructura bajo un enfoque de desacoplamiento de servicios (Frontend PWA y API Backend):

```
+---------------------------------------+
|          Cliente React (PWA)          |
+---------------------------------------+
                    |
                    | Peticiones HTTP REST + JWT (Puerto 5000)
                    v
+---------------------------------------+
|        Servidor Express (API)         |
+---------------------------------------+
                    |
                    | Conector PostgreSQL (pg Pool)
                    v
+---------------------------------------+
|        Base de Datos PostgreSQL       |
+---------------------------------------+
```

---

## Esquema de Base de Datos y Relaciones

El sistema utiliza UUIDs generados en Node.js mediante `crypto.randomUUID()` para asegurar identificadores universales únicos. A continuación se detallan las tablas y su función:

1. **`users`**: Almacena las cuentas registradas. Las contraseñas se cifran mediante `bcryptjs`. Todas las demás tablas contienen una relación `user_id` para garantizar que la información de cada negocio sea completamente privada.
2. **`ingredients`**: Catálogo de insumos básicos comprados en volumen (ej. Bulto de harina de 25kg a $450.00).
3. **`recipes`**: Platillos de comida rápida ofrecidos en el menú (ej. Hamburguesa).
4. **`recipe_ingredients`**: Tabla asociativa muchos-a-muchos que define qué ingredientes integran una receta, la porción y su unidad de medida.
5. **`overheads`**: Gastos operativos mensuales o periódicos (ej. Sueldos, renta, luz).
6. **`sales_forecasts`**: Guarda el volumen de ventas proyectado de cada receta para alimentar el simulador de ganancias netas.

---

## Fórmulas de Costeo Clave

### 1. Costo por Ingrediente Individual en una Receta
Para calcular el costo de una porción específica (ej. 150 gramos de carne) proveniente de una compra a granel (ej. 10 kilogramos por $900), se normalizan ambas unidades a la misma escala física y se efectúa la proporción:

$$\text{Costo Porción} = \text{Cantidad Utilizada (Base)} \times \left( \frac{\text{Precio de Compra}}{\text{Cantidad Comprada (Base)}} \right)$$

Las equivalencias de conversión física se gestionan en `src/pages/helper.ts` (Frontend) y `src/controllers/recipeController.ts` (Backend) usando un mapa de conversión estático para peso (`g`, `kg`, `lb`, `oz`), volumen (`ml`, `l`, `oz_fl`, `gal`) y conteo directo (`unidad`).

### 2. Costo Total de Alimentos (COGS) por Platillo
Es la sumatoria del costo individual de todas sus porciones de ingredientes:

$$\text{Costo Total Receta} = \sum (\text{Costo Porción}_i)$$

### 3. Margen de Ganancia de Platillo
El margen bruto monetario obtenido al vender una porción individual:

$$\text{Margen Bruto} = \text{Precio de Venta} - \text{Costo Total Receta}$$

### 4. Porcentaje de Costo de Comida Real
Es la fracción del precio de venta que representa el costo de los insumos (se recomienda mantenerlo entre 28% y 32% para negocios de comida rápida):

$$\text{Costo Real \%} = \left( \frac{\text{Costo Total Receta}}{\text{Precio de Venta}} \right) \times 100$$

### 5. Precio de Venta Sugerido
Basado en un Costo Objetivo (ej. 30%), sugiere a qué precio se debe vender el platillo:

$$\text{Precio Sugerido} = \frac{\text{Costo Total Receta}}{\left( \frac{\text{Costo Objetivo \%}}{100} \right)}$$

### 6. Simulación de Ganancia Neta Mensual
Calcula la rentabilidad final del negocio restando los gastos fijos mensuales:

$$\text{Ganancia Neta} = \left[ \sum (\text{Ventas Diarias Plato}_j \times \text{Margen Bruto}_j) \times 30 \right] - \text{Gasto Operativo Mensual}$$

---

## Seguridad y Autenticación

- **JWT (JSON Web Tokens)**: El controlador `authController.ts` firma un JWT que contiene `{ userId, email }` con vigencia de 30 días al registrarse o iniciar sesión.
- **Middleware de Protección**: La función `authenticateToken` en `src/middleware/auth.ts` decodifica y verifica el token de la cabecera `Authorization: Bearer <token>`, inyectando el `user` en el objeto Request de Express para que los controladores filtren los datos por `user_id`.
