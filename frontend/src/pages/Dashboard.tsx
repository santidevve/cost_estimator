import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building, 
  DollarSign, 
  Percent, 
  ChefHat, 
  FolderHeart, 
  AlertTriangle,
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface SummaryData {
  ingredientCount: number;
  recipeCount: number;
  avgFoodCostPct: number;
  monthlyOverhead: number;
  projectedNetProfit: number;
}

export const Dashboard: React.FC = () => {
  const { getAuthHeaders, apiUrl, user } = useAuth();
  const [data, setData] = useState<SummaryData>({
    ingredientCount: 0,
    recipeCount: 0,
    avgFoodCostPct: 0,
    monthlyOverhead: 0,
    projectedNetProfit: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      // Fetch ingredients
      const ingRes = await fetch(`${apiUrl}/ingredients`, { headers });
      const ingredients = await ingRes.json();

      // Fetch recipes
      const recRes = await fetch(`${apiUrl}/recipes`, { headers });
      const recipes = await recRes.json();

      // Fetch overheads
      const ovRes = await fetch(`${apiUrl}/overheads`, { headers });
      const overheads = await ovRes.json();

      // Fetch forecasts
      const foreRes = await fetch(`${apiUrl}/forecast`, { headers });
      const forecastData = await foreRes.json();

      // Calcular promedios y sumas
      const recipeCount = Array.isArray(recipes) ? recipes.length : 0;
      let sumPct = 0;
      let validPcts = 0;
      if (recipeCount > 0) {
        recipes.forEach((r: any) => {
          if (r.selling_price > 0) {
            sumPct += r.actual_food_cost_pct;
            validPcts++;
          }
        });
      }
      const avgFoodCostPct = validPcts > 0 ? sumPct / validPcts : 0;

      const monthlyOverhead = Array.isArray(overheads) 
        ? overheads.reduce((sum, item) => sum + (item.monthly_equivalent || 0), 0)
        : 0;

      const projectedNetProfit = forecastData?.summary?.monthly?.net_profit || 0;

      setData({
        ingredientCount: Array.isArray(ingredients) ? ingredients.length : 0,
        recipeCount,
        avgFoodCostPct,
        monthlyOverhead,
        projectedNetProfit,
      });
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <span className="spinner" style={{ width: '40px', height: '40px', color: 'hsl(var(--primary))' }}></span>
      </div>
    );
  }

  // Reglas de negocio para consejos útiles
  const foodCostAlert = data.avgFoodCostPct > 35;
  const zeroRecipes = data.recipeCount === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Tarjeta de Bienvenida */}
      <div className="card card-accent" style={{ background: 'linear-gradient(135deg, hsl(var(--surface)) 0%, hsl(var(--surface-card)) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            backgroundColor: 'rgba(var(--primary-rgb), 0.15)',
            color: 'hsl(var(--primary))',
            padding: '10px',
            borderRadius: '10px',
            display: 'flex',
          }}>
            <Building size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Resumen del Negocio</h2>
            <p style={{ fontSize: '0.85rem' }}>{user?.businessName || 'Tu Negocio de Comida Rápida'}</p>
          </div>
        </div>
      </div>

      {/* Grid de Métricas Principales */}
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="label">Rentabilidad Mensual</span>
          <span className="value" style={{ color: data.projectedNetProfit >= 0 ? 'hsl(var(--success))' : 'hsl(var(--error))' }}>
            ${data.projectedNetProfit.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} /> Neta Proyectada
          </span>
        </div>

        <div className="metric-card">
          <span className="label">Costo Alimentos (Promedio)</span>
          <span className="value">
            {data.avgFoodCostPct.toFixed(1)}%
          </span>
          <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Percent size={12} /> Meta ideal: 28% - 32%
          </span>
        </div>

        <div className="metric-card">
          <span className="label">Gastos Fijos Mensuales</span>
          <span className="value" style={{ color: 'hsl(var(--text))' }}>
            ${data.monthlyOverhead.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <DollarSign size={12} /> Renta, servicios y sueldos
          </span>
        </div>

        <div className="metric-card">
          <span className="label">Catálogo Activo</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: 600 }}>
              <FolderHeart size={16} style={{ color: 'hsl(var(--primary))' }} /> {data.ingredientCount} insumos
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: 600 }}>
              <ChefHat size={16} style={{ color: 'hsl(var(--accent))' }} /> {data.recipeCount} recetas
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', marginTop: '4px' }}>Ingredientes y menús</span>
        </div>
      </div>

      {/* Alertas y Tips de Gestión */}
      <h3 style={{ fontSize: '1.1rem', marginTop: '8px' }}>Consejos y Recomendaciones</h3>
      
      {zeroRecipes ? (
        <div className="card" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <Sparkles size={24} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'hsl(var(--text))' }}>¡Comienza a Estimular Tus Costos!</h4>
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
              Para iniciar, ve a la pestaña de <b>Insumos</b> e ingresa tus ingredientes a granel. Luego, en la pestaña de <b>Recetas</b>, diseña tus hamburguesas, papas o combos para calcular su costo exacto.
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {foodCostAlert ? (
            <div className="card" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', borderLeft: '4px solid hsl(var(--error))' }}>
              <AlertTriangle size={24} style={{ color: 'hsl(var(--error))', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'hsl(var(--error))' }}>Costo de Comida Elevado</h4>
                <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                  Tu promedio de costo de comida es del <b>{data.avgFoodCostPct.toFixed(1)}%</b>, lo cual supera el 35% recomendado. Te sugerimos revisar las porciones de las recetas o aumentar el precio de venta de tus platos para mejorar tu rentabilidad.
                </p>
              </div>
            </div>
          ) : (
            <div className="card" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', borderLeft: '4px solid hsl(var(--success))' }}>
              <Sparkles size={24} style={{ color: 'hsl(var(--success))', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'hsl(var(--success))' }}>Costo de Comida Saludable</h4>
                <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                  ¡Excelente trabajo! Tu porcentaje promedio de costo de comida está en un saludable <b>{data.avgFoodCostPct.toFixed(1)}%</b>. Esto te da un margen bruto superior para cubrir tus gastos fijos.
                </p>
              </div>
            </div>
          )}

          <div className="card" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Building size={24} style={{ color: 'hsl(var(--primary))', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Simula tus Ventas Diarias</h4>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                Ve a la pestaña de <b>Simulador</b> y define cuántas unidades vendes al día de cada plato para ver una proyección realista de tus ingresos netos mensuales y amortizar tus gastos operativos fijos.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
