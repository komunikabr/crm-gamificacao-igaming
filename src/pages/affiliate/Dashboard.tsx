import React, { useState } from 'react';
import { useMockStore } from '../../hooks/useMockStore'; // 👈 Caminho atualizado!
import { 
  TrendingUp, Users, DollarSign, Award, 
  Link2, Trophy, Zap, Radio
} from 'lucide-react';

export default function AffiliateDashboard() {
  const { affiliates, simulateCasinoWebhook, activeMissions, webhookLogs } = useMockStore();
  const affiliate = affiliates[0];
  const [copied, setCopied] = useState(false);

  const handleSimulateAction = (type: 'deposit_made' | 'bet_placed', amount: number, game?: string) => {
    simulateCasinoWebhook(type, { whatsapp: '+5513999999999', amount, game });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://cassinotop.com/?aff=${affiliate.code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#060608] text-gray-100 p-6 font-sans selection:bg-purple-500 selection:text-white">
      {/* HEADER DO PAINEL */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            Ambiente de Demonstração Ativo
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
            Painel do Parceiro
          </h1>
          <p className="text-gray-400 text-sm mt-1">Olá, <span className="text-white font-medium">{affiliate.name}</span>. Monitore seus lucros e conquistas de hoje.</p>
        </div>

        {/* STATUS VIP DO AFILIADO (GAMIFICAÇÃO) */}
        <div className="bg-[#111115] border border-purple-900/40 rounded-xl p-4 flex items-center gap-4 shadow-lg shadow-purple-950/20 max-w-xs w-full">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center font-black text-xl text-white border border-purple-400/30 shadow-md shadow-purple-500/20">
            {affiliate.level}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-purple-400 font-bold flex items-center gap-1">
                <Award size={14} /> Nível VIP
              </span>
              <span className="text-gray-400">{affiliate.xp} / {affiliate.level * 200} XP</span>
            </div>
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-500"
                style={{ width: `${(affiliate.xp / (affiliate.level * 200)) * 100}%` }}
              />
            </div>
            <div className="text-[10px] text-gray-400 mt-1">
              Próximo Nível: <span className="text-emerald-400 font-semibold">+{affiliate.revShare + 2.5}% RevShare</span>
            </div>
          </div>
        </div>
      </header>

      {/* METRICAS PRINCIPAIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#0c0c10] border border-gray-800 p-6 rounded-2xl relative overflow-hidden group hover:border-purple-900/50 transition-all">
          <div className="absolute top-0 right-0 p-4 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors">
            <DollarSign size={80} />
          </div>
          <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">Ganhos de CPA</p>
          <h3 className="text-3xl font-black text-emerald-400 mt-2">R$ {affiliate.cpaEarned.toFixed(2)}</h3>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <TrendingUp size={12} className="text-emerald-400" /> +R$ 50.00 por novo FTD
          </p>
        </div>

        <div className="bg-[#0c0c10] border border-gray-800 p-6 rounded-2xl relative overflow-hidden group hover:border-purple-900/50 transition-all">
          <div className="absolute top-0 right-0 p-4 text-purple-500/10 group-hover:text-purple-500/20 transition-colors">
            <TrendingUp size={80} />
          </div>
          <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">Ganhos RevShare</p>
          <h3 className="text-3xl font-black text-purple-400 mt-2">R$ {affiliate.revShareEarned.toFixed(2)}</h3>
          <p className="text-xs text-purple-400 mt-1 font-semibold">
            Sua Taxa Atual: {affiliate.revShare}%
          </p>
        </div>

        <div className="bg-[#0c0c10] border border-gray-800 p-6 rounded-2xl relative overflow-hidden group hover:border-purple-900/50 transition-all">
          <div className="absolute top-0 right-0 p-4 text-blue-500/10 group-hover:text-blue-500/20 transition-colors">
            <Users size={80} />
          </div>
          <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">Jogadores Indicados</p>
          <h3 className="text-3xl font-black text-blue-400 mt-2">{affiliate.playersCount}</h3>
          <p className="text-xs text-gray-400 mt-1">Cadastros diretos via link</p>
        </div>

        {/* FERRAMENTA DE LINK DE AFILIADO NATIVO */}
        <div className="bg-gradient-to-br from-[#120e1a] to-[#0c0c10] border border-purple-950 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold tracking-wider text-purple-400 uppercase flex items-center gap-1">
              <Link2 size={12} /> Link de Divulgação Nativo
            </p>
            <p className="text-xs text-gray-400 mt-1">Seus usuários caem direto no fluxo gamificado.</p>
          </div>
          <div className="mt-4 flex gap-2">
            <input 
              type="text" 
              readOnly 
              value={`cassinotop.com/?aff=${affiliate.code}`} 
              className="bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-xs font-mono text-gray-400 flex-1 outline-none"
            />
            <button 
              onClick={copyLink}
              className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${copied ? 'bg-emerald-500 text-black' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
            >
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>
      </div>

      {/* SEÇÃO PRINCIPAL - DOIS LADOS DO ECOSSISTEMA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA 1 & 2: MONITOR DE GAMIFICAÇÃO EM TEMPO REAL */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* PAINEL DE MISSÕES ATIVAS DOS JOGADORES DESTE AFILIADO */}
          <div className="bg-[#0c0c10] border border-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="text-yellow-500" size={20} />
                Missões Ativas dos Seus Jogadores
              </h2>
              <span className="text-xs bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full border border-yellow-500/20 font-medium">
                Retenção Ativa
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Seus jogadores veem essas missões. Conforme eles jogam para cumpri-las, seus ganhos em RevShare aumentam.
            </p>

            <div className="space-y-4">
              {activeMissions.map((mission) => (
                <div key={mission.id} className="bg-[#111116] border border-gray-800/80 rounded-xl p-4 hover:border-gray-700/50 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-white">{mission.title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Alvo: Apostar no jogo <span className="text-purple-400 font-semibold">{mission.game}</span></p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${mission.isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                      {mission.isCompleted ? 'Concluída!' : `Recompensa: +${mission.rewardXp} XP`}
                    </span>
                  </div>

                  {/* BARRA DE PROGRESSO DA MISSÃO */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${mission.isCompleted ? 'bg-emerald-500' : 'bg-purple-500'}`}
                        style={{ width: `${(mission.currentProgress / mission.targetAmount) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-gray-500 mt-1">
                      <span>Progresso Coletivo da Base</span>
                      <span className="font-mono text-gray-300">R$ {mission.currentProgress} / R$ {mission.targetAmount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SIMULADOR DE EVENTOS DA API */}
          <div className="bg-[#0f0e14] border border-purple-950/40 rounded-2xl p-6 relative">
            <div className="absolute -top-3 left-6 bg-purple-600 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-md shadow-purple-600/20">
              Controle do Simulador Técnico
            </div>
            <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2 mt-1">
              <Zap size={18} /> Disparar Webhooks Fakes do Cassino
            </h3>
            <p className="text-xs text-gray-400 mt-1 mb-6">
              Clique nos botões abaixo para simular ações em tempo real vindas da API do Cassino externo e veja a gamificação atualizar instantaneamente os gráficos e o nível acima.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                onClick={() => handleSimulateAction('deposit_made', 150)}
                className="bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-black border border-emerald-500/20 rounded-xl p-4 text-left transition-all group"
              >
                <div className="font-bold text-xs uppercase tracking-wider opacity-60">Evento 1</div>
                <div className="font-black text-sm mt-1">Novo Depósito (FTD)</div>
                <div className="text-[10px] mt-1 opacity-80 group-hover:opacity-100">+R$50 CPA & +25 XP</div>
              </button>

              <button 
                onClick={() => handleSimulateAction('bet_placed', 20, 'Fortune Tiger')}
                className="bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-black border border-purple-500/20 rounded-xl p-4 text-left transition-all group"
              >
                <div className="font-bold text-xs uppercase tracking-wider opacity-60">Evento 2</div>
                <div className="font-black text-sm mt-1">Aposta Fortune Tiger</div>
                <div className="text-[10px] mt-1 opacity-80 group-hover:opacity-100">Aposta R$20 no Tigrinho</div>
              </button>

              <button 
                onClick={() => handleSimulateAction('bet_placed', 15, 'Mines')}
                className="bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-black border border-indigo-500/20 rounded-xl p-4 text-left transition-all group"
              >
                <div className="font-bold text-xs uppercase tracking-wider opacity-60">Evento 3</div>
                <div className="font-black text-sm mt-1">Aposta no Mines</div>
                <div className="text-[10px] mt-1 opacity-80 group-hover:opacity-100">Aposta R$15 no jogo das Minas</div>
              </button>
            </div>
          </div>

        </div>

        {/* COLUNA 3: LOGS DA API */}
        <div className="bg-[#0b0b0e] border border-gray-900 rounded-2xl p-6 flex flex-col h-full justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-4">
              <Radio size={16} className="text-red-500 animate-pulse" />
              Live API Logs (Webhooks)
            </h2>
            <div className="space-y-3 font-mono text-[11px] overflow-y-auto max-h-[380px] pr-1">
              {webhookLogs.map((log, i) => (
                <div key={i} className="p-2.5 bg-black/40 border border-gray-900 rounded-lg">
                  <div className="flex justify-between text-gray-500 font-sans mb-1">
                    <span>{log.time}</span>
                    <span className={`font-bold ${log.event.includes('DEPOSIT') ? 'text-emerald-400' : 'text-purple-400'}`}>
                      {log.event}
                    </span>
                  </div>
                  <p className="text-gray-300 break-all">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-900 text-[11px] text-gray-500 text-center">
            Pronto para acoplagem com Supabase Webhooks.
          </div>
        </div>

      </div>
    </div>
  );
}
