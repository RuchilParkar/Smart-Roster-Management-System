import React from 'react';
import { 
  CalendarDays, 
  Users, 
  Building2, 
  Workflow, 
  UserSquare2, 
  ShieldAlert, 
  Sparkles, 
  HelpCircle, 
  Database,
  RotateCcw
} from 'lucide-react';
import { ActiveView } from '../../types';

interface SidebarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  conflictCount: number;
  criticalConflictCount: number;
  isSupabaseConnected: boolean;
  onOpenSupabaseModal: () => void;
  onResetData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  conflictCount,
  criticalConflictCount,
  isSupabaseConnected,
  onOpenSupabaseModal,
  onResetData,
}) => {
  const navItems = [
    {
      id: 'company-roster',
      label: 'Company-Wide Roster',
      icon: CalendarDays,
      badge: null,
    },
    {
      id: 'pod-view',
      label: 'Pod-Wise View',
      icon: Users,
      badge: '4 Pods',
    },
    {
      id: 'brand-view',
      label: 'Brand-Wise Coverage',
      icon: Building2,
      badge: '12 Brands',
    },
    {
      id: 'process-view',
      label: 'Process-Wise Coverage',
      icon: Workflow,
      badge: '4 Processes',
    },
    {
      id: 'employee-view',
      label: 'Employee-Wise View',
      icon: UserSquare2,
      badge: '32 Staff',
    },
    {
      id: 'conflict-center',
      label: 'Conflict & SLA Center',
      icon: ShieldAlert,
      badge: conflictCount > 0 ? `${conflictCount}` : null,
      badgeColor: criticalConflictCount > 0 ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      id: 'scenario-demo',
      label: 'Scenario Walkthrough',
      icon: Sparkles,
      badge: 'Assessment Demo',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-semibold',
    },
    {
      id: 'assessment-faq',
      label: 'Assessment Q&A',
      icon: HelpCircle,
      badge: '8 Questions',
    },
  ];

  return (
    <aside className="w-64 bg-slate-900/95 border-r border-slate-800/80 flex flex-col shrink-0 h-screen sticky top-0 backdrop-blur-xl z-20">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
          <CalendarDays className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
            Smart Roster
            <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-sky-500/20 text-sky-400 rounded border border-sky-500/30">
              v1.0
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">DataStraw Operations</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Operational Views
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id as ActiveView)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-sky-500/20 to-indigo-500/10 text-white border border-sky-500/30 shadow-md shadow-sky-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 transition ${isActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 text-[10px] rounded-full border ${item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Status & Database Widget */}
      <div className="p-3 border-t border-slate-800/80 space-y-2 bg-slate-950/40">
        {/* Supabase Status Trigger */}
        <button
          onClick={onOpenSupabaseModal}
          className="w-full p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 flex items-center justify-between text-left transition text-xs group"
        >
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[11px] font-medium text-slate-200">
                {isSupabaseConnected ? 'Supabase Active' : 'Local Mock Active'}
              </div>
              <div className="text-[9px] text-slate-500">
                {isSupabaseConnected ? 'PostgreSQL sync enabled' : 'Click to configure DB'}
              </div>
            </div>
          </div>
          <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-500 ring-2 ring-emerald-500/30' : 'bg-amber-400'}`} />
        </button>

        {/* Reset Data Button */}
        <button
          onClick={onResetData}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
          title="Reset back to initial assessment seed data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Data</span>
        </button>
      </div>
    </aside>
  );
};
