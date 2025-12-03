export interface CalculatorState {
  budget: number | '';
  impressions: number | '';
  views: number | '';
  clicks: number | '';
  cpm: number | '';
  cpv: number | '';
  ctr: number | '';
  viewRate: number | '';
}

export type TabType = 'cpm' | 'cpv' | 'ctr' | 'viewRate';

// Target types for each calculator
export type CpmTarget = 'cpm' | 'budget' | 'impressions';
export type CpvTarget = 'cpv' | 'budget' | 'views';
export type CtrTarget = 'ctr' | 'clicks' | 'impressions';
export type ViewRateTarget = 'viewRate' | 'views' | 'impressions';

// Chat types needed for AiAdvisor
export enum MessageRole {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  isError?: boolean;
}
