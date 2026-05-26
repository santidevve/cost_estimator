import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

// Configuración del Pool de conexiones
const isProduction = process.env.NODE_ENV === 'production';

let dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  // Eliminar channel_binding que no es soportado por el driver de Node y causa ECONNRESET
  dbUrl = dbUrl.replace(/([?&])channel_binding=[^&]*/, '$1');
  dbUrl = dbUrl.replace(/\?$/, '').replace(/&$/, '');
  // Eliminar '-pooler' para conectar directamente al nodo de cómputo y permitir operaciones DDL (CREATE TABLE)
  dbUrl = dbUrl.replace('-pooler', '');
}

const pool = new Pool(
  dbUrl
    ? {
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false },
        keepAlive: true,
      }
    : {
        host: process.env.PGHOST || 'localhost',
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || 'postgres',
        database: process.env.PGDATABASE || 'cost_estimator_db',
        port: parseInt(process.env.PGPORT || '5432'),
        ssl: false,
      }
);

pool.on('error', (err: any) => {
  console.error('Error inesperado en cliente de base de datos inactivo:', err);
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export async function initializeDatabase() {
  const client = await pool.connect();
  try {
    console.log('Iniciando verificación y migración de tablas en PostgreSQL...');

    // Crear tabla users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        business_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear tabla ingredients
    await client.query(`
      CREATE TABLE IF NOT EXISTS ingredients (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        purchase_price DECIMAL(10,2) NOT NULL,
        purchase_qty DECIMAL(10,3) NOT NULL,
        purchase_unit VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear tabla recipes
    await client.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        target_food_cost_pct DECIMAL(5,2) DEFAULT 30.00,
        selling_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear tabla recipe_ingredients
    await client.query(`
      CREATE TABLE IF NOT EXISTS recipe_ingredients (
        id UUID PRIMARY KEY,
        recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
        ingredient_id UUID NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
        quantity_used DECIMAL(10,3) NOT NULL,
        unit_used VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear tabla overheads
    await client.query(`
      CREATE TABLE IF NOT EXISTS overheads (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        frequency VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Crear tabla sales_forecasts
    await client.query(`
      CREATE TABLE IF NOT EXISTS sales_forecasts (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
        projected_daily_volume INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Base de datos inicializada correctamente.');
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
    throw error;
  } finally {
    client.release();
  }
}

export default pool;
