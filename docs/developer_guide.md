# Developer Guide - Cost Estimator System

This document outlines the internal architecture, database schema, and core calculations of the application.

---

## System Architecture

The application is structured as a decoupled client-server architecture:

```
+---------------------------------------+
|          React Client (PWA)           |
+---------------------------------------+
                    |
                    | REST HTTP Requests + JWT (Port 5000)
                    v
+---------------------------------------+
|         Express API (Backend)         |
+---------------------------------------+
                    |
                    | PostgreSQL Client (pg Pool via WebSockets)
                    v
+---------------------------------------+
|       Neon Serverless Postgres        |
+---------------------------------------+
```

---

## Database Schema & Relations

The system uses UUIDs generated in Node.js via `crypto.randomUUID()` to ensure unique identifiers across distributed nodes. The tables are structured as follows:

1. **`users`**: Contains registered user accounts. Passwords are encrypted with `bcryptjs`. Every other table has a `user_id` foreign key constraint to ensure data isolation.
2. **`ingredients`**: Catalogue of bulk raw ingredients purchased from suppliers (e.g., 25kg bag of flour for $450.00).
3. **`recipes`**: Menu items sold to the public (e.g., Hamburger, French Fries).
4. **`recipe_ingredients`**: Many-to-many join table mapping ingredients to recipes, storing the exact portion size and measurement unit used.
5. **`overheads`**: Fixed operational expenses normalized across days/months (e.g., Rent, staff wages, electricity).
6. **`sales_forecasts`**: Stores projected daily sales volumes per recipe to feed the net profit simulation dashboard.

---

## Core Costing Equations

### 1. Individual Portion Cost
To calculate the cost of a specific portion size (e.g., 150g of beef) from a bulk purchase (e.g., 10kg pack for $900), the units are normalized to a common base unit (grams for weight, milliliters for volume) and calculated as:

$$\text{Portion Cost} = \text{Portion Quantity (Base)} \times \left( \frac{\text{Purchase Price}}{\text{Purchase Quantity (Base)}} \right)$$

Unit scaling maps are stored in `src/pages/helper.ts` (Client) and `src/controllers/recipeController.ts` (Server) for weight (`g`, `kg`, `lb`, `oz`), volume (`ml`, `l`, `oz_fl`, `gal`), and count (`unidad`/`unit`).

### 2. Recipe Total Food Cost (COGS)
The sum of all portion costs for the ingredients that compile a menu item:

$$\text{Recipe Cost} = \sum (\text{Portion Cost}_i)$$

### 3. Gross Profit Margin
The profit margin earned on a single plate sale before operational overheads are deducted:

$$\text{Gross Profit} = \text{Selling Price} - \text{Recipe Cost}$$

### 4. Actual Food Cost Percentage
The fraction of the selling price occupied by ingredient costs (best practice for fast food is between 28% and 32%):

$$\text{Actual Food Cost \%} = \left( \frac{\text{Recipe Cost}}{\text{Selling Price}} \right) \times 100$$

### 5. Suggested Selling Price
The recommended selling price calculated from a target food cost percentage (e.g., 30%):

$$\text{Suggested Price} = \frac{\text{Recipe Cost}}{\left( \frac{\text{Target Food Cost \%}}{100} \right)}$$

### 6. Monthly Net Profit Simulation
Projects overall profitability by subtracting fixed operational costs from the monthly gross margin:

$$\text{Net Profit} = \left[ \sum (\text{Daily Sales Volume}_j \times \text{Gross Profit}_j) \times 30 \right] - \text{Monthly Fixed Overhead}$$

---

## Security & Authentication

- **JWT (JSON Web Tokens)**: Upon login or registration, `authController.ts` signs a JWT containing `{ userId, email }` valid for 30 days.
- **Route Authorization**: The `authenticateToken` middleware in `src/middleware/auth.ts` intercepts and validates the token in the `Authorization: Bearer <token>` header, injecting the user identity context into the request object.
