# Guía de Usuario: Gestión de Gastos Fijos (Costos Operativos)

Esta guía detalla cómo registrar y administrar los costos fijos (gastos operativos o *overhead*) de su negocio de comida rápida (como la renta, sueldos, gas y luz) para poder proyectar utilidades netas reales.

---

## 🏛️ Costos de Alimentos (Variables) vs. Gastos Fijos (Operativos)

Para tener un negocio saludable, es fundamental entender la diferencia entre ambos tipos de egresos:

* **Costo de Alimentos (Variable / COGS)**: Depende directamente de las ventas. Si vende una hamburguesa, gasta en pan, carne y aderezos. Si no vende nada, este costo es cero.
* **Gastos Fijos (Operativos / Overhead)**: No dependen del volumen de ventas. Venda 1 o 1,000 hamburguesas, tendrá que pagar el alquiler del local, los servicios públicos y los sueldos del personal al finalizar el período.

Esta sección de la aplicación le permite centralizar todos estos gastos indirectos para calcular la cuota diaria y mensual de mantenimiento de su local.

---

## 🖥️ Interfaz de Gastos Fijos

Al tocar la pestaña **Gastos** (ícono de ticket de recibo `Receipt`), ingresará al panel de costos fijos:

1. **Tarjeta Resumen de Gastos**: Ubicada en la parte superior, muestra de forma consolidada:
   * **Gastos Mensuales**: Suma total de todos los gastos fijos normalizados a un mes (30 días).
   * **Gastos Diarios**: El costo promedio diario que cuesta mantener el negocio abierto.
2. **Botón Agregar Gasto**: Abre el modal para dar de alta un nuevo costo.
3. **Listado de Gastos**: Muestra cada concepto registrado con su monto original, frecuencia, y la equivalencia mensualizada y diaria correspondiente.
4. **Acciones**: Botón de edición (`Edit3`) y de eliminación (`Trash2`).

---

## ➕ Agregar o Editar un Gasto Fijo

Al presionar el botón **Agregar Gasto**, complete los siguientes campos:

* **Nombre del Gasto**: Sea específico con los conceptos (ej. *Renta del Local*, *Sueldo del Cocinero*, *Gas LP*, *Internet y Teléfono*, *Luz y Agua*).
* **Monto ($)**: La cantidad monetaria facturada por dicho período (ej. `12000.00`).
* **Frecuencia de Pago**: La periodicidad con la que se efectúa este gasto. Seleccione una de las siguientes opciones:
  * **Mensual** (por ejemplo: la renta o la nómina).
  * **Semanal** (por ejemplo: pagos de insumos de empaque fijos o jornales).
  * **Diario** (por ejemplo: hielo diario, transporte de recolección de basura).

---

## 📐 Fórmulas de Normalización y Equivalencia (Bajo el Capó)

Para sumar manzanas con manzanas, el sistema convierte todos los costos a la misma escala temporal. El servidor calcula los equivalentes mensuales y diarios automáticamente dependiendo de la frecuencia seleccionada:

### Tabla de Conversión de Frecuencias
| Frecuencia Seleccionada | Equivalencia Mensual ($/mes) | Equivalencia Diaria ($/día) |
| :--- | :--- | :--- |
| 🗓️ **Mensual** | $$\text{Monto}$$ | $$\frac{\text{Monto}}{30}$$ |
| 📅 **Semanal** | $$\text{Monto} \times 4.33$$ | $$\frac{\text{Monto}}{7}$$ |
| ☀️ **Diario** | $$\text{Monto} \times 30$$ | $$\text{Monto}$$ |

> [!NOTE]
> La aplicación utiliza el estándar de **4.33 semanas por mes** para los cálculos semanales. Esto responde a que la mayoría de los meses tienen un poco más de 4 semanas completas ($52\text{ semanas al año} / 12\text{ meses} = 4.33$).

### Ejemplos Prácticos de Conversión:
* **Ejemplo 1 (Renta Mensual):** Monto = $9,000 mensual.
  * Equivalente Mensual = $9,000.00.
  * Equivalente Diario = $\frac{9,000.00}{30} = \$300.00$ diarios.
* **Ejemplo 2 (Sueldo Semanal):** Monto = $2,000 semanal.
  * Equivalente Mensual = $2,000.00 \times 4.33 = \$8,660.00$ al mes.
  * Equivalente Diario = $\frac{2,000.00}{7} = \$285.71$ diarios.
* **Ejemplo 3 (Hielo Diario):** Monto = $50 diario.
  * Equivalente Mensual = $50.00 \times 30 = \$1,500.00$ al mes.
  * Equivalente Diario = $50.00 diarios.

---

## 💡 Consejos de Registro
> [!TIP]
> * **Sueldos Propios:** No olvide registrar su propio salario como un gasto fijo mensual. Muchos dueños de negocio omiten pagarse a sí mismos, distorsionando la rentabilidad real de la empresa.
> * **Gastos Variables de Servicios:** Para servicios como luz o agua que llegan bimestralmente, sume los últimos tres recibos, divídalos entre seis para obtener un promedio mensual estimado, y regístrelo con frecuencia "Mensual".
