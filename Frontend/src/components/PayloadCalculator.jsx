import React, { useState } from 'react';
import { NumberInput } from './ui/number-input';

export default function PayloadCalculator() {
  const [droneWeight, setDroneWeight] = useState('');
  const [motorThrust, setMotorThrust] = useState('');
  const [motorCount, setMotorCount] = useState(4);
  const [customPayload, setCustomPayload] = useState('');

  // Parse numerical inputs
  const weight = parseFloat(droneWeight) || 0;
  const thrust = parseFloat(motorThrust) || 0;
  const payload = parseFloat(customPayload) || 0;

  // Total available thrust
  const totalThrust = thrust * motorCount;

  // Payload Calculations based on safe Thrust-to-Weight Ratios (TWR)
  // Recommended TWR = 2.0:1 (50% hover throttle)
  const recommendedPayload = Math.max(0, (totalThrust / 2.0) - weight);
  
  // Maximum Safe TWR = 1.3:1 (~77% hover throttle limit)
  const maxPayload = Math.max(0, (totalThrust / 1.3) - weight);

  // Flight Time Reduction Formula:
  // Power consumption scales roughly with (Weight)^1.5 due to propeller disk loading.
  // Flight time scales inversely: Time_new / Time_old = (W_base / W_total)^1.5
  const calculateTimeReduction = (addedWeight) => {
    if (weight <= 0 || addedWeight <= 0) return 0;
    const totalWeight = weight + addedWeight;
    const timeRatio = Math.pow(weight / totalWeight, 1.5);
    const reductionPercent = (1 - timeRatio) * 100;
    return Math.min(100, reductionPercent).toFixed(1);
  };

  const recTimeReduction = calculateTimeReduction(recommendedPayload);
  const maxTimeReduction = calculateTimeReduction(maxPayload);
  const customTimeReduction = calculateTimeReduction(payload);

  return (
    <div className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row overflow-hidden">
      {/* Left Column (Inputs) */}
      <div className="flex-1 p-6 md:p-8">
        <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
          <span>📦</span> Drone Payload Calculator
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Calculate safe carrying capacities and estimated battery penalty.
        </p>

        {/* Input Section */}
        <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Dry Drone Weight with Battery (g)
          </label>
          <NumberInput
            min={0}
            step={10}
            placeholder="e.g., 1200"
            value={droneWeight}
            onChange={setDroneWeight}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Max Thrust per Motor (g)
          </label>
          <NumberInput
            min={0}
            step={10}
            placeholder="e.g., 1600"
            value={motorThrust}
            onChange={setMotorThrust}
          />
        </div>

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
      <div className="w-full md:w-5/12 bg-slate-50 dark:bg-slate-950/40 p-6 md:p-8 flex flex-col justify-center gap-4 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800">
        {/* Recommended Payload Card */}
        <div className="bg-white dark:bg-slate-800/60 shadow-sm dark:shadow-none border border-blue-500/30 p-4 rounded-lg flex justify-between items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold block">
              Recommended Payload
            </span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {recommendedPayload.toFixed(0)} g
            </span>
            <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Est. Flight Time Loss: <strong className="text-amber-400">-{recTimeReduction}%</strong>
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded font-mono">
              2.0:1 TWR
            </span>
          </div>
        </div>

        {/* Max Safe Payload Card */}
        <div className="bg-white dark:bg-slate-800/60 shadow-sm dark:shadow-none border border-purple-500/30 p-4 rounded-lg flex justify-between items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold block">
              Max Safe Payload
            </span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {maxPayload.toFixed(0)} g
            </span>
            <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Est. Flight Time Loss: <strong className="text-red-400">-{maxTimeReduction}%</strong>
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded font-mono">
              1.3:1 TWR
            </span>
          </div>
        </div>

        {/* Custom Payload Tester */}
        <div className="pt-3">
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
            Test Custom Payload (g) to see specific flight time reduction:
          </label>
          <div className="flex gap-2 items-center">
            <NumberInput
              min={0}
              step={10}
              placeholder="Enter custom weight..."
              value={customPayload}
              onChange={setCustomPayload}
              className="flex-1"
            />
            {payload > 0 && (
              <span className="text-sm font-semibold text-amber-400 whitespace-nowrap">
                -{customTimeReduction}% Time
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
