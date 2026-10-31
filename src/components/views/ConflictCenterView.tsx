import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  UserCheck, 
  Building2, 
  Calendar, 
  ArrowRight,
  Info,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { Conflict, ConflictSeverity, ConflictType, MonthlyRosterData } from '../../types';

interface ConflictCenterViewProps {
  rosterData: MonthlyRosterData;
  onResolveConflict: (conflict: Conflict) => void;
  onTriggerScenario: () => void;
}

export const ConflictCenterView: React.FC<ConflictCenterViewProps> = ({
  rosterData,
  onResolveConflict,
  onTriggerScenario,
}) => {
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING'>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const { conflicts } = rosterData;

  const filteredConflicts = conflicts.filter(c => {
    if (severityFilter !== 'ALL' && c.severity !== severityFilter) return false;
    if (typeFilter !== 'ALL' && c.type !== typeFilter) return false;
    return true;
  });

  const criticalCount = conflicts.filter(c => c.severity === 'CRITICAL').length;
  const warningCount = conflicts.filter(c => c.severity === 'WARNING').length;

  return (
    <div className="p-6 space-y-6">
      {/* SLA Health Banner */}
      <div className={`p-6 rounded-2xl border backdrop-blur-md relative overflow-hidden ${
        criticalCount > 0 
          ? 'bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border-rose-500/30' 
          : 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/30'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl ${
              criticalCount > 0 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {criticalCount > 0 ? <ShieldAlert className="w-6 h-6 animate-pulse" /> : <CheckCircle2 className="w-6 h-6" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {criticalCount > 0 
                  ? `${criticalCount} Critical SLA Coverage Gap(s) Detected` 
                  : 'All Client SLA Operating Calendars Satisfied'}
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
                {criticalCount > 0 
                  ? 'Mandatory client coverage rules take priority over employee preferences. Unresolved gaps result in immediate contract SLA breach.' 
                  : 'Every operational brand and process has active verified coverage across all required operating days for this month.'}
              </p>
            </div>
          </div>

          <button
            onClick={onTriggerScenario}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-md shadow-sky-500/20 flex items-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simulate Leave Scenario</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: `All Alerts (${conflicts.length})` },
            { id: 'CRITICAL', label: `Critical Gaps (${criticalCount})`, color: 'text-rose-400' },
            { id: 'WARNING', label: `Warnings (${warningCount})`, color: 'text-amber-400' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSeverityFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border ${
                severityFilter === tab.id
                  ? 'bg-sky-500/20 text-white border-sky-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <span className={tab.color || ''}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Conflict Type Filter */}
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="text-xs bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500"
        >
          <option value="ALL">All Conflict Categories</option>
          <option value="SOLE_RESOURCE_LEAVE">Sole Resource on Leave / Off</option>
          <option value="COVERAGE_GAP">Zero Coverage Gaps</option>
          <option value="INSUFFICIENT_STAFFING">Insufficient Staffing</option>
          <option value="DOUBLE_BOOKING">Leave Clash / Double Assignment</option>
        </select>
      </div>

      {/* Conflict Cards List */}
      <div className="space-y-4">
        {filteredConflicts.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Active Conflicts Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Current roster meets all operational rules, employee availability, and brand operating calendars.
            </p>
          </div>
        ) : (
          filteredConflicts.map(conflict => {
            const isCritical = conflict.severity === 'CRITICAL';

            return (
              <div
                key={conflict.id}
                className={`p-5 rounded-2xl border transition-all duration-200 backdrop-blur-md ${
                  isCritical
                    ? 'bg-slate-900/90 border-rose-500/40 shadow-lg shadow-rose-950/20'
                    : 'bg-slate-900/80 border-amber-500/30 shadow-md'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      isCritical ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {isCritical ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isCritical ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {conflict.severity}
                        </span>
                        <h4 className="text-sm font-bold text-white">{conflict.title}</h4>
                      </div>

                      <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1 font-medium text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-sky-400" />
                          {conflict.date}
                        </span>
                        {conflict.brandName && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                            {conflict.brandName}
                          </span>
                        )}
                        {conflict.processName && (
                          <span className="text-sky-300">
                            Process: {conflict.processName}
                          </span>
                        )}
                        {conflict.employeeName && (
                          <span className="text-amber-300">
                            Assigned Agent: {conflict.employeeName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Resolve Action */}
                  <button
                    onClick={() => onResolveConflict(conflict)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-white shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Resolve / Assign Floater</span>
                  </button>
                </div>

                {/* Explanation and Root Cause */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Root Cause & Policy Context
                    </span>
                    <p className="text-slate-300 mt-1 leading-relaxed">
                      {conflict.description}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                      Client SLA & Financial Impact
                    </span>
                    <p className="text-slate-300 mt-1 leading-relaxed">
                      {conflict.impactExplanation}
                    </p>
                  </div>
                </div>

                {/* Recommendation pill */}
                <div className="mt-3 text-[11px] text-emerald-300 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Recommended Mitigation:</strong> {conflict.suggestedResolution}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
