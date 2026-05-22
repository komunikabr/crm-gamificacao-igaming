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

export interface Player {
  id: string;
  operatorId: string;
  affiliateId: string;
  affiliateName: string;
  name: string;
  casinoPlayerId: string;
  whatsappId?: string;
  telegramId?: string;
  level: number;
  xp: number;
  walletPoints: number;
  totalDeposited: number;
  totalBets: number;
  isActiveVip: boolean;
  kycConsentedAt?: string;
  lastActive: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'churned';
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
  id: string;
  time: string;
  event: string;
  details: string;
  operatorId: string;
  status: 'SUCCESS' | 'FAILED' | 'IGNORED';
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

export interface CommissionPayout {
  id: string;
  operatorId: string;
  affiliateId: string;
  affiliateName: string;
  amount: number;
  type: 'CPA' | 'REVSHARE' | 'SUB_AFFILIATE';
  pixKey: string;
  status: 'PENDING' | 'PAID' | 'REJECTED';
  requestedAt: string;
  processedAt?: string;
}

export interface SocialAutomation {
  id: string;
  operatorId: string;
  platform: 'instagram' | 'tiktok' | 'whatsapp' | 'telegram';
  isActive: boolean;
  config: {
    postKeyword?: string;
    dmTemplate?: string;
    botToken?: string;
    groupId?: string;
    phoneNumberId?: string;
    accessToken?: string;
    inactivityDays?: number;
  };
  triggeredToday: number;
  totalTriggered: number;
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
  players: Player[];
  activeMissions: Mission[];
  webhookLogs: WebhookLog[];
  leadsFrios: LeadFrio[];
  commissionPayouts: CommissionPayout[];
  socialAutomations: SocialAutomation[];

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
  getPlayersByOperator: (operatorId: string) => Player[];
  getPlayersByAffiliate: (affiliateId: string) => Player[];
  getPayoutsByOperator: (operatorId: string) => CommissionPayout[];
  getAutomationsByOperator: (operatorId: string) => SocialAutomation[];
  getWebhooksByOperator: (operatorId: string) => WebhookLog[];

