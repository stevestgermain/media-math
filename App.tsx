import React, { useState } from 'react';
import { Calculator, DollarSign, Eye, MousePointer2, Percent, Hash, Play } from 'lucide-react';
import { CalculatorState, TabType, CpmTarget, CpvTarget, CtrTarget, ViewRateTarget } from './types';
import { InputField } from './components/InputField';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('cpm');
  
  // Targets for each tab
  const [cpmTarget, setCpmTarget] = useState<CpmTarget>('cpm');
  const [cpvTarget, setCpvTarget] = useState<CpvTarget>('cpv');
  const [ctrTarget, setCtrTarget] = useState<CtrTarget>('ctr');
  const [viewRateTarget, setViewRateTarget] = useState<ViewRateTarget>('viewRate');

  // Shared state
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
  };

  // --- Calculations ---

  const calculateCPMResult = () => {
    const budget = Number(state.budget);
    const impressions = Number(state.impressions);
    const cpm = Number(state.cpm);

    if (cpmTarget === 'cpm') {
      if (budget > 0 && impressions > 0) return (budget / impressions) * 1000;
      return 0;
    }
    if (cpmTarget === 'budget') {
      if (cpm > 0 && impressions > 0) return (cpm * impressions) / 1000;
      return 0;
    }
    if (cpmTarget === 'impressions') {
      if (budget > 0 && cpm > 0) return (budget / cpm) * 1000;
      return 0;
    }
    return 0;
  };

  const calculateCPVResult = () => {
    const budget = Number(state.budget);
    const views = Number(state.views); // or clicks for CPC
    const cpv = Number(state.cpv);

    if (cpvTarget === 'cpv') {
      if (budget > 0 && views > 0) return budget / views;
      return 0;
    }
    if (cpvTarget === 'budget') {
      if (cpv > 0 && views > 0) return cpv * views;
      return 0;
    }
    if (cpvTarget === 'views') {
      if (budget > 0 && cpv > 0) return budget / cpv;
      return 0;
    }
    return 0;
  };

  const calculateCTRResult = () => {
    const clicks = Number(state.clicks);
    const impressions = Number(state.impressions);
    const ctr = Number(state.ctr);

    if (ctrTarget === 'ctr') {
      if (clicks > 0 && impressions > 0) return (clicks / impressions) * 100;
      return 0;
    }
    if (ctrTarget === 'clicks') {
      if (ctr > 0 && impressions > 0) return (ctr * impressions) / 100;
      return 0;
    }
    if (ctrTarget === 'impressions') {
      if (clicks > 0 && ctr > 0) return clicks / (ctr / 100);
      return 0;
    }
    return 0;
  };

  const calculateViewRateResult = () => {
    const views = Number(state.views);
    const impressions = Number(state.impressions);
    const viewRate = Number(state.viewRate);

    if (viewRateTarget === 'viewRate') {
      if (views > 0 && impressions > 0) return (views / impressions) * 100;
      return 0;
    }
    if (viewRateTarget === 'views') {
      if (viewRate > 0 && impressions > 0) return (viewRate / 100) * impressions;
      return 0;
    }
    if (viewRateTarget === 'impressions') {
      if (views > 0 && viewRate > 0) return views / (viewRate / 100);
      return 0;
    }
    return 0;
  };

  // --- Renders ---

  const renderResult = (label: string, value: string, subtext: string) => (
    <div className="mt-8 overflow-hidden rounded-xl bg-gray-900 shadow-lg ring-1 ring-gray-900/5 text-center py-10 px-6 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</h3>
      <div className="mt-4 flex items-baseline justify-center gap-x-2">
        <span className="text-5xl font-bold tracking-tight text-white">
          {value}
        </span>
      </div>
      <p className="mt-4 text-sm text-gray-400">{subtext}</p>
    </div>
  );

  const renderSegmentControl = (
    options: { value: string; label: string }[],
    current: string,
    onChange: (val: any) => void
  ) => (
    <div className="flex bg-gray-100 p-1 rounded-lg mb-6 overflow-x-auto">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 min-w-[80px] py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
            current === opt.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md rotate-3 transform transition hover:rotate-6">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Media Math
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in two variables to find the third
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 mb-6 flex overflow-x-auto">
          {[
            { id: 'cpm', label: 'CPM' },
            { id: 'cpv', label: 'CPV' },
            { id: 'ctr', label: 'CTR' },
            { id: 'viewRate', label: 'View Rate' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
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

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 ring-1 ring-gray-900/5 p-6 sm:p-8">
          
          {/* CPM TAB */}
          {activeTab === 'cpm' && (
            <div>
              <div className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Solve for:</div>
              {renderSegmentControl(
                [
                  { value: 'cpm', label: 'CPM' },
                  { value: 'budget', label: 'Budget' },
                  { value: 'impressions', label: 'Impressions' }
                ],
                cpmTarget,
                setCpmTarget
              )}

              <div className="space-y-4">
                {cpmTarget !== 'budget' && (
                  <InputField
                    label="Total Budget ($)"
                    value={state.budget}
                    onChange={(v) => updateState('budget', v)}
                    icon={DollarSign}
                    placeholder="e.g. 5000"
                  />
                )}
                {cpmTarget !== 'impressions' && (
                  <InputField
                    label="Impressions"
                    value={state.impressions}
                    onChange={(v) => updateState('impressions', v)}
                    icon={Eye}
                    placeholder="e.g. 250000"
                  />
                )}
                {cpmTarget !== 'cpm' && (
                  <InputField
                    label="CPM ($)"
                    value={state.cpm}
                    onChange={(v) => updateState('cpm', v)}
                    icon={Hash}
                    placeholder="e.g. 15.50"
                  />
                )}
              </div>

              {cpmTarget === 'cpm' && renderResult(
                "Cost Per 1,000 Impressions",
                calculateCPMResult() ? `$${calculateCPMResult().toFixed(2)}` : '$0.00',
                "Calculated CPM"
              )}
              {cpmTarget === 'budget' && renderResult(
                "Required Budget",
                calculateCPMResult() ? `$${calculateCPMResult().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
                "Total cost based on inputs"
              )}
              {cpmTarget === 'impressions' && renderResult(
                "Total Impressions",
                calculateCPMResult() ? Math.floor(calculateCPMResult()).toLocaleString() : '0',
                "Estimated reach"
              )}
            </div>
          )}

          {/* CPV TAB */}
          {activeTab === 'cpv' && (
            <div>
              <div className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Solve for:</div>
              {renderSegmentControl(
                [
                  { value: 'cpv', label: 'CPV / CPC' },
                  { value: 'budget', label: 'Budget' },
                  { value: 'views', label: 'Views / Clicks' }
                ],
                cpvTarget,
                setCpvTarget
              )}

              <div className="space-y-4">
                {cpvTarget !== 'budget' && (
                  <InputField
                    label="Total Budget ($)"
                    value={state.budget}
                    onChange={(v) => updateState('budget', v)}
                    icon={DollarSign}
                    placeholder="e.g. 1500"
                  />
                )}
                {cpvTarget !== 'views' && (
                  <InputField
                    label="Total Views or Clicks"
                    value={state.views}
                    onChange={(v) => updateState('views', v)}
                    icon={MousePointer2}
                    placeholder="e.g. 450"
                  />
                )}
                {cpvTarget !== 'cpv' && (
                  <InputField
                    label="Cost Per View / Click ($)"
                    value={state.cpv}
                    onChange={(v) => updateState('cpv', v)}
                    icon={Hash}
                    placeholder="e.g. 0.10"
                  />
                )}
              </div>

              {cpvTarget === 'cpv' && renderResult(
                "Cost Per View / Click",
                calculateCPVResult() ? `$${calculateCPVResult().toFixed(2)}` : '$0.00',
                "Calculated cost per interaction"
              )}
              {cpvTarget === 'budget' && renderResult(
                "Required Budget",
                calculateCPVResult() ? `$${calculateCPVResult().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00',
                "Total cost based on inputs"
              )}
              {cpvTarget === 'views' && renderResult(
                "Total Views / Clicks",
                calculateCPVResult() ? Math.floor(calculateCPVResult()).toLocaleString() : '0',
                "Total interactions"
              )}
            </div>
          )}

          {/* CTR TAB */}
          {activeTab === 'ctr' && (
            <div>
              <div className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Solve for:</div>
              {renderSegmentControl(
                [
                  { value: 'ctr', label: 'CTR' },
                  { value: 'clicks', label: 'Clicks' },
                  { value: 'impressions', label: 'Impressions' }
                ],
                ctrTarget,
                setCtrTarget
              )}

              <div className="space-y-4">
                {ctrTarget !== 'clicks' && (
                  <InputField
                    label="Total Clicks"
                    value={state.clicks}
                    onChange={(v) => updateState('clicks', v)}
                    icon={MousePointer2}
                    placeholder="e.g. 120"
                  />
                )}
                {ctrTarget !== 'impressions' && (
                  <InputField
                    label="Total Impressions"
                    value={state.impressions}
                    onChange={(v) => updateState('impressions', v)}
                    icon={Eye}
                    placeholder="e.g. 5000"
                  />
                )}
                {ctrTarget !== 'ctr' && (
                  <InputField
                    label="Click Through Rate (%)"
                    value={state.ctr}
                    onChange={(v) => updateState('ctr', v)}
                    icon={Percent}
                    placeholder="e.g. 2.5"
                  />
                )}
              </div>

              {ctrTarget === 'ctr' && renderResult(
                "Click Through Rate",
                calculateCTRResult() ? `${calculateCTRResult().toFixed(2)}%` : '0.00%',
                "Percentage of impressions that clicked"
              )}
              {ctrTarget === 'clicks' && renderResult(
                "Total Clicks",
                calculateCTRResult() ? Math.floor(calculateCTRResult()).toLocaleString() : '0',
                "Estimated clicks"
              )}
              {ctrTarget === 'impressions' && renderResult(
                "Required Impressions",
                calculateCTRResult() ? Math.floor(calculateCTRResult()).toLocaleString() : '0',
                "Impressions needed"
              )}
            </div>
          )}
          
           {/* VIEW RATE TAB */}
           {activeTab === 'viewRate' && (
            <div>
              <div className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Solve for:</div>
              {renderSegmentControl(
                [
                  { value: 'viewRate', label: 'View Rate' },
                  { value: 'views', label: 'Views' },
                  { value: 'impressions', label: 'Impressions' }
                ],
                viewRateTarget,
                setViewRateTarget
              )}

              <div className="space-y-4">
                {viewRateTarget !== 'views' && (
                  <InputField
                    label="Total Views"
                    value={state.views}
                    onChange={(v) => updateState('views', v)}
                    icon={Play}
                    placeholder="e.g. 2500"
                  />
                )}
                {viewRateTarget !== 'impressions' && (
                  <InputField
                    label="Total Impressions"
                    value={state.impressions}
                    onChange={(v) => updateState('impressions', v)}
                    icon={Eye}
                    placeholder="e.g. 10000"
                  />
                )}
                {viewRateTarget !== 'viewRate' && (
                  <InputField
                    label="View Rate (%)"
                    value={state.viewRate}
                    onChange={(v) => updateState('viewRate', v)}
                    icon={Percent}
                    placeholder="e.g. 25.0"
                  />
                )}
              </div>

              {viewRateTarget === 'viewRate' && renderResult(
                "View Rate",
                calculateViewRateResult() ? `${calculateViewRateResult().toFixed(2)}%` : '0.00%',
                "Percentage of impressions that viewed"
              )}
              {viewRateTarget === 'views' && renderResult(
                "Total Views",
                calculateViewRateResult() ? Math.floor(calculateViewRateResult()).toLocaleString() : '0',
                "Estimated views"
              )}
              {viewRateTarget === 'impressions' && renderResult(
                "Required Impressions",
                calculateViewRateResult() ? Math.floor(calculateViewRateResult()).toLocaleString() : '0',
                "Impressions needed"
              )}
            </div>
          )}

        </div>
        
        <p className="mt-8 text-center text-xs text-gray-400">
          Select what you want to solve for, then fill in the other two fields.
        </p>
      </div>
    </div>
  );
};

export default App;
