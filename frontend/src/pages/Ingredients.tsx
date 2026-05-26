import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Calculator,
  RefreshCw,
  FolderHeart
} from 'lucide-react';

interface Ingredient {
  id: string;
  name: string;
  purchase_price: number;
  purchase_qty: number;
  purchase_unit: string;
  unit_cost: number;
}

export const Ingredients: React.FC = () => {
  const { getAuthHeaders, apiUrl } = useAuth();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Estados del Formulario/Modal
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [purchaseQty, setPurchaseQty] = useState('');
  const [purchaseUnit, setPurchaseUnit] = useState('kg');

  // Estados del Conversor Rápido (Calculadora)
  const [convOpen, setConvOpen] = useState(false);
  const [convBulkQty, setConvBulkQty] = useState('');
  const [convBulkUnit, setConvBulkUnit] = useState('kg');
  const [convPrice, setConvPrice] = useState('');
  const [convPortionQty, setConvPortionQty] = useState('');
  const [convPortionUnit, setConvPortionUnit] = useState('g');
  const [convResult, setConvResult] = useState<number | null>(null);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/ingredients`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setIngredients(data);
      }
    } catch (err) {
      console.error('Error al cargar insumos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setPurchasePrice('');
    setPurchaseQty('');
    setPurchaseUnit('kg');
    setIsOpen(true);
  };

  const handleOpenEdit = (ing: Ingredient) => {
    setEditingId(ing.id);
    setName(ing.name);
    setPurchasePrice(ing.purchase_price.toString());
    setPurchaseQty(ing.purchase_qty.toString());
    setPurchaseUnit(ing.purchase_unit);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este insumo? Las recetas que lo utilicen también podrían verse afectadas.')) {
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/ingredients/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setIngredients(ingredients.filter(ing => ing.id !== id));
      }
    } catch (err) {
      console.error('Error al eliminar insumo:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !purchasePrice || !purchaseQty || !purchaseUnit) return;

    const payload = {
      name,
      purchasePrice: parseFloat(purchasePrice),
      purchaseQty: parseFloat(purchaseQty),
      purchaseUnit,
    };

    try {
      const url = editingId 
        ? `${apiUrl}/ingredients/${editingId}`
        : `${apiUrl}/ingredients`;

      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsOpen(false);
        fetchIngredients();
      }
    } catch (err) {
      console.error('Error al guardar insumo:', err);
    }
  };

  // Lógica del Conversor Rápido
  const runConversion = () => {
    const price = parseFloat(convPrice);
    const bulkQty = parseFloat(convBulkQty);
    const portionQty = parseFloat(convPortionQty);

    if (isNaN(price) || isNaN(bulkQty) || isNaN(portionQty) || bulkQty <= 0) {
      setConvResult(null);
      return;
    }

    // Unidades Normalizadas
    const units: { [key: string]: number } = {
      g: 1, gr: 1, kg: 1000, lb: 453.592, libra: 453.592, oz: 28.349, onza: 28.349,
      ml: 1, l: 1000, litro: 1000, gal: 3785.41,
      unidad: 1, unidades: 1, item: 1
    };

    const bUnit = convBulkUnit.toLowerCase();
    const pUnit = convPortionUnit.toLowerCase();

    const multBulk = units[bUnit] || 1;
    const multPortion = units[pUnit] || 1;

    const bulkBase = bulkQty * multBulk;
    const portionBase = portionQty * multPortion;

    const costPerBase = price / bulkBase;
    const finalCost = portionBase * costPerBase;

    setConvResult(finalCost);
  };

  const applyConvToForm = () => {
    if (convPrice && convBulkQty && convBulkUnit) {
      setPurchasePrice(convPrice);
      setPurchaseQty(convBulkQty);
      setPurchaseUnit(convBulkUnit);
      setConvOpen(false);
    }
  };

  const filteredIngredients = ingredients.filter(ing => 
    ing.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Buscador y Botón Agregar */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            placeholder="Buscar insumo..."
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
      ) : filteredIngredients.length === 0 ? (
        <div className="card text-center" style={{ padding: '40px' }}>
          <FolderHeart size={40} style={{ color: 'hsl(var(--primary) / 0.5)', marginBottom: '12px' }} />
          <p>No se encontraron insumos.</p>
          <button className="btn btn-secondary mt-4" onClick={handleOpenAdd}>Agregar Insumo</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredIngredients.map((ing) => (
            <div key={ing.id} className="card flex-between" style={{ padding: '16px 20px' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{ing.name}</h4>
                <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                  Compra: ${ing.purchase_price.toFixed(2)} por {ing.purchase_qty} {ing.purchase_unit}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'hsl(var(--primary))', fontWeight: 500, marginTop: '2px' }}>
                  Costo: ${(ing.unit_cost).toFixed(4)} / {ing.purchase_unit}
                </p>
              </div>
              <div className="flex-gap">
                <button 
                  onClick={() => handleOpenEdit(ing)}
                  style={{ background: 'none', border: 'none', color: 'hsl(var(--text-secondary))', cursor: 'pointer', padding: '6px' }}
                >
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(ing.id)}
                  style={{ background: 'none', border: 'none', color: 'hsl(var(--error) / 0.8)', cursor: 'pointer', padding: '6px' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL AGREGAR / EDITAR */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex-between" style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'hsl(var(--primary))' }}>
                {editingId ? 'Editar Insumo' : 'Nuevo Insumo'}
              </h3>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'hsl(var(--text-secondary))', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label>Nombre del Insumo</label>
                <input
                  type="text"
                  placeholder="Ej. Carne de Res, Queso Cheddar, Aceite"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Precio Compra ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Cantidad Compra</label>
                  <input
                    type="number"
                    step="0.001"
                    placeholder="1.00"
                    value={purchaseQty}
                    onChange={(e) => setPurchaseQty(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Unidad de Compra</label>
                <select value={purchaseUnit} onChange={(e) => setPurchaseUnit(e.target.value)}>
                  <option value="kg">Kilogramo (kg)</option>
                  <option value="g">Gramo (g)</option>
                  <option value="l">Litro (L)</option>
                  <option value="ml">Mililitro (mL)</option>
                  <option value="lb">Libra (lb)</option>
                  <option value="oz">Onza (oz)</option>
                  <option value="unidad">Unidad / Pieza</option>
                </select>
              </div>

              {/* Botón para abrir la calculadora dentro del modal */}
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setConvOpen(!convOpen)}
                style={{ fontSize: '0.85rem', padding: '8px 12px', justifyContent: 'center' }}
              >
                <Calculator size={16} /> 
                {convOpen ? 'Ocultar Calculadora Granel' : 'Abrir Calculadora Granel'}
              </button>

              {/* CALCULADORA / CONVERSOR INTEGRADO */}
              {convOpen && (
                <div style={{
                  backgroundColor: 'hsl(var(--surface-card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  padding: '16px',
                  marginTop: '4px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calculator size={14} /> Conversor de Granel a Porción
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '0.75rem' }}>Cantidad de Compra</label>
                      <input 
                        type="number" 
                        placeholder="20" 
                        value={convBulkQty}
                        onChange={(e) => setConvBulkQty(e.target.value)}
                        style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '0.75rem' }}>Unidad Compra</label>
                      <select 
                        value={convBulkUnit}
                        onChange={(e) => setConvBulkUnit(e.target.value)}
                        style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                      >
                        <option value="kg">kg</option>
                        <option value="lb">lb</option>
                        <option value="l">litro</option>
                        <option value="unidad">unidad</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.75rem' }}>Precio de Compra Total ($)</label>
                    <input 
                      type="number" 
                      placeholder="80.00" 
                      value={convPrice}
                      onChange={(e) => setConvPrice(e.target.value)}
                      style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '0.75rem' }}>Porción Usada en Receta</label>
                      <input 
                        type="number" 
                        placeholder="1.5" 
                        value={convPortionQty}
                        onChange={(e) => setConvPortionQty(e.target.value)}
                        style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '0.75rem' }}>Unidad Porción</label>
                      <select 
                        value={convPortionUnit}
                        onChange={(e) => setConvPortionUnit(e.target.value)}
                        style={{ padding: '8px 10px', fontSize: '0.85rem' }}
                      >
                        <option value="g">g</option>
                        <option value="oz">oz</option>
                        <option value="ml">ml</option>
                        <option value="unidad">unidad</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button type="button" className="btn btn-primary" onClick={runConversion} style={{ padding: '8px', fontSize: '0.8rem' }}>
                      <RefreshCw size={14} /> Calcular Costo Porción
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={applyConvToForm} style={{ padding: '8px', fontSize: '0.8rem' }}>
                      Cargar en Insumo
                    </button>
                  </div>

                  {convResult !== null && (
                    <div style={{
                      backgroundColor: 'rgba(var(--primary-rgb), 0.1)',
                      border: '1px dashed hsl(var(--primary))',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      textAlign: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'hsl(var(--primary))'
                    }}>
                      Costo estimado por porción: ${convResult.toFixed(3)}
                    </div>
                  )}
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                {editingId ? 'Guardar Cambios' : 'Crear Insumo'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
