import React, { useState } from 'react';
import { NumberInput } from './ui/number-input';

export default function PropellerCalculator() {
  const [motorKV, setMotorKV] = useState(2400); // RPM per Volt
  const [voltage, setVoltage] = useState(14.8); // Volts (4S)
  const [propDiameter, setPropDiameter] = useState(5.0); // Inches
  const [propPitch, setPropPitch] = useState(4.3); // Inches

  // Parse inputs safely
  const kv = parseFloat(motorKV) || 0;
  const v = parseFloat(voltage) || 0;
  const d = parseFloat(propDiameter) || 0;
  const p = parseFloat(propPitch) || 0;

  // 1. Calculate Maximum Unloaded RPM
  const maxRPM = kv * v;

  // 2. Calculate Tip Speed in meters per second (m/s)
  // Circumference = Pi * diameter (converted inches to meters = 0.0254)
  // Tip Speed = (RPM * Circumference) / 60 seconds
  const tipSpeedMS = (maxRPM * Math.PI * d * 0.0254) / 60;

  // Speed of sound at sea level is approx 343 m/s
  const machNumber = tipSpeedMS / 343;

  // 3. Estimated Static Thrust (in grams)
  // Using an empirical multirotor approximation formula:
  // Thrust ≈ (Diameter^3 * Pitch * RPM^2) / 250,000,000
  const estimatedThrust = (Math.pow(d, 3) * p * Math.pow(maxRPM, 2)) / 250000000;

  // Efficiency and Warning Logic
  const getEfficiencyWarning = (mach) => {
    if (mach === 0) return { label: 'Awaiting Input', color: 'text-slate-500 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-800' };
    if (mach < 0.65) return { label: 'Optimal / Efficient', color: 'text-green-600 dark:text-green-400', border: 'border-green-300 dark:border-green-500/30' };
    if (mach < 0.75) return { label: 'Caution: Losing Efficiency', color: 'text-amber-600 dark:text-amber-400', border: 'border-amber-300 dark:border-amber-500/30' };
    return { label: 'Warning: Transonic Drag', color: 'text-red-600 dark:text-red-500', border: 'border-red-300 dark:border-red-500/50' };
  };

  const status = getEfficiencyWarning(machNumber);

  return (
    <div className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row overflow-hidden">

      {/* Left Column (Inputs) */}
      <div className="flex-1 p-6 md:p-8">
        <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
          <span>🌪️</span> Propeller Speed & Efficiency
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Calculate tip speeds and prevent transonic efficiency loss.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {/* Motor KV */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Motor KV (RPM/V)
            </label>
            <NumberInput
              min={0} step={100}
              value={motorKV}
              onChange={setMotorKV}
            />
          </div>

          {/* Battery Voltage */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Battery Voltage (V)
            </label>
            <NumberInput
              min={0} step={0.1}
              value={voltage}
              onChange={setVoltage}
            />
          </div>

          {/* Propeller Diameter */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Prop Diameter (in)
            </label>
            <NumberInput
              min={0} step={0.1}
              value={propDiameter}
              onChange={setPropDiameter}
            />
          </div>

          {/* Propeller Pitch */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Prop Pitch (in)
            </label>
            <NumberInput
              min={0} step={0.1}
              value={propPitch}
              onChange={setPropPitch}
            />
          </div>
        </div>
      </div>

      {/* Right Column (Outputs) */}
      <div className="w-full md:w-5/12 bg-slate-50 dark:bg-slate-950/40 p-6 md:p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800">

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Max RPM */}
          <div className="bg-white dark:bg-slate-900/80 shadow-sm dark:shadow-none p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-center flex flex-col justify-center">
            <span className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">
              Max Unloaded
            </span>
            <div className="text-xl font-bold text-slate-900 dark:text-white leading-none">
              {Math.round(maxRPM).toLocaleString()}
            </div>
            <span className="text-xs font-medium text-slate-500 mt-1">rpm</span>
          </div>

          {/* Estimated Thrust */}
          <div className="bg-white dark:bg-slate-900/80 shadow-sm dark:shadow-none p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-center flex flex-col justify-center">
            <span className="block text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-1">
              Est. Thrust
            </span>
            <div className="text-xl font-bold text-slate-900 dark:text-white leading-none">
              {Math.round(estimatedThrust).toLocaleString()}
            </div>
            <span className="text-xs font-medium text-slate-500 mt-1">g</span>
          </div>
        </div>

        {/* Tip Speed & Warning Card */}
        <div className={`bg-white dark:bg-slate-800/60 shadow-sm dark:shadow-none p-5 rounded-lg border ${status.border} text-center flex-1 flex flex-col justify-center`}>
          <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Propeller Top Speed
          </span>
          <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1">
            {tipSpeedMS.toFixed(0)} <span className="text-xl font-medium text-slate-500 dark:text-slate-400">m/s</span>
          </div>
          <div className="text-sm font-medium text-slate-500 mb-3">
            Mach {machNumber.toFixed(2)}
          </div>
          <div className={`text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full inline-block bg-slate-100 dark:bg-slate-900/50 ${status.color}`}>
            {status.label}
          </div>
        </div>
      </div>

    </div>
  );
}
