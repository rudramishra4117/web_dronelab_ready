import React, { useState } from 'react';
import { NumberInput } from './ui/number-input';

export default function ThrustToWeightCalculator() {
  const [weight, setWeight] = useState('');
  const [thrustPerMotor, setThrustPerMotor] = useState('');
  const [motorCount, setMotorCount] = useState(4); // Default to quadcopter

  // Calculate Total Thrust and Ratio
  const totalThrust = (parseFloat(thrustPerMotor) || 0) * motorCount;
  const numericWeight = parseFloat(weight) || 0;
  
  const ratio = numericWeight > 0 ? (totalThrust / numericWeight).toFixed(1) : '0.0';

  // Helper to determine drone performance tier
  const getPerformanceCategory = (r) => {
    if (r <= 0) return { label: 'Enter values', color: 'text-gray-400' };
    if (r < 1.5) return { label: 'Too Heavy / Underpowered', color: 'text-red-500' };
    if (r < 3.0) return { label: 'Cinematic / Smooth Cruising', color: 'text-blue-500' };
    if (r < 5.0) return { label: 'Freestyle / Acro Flight', color: 'text-green-500' };
    return { label: 'High-Performance Racing', color: 'text-purple-500' };
  };

  const performance = getPerformanceCategory(parseFloat(ratio));

  return (
    <div className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row overflow-hidden">
      {/* Left Column (Inputs) */}
      <div className="flex-1 p-6 md:p-8">
        <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
          <span>🚁</span> Thrust-to-Weight Calculator
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Ensure weight and thrust use the same unit (e.g., grams or grams-force).
        </p>

        <div className="space-y-4">
        {/* Drone Weight Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Total Drone Weight (g)
          </label>
          <NumberInput
            min={0}
            step={10}
            placeholder="e.g., 600"
            value={weight}
            onChange={setWeight}
          />
        </div>

        {/* Motor Thrust Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Max Thrust per Motor (g)
          </label>
          <NumberInput
            min={0}
            step={10}
            placeholder="e.g., 945"
            value={thrustPerMotor}
            onChange={setThrustPerMotor}
          />
        </div>

        {/* Motor Count Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Number of Motors
          </label>
          <select
            value={motorCount}
            onChange={(e) => setMotorCount(parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
          >
            <option value={4}>4 (Quadcopter)</option>
            <option value={6}>6 (Hexacopter)</option>
            <option value={8}>8 (Octocopter)</option>
          </select>
        </div>
        </div>
      </div>

      {/* Right Column (Outputs) */}
      <div className="w-full md:w-5/12 bg-slate-50 dark:bg-slate-950/40 p-6 md:p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800">
        <div className="text-center">
          <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold block mb-2">
            Thrust-to-Weight Ratio
          </span>
          <div className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
            {ratio} : 1
          </div>
          <div className={`text-base font-semibold ${performance.color}`}>
            {performance.label}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/60 text-sm text-slate-500 dark:text-slate-400">
            Total Thrust: <strong className="text-slate-900 dark:text-white text-base ml-1">{totalThrust.toLocaleString()} g</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
