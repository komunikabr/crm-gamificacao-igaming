import React, { useState } from 'react';
import { useMockStore } from './hooks/useMockStore';
import AffiliateDashboard from './pages/affiliate/Dashboard';
import OperatorDashboard from './pages/operator/Dashboard';
import { Users, ShieldAlert, ChevronDown, Building2, LogIn } from 'lucide-react';

function AccountSelector() {
  const {
    operators, affiliates, currentOperatorId, currentAffiliateId, currentView,
    setCurrentOperator, setCurrentAffiliate, setCurrentView,
  } = useMockStore();

  const [step, setStep] = useState<'operator' | 'role'>('operator');
  const [selectedOpId, setSelectedOpId] = useState('');

  const handleSelectOperator = (id: string) => {
    setSelectedOpId(id);
    setStep('role');
  };

  const handleEnterAsOperator = () => {
    setCurrentOperator(selectedOpId);
    setCurrentView('operator');
  };

  const handleEnterAsAffiliate = (affId: string) => {
    setCurrentOperator(selectedOpId);
    setCurrentAffiliate(affId);
    setCurrentView('affiliate');
  };

  const opAffiliates = affiliates.filter(a => a.operatorId === selectedOpId);
  const selectedOp = operators.find(o => o.id === selectedOpId);

  return (
    <div className="min-h-screen bg-[#060608] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 shadow-lg shadow-purple-500/30 mb-2">
            <span className="font-black text-2xl text-white">G</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-wider">GAMIFY iGaming CRM</h1>
          <p className="text-gray-500 text-xs">Plataforma SaaS de Atribuição & Gamificação</p>
        </div>

        {step === 'operator' && (
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">Selecione o Operador</p>
            {operators.map(op => (
              <button
                key={op.id}
                onClick={() => handleSelectOperator(op.id)}
                className="w-full bg-[#0c0c10] border border-gray-800 hover:border-purple-600/50 p-4 rounded-2xl flex items-center gap-4 transition-all group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-black text-sm text-white shrink-0 shadow-md shadow-amber-500/20">
                  {op.brandName.slice(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm truncate">{op.brandName}</p>
                  <p className="text-[10px] text-gray-500 truncate">{op.companyName}</p>
                </div>
                <ChevronDown size={16} className="text-gray-600 group-hover:text-purple-400 -rotate-90 transition-colors shrink-0" />
              </button>
            ))}
          </div>
        )}

        {step === 'role' && selectedOp && (
          <div className="space-y-4">
            <button onClick={() => setStep('operator')} className="text-[10px] text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors">
              ← Trocar operador
            </button>
            <div className="bg-[#0c0c10] border border-amber-500/20 p-4 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-black text-sm text-white shrink-0">
                {selectedOp.brandName.slice(0, 1)}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{selectedOp.brandName}</p>
                <p className="text-[10px] text-gray-500">{selectedOp.companyName}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Entrar como Operador</p>
              <button
                onClick={handleEnterAsOperator}
                className="w-full bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 p-4 rounded-2xl flex items-center gap-4 transition-all group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-red-900/30 border border-red-500/30 flex items-center justify-center font-bold text-xs text-red-400 shrink-0">
                  ADM
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Diretoria / Admin</p>
                  <p className="text-[10px] text-gray-500">Acesso master ao painel do operador</p>
                </div>
                <LogIn size={16} className="text-amber-400 ml-auto shrink-0" />
              </button>
            </div>

            {opAffiliates.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Entrar como Afiliado</p>
                {opAffiliates.map(aff => (
                  <button
                    key={aff.id}
                    onClick={() => handleEnterAsAffiliate(aff.id)}
                    className="w-full bg-purple-500/5 border border-purple-900/40 hover:border-purple-500/50 p-4 rounded-2xl flex items-center gap-4 transition-all group text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center font-bold text-xs text-purple-300 shrink-0">
                      {aff.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm truncate">{aff.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">/{aff.code} · VIP {aff.level}</p>
                    </div>
                    <LogIn size={16} className="text-purple-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="text-center text-[10px] text-gray-700">
          Ambiente de demonstração SaaS · Dados simulados
        </p>
      </div>
    </div>
  );
}

function ViewSwitcher() {
  const { currentView, setCurrentView, currentOperatorId, operators, getCurrentAffiliate } = useMockStore();
  const [showSelector, setShowSelector] = useState(false);
  const op = operators.find(o => o.id === currentOperatorId);
  const aff = getCurrentAffiliate();

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 bg-gray-900/95 backdrop-blur-md border border-gray-800 p-1.5 rounded-2xl flex gap-1 shadow-2xl shadow-black">
        <button
          onClick={() => setCurrentView('affiliate')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
            currentView === 'affiliate'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
          }`}
        >
          <Users size={13} /> <span className="hidden sm:inline">Afiliado</span>
        </button>
        <button
          onClick={() => setCurrentView('operator')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
            currentView === 'operator'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
          }`}
        >
          <ShieldAlert size={13} /> <span className="hidden sm:inline">Operador</span>
        </button>
        <button
          onClick={() => setShowSelector(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-all"
          title="Trocar conta"
        >
          <Building2 size={13} />
        </button>
      </div>

      {showSelector && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowSelector(false)}
        >
          <div
            className="bg-[#0c0c10] border border-gray-800 rounded-2xl p-4 w-full max-w-sm max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Trocar conta</p>
            <button
              onClick={() => { setShowSelector(false); }}
              className="w-full text-center text-xs text-purple-400 hover:text-purple-300 py-3 border border-purple-900/40 rounded-xl transition-colors"
            >
              Voltar à seleção de operador
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  const { currentView, currentOperatorId, currentAffiliateId } = useMockStore();

  const isLoggedIn = !!currentOperatorId;

  if (!isLoggedIn) {
    return <AccountSelector />;
  }

  return (
    <div className="relative min-h-screen bg-[#060608]">
      {currentView === 'affiliate' ? <AffiliateDashboard /> : <OperatorDashboard />}
      <ViewSwitcher />
    </div>
  );
}
