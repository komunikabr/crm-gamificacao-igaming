import React, { useState } from 'react';
import { useMockStore } from '../../hooks/useMockStore';
import { 
  Shield, PlusCircle, LayoutGrid, Users, 
  Dices, Percent, Radio, Coins
} from 'lucide-react';

export default function OperatorDashboard() {
  const { affiliates, activeMissions, addMission, webhookLogs } = useMockStore();

  // Estados locais para controlar o formulário de nova missão
  const [title, setTitle] = useState('');
  const [game, setGame] = useState('Fortune Tiger');
  const [targetAmount, setTargetAmount] = useState('');
  const [rewardXp, setRewardXp] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  // Calcula métricas globais da plataforma para o dono do cassino ver
  const totalCpaPaid = affiliates.reduce((acc, aff) => acc + aff.cpaEarned, 0);
  const totalRevSharePaid = affiliates.reduce((acc, aff) => acc + aff.revShareEarned, 0);
  const totalPlayersCount = affiliates.reduce((acc, aff) => acc + aff.playersCount, 0);

  const handleSubmitMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount || !rewardXp) return;

    // Envia a nova missão direto para o nosso cérebro centralizado
    addMission({
      title,
      game,
      targetAmount: Number(targetAmount),
      rewardXp: Number(rewardXp)
    });

    // Limpa o formulário e exibe feedback visual
    setTitle('');
    setTargetAmount('');
    setRewardXp('');
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 p-6 font-sans">
      
      {/* HEADER DO OPERADOR */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1">
            <Shield size={14} /> Painel Administrativo do Cassino
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-white via-gray-300 to-gray-600 bg-clip-text text-transparent">
            Backoffice CRM iGaming
          </h1>
          <p className="text-gray-400 text-sm mt-1">Gestão de metas de engajamento, comissões de afiliados e retenção.</p>
        </div>
      </header>

      {/* MÉTRICAS GLOBAIS DO CASSINO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#0f121d] border border-gray-800/60 p-6 rounded-2xl">
          <p className="text-xs font-bold tracking-wider text-gray-500 uppercase flex items-center gap-1.5">
            <Coins size={14} className="text-cyan-400" /> CPA Total Distribuído
          </p>
          <h3 className="text-3xl font-black text-cyan-400 mt-2">R$ {totalCpaPaid.toFixed(2)}</h3>
          <p className="text-[11px] text-gray-400 mt-1">Pago a parceiros por FTDs válidos</p>
        </div>

        <div className="bg-[#0f121d] border border-gray-800/60 p-6 rounded-2xl">
          <p className="text-xs font-bold tracking-wider text-gray-500 uppercase flex items-center gap-1.5">
            <Percent size={14} className="text-blue-400" /> RevShare Total Gerado
          </p>
          <h3 className="text-3xl font-black text-blue-400 mt-2">R$ {totalRevSharePaid.toFixed(2)}</h3>
          <p className="text-[11px] text-gray-400 mt-1">Volume líquido dividido com a base</p>
        </div>

        <div className="bg-[#0f121d] border border-gray-800/60 p-6 rounded-2xl">
          <p className="text-xs font-bold tracking-wider text-gray-500 uppercase flex items-center gap-1.5">
            <Users size={14} className="text-indigo-400" /> Total de Jogadores no CRM
          </p>
          <h3 className="text-3xl font-black text-indigo-400 mt-2">{totalPlayersCount}</h3>
          <p className="text-[11px] text-gray-400 mt-1">Usuários integrados via ID/WhatsApp</p>
        </div>

        <div className="bg-[#0f121d] border border-gray-800/60 p-6 rounded-2xl">
          <p className="text-xs font-bold tracking-wider text-gray-500 uppercase flex items-center gap-1.5">
            <LayoutGrid size={14} className="text-amber-400" /> Campanhas de Retenção
          </p>
          <h3 className="text-3xl font-black text-amber-400 mt-2">{activeMissions.length}</h3>
          <p className="text-[11px] text-gray-400 mt-1">Desafios ativos injetados nos links</p>
        </div>
      </div>

      {/* BLOCO DUPLO: CRIADOR DE MISSÕES E LISTAGEM DE PARCEIROS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA 1 & 2: FORMULÁRIO DO OPERADOR (GERADOR DE GAMIFICAÇÃO) */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-[#0f121d] border border-gray-800/60 rounded-2xl p-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-amber-400">
              <PlusCircle size={20} />
              Criar Nova Missão de Retenção Cruzada
            </h2>
            <p className="text-xs text-gray-400 mt-1 mb-6">
              Injete uma nova meta coletiva direto no ecossistema. Quando o volume acumulado de apostas dos jogadores de um afiliado bater o valor alvo, a base inteira dele ganha bônus e o afiliado sobe de nível.
            </p>

            <form onSubmit={handleSubmitMission} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Título do Desafio</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Torneio de Fim de Semana do Tigre" 
                    className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500/50 outline-none transition-all text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Jogo Alvo (API)</label>
                  <select 
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500/50 outline-none transition-all text-gray-300"
                  >
                    <option value="Fortune Tiger">Fortune Tiger (Tigrinho)</option>
                    <option value="Mines">Mines (Minas)</option>
                    <option value="Aviator">Aviator (Aviãozinho)</option>
                    <option value="Fortune Ox">Fortune Ox (Touro)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Volume Requerido de Rollover (R$)</label>
                  <input 
                    type="number" 
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="Ex: 500" 
                    className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500/50 outline-none transition-all text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Recompensa da Missão (XP para a Base)</label>
                  <input 
                    type="number" 
                    value={rewardXp}
                    onChange={(e) => setRewardXp(e.target.value)}
                    placeholder="Ex: 100" 
                    className="w-full bg-black/40 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500/50 outline-none transition-all text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button 
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/10"
                >
                  Disparar Campanha no CRM
                </button>

                {successMessage && (
                  <span className="text-xs font-semibold text-emerald-400 animate-fade-in">
                    ✓ Campanha publicada! Já está ativa nos links dos afiliados.
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* VISÃO GERAL DE PARCEIROS AFILIADOS */}
          <div className="bg-[#0f121d] border border-gray-800/60 rounded-2xl p-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Users size={18} className="text-cyan-400" />
              Afiliados Cadastrados no Sistema
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-400">
                <thead className="bg-black/20 text-gray-500 uppercase font-mono tracking-wider">
                  <tr>
                    <th className="p-3 rounded-l-lg">Nome / Link</th>
                    <th className="p-3">Nível VIP</th>
                    <th className="p-3">RevShare Atual</th>
                    <th className="p-3 rounded-r-lg text-right">Total Acumulado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {affiliates.map((aff) => (
                    <tr key={aff.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-white">{aff.name}</div>
                        <div className="text-[10px] text-cyan-400 font-mono mt-0.5">?aff={aff.code}</div>
                      </td>
                      <td className="p-3">
                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono font-bold">
                          LVL {aff.level}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-gray-300">{aff.revShare}%</td>
                      <td className="p-3 text-right font-bold text-emerald-400">
                        R$ {(aff.cpaEarned + aff.revShareEarned).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* COLUNA 3: MONITOR DE REQUISIÇÕES (WEBHOOKS) */}
        <div className="bg-[#0a0c14] border border-gray-900 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-4">
              <Radio size={16} className="text-cyan-400 animate-pulse" />
              Global Traffic Gateway
            </h2>
            <div className="space-y-3 font-mono text-[11px] max-h-[480px] overflow-y-auto pr-1">
              {webhookLogs.map((log, i) => (
                <div key={i} className="p-2.5 bg-black/50 border border-gray-900 rounded-lg">
                  <div className="flex justify-between text-gray-500 font-sans mb-1">
                    <span>{log.time}</span>
                    <span className="text-cyan-400 font-bold">{log.event}</span>
                  </div>
                  <p className="text-gray-300 break-all">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-900 text-[11px] text-gray-600 text-center font-mono">
            SECURE WEBHOOK RECEIVER v1.0
          </div>
        </div>

      </div>

    </div>
  );
}
