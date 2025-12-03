import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputFieldProps {
  label: string;
  value: number | '';
  onChange: (val: number | '') => void;
  icon: LucideIcon;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  type?: 'text' | 'number';
}

export const InputField: React.FC<InputFieldProps> = ({
  label, value, onChange, icon: Icon, placeholder, prefix, type = 'number'
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') { onChange(''); } 
    else {
      const num = parseFloat(val);
      if (!isNaN(num)) onChange(num);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-4 w-4 text-gray-400" aria-hidden="true" />
          {prefix && <span className="ml-2 text-gray-500 sm:text-sm">{prefix}</span>}
        </div>
        <input
          type={type}
          className={`block w-full rounded-md border-0 py-2.5 text-gray-900 bg-gray-50 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-colors ${prefix || Icon ? 'pl-10' : 'pl-3'}`}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          step="any"
          min="0"
        />
      </div>
    </div>
  );
};
