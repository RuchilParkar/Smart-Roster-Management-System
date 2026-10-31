import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  User, 
  Building2, 
  Workflow, 
  Calendar, 
  Info,
  CalendarCheck2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { 
  Employee, 
  Pod, 
  Brand, 
  Process, 
  MonthlyRosterData, 
  DailyScheduleInfo,
  DailyShiftStatus 
} from '../../types';

interface CompanyRosterViewProps {
  rosterData: MonthlyRosterData;
  employees: Employee[];
  pods: Pod[];
  brands: Brand[];
  processes: Process[];
  onCellClick: (employee: Employee, date: string, schedule: DailyScheduleInfo) => void;
}

export const CompanyRosterView: React.FC<CompanyRosterViewProps> = ({
  rosterData,
  employees,
  pods,
  brands,
  processes,
  onCellClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPod, setSelectedPod] = useState('ALL');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedProcess, setSelectedProcess] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // Search query (name or ID)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = emp.name.toLowerCase().includes(query);
        const matchesId = emp.id.toLowerCase().includes(query);
        const matchesEmail = emp.email.toLowerCase().includes(query);
        if (!matchesName && !matchesId && !matchesEmail) return false;
      }

      // Pod filter
      if (selectedPod !== 'ALL' && emp.podId !== selectedPod) {
        return false;
      }

      // Brand filter
      if (selectedBrand !== 'ALL' && !emp.assignedBrandIds.includes(selectedBrand)) {
        return false;
      }

      // Process filter
      if (selectedProcess !== 'ALL' && !emp.assignedProcessIds.includes(selectedProcess)) {
        return false;
      }

      return true;
    });
  }, [employees, searchQuery, selectedPod, selectedBrand, selectedProcess]);

  // Helper for cell badge
  const renderCellBadge = (schedule: DailyScheduleInfo) => {
    switch (schedule.status) {
      case 'WORKING':
        return (
          <span 
            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-semibold ${
              schedule.isOverride 
                ? 'bg-sky-500 text-white shadow-sm ring-1 ring-sky-300' 
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
            title={schedule.isOverride ? `Override: ${schedule.overrideNotes || 'Working'}` : 'Working Shift'}
          >
            {schedule.isOverride && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400" />}
            W
          </span>
        );
      case 'WEEKLY_OFF':
        return (
          <span 
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-[11px] font-medium bg-slate-800/80 text-slate-400 border border-slate-700/60 hover:bg-slate-700/80"
            title="Weekly Off"
          >
            OFF
          </span>
        );
      case 'LEAVE':
        return (
          <span 
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30"
            title={`Leave: ${schedule.leaveType || 'Planned'} (Click to manage)`}
          >
            L
          </span>
        );
      case 'COMP_OFF':
        return (
          <span 
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/40 hover:bg-violet-500/30"
            title="Comp-Off Day"
          >
            CO
          </span>
        );
      case 'PUBLIC_HOLIDAY_OFF':
        return (
          <span 
            className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
            title={`Public Holiday: ${schedule.holidayName || 'Holiday'}`}
          >
            PH
          </span>
        );
      default:
        return <span>-</span>;
    }
  };

  return (
    <div className="p-6 space-y-4">
      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search agent name, ID..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Pod Filter */}
          <select
            value={selectedPod}
            onChange={e => setSelectedPod(e.target.value)}
            className="text-xs bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Pods (4)</option>
            {pods.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={e => setSelectedBrand(e.target.value)}
            className="text-xs bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Brands (12)</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>
                {b.name} {b.isSingleResource ? '(1-Agent)' : ''}
              </option>
            ))}
          </select>

          {/* Process Filter */}
          <select
            value={selectedProcess}
            onChange={e => setSelectedProcess(e.target.value)}
            className="text-xs bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">All Processes (4)</option>
            {processes.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold flex items-center justify-center">W</span>
            <span>Working</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[9px] font-bold flex items-center justify-center">OFF</span>
            <span>Weekly Off</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-bold flex items-center justify-center">L</span>
            <span>Leave</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-violet-500/20 text-violet-300 border border-violet-500/40 text-[9px] font-bold flex items-center justify-center">CO</span>
            <span>Comp-Off</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold flex items-center justify-center">PH</span>
            <span>Holiday</span>
          </div>
        </div>
      </div>

      {/* Roster Table Grid */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              {/* Row 1: Day numbers */}
              <tr className="bg-slate-950/90 border-b border-slate-800 text-[11px]">
                {/* Sticky Left Columns Header */}
                <th className="sticky left-0 z-10 bg-slate-950 px-4 py-3 font-semibold text-slate-300 min-w-[200px] border-r border-slate-800">
                  Employee & Role
                </th>
                <th className="px-3 py-3 font-semibold text-slate-400 min-w-[100px] border-r border-slate-800">
                  Pod
                </th>
                <th className="px-3 py-3 font-semibold text-slate-400 min-w-[160px] border-r border-slate-800">
                  Assigned Brands & Processes
                </th>

                {/* Day Columns */}
                {rosterData.dates.map((dateStr, idx) => {
                  const dayNum = idx + 1;
                  const dayOfWeek = rosterData.daysOfWeek[idx];
                  const isSunday = dayOfWeek === 0;
                  const isSaturday = dayOfWeek === 6;
                  const isHoliday = rosterData.employeeSchedules[employees[0]?.id]?.[dateStr]?.isHoliday;
                  const holidayName = rosterData.employeeSchedules[employees[0]?.id]?.[dateStr]?.holidayName;

                  return (
                    <th
                      key={dateStr}
                      className={`text-center py-2 px-1 min-w-[38px] font-medium transition ${
                        isHoliday
                          ? 'bg-amber-500/20 text-amber-300 border-x border-amber-500/30'
                          : isSunday
                          ? 'bg-slate-950/90 text-rose-400'
                          : isSaturday
                          ? 'bg-slate-950/70 text-slate-400'
                          : 'text-slate-300'
                      }`}
                      title={isHoliday ? `Public Holiday: ${holidayName}` : undefined}
                    >
                      <div className="text-[11px] font-bold">{dayNum}</div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-500">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][dayOfWeek]}
                      </div>
                      {isHoliday && <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mx-auto mt-0.5" />}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={rosterData.daysCount + 3} className="text-center py-12 text-slate-400">
                    No employees match the current filters.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map(emp => {
                  const pod = pods.find(p => p.id === emp.podId);
                  const assignedBrands = brands.filter(b => emp.assignedBrandIds.includes(b.id));
                  const assignedProcs = processes.filter(p => emp.assignedProcessIds.includes(p.id));

                  return (
                    <tr 
                      key={emp.id}
                      className="hover:bg-slate-800/30 transition group"
                    >
                      {/* Sticky Employee Name & ID */}
                      <td className="sticky left-0 z-10 bg-slate-900 group-hover:bg-slate-850 px-4 py-2.5 border-r border-slate-800">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-bold text-xs shrink-0">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-200 whitespace-nowrap">
                              {emp.name}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                              <span>{emp.id}</span>
                              <span>&bull;</span>
                              <span className="text-slate-300">{emp.role}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Pod */}
                      <td className="px-3 py-2.5 border-r border-slate-800 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                          {pod?.name.split(' ')[1] || emp.podId}
                        </span>
                      </td>

                      {/* Assigned Brands & Processes */}
                      <td className="px-3 py-2.5 border-r border-slate-800">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {assignedBrands.map(b => (
                            <span 
                              key={b.id} 
                              className={`px-1.5 py-0.2 rounded text-[9px] font-medium border ${
                                b.isSingleResource 
                                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                                  : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                              }`}
                              title={b.isSingleResource ? `${b.name} (Single-Resource Brand)` : b.name}
                            >
                              {b.name}
                            </span>
                          ))}
                          <div className="flex gap-1 mt-0.5">
                            {assignedProcs.map(p => (
                              <span key={p.id} className="text-[9px] text-slate-400 font-mono">
                                [{p.code}]
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Day Cells */}
                      {rosterData.dates.map((dateStr, idx) => {
                        const sched = rosterData.employeeSchedules[emp.id]?.[dateStr];
                        if (!sched) return <td key={dateStr}>-</td>;

                        const isSunday = rosterData.daysOfWeek[idx] === 0;

                        return (
                          <td
                            key={dateStr}
                            onClick={() => onCellClick(emp, dateStr, sched)}
                            className={`p-1 text-center cursor-pointer transition select-none relative group/cell ${
                              isSunday ? 'bg-slate-950/40' : ''
                            } hover:bg-sky-500/10`}
                          >
                            <div className="flex items-center justify-center relative">
                              {renderCellBadge(sched)}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info Tip */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-2">
        <div className="flex items-center gap-1.5">
          <Info className="w-4 h-4 text-sky-400" />
          <span>Click any schedule cell to edit shift status, assign emergency backup coverage, or view audit details.</span>
        </div>
        <div>
          Showing {filteredEmployees.length} of {employees.length} employees
        </div>
      </div>
    </div>
  );
};
