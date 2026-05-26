import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db';
import { register, login, getMe } from './controllers/authController';
import { authenticateToken } from './middleware/auth';
import {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from './controllers/ingredientController';
import {
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from './controllers/recipeController';
import {
  getOverheads,
  createOverhead,
  updateOverhead,
  deleteOverhead,
} from './controllers/overheadController';
import {
  getForecasts,
  updateForecasts,
} from './controllers/forecastController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS
// Permite conexiones desde localhost (frontend de desarrollo) y cualquier host de la red local
app.use(
  cors({
    origin: '*', // Habilita conexiones de cualquier origen para facilitar el testeo móvil en red local
    credentials: true,
  })
);

app.use(express.json());

// RUTA DE SALUD
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor del estimador de costos activo.' });
});

// RUTAS DE AUTENTICACIÓN
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', authenticateToken, getMe);

// RUTAS DE INGREDIENTES
app.get('/api/ingredients', authenticateToken, getIngredients);
app.post('/api/ingredients', authenticateToken, createIngredient);
app.put('/api/ingredients/:id', authenticateToken, updateIngredient);
app.delete('/api/ingredients/:id', authenticateToken, deleteIngredient);

// RUTAS DE RECETAS (MENU ITEMS)
app.get('/api/recipes', authenticateToken, getRecipes);
app.post('/api/recipes', authenticateToken, createRecipe);
app.put('/api/recipes/:id', authenticateToken, updateRecipe);
app.delete('/api/recipes/:id', authenticateToken, deleteRecipe);

// RUTAS DE COSTOS FIJOS (OVERHEAD)
app.get('/api/overheads', authenticateToken, getOverheads);
app.post('/api/overheads', authenticateToken, createOverhead);
app.put('/api/overheads/:id', authenticateToken, updateOverhead);
app.delete('/api/overheads/:id', authenticateToken, deleteOverhead);

// RUTAS DE PROYECCIÓN (FORECAST)
app.get('/api/forecast', authenticateToken, getForecasts);
app.post('/api/forecast', authenticateToken, updateForecasts);

// Inicializar base de datos y arrancar servidor
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Servidor de la API corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al arrancar el servidor:', error);
    process.exit(1);
  }
}

startServer();