  simulateCasinoWebhook: (
    type: 'deposit_made' | 'bet_placed' | 'new_registration' | 'click_tracked',
    data: { name?: string; whatsapp?: string; amount?: number; game?: string }
  ) => void;
  addMission: (mission: Omit<Mission, 'id' | 'currentProgress' | 'isActive'>) => void;
  addPixel: (affiliateId: string, platform: 'facebook' | 'tiktok' | 'google', pixelId: string) => void;
  removePixel: (affiliateId: string, pixelId: string) => void;
  triggerWhatsAppAutomation: (leadId: string, template: string) => void;
  updateOperatorConfig: (operatorId: string, config: Partial<Pick<Operator, 'globalCpa' | 'globalRevShare'>>) => void;
  approvePayout: (payoutId: string) => void;
  rejectPayout: (payoutId: string) => void;
  toggleAutomation: (automationId: string) => void;
  addAffiliate: (aff: Omit<Affiliate, 'id' | 'level' | 'xp' | 'cpaEarned' | 'revShareEarned' | 'playersCount' | 'funnel' | 'pixels' | 'createdAt'>) => void;
  addOperator: (op: Omit<Operator, 'id' | 'apiSecretKey' | 'createdAt'>) => void;
}

const OPERATORS: Operator[] = [
  { id: 'op1', brandName: 'CasinoTop BR', companyName: 'CasinoTop Entretenimento LTDA', apiSecretKey: 'sk_live_ct_a1b2c3d4e5', globalCpa: 50.00, globalRevShare: 30, xpPerFtd: 50, xpPerBetPercent: 0.1, createdAt: '2025-01-15' },
  { id: 'op2', brandName: 'Lucky Stars Casino', companyName: 'Lucky Stars Apostas S.A.', apiSecretKey: 'sk_live_ls_f6g7h8i9j0', globalCpa: 75.00, globalRevShare: 35, xpPerFtd: 60, xpPerBetPercent: 0.12, createdAt: '2025-03-22' },
  { id: 'op3', brandName: 'TigroSlots', companyName: 'TigroSlots Gaming Corp.', apiSecretKey: 'sk_live_ts_k1l2m3n4o5', globalCpa: 45.00, globalRevShare: 28, xpPerFtd: 40, xpPerBetPercent: 0.08, createdAt: '2025-06-10' },
];

const AFFILIATES: Affiliate[] = [
  { id: 'aff1', operatorId: 'op1', name: 'Beto Influencer Gaming', email: 'beto@gmail.com', code: 'BETOPRO', level: 3, xp: 340, cpaEarned: 2450.00, revShareEarned: 1200.00, playersCount: 49, revShare: 35, cpaRate: 50, funnel: { clicks: 1420, registrations: 280, ftds: 49, subDeposits: 112 }, pixels: [{ id: 'p1', platform: 'facebook', pixelId: '123456789012345' }], instagramUsername: '@betogaming', whatsappNumber: '+5511999990001', createdAt: '2025-02-01' },
  { id: 'aff2', operatorId: 'op1', name: 'Mariana Apostas VIP', email: 'mari@hotmail.com', code: 'MARIVIP', level: 2, xp: 180, cpaEarned: 950.00, revShareEarned: 420.00, playersCount: 19, revShare: 30, cpaRate: 50, funnel: { clicks: 580, registrations: 90, ftds: 19, subDeposits: 41 }, pixels: [], instagramUsername: '@marivip', whatsappNumber: '+5521988880002', createdAt: '2025-03-15' },
  { id: 'aff3', operatorId: 'op2', name: 'Lucas Tipster Capixaba', email: 'lucas@outlook.com', code: 'LUCASVIX', level: 4, xp: 520, cpaEarned: 6300.00, revShareEarned: 3800.00, playersCount: 84, revShare: 38, cpaRate: 75, funnel: { clicks: 3200, registrations: 640, ftds: 84, subDeposits: 310 }, pixels: [{ id: 'p2', platform: 'tiktok', pixelId: 'TK-999888777' }], instagramUsername: '@lucastipster', whatsappNumber: '+5527977770003', createdAt: '2025-04-10' },
  { id: 'aff4', operatorId: 'op2', name: 'Carla Influencer SC', email: 'carla@gmail.com', code: 'CARLASC', level: 1, xp: 90, cpaEarned: 375.00, revShareEarned: 140.00, playersCount: 5, revShare: 30, cpaRate: 75, funnel: { clicks: 210, registrations: 35, ftds: 5, subDeposits: 9 }, pixels: [], createdAt: '2026-01-20' },
  { id: 'aff5', operatorId: 'op3', name: 'Diego Slots Master', email: 'diego@slots.com', code: 'DIEGOSP', level: 5, xp: 80, cpaEarned: 18500.00, revShareEarned: 9200.00, playersCount: 412, revShare: 40, cpaRate: 45, funnel: { clicks: 18400, registrations: 3680, ftds: 412, subDeposits: 1850 }, pixels: [{ id: 'p4', platform: 'facebook', pixelId: '987654321098765' }], instagramUsername: '@diegoslots', whatsappNumber: '+5511966660005', createdAt: '2024-11-01' },
];

const PLAYERS: Player[] = [
  { id: 'pl1', operatorId: 'op1', affiliateId: 'aff1', affiliateName: 'Beto Influencer Gaming', name: 'Rafael Mendonça', casinoPlayerId: 'CSN-001', whatsappId: 'wa_rafael', telegramId: 'tg_rafael', level: 5, xp: 480, walletPoints: 1200, totalDeposited: 2800, totalBets: 14200, isActiveVip: true, kycConsentedAt: '2025-04-10T14:32:00', lastActive: '2026-05-22', createdAt: '2025-04-10', status: 'active' },
  { id: 'pl2', operatorId: 'op1', affiliateId: 'aff1', affiliateName: 'Beto Influencer Gaming', name: 'Fernanda Costa', casinoPlayerId: 'CSN-002', whatsappId: 'wa_fernanda', level: 3, xp: 210, walletPoints: 540, totalDeposited: 1100, totalBets: 5600, isActiveVip: true, kycConsentedAt: '2025-05-01T09:15:00', lastActive: '2026-05-20', createdAt: '2025-05-01', status: 'active' },
  { id: 'pl3', operatorId: 'op1', affiliateId: 'aff1', affiliateName: 'Beto Influencer Gaming', name: 'Bruno Alves', casinoPlayerId: 'CSN-003', level: 2, xp: 80, walletPoints: 120, totalDeposited: 300, totalBets: 900, isActiveVip: false, kycConsentedAt: '2026-04-20T11:00:00', lastActive: '2026-05-10', createdAt: '2026-04-20', status: 'inactive' },
  { id: 'pl4', operatorId: 'op1', affiliateId: 'aff2', affiliateName: 'Mariana Apostas VIP', name: 'Juliana Rocha', casinoPlayerId: 'CSN-004', whatsappId: 'wa_juliana', level: 4, xp: 350, walletPoints: 880, totalDeposited: 1900, totalBets: 9800, isActiveVip: true, kycConsentedAt: '2025-06-15T16:45:00', lastActive: '2026-05-21', createdAt: '2025-06-15', status: 'active' },
  { id: 'pl5', operatorId: 'op1', affiliateId: 'aff1', affiliateName: 'Beto Influencer Gaming', name: 'Carlos Eduardo', casinoPlayerId: 'CSN-005', whatsappId: 'wa_carlos', level: 1, xp: 10, walletPoints: 0, totalDeposited: 0, totalBets: 0, isActiveVip: false, lastActive: '2026-05-18', createdAt: '2026-05-18', status: 'churned' },
  { id: 'pl6', operatorId: 'op2', affiliateId: 'aff3', affiliateName: 'Lucas Tipster Capixaba', name: 'Marcos Vinícius', casinoPlayerId: 'LSC-001', whatsappId: 'wa_marcos', telegramId: 'tg_marcos', level: 7, xp: 580, walletPoints: 3400, totalDeposited: 8500, totalBets: 42000, isActiveVip: true, kycConsentedAt: '2024-12-01T10:00:00', lastActive: '2026-05-22', createdAt: '2024-12-01', status: 'active' },
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
];

const PAYOUTS: CommissionPayout[] = [
  { id: 'pay1', operatorId: 'op1', affiliateId: 'aff1', affiliateName: 'Beto Influencer Gaming', amount: 1850.00, type: 'REVSHARE', pixKey: 'beto@gmail.com', status: 'PENDING', requestedAt: '2026-05-20T10:00:00' },
  { id: 'pay2', operatorId: 'op1', affiliateId: 'aff2', affiliateName: 'Mariana Apostas VIP', amount: 420.00, type: 'CPA', pixKey: '123.456.789-00', status: 'PENDING', requestedAt: '2026-05-21T14:30:00' },
  { id: 'pay3', operatorId: 'op1', affiliateId: 'aff1', affiliateName: 'Beto Influencer Gaming', amount: 600.00, type: 'CPA', pixKey: 'beto@gmail.com', status: 'PAID', requestedAt: '2026-05-10T08:00:00', processedAt: '2026-05-11T09:15:00' },
  { id: 'pay4', operatorId: 'op1', affiliateId: 'aff2', affiliateName: 'Mariana Apostas VIP', amount: 130.00, type: 'REVSHARE', pixKey: '123.456.789-00', status: 'REJECTED', requestedAt: '2026-05-05T12:00:00', processedAt: '2026-05-06T11:00:00' },
  { id: 'pay5', operatorId: 'op2', affiliateId: 'aff3', affiliateName: 'Lucas Tipster Capixaba', amount: 3800.00, type: 'REVSHARE', pixKey: 'lucas@outlook.com', status: 'PENDING', requestedAt: '2026-05-22T08:00:00' },
];

const AUTOMATIONS: SocialAutomation[] = [
  { id: 'auto1', operatorId: 'op1', platform: 'instagram', isActive: true, config: { postKeyword: 'tigrinho', dmTemplate: 'Olá {name}! Vi seu comentário sobre o Fortune Tiger 🐯. Clique aqui para seu bônus exclusivo: {link}', accessToken: 'IG_TOKEN_REDACTED' }, triggeredToday: 47, totalTriggered: 2140 },
  { id: 'auto2', operatorId: 'op1', platform: 'tiktok', isActive: false, config: { postKeyword: 'cassino', dmTemplate: 'Oi {name}! Aqui é da equipe {brand}. Temos uma oferta especial para você 🎰: {link}', accessToken: '' }, triggeredToday: 0, totalTriggered: 380 },
  { id: 'auto3', operatorId: 'op1', platform: 'whatsapp', isActive: true, config: { phoneNumberId: '1234567890', accessToken: 'WA_TOKEN_REDACTED', dmTemplate: 'Você está a apenas R$ {gap} de completar sua missão diária! Jogue agora: {link}', inactivityDays: 3 }, triggeredToday: 12, totalTriggered: 940 },
  { id: 'auto4', operatorId: 'op1', platform: 'telegram', isActive: true, config: { botToken: 'TG_TOKEN_REDACTED', groupId: '-1001234567890', dmTemplate: 'Alerta VIP: {name} está inativo há {days} dias. Reativação: {link}', inactivityDays: 5 }, triggeredToday: 3, totalTriggered: 218 },
  { id: 'auto5', operatorId: 'op2', platform: 'instagram', isActive: true, config: { postKeyword: 'aviator', dmTemplate: 'Olá {name}! Jogue Aviator com bônus exclusivo: {link}', accessToken: 'IG_TOKEN_2_REDACTED' }, triggeredToday: 22, totalTriggered: 890 },
];

const WEBHOOK_LOGS: WebhookLog[] = [
  { id: 'wh1', operatorId: 'op1', time: '13:18:02', event: 'bet_placed', details: 'Player CSN-001 apostou R$ 50,00 no Fortune Tiger. RevShare R$ 17,50 creditado ao afiliado BETOPRO.', status: 'SUCCESS' },
  { id: 'wh2', operatorId: 'op1', time: '13:15:44', event: 'deposit_made', details: 'FTD confirmado do player CSN-005. Valor: R$ 100,00. CPA de R$ 50,00 creditado ao afiliado BETOPRO.', status: 'SUCCESS' },
  { id: 'wh3', operatorId: 'op1', time: '13:10:11', event: 'user_registered', details: 'Novo cadastro via link BETOPRO. CPF verificado. Player vinculado ao afiliado.', status: 'SUCCESS' },
  { id: 'wh4', operatorId: 'op1', time: '13:05:33', event: 'bet_settled', details: 'Aposta resolvida do player CSN-002. Resultado: LOST. Valor: R$ 30,00.', status: 'SUCCESS' },
  { id: 'wh5', operatorId: 'op1', time: '12:58:20', event: 'deposit_made', details: 'Depósito inválido: status FAILED. Player CSN-003. Motivo: limite PIX excedido.', status: 'FAILED' },
  { id: 'wh6', operatorId: 'op1', time: '12:44:05', event: 'bet_placed', details: 'Player CSN-004 apostou R$ 200,00 no Aviator. Missão "Alavancagem" atualizada.', status: 'SUCCESS' },
  { id: 'wh7', operatorId: 'op2', time: '13:17:00', event: 'bet_placed', details: 'Player LSC-001 apostou R$ 500,00 no Aviator. RevShare R$ 190,00 creditado ao LUCASVIX.', status: 'SUCCESS' },
  { id: 'wh8', operatorId: 'op2', time: '13:12:30', event: 'deposit_made', details: 'FTD confirmado do player LSC-002. Valor: R$ 250,00. CPA de R$ 75,00 creditado.', status: 'SUCCESS' },
];

export const useMockStore = create<MockStore>((set, get) => ({
  operators: OPERATORS,
  affiliates: AFFILIATES,
  players: PLAYERS,
  activeMissions: MISSIONS,
  leadsFrios: LEADS,
  commissionPayouts: PAYOUTS,
  socialAutomations: AUTOMATIONS,
  webhookLogs: WEBHOOK_LOGS,

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
  getPlayersByOperator: (operatorId) => get().players.filter(p => p.operatorId === operatorId),
  getPlayersByAffiliate: (affiliateId) => get().players.filter(p => p.affiliateId === affiliateId),
  getPayoutsByOperator: (operatorId) => get().commissionPayouts.filter(p => p.operatorId === operatorId),
  getAutomationsByOperator: (operatorId) => get().socialAutomations.filter(a => a.operatorId === operatorId),
  getWebhooksByOperator: (operatorId) => get().webhookLogs.filter(w => w.operatorId === operatorId),

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
      let logStatus: 'SUCCESS' | 'FAILED' | 'IGNORED' = 'SUCCESS';

      if (type === 'click_tracked') {
        aff.funnel.clicks += 1;
        logDetails = `Click originado do link [${aff.code}]. Total: ${aff.funnel.clicks.toLocaleString('pt-BR')}`;
      }

      if (type === 'new_registration') {
        aff.funnel.registrations += 1;
        logDetails = `Novo usuário cadastrado via API: ${data.name || 'Lead Anônimo'} (${data.whatsapp})`;
        state.leadsFrios.unshift({ id: `l_${Math.random()}`, operatorId: currentOperatorId, affiliateId: currentAffiliateId, name: data.name || 'Novo Lead', whatsapp: data.whatsapp || '+55 (00) 00000-0000', registeredAt: new Date().toISOString().split('T')[0], status: 'pending_deposit', daysInactive: 0 });
      }

      if (type === 'deposit_made') {
        aff.cpaEarned += op.globalCpa;
        aff.playersCount += 1;
        aff.funnel.ftds += 1;
        aff.xp += op.xpPerFtd;
        if (aff.xp >= 600) { aff.level += 1; aff.xp = aff.xp - 600; }
        logDetails = `FTD confirmado. Valor: R$ ${data.amount?.toFixed(2)}. CPA de R$ ${op.globalCpa} creditado. +${op.xpPerFtd} XP.`;
      }

      if (type === 'bet_placed') {
        const amount = data.amount ?? 0;
        const revshare = amount * (aff.revShare / 100);
        aff.revShareEarned += revshare;
        aff.funnel.subDeposits += 1;
        const xpGanho = Math.ceil(amount * op.xpPerBetPercent);
        aff.xp += xpGanho;
        logDetails = `Aposta no [${data.game}]. Valor: R$ ${amount}. RevShare: R$ ${revshare.toFixed(2)}. +${xpGanho} XP.`;

        updatedMissions.forEach(mission => {
          if (mission.operatorId === currentOperatorId && mission.game === data.game && mission.currentProgress < mission.targetAmount) {
            mission.currentProgress = Math.min(mission.targetAmount, mission.currentProgress + amount);
          }
        });
      }

      const newLog: WebhookLog = { id: `wh_${Date.now()}`, time, event: type, details: logDetails, operatorId: currentOperatorId, status: logStatus };
      return {
        affiliates: updatedAffiliates,
        activeMissions: updatedMissions,
        webhookLogs: [newLog, ...state.webhookLogs].slice(0, 100),
      };
    });
  },

