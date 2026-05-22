import React, { useState } from 'react';
import { useMockStore } from '../../hooks/useMockStore';
import CustomSelect from '../../components/ui/Select';
import { formatBRL, formatNum, formatPercent } from '../../utils/format';
import {
  Link2, Trophy, Zap, Radio,
  LayoutDashboard, Wallet, Share2, Landmark,
  BarChart3, Plus, Trash2, Code2, Copy, CheckCircle,
  Menu, X, Crown, Star, Users,
  TrendingUp, Award, Gamepad2, ShoppingBag,
  Medal, ChevronUp, ChevronDown as ChevDown
} from 'lucide-react';

type Tab = 'overview' | 'analytics' | 'players' | 'tracking' | 'network' | 'leaderboard' | 'financial';

const NAV_ITEMS: { tab: Tab; label: string; icon: React.ReactNode; group: string }[] = [
  { tab: 'overview',     label: 'Visão Geral', icon: <LayoutDashboard size={14} />, group: 'Relatórios' },
  { tab: 'analytics',    label: 'Funil',        icon: <BarChart3 size={14} />,       group: 'Relatórios' },
  { tab: 'players',      label: 'Meus Jogadores', icon: <Users size={14} />,         group: 'Relatórios' },
  { tab: 'leaderboard',  label: 'Ranking',      icon: <Trophy size={14} />,          group: 'Relatórios' },
  { tab: 'tracking',     label: 'Pixels',       icon: <Code2 size={14} />,           group: 'Ferramentas' },
  { tab: 'network',      label: 'Rede',         icon: <Share2 size={14} />,          group: 'Ferramentas' },
  { tab: 'financial',    label: 'Caixa',        icon: <Wallet size={14} />,          group: 'Ferramentas' },
];

const LEVEL_NAMES: Record<number, string> = {
  1: 'Bronze',
  2: 'Prata',
  3: 'Ouro',
  4: 'Platina',
  5: 'Diamante',
};

