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

export type Industry = 'Average' | 'Retail' | 'Auto' | 'Finance' | 'Travel' | 'B2B' | 'Tech';
export type MediaType = 'Display' | 'Social' | 'Video' | 'Search' | 'Audio';

export type BenchmarkStatus = 'good' | 'average' | 'poor' | 'neutral';

export interface BenchmarkResult {
  status: BenchmarkStatus;
  diffPercent: number;
  benchmarkValue: number;
  metricLabel: string;
  feedbackTitle: string;
}

// Target types for each calculator
export type CpmTarget = 'cpm' | 'budget' | 'impressions';
export type CpvTarget = 'cpv' | 'budget' | 'views';
export type CtrTarget = 'ctr' | 'clicks' | 'impressions';
export type ViewRateTarget = 'viewRate' | 'views' | 'impressions';
