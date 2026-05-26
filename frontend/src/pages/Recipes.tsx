import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  ChefHat, 
  DollarSign, 
  Percent, 
  TrendingUp, 
  Info 
} from 'lucide-react';
import { UNIT_CONVERSIONS, calculateIngredientCost } from './helper'; // Crearemos helper.ts después para compartir la lógica de cálculo

interface RecipeIngredient {
  id: string; // ID del catálogo de ingredientes
  name: string;
  quantity_used: number;
  unit_used: string;
  cost: number;
}

interface Recipe {
  id: string;
  name: string;
  target_food_cost_pct: number;
  selling_price: number;
  total_food_cost: number;
  margin: number;
  actual_food_cost_pct: number;
  suggested_price: number;
  ingredients: any[];
}

interface CatalogIngredient {
  id: string;
  name: string;
  purchase_price: number;
  purchase_qty: number;
  purchase_unit: string;
  unit_cost: number;
}

export const Recipes: React.FC = () => {
  const { getAuthHeaders, apiUrl } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [catalog, setCatalog] = useState<CatalogIngredient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Estados del Modal/Formulario
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [targetFoodCostPct, setTargetFoodCostPct] = useState('30');
  const [sellingPrice, setSellingPrice] = useState('');
  
  // Lista de ingredientes agregados a la receta que se está creando/editando
  const [recipeIngredients, setRecipeIngredients] = useState<RecipeIngredient[]>([]);
  
  // Ingrediente seleccionado actualmente en el selector para añadir
  const [selectedIngId, setSelectedIngId] = useState('');
  const [portionQty, setPortionQty] = useState('');
  const [portionUnit, setPortionUnit] = useState('g');

  const fetchData = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      
      // Cargar recetas
      const recRes = await fetch(`${apiUrl}/recipes`, { headers });
      const recData = await recRes.json();
      if (Array.isArray(recData)) setRecipes(recData);

      // Cargar catálogo de ingredientes
      const catRes = await fetch(`${apiUrl}/ingredients`, { headers });
      const catData = await catRes.json();
      if (Array.isArray(catData)) setCatalog(catData);

    } catch (err) {
      console.error('Error al cargar datos de recetas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setTargetFoodCostPct('30');
    setSellingPrice('');
    setRecipeIngredients([]);
    setSelectedIngId(catalog[0]?.id || '');
    setPortionQty('');
    setPortionUnit('g');
    setIsOpen(true);
  };

  const handleOpenEdit = (recipe: Recipe) => {
    setEditingId(recipe.id);
    setName(recipe.name);
    setTargetFoodCostPct(recipe.target_food_cost_pct.toString());
    setSellingPrice(recipe.selling_price.toString());
    
    // Mapear los ingredientes
    const formatted = recipe.ingredients.map(ing => ({
      id: ing.id,
      name: ing.name,
      quantity_used: ing.quantity_used,
      unit_used: ing.unit_used,
      cost: ing.cost,
    }));
    setRecipeIngredients(formatted);
    setSelectedIngId(catalog[0]?.id || '');
    setPortionQty('');
    setPortionUnit('g');
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta receta?')) return;
    try {
      const res = await fetch(`${apiUrl}/recipes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setRecipes(recipes.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error('Error al eliminar receta:', err);
    }
  };

  const addIngredientToRecipe = () => {
    const qty = parseFloat(portionQty);
    if (!selectedIngId || isNaN(qty) || qty <= 0 || !portionUnit) return;

    const ingDetails = catalog.find(i => i.id === selectedIngId);
    if (!ingDetails) return;

    // Calcular costo
    const cost = calculateIngredientCost(
      qty,
      portionUnit,
      ingDetails.purchase_qty,
      ingDetails.purchase_price,
      ingDetails.purchase_unit
    );

    // Si ya existe en la lista, lo reemplazamos
    const exists = recipeIngredients.find(ri => ri.id === selectedIngId);
    if (exists) {
      setRecipeIngredients(recipeIngredients.map(ri => 
        ri.id === selectedIngId 
          ? { ...ri, quantity_used: qty, unit_used: portionUnit, cost }
          : ri
      ));
    } else {
      setRecipeIngredients([
        ...recipeIngredients,
        {
          id: selectedIngId,
          name: ingDetails.name,
          quantity_used: qty,
          unit_used: portionUnit,
          cost,
        }
      ]);
    }

    setPortionQty('');
  };

  const removeIngredientFromRecipe = (id: string) => {
    setRecipeIngredients(recipeIngredients.filter(ri => ri.id !== id));
  };

  // Cálculos en tiempo real
  const currentTotalFoodCost = recipeIngredients.reduce((sum, ri) => sum + ri.cost, 0);
  const targetPctNum = parseFloat(targetFoodCostPct) || 30;
  const currentSuggestedPrice = targetPctNum > 0 ? currentTotalFoodCost / (targetPctNum / 100) : 0;
  
  const manualPriceNum = parseFloat(sellingPrice) || 0;
  const currentActualFoodCostPct = manualPriceNum > 0 ? (currentTotalFoodCost / manualPriceNum) * 100 : 0;
  const currentMargin = manualPriceNum - currentTotalFoodCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sellingPrice || recipeIngredients.length === 0) {
      alert('Por favor complete todos los datos e ingrese al menos un ingrediente.');
      return;
    }

    const payload = {
      name,
      targetFoodCostPct: parseFloat(targetFoodCostPct),
      sellingPrice: parseFloat(sellingPrice),
      ingredients: recipeIngredients.map(ri => ({
        ingredientId: ri.id,
        quantityUsed: ri.quantity_used,
        unitUsed: ri.unit_used,
      })),
    };

    try {
      const url = editingId 
        ? `${apiUrl}/recipes/${editingId}`
        : `${apiUrl}/recipes`;

      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error('Error al guardar receta:', err);
    }
  };

  const filteredRecipes = recipes.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Buscador y Botón Agregar */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            placeholder="Buscar receta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '44px', paddingRight: '12px' }}
          />
          <Search size={18} style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'hsl(var(--text-secondary) / 0.7)'
          }} />
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd} style={{ width: 'auto', padding: '12px 16px' }}>
          <Plus size={20} />
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
          <span className="spinner"></span>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="card text-center" style={{ padding: '40px' }}>
          <ChefHat size={40} style={{ color: 'hsl(var(--primary) / 0.5)', marginBottom: '12px' }} />
          <p>No se encontraron recetas creadas.</p>
          <button className="btn btn-secondary mt-4" onClick={handleOpenAdd}>Crear Receta</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="card" style={{ padding: '16px 20px' }}>
              <div className="flex-between">
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{recipe.name}</h4>
                <div className="flex-gap">
                  <button 
                    onClick={() => handleOpenEdit(recipe)}
                    style={{ background: 'none', border: 'none', color: 'hsl(var(--text-secondary))', cursor: 'pointer', padding: '6px' }}
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(recipe.id)}
                    style={{ background: 'none', border: 'none', color: 'hsl(var(--error) / 0.8)', cursor: 'pointer', padding: '6px' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Grid de Costos del platillo */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr 1fr', 
                gap: '8px', 
                backgroundColor: 'hsl(var(--surface-card))',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '12px',
                textAlign: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-secondary))', display: 'block' }}>Costo Receta</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'hsl(var(--primary))' }}>
                    ${recipe.total_food_cost.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-secondary))', display: 'block' }}>Venta</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                    ${recipe.selling_price.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-secondary))', display: 'block' }}>Costo %</span>
                  <span style={{ 
                    fontSize: '1.05rem', 
                    fontWeight: 700,
                    color: recipe.actual_food_cost_pct > recipe.target_food_cost_pct ? 'hsl(var(--error))' : 'hsl(var(--success))'
                  }}>
                    {recipe.actual_food_cost_pct.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '10px' }}>
                <span style={{ color: 'hsl(var(--text-secondary))' }}>
                  Sugerido (al {recipe.target_food_cost_pct}%): <b>${recipe.suggested_price.toFixed(2)}</b>
                </span>
                <span style={{ color: 'hsl(var(--success))', fontWeight: 600 }}>
                  Margen: +${recipe.margin.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CREAR / EDITAR RECETA */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'hsl(var(--primary))' }}>
                {editingId ? 'Editar Receta' : 'Nueva Receta'}
              </h3>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'hsl(var(--text-secondary))', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label>Nombre del Platillo</label>
                <input
                  type="text"
                  placeholder="Ej. Hamburguesa Doble, Papas Supremas"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Costo Objetivo (%)</label>
                  <input
                    type="number"
                    placeholder="30"
                    value={targetFoodCostPct}
                    onChange={(e) => setTargetFoodCostPct(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Precio de Venta ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* SECCIÓN AÑADIR INGREDIENTE */}
              <div style={{
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: 'hsl(var(--surface-card))'
              }}>
                <h4 style={{ fontSize: '0.85rem', color: 'hsl(var(--accent))', marginBottom: '8px' }}>Armar Receta / Añadir Insumos</h4>
                
                {catalog.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'hsl(var(--error))' }}>Crea insumos primero para agregarlos a la receta.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <select value={selectedIngId} onChange={(e) => setSelectedIngId(e.target.value)}>
                      {catalog.map(c => (
                        <option key={c.id} value={c.id}>{c.name} (${c.unit_cost.toFixed(3)}/{c.purchase_unit})</option>
                      ))}
                    </select>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 0.8fr', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="number"
                        step="0.001"
                        placeholder="Porción"
                        value={portionQty}
                        onChange={(e) => setPortionQty(e.target.value)}
                        style={{ padding: '8px' }}
                      />
                      <select value={portionUnit} onChange={(e) => setPortionUnit(e.target.value)} style={{ padding: '8px' }}>
                        <option value="g">gramos (g)</option>
                        <option value="kg">kilogramos (kg)</option>
                        <option value="ml">mililitros (mL)</option>
                        <option value="l">litros (L)</option>
                        <option value="oz">onzas (oz)</option>
                        <option value="unidad">unidades</option>
                      </select>
                      <button type="button" className="btn btn-primary" onClick={addIngredientToRecipe} style={{ padding: '10px' }}>
                        Añadir
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* LISTA DE INGREDIENTES EN LA RECETA */}
              <div>
                <label>Ingredientes Añadidos ({recipeIngredients.length})</label>
                {recipeIngredients.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', fontStyle: 'italic', margin: '8px 0', color: 'hsl(var(--text-secondary))' }}>
                    Aún no has añadido ingredientes a esta receta.
                  </p>
                ) : (
                  <div style={{ 
                    maxHeight: '150px', 
                    overflowY: 'auto', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '8px', 
                    padding: '8px 12px',
                    marginTop: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    {recipeIngredients.map(ri => (
                      <div key={ri.id} className="flex-between" style={{ fontSize: '0.85rem', paddingBottom: '6px', borderBottom: '1px solid hsl(var(--border) / 0.5)' }}>
                        <div>
                          <b>{ri.name}</b>
                          <span style={{ color: 'hsl(var(--text-secondary))', marginLeft: '6px' }}>
                            ({ri.quantity_used} {ri.unit_used})
                          </span>
                        </div>
                        <div className="flex-gap">
                          <span style={{ fontWeight: 600, color: 'hsl(var(--primary))' }}>${ri.cost.toFixed(2)}</span>
                          <button 
                            type="button" 
                            onClick={() => removeIngredientFromRecipe(ri.id)}
                            style={{ background: 'none', border: 'none', color: 'hsl(var(--error))', cursor: 'pointer', padding: '2px' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PANEL DE CÁLCULO DILUIDO */}
              <div style={{
                backgroundColor: 'hsl(var(--surface-card))',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid hsl(var(--border))',
                fontSize: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div className="flex-between">
                  <span>Costo Total de Alimentos:</span>
                  <span style={{ fontWeight: 700, color: 'hsl(var(--primary))' }}>${currentTotalFoodCost.toFixed(2)}</span>
                </div>
                <div className="flex-between">
                  <span>Precio de Venta Sugerido:</span>
                  <span style={{ fontWeight: 700, color: 'hsl(var(--success))' }}>${currentSuggestedPrice.toFixed(2)}</span>
                </div>
                <hr style={{ border: 'none', borderBottom: '1px solid hsl(var(--border))', margin: '4px 0' }} />
                <div className="flex-between">
                  <span>Porcentaje de Costo Real:</span>
                  <span style={{ 
                    fontWeight: 700, 
                    color: currentActualFoodCostPct > targetPctNum ? 'hsl(var(--error))' : 'hsl(var(--success))' 
                  }}>
                    {currentActualFoodCostPct.toFixed(1)}%
                  </span>
                </div>
                <div className="flex-between">
                  <span>Margen de Ganancia Bruta:</span>
                  <span style={{ fontWeight: 700 }}>${currentMargin.toFixed(2)}</span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                {editingId ? 'Guardar Cambios' : 'Crear Receta'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
