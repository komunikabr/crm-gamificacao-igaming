import { create } from 'zustand';

// --- INTERFACES DOS NOVOS DADOS ---

export interface Affiliate {
  id: string;
  name: string;
  code: string;
  level: number;
  xp: number;
  cpaEarned: number;
  revShareEarned: number;
  playersCount: number;
  revShare: number;
  // Novos Campos Profissionais
  funnel: {
    clicks: number;
    registrations: number;
    ftds: number; // First Time Deposits (Novos Depositantes)
    subDeposits: number; // Segundos/Terceiros depósitos
  };
  pixels: {
    id: string;
    platform: 'facebook' | 'tiktok' | 'google';
    pixelId: string;
  }[];
}

export interface Mission {
  id: string;
  title: string;
  game: string;
  targetAmount: number;
  currentProgress: number;
  rewardXp: number;
}

export interface WebhookLog {
  time: string;
  event: string;
  details: string;
}

export interface LeadFrio {
  id: string;
  whatsapp: string;
  name: string;
  registeredAt: string;
  status: 'pending_deposit' | 'churned';
  lastGamePlayed?: string;
  daysInactive: number;
}

export interface SystemConfig {
  globalCpa: number;
  baseRevShare: number;
  xpPerFtd: number;
  xpPerBetPercent: number;
}

// --- INTERFACE DA MOCK STORE CENTRALIZADA ---

interface MockStore {
  affiliates: Affiliate[];
  activeMissions: Mission[];
  webhookLogs: WebhookLog[];
  leadsFrios: LeadFrio[];
  systemConfig: SystemConfig;
  
  // Ações do Sistema
  simulateCasinoWebhook: (type: 'deposit_made' | 'bet_placed' | 'new_registration' | 'click_tracked', data: any) => void;
  addMission: (mission: Omit<Mission, 'id' | 'currentProgress'>) => void;
  addPixel: (affiliateId: string, platform: 'facebook' | 'tiktok' | 'google', pixelId: string) => void;
  removePixel: (affiliateId: string, pixelId: string) => void;
  triggerWhatsAppAutomation: (leadId: string, template: string) => void;
  updateSystemConfig: (config: Partial<SystemConfig>) => void;
}

// --- INSTÂNCIA DA STORE COM OS DADOS ENRIQUECIDOS ---

