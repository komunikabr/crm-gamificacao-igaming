import { create } from 'zustand';

export interface Pixel {
  id: string;
  platform: 'facebook' | 'tiktok' | 'google';
  pixelId: string;
}

export interface Funnel {
  clicks: number;
  registrations: number;
  ftds: number;
  subDeposits: number;
}

export interface Affiliate {
  id: string;
  operatorId: string;
  name: string;
  email: string;
  code: string;
  level: number;
  xp: number;
  cpaEarned: number;
  revShareEarned: number;
  playersCount: number;
  revShare: number;
  cpaRate: number;
  funnel: Funnel;
  pixels: Pixel[];
  instagramUsername?: string;
  whatsappNumber?: string;
  createdAt: string;
}

export interface Mission {
  id: string;
  operatorId: string;
  title: string;
  game: string;
  targetAmount: number;
  currentProgress: number;
  rewardXp: number;
  isActive: boolean;
}

export interface WebhookLog {
  time: string;
  event: string;
  details: string;
}

export interface LeadFrio {
  id: string;
  operatorId: string;
  affiliateId: string;
  whatsapp: string;
  name: string;
  registeredAt: string;
  status: 'pending_deposit' | 'churned';
  lastGamePlayed?: string;
  daysInactive: number;
}

export interface Operator {
  id: string;
  brandName: string;
  companyName: string;
  apiSecretKey: string;
  globalCpa: number;
  globalRevShare: number;
  xpPerFtd: number;
  xpPerBetPercent: number;
  createdAt: string;
}

interface MockStore {
  operators: Operator[];
  affiliates: Affiliate[];
  activeMissions: Mission[];
  webhookLogs: WebhookLog[];
  leadsFrios: LeadFrio[];

  currentOperatorId: string;
  currentAffiliateId: string;
  currentView: 'affiliate' | 'operator';

  setCurrentOperator: (id: string) => void;
  setCurrentAffiliate: (id: string) => void;
  setCurrentView: (view: 'affiliate' | 'operator') => void;

  getCurrentOperator: () => Operator | undefined;
  getCurrentAffiliate: () => Affiliate | undefined;
  getAffiliatesByOperator: (operatorId: string) => Affiliate[];
  getMissionsByOperator: (operatorId: string) => Mission[];
  getLeadsByOperator: (operatorId: string) => LeadFrio[];

  simulateCasinoWebhook: (
    type: 'deposit_made' | 'bet_placed' | 'new_registration' | 'click_tracked',
    data: { name?: string; whatsapp?: string; amount?: number; game?: string }
  ) => void;
  addMission: (mission: Omit<Mission, 'id' | 'currentProgress' | 'isActive'>) => void;
  addPixel: (affiliateId: string, platform: 'facebook' | 'tiktok' | 'google', pixelId: string) => void;
  removePixel: (affiliateId: string, pixelId: string) => void;
  triggerWhatsAppAutomation: (leadId: string, template: string) => void;
  updateOperatorConfig: (operatorId: string, config: Partial<Pick<Operator, 'globalCpa' | 'globalRevShare'>>) => void;
  addOperator: (op: Omit<Operator, 'id' | 'apiSecretKey' | 'createdAt'>) => void;
  addAffiliate: (aff: Omit<Affiliate, 'id' | 'level' | 'xp' | 'cpaEarned' | 'revShareEarned' | 'playersCount' | 'funnel' | 'pixels' | 'createdAt'>) => void;
}

const OPERATORS: Operator[] = [
  {
    id: 'op1',
    brandName: 'CasinoTop BR',
    companyName: 'CasinoTop Entretenimento LTDA',
    apiSecretKey: 'sk_live_ct_a1b2c3d4e5',
    globalCpa: 50.00,
    globalRevShare: 30,
    xpPerFtd: 50,
    xpPerBetPercent: 0.1,
    createdAt: '2025-01-15',
  },
  {
    id: 'op2',
    brandName: 'Lucky Stars Casino',
    companyName: 'Lucky Stars Apostas S.A.',
    apiSecretKey: 'sk_live_ls_f6g7h8i9j0',
    globalCpa: 75.00,
    globalRevShare: 35,
    xpPerFtd: 60,
    xpPerBetPercent: 0.12,
    createdAt: '2025-03-22',
  },
  {
    id: 'op3',
    brandName: 'TigroSlots',
    companyName: 'TigroSlots Gaming Corp.',
    apiSecretKey: 'sk_live_ts_k1l2m3n4o5',
    globalCpa: 45.00,
    globalRevShare: 28,
    xpPerFtd: 40,
    xpPerBetPercent: 0.08,
    createdAt: '2025-06-10',
  },
];

