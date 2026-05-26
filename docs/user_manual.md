# User Manual - Fast Food Cost Estimator

Welcome to the **Fast Food Cost Estimator**! This mobile-first system is designed to help you take full financial control of your fast-food small business. 

With this application, you can calculate the exact cost to make each recipe, set selling prices that guarantee profitability, record fixed operational expenses (rent, utilities, wages), and simulate your final monthly net profits based on estimated daily sales.

---

## Table of Contents
1. [Getting Started & Android PWA Installation](#1-getting-started--android-pwa-installation)
2. [Managing Ingredients (Inventory & Unit Pricing)](#2-managing-ingredients-inventory--unit-pricing)
3. [Compiling Recipes (Menu Costing)](#3-compiling-recipes-menu-costing)
4. [Managing Operational Overhead (Fixed Costs)](#4-managing-operational-overhead-fixed-costs)
5. [Sales Forecasting & Profit Simulation](#5-sales-forecasting--profit-simulation)
6. [Dashboard Analysis (Business KPIs)](#6-dashboard-analysis-business-kpis)

---

## 1. Getting Started & Android PWA Installation

The application is built as a **Progressive Web App (PWA)**, which means you can open it on your PC's browser or install it directly onto your mobile phone to use it as a native app.

### How to Install it on Your Android Phone:
1. Ensure both your computer and your phone are connected to the **same Wi-Fi network**.
2. Open **Google Chrome** on your Android device.
3. Enter the local network URL displayed in your computer's terminal when starting the frontend client (e.g., `http://192.168.1.45:5173/`).
4. Once the page loads, tap the **three vertical dots** icon in Chrome's top-right corner.
5. Select **"Install app"** or **"Add to Home screen"**.
6. Confirm the installation. A hamburger icon (🍔) will appear on your phone's desktop, opening the app in fullscreen standalone mode.

### Registration & Logging In:
*   **Create Account**: On the login screen, tap **"Don't have an account? Register here"**, enter your email, business name, and a password (minimum 6 characters). Tap **"Register Business"**.
*   **Logging In**: Enter your credentials and tap **"Log In"**. Your session will remain securely saved on your device so you do not have to log in every time.
*   **Logging Out**: Tap the door/exit icon in the top-right header corner of the app.

---

## 2. Managing Ingredients (Inventory & Unit Pricing)

Before costing your recipes, you need to populate your catalog with raw ingredients.

### Adding an Ingredient:
1. Navigate to the **Insumos** (Ingredients) tab in the bottom navigation bar.
2. Tap the **"+"** button in the top-right corner.
3. Fill out the form:
    *   **Name**: E.g., *Ground Beef 80/20*, *Sliced Cheddar*, *Canola Oil*.
    *   **Purchase Price ($)**: The total cost of the package or box (e.g., `$150.00`).
    *   **Purchase Qty**: The weight, volume, or units contained in the pack (e.g., `2.5`).
    *   **Purchase Unit**: The unit of measurement (kg, g, l, ml, lb, oz, or unit/piece).
4. Tap **"Create Insumo"** to save.

### Interactive Bulk Price Portion Converter:
If you buy in bulk (e.g., a 20 lb box of cheese) but use portion measurements (e.g., 1.5 oz per burger), use the built-in converter:
1. In the ingredient modal, tap **"Open Bulk Converter"**.
2. Enter the purchase package info (e.g., `20` `lb` for `$80.00`).
3. Enter the recipe portion quantity (e.g., `1.5` `oz`).
4. Tap **"Calculate Portion Cost"**: It will show that this portion costs exactly `$0.375`.
5. Tap **"Load into Form"** to automatically populate the purchase parameters on the main form.

---

## 3. Compiling Recipes (Menu Costing)

In this section, you will compile menu items, calculating the cost of goods sold (COGS) and profit margins.

### Creating a Recipe:
1. Navigate to the **Recipes** (Chef hat) tab.
2. Tap **"+"**.
3. Input the recipe metadata:
    *   **Platillo Name**: E.g., *Double Cheeseburger*.
    *   **Target Cost (%)**: The food cost percentage you want to maintain (standard target is 30.00%).
    *   **Selling Price ($)**: The price you sell it to customers (e.g., `$85.00`).
4. **Add Ingredients to the Recipe**:
    *   Select an ingredient from the dropdown.
    *   Enter the exact portion size (e.g., `150` for 150 grams).
    *   Select the portion unit (e.g., `g`).
    *   Tap **"Add"**. The item will be listed below, showing its calculated cost.
5. Repeat for all ingredients, dressings, bread, packaging, and boxes.
6. Tap **"Create Recipe"**.

### Understanding Recipe Cost Calculations:
*   **Total Food Cost (COGS)**: The total cost of ingredients needed to compile the plate (e.g., `$25.50`).
*   **Suggested Price**: The recommended price you should charge to meet your target food cost percentage.
*   **Actual Cost %**: If your cost percentage is above the target (e.g., 38% vs 30% target), the text will turn **red** as an alert to adjust pricing or portions. If it is on target or lower, it will display in **green** (profitable).
*   **Gross Profit Margin**: The gross profit you earn per plate sold.

---

## 4. Managing Operational Overhead (Fixed Costs)

Fixed costs are the regular operational bills you pay regardless of how many burgers you sell.

### Registering an Overhead Expense:
1. Navigate to the **Gastos** (Overheads) tab.
2. Tap **"Add Gasto"**.
3. Input:
    *   **Name**: E.g., *Local Rent*, *Staff Salary*, *Electricity Bill*, *Kitchen Gas*.
    *   **Amount ($)**: The cost.
    *   **Frequency**: Choose whether you pay this **Monthly**, **Weekly**, or **Daily**.
4. Tap **"Create Gasto"**.

### Temporal Normalization:
The system automatically normalizes all entered expenses:
*   *Monthly*: Normalized monthly = amount, Daily = amount / 30.
*   *Weekly*: Normalized monthly = amount * 4.33 (average weeks in a month), Daily = amount / 7.
*   *Daily*: Normalized monthly = amount * 30, Daily = amount.

The top panel card displays your total monthly and daily operational overhead summaries.

---

## 5. Sales Forecasting & Profit Simulation

The **Simulator** tab lets you input daily sales volumes per recipe to calculate monthly net profit projections.

### Running a Simulation:
1. Navigate to the **Simulator** tab (trends icon).
2. For each menu item, enter the number of units you sell (or expect to sell) per day.
3. Tap **"Save"**.
4. Observe the top panel dashboard updating in real-time:
    *   **Gross Revenue**: Your total sales income for the month.
    *   **Food Cost**: Total money spent on purchasing ingredients to cover those sales.
    *   **Fixed Overhead**: The operational overhead bills (rent, salary, etc.) calculated in tab 4.
    *   **Net Profit**: Your final net profit. Positive values display in **green** (profitable), and negative values display in **red** (losing money).

---

## 6. Dashboard Analysis (Business KPIs)

The **Inicio** (Dashboard) tab consolidates your business metrics:

*   **Net Profit**: Displays your projected monthly net profits based on your last saved simulation.
*   **Average Food Cost**: The simple average food cost percentage across all recipes.
*   **Fixed Overhead**: The monthly cost to run your store.
*   **Active Catalogue**: Total active ingredients and recipe counts.
*   **Smart Business Tips**: The system automatically warns you if your food cost average is too high (above 35%) and gives suggestions on how to improve your business margins.
