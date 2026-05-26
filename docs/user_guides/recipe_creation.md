# User Guide: Recipe Creation, COGS, and Profit Margins

This guide explains how to design your menu items, calculate food cost per portion (COGS), establish suggested retail prices based on financial targets, and analyze your gross profit margins.

---

## 🍳 What is a Recipe?

In this application, a **recipe** represents a menu item sold to customers (e.g., a *Classic Cheeseburger*, a portion of *Medium French Fries*, or a *Special Combo Meal*). The system aggregates the proportional costs of all individual ingredients added to the recipe to determine the total food cost of the dish.

---

## 🖥️ Recipes Interface

Tap the **Recipes** tab (the chef hat icon `ChefHat`) to manage your menu items:

1. **Search Bar**: Quickly filter your recipes by typing their names.
2. **Add Button (+)**: Opens the modal to create a new dish.
3. **Recipe Card**: Displays a complete financial summary of the item:
   * **Dish Name**: Main title.
   * **Recipe Cost (COGS)**: What it costs you in raw ingredients to produce one portion.
   * **Sale Price**: The retail price you set for customers.
   * **Cost % (Actual Food Cost Percentage)**: The proportion of the retail price represented by the ingredients cost.
   * **Suggested Price**: The recommended retail price based on your target food cost percentage.
   * **Margin**: The gross profit (in cash) generated from each unit sold.
4. **Actions**: Edit (`Edit3`) or delete (`Trash2`) the recipe.

---

## 🛠️ Step-by-Step Recipe Design

Tap **Add Recipe** (or **Edit** on an existing card) to open the editor. Follow these steps to build your dish:

### 1. General Dish Information
* **Dish Name**: Enter the name as it appears on your menu (e.g., *Double Cheddar Burger*).
* **Target Cost (%)**: The ideal food cost percentage you want to maintain. The default is set to **30%** (a standard benchmark in the fast-food industry).
* **Sale Price ($)**: The retail price you plan to charge your customers (e.g., `12.00`).

### 2. Adding Ingredients (Assembling the Dish)
Under the **Assemble Recipe / Add Ingredients** section, add raw ingredients to your dish:
1. **Select Ingredient**: Click the dropdown. You will see all ingredients from your catalog along with their calculated unit costs.
2. **Enter Portion**: Enter the exact quantity used in a single portion of the dish (e.g., `150`).
3. **Select Portion Unit**: Ensure you select the correct unit:
   * grams (g)
   * kilograms (kg)
   * milliliters (mL)
   * liters (L)
   * ounces (oz)
   * units
4. Tap **"Add"**. The item will appear in the **Added Ingredients** list.

> [!NOTE]
> If you add an ingredient that is already on the list, the system will overwrite its previous quantity and recalculate the costs automatically.

### 3. Added Ingredients List
This section displays all the ingredients making up your dish, including their quantities and relative costs. If you need to remove an ingredient, tap the **Red Trash Icon** to delete it instantly.

---

## 📊 Financial Formulas and Calculations Panel

The **Calculations Panel** at the bottom of the editor updates in real time whenever you add an ingredient, modify the target cost, or change the manual sale price. The system uses the following calculations:

### 1. Cost of Goods Sold (COGS)
This represents the total raw food cost required to make one portion of the dish. It is the sum of the portion costs of all ingredients:
$$\text{COGS (Recipe Cost)} = \sum \text{Portion Cost of each Ingredient}$$

### 2. Suggested Sale Price
Calculates what you should charge customers to hit your desired **Target Cost (%)**:
$$\text{Suggested Price} = \frac{\text{COGS}}{\text{Target Cost (\%)} / 100}$$
*Example:* If a burger's COGS is \$3.60 and your target food cost is 30%, the suggested retail price is:
$$\text{Suggested Price} = \frac{3.60}{0.30} = \$12.00$$

### 3. Actual Food Cost Percentage (Actual Cost %)
Shows what percentage of your current retail price goes toward covering the ingredient costs:
$$\text{Actual Food Cost \%} = \left( \frac{\text{COGS}}{\text{Manual Sale Price}} \right) \times 100$$
*Example:* If your COGS is \$3.60 and you sell the item for \$10.00, your actual food cost percentage is 36%.

### 4. Gross Profit Margin
The profit remaining after covering ingredient costs. This cash margin is used to pay for fixed expenses and contribute to your net profit:
$$\text{Gross Profit Margin} = \text{Manual Sale Price} - \text{COGS}$$

---

## 🚦 Profitability Traffic Light

To help you make quick business decisions from your mobile device, the **Cost %** indicator on the recipe card changes color based on performance:

* 🟢 **Green (Profitable / Healthy)**: Activates when the **Actual Food Cost %** is lower than or equal to your **Target Cost %** (or under 35% on the main Dashboard). This indicates a healthy gross margin.
* 🔴 **Red (Alert / Low Margin)**: Activates when the **Actual Food Cost %** exceeds your **Target Cost %**. This means you are earning less profit per unit than planned.

> [!TIP]
> **What to do if a recipe shows a red indicator:**
> 1. Increase the **Sale Price** of the dish.
> 2. Reduce the **portion sizes** of high-cost ingredients (e.g., reducing the beef patty size from 180g to 150g).
> 3. Search for alternative suppliers to lower your bulk ingredient costs.