const AFFILIATES: Affiliate[] = [
  {
    id: 'aff1', operatorId: 'op1', name: 'Beto Influencer Gaming', email: 'beto@gmail.com',
    code: 'BETOPRO', level: 3, xp: 340, cpaEarned: 2450.00, revShareEarned: 1200.00,
    playersCount: 49, revShare: 35, cpaRate: 50,
    funnel: { clicks: 1420, registrations: 280, ftds: 49, subDeposits: 112 },
    pixels: [{ id: 'p1', platform: 'facebook', pixelId: '123456789012345' }],
    instagramUsername: '@betogaming', whatsappNumber: '+5511999990001', createdAt: '2025-02-01',
  },
  {
    id: 'aff2', operatorId: 'op1', name: 'Mariana Apostas VIP', email: 'mari@hotmail.com',
    code: 'MARIVIP', level: 2, xp: 180, cpaEarned: 950.00, revShareEarned: 420.00,
    playersCount: 19, revShare: 30, cpaRate: 50,
    funnel: { clicks: 580, registrations: 90, ftds: 19, subDeposits: 41 },
    pixels: [], instagramUsername: '@marivip', whatsappNumber: '+5521988880002', createdAt: '2025-03-15',
  },
  {
    id: 'aff3', operatorId: 'op2', name: 'Lucas Tipster Capixaba', email: 'lucas@outlook.com',
    code: 'LUCASVIX', level: 4, xp: 520, cpaEarned: 6300.00, revShareEarned: 3800.00,
    playersCount: 84, revShare: 38, cpaRate: 75,
    funnel: { clicks: 3200, registrations: 640, ftds: 84, subDeposits: 310 },
    pixels: [
      { id: 'p2', platform: 'tiktok', pixelId: 'TK-999888777' },
      { id: 'p3', platform: 'google', pixelId: 'AW-123456789' },
    ],
    instagramUsername: '@lucastipster', whatsappNumber: '+5527977770003', createdAt: '2025-04-10',
  },
  {
    id: 'aff4', operatorId: 'op2', name: 'Carla Influencer SC', email: 'carla@gmail.com',
    code: 'CARLASC', level: 1, xp: 90, cpaEarned: 375.00, revShareEarned: 140.00,
    playersCount: 5, revShare: 30, cpaRate: 75,
    funnel: { clicks: 210, registrations: 35, ftds: 5, subDeposits: 9 },
    pixels: [], createdAt: '2026-01-20',
  },
  {
    id: 'aff5', operatorId: 'op3', name: 'Diego Slots Master', email: 'diego@slots.com',
    code: 'DIEGOSP', level: 5, xp: 80, cpaEarned: 18500.00, revShareEarned: 9200.00,
    playersCount: 412, revShare: 40, cpaRate: 45,
    funnel: { clicks: 18400, registrations: 3680, ftds: 412, subDeposits: 1850 },
    pixels: [{ id: 'p4', platform: 'facebook', pixelId: '987654321098765' }],
    instagramUsername: '@diegoslots', whatsappNumber: '+5511966660005', createdAt: '2024-11-01',
  },
];

const MISSIONS: Mission[] = [
  { id: 'm1', operatorId: 'op1', title: 'Alavancagem de Fim de Semana', game: 'Fortune Tiger', targetAmount: 1000, currentProgress: 650, rewardXp: 150, isActive: true },
  { id: 'm2', operatorId: 'op1', title: 'Operação Mina de Ouro', game: 'Mines', targetAmount: 500, currentProgress: 120, rewardXp: 80, isActive: true },
  { id: 'm3', operatorId: 'op2', title: 'Corrida das Estrelas', game: 'Aviator', targetAmount: 2000, currentProgress: 1100, rewardXp: 200, isActive: true },
  { id: 'm4', operatorId: 'op3', title: 'Festival do Tigre', game: 'Fortune Tiger', targetAmount: 5000, currentProgress: 3200, rewardXp: 350, isActive: true },
];

