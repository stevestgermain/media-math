import React from 'react';
import { Info } from 'lucide-react';

interface ResultCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend?: 'good' | 'neutral' | 'bad'; // Could be used for color coding later
  description: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, value, subtitle, description }) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md">
      <div className="flex items-center gap-x-2">
        <h3 className="text-sm font-semibold leading-6 text-gray-500">{title}</h3>
        <div className="group relative">
           <Info className="h-4 w-4 text-gray-300 cursor-help" />
           <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-48 bg-gray-900 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
             {description}
           </div>
        </div>
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-2 sm:px-6">
        <div className="text-xs text-gray-400">Calculated automatically</div>
      </div>
    </div>
  );
};
