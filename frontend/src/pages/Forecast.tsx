import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Save, 
  TrendingUp, 
  DollarSign, 
  ChevronRight, 
  Percent,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

interface ForecastItem {
  id?: string;
  recipe_id: string;
  recipe_name: string;
  projected_daily_volume: number;
  unit_price: number;
  unit_food_cost: number;
  daily_revenue: number;
  daily_food_cost: number;
  daily_gross_profit: number;
}

interface OverheadSummary {
  daily: number;
  monthly: number;
}

export const Forecast: React.FC = () => {
  const { getAuthHeaders, apiUrl } = useAuth();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [volumes, setVolumes] = useState<{ [recipeId: string]: number }>({});
  const [overhead, setOverhead] = useState<OverheadSummary>({ daily: 0, monthly: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();

      // Cargar recetas para conocer sus precios y costes
      const recRes = await fetch(`${apiUrl}/recipes`, { headers });
      const recData = await recRes.json();
      
      // Cargar gastos para el overhead
      const ovRes = await fetch(`${apiUrl}/overheads`, { headers });
      const ovData = await ovRes.json();
      
      // Cargar proyecciones guardadas
      const foreRes = await fetch(`${apiUrl}/forecast`, { headers });
      const foreData = await foreRes.json();

      let dailyOverhead = 0;
      if (Array.isArray(ovData)) {
        ovData.forEach(o => {
          dailyOverhead += o.daily_equivalent || 0;
        });
      }
      setOverhead({
        daily: dailyOverhead,
        monthly: dailyOverhead * 30,
      });

      if (Array.isArray(recData)) {
        setRecipes(recData);

        // Mapear volúmenes existentes o por defecto 0
        const initialVolumes: { [recipeId: string]: number } = {};
        recData.forEach(r => {
          const saved = foreData?.forecasts?.find((f: any) => f.recipe_id === r.id);
          initialVolumes[r.id] = saved ? saved.projected_daily_volume : 0;
        });
        setVolumes(initialVolumes);
      }
    } catch (err) {
      console.error('Error al cargar datos del simulador:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVolumeChange = (recipeId: string, value: string) => {
    const val = parseInt(value) || 0;
    setVolumes({
      ...volumes,
      [recipeId]: val >= 0 ? val : 0,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      
      const payload = {
        items: Object.keys(volumes).map(recipeId => ({
          recipeId,
          projectedDailyVolume: volumes[recipeId],
        })),
      };

      const res = await fetch(`${apiUrl}/forecast`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error al guardar proyecciones:', err);
    } finally {
      setSaving(false);
    }
  };

  // Cálculos dinámicos en caliente (live client calculations)
  let totalDailyRevenue = 0;
  let totalDailyFoodCost = 0;

  const simulatedItems = recipes.map(recipe => {
    const vol = volumes[recipe.id] || 0;
    const price = recipe.selling_price;
    const cogs = recipe.total_food_cost;

    const dailyRev = vol * price;
    const dailyCost = vol * cogs;

    totalDailyRevenue += dailyRev;
    totalDailyFoodCost += dailyCost;

    return {
      id: recipe.id,
      name: recipe.name,
      volume: vol,
      price,
      cogs,
      dailyRev,
      dailyCost,
    };
  });

  const totalDailyGrossProfit = totalDailyRevenue - totalDailyFoodCost;
  const totalDailyNetProfit = totalDailyGrossProfit - overhead.daily;

  const totalMonthlyRevenue = totalDailyRevenue * 30;
  const totalMonthlyFoodCost = totalDailyFoodCost * 30;
  const totalMonthlyGrossProfit = totalDailyGrossProfit * 30;
  const totalMonthlyNetProfit = totalMonthlyGrossProfit - overhead.monthly;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Resumen del Simulador */}
      <div className="card card-accent" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          <TrendingUp size={20} /> Proyección Mensual Simulada
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', textAlign: 'center' }}>
          <div style={{ borderRight: '1px solid hsl(var(--border))', paddingRight: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', display: 'block' }}>Ingresos Brutos</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              ${totalMonthlyRevenue.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', display: 'block' }}>Costo de Alimentos</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>
              -${totalMonthlyFoodCost.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', textAlign: 'center', borderTop: '1px solid hsl(var(--border))', paddingTop: '12px' }}>
          <div style={{ borderRight: '1px solid hsl(var(--border))', paddingRight: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', display: 'block' }}>Gastos Fijos Local</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'hsl(var(--error) / 0.8)' }}>
              -${overhead.monthly.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', display: 'block' }}>Ganancia Neta</span>
            <span style={{ 
              fontSize: '1.35rem', 
              fontWeight: 800, 
              color: totalMonthlyNetProfit >= 0 ? 'hsl(var(--success))' : 'hsl(var(--error))' 
            }}>
              ${totalMonthlyNetProfit.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="alert alert-success">
          <span>¡Proyecciones guardadas exitosamente!</span>
        </div>
      )}

      {/* Lista de Ajustes por Platillo */}
      <div className="flex-between">
        <h3 style={{ fontSize: '1.1rem' }}>Ventas Diarias Estimadas</h3>
        <button className="btn btn-primary" onClick={handleSave} style={{ width: 'auto', padding: '10px 16px', fontSize: '0.9rem' }} disabled={saving}>
          {saving ? <span className="spinner"></span> : <><Save size={18} /> Guardar</>}
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
          <span className="spinner"></span>
        </div>
      ) : recipes.length === 0 ? (
        <div className="card text-center" style={{ padding: '40px' }}>
          <ShoppingBag size={40} style={{ color: 'hsl(var(--primary) / 0.5)', marginBottom: '12px' }} />
          <p>Debes crear recetas en el catálogo antes de poder hacer proyecciones de ventas.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recipes.map(recipe => (
            <div key={recipe.id} className="card" style={{ padding: '16px' }}>
              <div className="flex-between">
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{recipe.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>
                    Precio: ${recipe.selling_price.toFixed(2)} | Costo: ${recipe.total_food_cost.toFixed(2)}
                  </span>
                </div>
                
                {/* Input de cantidad táctil */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="number"
                    min="0"
                    value={volumes[recipe.id] !== undefined ? volumes[recipe.id] : 0}
                    onChange={(e) => handleVolumeChange(recipe.id, e.target.value)}
                    style={{
                      width: '80px',
                      padding: '8px 10px',
                      textAlign: 'center',
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>/día</span>
                </div>
              </div>

              {/* Subtotal del platillo */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '0.75rem', 
                color: 'hsl(var(--text-secondary))',
                borderTop: '1px dashed hsl(var(--border))',
                paddingTop: '8px',
                marginTop: '10px'
              }}>
                <span>Ingreso Diario: <b>${(recipe.selling_price * (volumes[recipe.id] || 0)).toFixed(2)}</b></span>
                <span style={{ color: 'hsl(var(--success))' }}>
                  Ganancia Bruta: <b>+${((recipe.selling_price - recipe.total_food_cost) * (volumes[recipe.id] || 0)).toFixed(2)}</b>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
