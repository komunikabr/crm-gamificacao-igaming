import { create } from 'zustand';

// Definição dos tipos para o TypeScript (Baseado no nosso schema do Drizzle)
export interface Affiliate {
  id: string;
  name: string;
  code: string; // Código do link (?aff=...)
  xp: number;
  level: number;
  revShare: number;
  cpaEarned: number;
  revShareEarned: number;
  playersCount: number;
}

export interface Player {
  id: string;
  whatsapp: string;
  affiliateCode: string;
  xp: number;
  level: number;
  totalDeposited: number;
  totalBet: number;
}

export interface Mission {
  id: string;
  title: string;
  game: string;
  targetAmount: number;
  rewardXp: number;
  currentProgress: number;
  isCompleted: boolean;
}

interface MockStore {
  affiliates: Affiliate[];
  players: Player[];
  activeMissions: Mission[];
  webhookLogs: Array<{ time: string; event: string; details: string }>;
  
  // Função que simula a chegada de um Webhook real do Cassino
  simulateCasinoWebhook: (eventType: 'deposit_made' | 'bet_placed', payload: { whatsapp: string; amount: number; game?: string }) => void;
  // Função para criar uma nova missão (Painel do Operador)
  addMission: (mission: Omit<Mission, 'id' | 'currentProgress' | 'isCompleted'>) => void;
}

export const useMockStore = create<MockStore>((set, get) => ({
  // 1. Dados Iniciais Simulados (Mock Data)
  affiliates: [
    { id: '1', name: 'Beto Influencer iGaming', code: 'beto777', xp: 450, level: 3, revShare: 30, cpaEarned: 1200, revShareEarned: 2450, playersCount: 142 },
    { id: '2', name: 'Tipster do Telegram VIP', code: 'vipgreen', xp: 120, level: 1, revShare: 30, cpaEarned: 400, revShareEarned: 890, playersCount: 38 }
  ],
  
  players: [
    { id: 'p1', whatsapp: '+5513999999999', affiliateCode: 'beto777', xp: 20, level: 1, totalDeposited: 150, totalBet: 340 }
  ],

  activeMissions: [
    { id: 'm1', title: 'Desafio do Tigre Diário', game: 'Fortune Tiger', targetAmount: 100, rewardXp: 50, currentProgress: 40, isCompleted: false },
    { id: 'm2', title: 'Explorador de Minas', game: 'Mines', targetAmount: 50, rewardXp: 30, currentProgress: 0, isCompleted: false }
  ],

  webhookLogs: [
    { time: '11:42', event: 'SISTEMA_INICIADO', details: 'Aguardando webhooks de apostas...' }
  ],

  // 2. Lógica de Negócio Viva (Gamificação Cruzada)
  simulateCasinoWebhook: (eventType, payload) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    set((state) => {
      // Clona os estados atuais para manipulação segura
      let updatedPlayers = [...state.players];
      let updatedMissions = [...state.activeMissions];
      let updatedAffiliates = [...state.affiliates];
      
      // Encontra ou cria o jogador que disparou o evento
      let player = updatedPlayers.find(p => p.whatsapp === payload.whatsapp);
      if (!player) {
        player = { id: 'p_' + Math.random(), whatsapp: payload.whatsapp, affiliateCode: 'beto777', xp: 0, level: 1, totalDeposited: 0, totalBet: 0 };
        updatedPlayers.push(player);
      }

      let logDetails = '';

      // FLUXO A: Se o jogador fez um depósito
      if (eventType === 'deposit_made') {
        player.totalDeposited += payload.amount;
        logDetails = `Jogador ${player.whatsapp} depositou R$ ${payload.amount}`;
        
        // Dá comissão de CPA e XP para o Afiliado dele
        const aff = updatedAffiliates.find(a => a.code === player?.affiliateCode);
        if (aff) {
          aff.cpaEarned += 50; // R$ 50 fixo de CPA por depósito simulação
          aff.xp += 25;        // Afiliado ganha XP por trazer depósito
          if (aff.xp >= aff.level * 200) { // Sistema simples de Level Up do afiliado
            aff.level += 1;
            aff.revShare += 2.5; // Sobe o RevShare automaticamente como recompensa!
          }
        }
      }

      // FLUXO B: Se o jogador fez uma aposta
      if (eventType === 'bet_placed') {
        player.totalBet += payload.amount;
        logDetails = `Aposta de R$ ${payload.amount} no jogo ${payload.game}`;
        
        // Atualiza as missões do jogador se for no jogo alvo
        updatedMissions = updatedMissions.map(mission => {
          if (!mission.isCompleted && mission.game === payload.game) {
            const newProgress = mission.currentProgress + payload.amount;
            const isNowCompleted = newProgress >= mission.targetAmount;
            
            if (isNowCompleted) {
              player!.xp += mission.rewardXp; // Jogador ganha XP se completar missão
              if (player!.xp >= player!.level * 100) {
                player!.level += 1; // Level up do jogador
              }
            }
            
            return {
              ...mission,
              currentProgress: Math.min(newProgress, mission.targetAmount),
              isCompleted: isNowCompleted
            };
          }
          return mission;
        });
      }

      // Adiciona o log no painel de monitoramento
      const newLog = { time: timeNow, event: eventType.toUpperCase(), details: logDetails };

      return {
        players: updatedPlayers,
        activeMissions: updatedMissions,
        affiliates: updatedAffiliates,
        webhookLogs: [newLog, ...state.webhookLogs].slice(0, 10) // Mantém os 10 últimos logs
      };
    });
  },

  addMission: (mission) => set((state) => ({
    activeMissions: [
      ...state.activeMissions,
      { ...mission, id: 'm_' + Math.random(), currentProgress: 0, isCompleted: false }
    ]
  }))
}));
