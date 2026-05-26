# User Guide: Ingredients Management and Portion Calculator

This guide covers how to add, edit, and delete raw materials (ingredients) for your fast-food business. It also details how to use the built-in portion calculator to convert bulk purchase prices into precise individual portion costs.

---

## 📦 What is an Ingredient?

In this application, an **ingredient** represents any raw material or item purchased in bulk to prepare your menu offerings. Examples include a 20 kg sack of flour, a box of 100 hamburger buns, or a 5 L container of frying oil.

---

## 🖥️ Ingredients Management Interface

Tap the **Ingredients** tab (the folder with a heart icon `FolderHeart`) to open the ingredients catalog.

1. **Dynamic Search Bar**: Located at the top. Type any letter or word to filter the list of ingredients in real time.
2. **Add Button (+)**: The orange button next to the search bar. Tapping it opens the modal to register a new ingredient.
3. **Ingredient Cards**: Each card displays key information about a registered ingredient:
   * **Ingredient Name**: Highlighted in bold.
   * **Purchase Details**: Shows the total price paid and the registered quantity/unit of purchase.
   * **Calculated Cost per Unit**: Highlighted in the primary theme color. This displays the exact cost of a single base unit (e.g., the cost of 1 gram or 1 milliliter), which is used to calculate recipe costs.
4. **Actions**:
   * **Edit Icon (`Edit3`)**: Opens the modal filled with the ingredient's current data for modifications.
   * **Delete Icon (`Trash2`)**: Permanently removes the ingredient from your catalog.

> [!WARNING]
> Deleting an ingredient that is currently active in one or more recipes will affect the cost calculations of those recipes and may cause errors. Make sure to remove the ingredient from your recipes before deleting it from your catalog.

---

## ➕ Adding or Editing an Ingredient

When you tap the **Add (+)** button or the **Edit** icon, a form opens with the following fields:

* **Ingredient Name**: Be specific (e.g., *Beef Patty 80/20*, *Sliced Cheddar Cheese*, *Mayonnaise Heinz*).
* **Purchase Price ($)**: The total cost shown on your invoice or receipt.
* **Purchase Quantity**: The amount of product purchased (supports decimals, e.g., `1.5` or `0.5`).
* **Purchase Unit**: A dropdown selector with pre-defined units:
  * Kilogram (kg)
  * Gram (g)
  * Liter (L)
  * Milliliter (mL)
  * Pound (lb)
  * Ounce (oz)
  * Unit / Piece (for countable items like buns, packaging boxes, etc.)

---

## 🧮 Built-In Bulk-to-Portion Calculator

Calculating portion costs manually can be tedious (for example, if you buy a 24-pound box of beef patties and need to know the cost of a 150-gram portion). To solve this directly within the creation form, use the **Bulk-to-Portion Calculator**.

> [!TIP]
> Tap the **"Open Bulk Calculator"** button inside the ingredient form to expand this mathematical tool.

### Calculator Fields:
1. **Purchase Quantity**: The total bulk quantity in the packaging (e.g., `20`).
2. **Purchase Unit**: Select from `kg`, `lb`, `liter`, or `unit`.
3. **Total Purchase Price ($)**: The total price paid for the bulk package (e.g., `80.00`).
4. **Portion Used in Recipe**: The amount you estimate using for an individual portion (e.g., `150`).
5. **Portion Unit**: Select from `g`, `oz`, `ml`, or `unit`.

### Operations:
* **"Calculate Portion Cost"**: Displays the net cost of that single portion in a dashed border alert box.
* **"Load into Ingredient"**: Automatically copies the *Purchase Price*, *Purchase Quantity*, and *Purchase Unit* values into the main fields of the ingredient form, eliminating manual typing.

---

## 📐 Unit Conversion & Mathematical Logic (Under the Hood)

To ensure accurate calculations, the system normalizes all physical measurements into three base dimensions:

### Unit Normalization Table
| System Unit | Category | Relative Base Value |
| :--- | :---: | :--- |
| **g**, **gr**, **gram(s)** | Weight | 1 gram (Base Unit) |
| **kg**, **kilo(s)**, **kilogram(s)** | Weight | 1,000 grams |
| **lb**, **pound(s)** | Weight | 453.592 grams |
| **oz**, **ounce(s)** | Weight | 28.349 grams |
| **ml**, **milliliter(s)** | Volume | 1 milliliter (Base Unit) |
| **l**, **lt**, **liter(s)** | Volume | 1,000 milliliters |
| **gal**, **gallon(s)** | Volume | 3,785.41 milliliters |
| **oz_fl**, **fluid ounce(s)** | Volume | 29.573 milliliters |
| **unit(s)**, **piece(s)**, **box(es)**, **pack(s)** | Count | 1 unit (Base Unit) |

### Portion Cost Calculation Algorithm

When the application detects that the purchase unit and the portion unit belong to the **same category** (for example, both are weight units, like purchasing in `kg` and portioning in `g`), it executes the following steps:

1. Converts the purchase quantity to its equivalent base unit value:
   $$\text{Purchase Quantity (Base)} = \text{Purchase Quantity} \times \text{Conversion Factor}$$
   *Example: $3\text{ kg} \times 1,000 = 3,000\text{ g}$*
2. Converts the recipe portion quantity to its equivalent base unit value:
   $$\text{Portion (Base)} = \text{Portion} \times \text{Conversion Factor}$$
   *Example: $150\text{ g} \times 1 = 150\text{ g}$*
3. Calculates the cost per base unit by dividing the total purchase price by the base purchase quantity:
   $$\text{Cost per Base Unit} = \frac{\text{Purchase Price}}{\text{Purchase Quantity (Base)}}$$
   *Example: $\frac{\$30.00}{3,000\text{ g}} = \$0.01\text{ per gram}$*
4. Multiplies the portion base quantity by the cost per base unit:
   $$\text{Final Portion Cost} = \text{Portion (Base)} \times \text{Cost per Base Unit}$$
   *Example: $150\text{ g} \times \$0.01 = \$1.50$*

> [!NOTE]
> **Fallback Formula:**
> If the units entered belong to incompatible categories (for example, if you purchase by count `units` and try to portion by weight `grams`), the system applies a direct arithmetic proportion:
> $$\text{Cost} = \text{Portion Quantity} \times \left( \frac{\text{Purchase Price}}{\text{Purchase Quantity}} \right)$$