const LEADS: LeadFrio[] = [
  { id: 'l1', operatorId: 'op1', affiliateId: 'aff1', name: 'Carlos Eduardo', whatsapp: '+55 (11) 98765-4321', registeredAt: '2026-05-18', status: 'pending_deposit', daysInactive: 4 },
  { id: 'l2', operatorId: 'op1', affiliateId: 'aff1', name: 'Amanda Souza', whatsapp: '+55 (21) 99888-7766', registeredAt: '2026-05-15', status: 'pending_deposit', daysInactive: 7 },
  { id: 'l3', operatorId: 'op1', affiliateId: 'aff2', name: 'Marcos Silva', whatsapp: '+55 (13) 99111-2233', registeredAt: '2026-04-20', status: 'churned', lastGamePlayed: 'Aviator', daysInactive: 32 },
  { id: 'l4', operatorId: 'op2', affiliateId: 'aff3', name: 'Fernanda Costa', whatsapp: '+55 (27) 99222-5544', registeredAt: '2026-05-19', status: 'pending_deposit', daysInactive: 3 },
  { id: 'l5', operatorId: 'op3', affiliateId: 'aff5', name: 'Roberto Nunes', whatsapp: '+55 (11) 98333-1122', registeredAt: '2026-05-10', status: 'churned', lastGamePlayed: 'Fortune Tiger', daysInactive: 12 },
];

