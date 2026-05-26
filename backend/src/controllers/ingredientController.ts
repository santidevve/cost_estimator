import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import crypto from 'crypto';
import { query } from '../db';

export const getIngredients = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'No autenticado.' });
    return;
  }

  try {
    const result = await query(
      'SELECT * FROM ingredients WHERE user_id = $1 ORDER BY name ASC',
      [req.user.userId]
    );

    // Calcular el costo unitario para cada ingrediente para facilitar el uso del frontend
    const ingredients = result.rows.map(ing => {
      const price = parseFloat(ing.purchase_price);
      const qty = parseFloat(ing.purchase_qty);
      const unit = ing.purchase_unit;
      const unitCost = qty > 0 ? price / qty : 0;

      return {
        ...ing,
        purchase_price: price,
        purchase_qty: qty,
        unit_cost: unitCost, // Costo por unidad de compra (ej. por kg, por litro)
      };
    });

    res.json(ingredients);
  } catch (error) {
    console.error('Error al obtener ingredientes:', error);
    res.status(500).json({ error: 'Error interno al obtener ingredientes.' });
  }
};

export const createIngredient = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'No autenticado.' });
    return;
  }

  const { name, purchasePrice, purchaseQty, purchaseUnit } = req.body;

  if (!name || purchasePrice === undefined || purchaseQty === undefined || !purchaseUnit) {
    res.status(400).json({ error: 'Faltan campos obligatorios.' });
    return;
  }

  try {
    const ingredientId = crypto.randomUUID();
    await query(
      `INSERT INTO ingredients (id, user_id, name, purchase_price, purchase_qty, purchase_unit)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [ingredientId, req.user.userId, name.trim(), purchasePrice, purchaseQty, purchaseUnit.trim().toLowerCase()]
    );

    const unitCost = purchaseQty > 0 ? purchasePrice / purchaseQty : 0;

    res.status(201).json({
      id: ingredientId,
      user_id: req.user.userId,
      name: name.trim(),
      purchase_price: purchasePrice,
      purchase_qty: purchaseQty,
      purchase_unit: purchaseUnit.trim().toLowerCase(),
      unit_cost: unitCost,
    });
  } catch (error) {
    console.error('Error al crear ingrediente:', error);
    res.status(500).json({ error: 'Error interno al crear el ingrediente.' });
  }
};

export const updateIngredient = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'No autenticado.' });
    return;
  }

  const { id } = req.params;
  const { name, purchasePrice, purchaseQty, purchaseUnit } = req.body;

  if (!name || purchasePrice === undefined || purchaseQty === undefined || !purchaseUnit) {
    res.status(400).json({ error: 'Faltan campos obligatorios.' });
    return;
  }

  try {
    const result = await query(
      'UPDATE ingredients SET name = $1, purchase_price = $2, purchase_qty = $3, purchase_unit = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
      [name.trim(), purchasePrice, purchaseQty, purchaseUnit.trim().toLowerCase(), id, req.user.userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Ingrediente no encontrado o no autorizado.' });
      return;
    }

    const ing = result.rows[0];
    const unitCost = purchaseQty > 0 ? purchasePrice / purchaseQty : 0;

    res.json({
      ...ing,
      purchase_price: parseFloat(ing.purchase_price),
      purchase_qty: parseFloat(ing.purchase_qty),
      unit_cost: unitCost,
    });
  } catch (error) {
    console.error('Error al actualizar ingrediente:', error);
    res.status(500).json({ error: 'Error interno al actualizar ingrediente.' });
  }
};

export const deleteIngredient = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'No autenticado.' });
    return;
  }

  const { id } = req.params;

  try {
    const result = await query(
      'DELETE FROM ingredients WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Ingrediente no encontrado o no autorizado.' });
      return;
    }

    res.json({ message: 'Ingrediente eliminado correctamente.', id: id });
  } catch (error) {
    console.error('Error al eliminar ingrediente:', error);
    res.status(500).json({ error: 'Error interno al eliminar ingrediente.' });
  }
};
