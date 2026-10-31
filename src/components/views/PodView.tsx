import React, { useState } from 'react';
import { 
  Users, 
  Crown, 
  Building2, 
  Workflow, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { 
  Pod, 
  Employee, 
  Brand, 
  Process, 
  MonthlyRosterData,
  DailyScheduleInfo 
} from '../../types';

interface PodViewProps {
  pods: Pod[];
  employees: Employee[];
  brands: Brand[];
  processes: Process[];
  rosterData: MonthlyRosterData;
  onCellClick: (employee: Employee, date: string, schedule: DailyScheduleInfo) => void;
}

export const PodView: React.FC<PodViewProps> = ({
  pods,
  employees,
  brands,
  processes,
  rosterData,
  onCellClick,
}) => {
  const [selectedPodId, setSelectedPodId] = useState<string>(pods[0]?.id || 'pod-1');

  const currentPod = pods.find(p => p.id === selectedPodId) || pods[0];
  const podEmployees = employees.filter(e => e.podId === currentPod.id);
  const podLead = employees.find(e => e.id === currentPod.leadId) || podEmployees[0];

  // Pod stats
  const podBrands = brands.filter(b => 
    podEmployees.some(e => e.assignedBrandIds.includes(b.id))
  );

  return (
    <div className="p-6 space-y-6">
      {/* Pod Selection Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        {pods.map(pod => {
          const isSelected = pod.id === selectedPodId;
          const memberCount = employees.filter(e => e.podId === pod.id).length;
          return (
            <button
              key={pod.id}
              onClick={() => setSelectedPodId(pod.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-xs transition flex items-center gap-2.5 border ${
                isSelected
                  ? 'bg-sky-500/20 text-white border-sky-500/40 shadow-lg shadow-sky-500/10'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Users className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-500'}`} />
              <span>{pod.name}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                {memberCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Pod Overview Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Operational Pod
              </span>
              <h2 className="text-xl font-bold text-white">{currentPod.name}</h2>
            </div>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              {currentPod.description}
            </p>
          </div>

          {/* Pod Lead Spotlight */}
          {podLead && (
            <div className="flex items-center gap-3.5 bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-amber-500/20">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-amber-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Pod Lead
                </div>
                <div className="text-sm font-bold text-white">{podLead.name}</div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {podLead.email}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pod Metrics Quick Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/60">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Team Members</div>
            <div className="text-lg font-bold text-white mt-0.5">{podEmployees.length} Staff</div>
          </div>

          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/60">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Brands Handled</div>
            <div className="text-lg font-bold text-indigo-400 mt-0.5">{podBrands.length} Accounts</div>
          </div>

          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/60">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Shift Type</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">Rotational Offs</div>
          </div>

          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/60">
            <div className="text-[10px] text-slate-400 uppercase font-medium">Readiness</div>
            <div className="text-lg font-bold text-sky-400 mt-0.5">100% Operational</div>
          </div>
        </div>
      </div>

      {/* Pod Member Cards */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-sky-400" />
          Pod Members & Responsibilities ({podEmployees.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {podEmployees.map(emp => {
            const isLead = emp.id === currentPod.leadId;
            const empBrands = brands.filter(b => emp.assignedBrandIds.includes(b.id));
            const empProcs = processes.filter(p => emp.assignedProcessIds.includes(p.id));

            return (
              <div 
                key={emp.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-bold text-sm">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          {emp.name}
                          {isLead && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <div className="text-[10px] text-slate-400">{emp.id} &bull; {emp.role}</div>
                      </div>
                    </div>
                  </div>

                  {/* Assigned Brands */}
                  <div className="mb-3 space-y-1">
                    <div className="text-[10px] text-slate-400 font-medium">Assigned Brands:</div>
                    <div className="flex flex-wrap gap-1">
                      {empBrands.map(b => (
                        <span 
                          key={b.id}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-200 border border-slate-700"
                        >
                          {b.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Assigned Processes */}
                  <div className="space-y-1 mb-3">
                    <div className="text-[10px] text-slate-400 font-medium">Processes:</div>
                    <div className="flex flex-wrap gap-1">
                      {empProcs.map(p => (
                        <span 
                          key={p.id}
                          className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-sky-500/10 text-sky-300 border border-sky-500/20"
                        >
                          {p.code}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Balances & Off Days */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Weekly Off: {emp.weeklyOffDays.map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(', ')}</span>
                  <span className="text-slate-300 font-medium">Leave: {emp.leaveBalance}d</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
