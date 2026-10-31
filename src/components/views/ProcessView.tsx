import React, { useState } from 'react';
import { 
  Workflow, 
  Users, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Activity,
  Layers
} from 'lucide-react';
import { 
  Process, 
  Brand, 
  Employee, 
  MonthlyRosterData, 
  BrandProcessRule 
} from '../../types';

interface ProcessViewProps {
  processes: Process[];
  brands: Brand[];
  employees: Employee[];
  rules: BrandProcessRule[];
  rosterData: MonthlyRosterData;
}

export const ProcessView: React.FC<ProcessViewProps> = ({
  processes,
  brands,
  employees,
  rules,
  rosterData,
}) => {
  const [selectedProcessId, setSelectedProcessId] = useState<string>(processes[0]?.id || 'proc-cs');

  const currentProcess = processes.find(p => p.id === selectedProcessId) || processes[0];
  const processBrands = brands.filter(b => b.requiredProcesses.includes(currentProcess.id));
  const processEmployees = employees.filter(e => e.assignedProcessIds.includes(currentProcess.id));

  // Compute daily total staffing on this process across all brands
  const dailyStaffing = rosterData.dates.map((dateStr, idx) => {
    let activeAgents = 0;
    let requiredSlots = 0;
    let coveredSlots = 0;

    processBrands.forEach(b => {
      const cov = rosterData.brandCoverage[b.id]?.[dateStr]?.processes[currentProcess.id];
      if (cov && cov.isOperatingDay) {
        requiredSlots++;
        activeAgents += cov.availableStaffCount;
        if (cov.isAdequate) coveredSlots++;
      }
    });

    return {
      date: dateStr,
      dayNum: idx + 1,
      dayOfWeek: rosterData.daysOfWeek[idx],
      activeAgents,
      requiredSlots,
      coveredSlots,
      hasGap: coveredSlots < requiredSlots,
    };
  });

  return (
    <div className="p-6 space-y-6">
      {/* 4 Process Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {processes.map(proc => {
          const isSelected = proc.id === selectedProcessId;
          const assignedCount = employees.filter(e => e.assignedProcessIds.includes(proc.id)).length;
          const brandCount = brands.filter(b => b.requiredProcesses.includes(proc.id)).length;

          return (
            <div
              key={proc.id}
              onClick={() => setSelectedProcessId(proc.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-sky-500/15 border-sky-500/40 shadow-lg shadow-sky-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-sky-400 border border-slate-700">
                  {proc.code}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {assignedCount} Agents Assigned
                </span>
              </div>

              <h4 className="text-sm font-bold text-white mb-1">{proc.name}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">{proc.description}</p>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                <span>Active on {brandCount} Brands</span>
                <span className="text-sky-400 font-medium">View Analysis &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Process Detail Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                PROCESS STREAM
              </span>
              <h2 className="text-lg font-bold text-white">{currentProcess.name}</h2>
            </div>
            <p className="text-xs text-slate-400">{currentProcess.description}</p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase">Assigned Staff</div>
              <div className="text-base font-bold text-white">{processEmployees.length} Agents</div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase">Deployed Brands</div>
              <div className="text-base font-bold text-indigo-400">{processBrands.length} Brands</div>
            </div>
          </div>
        </div>

        {/* Daily Staffing Trend / Heatmap Bar */}
        <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-sky-400" />
          Daily Staffing Distribution Across Selected Month ({rosterData.monthName} {rosterData.year})
        </h4>

        <div className="overflow-x-auto pb-2">
          <div className="flex items-end gap-1.5 min-w-[750px] p-2 bg-slate-950/80 rounded-xl border border-slate-800">
            {dailyStaffing.map(day => (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full rounded-t transition-all ${
                    day.hasGap 
                      ? 'bg-rose-500 hover:bg-rose-400' 
                      : 'bg-sky-500/80 hover:bg-sky-400'
                  }`}
                  style={{ height: `${Math.max(16, day.activeAgents * 12)}px` }}
                  title={`${day.date}: ${day.activeAgents} staff on duty (${day.coveredSlots}/${day.requiredSlots} brand slots covered)`}
                />
                <span className="text-[9px] text-slate-400 mt-1 font-mono">{day.dayNum}</span>
                <span className="text-[8px] text-slate-600 uppercase font-mono">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][day.dayOfWeek]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cross-Trained Team Members on this Process */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          Specialists & Cross-Trained Agents Handling {currentProcess.name} ({processEmployees.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {processEmployees.map(emp => {
            const empBrands = brands.filter(b => emp.assignedBrandIds.includes(b.id));

            return (
              <div 
                key={emp.id}
                className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-white">{emp.name}</div>
                  <div className="text-[10px] text-slate-400">{emp.id} &bull; Pod {emp.podId.toUpperCase()}</div>
                  <div className="text-[10px] text-sky-400 mt-1 truncate max-w-[160px]">
                    {empBrands.map(b => b.name).join(', ')}
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-300 border border-slate-700">
                    {emp.role}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
