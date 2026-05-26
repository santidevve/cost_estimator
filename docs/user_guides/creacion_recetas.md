# Guía de Usuario: Creación de Recetas, COGS y Margen de Ganancia

Esta guía explica detalladamente cómo diseñar las recetas de su menú, calcular el costo de los alimentos por porción (COGS), establecer precios sugeridos basados en objetivos financieros y analizar sus márgenes de ganancia bruta.

---

## 🍳 ¿Qué es una Receta en la Aplicación?

Una **receta** es la composición de insumos individuales dosificados por porciones específicas que dan vida a un platillo de venta al público (por ejemplo: una *Hamburguesa Clásica*, una porción de *Papas Fritas Medianas*, o un *Combo Especial*). El sistema suma automáticamente el costo de cada porción de insumo para determinar el costo de comida del platillo.

---

## 🖥️ Interfaz de Recetas

Al pulsar la pestaña **Recetas** (ícono de sombrero de chef `ChefHat`), accederá al módulo de recetas de su menú:

1. **Buscador**: Filtre sus recetas creadas instantáneamente escribiendo su nombre.
2. **Botón Agregar (+)**: Abre el modal para estructurar un nuevo platillo.
3. **Tarjeta de Receta**: Muestra un resumen financiero completo del platillo:
   * **Nombre del Platillo**: Título principal.
   * **Costo Receta (COGS)**: Lo que a usted le cuesta producirlo en ingredientes.
   * **Venta**: El precio de venta manual que ha establecido al público.
   * **Costo % (Porcentaje de Costo Real)**: Qué porcentaje del precio de venta representa el costo del plato.
   * **Precio Sugerido**: El precio de venta recomendado según el costo de comida objetivo seleccionado.
   * **Margen**: La ganancia bruta monetaria que obtiene por cada unidad vendida.
4. **Acciones**: Botones para editar (`Edit3`) o eliminar (`Trash2`) la receta.

---

## 🛠️ Diseñar y Armar una Receta Paso a Paso

Al presionar el botón **Agregar Receta** o **Editar**, se desplegará el editor de recetas. Siga esta secuencia para estructurar su platillo:

### 1. Información General del Platillo
* **Nombre del Platillo**: Escriba el nombre con el que se vende al cliente (ej. *Hamburguesa Especial con Queso*).
* **Costo Objetivo (%)**: El porcentaje ideal de costo que desea mantener para este tipo de comida. Por defecto es **30%** (estándar de la industria de comida rápida).
* **Precio de Venta ($)**: El precio real al que planea vender el platillo en su menú (ej. `120.00`).

### 2. Añadir Insumos (Armado del Plato)
Bajo la sección **Armar Receta / Añadir Insumos**, realice lo siguiente por cada ingrediente que lleve el platillo:
1. **Seleccionar Insumo**: Despliegue el selector. Aparecerán todos los insumos de su catálogo activo junto a su costo unitario calculado.
2. **Ingresar la Porción**: Escriba la cantidad exacta que lleva este platillo individual (ej. `150`).
3. **Seleccionar Unidad de Porción**: Asegúrese de elegir la unidad correcta:
   * gramos (g)
   * kilogramos (kg)
   * mililitros (mL)
   * litros (L)
   * onzas (oz)
   * unidades
4. Presione el botón **"Añadir"**. El insumo aparecerá en la lista de **Ingredientes Añadidos**.

> [!NOTE]
> Si añade un insumo que ya estaba en la lista, el sistema sobrescribirá su cantidad y recalculará el costo automáticamente con el nuevo valor.

### 3. Listado de Ingredientes Añadidos
En esta sección puede ver todos los elementos que componen el plato actual, mostrando la cantidad utilizada y el costo monetario proporcional. Si cometió un error o desea quitar un ingrediente, pulse el ícono de **Basurero Rojo** a la derecha del insumo para removerlo al instante.

---

## 📊 Fórmulas Financieras y Panel de Cálculos

En la parte inferior del editor, encontrará el **Panel de Cálculos**. Este se actualiza en tiempo real cada vez que introduce un ingrediente, cambia el costo objetivo o edita el precio de venta manual. Las fórmulas aplicadas son:

### 1. Costo Total de Alimentos (COGS)
Es el Costo de Mercancía Vendida (Cost of Goods Sold). Es la suma simple de los costos proporcionales de todos los ingredientes agregados al platillo.
$$\text{COGS (Costo Receta)} = \sum \text{Costo del Insumo por Porción}$$

### 2. Precio de Venta Sugerido
Indica a qué precio debería vender el platillo para cumplir con el **Costo Objetivo (%)** deseado.
$$\text{Precio Sugerido} = \frac{\text{COGS}}{\text{Costo Objetivo (\%)} / 100}$$
*Ejemplo:* Si el COGS de una hamburguesa es $36.00 y su objetivo es el 30%, el precio sugerido será:
$$\text{Precio Sugerido} = \frac{36.00}{0.30} = \$120.00$$

### 3. Porcentaje de Costo Real (Actual Food Cost %)
Le indica qué porcentaje real del precio de venta establecido representa el costo de los insumos.
$$\text{Porcentaje de Costo Real} = \left( \frac{\text{COGS}}{\text{Precio de Venta Manual}} \right) \times 100$$
*Ejemplo:* Si el COGS es $36.00 y lo vende a $100.00, su costo de alimentos real es del 36%.

### 4. Margen de Ganancia Bruta (Gross Profit Margin)
Es el dinero líquido disponible que queda después de descontar el costo de los insumos. Esta ganancia sirve para cubrir los gastos fijos y generar utilidad neta.
$$\text{Margen de Ganancia Bruta} = \text{Precio de Venta Manual} - \text{COGS}$$

---

## 🚦 Semáforo de Rentabilidad Visual

Para facilitar la toma rápida de decisiones desde el teléfono, el indicador de **Costo %** en la tarjeta de la receta cambia de color según las siguientes reglas:

* 🟢 **Verde (Rentable / Saludable)**: Se activa cuando el **Porcentaje de Costo Real** es menor o igual al **Costo Objetivo (%)** (o si es menor al 35% en el Dashboard principal). Esto indica que el margen bruto es excelente.
* 🔴 **Rojo (Alerta / Crítico)**: Se activa cuando el **Porcentaje de Costo Real** supera el **Costo Objetivo (%)**. Significa que está ganando menos de lo proyectado por unidad.

> [!TIP]
> **¿Qué hacer si una receta marca rojo?**
> 1. Incremente el **Precio de Venta** del platillo.
> 2. Disminuya la **porción** de los ingredientes más caros (ej. reducir la porción de carne de 180g a 150g).
> 3. Busque proveedores con mejores precios de compra a granel.
