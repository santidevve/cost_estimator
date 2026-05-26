# Testing Requirements - Cost Estimator System

This document outlines the testing scenarios and verification checklists to validate that the Cost Estimator application operates correctly according to business requirements.

---

## 1. Testing Objectives

*   Validate multi-user data isolation (JWT verification).
*   Verify mathematical accuracy of unit conversions and portion pricing.
*   Ensure data persistence (ingredients, recipes, overheads, and forecasts) in Neon Postgres.
*   Confirm that the financial simulator correctly projects net monthly profit by subtracting recipe COGS and fixed overheads.
*   Verify mobile responsive layout and standalone PWA installation on Android.

---

## 2. Test Environment

*   **API Server**: Node.js + Express (running on `http://localhost:5000` or local network IP).
*   **Database**: Neon Serverless Postgres (in the cloud).
*   **Frontend**: React + Vite (running on `http://localhost:5173`).
*   **Test Devices**:
    *   PC/Laptop (Chrome / Firefox / Edge).
    *   Android Phone (Google Chrome, connected to the same Wi-Fi network).

---

## 3. Test Cases (Verification Matrix)

### Test Case 1: Registration and Login (Auth Module)
*   **Action**:
    1.  On the welcome screen, click "Register here" and create a new account with a valid email and a password of at least 6 characters.
    2.  Log out using the top-right button.
    3.  Log in using the newly created credentials.
    4.  *(Optional)* Create a second user account and verify that it cannot see any records created by the first account.
*   **Expected Result**:
    *   Registration succeeds and immediately redirects to the dashboard.
    *   Session is securely persisted in LocalStorage.
    *   Each user's data is isolated and completely inaccessible to other accounts.

---

### Test Case 2: Ingredients Inventory & Bulk Converter
*   **Action**:
    1.  On the **Ingredients** tab, click **"+"** to add a new item: *Beef* at `$1200.00` per `10` `kg`.
    2.  Open the "Bulk Converter" inside the modal.
    3.  Enter: Bulk purchase of `10 kg` at `$1200.00`, and portion used of `150 g`. Click "Calculate Portion Cost".
    4.  Click "Load into Form" and save the ingredient.
*   **Expected Result**:
    *   The ingredient is saved, displaying a base unit cost of `$120.0000 / kg`.
    *   The Bulk Converter estimates a portion cost of `$18.000` for a `150g` portion.
    *   The ingredient is saved to Neon Postgres and can be found using the search bar.

---

### Test Case 3: Recipe Compilation & Margin Calculator
*   **Action**:
    1.  On the **Recipes** tab, click **"+"** to create a recipe named *Classic Burger*.
    2.  Set a Target Food Cost of `30.00%`.
    3.  Enter a manual selling price of `$70.00`.
    4.  Add *Beef* from the catalogue with a portion of `150 g`.
    5.  Add a second ingredient (e.g., *Burger Bun* at `$3.00` per `1 unit`, using `1 unit`).
    6.  Observe the live calculations panel and save the recipe.
*   **Expected Result**:
    *   Total Recipe Cost (COGS) is computed as `$21.00` (beef: `$18.00` + bun: `$3.00`).
    *   Suggested selling price is `$70.00` ($\$21.00 / 0.30$).
    *   Actual food cost percentage is calculated as `30.0%` ($\$21.00 / \$70.00 \times 100$).
    *   If you lower the manual selling price (e.g., to `$50.00`), the food cost percentage rises to `42.0%` and turns **red** (exceeding the target).

---

### Test Case 4: Operational Overhead (Fixed Costs)
*   **Action**:
    1.  On the **Overheads** tab, click **"Add Gasto"** to register *Local Rent* at `$6000.00` `Monthly`.
    2.  Add *Assistant Salary* at `$200.00` `Weekly`.
    3.  Add *Kitchen Gas* at `$30.00` `Daily`.
*   **Expected Result**:
    *   All expenses are normalized into monthly and daily equivalents:
        *   *Rent*: `$6000.00/month` and `$200.00/day`.
        *   *Assistant*: `$866.00/month` ($200 \times 4.33$ average weeks per month) and `$28.57/day` ($200 / 7$ days).
        *   *Gas*: `$900.00/month` ($30 \times 30$ days) and `$30.00/day`.
    *   The top panel summary card displays the correct total monthly and daily operational overhead.

---

### Test Case 5: Sales Forecasting & Net Profit Projections
*   **Action**:
    1.  On the **Forecast** tab, enter a projected daily sales volume of `20` units for the *Classic Burger*.
    2.  Click **"Save"** to store the simulation context.
    3.  Navigate to the **Dashboard (Home)** and inspect the KPIs.
*   **Expected Result**:
    *   For 20 burgers a day:
        *   Monthly revenue: `$42,000.00` ($20 \times \$70 \times 30$ days).
        *   Monthly ingredient food cost: `$12,600.00` ($20 \times \$21 \times 30$ days).
        *   Monthly gross profit: `$29,400.00`.
    *   The net profit calculator subtracts the monthly fixed overhead (from Case 4) from the monthly gross profit.
    *   The resulting **Net Monthly Profit** is saved and displayed on the main dashboard home card.

---

### Test Case 6: Mobile PWA Responsive Usability
*   **Action**:
    1.  Open the local network URL in Google Chrome on an Android phone.
    2.  Verify that the bottom navigation bar is fixed, links work, and layout fits without horizontal scrolling down to `360px` screen widths.
    3.  Tap "Install app" in Chrome and open the app from the home screen icon.
*   **Expected Result**:
    *   Responsive layout with touch-friendly button targets.
    *   PWA opens fullscreen standalone mode without browser bars.