export const useMockStore = create<MockStore>((set, get) => ({
  // Estado Inicial Rico em Informações para Demonstração
  affiliates: [
    {
      id: '1',
      name: 'Beto Influencer Gaming',
      code: 'BETOPRO',
      level: 3,
      xp: 340,
      cpaEarned: 2450.00,
      revShareEarned: 1200.00,
      playersCount: 49,
      revShare: 35,
      funnel: {
        clicks: 1420,
        registrations: 280,
        ftds: 49,
        subDeposits: 112
      },
      pixels: [
        { id: 'p1', platform: 'facebook', pixelId: '123456789012345' }
      ]
    }
  ],

  activeMissions: [
    { id: 'm1', title: 'Alavancagem de Fim de Semana', game: 'Fortune Tiger', targetAmount: 1000, currentProgress: 650, rewardXp: 150 },
    { id: 'm2', title: 'Operação Mina de Ouro', game: 'Mines', targetAmount: 500, currentProgress: 120, rewardXp: 80 }
  ],

  leadsFrios: [
    { id: 'l1', name: 'Carlos Eduardo', whatsapp: '+55 (11) 98765-4321', registeredAt: '2026-05-18', status: 'pending_deposit', daysInactive: 4 },
    { id: 'l2', name: 'Amanda Souza', whatsapp: '+55 (21) 99888-7766', registeredAt: '2026-05-15', status: 'pending_deposit', daysInactive: 7 },
    { id: 'l3', name: 'Marcos Silva', whatsapp: '+55 (13) 99111-2233', registeredAt: '2026-04-20', status: 'churned', lastGamePlayed: 'Aviator', daysInactive: 32 }
  ],

  systemConfig: {
    globalCpa: 50.00,
    baseRevShare: 30,
    xpPerFtd: 50,
    xpPerBetPercent: 0.1 // 10% do valor apostado vira XP para a base coletiva
  },

  webhookLogs: [
    { time: new Date().toLocaleTimeString(), event: 'SYSTEM_BOOT', details: 'CRM Gateway de Gamificação inicializado com sucesso.' }
  ],

  // --- LÓGICA CORE DO WEBHOOK GATEWAY (RODA TUDO EM TEMPO REAL) ---

  simulateCasinoWebhook: (type, data) => {
    const time = new Date().toLocaleTimeString();
    
    set((state) => {
      // Clona os dados do estado para mutabilidade segura
      const updatedAffiliates = [...state.affiliates];
      const updatedMissions = [...state.activeMissions];
      const currentConfig = state.systemConfig;
      let logDetails = '';

      // 1. Processa cliques no link do afiliado
      if (type === 'click_tracked') {
        updatedAffiliates[0].funnel.clicks += 1;
        logDetails = `Click originado do link de afiliado. Total: ${updatedAffiliates[0].funnel.clicks}`;
      }

      // 2. Processa novos cadastros na API do Cassino (Lead criado, aguardando FTD)
      if (type === 'new_registration') {
        updatedAffiliates[0].funnel.registrations += 1;
        logDetails = `Novo usuário cadastrado via API: ${data.name || 'Lead Anônimo'} (${data.whatsapp})`;
        
        // Injeta automaticamente na lista de Leads Frios do Operador para automação posterior
        state.leadsFrios.unshift({
          id: `l_${Math.random()}`,
          name: data.name || 'Novo Lead',
          whatsapp: data.whatsapp,
          registeredAt: new Date().toISOString().split('T')[0],
          status: 'pending_deposit',
          daysInactive: 0
        });
      }

      // 3. Processa Primeiro Depósito (Gera CPA, Libera Pixels e dá XP)
      if (type === 'deposit_made') {
        updatedAffiliates[0].cpaEarned += currentConfig.globalCpa;
        updatedAffiliates[0].playersCount += 1;
        updatedAffiliates[0].funnel.ftds += 1;
        updatedAffiliates[0].xp += currentConfig.xpPerFtd;
        
        logDetails = `FTD Identificado! Valor: R$ ${data.amount}. Comissão de CPA de R$ ${currentConfig.globalCpa} injetada para o parceiro. +${currentConfig.xpPerFtd} XP ganho.`;
        
        // Verifica se o afiliado bateu o teto de XP para subir de nível
        if (updatedAffiliates[0].xp >= 600) {
          updatedAffiliates[0].level += 1;
          updatedAffiliates[0].xp = updatedAffiliates[0].xp - 600; // Mantém o resto
        }
      }

      // 4. Processa Aposta (Gera RevShare e alimenta a barra de progresso da Missão)
      if (type === 'bet_placed') {
        const estornoRevshare = data.amount * (updatedAffiliates[0].revShare / 100);
        updatedAffiliates[0].revShareEarned += estornoRevshare;
        updatedAffiliates[0].funnel.subDeposits += 1;
        
        // Calcula ganho de XP Coletivo proporcional à aposta
        const xpGanho = Math.ceil(data.amount * currentConfig.xpPerBetPercent);
        updatedAffiliates[0].xp += xpGanho;

        logDetails = `Aposta processada no jogo [${data.game}]. Valor: R$ ${data.amount}. RevShare gerado: R$ ${estornoRevshare.toFixed(2)}. +${xpGanho} XP adicionado ao progresso global.`;

        // Alimenta o progresso de todas as missões que pertencem a esse jogo específico
        updatedMissions.forEach(mission => {
          if (mission.game === data.game && mission.currentProgress < mission.targetAmount) {
            mission.currentProgress = Math.min(mission.targetAmount, mission.currentProgress + data.amount);
          }
        });
      }

      // Registra o log no topo da lista
      const newLog = { time, event: type.toUpperCase(), details: logDetails };
      return {
        affiliates: updatedAffiliates,
        activeMissions: updatedMissions,
        webhookLogs: [newLog, ...state.webhookLogs]
      };
    });
  },

  // --- OUTRAS AÇÕES DO SISTEMA ---

  addMission: (mission) => set((state) => ({
    activeMissions: [
      ...state.activeMissions,
      { ...mission, id: `m_${Math.random()}`, currentProgress: 0 }
    ],
    webhookLogs: [
      { 
        time: new Date().toLocaleTimeString(), 
        event: 'CRM_CAMPAIGN_LAUNCH', 
        details: `Nova campanha de retenção lançada para o jogo ${mission.game}. Alvo de Rollover: R$ ${mission.targetAmount}.`
      },
      ...state.webhookLogs
    ]
  })),

  addPixel: (affiliateId, platform, pixelId) => set((state) => {
    const updatedAffiliates = state.affiliates.map(aff => {
      if (aff.id === affiliateId) {
        return {
          ...aff,
          pixels: [...aff.pixels, { id: `p_${Math.random()}`, platform, pixelId }]
        };
      }
      return aff;
    });
    return { affiliates: updatedAffiliates };
  }),

  removePixel: (affiliateId, pixelId) => set((state) => {
    const updatedAffiliates = state.affiliates.map(aff => {
      if (aff.id === affiliateId) {
        return {
          ...aff,
          pixels: aff.pixels.filter(p => p.id !== pixelId)
        };
      }
      return aff;
    });
    return { affiliates: updatedAffiliates };
  }),

  triggerWhatsAppAutomation: (leadId, template) => set((state) => {
    const lead = state.leadsFrios.find(l => l.id === leadId);
    return {
      webhookLogs: [
        {
          time: new Date().toLocaleTimeString(),
          event: 'WA_CRM_DISPATCH',
          details: `Mensagem enviada via WhatsApp API para ${lead?.name} (${lead?.whatsapp}). Template Utilizado: [${template}].`
        },
        ...state.webhookLogs
      ]
    };
  }),

  updateSystemConfig: (newConfig) => set((state) => ({
    systemConfig: { ...state.systemConfig, ...newConfig }
  }))
}));
