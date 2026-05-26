import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import crypto from 'crypto';
import pool, { query } from '../db';

interface UnitMap {
  [key: string]: { type: 'weight' | 'volume' | 'count'; value: number };
}

export const UNIT_CONVERSIONS: UnitMap = {
  // Peso (base: gramo)
  g: { type: 'weight', value: 1 },
  gr: { type: 'weight', value: 1 },
  gramo: { type: 'weight', value: 1 },
  gramos: { type: 'weight', value: 1 },
  kg: { type: 'weight', value: 1000 },
  kilo: { type: 'weight', value: 1000 },
  kilos: { type: 'weight', value: 1000 },
  kilogramo: { type: 'weight', value: 1000 },
  kilogramos: { type: 'weight', value: 1000 },
  lb: { type: 'weight', value: 453.59237 },
  libra: { type: 'weight', value: 453.59237 },
  libras: { type: 'weight', value: 453.59237 },
  oz: { type: 'weight', value: 28.3495231 },
  onza: { type: 'weight', value: 28.3495231 },
  onzas: { type: 'weight', value: 28.3495231 },

  // Volumen (base: mililitro)
  ml: { type: 'volume', value: 1 },
  mililitro: { type: 'volume', value: 1 },
  mililitros: { type: 'volume', value: 1 },
  l: { type: 'volume', value: 1000 },
  lt: { type: 'volume', value: 1000 },
  litro: { type: 'volume', value: 1000 },
  litros: { type: 'volume', value: 1000 },
  gal: { type: 'volume', value: 3785.41178 },
  galon: { type: 'volume', value: 3785.41178 },
  galones: { type: 'volume', value: 3785.41178 },
  oz_fl: { type: 'volume', value: 29.5735296 },
  onza_fluida: { type: 'volume', value: 29.5735296 },
  onzas_fluidas: { type: 'volume', value: 29.5735296 },

  // Conteo (base: unidad)
  unidad: { type: 'count', value: 1 },
  unidades: { type: 'count', value: 1 },
  item: { type: 'count', value: 1 },
  items: { type: 'count', value: 1 },
  ud: { type: 'count', value: 1 },
  uds: { type: 'count', value: 1 },
  pack: { type: 'count', value: 1 },
  packs: { type: 'count', value: 1 },
  caja: { type: 'count', value: 1 },
  cajas: { type: 'count', value: 1 },
  pieza: { type: 'count', value: 1 },
  piezas: { type: 'count', value: 1 },
  pz: { type: 'count', value: 1 },
};

export function calculateIngredientCost(
  qtyUsed: number,
  unitUsed: string,
  purchaseQty: number,
  purchasePrice: number,
  purchaseUnit: string
): number {
  const normUsedUnit = unitUsed.trim().toLowerCase();
  const normPurchaseUnit = purchaseUnit.trim().toLowerCase();

  const convUsed = UNIT_CONVERSIONS[normUsedUnit];
  const convPurchase = UNIT_CONVERSIONS[normPurchaseUnit];

  // Si ambos están en el mapa y pertenecen a la misma categoría física (Peso o Volumen)
  if (convUsed && convPurchase && convUsed.type === convPurchase.type) {
    const purchaseQtyBase = purchaseQty * convPurchase.value;
    const qtyUsedBase = qtyUsed * convUsed.value;
    if (purchaseQtyBase <= 0) return 0;
    const costPerBase = purchasePrice / purchaseQtyBase;
    return qtyUsedBase * costPerBase;
  }

  // Fallback: Proporción directa si no coinciden las unidades estándar (por ejemplo, piezas)
  if (purchaseQty <= 0) return 0;
  return qtyUsed * (purchasePrice / purchaseQty);
}

export const getRecipes = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'No autenticado.' });
    return;
  }

  try {
    // 1. Obtener recetas
    const recipesResult = await query(
      'SELECT * FROM recipes WHERE user_id = $1 ORDER BY name ASC',
      [req.user.userId]
    );

    // 2. Obtener todos los ingredientes de recetas con detalles de ingredientes
    const recipeIngredientsResult = await query(
      `SELECT ri.*, i.name as ingredient_name, i.purchase_price, i.purchase_qty, i.purchase_unit
       FROM recipe_ingredients ri
       JOIN ingredients i ON ri.ingredient_id = i.id
       WHERE i.user_id = $1`,
      [req.user.userId]
    );

    const recipeIngredients = recipeIngredientsResult.rows;

    // 3. Formatear y calcular costos por receta
    const recipes = recipesResult.rows.map(recipe => {
      const targetPct = parseFloat(recipe.target_food_cost_pct || '30.00');
      const sellingPrice = parseFloat(recipe.selling_price || '0.00');

      // Filtrar los ingredientes de esta receta
      const ingredients = recipeIngredients
        .filter(ri => ri.recipe_id === recipe.id)
        .map(ri => {
          const qtyUsed = parseFloat(ri.quantity_used);
          const price = parseFloat(ri.purchase_price);
          const pQty = parseFloat(ri.purchase_qty);
          const cost = calculateIngredientCost(qtyUsed, ri.unit_used, pQty, price, ri.purchase_unit);

          return {
            id: ri.ingredient_id,
            recipe_ingredient_id: ri.id,
            name: ri.ingredient_name,
            quantity_used: qtyUsed,
            unit_used: ri.unit_used,
            purchase_price: price,
            purchase_qty: pQty,
            purchase_unit: ri.purchase_unit,
            cost: cost,
          };
        });

      const totalFoodCost = ingredients.reduce((sum, ing) => sum + ing.cost, 0);
      const margin = sellingPrice - totalFoodCost;
      const actualFoodCostPct = sellingPrice > 0 ? (totalFoodCost / sellingPrice) * 100 : 0;
      const suggestedPrice = targetPct > 0 ? (totalFoodCost / (targetPct / 100)) : 0;

      return {
        id: recipe.id,
        name: recipe.name,
        target_food_cost_pct: targetPct,
        selling_price: sellingPrice,
        total_food_cost: totalFoodCost,
        margin: margin,
        actual_food_cost_pct: actualFoodCostPct,
        suggested_price: suggestedPrice,
        ingredients: ingredients,
      };
    });

    res.json(recipes);
  } catch (error) {
    console.error('Error al obtener recetas:', error);
    res.status(500).json({ error: 'Error interno al obtener recetas.' });
  }
};

