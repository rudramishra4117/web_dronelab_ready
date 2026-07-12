import React, { useState, useMemo } from 'react';
import { NumberInput } from './ui/number-input';

export default function BatteryVisualizer() {
  // Configurable Drone Parameters
  const [baseWeight, setBaseWeight] = useState(600); // g
  const [maxThrust, setMaxThrust] = useState(3780); // g
  const [hoverEfficiency, setHoverEfficiency] = useState(130); // W/kg at 1kg
  const [energyDensity, setEnergyDensity] = useState(170); // Wh/kg
  const [voltage, setVoltage] = useState(14.8); // 4S LiPo

  // User Interactive Selection
  const [selectedCapacity, setSelectedCapacity] = useState(4000); // mAh

  // Generate curve data points
  const { dataPoints, sweetSpot, maxTimeY } = useMemo(() => {
    const points = [];
    let peak = { time: 0, capacity: 0, totalWeight: 0, battWeight: 0 };

    for (let cap = 500; cap <= 15000; cap += 250) {
      const energy_Wh = (cap * voltage) / 1000;
      const battWeight_g = (energy_Wh / energyDensity) * 1000;
      const totalWeight_kg = (baseWeight + battWeight_g) / 1000;
      
      // Power scales with Weight^1.5
      const power_W = hoverEfficiency * Math.pow(totalWeight_kg, 1.5);
      const time_min = (energy_Wh / power_W) * 60;

      const point = { capacity: cap, time: time_min, battWeight: battWeight_g, totalWeight: totalWeight_kg * 1000 };
      points.push(point);

      if (time_min > peak.time) {
        peak = point;
      }
    }

    const yMax = Math.ceil(peak.time * 1.2); // Add 20% headroom to Y axis
    return { dataPoints: points, sweetSpot: peak, maxTimeY: yMax };
  }, [baseWeight, hoverEfficiency, energyDensity, voltage]);

  // Calculate stats for the user's selected capacity
  const selectedStats = useMemo(() => {
    const energy_Wh = (selectedCapacity * voltage) / 1000;
    const battWeight_g = (energy_Wh / energyDensity) * 1000;
    const totalWeight_kg = (baseWeight + battWeight_g) / 1000;
    const power_W = hoverEfficiency * Math.pow(totalWeight_kg, 1.5);
    const time_min = (energy_Wh / power_W) * 60;
    const twr = maxThrust / (totalWeight_kg * 1000);

    return { time: time_min, battWeight: battWeight_g, totalWeight: totalWeight_kg * 1000, twr };
  }, [selectedCapacity, baseWeight, hoverEfficiency, energyDensity, voltage, maxThrust]);

  // SVG Mapping Helpers
  const svgWidth = 600;
  const svgHeight = 300;
  const mapX = (cap) => ((cap - 500) / (15000 - 500)) * svgWidth;
  const mapY = (time) => svgHeight - (time / maxTimeY) * svgHeight;

  // Generate SVG Path
  const linePath = dataPoints.map((d, i) => `${i === 0 ? 'M' : 'L'} ${mapX(d.capacity)},${mapY(d.time)}`).join(' ');

  return (
    <div className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row overflow-hidden">
      
      {/* Left Column (Inputs & Controls) */}
      <div className="w-full md:w-5/12 lg:w-1/3 p-6 md:p-8">
        <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
          <span>🔋</span> Battery Visualizer
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Find the exact capacity where adding more battery weight reduces flight time.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Base Drone Weight (g)</label>
            <NumberInput 
              min={0} step={10} 
              value={baseWeight} 
              onChange={setBaseWeight} 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Hover Efficiency (W/kg)</label>
            <NumberInput 
              min={0} step={5} 
              value={hoverEfficiency} 
              onChange={setHoverEfficiency} 
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Battery Energy Density (Wh/kg)</label>
            <NumberInput 
              min={0} step={5} 
              value={energyDensity} 
              onChange={setEnergyDensity} 
            />
          </div>
          
          <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-blue-400 mb-3">Test Configuration</h3>
            <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              <span>Select Capacity</span>
              <span className="text-slate-900 dark:text-white font-bold">{selectedCapacity} mAh</span>
            </div>
            <input 
              type="range" min="500" max="15000" step="100" 
              value={selectedCapacity} 
              onChange={(e) => setSelectedCapacity(Number(e.target.value))} 
              className="w-full accent-blue-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 px-1">
              <span>500</span>
              <span>15000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (Graph & Stats) */}
      <div className="w-full md:w-7/12 lg:w-2/3 bg-slate-50 dark:bg-slate-950/40 p-6 md:p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800">
        
        {/* SVG Graph */}
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 relative mb-4">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
            {/* Grid Lines */}
            {[...Array(5)].map((_, i) => (
              <line key={i} x1="0" y1={(svgHeight / 4) * i} x2={svgWidth} y2={(svgHeight / 4) * i} stroke="#334155" strokeDasharray="4 4" />
            ))}
            
            {/* Data Curve */}
            <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="3" />

            {/* Sweet Spot Marker */}
            <circle cx={mapX(sweetSpot.capacity)} cy={mapY(sweetSpot.time)} r="6" fill="#10b981" />
            <text x={mapX(sweetSpot.capacity)} y={mapY(sweetSpot.time) - 15} fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">
              Peak: {sweetSpot.time.toFixed(1)}m
            </text>

            {/* Selected Point Marker */}
            <circle cx={mapX(selectedCapacity)} cy={mapY(selectedStats.time)} r="6" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
            <line x1={mapX(selectedCapacity)} y1={mapY(selectedStats.time)} x2={mapX(selectedCapacity)} y2={svgHeight} stroke="#f59e0b" strokeDasharray="4 4" />
          </svg>
          <div className="flex justify-between text-[10px] text-slate-500 mt-2">
            <span>500 mAh</span>
            <span>Capacity (mAh)</span>
            <span>15000 mAh</span>
          </div>
        </div>

        {/* Selected Stats Display */}
        <div className="w-full grid grid-cols-3 gap-3 text-center">
          <div className="bg-white dark:bg-slate-800/80 shadow-sm dark:shadow-none p-4 rounded-lg border border-slate-200 dark:border-slate-700/50">
            <span className="block text-xs uppercase text-slate-500 dark:text-slate-400 font-medium mb-1">Est. Flight Time</span>
            <span className="text-2xl font-bold text-amber-500 dark:text-amber-400">{selectedStats.time.toFixed(1)} m</span>
          </div>
          <div className="bg-white dark:bg-slate-800/80 shadow-sm dark:shadow-none p-4 rounded-lg border border-slate-200 dark:border-slate-700/50">
            <span className="block text-xs uppercase text-slate-500 dark:text-slate-400 font-medium mb-1">Total Weight</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{selectedStats.totalWeight.toFixed(0)} g</span>
          </div>
          <div className={`p-4 rounded-lg border shadow-sm dark:shadow-none ${selectedStats.twr < 1.3 ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400' : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-white'}`}>
            <span className="block text-xs uppercase opacity-80 font-medium mb-1">TWR Limit</span>
            <span className="text-2xl font-bold">{selectedStats.twr.toFixed(1)}:1</span>
          </div>
        </div>
        
        {selectedStats.twr < 1.3 && (
          <div className="w-full mt-3 text-xs bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-300 p-3 rounded-lg text-center flex items-center justify-center gap-2">
            <span>⚠️</span> Warning: Thrust-to-Weight ratio is below 1.3:1. The drone is too heavy to fly safely.
          </div>
        )}
      </div>

    </div>
  );
}
