# User Guide: Fixed Overheads and Operating Expenses

This guide details how to track and manage the fixed overheads (operating expenses) of your fast-food business—such as rent, utilities, and labor—to forecast your business's true net profits.

---

## 🏛️ Variable Food Costs (COGS) vs. Fixed Operating Expenses (Overhead)

To run a financially healthy business, it is essential to understand the differences between these two expense categories:

* **Variable Food Costs (COGS)**: These fluctuate directly with your sales volume. If you sell a burger, you consume bread, meat, and condiments. If you sell nothing, this cost drops to zero.
* **Fixed Operating Expenses (Overhead)**: These remain constant regardless of your sales volume. Whether you sell 1 burger or 1,000, you must pay rent, utility bills, and staff wages at the end of the billing period.

The **Expenses** section of the application consolidates these indirect costs to calculate your daily and monthly break-even running costs.

---

## 🖥️ Fixed Expenses Interface

Tap the **Expenses** tab (the receipt icon `Receipt`) to access the fixed overheads panel:

1. **Expenses Summary Card**: Located at the top of the screen, this shows your consolidated overhead:
   * **Monthly Expenses**: The total of all your fixed expenses normalized to a 30-day month.
   * **Daily Expenses**: The average daily cost required to keep your business open.
2. **Add Expense Button**: Opens the modal to register a new operating cost.
3. **Expenses List**: Displays all registered expenses showing their original amount, frequency, and calculated daily and monthly equivalents.
4. **Actions**: Edit (`Edit3`) or delete (`Trash2`) the expense.

---

## ➕ Adding or Editing a Fixed Expense

Tap the **Add Expense** button to open the form, then complete the following fields:

* **Expense Name**: Specify the expense type (e.g., *Local Rent*, *Line Cook Wages*, *LP Gas*, *Internet & Phone*, *Electricity & Water*).
* **Amount ($)**: The monetary cost billed for that period (e.g., `1200.00`).
* **Payment Frequency**: The billing period of the expense. Select one of the following options:
  * **Monthly** (e.g., rent, monthly salaries).
  * **Weekly** (e.g., weekly shifts, weekly cleaning services).
  * **Daily** (e.g., daily ice delivery, daily waste disposal fee).

---

## 📐 Normalization and Equivalency Formulas (Under the Hood)

To compare and aggregate expenses with different billing cycles, the system normalizes all costs to a single time scale. The application calculates the monthly and daily equivalents based on the selected frequency:

### Frequency Conversion Table
| Selected Frequency | Monthly Equivalence ($/month) | Daily Equivalence ($/day) |
| :--- | :--- | :--- |
| 🗓️ **Monthly** | $$\text{Amount}$$ | $$\frac{\text{Amount}}{30}$$ |
| 📅 **Weekly** | $$\text{Amount} \times 4.33$$ | $$\frac{\text{Amount}}{7}$$ |
| ☀️ **Daily** | $$\text{Amount} \times 30$$ | $$\text{Amount}$$ |

> [!NOTE]
> The system uses the standard coefficient of **4.33 weeks per month** for weekly calculations. This accounts for the fact that most months contain slightly more than 4 weeks ($52\text{ weeks per year} / 12\text{ months} = 4.33$).

### Practical Conversion Examples:
* **Example 1 (Monthly Rent):** Amount = \$900.00 Monthly.
  * Monthly Equivalent = \$900.00.
  * Daily Equivalent = $\frac{900.00}{30} = \$30.00$ per day.
* **Example 2 (Weekly Salary):** Amount = \$200.00 Weekly.
  * Monthly Equivalent = $\$200.00 \times 4.33 = \$866.00$ per month.
  * Daily Equivalent = $\frac{200.00}{7} = \$28.57$ per day.
* **Example 3 (Daily Ice Supply):** Amount = \$5.00 Daily.
  * Monthly Equivalent = $\$5.00 \times 30 = \$150.00$ per month.
  * Daily Equivalent = \$5.00 per day.

---

## 💡 Best Practices for Expense Tracking
> [!TIP]
> * **Pay Yourself first:** Remember to list your own salary as a fixed monthly expense. Many business owners overlook their own labor cost, which can distort the calculated net profitability of their business.
> * **Averaging Variable Bills:** For utility bills (like water or electricity) that are billed bi-monthly, add the totals from your last three statements, divide by six to get a monthly average, and log it as a "Monthly" expense.
