import React, { useState } from 'react';
import { useMockStore } from '../../hooks/useMockStore';
import CustomSelect from '../../components/ui/Select';
import { formatBRL, formatNum, formatPercent } from '../../utils/format';
import {
  TrendingUp, Award, Link2, Trophy, Zap, Radio,
  LayoutDashboard, Wallet, Share2, Landmark,
  BarChart3, Plus, Trash2, Code2, Copy, CheckCircle,
  Menu, X, ChevronDown
} from 'lucide-react';

type Tab = 'overview' | 'analytics' | 'tracking' | 'network' | 'financial';

const NAV_ITEMS: { tab: Tab; label: string; icon: React.ReactNode; group: string }[] = [
  { tab: 'overview', label: 'Visão Geral', icon: <LayoutDashboard size={15} />, group: 'Relatórios' },
  { tab: 'analytics', label: 'Funil', icon: <BarChart3 size={15} />, group: 'Relatórios' },
  { tab: 'tracking', label: 'Pixels', icon: <Code2 size={15} />, group: 'Ferramentas' },
  { tab: 'network', label: 'Rede', icon: <Share2 size={15} />, group: 'Ferramentas' },
  { tab: 'financial', label: 'Caixa', icon: <Wallet size={15} />, group: 'Ferramentas' },
];

