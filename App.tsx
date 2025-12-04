import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Eye, MousePointer2, Percent, Play, Sparkles, Eraser, Trophy, AlertCircle, Minus, TrendingUp, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import { CalculatorState, TabType, Industry, MediaType, BenchmarkResult } from './types';
import { InputField } from './components/InputField';

// --- BENCHMARK DATA ---
const INDUSTRIES: Industry[] = ['Average', 'Retail', 'Auto', 'Finance', 'Travel', 'B2B', 'Tech'];
const MEDIA_TYPES: MediaType[] = ['Display', 'Social', 'Video', 'Search', 'Audio'];

// Simplified Benchmark Database (Source: General Industry Averages)
const BENCHMARKS: Record<MediaType, Record<Industry, { cpm: number; ctr: number; cpv: number; viewRate: number }>> = {
  'Display': {
    'Average': { cpm: 10.00, ctr: 0.35, cpv: 0.05, viewRate: 15.0 },
    'Retail': { cpm: 8.50, ctr: 0.45, cpv: 0.04, viewRate: 12.0 },
    'Auto': { cpm: 12.00, ctr: 0.30, cpv: 0.06, viewRate: 20.0 },
    'Finance': { cpm: 15.00, ctr: 0.25, cpv: 0.08, viewRate: 10.0 },
    'Travel': { cpm: 9.00, ctr: 0.40, cpv: 0.05, viewRate: 18.0 },
    'B2B': { cpm: 18.00, ctr: 0.20, cpv: 0.10, viewRate: 10.0 },
    'Tech': { cpm: 14.00, ctr: 0.25, cpv: 0.09, viewRate: 14.0 },
  },
  'Social': {
    'Average': { cpm: 8.00, ctr: 0.90, cpv: 0.03, viewRate: 25.0 },
    'Retail': { cpm: 6.50, ctr: 1.20, cpv: 0.02, viewRate: 20.0 },
    'Auto': { cpm: 9.00, ctr: 0.80, cpv: 0.04, viewRate: 30.0 },
    'Finance': { cpm: 12.00, ctr: 0.60, cpv: 0.05, viewRate: 15.0 },
    'Travel': { cpm: 7.00, ctr: 1.00, cpv: 0.03, viewRate: 28.0 },
    'B2B': { cpm: 15.00, ctr: 0.50, cpv: 0.08, viewRate: 12.0 },
    'Tech': { cpm: 11.00, ctr: 0.70, cpv: 0.06, viewRate: 18.0 },
  },
  'Video': {
    'Average': { cpm: 15.00, ctr: 0.50, cpv: 0.04, viewRate: 45.0 },
    'Retail': { cpm: 12.00, ctr: 0.60, cpv: 0.03, viewRate: 40.0 },
    'Auto': { cpm: 18.00, ctr: 0.40, cpv: 0.05, viewRate: 55.0 },
    'Finance': { cpm: 20.00, ctr: 0.30, cpv: 0.06, viewRate: 35.0 },
    'Travel': { cpm: 14.00, ctr: 0.55, cpv: 0.04, viewRate: 50.0 },
    'B2B': { cpm: 25.00, ctr: 0.25, cpv: 0.08, viewRate: 30.0 },
    'Tech': { cpm: 18.00, ctr: 0.35, cpv: 0.07, viewRate: 40.0 },
  },
  'Search': {
    'Average': { cpm: 25.00, ctr: 2.50, cpv: 0, viewRate: 0 },
    'Retail': { cpm: 20.00, ctr: 3.00, cpv: 0, viewRate: 0 },
    'Auto': { cpm: 30.00, ctr: 2.00, cpv: 0, viewRate: 0 },
    'Finance': { cpm: 40.00, ctr: 1.80, cpv: 0, viewRate: 0 },
    'Travel': { cpm: 22.00, ctr: 2.80, cpv: 0, viewRate: 0 },
    'B2B': { cpm: 35.00, ctr: 1.50, cpv: 0, viewRate: 0 },
    'Tech': { cpm: 28.00, ctr: 2.20, cpv: 0, viewRate: 0 },
  },
  'Audio': {
    'Average': { cpm: 18.00, ctr: 0.10, cpv: 0.05, viewRate: 90.0 }, // ViewRate here represents Listen Through Rate
    'Retail': { cpm: 15.00, ctr: 0.15, cpv: 0.04, viewRate: 85.0 },
    'Auto': { cpm: 22.00, ctr: 0.08, cpv: 0.06, viewRate: 95.0 },
    'Finance': { cpm: 25.00, ctr: 0.05, cpv: 0.08, viewRate: 88.0 },
    'Travel': { cpm: 16.00, ctr: 0.12, cpv: 0.05, viewRate: 92.0 },
    'B2B': { cpm: 30.00, ctr: 0.05, cpv: 0.10, viewRate: 80.0 },
    'Tech': { cpm: 20.00, ctr: 0.09, cpv: 0.07, viewRate: 85.0 },
  }
};

