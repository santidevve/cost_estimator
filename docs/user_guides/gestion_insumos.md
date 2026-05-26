# Guía de Usuario: Gestión de Insumos y Calculadora de Porciones

Esta guía le enseñará cómo dar de alta, editar y eliminar las materias primas (insumos) de su negocio de comida rápida. Además, detalla el uso de la calculadora integrada para convertir precios a granel en costos exactos por porción.

---

## 📦 ¿Qué es un Insumo?

En esta aplicación, un **insumo** representa cualquier ingrediente o material que compra a granel para la elaboración de sus platillos (por ejemplo: un costal de 20 kg de harina, una caja de 100 unidades de panes para hamburguesa, o un bidón de 5 L de aceite).

---

## 🖥️ Interfaz de Gestión de Insumos

Al seleccionar la pestaña **Insumos** (ícono de corazón dentro de una carpeta `FolderHeart`), accederá al listado de ingredientes.

1. **Buscador Dinámico**: Ubicado en la parte superior. Escriba cualquier letra o palabra y la lista se filtrará en tiempo real por el nombre del insumo.
2. **Botón Agregar (+)**: Botón principal en color naranja a la derecha del buscador. Abre el modal para registrar un nuevo ingrediente.
3. **Tarjetas de Insumos**: Cada tarjeta representa un ingrediente y muestra:
   * Nombre del insumo en negritas.
   * Detalles de compra: Precio total pagado y cantidad/unidad registrada.
   * **Costo Calculado por Unidad**: Destacado en color primario, muestra cuánto cuesta exactamente una sola unidad base (por ejemplo, el precio de 1 gramo o 1 mililitro), lo cual es crucial para las recetas.
4. **Acciones**:
   * Icono de **Lápiz (`Edit3`)**: Abre el modal con la información del insumo cargada para su modificación.
   * Icono de **Basurero (`Trash2`)**: Elimina permanentemente el insumo.

> [!WARNING]
> Si elimina un insumo que está siendo utilizado en alguna receta activa, el cálculo de costo de esa receta podría verse afectado o dar error. Asegúrese de removerlo de sus recetas antes de eliminarlo del catálogo.

---

## ➕ Agregar o Editar un Insumo

Al presionar el botón **Agregar (+)** o el ícono de **Editar**, se desplegará un formulario con los siguientes campos:

* **Nombre del Insumo**: Sea específico (ej. *Carne de Res 80/20*, *Queso Cheddar Rebanado*, *Mayonesa McC*).
* **Precio Compra ($)**: El costo total de la factura o ticket de compra.
* **Cantidad Compra**: El número de unidades físicas adquiridas (soporta decimales, ej: `1.5` o `0.5`).
* **Unidad de Compra**: Lista desplegable con opciones predefinidas:
  * Kilogramo (kg)
  * Gramo (g)
  * Litro (L)
  * Mililitro (mL)
  * Libra (lb)
  * Onza (oz)
  * Unidad / Pieza (para insumos contables unitarios como panes, empaques, etc.)

---

## 🧮 Calculadora de Granel a Porciones Integrada

Ingresar los datos de compra a granel a veces requiere cálculos previos (por ejemplo, si compra una caja de 24 libras de carne y quiere saber cuánto cuesta una porción de 150 gramos). Para resolver esto sin salir del formulario, use la **Calculadora de Granel a Porciones**.

> [!TIP]
> Toque el botón **"Abrir Calculadora Granel"** dentro del formulario del insumo para desplegar esta herramienta matemática.

### Campos de la Calculadora:
1. **Cantidad de Compra**: La cantidad total a granel que viene en el empaque (ej. `20`).
2. **Unidad Compra**: Seleccione entre `kg`, `lb`, `litro` o `unidad`.
3. **Precio de Compra Total ($)**: El precio total pagado por ese paquete a granel (ej. `80.00`).
4. **Porción Usada en Receta**: La cantidad que estima usar para una porción individual (ej. `150`).
5. **Unidad Porción**: Seleccione entre `g`, `oz`, `ml` o `unidad`.

### Ejecutar y Cargar:
* Presione **"Calcular Costo Porción"**: Mostrará el costo neto de esa porción individual en una caja de alerta punteada.
* Presione **"Cargar en Insumo"**: Copiará automáticamente los datos de *Precio de Compra*, *Cantidad de Compra* y *Unidad de Compra* a los campos principales del formulario de insumos, evitándole tener que digitarlos manualmente.

---

## 📐 Lógica de Conversión Matemática (Bajo el Capó)

La aplicación normaliza internamente todas las medidas a tres tipos de dimensiones base para calcular costos con precisión decimal exacta:

### Tabla de Normalización de Unidades
| Unidad del Sistema | Categoría | Valor Base Relativo |
| :--- | :---: | :--- |
| **g**, **gr**, **gramo(s)** | Peso | 1 gramo (Base) |
| **kg**, **kilo(s)**, **kilogramo(s)** | Peso | 1,000 gramos |
| **lb**, **libra(s)** | Peso | 453.592 gramos |
| **oz**, **onza(s)** | Peso | 28.349 gramos |
| **ml**, **mililitro(s)** | Volumen | 1 mililitro (Base) |
| **l**, **lt**, **litro(s)** | Volumen | 1,000 mililitros |
| **gal**, **galón(es)** | Volumen | 3,785.41 mililitros |
| **oz_fl**, **onza(s) fluida(s)** | Volumen | 29.573 mililitros |
| **unidad(es)**, **pieza(s)**, **caja(s)**, **pack(s)** | Conteo | 1 unidad (Base) |

### Algoritmo de Cálculo del Costo de Porción

Cuando la aplicación detecta que la unidad de compra y la unidad de porción pertenecen a la **misma categoría** (por ejemplo, ambas son de peso, como comprar en `kg` y porcionar en `g`), realiza lo siguiente:

1. Convierte la cantidad de compra a su equivalente base (ejemplo: $3\text{ kg} \times 1000 = 3000\text{ g}$).
2. Convierte la porción utilizada a su equivalente base (ejemplo: $150\text{ g} \times 1 = 150\text{ g}$).
3. Obtiene el costo por unidad base dividiendo el precio entre el peso total base:
   $$\text{Costo por Gramo} = \frac{\text{Precio Compra}}{\text{Cantidad Compra Base}}$$
4. Multiplica la porción base por el costo por unidad base:
   $$\text{Costo Final Porción} = \text{Porción Base} \times \text{Costo por Gramo}$$

> [!NOTE]
> **Fórmula de Respaldo (Fallback):**
> Si las unidades ingresadas no son compatibles entre sí (por ejemplo, compra en unidades y quiere costear en gramos), el sistema aplica una proporción aritmética directa:
> $$\text{Costo} = \text{Cantidad Utilizada} \times \left( \frac{\text{Precio Compra}}{\text{Cantidad Compra}} \right)$$
