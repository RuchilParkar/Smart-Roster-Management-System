import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Users, 
  HelpCircle,
  Calendar,
  ShieldAlert,
  ChevronRight,
  Filter
} from 'lucide-react';
import { 
  Brand, 
  Process, 
  BrandProcessRule, 
  MonthlyRosterData, 
  Employee,
  DailyScheduleInfo,
  Conflict
} from '../../types';

interface BrandViewProps {
  brands: Brand[];
  processes: Process[];
  rules: BrandProcessRule[];
  rosterData: MonthlyRosterData;
  employees: Employee[];
  onResolveConflict: (conflict: Conflict) => void;
  onOpenCellOverride: (employee: Employee, date: string, schedule: DailyScheduleInfo) => void;
}

export const BrandView: React.FC<BrandViewProps> = ({
  brands,
  processes,
  rules,
  rosterData,
  employees,
  onResolveConflict,
  onOpenCellOverride,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'SINGLE_RESOURCE' | 'MULTI_RESOURCE' | 'HAS_GAPS'>('ALL');
  const [selectedBrandId, setSelectedBrandId] = useState<string>('ALL');

  // Filter brands
  const filteredBrands = brands.filter(b => {
    if (selectedBrandId !== 'ALL' && b.id !== selectedBrandId) return false;

    if (filterType === 'SINGLE_RESOURCE') return b.isSingleResource;
    if (filterType === 'MULTI_RESOURCE') return !b.isSingleResource;
    if (filterType === 'HAS_GAPS') {
      return rosterData.dates.some(dateStr => rosterData.brandCoverage[b.id]?.[dateStr]?.hasAnyGap);
    }
    return true;
  });

  const singleCount = brands.filter(b => b.isSingleResource).length;
  const multiCount = brands.filter(b => !b.isSingleResource).length;

  return (
    <div className="p-6 space-y-6">
      {/* Top Filter and Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: `All Brands (${brands.length})` },
            { id: 'SINGLE_RESOURCE', label: `~80% Single-Resource (${singleCount})` },
            { id: 'MULTI_RESOURCE', label: `Multi-Resource (${multiCount})` },
            { id: 'HAS_GAPS', label: 'Brands with SLA Gaps' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border ${
                filterType === tab.id
                  ? 'bg-sky-500/20 text-white border-sky-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Brand Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Jump to:</span>
          <select
            value={selectedBrandId}
            onChange={e => setSelectedBrandId(e.target.value)}
            className="text-xs bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All 12 Brands</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} {b.isSingleResource ? '(Single-Resource)' : '(Multi)'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Brand Cards with Daily Coverage Matrix */}
      <div className="space-y-6">
        {filteredBrands.map(brand => {
          const assignedEmps = employees.filter(e => e.assignedBrandIds.includes(brand.id));
          const brandRules = rules.filter(r => r.brandId === brand.id);

          // Count gaps for this brand across the month
          let totalBrandGaps = 0;
          rosterData.dates.forEach(d => {
            totalBrandGaps += rosterData.brandCoverage[brand.id]?.[d]?.totalGaps || 0;
          });

          return (
            <div 
              key={brand.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4"
            >
              {/* Brand Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{brand.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        brand.isSingleResource 
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' 
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {brand.isSingleResource ? '⚠️ Single Resource Account (1 Agent)' : '👥 Multi-Resource Account'}
                      </span>
                      <span className="text-xs text-slate-400">&bull; {brand.category}</span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Primary Pod: {brand.primaryPodId.toUpperCase()}</span>
                      <span>&bull;</span>
                      <span>Assigned Staff: {assignedEmps.map(e => e.name).join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* Gaps indicator */}
                <div>
                  {totalBrandGaps > 0 ? (
                    <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 animate-pulse">
                      <ShieldAlert className="w-4 h-4" />
                      {totalBrandGaps} Coverage Gap Day(s)
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      100% SLA Coverage
                    </span>
                  )}
                </div>
              </div>

              {/* Process Operating Rules Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                {brand.requiredProcesses.map(procId => {
                  const proc = processes.find(p => p.id === procId);
                  const rule = brandRules.find(r => r.processId === procId);
                  const ruleLabel = rule?.operatingRule.replace(/_/g, ' ') || 'STANDARD';

                  return (
                    <div key={procId} className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-200">{proc?.name}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-sky-500/10 text-sky-400">
                          {proc?.code}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Rule: <span className="text-sky-300 font-medium">{ruleLabel}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Hours: {rule?.shiftHours} &bull; Min Staff: {rule?.minStaffRequired || 1}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Daily Coverage Table for this Brand */}
              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-slate-950/80 text-[10px] text-slate-400 border-b border-slate-800">
                      <th className="p-2 min-w-[130px] font-semibold">Process</th>
                      {rosterData.dates.map((dateStr, idx) => {
                        const dayNum = idx + 1;
                        const dayOfWeek = rosterData.daysOfWeek[idx];
                        const isSunday = dayOfWeek === 0;

                        return (
                          <th 
                            key={dateStr}
                            className={`p-1.5 text-center min-w-[32px] font-medium ${
                              isSunday ? 'bg-slate-950 text-rose-400' : ''
                            }`}
                          >
                            <div>{dayNum}</div>
                            <div className="text-[8px] uppercase text-slate-500">
                              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][dayOfWeek]}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800/40 text-xs">
                    {brand.requiredProcesses.map(procId => {
                      const proc = processes.find(p => p.id === procId);

                      return (
                        <tr key={procId} className="hover:bg-slate-800/20">
                          <td className="p-2 font-semibold text-slate-300 text-[11px] whitespace-nowrap bg-slate-950/40 border-r border-slate-800">
                            {proc?.code} - {proc?.name.split('(')[0]}
                          </td>

                          {rosterData.dates.map(dateStr => {
                            const cov = rosterData.brandCoverage[brand.id]?.[dateStr]?.processes[procId];
                            if (!cov) return <td key={dateStr}>-</td>;

                            if (!cov.isOperatingDay) {
                              return (
                                <td 
                                  key={dateStr} 
                                  className="p-1 text-center bg-slate-950/50 text-[10px] text-slate-600"
                                  title="Brand process closed on this day per operating calendar"
                                >
                                  -
                                </td>
                              );
                            }

                            if (!cov.isAdequate) {
                              // GAP!
                              return (
                                <td 
                                  key={dateStr}
                                  onClick={() => {
                                    // Trigger conflict resolution
                                    const conflict = rosterData.conflicts.find(
                                      c => c.brandId === brand.id && c.processId === procId && c.date === dateStr
                                    );
                                    if (conflict) {
                                      onResolveConflict(conflict);
                                    }
                                  }}
                                  className="p-1 text-center cursor-pointer bg-rose-500/20 hover:bg-rose-500/30 transition text-rose-300"
                                  title={`GAP: ${cov.availableStaffCount}/${cov.minStaffRequired} staff! Click to assign emergency backup.`}
                                >
                                  <div className="w-6 h-6 rounded bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center mx-auto shadow-sm">
                                    0
                                  </div>
                                </td>
                              );
                            }

                            return (
                              <td 
                                key={dateStr} 
                                className="p-1 text-center text-emerald-400"
                                title={`Covered: ${cov.availableStaffCount} agent(s) on duty (${cov.assignedEmployees.map(e => e.name).join(', ')})`}
                              >
                                <div className="w-6 h-6 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold text-[10px] flex items-center justify-center mx-auto">
                                  {cov.availableStaffCount}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
