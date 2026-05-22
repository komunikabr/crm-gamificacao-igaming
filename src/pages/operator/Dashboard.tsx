import React, { useState } from 'react';
import { useMockStore } from '../../hooks/useMockStore';
import CustomSelect from '../../components/ui/Select';
import { formatBRL, formatNum, formatPercent } from '../../utils/format';
import {
  Users, DollarSign, ShieldAlert, Radio, Settings,
  MessageSquare, Sliders, Trophy, Plus, RefreshCw,
  CheckCircle2, TrendingUp, Menu, X, Building2,
  UserPlus, ChevronRight
} from 'lucide-react';

type Tab = 'overview' | 'affiliates' | 'crm' | 'campaigns' | 'settings';

const NAV_ITEMS: { tab: Tab; label: string; icon: React.ReactNode; group: string }[] = [
  { tab: 'overview', label: 'Receita', icon: <TrendingUp size={15} />, group: 'Visão Geral' },
  { tab: 'affiliates', label: 'Afiliados', icon: <Users size={15} />, group: 'Visão Geral' },
  { tab: 'crm', label: 'Leads Frios', icon: <MessageSquare size={15} />, group: 'Retenção' },
  { tab: 'campaigns', label: 'Campanhas', icon: <Trophy size={15} />, group: 'Retenção' },
  { tab: 'settings', label: 'Comissões', icon: <Sliders size={15} />, group: 'Governança' },
];

