import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Trash2, 
  X, 
  DollarSign, 
  Receipt,
  Edit3
} from 'lucide-react';

interface Overhead {
  id: string;
  name: string;
  amount: number;
  frequency: string;
  monthly_equivalent: number;
  daily_equivalent: number;
}

export const Overheads: React.FC = () => {
  const { getAuthHeaders, apiUrl } = useAuth();
  const [overheads, setOverheads] = useState<Overhead[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados del Formulario/Modal
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('monthly');

  const fetchOverheads = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/overheads`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setOverheads(data);
      }
    } catch (err) {
      console.error('Error al cargar gastos fijos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverheads();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setAmount('');
    setFrequency('monthly');
    setIsOpen(true);
  };

  const handleOpenEdit = (item: Overhead) => {
    setEditingId(item.id);
    setName(item.name);
    setAmount(item.amount.toString());
    setFrequency(item.frequency);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este gasto fijo?')) return;
    try {
      const res = await fetch(`${apiUrl}/overheads/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setOverheads(overheads.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error('Error al eliminar gasto fijo:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !frequency) return;

    const payload = {
      name,
      amount: parseFloat(amount),
      frequency,
    };

    try {
      const url = editingId 
        ? `${apiUrl}/overheads/${editingId}`
        : `${apiUrl}/overheads`;

      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsOpen(false);
        fetchOverheads();
      }
    } catch (err) {
      console.error('Error al guardar gasto fijo:', err);
    }
  };

  const totalMonthly = overheads.reduce((sum, item) => sum + item.monthly_equivalent, 0);
  const totalDaily = overheads.reduce((sum, item) => sum + item.daily_equivalent, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Resumen de Gastos */}
      <div className="card card-accent" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '16px 20px', textAlign: 'center' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', display: 'block' }}>Gastos Mensuales</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'hsl(var(--primary))' }}>
            ${totalMonthly.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', display: 'block' }}>Gastos Diarios</span>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'hsl(var(--text))' }}>
            ${totalDaily.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <h3 style={{ fontSize: '1.15rem' }}>Lista de Gastos Fijos</h3>
        <button className="btn btn-primary" onClick={handleOpenAdd} style={{ width: 'auto', padding: '10px 16px', fontSize: '0.9rem' }}>
          <Plus size={18} /> Agregar Gasto
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
          <span className="spinner"></span>
        </div>
      ) : overheads.length === 0 ? (
        <div className="card text-center" style={{ padding: '40px' }}>
          <Receipt size={40} style={{ color: 'hsl(var(--primary) / 0.5)', marginBottom: '12px' }} />
          <p>No se han registrado gastos fijos (renta, gas, etc.).</p>
          <button className="btn btn-secondary mt-4" onClick={handleOpenAdd}>Agregar Gasto</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {overheads.map((item) => (
            <div key={item.id} className="card flex-between" style={{ padding: '14px 20px' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{item.name}</h4>
                <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                  Ingresado: ${item.amount.toFixed(2)} ({item.frequency === 'monthly' ? 'Mensual' : item.frequency === 'weekly' ? 'Semanal' : 'Diario'})
                </p>
                <p style={{ fontSize: '0.8rem', color: 'hsl(var(--primary))', fontWeight: 500, marginTop: '2px' }}>
                  Mensualizado: ${item.monthly_equivalent.toFixed(2)}/mes (o ${item.daily_equivalent.toFixed(2)}/día)
                </p>
              </div>
              <div className="flex-gap">
                <button 
                  onClick={() => handleOpenEdit(item)}
                  style={{ background: 'none', border: 'none', color: 'hsl(var(--text-secondary))', cursor: 'pointer', padding: '6px' }}
                >
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  style={{ background: 'none', border: 'none', color: 'hsl(var(--error) / 0.8)', cursor: 'pointer', padding: '6px' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL AGREGAR / EDITAR GASTO */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex-between" style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'hsl(var(--primary))' }}>
                {editingId ? 'Editar Gasto Fijo' : 'Nuevo Gasto Fijo'}
              </h3>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'hsl(var(--text-secondary))', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label>Nombre del Gasto</label>
                <input
                  type="text"
                  placeholder="Ej. Renta del Local, Sueldo Cajero, Luz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Monto ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Frecuencia de Pago</label>
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                  <option value="monthly">Mensual</option>
                  <option value="weekly">Semanal</option>
                  <option value="daily">Diario</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
                {editingId ? 'Guardar Cambios' : 'Crear Gasto'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
