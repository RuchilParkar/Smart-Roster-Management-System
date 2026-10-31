import React from 'react';
import { 
  Users, 
  Building2, 
  Workflow, 
  Percent, 
  ShieldAlert, 
  CheckCircle2, 
  CalendarOff,
  Clock
} from 'lucide-react';
import { MonthlyRosterData } from '../../types';

interface SummaryCardsProps {
  rosterData: MonthlyRosterData;
  onOpenConflicts: () => void;
  onOpenBrands: () => void;
  onOpenEmployees: () => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  rosterData,
  onOpenConflicts,
  onOpenBrands,
  onOpenEmployees,
}) => {
  const { stats } = rosterData;

  const cards = [
    {
      title: 'Active Workforce',
      value: `${stats.totalEmployees} Agents`,
      subtitle: 'Across 4 Operational Pods',
      icon: Users,
      color: 'from-sky-500/20 to-blue-500/5',
      iconColor: 'text-sky-400',
      borderColor: 'border-sky-500/20',
      action: onOpenEmployees,
    },
    {
      title: 'Client Brands',
      value: `${stats.totalBrands} Brands`,
      subtitle: '~83% Single-Resource (10/12)',
      icon: Building2,
      color: 'from-indigo-500/20 to-purple-500/5',
      iconColor: 'text-indigo-400',
      borderColor: 'border-indigo-500/20',
      action: onOpenBrands,
    },
    {
      title: 'SLA Coverage Rate',
      value: `${stats.coveragePercentage}%`,
      subtitle: `${stats.coveredOperatingSlots} of ${stats.totalOperatingSlots} slots staffed`,
      icon: Percent,
      color: stats.coveragePercentage >= 95 ? 'from-emerald-500/20 to-teal-500/5' : 'from-amber-500/20 to-orange-500/5',
      iconColor: stats.coveragePercentage >= 95 ? 'text-emerald-400' : 'text-amber-400',
      borderColor: stats.coveragePercentage >= 95 ? 'border-emerald-500/20' : 'border-amber-500/20',
      action: onOpenBrands,
    },
    {
      title: 'Coverage Conflicts',
      value: `${stats.criticalConflicts} Critical`,
      subtitle: `${stats.warningConflicts} Warning(s) &bull; ${stats.leavesInMonth} Leaves`,
      icon: ShieldAlert,
      color: stats.criticalConflicts > 0 ? 'from-rose-500/20 to-red-500/5' : 'from-emerald-500/20 to-teal-500/5',
      iconColor: stats.criticalConflicts > 0 ? 'text-rose-400' : 'text-emerald-400',
      borderColor: stats.criticalConflicts > 0 ? 'border-rose-500/20' : 'border-emerald-500/20',
      action: onOpenConflicts,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 pb-2">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            onClick={card.action}
            className={`p-4 rounded-2xl bg-gradient-to-br ${card.color} border ${card.borderColor} bg-slate-900/60 backdrop-blur-md cursor-pointer hover:scale-[1.01] transition-all duration-200 group relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl bg-slate-800/80 ${card.iconColor} group-hover:scale-110 transition duration-200`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="text-2xl font-black text-white tracking-tight mb-1">
              {card.value}
            </div>

            <p className="text-[11px] text-slate-400" dangerouslySetInnerHTML={{ __html: card.subtitle }} />

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/30 transition" />
          </div>
        );
      })}
    </div>
  );
};
