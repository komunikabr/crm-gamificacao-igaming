import React, { useState } from 'react';
import { useMockStore } from '../../hooks/useMockStore';
import CustomSelect from '../../components/ui/Select';
import { formatBRL, formatNum } from '../../utils/format';
import {
  Users, ShieldAlert, Radio, Settings,
  MessageSquare, Sliders, Trophy, Plus,
  CheckCircle2, TrendingUp, Menu, X,
  UserPlus, ChevronRight, Wallet, Bot,
  Activity, CheckCheck, XCircle,
  AtSign, Send, Smartphone, Hash,
  AlertTriangle, Star, Crown, Zap,
  ToggleLeft, ToggleRight, Eye, EyeOff,
} from 'lucide-react';

type Tab = 'overview' | 'players' | 'affiliates' | 'crm' | 'campaigns' | 'payouts' | 'automations' | 'webhooks' | 'settings';

const NAV: { tab: Tab; label: string; icon: React.ReactNode; group: string }[] = [
  { tab: 'overview',     label: 'Receita',      icon: <TrendingUp size={14} />,    group: 'Visão Geral' },
  { tab: 'players',      label: 'Apostadores',  icon: <Users size={14} />,         group: 'Visão Geral' },
  { tab: 'affiliates',   label: 'Afiliados',    icon: <Star size={14} />,          group: 'Visão Geral' },
  { tab: 'crm',          label: 'Leads Frios',  icon: <MessageSquare size={14} />, group: 'Retenção' },
  { tab: 'campaigns',    label: 'Campanhas',    icon: <Trophy size={14} />,        group: 'Retenção' },
  { tab: 'payouts',      label: 'Saques',       icon: <Wallet size={14} />,        group: 'Financeiro' },
  { tab: 'automations',  label: 'Automações',   icon: <Bot size={14} />,           group: 'Integrações' },
  { tab: 'webhooks',     label: 'Webhooks',     icon: <Activity size={14} />,      group: 'Integrações' },
  { tab: 'settings',     label: 'Comissões',    icon: <Sliders size={14} />,       group: 'Governança' },
];

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  instagram: <AtSign size={14} />,
  tiktok: <Hash size={14} />,
  whatsapp: <Smartphone size={14} />,
  telegram: <Send size={14} />,
};
const PLATFORM_COLORS: Record<string, string> = {
  instagram: 'from-pink-600 to-orange-500',
  tiktok: 'from-slate-800 to-slate-600',
  whatsapp: 'from-green-600 to-emerald-500',
  telegram: 'from-blue-600 to-cyan-500',
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    PENDING:  { label: 'Pendente',  cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    PAID:     { label: 'Pago',      cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    REJECTED: { label: 'Rejeitado', cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
    SUCCESS:  { label: 'Sucesso',   cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    FAILED:   { label: 'Falhou',    cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
    IGNORED:  { label: 'Ignorado',  cls: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  };
  const m = map[status] ?? { label: status, cls: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
  return <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${m.cls}`}>{m.label}</span>;
}

export default function OperatorDashboard() {
  const {
    operators, affiliates, players, activeMissions, leadsFrios,
    commissionPayouts, socialAutomations, webhookLogs,
    currentOperatorId, setCurrentOperator,
    getAffiliatesByOperator, getMissionsByOperator, getLeadsByOperator,
    getPlayersByOperator, getPayoutsByOperator, getAutomationsByOperator,
    getWebhooksByOperator,
    addMission, triggerWhatsAppAutomation, updateOperatorConfig,
    addAffiliate, approvePayout, rejectPayout, toggleAutomation,
  } = useMockStore();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const op = operators.find(o => o.id === currentOperatorId)!;
  const opAffiliates  = getAffiliatesByOperator(currentOperatorId);
  const opMissions    = getMissionsByOperator(currentOperatorId);
  const opLeads       = getLeadsByOperator(currentOperatorId);
  const opPlayers     = getPlayersByOperator(currentOperatorId);
  const opPayouts     = getPayoutsByOperator(currentOperatorId);
  const opAutomations = getAutomationsByOperator(currentOperatorId);
  const opWebhooks    = getWebhooksByOperator(currentOperatorId);

  const [missionTitle, setMissionTitle] = useState('');
  const [missionGame, setMissionGame]   = useState('Fortune Tiger');
  const [missionTarget, setMissionTarget] = useState('');
  const [missionXp, setMissionXp]       = useState('');

  const [inputCpa, setInputCpa]         = useState(op.globalCpa.toString());
  const [inputRevShare, setInputRevShare] = useState(op.globalRevShare.toString());
  const [configSuccess, setConfigSuccess] = useState(false);

  const [whatsappTemplate, setWhatsappTemplate] = useState('bonus_deposit');

  const [newAffName, setNewAffName] = useState('');
  const [newAffEmail, setNewAffEmail] = useState('');
  const [newAffCode, setNewAffCode]   = useState('');
  const [newAffSuccess, setNewAffSuccess] = useState(false);

  const [playerSearch, setPlayerSearch] = useState('');
  const [playerFilter, setPlayerFilter] = useState<'all' | 'active' | 'inactive' | 'churned'>('all');

  const totalPlayers  = opAffiliates.reduce((a, x) => a + x.playersCount, 0);
  const totalCpa      = opAffiliates.reduce((a, x) => a + x.cpaEarned, 0);
  const totalRevShare = opAffiliates.reduce((a, x) => a + x.revShareEarned, 0);
  const estimatedGgr  = (totalCpa + totalRevShare) * 2.4;
  const pendingPayouts = opPayouts.filter(p => p.status === 'PENDING').reduce((a, x) => a + x.amount, 0);

  const filteredPlayers = opPlayers.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(playerSearch.toLowerCase()) || p.casinoPlayerId.toLowerCase().includes(playerSearch.toLowerCase());
    const matchFilter = playerFilter === 'all' || p.status === playerFilter;
    return matchSearch && matchFilter;
  });

  const sortedLeaderboard = [...opAffiliates].sort((a, b) => (b.cpaEarned + b.revShareEarned) - (a.cpaEarned + a.revShareEarned));

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

  const groups = ['Visão Geral', 'Retenção', 'Financeiro', 'Integrações', 'Governança'];

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between overflow-y-auto">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center font-black text-lg text-white shrink-0">Ω</div>
          <div>
            <span className="font-black text-sm tracking-wider block text-white">HQ OPERADOR</span>
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest block">Casino Admin</span>
          </div>
        </div>

        {operators.length > 1 && (
          <select value={currentOperatorId} onChange={e => setCurrentOperator(e.target.value)}
            className="w-full bg-black/40 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none">
            {operators.map(o => <option key={o.id} value={o.id}>{o.brandName}</option>)}
          </select>
        )}

        <nav className="space-y-0.5">
          {groups.map(group => (
            <div key={group}>
              <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest px-3 pt-3 pb-1">{group}</p>
              {NAV.filter(n => n.group === group).map(item => (
                <button key={item.tab} onClick={() => switchTab(item.tab)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === item.tab ? 'bg-red-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'}`}>
                  {item.icon} {item.label}
                  {item.tab === 'payouts' && opPayouts.filter(p => p.status === 'PENDING').length > 0 && (
                    <span className="ml-auto bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">
                      {opPayouts.filter(p => p.status === 'PENDING').length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-3 bg-red-950/10 border border-red-900/30 rounded-xl flex items-center gap-3 mt-4">
        <div className="w-8 h-8 rounded-full bg-red-900/30 border border-red-500/30 flex items-center justify-center font-bold text-[10px] text-red-400 shrink-0">ADM</div>
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-white truncate">{op.brandName}</p>
          <span className="text-[10px] text-gray-500">Acesso Master</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060608] text-gray-100 flex font-sans">
      <aside className="w-56 bg-[#09090d] border-r border-gray-800/60 p-4 flex-col hidden md:flex shrink-0">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#09090d] border-r border-gray-800 p-4 flex flex-col z-10">
            <button onClick={() => setSidebarOpen(false)} className="self-end text-gray-500 hover:text-white mb-3"><X size={20} /></button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-800/60 bg-[#09090d] sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center font-black text-sm text-white">Ω</div>
            <span className="font-black text-sm text-white">{op.brandName}</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 p-1"><Menu size={20} /></button>
        </div>

        <div className="p-4 md:p-6 space-y-5 flex-1">
          <header className="border-b border-gray-800/50 pb-4">
            <h1 className="text-xl md:text-2xl font-black text-white">Central do Operador</h1>
            <p className="text-gray-500 text-xs mt-0.5">Controle total de <span className="text-amber-400 font-bold">{op.brandName}</span> — receita, apostadores, afiliados e automações.</p>
          </header>

          <div className="flex gap-1 overflow-x-auto pb-1 md:hidden scrollbar-none">
            {NAV.map(item => (
              <button key={item.tab} onClick={() => setActiveTab(item.tab)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap shrink-0 transition-all ${activeTab === item.tab ? 'bg-red-600 text-white' : 'bg-[#0c0c10] border border-gray-800 text-gray-400'}`}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          {/* ===== RECEITA ===== */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: 'GGR Estimado',    value: formatBRL(estimatedGgr),  sub: 'Margem retida da casa',    color: 'text-amber-400' },
                  { label: 'CPA Total Pago',  value: formatBRL(totalCpa),      sub: 'Custo por FTD',            color: 'text-red-400' },
                  { label: 'RevShare Total',  value: formatBRL(totalRevShare),  sub: 'Divisão de perdas',        color: 'text-purple-400' },
                  { label: 'Rede (Jogadores)',value: formatNum(totalPlayers),   sub: 'Apostadores ativos',       color: 'text-blue-400' },
                ].map(c => (
                  <div key={c.label} className="bg-[#0c0c10] border border-gray-800/80 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-tight">{c.label}</p>
                    <h3 className={`text-xl md:text-2xl font-black mt-1 ${c.color}`}>{c.value}</h3>
                    <span className="text-[10px] text-gray-500 mt-0.5 block">{c.sub}</span>
                  </div>
                ))}
              </div>

              {pendingPayouts > 0 && (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={18} className="text-amber-400 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-amber-300">Saques Pendentes de Aprovação</p>
                      <p className="text-xs text-gray-400">{opPayouts.filter(p => p.status === 'PENDING').length} solicitações · Total: {formatBRL(pendingPayouts)}</p>
                    </div>
                  </div>
                  <button onClick={() => switchTab('payouts')} className="bg-amber-500 text-black font-bold text-xs px-4 py-2 rounded-xl shrink-0 hover:bg-amber-400 transition-all">Revisar</button>
                </div>
              )}

              <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-4">Desempenho por Afiliado</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-400 min-w-[520px]">
                    <thead className="bg-black/40 font-mono text-[10px] text-gray-500 uppercase">
                      <tr>
                        <th className="p-3">Afiliado</th>
                        <th className="p-3">Cliques / FTDs</th>
                        <th className="p-3">CPA Pago</th>
                        <th className="p-3">RevShare</th>
                        <th className="p-3 text-right">Total Gerado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900 text-gray-300">
                      {opAffiliates.map(aff => (
                        <tr key={aff.id} className="hover:bg-white/[0.02]">
                          <td className="p-3">
                            <p className="font-bold text-white">{aff.name}</p>
                            <p className="text-[10px] text-gray-500 font-mono">/{aff.code}</p>
                          </td>
                          <td className="p-3 font-mono">{formatNum(aff.funnel.clicks)} / <span className="text-emerald-400 font-bold">{formatNum(aff.funnel.ftds)}</span></td>
                          <td className="p-3 font-mono text-red-400">{formatBRL(aff.cpaEarned)}</td>
                          <td className="p-3 font-mono text-purple-400">{formatBRL(aff.revShareEarned)}</td>
                          <td className="p-3 font-mono text-right text-amber-400 font-bold">{formatBRL(aff.cpaEarned + aff.revShareEarned)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== APOSTADORES ===== */}
          {activeTab === 'players' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Apostadores', value: formatNum(opPlayers.length), color: 'text-blue-400' },
                  { label: 'VIP Ativos', value: formatNum(opPlayers.filter(p => p.isActiveVip).length), color: 'text-purple-400' },
                  { label: 'Inativos (risco)', value: formatNum(opPlayers.filter(p => p.status === 'inactive').length), color: 'text-amber-400' },
                  { label: 'Churned', value: formatNum(opPlayers.filter(p => p.status === 'churned').length), color: 'text-red-400' },
                ].map(c => (
                  <div key={c.label} className="bg-[#0c0c10] border border-gray-800/80 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">{c.label}</p>
                    <h3 className={`text-2xl font-black mt-1 ${c.color}`}>{c.value}</h3>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input type="text" placeholder="Buscar por nome ou ID do cassino..." value={playerSearch} onChange={e => setPlayerSearch(e.target.value)}
                  className="flex-1 bg-[#0c0c10] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500 min-w-0" />
                <div className="flex gap-2">
                  {(['all', 'active', 'inactive', 'churned'] as const).map(f => (
                    <button key={f} onClick={() => setPlayerFilter(f)}
                      className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all ${playerFilter === f ? 'bg-red-600 text-white' : 'bg-[#0c0c10] border border-gray-800 text-gray-400'}`}>
                      {f === 'all' ? 'Todos' : f === 'active' ? 'Ativos' : f === 'inactive' ? 'Inativos' : 'Churned'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead className="bg-black/40 font-mono text-[10px] text-gray-500 uppercase">
                      <tr>
                        <th className="p-3">Jogador</th>
                        <th className="p-3">Afiliado</th>
                        <th className="p-3">Nível / XP</th>
                        <th className="p-3">Pontos</th>
                        <th className="p-3">Depósitos</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Canais</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900">
                      {filteredPlayers.map(p => (
                        <tr key={p.id} className="hover:bg-white/[0.02]">
                          <td className="p-3">
                            <p className="font-bold text-white">{p.name}</p>
                            <p className="text-[10px] text-gray-500 font-mono">{p.casinoPlayerId}</p>
                          </td>
                          <td className="p-3 text-gray-400 text-[11px]">{p.affiliateName}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="bg-purple-600 text-white font-black text-[10px] w-6 h-6 rounded-lg flex items-center justify-center">{p.level}</span>
                              <div>
                                <div className="w-16 bg-gray-800 h-1 rounded-full">
                                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${Math.min((p.xp / 600) * 100, 100)}%` }} />
                                </div>
                                <p className="text-[9px] text-gray-500 font-mono mt-0.5">{p.xp}/600 XP</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-amber-400 font-mono font-bold">{formatNum(p.walletPoints)} pts</td>
                          <td className="p-3 text-emerald-400 font-mono">{formatBRL(p.totalDeposited)}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${p.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : p.status === 'inactive' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                              {p.status === 'active' ? 'Ativo' : p.status === 'inactive' ? 'Inativo' : 'Churned'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              {p.whatsappId && <span className="text-[9px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20 font-bold">WA</span>}
                              {p.telegramId && <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 font-bold">TG</span>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredPlayers.length === 0 && (
                  <p className="text-xs text-gray-600 text-center py-10">Nenhum apostador encontrado.</p>
                )}
              </div>
            </div>
          )}

          {/* ===== AFILIADOS ===== */}
          {activeTab === 'affiliates' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedLeaderboard.map((aff, i) => (
                  <div key={aff.id} className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5 space-y-3 relative overflow-hidden">
                    {i < 3 && (
                      <div className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${i === 0 ? 'bg-amber-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : 'bg-orange-700 text-white'}`}>
                        {i + 1}
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center font-bold text-xs text-purple-300 shrink-0">
                        {aff.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-white text-sm truncate">{aff.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">/{aff.code} · VIP {aff.level}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-black/30 rounded-xl p-2 text-center">
                        <p className="text-[10px] text-gray-500">CPA</p>
                        <p className="text-sm font-black text-emerald-400">{formatBRL(aff.cpaEarned)}</p>
                      </div>
                      <div className="bg-black/30 rounded-xl p-2 text-center">
                        <p className="text-[10px] text-gray-500">RevShare</p>
                        <p className="text-sm font-black text-purple-400">{formatBRL(aff.revShareEarned)}</p>
                      </div>
                      <div className="bg-black/30 rounded-xl p-2 text-center">
                        <p className="text-[10px] text-gray-500">Jogadores</p>
                        <p className="text-sm font-black text-blue-400">{formatNum(aff.playersCount)}</p>
                      </div>
                      <div className="bg-black/30 rounded-xl p-2 text-center">
                        <p className="text-[10px] text-gray-500">Cliques</p>
                        <p className="text-sm font-black text-gray-300">{formatNum(aff.funnel.clicks)}</p>
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
                    <input type="text" required placeholder="Nome completo" value={newAffName} onChange={e => setNewAffName(e.target.value)} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500" />
                    <input type="email" required placeholder="E-mail" value={newAffEmail} onChange={e => setNewAffEmail(e.target.value)} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500" />
                    <input type="text" required placeholder="Código (ex: JOAOSP)" value={newAffCode} onChange={e => setNewAffCode(e.target.value.toUpperCase())} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500 font-mono uppercase" />
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="submit" className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 active:scale-95">
                      <Plus size={14} /> Cadastrar
                    </button>
                    {newAffSuccess && <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 size={14} /> Afiliado cadastrado!</span>}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ===== LEADS FRIOS ===== */}
          {activeTab === 'crm' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2"><MessageSquare size={16} className="text-red-400" /> Funil de Leads Frios</h3>
                  <p className="text-xs text-gray-500 mt-1">Cadastrados sem FTD. Dispare automações para converter.</p>
                </div>
                <div className="bg-black/30 border border-gray-900 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">Estratégia WhatsApp</span>
                    <p className="text-xs text-gray-400 mt-0.5">Template injetável via API</p>
                  </div>
                  <CustomSelect options={[
                    { value: 'bonus_deposit', label: 'Bônus 200% no FTD' },
                    { value: 'free_spins', label: '10 Rodadas Grátis' },
                    { value: 'scarcity_alert', label: 'Conta Expirando em 24h' },
                  ]} value={whatsappTemplate} onChange={v => setWhatsappTemplate(v)} className="w-full sm:w-60 shrink-0" />
                </div>
                <div className="overflow-x-auto border border-gray-900 rounded-xl">
                  <table className="w-full text-left text-xs min-w-[420px]">
                    <thead className="bg-black/20 text-gray-500 font-mono text-[10px] uppercase">
                      <tr><th className="p-3">Lead</th><th className="p-3">WhatsApp</th><th className="p-3">Inatividade</th><th className="p-3 text-right">Ação</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900 text-gray-300">
                      {opLeads.map(lead => (
                        <tr key={lead.id} className="hover:bg-white/[0.02]">
                          <td className="p-3 font-bold text-white">{lead.name}</td>
                          <td className="p-3 font-mono text-gray-500 text-[11px]">{lead.whatsapp}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${lead.daysInactive > 5 ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>{lead.daysInactive}d</span>
                          </td>
                          <td className="p-3 text-right">
                            <button onClick={() => triggerWhatsAppAutomation(lead.id, whatsappTemplate)} className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-[11px] px-3 py-1.5 rounded-lg transition-all active:scale-95">Disparar WA</button>
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
                <div className="space-y-2 font-mono text-[10px] flex-1 overflow-y-auto max-h-80 pr-1">
                  {opWebhooks.map((log, i) => (
                    <div key={i} className="p-2 bg-black/50 border border-gray-900 rounded-lg">
                      <div className="flex justify-between text-[9px] mb-0.5">
                        <span className="text-gray-600">{log.time}</span>
                        <StatusBadge status={log.status} />
                      </div>
                      <span className="text-red-400 font-bold block text-[9px]">{log.event.toUpperCase()}</span>
                      <p className="text-gray-400 leading-relaxed">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== CAMPANHAS ===== */}
          {activeTab === 'campaigns' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2"><Trophy size={16} className="text-yellow-500" /> Nova Campanha</h3>
                  <p className="text-xs text-gray-500 mt-1">Metas coletivas de rollover com XP de recompensa.</p>
                </div>
                <form onSubmit={handleCreateMission} className="space-y-3 pt-1">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Título</label>
                    <input type="text" placeholder="Ex: Corrida do Ouro" value={missionTitle} onChange={e => setMissionTitle(e.target.value)} className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Jogo</label>
                      <select value={missionGame} onChange={e => setMissionGame(e.target.value)} className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none">
                        <option value="Fortune Tiger">Fortune Tiger</option>
                        <option value="Mines">Mines</option>
                        <option value="Aviator">Aviator</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">XP Recompensa</label>
                      <input type="number" placeholder="100" value={missionXp} onChange={e => setMissionXp(e.target.value)} className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Rollover Alvo (R$)</label>
                    <input type="number" placeholder="5000" value={missionTarget} onChange={e => setMissionTarget(e.target.value)} className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-red-500" />
                  </div>
                  <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 active:scale-95">
                    <Plus size={14} /> Ativar Campanha
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-4">Campanhas Ativas</h3>
                <div className="space-y-4">
                  {opMissions.length === 0
                    ? <p className="text-xs text-gray-600 text-center py-10">Nenhuma campanha ativa.</p>
                    : opMissions.map(mission => (
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
                          <div className="bg-red-500 h-full transition-all" style={{ width: `${(mission.currentProgress / mission.targetAmount) * 100}%` }} />
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          )}

          {/* ===== SAQUES ===== */}
          {activeTab === 'payouts' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Aguardando Aprovação', value: formatBRL(opPayouts.filter(p => p.status === 'PENDING').reduce((a, x) => a + x.amount, 0)), sub: `${opPayouts.filter(p => p.status === 'PENDING').length} solicitações`, color: 'text-amber-400' },
                  { label: 'Pago Este Mês', value: formatBRL(opPayouts.filter(p => p.status === 'PAID').reduce((a, x) => a + x.amount, 0)), sub: `${opPayouts.filter(p => p.status === 'PAID').length} transferências`, color: 'text-emerald-400' },
                  { label: 'Rejeitados', value: formatNum(opPayouts.filter(p => p.status === 'REJECTED').length), sub: 'Solicitações negadas', color: 'text-red-400' },
                ].map(c => (
                  <div key={c.label} className="bg-[#0c0c10] border border-gray-800/80 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-500 uppercase leading-tight">{c.label}</p>
                    <h3 className={`text-xl font-black mt-1 ${c.color}`}>{c.value}</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">{c.sub}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[600px]">
                    <thead className="bg-black/40 font-mono text-[10px] text-gray-500 uppercase">
                      <tr>
                        <th className="p-3">Afiliado</th>
                        <th className="p-3">Tipo</th>
                        <th className="p-3">Chave PIX</th>
                        <th className="p-3">Valor</th>
                        <th className="p-3">Solicitado</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900 text-gray-300">
                      {opPayouts.map(payout => (
                        <tr key={payout.id} className="hover:bg-white/[0.02]">
                          <td className="p-3 font-bold text-white">{payout.affiliateName}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${payout.type === 'CPA' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : payout.type === 'REVSHARE' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                              {payout.type}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-gray-400 text-[11px]">{payout.pixKey}</td>
                          <td className="p-3 font-mono font-bold text-white">{formatBRL(payout.amount)}</td>
                          <td className="p-3 text-gray-500 text-[11px]">{new Date(payout.requestedAt).toLocaleDateString('pt-BR')}</td>
                          <td className="p-3"><StatusBadge status={payout.status} /></td>
                          <td className="p-3 text-right">
                            {payout.status === 'PENDING' && (
                              <div className="flex gap-2 justify-end">
                                <button onClick={() => approvePayout(payout.id)} className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 active:scale-95">
                                  <CheckCheck size={12} /> Aprovar
                                </button>
                                <button onClick={() => rejectPayout(payout.id)} className="bg-red-900/40 hover:bg-red-700/50 text-red-400 font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 active:scale-95">
                                  <XCircle size={12} /> Rejeitar
                                </button>
                              </div>
                            )}
                            {payout.status !== 'PENDING' && (
                              <span className="text-[10px] text-gray-600 font-mono">{payout.processedAt ? new Date(payout.processedAt).toLocaleDateString('pt-BR') : '—'}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== AUTOMAÇÕES ===== */}
          {activeTab === 'automations' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Ativas',        value: formatNum(opAutomations.filter(a => a.isActive).length),            color: 'text-emerald-400' },
                  { label: 'Disparos Hoje', value: formatNum(opAutomations.reduce((a, x) => a + x.triggeredToday, 0)), color: 'text-amber-400' },
                  { label: 'Total Enviado', value: formatNum(opAutomations.reduce((a, x) => a + x.totalTriggered, 0)), color: 'text-blue-400' },
                  { label: 'Canais',        value: formatNum(opAutomations.length),                                     color: 'text-purple-400' },
                ].map(c => (
                  <div key={c.label} className="bg-[#0c0c10] border border-gray-800/80 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">{c.label}</p>
                    <h3 className={`text-2xl font-black mt-1 ${c.color}`}>{c.value}</h3>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {opAutomations.map(auto => (
                  <div key={auto.id} className={`bg-[#0c0c10] border rounded-2xl p-5 space-y-4 ${auto.isActive ? 'border-gray-700' : 'border-gray-800/40 opacity-60'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${PLATFORM_COLORS[auto.platform]} flex items-center justify-center text-white shrink-0`}>
                          {PLATFORM_ICONS[auto.platform]}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm capitalize">{auto.platform}</p>
                          <p className="text-[10px] text-gray-500">{auto.triggeredToday} disparos hoje · {formatNum(auto.totalTriggered)} total</p>
                        </div>
                      </div>
                      <button onClick={() => toggleAutomation(auto.id)} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${auto.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-gray-800 text-gray-500 border-gray-700 hover:bg-gray-700'}`}>
                        {auto.isActive ? <><ToggleRight size={14} /> Ativa</> : <><ToggleLeft size={14} /> Inativa</>}
                      </button>
                    </div>

                    <div className="space-y-2">
                      {auto.config.postKeyword && (
                        <div>
                          <label className="text-[9px] font-bold text-gray-500 uppercase">Palavra-chave Monitorada</label>
                          <p className="text-xs text-purple-300 font-mono bg-purple-500/5 border border-purple-500/10 rounded-lg px-3 py-1.5 mt-0.5">#{auto.config.postKeyword}</p>
                        </div>
                      )}
                      {auto.config.inactivityDays && (
                        <div>
                          <label className="text-[9px] font-bold text-gray-500 uppercase">Gatilho de Inatividade</label>
                          <p className="text-xs text-amber-300 font-mono bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-1.5 mt-0.5">Após {auto.config.inactivityDays} dias sem atividade</p>
                        </div>
                      )}
                      <div>
                        <label className="text-[9px] font-bold text-gray-500 uppercase">Template da Mensagem</label>
                        <p className="text-xs text-gray-400 bg-black/30 border border-gray-800 rounded-lg px-3 py-2 mt-0.5 leading-relaxed">{auto.config.dmTemplate}</p>
                      </div>
                      {(auto.config.accessToken || auto.config.botToken || auto.config.phoneNumberId) && (
                        <div>
                          <label className="text-[9px] font-bold text-gray-500 uppercase">Token de Integração</label>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[11px] text-gray-600 font-mono bg-black/30 border border-gray-800 rounded-lg px-3 py-1.5 flex-1 truncate">
                              {showKey ? (auto.config.accessToken || auto.config.botToken || auto.config.phoneNumberId) : '••••••••••••••••••••'}
                            </p>
                            <button onClick={() => setShowKey(!showKey)} className="text-gray-500 hover:text-gray-300 p-1.5">
                              {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-blue-300 flex items-center gap-2 mb-2"><Zap size={14} /> Fluxo de Atribuição Automática</h4>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center text-center">
                  {['Instagram / TikTok', 'DM Automática', 'KYC +18 WhatsApp', 'Cookie de Rastreio', 'Vínculo Definitivo'].map((step, i) => (
                    <React.Fragment key={step}>
                      <div className="bg-black/40 border border-gray-800 rounded-xl p-3">
                        <p className="text-[10px] font-bold text-gray-400">{step}</p>
                      </div>
                      {i < 4 && <span className="text-gray-600 hidden sm:block">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== WEBHOOKS ===== */}
          {activeTab === 'webhooks' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total Recebidos', value: formatNum(opWebhooks.length), color: 'text-blue-400' },
                  { label: 'Sucesso', value: formatNum(opWebhooks.filter(w => w.status === 'SUCCESS').length), color: 'text-emerald-400' },
                  { label: 'Falhas', value: formatNum(opWebhooks.filter(w => w.status === 'FAILED').length), color: 'text-red-400' },
                  { label: 'Taxa de Sucesso', value: opWebhooks.length > 0 ? `${((opWebhooks.filter(w => w.status === 'SUCCESS').length / opWebhooks.length) * 100).toFixed(0)}%` : '—', color: 'text-amber-400' },
                ].map(c => (
                  <div key={c.label} className="bg-[#0c0c10] border border-gray-800/80 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">{c.label}</p>
                    <h3 className={`text-2xl font-black mt-1 ${c.color}`}>{c.value}</h3>
                  </div>
                ))}
              </div>

              <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2"><Activity size={16} className="text-red-400" /> Log de Auditoria de Webhooks</h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Ao Vivo
                  </div>
                </div>

                <div className="space-y-2 font-mono text-[11px] max-h-[500px] overflow-y-auto pr-1">
                  {opWebhooks.map((log, i) => (
                    <div key={i} className={`p-3 border rounded-xl ${log.status === 'FAILED' ? 'bg-red-500/5 border-red-500/20' : log.status === 'IGNORED' ? 'bg-gray-800/30 border-gray-800' : 'bg-black/30 border-gray-900'}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-[10px]">{log.time}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${log.status === 'FAILED' ? 'text-red-400 bg-red-500/10' : 'text-blue-400 bg-blue-500/10'}`}>{log.event.toUpperCase()}</span>
                        </div>
                        <StatusBadge status={log.status} />
                      </div>
                      <p className="text-gray-400 leading-relaxed">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white mb-3">Credencial da API — Endpoint de Entrada</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Endpoint do Webhook (POST)</label>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-emerald-400 font-mono bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 flex-1">https://api.gamifycrm.com/v1/webhooks/{currentOperatorId}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Chave Secreta HMAC (api_secret_key)</label>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-400 font-mono bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 flex-1 truncate">
                        {showKey ? op.apiSecretKey : '••••••••••••••••••••••••••••'}
                      </p>
                      <button onClick={() => setShowKey(!showKey)} className="text-gray-500 hover:text-gray-300 p-2 bg-black/40 border border-gray-800 rounded-xl">
                        {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['user_registered', 'deposit_made', 'bet_placed', 'bet_settled'].map(ev => (
                      <div key={ev} className="bg-black/30 border border-emerald-500/10 rounded-xl px-3 py-2 text-center">
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">{ev}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== CONFIGURAÇÕES ===== */}
          {activeTab === 'settings' && (
            <div className="max-w-xl space-y-5">
              <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2"><Settings size={16} className="text-red-400" /> Regras de Negócio — {op.brandName}</h3>
                  <p className="text-xs text-gray-500 mt-1">Comissões padrão para todos os afiliados desta plataforma.</p>
                </div>
                <form onSubmit={handleUpdateConfig} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">CPA Global (R$)</label>
                      <input type="number" value={inputCpa} onChange={e => setInputCpa(e.target.value)} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500" />
                      <span className="text-[9px] text-gray-600 mt-1 block">Pago por FTD qualificado</span>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">RevShare Base (%)</label>
                      <input type="number" value={inputRevShare} onChange={e => setInputRevShare(e.target.value)} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-red-500" />
                      <span className="text-[9px] text-gray-600 mt-1 block">% das perdas líquidas</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="submit" className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all active:scale-95">Salvar Parâmetros</button>
                    {configSuccess && <span className="text-xs text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 size={14} /> Atualizado!</span>}
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
                    <button onClick={() => setCurrentOperator(o.id)} className="text-[10px] text-amber-400 font-bold hover:text-amber-300 flex items-center gap-1">
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
