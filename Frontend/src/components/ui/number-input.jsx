import React from 'react';
import { Plus, Minus } from 'lucide-react';

export function NumberInput({ value, onChange, placeholder, min = 0, step = 1, className = "" }) {
  const handleDecrement = () => {
    const val = parseFloat(value) || 0;
    if (val - step >= min) {
      onChange(val - step);
    } else {
      onChange(min);
    }
  };

  const handleIncrement = () => {
    const val = parseFloat(value) || 0;
    onChange(val + step);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
  };

  return (
    <div className={`relative flex items-center w-full bg-slate-800 border border-slate-700 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all ${className}`}>
      <button 
        type="button"
        onClick={handleDecrement}
        className="px-3 py-2.5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border-r border-slate-700/50"
      >
        <Minus size={16} />
      </button>
      
      <input
        type="number"
        min={min}
        step={step}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="flex-1 w-full px-2 py-2 bg-transparent text-center focus:outline-none text-white placeholder-slate-500 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      
      <button 
        type="button"
        onClick={handleIncrement}
        className="px-3 py-2.5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border-l border-slate-700/50"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