export const useMockStore = create<MockStore>((set, get) => ({
  operators: OPERATORS,
  affiliates: AFFILIATES,
  activeMissions: MISSIONS,
  leadsFrios: LEADS,
  webhookLogs: [
    { time: new Date().toLocaleTimeString('pt-BR'), event: 'SYSTEM_BOOT', details: 'CRM Gateway de Gamificação SaaS inicializado. 3 operadores carregados.' }
  ],

  currentOperatorId: 'op1',
  currentAffiliateId: 'aff1',
  currentView: 'affiliate',

  setCurrentOperator: (id) => {
    const affs = get().affiliates.filter(a => a.operatorId === id);
    set({ currentOperatorId: id, currentAffiliateId: affs[0]?.id ?? '' });
  },
  setCurrentAffiliate: (id) => set({ currentAffiliateId: id }),
  setCurrentView: (view) => set({ currentView: view }),

  getCurrentOperator: () => get().operators.find(o => o.id === get().currentOperatorId),
  getCurrentAffiliate: () => get().affiliates.find(a => a.id === get().currentAffiliateId),
  getAffiliatesByOperator: (operatorId) => get().affiliates.filter(a => a.operatorId === operatorId),
  getMissionsByOperator: (operatorId) => get().activeMissions.filter(m => m.operatorId === operatorId),
  getLeadsByOperator: (operatorId) => get().leadsFrios.filter(l => l.operatorId === operatorId),

  simulateCasinoWebhook: (type, data) => {
    const time = new Date().toLocaleTimeString('pt-BR');
    const { currentAffiliateId, currentOperatorId } = get();

    set((state) => {
      const updatedAffiliates = state.affiliates.map(aff => ({ ...aff, funnel: { ...aff.funnel } }));
      const updatedMissions = state.activeMissions.map(m => ({ ...m }));
      const affIndex = updatedAffiliates.findIndex(a => a.id === currentAffiliateId);
      const op = state.operators.find(o => o.id === currentOperatorId);
      if (affIndex === -1 || !op) return {};

      const aff = updatedAffiliates[affIndex];
      let logDetails = '';

      if (type === 'click_tracked') {
        aff.funnel.clicks += 1;
        logDetails = `Click originado do link [${aff.code}]. Total: ${aff.funnel.clicks.toLocaleString('pt-BR')}`;
      }

      if (type === 'new_registration') {
        aff.funnel.registrations += 1;
        logDetails = `Novo usuário cadastrado via API: ${data.name || 'Lead Anônimo'} (${data.whatsapp})`;
        state.leadsFrios.unshift({
          id: `l_${Math.random()}`,
          operatorId: currentOperatorId,
          affiliateId: currentAffiliateId,
          name: data.name || 'Novo Lead',
          whatsapp: data.whatsapp || '+55 (00) 00000-0000',
          registeredAt: new Date().toISOString().split('T')[0],
          status: 'pending_deposit',
          daysInactive: 0
        });
      }

      if (type === 'deposit_made') {
        aff.cpaEarned += op.globalCpa;
        aff.playersCount += 1;
        aff.funnel.ftds += 1;
        aff.xp += op.xpPerFtd;
        if (aff.xp >= 600) {
          aff.level += 1;
          aff.xp = aff.xp - 600;
        }
        logDetails = `FTD Identificado! Valor: R$ ${data.amount?.toFixed(2)}. CPA de R$ ${op.globalCpa} creditado. +${op.xpPerFtd} XP.`;
      }

      if (type === 'bet_placed') {
        const amount = data.amount ?? 0;
        const revshare = amount * (aff.revShare / 100);
        aff.revShareEarned += revshare;
        aff.funnel.subDeposits += 1;
        const xpGanho = Math.ceil(amount * op.xpPerBetPercent);
        aff.xp += xpGanho;
        logDetails = `Aposta no [${data.game}]. Valor: R$ ${amount}. RevShare: R$ ${revshare.toFixed(2)}. +${xpGanho} XP global.`;

        updatedMissions.forEach(mission => {
          if (mission.operatorId === currentOperatorId && mission.game === data.game && mission.currentProgress < mission.targetAmount) {
            mission.currentProgress = Math.min(mission.targetAmount, mission.currentProgress + amount);
          }
        });
      }

      const newLog = { time, event: type.toUpperCase(), details: logDetails };
      return {
        affiliates: updatedAffiliates,
        activeMissions: updatedMissions,
        webhookLogs: [newLog, ...state.webhookLogs].slice(0, 50),
      };
    });
  },

  addMission: (mission) => set((state) => ({
    activeMissions: [
      ...state.activeMissions,
      { ...mission, id: `m_${Date.now()}`, currentProgress: 0, isActive: true }
    ],
    webhookLogs: [
      {
        time: new Date().toLocaleTimeString('pt-BR'),
        event: 'CRM_CAMPAIGN_LAUNCH',
        details: `Nova campanha [${mission.title}] lançada para ${mission.game}. Alvo: R$ ${mission.targetAmount}.`
      },
      ...state.webhookLogs
    ].slice(0, 50)
  })),

  addPixel: (affiliateId, platform, pixelId) => set((state) => ({
    affiliates: state.affiliates.map(aff =>
      aff.id === affiliateId
        ? { ...aff, pixels: [...aff.pixels, { id: `p_${Date.now()}`, platform, pixelId }] }
        : aff
    )
  })),

  removePixel: (affiliateId, pixelId) => set((state) => ({
    affiliates: state.affiliates.map(aff =>
      aff.id === affiliateId
        ? { ...aff, pixels: aff.pixels.filter(p => p.id !== pixelId) }
        : aff
    )
  })),

  triggerWhatsAppAutomation: (leadId, template) => set((state) => {
    const lead = state.leadsFrios.find(l => l.id === leadId);
    return {
      webhookLogs: [
        {
          time: new Date().toLocaleTimeString('pt-BR'),
          event: 'WA_CRM_DISPATCH',
          details: `WhatsApp enviado para ${lead?.name} (${lead?.whatsapp}). Template: [${template}].`
        },
        ...state.webhookLogs
      ].slice(0, 50)
    };
  }),

  updateOperatorConfig: (operatorId, config) => set((state) => ({
    operators: state.operators.map(op =>
      op.id === operatorId ? { ...op, ...config } : op
    )
  })),

  addOperator: (op) => set((state) => ({
    operators: [
      ...state.operators,
      {
        ...op,
        id: `op_${Date.now()}`,
        apiSecretKey: `sk_live_${Math.random().toString(36).slice(2, 12)}`,
        createdAt: new Date().toISOString().split('T')[0],
      }
    ]
  })),

  addAffiliate: (aff) => set((state) => ({
    affiliates: [
      ...state.affiliates,
      {
        ...aff,
        id: `aff_${Date.now()}`,
        level: 1, xp: 0,
        cpaEarned: 0, revShareEarned: 0, playersCount: 0,
        funnel: { clicks: 0, registrations: 0, ftds: 0, subDeposits: 0 },
        pixels: [],
        createdAt: new Date().toISOString().split('T')[0],
      }
    ]
  })),
}));
