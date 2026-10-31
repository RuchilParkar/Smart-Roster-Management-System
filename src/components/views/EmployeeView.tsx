import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Building2, 
  Workflow, 
  CalendarPlus, 
  CheckCircle, 
  Clock, 
  ShieldCheck,
  Search,
  Sparkles
} from 'lucide-react';
import { 
  Employee, 
  Pod, 
  Brand, 
  Process, 
  MonthlyRosterData,
  PlannedLeave,
  DailyScheduleInfo 
} from '../../types';

interface EmployeeViewProps {
  employees: Employee[];
  pods: Pod[];
  brands: Brand[];
  processes: Process[];
  rosterData: MonthlyRosterData;
  leaves: PlannedLeave[];
  onOpenAddLeave: (employeeId: string) => void;
  onCellClick: (employee: Employee, date: string, schedule: DailyScheduleInfo) => void;
}

export const EmployeeView: React.FC<EmployeeViewProps> = ({
  employees,
  pods,
  brands,
  processes,
  rosterData,
  leaves,
  onOpenAddLeave,
  onCellClick,
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || 'EMP-001');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentEmp = employees.find(e => e.id === selectedEmpId) || employees[0];
  const currentPod = pods.find(p => p.id === currentEmp.podId);
  const assignedBrands = brands.filter(b => currentEmp.assignedBrandIds.includes(b.id));
  const assignedProcs = processes.filter(p => currentEmp.assignedProcessIds.includes(p.id));

  // Employee leaves
  const empLeaves = leaves.filter(l => l.employeeId === currentEmp.id);

  // Month stats for this employee
  let workingDaysCount = 0;
  let weeklyOffCount = 0;
  let leaveDaysCount = 0;
  let compOffCount = 0;

  rosterData.dates.forEach(d => {
    const s = rosterData.employeeSchedules[currentEmp.id]?.[d]?.status;
    if (s === 'WORKING') workingDaysCount++;
    else if (s === 'WEEKLY_OFF') weeklyOffCount++;
    else if (s === 'LEAVE') leaveDaysCount++;
    else if (s === 'COMP_OFF') compOffCount++;
  });

  const filteredEmployeesList = employees.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Employee Directory List */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-md flex flex-col h-[700px]">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-sky-400" />
              Workforce Directory ({employees.length})
            </h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search staff..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {filteredEmployeesList.map(emp => {
              const isSelected = emp.id === currentEmp.id;
              return (
                <button
                  key={emp.id}
                  onClick={() => setSelectedEmpId(emp.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-center justify-between border ${
                    isSelected
                      ? 'bg-sky-500/20 text-white border-sky-500/40 shadow-sm'
                      : 'bg-slate-950/40 text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{emp.name}</div>
                    <div className="text-[10px] text-slate-500">{emp.id} &bull; Pod {emp.podId.toUpperCase()}</div>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {emp.role}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Profile & Monthly Calendar */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-850 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-sky-500/20">
                  {currentEmp.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{currentEmp.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {currentEmp.role}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                    <span>ID: {currentEmp.id}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {currentEmp.email}
                    </span>
                    <span>&bull;</span>
                    <span>{currentPod?.name}</span>
                  </div>
                </div>
              </div>

              {/* Action Button: Schedule Leave */}
              <button
                onClick={() => onOpenAddLeave(currentEmp.id)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition"
              >
                <CalendarPlus className="w-4 h-4" />
                Schedule Leave / Comp-Off
              </button>
            </div>

            {/* Quick Balance & Assignment Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-medium">Assigned Brands</div>
                <div className="text-xs font-semibold text-white mt-1">
                  {assignedBrands.map(b => b.name).join(', ') || 'General Floater'}
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-medium">Processes Handled</div>
                <div className="text-xs font-semibold text-sky-400 mt-1">
                  {assignedProcs.map(p => p.code).join(', ')}
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-medium">Leave Balance</div>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">
                  {currentEmp.leaveBalance} Days
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase font-medium">Comp-Off Credits</div>
                <div className="text-sm font-bold text-violet-400 mt-0.5">
                  {currentEmp.compOffBalance} Days
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Shift Calendar for this Employee */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-400" />
                  Monthly Schedule: {rosterData.monthName} {rosterData.year}
                </h3>
                <p className="text-xs text-slate-400">
                  Click any calendar day to adjust shift or view override details
                </p>
              </div>

              {/* Monthly breakdown pills */}
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {workingDaysCount} Working Days
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">
                  {weeklyOffCount} Weekly Offs
                </span>
                {leaveDaysCount > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 border border-rose-500/30 font-medium">
                    {leaveDaysCount} Leave(s)
                  </span>
                )}
              </div>
            </div>

            {/* Calendar Grid (7 columns: Sun to Sat) */}
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-[10px] uppercase font-bold text-slate-500 py-1">
                  {d}
                </div>
              ))}

              {/* Offset days for start of month */}
              {Array.from({ length: rosterData.daysOfWeek[0] }).map((_, i) => (
                <div key={`offset-${i}`} className="p-3 rounded-xl bg-slate-950/20 border border-transparent" />
              ))}

              {/* Actual Month Days */}
              {rosterData.dates.map((dateStr, idx) => {
                const dayNum = idx + 1;
                const sched = rosterData.employeeSchedules[currentEmp.id]?.[dateStr];
                if (!sched) return null;

                const isSunday = rosterData.daysOfWeek[idx] === 0;

                let badgeStyle = 'bg-slate-950/60 border-slate-800 text-slate-300';
                if (sched.status === 'WORKING') {
                  badgeStyle = sched.isOverride 
                    ? 'bg-sky-500/20 border-sky-400/50 text-sky-200 ring-1 ring-sky-400' 
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
                } else if (sched.status === 'WEEKLY_OFF') {
                  badgeStyle = 'bg-slate-950/80 border-slate-800/80 text-slate-500';
                } else if (sched.status === 'LEAVE') {
                  badgeStyle = 'bg-rose-500/20 border-rose-500/40 text-rose-300 font-bold';
                } else if (sched.status === 'COMP_OFF') {
                  badgeStyle = 'bg-violet-500/20 border-violet-500/40 text-violet-300';
                } else if (sched.status === 'PUBLIC_HOLIDAY_OFF') {
                  badgeStyle = 'bg-amber-500/20 border-amber-500/40 text-amber-300';
                }

                return (
                  <div
                    key={dateStr}
                    onClick={() => onCellClick(currentEmp, dateStr, sched)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition hover:scale-[1.03] select-none min-h-[64px] flex flex-col justify-between ${badgeStyle}`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold">{dayNum}</span>
                      {sched.isOverride && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Manually Overridden Shift" />
                      )}
                    </div>

                    <div className="text-[10px] font-semibold mt-1">
                      {sched.status === 'WORKING' && 'Working'}
                      {sched.status === 'WEEKLY_OFF' && 'Weekly Off'}
                      {sched.status === 'LEAVE' && `Leave (${sched.leaveType || 'L'})`}
                      {sched.status === 'COMP_OFF' && 'Comp-Off'}
                      {sched.status === 'PUBLIC_HOLIDAY_OFF' && 'Holiday Off'}
                    </div>

                    {sched.backupForBrandId && (
                      <div className="text-[9px] text-amber-300 truncate">
                        Backup: {brands.find(b => b.id === sched.backupForBrandId)?.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
