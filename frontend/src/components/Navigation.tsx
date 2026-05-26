import React from 'react';
import { 
  LayoutDashboard, 
  ChefHat, 
  FolderHeart, 
  TrendingUp, 
  Receipt,
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type TabType = 'dashboard' | 'ingredients' | 'recipes' | 'overheads' | 'forecast';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'ingredients', label: 'Insumos', icon: FolderHeart },
    { id: 'recipes', label: 'Recetas', icon: ChefHat },
    { id: 'overheads', label: 'Gastos', icon: Receipt },
    { id: 'forecast', label: 'Simulador', icon: TrendingUp },
  ] as const;

  return (
    <>
      {/* Barra superior de título / marca */}
      <header style={{
        backgroundColor: 'hsl(var(--surface))',
        borderBottom: '1px solid hsl(var(--border))',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', color: 'hsl(var(--primary))' }}>🍔 Costos Comida</h1>
          {user && <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))' }}>{user.businessName}</span>}
        </div>
        <button 
          onClick={logout} 
          style={{
            background: 'none',
            border: 'none',
            color: 'hsl(var(--error))',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Cerrar Sesión"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* Barra de navegación inferior fija para móviles */}
      <nav style={{
        backgroundColor: 'hsl(var(--surface))',
        borderTop: '1px solid hsl(var(--border))',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 999,
        paddingBottom: 'env(safe-area-inset-bottom)', // Soporte para gestos de iPhone/Android modernos
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                background: 'none',
                border: 'none',
                color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--text-secondary))',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                fontWeight: isActive ? 600 : 400,
                width: '100%',
                height: '100%',
                transition: 'color 0.2s ease',
              }}
            >
              <Icon size={20} style={{ transform: isActive ? 'scale(1.1)' : 'none', transition: 'transform 0.2s ease' }} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
