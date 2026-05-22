import React, { useState } from 'react';
import { useMockStore } from '../../hooks/useMockStore';
import CustomSelect from '../../components/ui/Select';
import { 
  Users, DollarSign, ShieldAlert, Radio, Settings, 
  MessageSquare, Sliders, Trophy, Plus, RefreshCw, 
  AlertTriangle, CheckCircle2, TrendingUp, HelpCircle
} from 'lucide-react';

export default function OperatorDashboard() {
  const { 
    affiliates, activeMissions, leadsFrios, systemConfig, webhookLogs,
    addMission, triggerWhatsAppAutomation, updateSystemConfig 
  } = useMockStore();

  // Controle de Abas do Operador
  const [activeTab, setActiveTab] = useState<'overview' | 'crm' | 'campaigns' | 'settings'>('overview');

  // Estados para Criação de Missões
  const [missionTitle, setMissionTitle] = useState('');
  const [missionGame, setMissionGame] = useState('Fortune Tiger');
  const [missionTarget, setMissionTarget] = useState('');
  const [missionXp, setMissionXp] = useState('');

  // Estados para Configurações do Sistema
  const [inputCpa, setInputCpa] = useState(systemConfig.globalCpa.toString());
  const [inputRevShare, setInputRevShare] = useState(systemConfig.baseRevShare.toString());
  const [configSuccess, setConfigSuccess] = useState(false);

  // Estado para template do WhatsApp CRM
  const [whatsappTemplate, setWhatsappTemplate] = useState('bonus_deposit');

  // Handlers
  const handleCreateMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!missionTitle || !missionTarget || !missionXp) return;
    
    addMission({
      title: missionTitle,
      game: missionGame,
      targetAmount: Number(missionTarget),
      rewardXp: Number(missionXp)
    });

    setMissionTitle('');
    setMissionTarget('');
    setMissionXp('');
  };

  const handleUpdateConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemConfig({
      globalCpa: Number(inputCpa),
      baseRevShare: Number(inputRevShare)
    });
    setConfigSuccess(true);
    setTimeout(() => setConfigSuccess(false), 2000);
  };

  // Métricas Consolidadas baseadas no Estado Central
  const totalPlayers = affiliates.reduce((acc, aff) => acc + aff.playersCount, 0);
  const totalCpaPaid = affiliates.reduce((acc, aff) => acc + aff.cpaEarned, 0);
  const totalRevsharePaid = affiliates.reduce((acc, aff) => acc + aff.revShareEarned, 0);
  
  // GGR Fake Estimado do Cassino (Volume jogado * margem retida)
  const estimatedGgr = (totalCpaPaid + totalRevsharePaid) * 2.4; 

  return (
    <div className="min-h-screen bg-[#060608] text-gray-100 flex font-sans">
      
      {/* SIDEBAR DO OPERADOR */}
      <aside className="w-64 bg-[#09090d] border-r border-gray-800/60 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-red-500/20">
              Ω
            </div>
            <div>
              <span className="font-black text-md tracking-wider block text-white">HQ OPERADOR</span>
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest -mt-1 block">Casino Admin</span>
            </div>
          </div>

          <nav className="space-y-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">Visão Geral</p>
            
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'overview' ? 'bg-red-600 text-white shadow-md shadow-red-600/20' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.01]'}`}
            >
              <TrendingUp size={15} /> Painel de Receita
            </button>

            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 pt-4 mb-2">Retenção Ativa</p>

            <button
              onClick={() => setActiveTab('crm')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'crm' ? 'bg-red-600 text-white shadow-md shadow-red-600/20' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.01]'}`}
            >
              <MessageSquare size={15} /> Recuperação de Leads
            </button>

            <button
              onClick={() => setActiveTab('campaigns')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'campaigns' ? 'bg-red-600 text-white shadow-md shadow-red-600/20' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.01]'}`}
            >
              <Trophy size={15} /> Campanhas (Gamify)
            </button>

            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 pt-4 mb-2">Governança</p>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'settings' ? 'bg-red-600 text-white shadow-md shadow-red-600/20' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.01]'}`}
            >
              <Sliders size={15} /> Regras e Comissões
            </button>
          </nav>
        </div>

        <div className="p-3 bg-red-950/10 border border-red-900/30 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-red-900/30 border border-red-500/30 flex items-center justify-center font-bold text-xs text-red-400">
            ADM
          </div>
          <div>
            <p className="text-xs font-bold text-white">Diretoria Executiva</p>
            <span className="text-[10px] text-gray-500 block">Acesso Master</span>
          </div>
        </div>
      </aside>

      {/* ÁREA CENTRAL DE CONTEÚDO */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen space-y-6">
        
        {/* HEADER */}
        <header className="border-b border-gray-800/50 pb-5">
          <h1 className="text-2xl font-black text-white">Central do Operador</h1>
          <p className="text-gray-400 text-xs mt-0.5">Controle financeiro da banca, automações de CRM e configuração de margens.</p>
        </header>

        {/* ---------------- SESSÃO 1: PAINEL DE RECEITA ---------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* CARDS DE MONITORAMENTO MASTER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#0c0c10] border border-gray-800/80 p-5 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Faturamento GGR Estimado</p>
                <h3 className="text-2xl font-black text-amber-400 mt-1">R$ {estimatedGgr.toFixed(2)}</h3>
                <span className="text-[10px] text-gray-500 block mt-1">Margem retida líquida da casa</span>
              </div>

              <div className="bg-[#0c0c10] border border-gray-800/80 p-5 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Pago em CPA</p>
                <h3 className="text-2xl font-black text-red-400 mt-1">R$ {totalCpaPaid.toFixed(2)}</h3>
                <span className="text-[10px] text-gray-400 block mt-1">Custo por primeiro depósito</span>
              </div>

              <div className="bg-[#0c0c10] border border-gray-800/80 p-5 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Pago em RevShare</p>
                <h3 className="text-2xl font-black text-purple-400 mt-1">R$ {totalRevsharePaid.toFixed(2)}</h3>
                <span className="text-[10px] text-gray-400 block mt-1">Divisão de perdas de usuários</span>
              </div>

              <div className="bg-[#0c0c10] border border-gray-800/80 p-5 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Jogadores Cadastrados (Rede)</p>
                <h3 className="text-2xl font-black text-blue-400 mt-1">{totalPlayers} usuários</h3>
                <span className="text-[10px] text-emerald-400 font-semibold block mt-1">Média Saudável de LTV</span>
              </div>
            </div>

            {/* PERFORMANCE DE AFILIADOS PARCEIROS */}
            <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Desempenho Comercial por Afiliado</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-400">
                  <thead className="bg-black/40 font-mono text-[10px] text-gray-500 uppercase">
                    <tr>
                      <th className="p-3">Afiliado</th>
                      <th className="p-3">Código</th>
                      <th className="p-3">Cliques ➔ FTD</th>
                      <th className="p-3">CPA Liberado</th>
                      <th className="p-3 text-right">RevShare Pago</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-900 text-gray-300">
                    {affiliates.map(aff => (
                      <tr key={aff.id} className="hover:bg-white/[0.01]">
                        <td className="p-3 font-bold text-white">{aff.name}</td>
                        <td className="p-3 font-mono text-gray-500">{aff.code}</td>
                        <td className="p-3 font-mono">{aff.funnel.clicks} / <span className="text-emerald-400 font-bold">{aff.funnel.ftds}</span></td>
                        <td className="p-3 font-mono text-red-400">R$ {aff.cpaEarned.toFixed(2)}</td>
                        <td className="p-3 font-mono text-right text-purple-400">R$ {aff.revShareEarned.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SESSÃO 2: CRM & RECUPERAÇÃO DE LEADS ---------------- */}
        {activeTab === 'crm' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            <div className="lg:col-span-2 bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-md font-bold text-white flex items-center gap-2"><MessageSquare size={16} className="text-red-400" /> Funil de Leads Frios (Aguardando Primeiro Depósito)</h3>
                <p className="text-xs text-gray-500 mt-1">Estes usuários se cadastraram pelo link de algum afiliado, mas ainda não fizeram o FTD. Dispare gatilhos automáticos para convertê-los.</p>
              </div>

              {/* SELETOR DE TEMPLATE DE DISPARO */}
              <div className="bg-black/30 border border-gray-900 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">1. Escolha a Estratégia do WhatsApp</span>
                  <p className="text-xs text-gray-400 mt-0.5">Template injetável dinamicamente via API.</p>
                </div>
                <CustomSelect
                  options={[
                    { value: 'bonus_deposit', label: 'Bônus 200% no FTD' },
                    { value: 'free_spins', label: '10 Rodadas Grátis no Tigrinho' },
                    { value: 'scarcity_alert', label: 'Aviso: Conta Expirando em 24h' }
                  ]}
                  value={whatsappTemplate}
                  onChange={(val) => setWhatsappTemplate(val)}
                  className="w-full sm:w-64"
                />
              </div>

              {/* LISTA DE LEADS INATIVOS */}
              <div className="overflow-hidden border border-gray-900 rounded-xl">
                <table className="w-full text-left text-xs text-gray-400">
                  <thead className="bg-black/20 text-gray-500 font-mono text-[10px] uppercase">
                    <tr>
                      <th className="p-3">Lead</th>
                      <th className="p-3">Contato</th>
                      <th className="p-3">Inatividade</th>
                      <th className="p-3 text-right">Ação Comercial</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-900 text-gray-300">
                    {leadsFrios.map((lead) => (
                      <tr key={lead.id} className="hover:bg-white/[0.01]">
                        <td className="p-3 font-bold text-white">{lead.name}</td>
                        <td className="p-3 font-mono text-gray-500">{lead.whatsapp}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${lead.daysInactive > 5 ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {lead.daysInactive} dias parado
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => triggerWhatsAppAutomation(lead.id, whatsappTemplate)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-[11px] px-3 py-1.5 rounded-lg transition-all"
                          >
                            Disparar Whats
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* LIVE SYSTEM LOGS FEED */}
            <div className="bg-[#0b0b0e] border border-gray-900 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2 mb-4"><Radio size={14} className="text-red-500 animate-pulse" /> Live CRM Trigger Feed</h4>
                <div className="space-y-2 font-mono text-[10px] max-h-[340px] overflow-y-auto pr-1">
                  {webhookLogs.map((log, i) => (
                    <div key={i} className="p-2 bg-black/50 border border-gray-900 rounded-lg">
                      <div className="flex justify-between text-gray-600 text-[9px] mb-0.5">
                        <span>{log.time}</span>
                        <span className="text-red-400 font-bold">{log.event}</span>
                      </div>
                      <p className="text-gray-400 leading-relaxed">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SESSÃO 3: CAMPANHAS GAMIFICADAS ---------------- */}
        {activeTab === 'campaigns' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            {/* CRIADOR DE CAMPANHAS */}
            <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-md font-bold text-white flex items-center gap-2"><Trophy size={16} className="text-yellow-500" /> Nova Campanha de Retenção</h3>
                <p className="text-xs text-gray-500 mt-1">Crie metas coletivas de apostas (Rollover) em jogos específicos. Quando a base atinge a meta, os afiliados ganham multiplicadores de XP.</p>
              </div>

              <form onSubmit={handleCreateMission} className="space-y-3 pt-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Título da Campanha</label>
                  <input type="text" placeholder="Ex: Corrida do Ouro no Tigre" value={missionTitle} onChange={(e) => setMissionTitle(e.target.value)} className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Jogo Alvo</label>
                    <select value={missionGame} onChange={(e) => setMissionGame(e.target.value)} className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none">
                      <option value="Fortune Tiger">Fortune Tiger</option>
                      <option value="Mines">Mines</option>
                      <option value="Aviator">Aviator</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Recompensa (XP)</label>
                    <input type="number" placeholder="Ex: 100" value={missionXp} onChange={(e) => setMissionXp(e.target.value)} className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Rollover Alvo da Base (R$)</label>
                  <input type="number" placeholder="Ex: 5000" value={missionTarget} onChange={(e) => setMissionTarget(e.target.value)} className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500" />
                </div>

                <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-1">
                  <Plus size={14} /> Ativar Campanha na API
                </button>
              </form>
            </div>

            {/* CAMPANHAS EM EXECUÇÃO */}
            <div className="lg:col-span-2 bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Campanhas Ativas Monitoradas por Webhook</h3>
              <div className="space-y-4">
                {activeMissions.map((mission) => (
                  <div key={mission.id} className="bg-black/30 border border-gray-900 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-xs text-white">{mission.title}</h4>
                        <span className="text-[9px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded font-bold uppercase mt-1 inline-block">{mission.game}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">Bônus: <span className="text-amber-400 font-bold">+{mission.rewardXp} XP</span></span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-3 mb-1">
                      <span>Volume Processado</span>
                      <span>R$ {mission.currentProgress} / R$ {mission.targetAmount}</span>
                    </div>
                    <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${(mission.currentProgress / mission.targetAmount) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SESSÃO 4: REGRAS E GOVERNANÇA ---------------- */}
        {activeTab === 'settings' && (
          <div className="max-w-xl bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-6 space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-md font-bold text-white flex items-center gap-2"><Settings size={16} className="text-red-400" /> Regras de Negócio Globais</h3>
              <p className="text-xs text-gray-500 mt-1">Configure o comportamento automático das comissões pagas para os afiliados ao redor da plataforma.</p>
            </div>

            <form onSubmit={handleUpdateConfig} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Taxa CPA Global Padrão (R$)</label>
                  <input type="number" value={inputCpa} onChange={(e) => setInputCpa(e.target.value)} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500" />
                  <span className="text-[9px] text-gray-600 font-mono mt-1 block">Valor pago por FTD qualificado</span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">RevShare Global Base (%)</label>
                  <input type="number" value={inputRevShare} onChange={(e) => setInputRevShare(e.target.value)} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500" />
                  <span className="text-[9px] text-gray-600 font-mono mt-1 block">Porcentagem das perdas líquidas</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button type="submit" className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg">
                  Salvar Parâmetros
                </button>
                {configSuccess && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
                    <CheckCircle2 size={14} /> Atualizado com sucesso!
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
