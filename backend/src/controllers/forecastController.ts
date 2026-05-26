import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import crypto from 'crypto';
import pool, { query } from '../db';
import { calculateIngredientCost } from './recipeController';

export const getForecasts = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'No autenticado.' });
    return;
  }

  try {
    const userId = req.user.userId;

    // 1. Obtener gastos fijos (overheads)
    const overheadsResult = await query(
      'SELECT amount, frequency FROM overheads WHERE user_id = $1',
      [userId]
    );

    let totalMonthlyOverhead = 0;
    let totalDailyOverhead = 0;

    overheadsResult.rows.forEach(item => {
      const amount = parseFloat(item.amount);
      const freq = item.frequency.trim().toLowerCase();

      if (freq === 'monthly' || freq === 'mensual') {
        totalMonthlyOverhead += amount;
        totalDailyOverhead += amount / 30;
      } else if (freq === 'weekly' || freq === 'semanal') {
        totalMonthlyOverhead += amount * 4.33;
        totalDailyOverhead += amount / 7;
      } else if (freq === 'daily' || freq === 'diario') {
        totalMonthlyOverhead += amount * 30;
        totalDailyOverhead += amount;
      }
    });

    // 2. Obtener todas las recetas del usuario
    const recipesResult = await query(
      'SELECT id, name, selling_price, target_food_cost_pct FROM recipes WHERE user_id = $1',
      [userId]
    );

    // 3. Obtener todos los ingredientes de recetas
    const recipeIngredientsResult = await query(
      `SELECT ri.*, i.purchase_price, i.purchase_qty, i.purchase_unit
       FROM recipe_ingredients ri
       JOIN ingredients i ON ri.ingredient_id = i.id
       WHERE i.user_id = $1`,
      [userId]
    );

    const recipeIngredients = recipeIngredientsResult.rows;

    // Calcular costo de comida (COGS) para cada receta
    const recipeCostsMap = new Map<string, { name: string; sellingPrice: number; foodCost: number }>();
    recipesResult.rows.forEach(recipe => {
      const sellingPrice = parseFloat(recipe.selling_price || '0.00');

      const ingredients = recipeIngredients.filter(ri => ri.recipe_id === recipe.id);
      const foodCost = ingredients.reduce((sum, ri) => {
        const qtyUsed = parseFloat(ri.quantity_used);
        const price = parseFloat(ri.purchase_price);
        const pQty = parseFloat(ri.purchase_qty);
        return sum + calculateIngredientCost(qtyUsed, ri.unit_used, pQty, price, ri.purchase_unit);
      }, 0);

      recipeCostsMap.set(recipe.id, {
        name: recipe.name,
        sellingPrice,
        foodCost,
      });
    });

    // 4. Obtener proyecciones de venta guardadas
    const forecastsResult = await query(
      `SELECT sf.*, r.name as recipe_name
       FROM sales_forecasts sf
       JOIN recipes r ON sf.recipe_id = r.id
       WHERE sf.user_id = $1`,
      [userId]
    );

    // 5. Armar reporte detallado
    let totalDailyRevenue = 0;
    let totalDailyFoodCost = 0;

    const forecasts = forecastsResult.rows.map(f => {
      const recipeInfo = recipeCostsMap.get(f.recipe_id);
      const volume = parseInt(f.projected_daily_volume || '0');

      const sellingPrice = recipeInfo ? recipeInfo.sellingPrice : 0;
      const unitFoodCost = recipeInfo ? recipeInfo.foodCost : 0;

      const dailyRevenue = volume * sellingPrice;
      const dailyFoodCost = volume * unitFoodCost;
      const dailyGrossProfit = dailyRevenue - dailyFoodCost;

      totalDailyRevenue += dailyRevenue;
      totalDailyFoodCost += dailyFoodCost;

      return {
        id: f.id,
        recipe_id: f.recipe_id,
        recipe_name: f.recipe_name,
        projected_daily_volume: volume,
        unit_price: sellingPrice,
        unit_food_cost: unitFoodCost,
        daily_revenue: dailyRevenue,
        daily_food_cost: dailyFoodCost,
        daily_gross_profit: dailyGrossProfit,
        monthly_revenue: dailyRevenue * 30,
        monthly_food_cost: dailyFoodCost * 30,
        monthly_gross_profit: dailyGrossProfit * 30,
      };
    });

    const totalDailyGrossProfit = totalDailyRevenue - totalDailyFoodCost;
    const totalDailyNetProfit = totalDailyGrossProfit - totalDailyOverhead;

    const totalMonthlyRevenue = totalDailyRevenue * 30;
    const totalMonthlyFoodCost = totalDailyFoodCost * 30;
    const totalMonthlyGrossProfit = totalDailyGrossProfit * 30;
    const totalMonthlyNetProfit = totalMonthlyGrossProfit - totalMonthlyOverhead;

    res.json({
      forecasts,
      summary: {
        daily: {
          revenue: totalDailyRevenue,
          food_cost: totalDailyFoodCost,
          gross_profit: totalDailyGrossProfit,
          overhead: totalDailyOverhead,
          net_profit: totalDailyNetProfit,
        },
        monthly: {
          revenue: totalMonthlyRevenue,
          food_cost: totalMonthlyFoodCost,
          gross_profit: totalMonthlyGrossProfit,
          overhead: totalMonthlyOverhead,
          net_profit: totalMonthlyNetProfit,
        },
      },
    });
  } catch (error) {
    console.error('Error al obtener proyecciones:', error);
    res.status(500).json({ error: 'Error interno al calcular proyecciones de venta.' });
  }
};

export const updateForecasts = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'No autenticado.' });
    return;
  }

  const { items } = req.body; // Array de { recipeId, projectedDailyVolume }

  if (!items || !Array.isArray(items)) {
    res.status(400).json({ error: 'Se requiere una lista de proyecciones válida.' });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Eliminar proyecciones de venta anteriores para este usuario
    await client.query('DELETE FROM sales_forecasts WHERE user_id = $1', [req.user.userId]);

    // 2. Insertar nuevas proyecciones de venta
    for (const item of items) {
      if (!item.recipeId || item.projectedDailyVolume === undefined) {
        throw new Error('Datos de proyección inválidos.');
      }

      const id = crypto.randomUUID();
      await client.query(
        `INSERT INTO sales_forecasts (id, user_id, recipe_id, projected_daily_volume)
         VALUES ($1, $2, $3, $4)`,
        [id, req.user.userId, item.recipeId, item.projectedDailyVolume]
      );
    }

    await client.query('COMMIT');
    res.json({ message: 'Proyecciones actualizadas correctamente.' });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error al guardar proyecciones:', error);
    res.status(500).json({ error: error.message || 'Error al actualizar proyecciones de ventas.' });
  } finally {
    client.release();
  }
};
