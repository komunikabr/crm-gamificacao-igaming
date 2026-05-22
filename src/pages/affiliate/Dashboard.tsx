import React, { useState } from 'react';
import { useMockStore } from '../../hooks/useMockStore';
import CustomSelect from '../../components/ui/Select';
import { 
  TrendingUp, Award, Link2, Trophy, Zap, Radio, 
  LayoutDashboard, Wallet, Share2, Landmark, 
  BarChart3, Plus, Trash2, Code2, Copy, CheckCircle
} from 'lucide-react';

export default function AffiliateDashboard() {
  const { affiliates, simulateCasinoWebhook, activeMissions, webhookLogs, addPixel, removePixel } = useMockStore();
  const affiliate = affiliates[0];
  
  // MENU PRINCIPAL REORGANIZADO
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'tracking' | 'network' | 'financial'>('overview');
  const [copied, setCopied] = useState(false);
  
  // Estados para o Gerenciador de Pixels
  const [pixelPlatform, setPixelPlatform] = useState<'facebook' | 'tiktok' | 'google'>('facebook');
  const [pixelIdInput, setPixelIdInput] = useState('');

  // Estados do Financeiro (Saques)
  const [pixKey, setPixKey] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const handleSimulateAction = (type: 'click_tracked' | 'new_registration' | 'deposit_made' | 'bet_placed', amount = 0, game = '') => {
    simulateCasinoWebhook(type, { 
      name: 'Jogador VIP', 
      whatsapp: '+55 (11) 99999-8888', 
      amount, 
      game 
    });
  };

  const handleAddPixelSubmit = (e: React.FormEvent) => {
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

  // Cálculos dinâmicos do Funil
  const { clicks, registrations, ftds, subDeposits } = affiliate.funnel;
  const regConversion = clicks > 0 ? ((registrations / clicks) * 100).toFixed(1) : '0';
  const ftdConversion = registrations > 0 ? ((ftds / registrations) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-[#060608] text-gray-100 flex font-sans">
      
      {/* SIDEBAR REESTRUTURADA */}
      <aside className="w-64 bg-[#0c0c10] border-r border-gray-800/60 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-purple-500/20">
              G
            </div>
            <div>
              <span className="font-black text-md tracking-wider block text-white">GAMIFY</span>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest -mt-1 block">iGaming CRM</span>
            </div>
          </div>

          <nav className="space-y-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">Relatórios</p>
            
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'overview' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.01]'}`}
            >
              <LayoutDashboard size={15} /> Visão Geral
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'analytics' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.01]'}`}
            >
              <BarChart3 size={15} /> Funil de Conversão
            </button>

            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 pt-4 mb-2">Ferramentas</p>

            <button
              onClick={() => setActiveTab('tracking')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'tracking' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.01]'}`}
            >
              <Code2 size={15} /> Pixels & Rastreamento
            </button>

            <button
              onClick={() => setActiveTab('network')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'network' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.01]'}`}
            >
              <Share2 size={15} /> Minha Rede (Sub)
            </button>

            <button
              onClick={() => setActiveTab('financial')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'financial' ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.01]'}`}
            >
              <Wallet size={15} /> Caixa & Saques
            </button>
          </nav>
        </div>

        {/* PERFIL RESPONSIVO */}
        <div className="p-3 bg-black/40 border border-gray-800/60 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-900/50 border border-purple-500/30 flex items-center justify-center font-bold text-xs text-purple-300">
            BI
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate text-white">{affiliate.name}</p>
            <span className="text-[10px] text-emerald-400 font-semibold block">Nível VIP {affiliate.level}</span>
          </div>
        </div>
      </aside>

      {/* PAINEL CENTRAL DINÂMICO */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen space-y-6">
        
        {/* CABEÇALHO UNIFICADO */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800/50 pb-5 gap-4">
          <div>
            <h1 className="text-2xl font-black text-white">Ambiente do Parceiro</h1>
            <p className="text-gray-400 text-xs mt-0.5">Gestão de tráfego, balanços e gamificação de leads.</p>
          </div>
          
          {/* VIP PROGRESS BAR */}
          <div className="bg-[#111115] border border-purple-950/40 rounded-xl p-3 flex items-center gap-3 max-w-xs w-full shadow-md">
            <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center font-black text-sm text-white shadow-md shadow-purple-500/20">
              {affiliate.level}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center text-[10px] mb-0.5">
                <span className="text-purple-400 font-bold">VIP Nível {affiliate.level}</span>
                <span className="text-gray-500 font-mono">{affiliate.xp}/600 XP</span>
              </div>
              <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full transition-all duration-300" style={{ width: `${(affiliate.xp / 600) * 100}%` }} />
              </div>
            </div>
          </div>
        </header>

        {/* ---------------- SESSÃO 1: VISÃO GERAL ---------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* CARDS COMERCIAIS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-[#0c0c10] border border-gray-800/80 p-5 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Comissão CPA Total</p>
                <h3 className="text-2xl font-black text-emerald-400 mt-1">R$ {affiliate.cpaEarned.toFixed(2)}</h3>
              </div>
              <div className="bg-[#0c0c10] border border-gray-800/80 p-5 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Comissão RevShare</p>
                <h3 className="text-2xl font-black text-purple-400 mt-1">R$ {affiliate.revShareEarned.toFixed(2)}</h3>
              </div>
              <div className="bg-[#0c0c10] border border-gray-800/80 p-5 rounded-2xl">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Depositantes Ativos (FTD)</p>
                <h3 className="text-2xl font-black text-blue-400 mt-1">{ftds} jogadores</h3>
              </div>
            </div>

            {/* LINK GLOBAL */}
            <div className="bg-gradient-to-r from-[#0d0a14] to-[#0c0c10] border border-purple-950/60 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5"><Link2 size={14} className="text-purple-400" /> Seu Link Único de Divulgação</h4>
                <p className="text-xs text-gray-500 mt-0.5">Use este link em suas campanhas de tráfego pago ou bio.</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto max-w-md flex-1">
                <input type="text" readOnly value={`cassinotop.com/?aff=${affiliate.code}`} className="bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-[11px] font-mono text-gray-400 flex-1 outline-none" />
                <button onClick={() => copyLink(`https://cassinotop.com/?aff=${affiliate.code}`)} className="text-xs font-bold px-3 py-2 rounded-lg bg-purple-600 text-white flex items-center gap-1 hover:bg-purple-500 transition-all">
                  {copied ? <CheckCircle size={14} /> : <Copy size={14} />} {copied ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            </div>

            {/* METAS / MISSÕES ATIVAS */}
            <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-6">
              <h3 className="text-md font-bold flex items-center gap-2 text-white mb-4"><Trophy className="text-amber-500" size={16} /> Campanhas de Gamificação Ativas na sua Base</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeMissions.map((mission) => (
                  <div key={mission.id} className="bg-black/20 border border-gray-900 rounded-xl p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-xs text-white">{mission.title}</h4>
                        <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase mt-1 inline-block">{mission.game}</span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">+{mission.rewardXp} XP Coletivo</span>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-[10px] text-gray-500 font-mono mb-1">
                        <span>Rollover Atual</span>
                        <span>R$ {mission.currentProgress} / R$ {mission.targetAmount}</span>
                      </div>
                      <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${(mission.currentProgress / mission.targetAmount) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SESSÃO 2: FUNIL & ANALÍTICO ---------------- */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-6">
              <h3 className="text-md font-bold text-white mb-6 flex items-center gap-2"><BarChart3 size={16} className="text-purple-400" /> Relatório de Conversão Avançado (Funil Comercial)</h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-black/30 border border-gray-900 p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">1. Cliques</span>
                  <h4 className="text-2xl font-black text-gray-200 mt-1 font-mono">{clicks}</h4>
                  <p className="text-[10px] text-gray-400 mt-1">Acessos únicos</p>
                </div>
                <div className="bg-black/30 border border-gray-900 p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">2. Cadastros</span>
                  <h4 className="text-2xl font-black text-purple-400 mt-1 font-mono">{registrations}</h4>
                  <p className="text-[10px] text-purple-400 font-bold mt-1">Conv. LP: {regConversion}%</p>
                </div>
                <div className="bg-black/30 border border-gray-900 p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">3. Novos Depositantes (FTD)</span>
                  <h4 className="text-2xl font-black text-emerald-400 mt-1 font-mono">{ftds}</h4>
                  <p className="text-[10px] text-emerald-400 font-bold mt-1">Reg para FTD: {ftdConversion}%</p>
                </div>
                <div className="bg-black/30 border border-gray-900 p-4 rounded-xl">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">4. Volume de Apostas</span>
                  <h4 className="text-2xl font-black text-blue-400 mt-1 font-mono">{subDeposits}</h4>
                  <p className="text-[10px] text-gray-400 mt-1">Ações geradoras de Rev</p>
                </div>
              </div>
            </div>

            {/* CONTROLES DO SIMULADOR */}
            <div className="bg-[#0f0e14] border border-purple-950/50 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Zap size={14} /> Injetores de Eventos Simulados (Ambiente Mock)</h4>
              <p className="text-xs text-gray-500 mb-4">Clique nos botões abaixo para simular ações de tráfego em tempo real e ver a engrenagem do funil e das missões se moverem.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button type="button" onClick={() => handleSimulateAction('click_tracked')} className="bg-gray-900 hover:bg-gray-800 border border-gray-800 text-xs text-gray-300 py-3 rounded-xl font-bold transition-all">+1 Clique</button>
                <button type="button" onClick={() => handleSimulateAction('new_registration')} className="bg-blue-950/30 hover:bg-blue-900/40 border border-blue-900/40 text-xs text-blue-400 py-3 rounded-xl font-bold transition-all">+1 Cadastro</button>
                <button type="button" onClick={() => handleSimulateAction('deposit_made', 100)} className="bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-900/40 text-xs text-emerald-400 py-3 rounded-xl font-bold transition-all">FTD R$100</button>
                <button type="button" onClick={() => handleSimulateAction('bet_placed', 50, 'Fortune Tiger')} className="bg-purple-950/30 hover:bg-purple-900/40 border border-purple-900/40 text-xs text-purple-400 py-3 rounded-xl font-bold transition-all">Aposta R$50</button>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SESSÃO 3: PIXELS & TRACKING ---------------- */}
        {activeTab === 'tracking' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#0c0c10] border border-gray-800/80 rounded-2xl p-6 space-y-6">
              <div>
                <h3 className="text-md font-bold text-white flex items-center gap-2"><Code2 size={16} className="text-purple-400" /> Pixels de Conversão (Facebook, TikTok & Google)</h3>
                <p className="text-xs text-gray-500 mt-1">Configure o disparo inteligente de eventos de pixel por API nas Landing Pages automáticas do cassino.</p>
              </div>

              {/* FORMULÁRIO COM O DROPDOWN CUSTOMIZADO */}
              <form onSubmit={handleAddPixelSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl items-start sm:items-center">
                <CustomSelect
                  options={[
                    { value: 'facebook', label: 'Facebook Ads' },
                    { value: 'tiktok', label: 'TikTok Ads' },
                    { value: 'google', label: 'Google Ads' }
                  ]}
                  value={pixelPlatform}
                  onChange={(val) => setPixelPlatform(val)}
                  className="w-full sm:w-48"
                />
                
                <input 
                  type="text" 
                  placeholder="ID do Pixel / Código de Rastreio" 
                  value={pixelIdInput}
                  onChange={(e) => setPixelIdInput(e.target.value)}
                  className="w-full bg-[#111116] border border-gray-800/80 rounded-xl px-4 py-2.5 text-xs text-white outline-none flex-1 focus:border-purple-500/50 transition-all placeholder:text-gray-600" 
                />
                
                <button type="submit" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-purple-600/10 whitespace-nowrap">
                  <Plus size={14} /> Injetar
                </button>
              </form>

              {/* LISTA DE PIXELS INJETADOS */}
              <div className="space-y-2">
                {affiliate.pixels.length === 0 ? (
                  <p className="text-xs text-gray-600 font-mono py-4 text-center">Nenhum pixel ativo integrado neste link.</p>
                ) : (
                  affiliate.pixels.map(pixel => (
                    <div key={pixel.id} className="bg-black/30 border border-gray-900 rounded-xl p-3 flex justify-between items-center font-mono text-xs">
                      <div>
                        <span className="font-bold text-[10px] uppercase text-purple-400 tracking-wider block">{pixel.platform}</span>
                        <span className="text-gray-300">{pixel.pixelId}</span>
                      </div>
                      <button type="button" onClick={() => removePixel(affiliate.id, pixel.id)} className="text-gray-500 hover:text-red-400 p-1 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* FEED DE LIVE TRACKING */}
            <div className="bg-[#0b0b0e] border border-gray-900 rounded-2xl p-5 flex flex-col h-full justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2 mb-4"><Radio size={14} className="text-purple-500 animate-pulse" /> Live API Tracking Feed</h4>
                <div className="space-y-2 font-mono text-[10px] max-h-[300px] overflow-y-auto pr-1">
                  {webhookLogs.map((log, i) => (
                    <div key={i} className="p-2 bg-black/50 border border-gray-900 rounded-lg">
                      <div className="flex justify-between text-gray-600 text-[9px] mb-0.5">
                        <span>{log.time}</span>
                        <span className="text-purple-400 font-bold">{log.event}</span>
                      </div>
                      <p className="text-gray-400">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- SESSÃO 4: MINHA REDE (SUB) ---------------- */}
        {activeTab === 'network' && (
          <div className="space-y-6">
            <div className="bg-[#0c0c10] border border-gray-800/80 p-6 rounded-2xl space-y-4">
              <div>
                <h3 className="font-bold text-sm text-white">Recrutamento Unilevel de Afiliados (Tier 2)</h3>
                <p className="text-xs text-gray-500">Recrute influenciadores menores e receba **Sub-RevShare fixo de 5%** de todo o faturamento deles.</p>
              </div>
              <div className="flex gap-2 max-w-md">
                <input type="text" readOnly value={`cassinotop.com/register?ref=${affiliate.code}`} className="bg-black/40 border border-gray-800 rounded-xl px-4 py-2.5 text-xs font-mono text-gray-400 flex-1 outline-none" />
                <button type="button" onClick={() => copyLink(`https://cassinotop.com/register?ref=${affiliate.code}`)} className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 rounded-xl transition-all">Copiar Convite</button>
              </div>
            </div>

            <div className="bg-[#0c0c10] border border-gray-800/80 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs text-gray-400">
                <thead className="bg-black/40 text-gray-500 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Parceiro Indicado</th>
                    <th className="p-4">Cadastros</th>
                    <th className="p-4">Volume da Rede</th>
                    <th className="p-4 text-right">Seu Repasse (5%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900 text-gray-300">
                  <tr>
                    <td className="p-4 font-bold text-white">Lucas Tipster Capixaba</td>
                    <td className="p-4 font-mono">84 jogadores</td>
                    <td className="p-4 text-purple-400 font-mono">R$ 14.500,00</td>
                    <td className="p-4 text-right text-emerald-400 font-black font-mono">+R$ 725,00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------------- SESSÃO 5: CAIXA & SAQUES ---------------- */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0c0c10] border border-gray-800/80 p-6 rounded-2xl text-left flex flex-col justify-center">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Saldo Disponível para Resgate</p>
                <h2 className="text-3xl font-black text-emerald-400 mt-2">R$ 3.650,00</h2>
              </div>

              <div className="bg-[#0c0c10] border border-gray-800/80 p-6 rounded-2xl md:col-span-2">
                <h3 className="text-xs font-bold uppercase text-gray-400 mb-4 flex items-center gap-1.5"><Landmark size={16} className="text-purple-400" /> Sacar via PIX Instantâneo</h3>
                <form onSubmit={(e) => { e.preventDefault(); setWithdrawSuccess(true); setWithdrawAmount(''); }} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" required placeholder="Sua Chave PIX (CPF/Email)" value={pixKey} onChange={(e) => setPixKey(e.target.value)} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white" />
                    <input type="number" required placeholder="Valor (R$)" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="w-full bg-black border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white" />
                  </div>
                  <button type="submit" className="bg-emerald-500 text-black font-bold text-xs uppercase px-5 py-2.5 rounded-xl">Solicitar Dinheiro</button>
                  {withdrawSuccess && <p className="text-xs text-emerald-400 font-bold">✓ Pedido enviado! Verifique o status na Auditoria do Cassino.</p>}
                </form>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