export default function OperatorDashboard() {
  const {
    operators, affiliates, activeMissions, leadsFrios, webhookLogs,
    currentOperatorId, setCurrentOperator,
    getAffiliatesByOperator, getMissionsByOperator, getLeadsByOperator,
    addMission, triggerWhatsAppAutomation, updateOperatorConfig,
    addAffiliate,
  } = useMockStore();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const op = operators.find(o => o.id === currentOperatorId)!;
  const opAffiliates = getAffiliatesByOperator(currentOperatorId);
  const opMissions = getMissionsByOperator(currentOperatorId);
  const opLeads = getLeadsByOperator(currentOperatorId);

  const [missionTitle, setMissionTitle] = useState('');
  const [missionGame, setMissionGame] = useState('Fortune Tiger');
  const [missionTarget, setMissionTarget] = useState('');
  const [missionXp, setMissionXp] = useState('');

  const [inputCpa, setInputCpa] = useState(op.globalCpa.toString());
  const [inputRevShare, setInputRevShare] = useState(op.globalRevShare.toString());
  const [configSuccess, setConfigSuccess] = useState(false);

  const [whatsappTemplate, setWhatsappTemplate] = useState('bonus_deposit');

  const [newAffName, setNewAffName] = useState('');
  const [newAffEmail, setNewAffEmail] = useState('');
  const [newAffCode, setNewAffCode] = useState('');
  const [newAffSuccess, setNewAffSuccess] = useState(false);

  const totalPlayers = opAffiliates.reduce((acc, a) => acc + a.playersCount, 0);
  const totalCpa = opAffiliates.reduce((acc, a) => acc + a.cpaEarned, 0);
  const totalRevShare = opAffiliates.reduce((acc, a) => acc + a.revShareEarned, 0);
  const estimatedGgr = (totalCpa + totalRevShare) * 2.4;

  const handleCreateMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!missionTitle || !missionTarget || !missionXp) return;
    addMission({ operatorId: currentOperatorId, title: missionTitle, game: missionGame, targetAmount: Number(missionTarget), rewardXp: Number(missionXp) });
    setMissionTitle(''); setMissionTarget(''); setMissionXp('');
  };

  const handleUpdateConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateOperatorConfig(currentOperatorId, { globalCpa: Number(inputCpa), globalRevShare: Number(inputRevShare) });
    setConfigSuccess(true);
    setTimeout(() => setConfigSuccess(false), 2500);
  };

  const handleAddAffiliate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAffName || !newAffEmail || !newAffCode) return;
    addAffiliate({ operatorId: currentOperatorId, name: newAffName, email: newAffEmail, code: newAffCode.toUpperCase(), revShare: op.globalRevShare, cpaRate: op.globalCpa });
    setNewAffName(''); setNewAffEmail(''); setNewAffCode('');
    setNewAffSuccess(true);
    setTimeout(() => setNewAffSuccess(false), 2500);
  };

  const switchTab = (tab: Tab) => { setActiveTab(tab); setSidebarOpen(false); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-red-500/20 shrink-0">Ω</div>
          <div>
            <span className="font-black text-sm tracking-wider block text-white">HQ OPERADOR</span>
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest -mt-0.5 block">Casino Admin</span>
          </div>
        </div>

        {operators.length > 1 && (
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-1.5">Operador</p>
            <select
              value={currentOperatorId}
              onChange={e => setCurrentOperator(e.target.value)}
              className="w-full bg-black/40 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              {operators.map(o => <option key={o.id} value={o.id}>{o.brandName}</option>)}
            </select>
          </div>
        )}

        <nav className="space-y-1">
          {['Visão Geral', 'Retenção', 'Governança'].map(group => (
            <div key={group}>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-1.5 mt-3">{group}</p>
              {NAV_ITEMS.filter(n => n.group === group).map(item => (
                <button
                  key={item.tab}
                  onClick={() => switchTab(item.tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === item.tab
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-3 bg-red-950/10 border border-red-900/30 rounded-xl flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-900/30 border border-red-500/30 flex items-center justify-center font-bold text-[10px] text-red-400 shrink-0">ADM</div>
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-white truncate">{op.brandName}</p>
          <span className="text-[10px] text-gray-500 block">Acesso Master</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060608] text-gray-100 flex font-sans">

      {/* SIDEBAR DESKTOP */}
      <aside className="w-60 bg-[#09090d] border-r border-gray-800/60 p-5 flex-col justify-between hidden md:flex shrink-0">
        <SidebarContent />
      </aside>

      {/* DRAWER MOBILE */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#09090d] border-r border-gray-800 p-5 flex flex-col z-10">
            <button onClick={() => setSidebarOpen(false)} className="self-end text-gray-500 hover:text-white mb-4"><X size={20} /></button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">

        {/* TOPBAR MOBILE */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-800/60 bg-[#09090d] sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center font-black text-sm text-white">Ω</div>
            <span className="font-black text-sm text-white">{op.brandName}</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white p-1"><Menu size={20} /></button>
        </div>

        <div className="p-4 md:p-7 space-y-5 flex-1">

          {/* HEADER */}
          <header className="border-b border-gray-800/50 pb-4">
            <h1 className="text-xl md:text-2xl font-black text-white">Central do Operador</h1>
            <p className="text-gray-500 text-xs mt-0.5">Controle financeiro, CRM, campanhas e afiliados de <span className="text-amber-400 font-bold">{op.brandName}</span>.</p>
          </header>

          {/* TABS MOBILE */}
          <div className="flex gap-1 overflow-x-auto pb-1 md:hidden scrollbar-none">
            {NAV_ITEMS.map(item => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all shrink-0 ${
                  activeTab === item.tab
                    ? 'bg-red-600 text-white'
                    : 'bg-[#0c0c10] border border-gray-800 text-gray-400'
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          {/* ---- RECEITA ---- */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: 'GGR Estimado', value: formatBRL(estimatedGgr), sub: 'Margem retida da casa', color: 'text-amber-400' },
                  { label: 'Total Pago CPA', value: formatBRL(totalCpa), sub: 'Custo por FTD', color: 'text-red-400' },
                  { label: 'Total RevShare', value: formatBRL(totalRevShare), sub: 'Divisão de perdas', color: 'text-purple-400' },
                  { label: 'Jogadores (Rede)', value: formatNum(totalPlayers), sub: 'LTV saudável', color: 'text-blue-400' },
                ].map(card => (
                  <div key={card.label} className="bg-[#0c0c10] border border-gray-800/80 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-tight">{card.label}</p>
                    <h3 className={`text-xl md:text-2xl font-black mt-1 ${card.color}`}>{card.value}</h3>
                    <span className="text-[10px] text-gray-500 block mt-0.5">{card.sub}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Desempenho por Afiliado</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-400 min-w-[520px]">
                    <thead className="bg-black/40 font-mono text-[10px] text-gray-500 uppercase">
                      <tr>
                        <th className="p-3">Afiliado</th>
                        <th className="p-3">Código</th>
                        <th className="p-3">Cliques / FTDs</th>
                        <th className="p-3">CPA Pago</th>
                        <th className="p-3 text-right">RevShare</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900 text-gray-300">
                      {opAffiliates.map(aff => (
                        <tr key={aff.id} className="hover:bg-white/[0.02]">
                          <td className="p-3 font-bold text-white">{aff.name}</td>
                          <td className="p-3 font-mono text-gray-500 text-[11px]">{aff.code}</td>
                          <td className="p-3 font-mono">
                            {formatNum(aff.funnel.clicks)} / <span className="text-emerald-400 font-bold">{formatNum(aff.funnel.ftds)}</span>
                          </td>
                          <td className="p-3 font-mono text-red-400">{formatBRL(aff.cpaEarned)}</td>
                          <td className="p-3 font-mono text-right text-purple-400">{formatBRL(aff.revShareEarned)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ---- AFILIADOS ---- */}
          {activeTab === 'affiliates' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {opAffiliates.map(aff => (
                  <div key={aff.id} className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center font-bold text-xs text-purple-300 shrink-0">
                        {aff.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white text-sm truncate">{aff.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">/{aff.code} · VIP {aff.level}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-black/30 rounded-xl p-2">
                        <p className="text-[10px] text-gray-500">CPA Ganho</p>
                        <p className="text-sm font-black text-emerald-400">{formatBRL(aff.cpaEarned)}</p>
                      </div>
                      <div className="bg-black/30 rounded-xl p-2">
                        <p className="text-[10px] text-gray-500">RevShare</p>
                        <p className="text-sm font-black text-purple-400">{formatBRL(aff.revShareEarned)}</p>
                      </div>
                      <div className="bg-black/30 rounded-xl p-2">
                        <p className="text-[10px] text-gray-500">Jogadores</p>
                        <p className="text-sm font-black text-blue-400">{formatNum(aff.playersCount)}</p>
                      </div>
                      <div className="bg-black/30 rounded-xl p-2">
                        <p className="text-[10px] text-gray-500">Cliques</p>
                        <p className="text-sm font-black text-gray-300">{formatNum(aff.funnel.clicks)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-gray-500">XP: {aff.xp}/600</span>
                      <div className="w-24 bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full" style={{ width: `${Math.min((aff.xp / 600) * 100, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                  <UserPlus size={16} className="text-red-400" /> Cadastrar Novo Afiliado
                </h3>
                <form onSubmit={handleAddAffiliate} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input type="text" required placeholder="Nome completo" value={newAffName} onChange={e => setNewAffName(e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500" />
                    <input type="email" required placeholder="E-mail" value={newAffEmail} onChange={e => setNewAffEmail(e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500" />
                    <input type="text" required placeholder="Código (ex: JOAOSP)" value={newAffCode} onChange={e => setNewAffCode(e.target.value.toUpperCase())}
                      className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500 font-mono uppercase" />
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="submit" className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 active:scale-95">
                      <Plus size={14} /> Cadastrar Afiliado
                    </button>
                    {newAffSuccess && <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 size={14} /> Afiliado cadastrado!</span>}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ---- CRM ---- */}
          {activeTab === 'crm' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquare size={16} className="text-red-400" /> Leads Frios (Aguardando FTD)
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Usuários cadastrados sem primeiro depósito. Dispare automações para converter.</p>
                </div>

                <div className="bg-black/30 border border-gray-900 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Estratégia do WhatsApp</span>
                    <p className="text-xs text-gray-400 mt-0.5">Template injetável via API</p>
                  </div>
                  <CustomSelect
                    options={[
                      { value: 'bonus_deposit', label: 'Bônus 200% no FTD' },
                      { value: 'free_spins', label: '10 Rodadas Grátis no Tigrinho' },
                      { value: 'scarcity_alert', label: 'Conta Expirando em 24h' },
                    ]}
                    value={whatsappTemplate}
                    onChange={val => setWhatsappTemplate(val)}
                    className="w-full sm:w-60 shrink-0"
                  />
                </div>

                <div className="overflow-x-auto border border-gray-900 rounded-xl">
                  <table className="w-full text-left text-xs text-gray-400 min-w-[440px]">
                    <thead className="bg-black/20 text-gray-500 font-mono text-[10px] uppercase">
                      <tr>
                        <th className="p-3">Lead</th>
                        <th className="p-3">Contato</th>
                        <th className="p-3">Inatividade</th>
                        <th className="p-3 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900 text-gray-300">
                      {opLeads.map(lead => (
                        <tr key={lead.id} className="hover:bg-white/[0.02]">
                          <td className="p-3 font-bold text-white">{lead.name}</td>
                          <td className="p-3 font-mono text-gray-500 text-[11px]">{lead.whatsapp}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${lead.daysInactive > 5 ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                              {lead.daysInactive}d parado
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => triggerWhatsAppAutomation(lead.id, whatsappTemplate)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-[11px] px-3 py-1.5 rounded-lg transition-all active:scale-95"
                            >
                              Disparar WA
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-[#0b0b0e] border border-gray-900 rounded-2xl p-4 flex flex-col">
                <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2 mb-3">
                  <Radio size={14} className="text-red-500 animate-pulse" /> Live CRM Feed
                </h4>
                <div className="space-y-2 font-mono text-[10px] flex-1 overflow-y-auto max-h-72 pr-1">
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
          )}

          {/* ---- CAMPANHAS ---- */}
          {activeTab === 'campaigns' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Trophy size={16} className="text-yellow-500" /> Nova Campanha
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Crie metas coletivas de rollover. Afiliados ganham XP quando a base atinge o alvo.</p>
                </div>

                <form onSubmit={handleCreateMission} className="space-y-3 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Título</label>
                    <input type="text" placeholder="Ex: Corrida do Ouro no Tigre" value={missionTitle} onChange={e => setMissionTitle(e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Jogo</label>
                      <select value={missionGame} onChange={e => setMissionGame(e.target.value)}
                        className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none">
                        <option value="Fortune Tiger">Fortune Tiger</option>
                        <option value="Mines">Mines</option>
                        <option value="Aviator">Aviator</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Recompensa (XP)</label>
                      <input type="number" placeholder="100" value={missionXp} onChange={e => setMissionXp(e.target.value)}
                        className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Rollover Alvo (R$)</label>
                    <input type="number" placeholder="5000" value={missionTarget} onChange={e => setMissionTarget(e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500" />
                  </div>
                  <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95">
                    <Plus size={14} /> Ativar Campanha
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Campanhas Ativas</h3>
                <div className="space-y-4">
                  {opMissions.length === 0 ? (
                    <p className="text-xs text-gray-600 text-center py-8">Nenhuma campanha ativa. Crie a primeira!</p>
                  ) : opMissions.map(mission => (
                    <div key={mission.id} className="bg-black/30 border border-gray-900 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-xs text-white">{mission.title}</h4>
                          <span className="text-[9px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded font-bold uppercase mt-1 inline-block">{mission.game}</span>
                        </div>
                        <span className="text-[10px] text-amber-400 font-mono shrink-0">+{mission.rewardXp} XP</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-3 mb-1">
                        <span>Volume Processado</span>
                        <span>{formatBRL(mission.currentProgress)} / {formatBRL(mission.targetAmount)}</span>
                      </div>
                      <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${(mission.currentProgress / mission.targetAmount) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---- CONFIGURAÇÕES ---- */}
          {activeTab === 'settings' && (
            <div className="max-w-xl space-y-5">
              <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Settings size={16} className="text-red-400" /> Regras de Negócio — {op.brandName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Configure as comissões padrão para todos os afiliados desta plataforma.</p>
                </div>

                <form onSubmit={handleUpdateConfig} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">CPA Global Padrão (R$)</label>
                      <input type="number" value={inputCpa} onChange={e => setInputCpa(e.target.value)}
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500" />
                      <span className="text-[9px] text-gray-600 font-mono mt-1 block">Pago por FTD qualificado</span>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">RevShare Base (%)</label>
                      <input type="number" value={inputRevShare} onChange={e => setInputRevShare(e.target.value)}
                        className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500" />
                      <span className="text-[9px] text-gray-600 font-mono mt-1 block">% das perdas líquidas</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="submit" className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all active:scale-95">
                      Salvar Parâmetros
                    </button>
                    {configSuccess && (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 size={14} /> Atualizado com sucesso!
                      </span>
                    )}
                  </div>
                </form>
              </div>

              <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Outros Operadores no SaaS</h4>
                {operators.filter(o => o.id !== currentOperatorId).map(o => (
                  <div key={o.id} className="flex items-center justify-between p-3 bg-black/30 rounded-xl border border-gray-900">
                    <div>
                      <p className="text-xs font-bold text-white">{o.brandName}</p>
                      <p className="text-[10px] text-gray-500">CPA: {formatBRL(o.globalCpa)} · RevShare: {o.globalRevShare}%</p>
                    </div>
                    <button onClick={() => setCurrentOperator(o.id)}
                      className="text-[10px] text-amber-400 font-bold hover:text-amber-300 flex items-center gap-1">
                      Gerenciar <ChevronRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
