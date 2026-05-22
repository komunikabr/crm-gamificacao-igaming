import React, { useState } from 'react';
import AffiliateDashboard from './pages/affiliate/Dashboard';
import OperatorDashboard from './pages/operator/Dashboard';
import { Users, ShieldAlert } from 'lucide-react';

function App() {
  // 'affiliate' exibe a tela do parceiro, 'operator' exibe a tela do cassino
  const [currentView, setCurrentView] = useState<'affiliate' | 'operator'>('affiliate');

  return (
    <div className="relative min-h-screen bg-[#060608]">
      
      {/* CHAVE SELETORA FLUTUANTE DE PROTÓTIPO */}
      <div className="fixed bottom-6 right-6 z-50 bg-gray-900/90 backdrop-blur-md border border-gray-800 p-2 rounded-2xl flex gap-1 shadow-2xl shadow-black">
        <button
          onClick={() => setCurrentView('affiliate')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            currentView === 'affiliate'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
          }`}
        >
          <Users size={14} /> Vista: Afiliado
        </button>
        
        <button
          onClick={() => setCurrentView('operator')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            currentView === 'operator'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
          }`}
        >
          <ShieldAlert size={14} /> Vista: Operador
        </button>
      </div>

      {/* RENDERIZAÇÃO DINÂMICA DA TELA */}
      {currentView === 'affiliate' ? <AffiliateDashboard /> : <OperatorDashboard />}

    </div>
  );
}

export default App;