export const createRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'No autenticado.' });
    return;
  }

  const { name, targetFoodCostPct, sellingPrice, ingredients } = req.body;

  if (!name || sellingPrice === undefined || !ingredients || !Array.isArray(ingredients)) {
    res.status(400).json({ error: 'Faltan campos obligatorios para crear la receta.' });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const recipeId = crypto.randomUUID();
    const targetPct = targetFoodCostPct !== undefined ? targetFoodCostPct : 30.0;

    // 1. Insertar la receta
    await client.query(
      `INSERT INTO recipes (id, user_id, name, target_food_cost_pct, selling_price)
       VALUES ($1, $2, $3, $4, $5)`,
      [recipeId, req.user.userId, name.trim(), targetPct, sellingPrice]
    );

    // 2. Insertar los ingredientes de la receta
    for (const ing of ingredients) {
      if (!ing.ingredientId || ing.quantityUsed === undefined || !ing.unitUsed) {
        throw new Error('Datos de ingrediente inválidos en la receta.');
      }
      const riId = crypto.randomUUID();
      await client.query(
        `INSERT INTO recipe_ingredients (id, recipe_id, ingredient_id, quantity_used, unit_used)
         VALUES ($1, $2, $3, $4, $5)`,
        [riId, recipeId, ing.ingredientId, ing.quantityUsed, ing.unitUsed.trim().toLowerCase()]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ id: recipeId, message: 'Receta creada exitosamente.' });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error al crear receta:', error);
    res.status(500).json({ error: error.message || 'Error interno al crear receta.' });
  } finally {
    client.release();
  }
};

export const updateRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'No autenticado.' });
    return;
  }

  const { id } = req.params;
  const { name, targetFoodCostPct, sellingPrice, ingredients } = req.body;

  if (!name || sellingPrice === undefined || !ingredients || !Array.isArray(ingredients)) {
    res.status(400).json({ error: 'Faltan campos obligatorios para actualizar la receta.' });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Actualizar receta
    const updateResult = await client.query(
      `UPDATE recipes SET name = $1, target_food_cost_pct = $2, selling_price = $3
       WHERE id = $4 AND user_id = $5 RETURNING *`,
      [name.trim(), targetFoodCostPct || 30.0, sellingPrice, id, req.user.userId]
    );

    if (updateResult.rows.length === 0) {
      throw new Error('Receta no encontrada o no autorizada.');
    }

    // 2. Eliminar ingredientes anteriores
    await client.query('DELETE FROM recipe_ingredients WHERE recipe_id = $1', [id]);

    // 3. Insertar nuevos ingredientes
    for (const ing of ingredients) {
      if (!ing.ingredientId || ing.quantityUsed === undefined || !ing.unitUsed) {
        throw new Error('Datos de ingrediente inválidos en la actualización.');
      }
      const riId = crypto.randomUUID();
      await client.query(
        `INSERT INTO recipe_ingredients (id, recipe_id, ingredient_id, quantity_used, unit_used)
         VALUES ($1, $2, $3, $4, $5)`,
        [riId, id, ing.ingredientId, ing.quantityUsed, ing.unitUsed.trim().toLowerCase()]
      );
    }

    await client.query('COMMIT');
    res.json({ id, message: 'Receta actualizada exitosamente.' });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar receta:', error);
    res.status(500).json({ error: error.message || 'Error interno al actualizar receta.' });
  } finally {
    client.release();
  }
};

export const deleteRecipe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'No autenticado.' });
    return;
  }

  const { id } = req.params;

  try {
    const result = await query(
      'DELETE FROM recipes WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Receta no encontrada o no autorizada.' });
      return;
    }

    res.json({ message: 'Receta eliminada correctamente.', id: id });
  } catch (error) {
    console.error('Error al eliminar receta:', error);
    res.status(500).json({ error: 'Error interno al eliminar receta.' });
  }
};
