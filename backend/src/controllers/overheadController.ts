import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import crypto from 'crypto';
import { query } from '../db';

export const getOverheads = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'No autenticado.' });
    return;
  }

  try {
    const result = await query(
      'SELECT * FROM overheads WHERE user_id = $1 ORDER BY name ASC',
      [req.user.userId]
    );

    const overheads = result.rows.map(item => {
      const amount = parseFloat(item.amount);
      const freq = item.frequency.trim().toLowerCase();

      // Normalizar a mensual y diario
      let monthlyEquivalent = 0;
      let dailyEquivalent = 0;

      if (freq === 'monthly' || freq === 'mensual') {
        monthlyEquivalent = amount;
        dailyEquivalent = amount / 30;
      } else if (freq === 'weekly' || freq === 'semanal') {
        monthlyEquivalent = amount * 4.33; // 4.33 semanas por mes
        dailyEquivalent = amount / 7;
      } else if (freq === 'daily' || freq === 'diario') {
        monthlyEquivalent = amount * 30;
        dailyEquivalent = amount;
      }

      return {
        ...item,
        amount: amount,
        monthly_equivalent: monthlyEquivalent,
        daily_equivalent: dailyEquivalent,
      };
    });

    res.json(overheads);
  } catch (error) {
    console.error('Error al obtener gastos fijos:', error);
    res.status(500).json({ error: 'Error interno al obtener gastos fijos.' });
  }
};

export const createOverhead = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'No autenticado.' });
    return;
  }

  const { name, amount, frequency } = req.body;

  if (!name || amount === undefined || !frequency) {
    res.status(400).json({ error: 'Faltan campos obligatorios.' });
    return;
  }

  try {
    const id = crypto.randomUUID();
    const freq = frequency.trim().toLowerCase();

    await query(
      `INSERT INTO overheads (id, user_id, name, amount, frequency)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, req.user.userId, name.trim(), amount, freq]
    );

    let monthlyEquivalent = 0;
    let dailyEquivalent = 0;

    if (freq === 'monthly' || freq === 'mensual') {
      monthlyEquivalent = amount;
      dailyEquivalent = amount / 30;
    } else if (freq === 'weekly' || freq === 'semanal') {
      monthlyEquivalent = amount * 4.33;
      dailyEquivalent = amount / 7;
    } else if (freq === 'daily' || freq === 'diario') {
      monthlyEquivalent = amount * 30;
      dailyEquivalent = amount;
    }

    res.status(201).json({
      id,
      user_id: req.user.userId,
      name: name.trim(),
      amount,
      frequency: freq,
      monthly_equivalent: monthlyEquivalent,
      daily_equivalent: dailyEquivalent,
    });
  } catch (error) {
    console.error('Error al crear gasto fijo:', error);
    res.status(500).json({ error: 'Error interno al crear gasto fijo.' });
  }
};

export const updateOverhead = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'No autenticado.' });
    return;
  }

  const { id } = req.params;
  const { name, amount, frequency } = req.body;

  if (!name || amount === undefined || !frequency) {
    res.status(400).json({ error: 'Faltan campos obligatorios.' });
    return;
  }

  try {
    const freq = frequency.trim().toLowerCase();
    const result = await query(
      `UPDATE overheads SET name = $1, amount = $2, frequency = $3
       WHERE id = $4 AND user_id = $5 RETURNING *`,
      [name.trim(), amount, freq, id, req.user.userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Gasto fijo no encontrado o no autorizado.' });
      return;
    }

    const item = result.rows[0];
    let monthlyEquivalent = 0;
    let dailyEquivalent = 0;

    if (freq === 'monthly' || freq === 'mensual') {
      monthlyEquivalent = amount;
      dailyEquivalent = amount / 30;
    } else if (freq === 'weekly' || freq === 'semanal') {
      monthlyEquivalent = amount * 4.33;
      dailyEquivalent = amount / 7;
    } else if (freq === 'daily' || freq === 'diario') {
      monthlyEquivalent = amount * 30;
      dailyEquivalent = amount;
    }

    res.json({
      ...item,
      amount: parseFloat(item.amount),
      monthly_equivalent: monthlyEquivalent,
      daily_equivalent: dailyEquivalent,
    });
  } catch (error) {
    console.error('Error al actualizar gasto fijo:', error);
    res.status(500).json({ error: 'Error interno al actualizar gasto fijo.' });
  }
};

export const deleteOverhead = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'No autenticado.' });
    return;
  }

  const { id } = req.params;

  try {
    const result = await query(
      'DELETE FROM overheads WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Gasto fijo no encontrado o no autorizado.' });
      return;
    }

    res.json({ message: 'Gasto fijo eliminado correctamente.', id: id });
  } catch (error) {
    console.error('Error al eliminar gasto fijo:', error);
    res.status(500).json({ error: 'Error interno al eliminar gasto fijo.' });
  }
};
