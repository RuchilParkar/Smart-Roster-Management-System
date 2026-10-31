import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Database,
  Layers
} from 'lucide-react';
import { ActiveView } from '../../types';

interface HeaderProps {
  activeView: ActiveView;
  year: number;
  month: number;
  monthName: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onMonthChange: (year: number, month: number) => void;
  onTriggerScenario: () => void;
  onOpenSupabaseModal: () => void;
  coveragePercentage: number;
  criticalConflicts: number;
  warningConflicts: number;
  isSupabaseConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  year,
  month,
  monthName,
  onPrevMonth,
  onNextMonth,
  onMonthChange,
  onTriggerScenario,
  onOpenSupabaseModal,
  coveragePercentage,
  criticalConflicts,
  warningConflicts,
  isSupabaseConnected,
}) => {
  const getViewTitle = () => {
    switch (activeView) {
      case 'company-roster':
        return {
          title: 'Company-Wide Monthly Roster',
          subtitle: 'Holistic cross-pod scheduling matrix with automated conflict detection & shift overrides',
        };
      case 'pod-view':
        return {
          title: 'Pod-Wise Operations Hub',
          subtitle: 'Tactical pod breakdown with Pod Lead assignments and pod-level coverage health',
        };
      case 'brand-view':
        return {
          title: 'Brand-Wise Coverage Matrix',
          subtitle: 'Real-time SLA monitoring across 12 brands (~80% single-resource accounts)',
        };
      case 'process-view':
        return {
          title: 'Process-Wise Coverage & Capacity',
          subtitle: 'Staffing distribution across CS, ACC, NDR, and Retention operational streams',
        };
      case 'employee-view':
        return {
          title: 'Employee-Wise Schedule & Availability',
          subtitle: 'Individual employee view, weekly offs, planned leave quotas, and comp-offs',
        };
      case 'conflict-center':
        return {
          title: 'Conflict & SLA Resolution Center',
          subtitle: 'Real-time triage of coverage gaps, mandatory day absences, and floater backup reassignments',
        };
      case 'scenario-demo':
        return {
          title: 'Assessment Scenario Walkthrough',
          subtitle: 'Demonstration of single-resource brand leave request on mandatory 365-day operation',
        };
      case 'assessment-faq':
        return {
          title: 'Assessment Questions & Architecture Documentation',
          subtitle: 'Comprehensive answers to all eight technical and operational assessment questions',
        };
      default:
        return { title: 'Roster Dashboard', subtitle: 'Workforce management' };
    }
  };

  const { title, subtitle } = getViewTitle();

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4">
      {/* View Title & Subtitle */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          {title}
        </h2>
        <p className="text-xs text-slate-400 font-normal">{subtitle}</p>
      </div>

      {/* Center Month Selector & Action Pills */}
      <div className="flex items-center gap-3">
        {/* Month Picker Widget */}
        <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1 shadow-inner">
          <button
            onClick={onPrevMonth}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="px-3 flex items-center gap-2 text-xs font-semibold text-white">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>{monthName} {year}</span>
          </div>

          <button
            onClick={onNextMonth}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Coverage Percentage Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs">
          <span className="text-slate-400 font-medium">SLA Coverage:</span>
          <span className={`font-bold ${coveragePercentage >= 95 ? 'text-emerald-400' : coveragePercentage >= 85 ? 'text-amber-400' : 'text-rose-400'}`}>
            {coveragePercentage}%
          </span>
        </div>

        {/* Conflicts Alert Indicator */}
        <div className="flex items-center gap-1.5">
          {criticalConflicts > 0 ? (
            <span className="px-2.5 py-1 text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl flex items-center gap-1.5 animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5" />
              {criticalConflicts} Critical Gaps
            </span>
          ) : (
            <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Full SLA Coverage
            </span>
          )}
        </div>

        {/* Interactive Scenario Trigger */}
        <button
          onClick={onTriggerScenario}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Demo Scenario</span>
        </button>
      </div>
    </header>
  );
};