  addMission: (mission) => set((state) => ({
    activeMissions: [...state.activeMissions, { ...mission, id: `m_${Date.now()}`, currentProgress: 0, isActive: true }],
    webhookLogs: [{ id: `wh_${Date.now()}`, time: new Date().toLocaleTimeString('pt-BR'), event: 'CRM_CAMPAIGN_LAUNCH', details: `Campanha [${mission.title}] lançada para ${mission.game}. Alvo: R$ ${mission.targetAmount}.`, operatorId: mission.operatorId, status: 'SUCCESS' }, ...state.webhookLogs].slice(0, 100)
  })),

  addPixel: (affiliateId, platform, pixelId) => set((state) => ({
    affiliates: state.affiliates.map(aff => aff.id === affiliateId ? { ...aff, pixels: [...aff.pixels, { id: `p_${Date.now()}`, platform, pixelId }] } : aff)
  })),

  removePixel: (affiliateId, pixelId) => set((state) => ({
    affiliates: state.affiliates.map(aff => aff.id === affiliateId ? { ...aff, pixels: aff.pixels.filter(p => p.id !== pixelId) } : aff)
  })),

  triggerWhatsAppAutomation: (leadId, template) => set((state) => {
    const lead = state.leadsFrios.find(l => l.id === leadId);
    return {
      webhookLogs: [{ id: `wh_${Date.now()}`, time: new Date().toLocaleTimeString('pt-BR'), event: 'WA_CRM_DISPATCH', details: `WhatsApp enviado para ${lead?.name} (${lead?.whatsapp}). Template: [${template}].`, operatorId: state.currentOperatorId, status: 'SUCCESS' }, ...state.webhookLogs].slice(0, 100)
    };
  }),

