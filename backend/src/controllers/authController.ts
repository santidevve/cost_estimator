import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { query } from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_desarrollo_cost_estimator_2026_xyz';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password, businessName } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'El correo electrónico y la contraseña son requeridos.' });
    return;
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existingUser.rows.length > 0) {
      res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
      return;
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = crypto.randomUUID();

    // Insertar nuevo usuario
    await query(
      'INSERT INTO users (id, email, password_hash, business_name) VALUES ($1, $2, $3, $4)',
      [userId, email.toLowerCase().trim(), passwordHash, businessName || 'Mi Negocio de Comida Rápida']
    );

    // Generar Token JWT
    const token = jwt.sign({ userId, email: email.toLowerCase().trim() }, JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({
      token,
      user: {
        id: userId,
        email: email.toLowerCase().trim(),
        businessName: businessName || 'Mi Negocio de Comida Rápida',
      },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor al registrar el usuario.' });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'El correo electrónico y la contraseña son requeridos.' });
    return;
  }

  try {
    // Buscar usuario
    const userResult = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (userResult.rows.length === 0) {
      res.status(401).json({ error: 'Credenciales inválidas.' });
      return;
    }

    const user = userResult.rows[0];

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ error: 'Credenciales inválidas.' });
      return;
    }

    // Generar Token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        businessName: user.business_name,
      },
    });
  } catch (error) {
    console.error('Error en inicio de sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor al iniciar sesión.' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'No autenticado.' });
    return;
  }

  try {
    const userResult = await query('SELECT id, email, business_name FROM users WHERE id = $1', [req.user.userId]);
    if (userResult.rows.length === 0) {
      res.status(404).json({ error: 'Usuario no encontrado.' });
      return;
    }

    const user = userResult.rows[0];
    res.json({
      id: user.id,
      email: user.email,
      businessName: user.business_name,
    });
  } catch (error) {
    console.error('Error en getMe:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener datos del usuario.' });
  }
};