// --- WITTY MESSAGES ---
const GOOD_TITLES = [
  "Champion!",
  "You're a star!",
  "Better than most!",
  "Media Wizardry!",
  "Absolute Legend!",
  "Look at you go!",
  "Top Tier Performance!",
  "Crushing it!",
  "Exceeding Expectations!"
];

const POOR_TITLES = [
  "Yikes!",
  "You can do better.",
  "Ouch.",
  "Room to grow.",
  "Back to the lab.",
  "Needs some love.",
  "Optimization Required.",
  "Don't give up!",
  "Rough numbers."
];

const AVERAGE_TITLES = [
  "On Track.",
  "Steady as she goes.",
  "Right in the pocket.",
  "Solid Baseline.",
  "Not bad, not great.",
  "Meeting Standards.",
  "Business as usual."
];

const getRandomTitle = (titles: string[]) => {
  return titles[Math.floor(Math.random() * titles.length)];
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('cpm');
  
  // Benchmark Selections
  const [industry, setIndustry] = useState<Industry | ''>('');
  const [mediaType, setMediaType] = useState<MediaType | ''>('');
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResult | null>(null);
  const [isBenchmarkExpanded, setIsBenchmarkExpanded] = useState(false);

  // Track the most recently calculated result to trigger benchmarking
  const [computedResult, setComputedResult] = useState<{metric: 'cpm' | 'ctr' | 'cpv' | 'viewRate', value: number} | null>(null);

  const [state, setState] = useState<CalculatorState>({
    budget: '',
    impressions: '',
    views: '',
    clicks: '',
    cpm: '',
    cpv: '',
    ctr: '',
    viewRate: ''
  });

  const updateState = (key: keyof CalculatorState, value: number | '') => {
    setState(prev => ({ ...prev, [key]: value }));
    // If the user manually edits inputs, we invalidate the "computed" status until they solve again
    // but we can keep the inputs populated.
  };

  const handleClear = () => {
    setBenchmarkResult(null);
    setComputedResult(null);
    if (activeTab === 'cpm') {
      setState(prev => ({ ...prev, budget: '', impressions: '', cpm: '' }));
    } else if (activeTab === 'cpv') {
      setState(prev => ({ ...prev, budget: '', views: '', cpv: '' }));
    } else if (activeTab === 'ctr') {
      setState(prev => ({ ...prev, clicks: '', impressions: '', ctr: '' }));
    } else if (activeTab === 'viewRate') {
      setState(prev => ({ ...prev, views: '', impressions: '', viewRate: '' }));
    }
  };

  // Reactive effect to calculate score whenever relevant data changes
  useEffect(() => {
    if (computedResult && industry && mediaType) {
      const benchmark = BENCHMARKS[mediaType][industry][computedResult.metric];
      // Search doesn't really have CPV/ViewRate benchmarks in this simplified model, handle gracefully
      if (benchmark === undefined) return;

      const diff = computedResult.value - benchmark;
      const diffPercent = (diff / benchmark) * 100;
      
      // Logic: 
      // CPM & CPV: Lower is better
      // CTR & ViewRate: Higher is better
      let status: 'good' | 'poor' | 'average' = 'average';
      const threshold = 10; // Within 10% is average

      if (computedResult.metric === 'cpm' || computedResult.metric === 'cpv') {
        if (diffPercent < -threshold) status = 'good';
        else if (diffPercent > threshold) status = 'poor';
      } else {
        if (diffPercent > threshold) status = 'good';
        else if (diffPercent < -threshold) status = 'poor';
      }

      // Generate Random Title
      let feedbackTitle = "";
      if (status === 'good') feedbackTitle = getRandomTitle(GOOD_TITLES);
      else if (status === 'poor') feedbackTitle = getRandomTitle(POOR_TITLES);
      else feedbackTitle = getRandomTitle(AVERAGE_TITLES);

      setBenchmarkResult({
        status,
        diffPercent: Math.abs(diffPercent),
        benchmarkValue: benchmark,
        metricLabel: computedResult.metric === 'cpm' ? 'CPM' : computedResult.metric === 'cpv' ? 'CPV' : computedResult.metric === 'ctr' ? 'CTR' : 'View Rate',
        feedbackTitle
      });
    } else {
      setBenchmarkResult(null);
    }
  }, [computedResult, industry, mediaType]);

  const handleSolve = () => {
    const has = (v: number | '') => v !== '' && v > 0;
    let newVal = 0;
    let metric: 'cpm' | 'ctr' | 'cpv' | 'viewRate' | null = null;

    // CPM Logic
    if (activeTab === 'cpm') {
      const budget = Number(state.budget);
      const impressions = Number(state.impressions);
      const cpm = Number(state.cpm);

      if (has(budget) && has(impressions) && !has(cpm)) {
        const res = (budget / impressions) * 1000;
        updateState('cpm', parseFloat(res.toFixed(2)));
        newVal = res; metric = 'cpm';
      }
      else if (has(cpm) && has(impressions) && !has(budget)) {
        updateState('budget', parseFloat(((cpm * impressions) / 1000).toFixed(2)));
        newVal = cpm; metric = 'cpm';
      }
      else if (has(budget) && has(cpm) && !has(impressions)) {
        updateState('impressions', Math.floor((budget / cpm) * 1000));
        newVal = cpm; metric = 'cpm';
      }
      else if (has(cpm)) { newVal = cpm; metric = 'cpm'; }
    }

    // CTR Logic
    if (activeTab === 'ctr') {
      const clicks = Number(state.clicks);
      const impressions = Number(state.impressions);
      const ctr = Number(state.ctr);

      if (has(clicks) && has(impressions) && !has(ctr)) {
        const res = (clicks / impressions) * 100;
        updateState('ctr', parseFloat(res.toFixed(2)));
        newVal = res; metric = 'ctr';
      } else if (has(ctr) && has(impressions) && !has(clicks)) {
        updateState('clicks', Math.floor((ctr * impressions) / 100));
        newVal = ctr; metric = 'ctr';
      } else if (has(clicks) && has(ctr) && !has(impressions)) {
        updateState('impressions', Math.floor(clicks / (ctr / 100)));
        newVal = ctr; metric = 'ctr';
      }
      else if (has(ctr)) { newVal = ctr; metric = 'ctr'; }
    }

    // CPV Logic
    if (activeTab === 'cpv') {
      const budget = Number(state.budget);
      const views = Number(state.views);
      const cpv = Number(state.cpv);

      if (has(budget) && has(views) && !has(cpv)) {
        const res = budget / views;
        updateState('cpv', parseFloat(res.toFixed(2)));
        newVal = res; metric = 'cpv';
      } else if (has(cpv) && has(views) && !has(budget)) {
        updateState('budget', parseFloat((cpv * views).toFixed(2)));
        newVal = cpv; metric = 'cpv';
      } else if (has(budget) && has(cpv) && !has(views)) {
        updateState('views', Math.floor(budget / cpv));
        newVal = cpv; metric = 'cpv';
      }
      else if (has(cpv)) { newVal = cpv; metric = 'cpv'; }
    }

    // View Rate Logic
    if (activeTab === 'viewRate') {
      const views = Number(state.views);
      const impressions = Number(state.impressions);
      const viewRate = Number(state.viewRate);

      if (has(views) && has(impressions) && !has(viewRate)) {
        const res = (views / impressions) * 100;
        updateState('viewRate', parseFloat(res.toFixed(2)));
        newVal = res; metric = 'viewRate';
      } else if (has(viewRate) && has(impressions) && !has(views)) {
        updateState('views', Math.floor((viewRate / 100) * impressions));
        newVal = viewRate; metric = 'viewRate';
      } else if (has(views) && has(viewRate) && !has(impressions)) {
        updateState('impressions', Math.floor(views / (viewRate / 100)));
        newVal = viewRate; metric = 'viewRate';
      }
      else if (has(viewRate)) { newVal = viewRate; metric = 'viewRate'; }
    }

    if (metric) {
      setComputedResult({ metric, value: newVal });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-8 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md rotate-3 transform transition hover:rotate-6">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Media Calculator
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in any two variables to find the third.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 mb-6 flex overflow-x-auto">
          {[
            { id: 'cpm', label: 'CPM' },
            { id: 'ctr', label: 'CTR' },
            { id: 'cpv', label: 'CPV' },
            { id: 'viewRate', label: 'View Rate' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as TabType);
                handleClear(); 
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Calculator Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 ring-1 ring-gray-900/5 p-6 sm:p-8">
          
          {/* CPM TAB */}
          {activeTab === 'cpm' && (
            <div className="space-y-5">
               <InputField
                  label="Total Budget"
                  value={state.budget}
                  onChange={(v) => updateState('budget', v)}
                  icon={DollarSign}
                  placeholder="e.g. 5,000"
                  format="currency"
                />
                <InputField
                  label="Impressions"
                  value={state.impressions}
                  onChange={(v) => updateState('impressions', v)}
                  icon={Eye}
                  placeholder="e.g. 250,000"
                  format="number"
                />
                <InputField
                  label="Cost Per 1,000 Impressions (CPM)"
                  value={state.cpm}
                  onChange={(v) => updateState('cpm', v)}
                  icon={DollarSign}
                  placeholder="e.g. 15.50"
                  format="currency"
                />
            </div>
          )}

          {/* CTR TAB */}
          {activeTab === 'ctr' && (
            <div className="space-y-5">
              <InputField
                label="Total Clicks"
                value={state.clicks}
                onChange={(v) => updateState('clicks', v)}
                icon={MousePointer2}
                placeholder="e.g. 120"
                format="number"
              />
              <InputField
                label="Total Impressions"
                value={state.impressions}
                onChange={(v) => updateState('impressions', v)}
                icon={Eye}
                placeholder="e.g. 5,000"
                format="number"
              />
              <InputField
                label="Click Through Rate (CTR)"
                value={state.ctr}
                onChange={(v) => updateState('ctr', v)}
                icon={Percent}
                placeholder="e.g. 2.50"
                format="percent"
              />
            </div>
          )}

          {/* CPV TAB */}
          {activeTab === 'cpv' && (
            <div className="space-y-5">
              <InputField
                label="Total Budget"
                value={state.budget}
                onChange={(v) => updateState('budget', v)}
                icon={DollarSign}
                placeholder="e.g. 1,500"
                format="currency"
              />
              <InputField
                label="Total Views"
                value={state.views}
                onChange={(v) => updateState('views', v)}
                icon={MousePointer2}
                placeholder="e.g. 450"
                format="number"
              />
              <InputField
                label="Cost Per View (CPV)"
                value={state.cpv}
                onChange={(v) => updateState('cpv', v)}
                icon={DollarSign}
                placeholder="e.g. 0.10"
                format="currency"
              />
            </div>
          )}
          
           {/* VIEW RATE TAB */}
           {activeTab === 'viewRate' && (
            <div className="space-y-5">
              <InputField
                label="Total Views"
                value={state.views}
                onChange={(v) => updateState('views', v)}
                icon={Play}
                placeholder="e.g. 2,500"
                format="number"
              />
              <InputField
                label="Total Impressions"
                value={state.impressions}
                onChange={(v) => updateState('impressions', v)}
                icon={Eye}
                placeholder="e.g. 10,000"
                format="number"
              />
              <InputField
                label="View Rate"
                value={state.viewRate}
                onChange={(v) => updateState('viewRate', v)}
                icon={Percent}
                placeholder="e.g. 25.00"
                format="percent"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={handleSolve}
              className="flex-1 flex justify-center items-center gap-2 rounded-md bg-emerald-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              Solve
            </button>
            <button
              onClick={handleClear}
              className="flex-1 flex justify-center items-center gap-2 rounded-md bg-white px-3 py-3 text-sm font-medium leading-6 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
            >
              <Eraser className="h-4 w-4" />
              Clear All
            </button>
          </div>
        </div>

        {/* Benchmark Module (Separate Card) */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button 
            onClick={() => setIsBenchmarkExpanded(!isBenchmarkExpanded)}
            className="w-full px-6 py-4 bg-gray-50/50 flex items-center justify-between hover:bg-gray-100/80 transition-colors focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-semibold text-gray-900">Benchmark Analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 font-medium bg-white border border-gray-200 px-2 py-0.5 rounded-full shadow-sm">Optional</span>
              {isBenchmarkExpanded ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </div>
          </button>
          
          {isBenchmarkExpanded && (
            <div className="p-6 border-t border-gray-100 animate-in slide-in-from-top-2 fade-in duration-200">
               <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Industry</label>
                  <select 
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value as Industry)}
                    className="block w-full rounded-md border-0 py-2 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-50"
                  >
                    <option value="">Select...</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Media Type</label>
                  <select 
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as MediaType)}
                    className="block w-full rounded-md border-0 py-2 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-50"
                  >
                    <option value="">Select...</option>
                    {MEDIA_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              {benchmarkResult ? (
                 <div className={`mt-4 rounded-lg p-4 flex items-start gap-3 border transition-all duration-300 ease-in-out ${
                  benchmarkResult.status === 'good' ? 'bg-green-50 border-green-200' :
                  benchmarkResult.status === 'poor' ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className={`p-1.5 rounded-full shrink-0 ${
                    benchmarkResult.status === 'good' ? 'bg-green-100 text-green-600' :
                    benchmarkResult.status === 'poor' ? 'bg-red-100 text-red-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {benchmarkResult.status === 'good' ? <Trophy className="h-4 w-4" /> :
                     benchmarkResult.status === 'poor' ? <AlertCircle className="h-4 w-4" /> :
                     <Minus className="h-4 w-4" />}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${
                       benchmarkResult.status === 'good' ? 'text-green-800' :
                       benchmarkResult.status === 'poor' ? 'text-red-800' :
                       'text-yellow-800'
                    }`}>
                      {benchmarkResult.status === 'good' ? 'Above Benchmark' :
                       benchmarkResult.status === 'poor' ? 'Below Benchmark' :
                       'Industry Average'}
                    </h4>
                    <p className="text-xs mt-1 text-gray-700 leading-relaxed">
                      <span className="font-semibold">{benchmarkResult.feedbackTitle}</span> Your <strong>{benchmarkResult.metricLabel}</strong> is 
                      <span className="font-semibold"> {benchmarkResult.diffPercent.toFixed(1)}% {
                        benchmarkResult.status === 'good' ? 'better' : 'worse'
                      }</span> than the 
                      average for <strong>{industry} {mediaType}</strong> ({benchmarkResult.benchmarkValue.toFixed(2)}).
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center mt-2 italic">
                  Solve a calculation and select options above to see benchmarks.
                </p>
              )}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default App;