  updateOperatorConfig: (operatorId, config) => set((state) => ({
    operators: state.operators.map(op => op.id === operatorId ? { ...op, ...config } : op)
  })),

  approvePayout: (payoutId) => set((state) => ({
    commissionPayouts: state.commissionPayouts.map(p => p.id === payoutId ? { ...p, status: 'PAID', processedAt: new Date().toISOString() } : p),
    webhookLogs: [{ id: `wh_${Date.now()}`, time: new Date().toLocaleTimeString('pt-BR'), event: 'PAYOUT_APPROVED', details: `Saque #${payoutId.slice(-4)} aprovado e enviado via PIX.`, operatorId: state.currentOperatorId, status: 'SUCCESS' }, ...state.webhookLogs].slice(0, 100)
  })),

  rejectPayout: (payoutId) => set((state) => ({
    commissionPayouts: state.commissionPayouts.map(p => p.id === payoutId ? { ...p, status: 'REJECTED', processedAt: new Date().toISOString() } : p),
    webhookLogs: [{ id: `wh_${Date.now()}`, time: new Date().toLocaleTimeString('pt-BR'), event: 'PAYOUT_REJECTED', details: `Saque #${payoutId.slice(-4)} rejeitado pelo operador.`, operatorId: state.currentOperatorId, status: 'FAILED' }, ...state.webhookLogs].slice(0, 100)
  })),

  toggleAutomation: (automationId) => set((state) => ({
    socialAutomations: state.socialAutomations.map(a => a.id === automationId ? { ...a, isActive: !a.isActive } : a)
  })),

  addAffiliate: (aff) => set((state) => ({
    affiliates: [...state.affiliates, { ...aff, id: `aff_${Date.now()}`, level: 1, xp: 0, cpaEarned: 0, revShareEarned: 0, playersCount: 0, funnel: { clicks: 0, registrations: 0, ftds: 0, subDeposits: 0 }, pixels: [], createdAt: new Date().toISOString().split('T')[0] }]
  })),

  addOperator: (op) => set((state) => ({
    operators: [...state.operators, { ...op, id: `op_${Date.now()}`, apiSecretKey: `sk_live_${Math.random().toString(36).slice(2, 12)}`, createdAt: new Date().toISOString().split('T')[0] }]
  })),
}));