export default function AffiliateDashboard() {
  const {
    affiliates, simulateCasinoWebhook, getMissionsByOperator, webhookLogs,
    addPixel, removePixel, currentAffiliateId, currentOperatorId,
    getAffiliatesByOperator, setCurrentAffiliate, getPlayersByAffiliate,
  } = useMockStore();

  const affiliate = affiliates.find(a => a.id === currentAffiliateId) ?? affiliates[0];
  const activeMissions = getMissionsByOperator(currentOperatorId);
  const opAffiliates = getAffiliatesByOperator(currentOperatorId);
  const myPlayers = getPlayersByAffiliate(currentAffiliateId);

  const [activeTab, setActiveTab]   = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied]         = useState(false);

  const [pixelPlatform, setPixelPlatform] = useState<'facebook' | 'tiktok' | 'google'>('facebook');
  const [pixelIdInput, setPixelIdInput]   = useState('');

  const [pixKey, setPixKey]               = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const [playerFilter, setPlayerFilter]   = useState<'all' | 'active' | 'inactive' | 'churned'>('all');

  const handleSimulate = (type: 'click_tracked' | 'new_registration' | 'deposit_made' | 'bet_placed', amount = 0, game = '') => {
    simulateCasinoWebhook(type, { name: 'Jogador VIP', whatsapp: '+55 (11) 99999-8888', amount, game });
  };

  const handleAddPixel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pixelIdInput.trim()) return;
    addPixel(affiliate.id, pixelPlatform, pixelIdInput.trim());
    setPixelIdInput('');
  };

  const copyLink = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { clicks, registrations, ftds, subDeposits } = affiliate.funnel;
  const regConv  = clicks > 0 ? (registrations / clicks) * 100 : 0;
  const ftdConv  = registrations > 0 ? (ftds / registrations) * 100 : 0;
  const totalEarned = affiliate.cpaEarned + affiliate.revShareEarned;

  const sortedLeaderboard = [...opAffiliates]
    .sort((a, b) => (b.cpaEarned + b.revShareEarned) - (a.cpaEarned + a.revShareEarned));
  const myRank = sortedLeaderboard.findIndex(a => a.id === affiliate.id) + 1;

  const filteredPlayers = myPlayers.filter(p =>
    playerFilter === 'all' || p.status === playerFilter
  );

  const switchTab = (tab: Tab) => { setActiveTab(tab); setSidebarOpen(false); };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between overflow-y-auto">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-black text-lg text-white shrink-0">G</div>
          <div>
            <span className="font-black text-sm tracking-wider block text-white">GAMIFY</span>
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest block">iGaming CRM</span>
          </div>
        </div>

        {opAffiliates.length > 1 && (
          <div>
            <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest px-1 mb-1">Conta</p>
            <select value={currentAffiliateId} onChange={e => setCurrentAffiliate(e.target.value)}
              className="w-full bg-black/40 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none">
              {opAffiliates.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        )}

        <nav className="space-y-0.5">
          {['Relatórios', 'Ferramentas'].map(group => (
            <div key={group}>
              <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest px-3 pt-3 pb-1">{group}</p>
              {NAV_ITEMS.filter(n => n.group === group).map(item => (
                <button key={item.tab} onClick={() => switchTab(item.tab)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === item.tab ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'}`}>
                  {item.icon} {item.label}
                  {item.tab === 'leaderboard' && (
                    <span className="ml-auto text-[9px] text-amber-400 font-bold">#{myRank}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-3 bg-black/40 border border-gray-800/60 rounded-xl flex items-center gap-3 mt-4">
        <div className="w-8 h-8 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center font-bold text-[10px] text-purple-300 shrink-0">
          {affiliate.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-bold truncate text-white">{affiliate.name}</p>
          <span className="text-[10px] text-emerald-400 font-semibold">VIP {affiliate.level} — {LEVEL_NAMES[affiliate.level] ?? 'Master'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060608] text-gray-100 flex font-sans">

      <aside className="w-56 bg-[#0c0c10] border-r border-gray-800/60 p-4 flex-col hidden md:flex shrink-0">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#0c0c10] border-r border-gray-800 p-4 flex flex-col z-10">
            <button onClick={() => setSidebarOpen(false)} className="self-end text-gray-500 hover:text-white mb-3"><X size={20} /></button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">

        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-800/60 bg-[#0c0c10] sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-black text-sm text-white">G</div>
            <span className="font-black text-sm text-white">GAMIFY</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 p-1"><Menu size={20} /></button>
        </div>

        <div className="p-4 md:p-6 space-y-5 flex-1">

          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/50 pb-4 gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white">Ambiente do Parceiro</h1>
              <p className="text-gray-500 text-xs mt-0.5">Gestão de tráfego, balanços e gamificação.</p>
            </div>
            <div className="bg-[#111115] border border-purple-950/40 rounded-xl p-3 flex items-center gap-3 w-full sm:w-64 shrink-0">
              <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center font-black text-sm text-white shrink-0">{affiliate.level}</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center text-[10px] mb-1">
                  <span className="text-purple-400 font-bold">VIP {affiliate.level} · {LEVEL_NAMES[affiliate.level] ?? 'Master'}</span>
                  <span className="text-gray-500 font-mono">{affiliate.xp}/600 XP</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${Math.min((affiliate.xp / 600) * 100, 100)}%` }} />
                </div>
              </div>
            </div>
          </header>

          <div className="flex gap-1 overflow-x-auto pb-1 md:hidden scrollbar-none">
            {NAV_ITEMS.map(item => (
              <button key={item.tab} onClick={() => setActiveTab(item.tab)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap shrink-0 transition-all ${activeTab === item.tab ? 'bg-purple-600 text-white' : 'bg-[#0c0c10] border border-gray-800 text-gray-400'}`}>
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          {/* ===== VISÃO GERAL ===== */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#0c0c10] border border-gray-800/80 p-5 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Comissão CPA</p>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1">{formatBRL(affiliate.cpaEarned)}</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">{formatNum(ftds)} FTDs × {formatBRL(affiliate.cpaRate)}</p>
                </div>
                <div className="bg-[#0c0c10] border border-gray-800/80 p-5 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">RevShare Total</p>
                  <h3 className="text-2xl font-black text-purple-400 mt-1">{formatBRL(affiliate.revShareEarned)}</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">{affiliate.revShare}% das perdas líquidas</p>
                </div>
                <div className="bg-[#0c0c10] border border-gray-800/80 p-5 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Depositantes (FTD)</p>
                  <h3 className="text-2xl font-black text-blue-400 mt-1">{formatNum(ftds)}</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">apostadores ativos</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#0d0a14] to-[#0c0c10] border border-purple-950/60 p-5 rounded-2xl">
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5 mb-1">
                  <Link2 size={14} className="text-purple-400" /> Seu Link Único de Divulgação
                </h4>
                <p className="text-xs text-gray-500 mb-3">Use nas suas campanhas de tráfego pago ou bio de redes sociais.</p>
                <div className="flex gap-2">
                  <input type="text" readOnly value={`cassinotop.com/?aff=${affiliate.code}`}
                    className="bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-[11px] font-mono text-gray-400 flex-1 outline-none min-w-0" />
                  <button onClick={() => copyLink(`https://cassinotop.com/?aff=${affiliate.code}`)}
                    className="text-xs font-bold px-3 py-2 rounded-lg bg-purple-600 text-white flex items-center gap-1 hover:bg-purple-500 transition-all shrink-0 active:scale-95">
                    {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                    <span className="hidden sm:inline">{copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                    <Trophy className="text-amber-500" size={15} /> Campanhas da Sua Base
                  </h3>
                  <div className="space-y-3">
                    {activeMissions.slice(0, 2).map(mission => (
                      <div key={mission.id} className="bg-black/20 border border-gray-900 rounded-xl p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-[11px] text-white">{mission.title}</h4>
                            <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded font-mono font-bold uppercase mt-0.5 inline-block">{mission.game}</span>
                          </div>
                          <span className="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded font-mono shrink-0">+{mission.rewardXp} XP</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500 font-mono mb-1">
                          <span>Rollover</span>
                          <span>{formatBRL(mission.currentProgress)} / {formatBRL(mission.targetAmount)}</span>
                        </div>
                        <div className="w-full bg-gray-900 h-1 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 transition-all" style={{ width: `${(mission.currentProgress / mission.targetAmount) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                    <Award size={15} className="text-purple-400" /> Sua Posição no Ranking
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl ${myRank === 1 ? 'bg-amber-500 text-black' : myRank === 2 ? 'bg-gray-400 text-black' : myRank === 3 ? 'bg-orange-700 text-white' : 'bg-purple-900/40 text-purple-300'}`}>
                      #{myRank}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{affiliate.name}</p>
                      <p className="text-xs text-gray-500">Volume total: <span className="text-amber-400 font-bold">{formatBRL(totalEarned)}</span></p>
                      <p className="text-[10px] text-gray-600 mt-0.5">{opAffiliates.length} afiliados neste operador</p>
                    </div>
                  </div>
                  <button onClick={() => switchTab('leaderboard')} className="w-full text-xs font-bold text-purple-400 hover:text-purple-300 py-2 border border-purple-900/40 hover:border-purple-700/40 rounded-xl transition-all">
                    Ver ranking completo →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== FUNIL ===== */}
          {activeTab === 'analytics' && (
            <div className="space-y-5">
              <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                  <BarChart3 size={16} className="text-purple-400" /> Funil de Conversão
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: '1. Cliques',     value: formatNum(clicks),        sub: 'Acessos únicos via link',        color: 'text-gray-200' },
                    { label: '2. Cadastros',   value: formatNum(registrations), sub: `Conv LP: ${formatPercent(regConv)}`, color: 'text-purple-400' },
                    { label: '3. FTDs',        value: formatNum(ftds),          sub: `Reg→FTD: ${formatPercent(ftdConv)}`, color: 'text-emerald-400' },
                    { label: '4. Vol. Apostas',value: formatNum(subDeposits),   sub: 'Ações geradoras de Rev',         color: 'text-blue-400' },
                  ].map(item => (
                    <div key={item.label} className="bg-black/30 border border-gray-900 p-4 rounded-xl">
                      <span className="text-[10px] font-bold text-gray-500 uppercase block">{item.label}</span>
                      <h4 className={`text-2xl font-black mt-1 font-mono ${item.color}`}>{item.value}</h4>
                      <p className={`text-[10px] mt-1 ${item.color !== 'text-gray-200' ? item.color : 'text-gray-400'}`}>{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0f0e14] border border-purple-950/50 rounded-2xl p-5">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <Zap size={14} /> Simulador de Eventos (Demo)
                </h4>
                <p className="text-xs text-gray-500 mb-4">Simule eventos de tráfego em tempo real e veja o funil se mover.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button onClick={() => handleSimulate('click_tracked')} className="bg-gray-900 hover:bg-gray-800 border border-gray-800 text-xs text-gray-300 py-3 rounded-xl font-bold transition-all active:scale-95">+1 Clique</button>
                  <button onClick={() => handleSimulate('new_registration')} className="bg-blue-950/30 hover:bg-blue-900/40 border border-blue-900/40 text-xs text-blue-400 py-3 rounded-xl font-bold transition-all active:scale-95">+1 Cadastro</button>
                  <button onClick={() => handleSimulate('deposit_made', 100)} className="bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-900/40 text-xs text-emerald-400 py-3 rounded-xl font-bold transition-all active:scale-95">FTD R$100</button>
                  <button onClick={() => handleSimulate('bet_placed', 50, 'Fortune Tiger')} className="bg-purple-950/30 hover:bg-purple-900/40 border border-purple-900/40 text-xs text-purple-400 py-3 rounded-xl font-bold transition-all active:scale-95">Aposta R$50</button>
                </div>
              </div>
            </div>
          )}

          {/* ===== MEUS JOGADORES ===== */}
          {activeTab === 'players' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total',    value: formatNum(myPlayers.length),                                color: 'text-blue-400' },
                  { label: 'Ativos',   value: formatNum(myPlayers.filter(p => p.status === 'active').length),   color: 'text-emerald-400' },
                  { label: 'Inativos', value: formatNum(myPlayers.filter(p => p.status === 'inactive').length), color: 'text-amber-400' },
                  { label: 'Churned',  value: formatNum(myPlayers.filter(p => p.status === 'churned').length),  color: 'text-red-400' },
                ].map(c => (
                  <div key={c.label} className="bg-[#0c0c10] border border-gray-800/80 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">{c.label}</p>
                    <h3 className={`text-2xl font-black mt-1 ${c.color}`}>{c.value}</h3>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 flex-wrap">
                {(['all', 'active', 'inactive', 'churned'] as const).map(f => (
                  <button key={f} onClick={() => setPlayerFilter(f)}
                    className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all ${playerFilter === f ? 'bg-purple-600 text-white' : 'bg-[#0c0c10] border border-gray-800 text-gray-400'}`}>
                    {f === 'all' ? 'Todos' : f === 'active' ? 'Ativos' : f === 'inactive' ? 'Inativos' : 'Churned'}
                  </button>
                ))}
              </div>

              {filteredPlayers.length === 0 ? (
                <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-10 text-center">
                  <p className="text-gray-500 text-sm">Nenhum jogador nesta categoria.</p>
                  <p className="text-gray-600 text-xs mt-1">Use o simulador no Funil para adicionar jogadores de demonstração.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPlayers.map(player => (
                    <div key={player.id} className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{player.name}</p>
                          <p className="text-[10px] text-gray-500 font-mono">{player.casinoPlayerId}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${player.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : player.status === 'inactive' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          {player.status === 'active' ? 'Ativo' : player.status === 'inactive' ? 'Inativo' : 'Churned'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-900/40 border border-purple-500/20 flex items-center justify-center font-black text-sm text-purple-300 shrink-0">{player.level}</div>
                        <div className="flex-1">
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-purple-400 font-bold">VIP Nível {player.level}</span>
                            <span className="text-gray-500 font-mono">{player.xp}/600 XP</span>
                          </div>
                          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-purple-500 h-full" style={{ width: `${Math.min((player.xp / 600) * 100, 100)}%` }} />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-black/30 rounded-xl p-2 text-center">
                          <p className="text-[9px] text-gray-500">Depósitos</p>
                          <p className="text-xs font-black text-emerald-400">{formatBRL(player.totalDeposited)}</p>
                        </div>
                        <div className="bg-black/30 rounded-xl p-2 text-center">
                          <p className="text-[9px] text-gray-500">Apostas</p>
                          <p className="text-xs font-black text-blue-400">{formatBRL(player.totalBets)}</p>
                        </div>
                        <div className="bg-black/30 rounded-xl p-2 text-center">
                          <p className="text-[9px] text-gray-500">Pontos</p>
                          <p className="text-xs font-black text-amber-400">{formatNum(player.walletPoints)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <p className="text-[10px] text-gray-600">Último acesso: {player.lastActive}</p>
                        <div className="flex gap-1">
                          {player.whatsappId && <span className="text-[9px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20 font-bold">WA</span>}
                          {player.telegramId && <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 font-bold">TG</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== RANKING / LEADERBOARD ===== */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {sortedLeaderboard.slice(0, 3).map((aff, i) => {
                  const isMe = aff.id === affiliate.id;
                  const podiumColors = ['from-amber-500/20 to-amber-900/10 border-amber-500/30', 'from-gray-400/20 to-gray-700/10 border-gray-400/30', 'from-orange-700/20 to-orange-900/10 border-orange-700/30'];
                  const medalColors = ['bg-amber-500 text-black', 'bg-gray-400 text-black', 'bg-orange-700 text-white'];
                  const icons = [<Crown size={16} />, <Medal size={16} />, <Medal size={14} />];
                  return (
                    <div key={aff.id} className={`bg-gradient-to-b ${podiumColors[i]} border rounded-2xl p-4 text-center space-y-2 relative ${isMe ? 'ring-2 ring-purple-500' : ''}`}>
                      {isMe && <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">Você</span>}
                      <div className={`w-8 h-8 rounded-full ${medalColors[i]} flex items-center justify-center font-black mx-auto`}>{icons[i]}</div>
                      <p className="font-bold text-white text-xs leading-tight truncate">{aff.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">/{aff.code}</p>
                      <p className="text-lg font-black text-amber-400">{formatBRL(aff.cpaEarned + aff.revShareEarned)}</p>
                      <p className="text-[10px] text-gray-500">{formatNum(aff.funnel.ftds)} FTDs</p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-800/60">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Trophy size={15} className="text-amber-500" /> Ranking Completo do Mês
                  </h3>
                </div>
                <div className="divide-y divide-gray-900">
                  {sortedLeaderboard.map((aff, i) => {
                    const isMe = aff.id === affiliate.id;
                    const totalVol = aff.cpaEarned + aff.revShareEarned;
                    const maxVol = (sortedLeaderboard[0]?.cpaEarned ?? 0) + (sortedLeaderboard[0]?.revShareEarned ?? 0);
                    return (
                      <div key={aff.id} className={`flex items-center gap-4 px-5 py-3.5 ${isMe ? 'bg-purple-500/5 border-l-2 border-purple-500' : 'hover:bg-white/[0.02]'}`}>
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${i === 0 ? 'bg-amber-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : i === 2 ? 'bg-orange-700 text-white' : 'bg-gray-900 text-gray-400'}`}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`font-bold text-sm truncate ${isMe ? 'text-purple-300' : 'text-white'}`}>{aff.name}</p>
                            {isMe && <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full font-bold shrink-0">Você</span>}
                          </div>
                          <div className="w-full bg-gray-900 h-1 rounded-full mt-1.5 overflow-hidden">
                            <div className={`h-full rounded-full ${isMe ? 'bg-purple-500' : 'bg-gray-700'}`} style={{ width: maxVol > 0 ? `${(totalVol / maxVol) * 100}%` : '0%' }} />
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-black text-amber-400">{formatBRL(totalVol)}</p>
                          <p className="text-[10px] text-gray-500">{formatNum(aff.funnel.ftds)} FTDs</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-purple-500/5 border border-purple-500/20 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2 mb-3">
                  <TrendingUp size={14} /> Metas de Desbloqueio de RevShare
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { meta: 10, rev: 30, desc: 'Nível Base' },
                    { meta: 30, rev: 35, desc: 'Desbloqueio A' },
                    { meta: 60, rev: 40, desc: 'Desbloqueio B' },
                  ].map(tier => {
                    const reached = ftds >= tier.meta;
                    return (
                      <div key={tier.meta} className={`p-4 rounded-xl border ${reached ? 'bg-purple-500/10 border-purple-500/30' : 'bg-black/20 border-gray-800'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase">{tier.desc}</p>
                            <p className={`text-xl font-black mt-1 ${reached ? 'text-purple-400' : 'text-gray-500'}`}>{tier.rev}% RevShare</p>
                          </div>
                          {reached ? <CheckCircle size={18} className="text-purple-400" /> : <span className="text-[10px] text-gray-600 font-mono">{tier.meta} FTDs</span>}
                        </div>
                        {!reached && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                              <div className="bg-purple-700 h-full" style={{ width: `${Math.min((ftds / tier.meta) * 100, 100)}%` }} />
                            </div>
                            <p className="text-[9px] text-gray-600 mt-1">{ftds}/{tier.meta} FTDs para desbloquear</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ===== PIXELS ===== */}
          {activeTab === 'tracking' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2"><Code2 size={16} className="text-purple-400" /> Pixels de Conversão</h3>
                  <p className="text-xs text-gray-500 mt-1">Disparos de pixel via API nas Landing Pages automáticas do cassino.</p>
                </div>
                <form onSubmit={handleAddPixel} className="flex flex-col sm:flex-row gap-3">
                  <CustomSelect options={[{ value: 'facebook', label: 'Facebook Ads' }, { value: 'tiktok', label: 'TikTok Ads' }, { value: 'google', label: 'Google Ads' }]}
                    value={pixelPlatform} onChange={v => setPixelPlatform(v)} className="w-full sm:w-44 shrink-0" />
                  <input type="text" placeholder="ID do Pixel / Código de Rastreio" value={pixelIdInput} onChange={e => setPixelIdInput(e.target.value)}
                    className="flex-1 bg-[#111116] border border-gray-800/80 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-purple-500/50 placeholder:text-gray-600 min-w-0" />
                  <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 active:scale-95">
                    <Plus size={14} /> Injetar
                  </button>
                </form>
                <div className="space-y-2">
                  {affiliate.pixels.length === 0
                    ? <p className="text-xs text-gray-600 font-mono py-6 text-center">Nenhum pixel ativo neste link.</p>
                    : affiliate.pixels.map(pixel => (
                      <div key={pixel.id} className="bg-black/30 border border-gray-900 rounded-xl p-3 flex justify-between items-center font-mono text-xs">
                        <div>
                          <span className="font-bold text-[10px] uppercase text-purple-400 tracking-wider block">{pixel.platform}</span>
                          <span className="text-gray-300">{pixel.pixelId}</span>
                        </div>
                        <button onClick={() => removePixel(affiliate.id, pixel.id)} className="text-gray-500 hover:text-red-400 p-1 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    ))
                  }
                </div>
              </div>

              <div className="bg-[#0b0b0e] border border-gray-900 rounded-2xl p-4 flex flex-col">
                <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2 mb-3">
                  <Radio size={14} className="text-purple-500 animate-pulse" /> Live API Feed
                </h4>
                <div className="space-y-2 font-mono text-[10px] flex-1 overflow-y-auto max-h-72 pr-1">
                  {webhookLogs.map((log, i) => (
                    <div key={i} className="p-2 bg-black/50 border border-gray-900 rounded-lg">
                      <div className="flex justify-between text-[9px] mb-0.5">
                        <span className="text-gray-600">{log.time}</span>
                        <span className="text-purple-400 font-bold">{log.event.toUpperCase()}</span>
                      </div>
                      <p className="text-gray-400 leading-relaxed">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== REDE ===== */}
          {activeTab === 'network' && (
            <div className="space-y-5">
              <div className="bg-[#0c0c10] border border-gray-800/80 p-5 rounded-2xl space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-white">Recrutamento Unilevel (Tier 2)</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Recrute influenciadores e receba Sub-RevShare fixo de 5% do faturamento deles.</p>
                </div>
                <div className="flex gap-2">
                  <input type="text" readOnly value={`cassinotop.com/register?ref=${affiliate.code}`}
                    className="bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-xs font-mono text-gray-400 flex-1 outline-none min-w-0" />
                  <button onClick={() => copyLink(`https://cassinotop.com/register?ref=${affiliate.code}`)}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 rounded-xl transition-all shrink-0 active:scale-95">Copiar</button>
                </div>
              </div>
              <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-400 min-w-[480px]">
                  <thead className="bg-black/40 text-gray-500 font-mono uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Parceiro Indicado</th>
                      <th className="p-4">Jogadores</th>
                      <th className="p-4">Volume da Rede</th>
                      <th className="p-4 text-right">Seu Repasse (5%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-900 text-gray-300">
                    <tr>
                      <td className="p-4 font-bold text-white">Lucas Tipster Capixaba</td>
                      <td className="p-4 font-mono">{formatNum(84)}</td>
                      <td className="p-4 text-purple-400 font-mono">{formatBRL(14500)}</td>
                      <td className="p-4 text-right text-emerald-400 font-black font-mono">+{formatBRL(725)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== FINANCEIRO ===== */}
          {activeTab === 'financial' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#0c0c10] border border-emerald-900/30 p-5 rounded-2xl">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Saldo Disponível</p>
                  <h2 className="text-3xl font-black text-emerald-400 mt-2">{formatBRL(totalEarned)}</h2>
                  <p className="text-[10px] text-gray-600 mt-1">CPA + RevShare acumulados</p>
                </div>
                <div className="bg-[#0c0c10] border border-gray-800/80 p-5 rounded-2xl">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">CPA Acumulado</p>
                  <h2 className="text-2xl font-black text-emerald-400 mt-2">{formatBRL(affiliate.cpaEarned)}</h2>
                  <p className="text-[10px] text-gray-600 mt-1">{formatNum(ftds)} FTDs × {formatBRL(affiliate.cpaRate)}</p>
                </div>
                <div className="bg-[#0c0c10] border border-gray-800/80 p-5 rounded-2xl">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">RevShare Acumulado</p>
                  <h2 className="text-2xl font-black text-purple-400 mt-2">{formatBRL(affiliate.revShareEarned)}</h2>
                  <p className="text-[10px] text-gray-600 mt-1">{affiliate.revShare}% das perdas líquidas</p>
                </div>
              </div>

              <div className="bg-[#0c0c10] border border-gray-800/80 p-5 rounded-2xl">
                <h3 className="text-xs font-bold uppercase text-gray-400 mb-4 flex items-center gap-1.5">
                  <Landmark size={16} className="text-purple-400" /> Solicitar Saque via PIX
                </h3>
                <form onSubmit={e => { e.preventDefault(); setWithdrawSuccess(true); setWithdrawAmount(''); }} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" required placeholder="Chave PIX (CPF / E-mail / Telefone)" value={pixKey} onChange={e => setPixKey(e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-purple-500" />
                    <input type="number" required placeholder="Valor em R$" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-purple-500" />
                  </div>
                  <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-all active:scale-95">
                    Solicitar Saque
                  </button>
                  {withdrawSuccess && <p className="text-xs text-emerald-400 font-bold flex items-center gap-1"><CheckCircle size={14} /> Pedido enviado! Aguarde aprovação do operador.</p>}
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
