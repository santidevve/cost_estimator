import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Store, Eye, EyeOff } from 'lucide-react';

export const Auth: React.FC = () => {
  const { login, register, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Por favor complete todos los campos obligatorios.');
      return;
    }

    if (password.length < 6) {
      setFormError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    let success = false;
    if (isLogin) {
      success = await login(email, password);
    } else {
      success = await register(email, password, businessName);
    }
    setLoading(false);

    if (success) {
      // Limpiar campos si es exitoso
      setEmail('');
      setPassword('');
      setBusinessName('');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '16px',
    }}>
      <div className="card card-accent" style={{ padding: '32px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'hsl(var(--primary))' }}>
            {isLogin ? '¡Bienvenido de Nuevo!' : 'Crear Tu Cuenta'}
          </h2>
          <p style={{ marginTop: '6px' }}>
            {isLogin 
              ? 'Inicia sesión para calcular los costos de tu negocio.' 
              : 'Registra tu negocio para empezar a estimar ganancias.'}
          </p>
        </div>

        {(error || formError) && (
          <div className="alert alert-error" style={{ marginBottom: '20px' }}>
            <span>{formError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <div style={{ position: 'relative' }}>
              <input
                id="email"
                type="email"
                placeholder="ejemplo@negocio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '44px' }}
                required
              />
              <Mail size={18} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'hsl(var(--text-secondary) / 0.7)'
              }} />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="businessName">Nombre del Negocio</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="businessName"
                  type="text"
                  placeholder="Hamburguesas Don Pepe"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
                <Store size={18} style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'hsl(var(--text-secondary) / 0.7)'
                }} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '44px', paddingRight: '44px' }}
                required
              />
              <Lock size={18} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'hsl(var(--text-secondary) / 0.7)'
              }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'hsl(var(--text-secondary) / 0.7)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }} disabled={loading}>
            {loading ? <span className="spinner"></span> : (isLogin ? 'Iniciar Sesión' : 'Registrar Negocio')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setFormError(null);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'hsl(var(--primary))',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            {isLogin ? '¿No tienes cuenta? Registrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};