export default function AffiliateDashboard() {
  const {
    affiliates, simulateCasinoWebhook, getMissionsByOperator, webhookLogs,
    addPixel, removePixel, currentAffiliateId, currentOperatorId,
    getAffiliatesByOperator, setCurrentAffiliate,
  } = useMockStore();

  const affiliate = affiliates.find(a => a.id === currentAffiliateId) ?? affiliates[0];
  const activeMissions = getMissionsByOperator(currentOperatorId);
  const opAffiliates = getAffiliatesByOperator(currentOperatorId);

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const [pixelPlatform, setPixelPlatform] = useState<'facebook' | 'tiktok' | 'google'>('facebook');
  const [pixelIdInput, setPixelIdInput] = useState('');

  const [pixKey, setPixKey] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

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
  const regConv = clicks > 0 ? (registrations / clicks) * 100 : 0;
  const ftdConv = registrations > 0 ? (ftds / registrations) * 100 : 0;
  const totalEarned = affiliate.cpaEarned + affiliate.revShareEarned;

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-purple-500/20 shrink-0">
            G
          </div>
          <div>
            <span className="font-black text-sm tracking-wider block text-white">GAMIFY</span>
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest -mt-0.5 block">iGaming CRM</span>
          </div>
        </div>

        {opAffiliates.length > 1 && (
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-1.5">Conta</p>
            <select
              value={currentAffiliateId}
              onChange={e => setCurrentAffiliate(e.target.value)}
              className="w-full bg-black/40 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              {opAffiliates.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        )}

        <nav className="space-y-1">
          {['Relatórios', 'Ferramentas'].map(group => (
            <div key={group}>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-1.5 mt-3">{group}</p>
              {NAV_ITEMS.filter(n => n.group === group).map(item => (
                <button
                  key={item.tab}
                  onClick={() => switchTab(item.tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === item.tab
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
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

      <div className="p-3 bg-black/40 border border-gray-800/60 rounded-xl flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center font-bold text-[10px] text-purple-300 shrink-0">
          {affiliate.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-bold truncate text-white">{affiliate.name}</p>
          <span className="text-[10px] text-emerald-400 font-semibold block">Nível VIP {affiliate.level}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060608] text-gray-100 flex font-sans">

      {/* SIDEBAR DESKTOP */}
      <aside className="w-60 bg-[#0c0c10] border-r border-gray-800/60 p-5 flex-col justify-between hidden md:flex shrink-0">
        <SidebarContent />
      </aside>

      {/* DRAWER MOBILE */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#0c0c10] border-r border-gray-800 p-5 flex flex-col z-10">
            <button onClick={() => setSidebarOpen(false)} className="self-end text-gray-500 hover:text-white mb-4">
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-y-auto">

        {/* TOPBAR MOBILE */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-800/60 bg-[#0c0c10] sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-black text-sm text-white">G</div>
            <span className="font-black text-sm text-white">GAMIFY</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white p-1">
            <Menu size={20} />
          </button>
        </div>

        <div className="p-4 md:p-7 space-y-5 flex-1">

          {/* CABEÇALHO */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/50 pb-4 gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white">Ambiente do Parceiro</h1>
              <p className="text-gray-500 text-xs mt-0.5">Gestão de tráfego, balanços e gamificação.</p>
            </div>

            {/* VIP PROGRESS BAR */}
            <div className="bg-[#111115] border border-purple-950/40 rounded-xl p-3 flex items-center gap-3 w-full sm:w-64 shrink-0">
              <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center font-black text-sm text-white shadow-md shadow-purple-500/20 shrink-0">
                {affiliate.level}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center text-[10px] mb-1">
                  <span className="text-purple-400 font-bold">VIP Nível {affiliate.level}</span>
                  <span className="text-gray-500 font-mono">{affiliate.xp}/600 XP</span>
                </div>
                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${Math.min((affiliate.xp / 600) * 100, 100)}%` }} />
                </div>
              </div>
            </div>
          </header>

          {/* TABS MOBILE */}
          <div className="flex gap-1 overflow-x-auto pb-1 md:hidden scrollbar-none">
            {NAV_ITEMS.map(item => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all shrink-0 ${
                  activeTab === item.tab
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#0c0c10] border border-gray-800 text-gray-400'
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          {/* ---- VISÃO GERAL ---- */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#0c0c10] border border-gray-800/80 p-5 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Comissão CPA Total</p>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1">{formatBRL(affiliate.cpaEarned)}</h3>
                </div>
                <div className="bg-[#0c0c10] border border-gray-800/80 p-5 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Comissão RevShare</p>
                  <h3 className="text-2xl font-black text-purple-400 mt-1">{formatBRL(affiliate.revShareEarned)}</h3>
                </div>
                <div className="bg-[#0c0c10] border border-gray-800/80 p-5 rounded-2xl">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Depositantes (FTD)</p>
                  <h3 className="text-2xl font-black text-blue-400 mt-1">{formatNum(ftds)}</h3>
                  <span className="text-[10px] text-gray-500">jogadores ativos</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#0d0a14] to-[#0c0c10] border border-purple-950/60 p-5 rounded-2xl">
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5 mb-1">
                  <Link2 size={14} className="text-purple-400" /> Seu Link Único de Divulgação
                </h4>
                <p className="text-xs text-gray-500 mb-3">Use este link em suas campanhas de tráfego pago ou bio.</p>
                <div className="flex gap-2">
                  <input type="text" readOnly value={`cassinotop.com/?aff=${affiliate.code}`}
                    className="bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-[11px] font-mono text-gray-400 flex-1 outline-none min-w-0" />
                  <button onClick={() => copyLink(`https://cassinotop.com/?aff=${affiliate.code}`)}
                    className="text-xs font-bold px-3 py-2 rounded-lg bg-purple-600 text-white flex items-center gap-1 hover:bg-purple-500 transition-all shrink-0">
                    {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                    <span className="hidden sm:inline">{copied ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5">
                <h3 className="text-sm font-bold flex items-center gap-2 text-white mb-4">
                  <Trophy className="text-amber-500" size={16} /> Campanhas Ativas na sua Base
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeMissions.map(mission => (
                    <div key={mission.id} className="bg-black/20 border border-gray-900 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-xs text-white">{mission.title}</h4>
                          <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase mt-1 inline-block">{mission.game}</span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded shrink-0">+{mission.rewardXp} XP</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-500 font-mono mb-1">
                        <span>Rollover</span>
                        <span>{formatBRL(mission.currentProgress)} / {formatBRL(mission.targetAmount)}</span>
                      </div>
                      <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${(mission.currentProgress / mission.targetAmount) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---- FUNIL ---- */}
          {activeTab === 'analytics' && (
            <div className="space-y-5">
              <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-5 flex items-center gap-2">
                  <BarChart3 size={16} className="text-purple-400" /> Funil de Conversão
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: '1. Cliques', value: formatNum(clicks), sub: 'Acessos únicos', color: 'text-gray-200' },
                    { label: '2. Cadastros', value: formatNum(registrations), sub: `Conv: ${formatPercent(regConv)}`, color: 'text-purple-400' },
                    { label: '3. FTDs', value: formatNum(ftds), sub: `Reg→FTD: ${formatPercent(ftdConv)}`, color: 'text-emerald-400' },
                    { label: '4. Vol. Apostas', value: formatNum(subDeposits), sub: 'Ações geradoras de Rev', color: 'text-blue-400' },
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
                <p className="text-xs text-gray-500 mb-4">Simule eventos de tráfego em tempo real para ver o funil se mover.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button onClick={() => handleSimulate('click_tracked')} className="bg-gray-900 hover:bg-gray-800 border border-gray-800 text-xs text-gray-300 py-3 rounded-xl font-bold transition-all active:scale-95">+1 Clique</button>
                  <button onClick={() => handleSimulate('new_registration')} className="bg-blue-950/30 hover:bg-blue-900/40 border border-blue-900/40 text-xs text-blue-400 py-3 rounded-xl font-bold transition-all active:scale-95">+1 Cadastro</button>
                  <button onClick={() => handleSimulate('deposit_made', 100)} className="bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-900/40 text-xs text-emerald-400 py-3 rounded-xl font-bold transition-all active:scale-95">FTD R$100</button>
                  <button onClick={() => handleSimulate('bet_placed', 50, 'Fortune Tiger')} className="bg-purple-950/30 hover:bg-purple-900/40 border border-purple-900/40 text-xs text-purple-400 py-3 rounded-xl font-bold transition-all active:scale-95">Aposta R$50</button>
                </div>
              </div>
            </div>
          )}

          {/* ---- PIXELS ---- */}
          {activeTab === 'tracking' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-5 space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Code2 size={16} className="text-purple-400" /> Pixels de Conversão
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Configure disparos de pixel via API nas LPs automáticas.</p>
                </div>

                <form onSubmit={handleAddPixel} className="flex flex-col sm:flex-row gap-3">
                  <CustomSelect
                    options={[
                      { value: 'facebook', label: 'Facebook Ads' },
                      { value: 'tiktok', label: 'TikTok Ads' },
                      { value: 'google', label: 'Google Ads' },
                    ]}
                    value={pixelPlatform}
                    onChange={val => setPixelPlatform(val)}
                    className="w-full sm:w-44 shrink-0"
                  />
                  <input type="text" placeholder="ID do Pixel / Código de Rastreio" value={pixelIdInput}
                    onChange={e => setPixelIdInput(e.target.value)}
                    className="flex-1 bg-[#111116] border border-gray-800/80 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-purple-500/50 transition-all placeholder:text-gray-600 min-w-0" />
                  <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shrink-0 active:scale-95">
                    <Plus size={14} /> Injetar
                  </button>
                </form>

                <div className="space-y-2">
                  {affiliate.pixels.length === 0 ? (
                    <p className="text-xs text-gray-600 font-mono py-6 text-center">Nenhum pixel ativo neste link.</p>
                  ) : affiliate.pixels.map(pixel => (
                    <div key={pixel.id} className="bg-black/30 border border-gray-900 rounded-xl p-3 flex justify-between items-center font-mono text-xs">
                      <div>
                        <span className="font-bold text-[10px] uppercase text-purple-400 tracking-wider block">{pixel.platform}</span>
                        <span className="text-gray-300">{pixel.pixelId}</span>
                      </div>
                      <button onClick={() => removePixel(affiliate.id, pixel.id)} className="text-gray-500 hover:text-red-400 p-1 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0b0b0e] border border-gray-900 rounded-2xl p-4 flex flex-col">
                <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2 mb-3">
                  <Radio size={14} className="text-purple-500 animate-pulse" /> Live API Feed
                </h4>
                <div className="space-y-2 font-mono text-[10px] flex-1 overflow-y-auto max-h-72 pr-1">
                  {webhookLogs.map((log, i) => (
                    <div key={i} className="p-2 bg-black/50 border border-gray-900 rounded-lg">
                      <div className="flex justify-between text-gray-600 text-[9px] mb-0.5">
                        <span>{log.time}</span>
                        <span className="text-purple-400 font-bold">{log.event}</span>
                      </div>
                      <p className="text-gray-400 leading-relaxed">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---- REDE ---- */}
          {activeTab === 'network' && (
            <div className="space-y-5">
              <div className="bg-[#0c0c10] border border-gray-800/80 p-5 rounded-2xl space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-white">Recrutamento Unilevel (Tier 2)</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Recrute influenciadores e receba Sub-RevShare fixo de 5% de todo o faturamento deles.</p>
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

          {/* ---- FINANCEIRO ---- */}
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
                  <Landmark size={16} className="text-purple-400" /> Sacar via PIX Instantâneo
                </h3>
                <form onSubmit={e => { e.preventDefault(); setWithdrawSuccess(true); setWithdrawAmount(''); }} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" required placeholder="Chave PIX (CPF/Email/Telefone)" value={pixKey}
                      onChange={e => setPixKey(e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-purple-500" />
                    <input type="number" required placeholder="Valor em R$" value={withdrawAmount}
                      onChange={e => setWithdrawAmount(e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-purple-500" />
                  </div>
                  <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-all active:scale-95">
                    Solicitar Saque
                  </button>
                  {withdrawSuccess && <p className="text-xs text-emerald-400 font-bold">✓ Pedido enviado! Aguarde aprovação do operador.</p>}
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
