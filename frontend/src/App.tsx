import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigation } from './components/Navigation';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Ingredients } from './pages/Ingredients';
import { Recipes } from './pages/Recipes';
import { Overheads } from './pages/Overheads';
import { Forecast } from './pages/Forecast';

type TabType = 'dashboard' | 'ingredients' | 'recipes' | 'overheads' | 'forecast';

const MainApp: React.FC = () => {
  const { token, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'hsl(var(--background))',
        color: 'hsl(var(--text))'
      }}>
        <span className="spinner" style={{ width: '40px', height: '40px', color: 'hsl(var(--primary))' }}></span>
        <p style={{ marginTop: '12px', fontSize: '0.9rem' }}>Cargando Estimador de Costos...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <main className="app-container">
        <Auth />
      </main>
    );
  }

  return (
    <>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="app-container" style={{ paddingBottom: '88px' }}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'ingredients' && <Ingredients />}
        {activeTab === 'recipes' && <Recipes />}
        {activeTab === 'overheads' && <Overheads />}
        {activeTab === 'forecast' && <Forecast />}
      </main>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;
