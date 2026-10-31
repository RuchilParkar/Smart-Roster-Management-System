import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle, UserCheck } from 'lucide-react';
import { Conflict, Employee, RosterCellOverride, MonthlyRosterData } from '../../types';

interface BackupAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflict: Conflict | null;
  employees: Employee[];
  rosterData: MonthlyRosterData;
  onAssignBackup: (override: RosterCellOverride) => void;
}

export const BackupAssignModal: React.FC<BackupAssignModalProps> = ({
  isOpen,
  onClose,
  conflict,
  employees,
  rosterData,
  onAssignBackup,
}) => {
  if (!isOpen || !conflict) return null;

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [notes, setNotes] = useState<string>(
    `Emergency backup assigned to cover SLA for ${conflict.brandName || 'Client'}`
  );

  // Find candidate backup agents:
  // Prefer agents from Pod Delta (Rapid Response) or agents currently working or available on that date
  const candidateAgents = employees.map(emp => {
    const sched = rosterData.employeeSchedules[emp.id]?.[conflict.date];
    const isAvailableOrWorking = sched?.status === 'WORKING';
    const isPodDelta = emp.podId === 'pod-4';
    return {
      emp,
      sched,
      isAvailableOrWorking,
      isPodDelta,
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId || !conflict.brandId || !conflict.processId) return;

    const override: RosterCellOverride = {
      id: `backup-${selectedEmployeeId}-${conflict.date}`,
      employeeId: selectedEmployeeId,
      date: conflict.date,
      status: 'WORKING',
      backupForBrandId: conflict.brandId,
      backupForProcessId: conflict.processId,
      notes: notes.trim(),
      updatedBy: 'Operations Manager (Conflict Resolver)',
      updatedAt: new Date().toISOString(),
    };

    onAssignBackup(override);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Glow header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-sky-500" />

        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Resolve SLA Coverage Gap & Assign Backup
            </h3>
            <p className="text-xs text-slate-400">
              {conflict.brandName} &bull; {conflict.processName} &bull; {conflict.date}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Issue summary box */}
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl space-y-1">
            <div className="text-xs font-semibold text-rose-300">
              {conflict.title}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {conflict.description}
            </p>
            <div className="text-[10px] text-rose-400 font-medium pt-1">
              {conflict.impactExplanation}
            </div>
          </div>

          {/* Select Backup Employee */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Select Qualified Backup / Floater Agent
            </label>
            <select
              value={selectedEmployeeId}
              onChange={e => setSelectedEmployeeId(e.target.value)}
              required
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-sky-500"
            >
              <option value="">-- Choose an agent to assign --</option>
              <optgroup label="Pod Delta (Rapid Response Floaters)">
                {candidateAgents
                  .filter(c => c.isPodDelta)
                  .map(c => (
                    <option key={c.emp.id} value={c.emp.id}>
                      {c.emp.name} ({c.emp.id}) - Status: {c.sched?.status || 'Unknown'}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="All Operational Agents">
                {candidateAgents
                  .filter(c => !c.isPodDelta)
                  .map(c => (
                    <option key={c.emp.id} value={c.emp.id}>
                      {c.emp.name} ({c.emp.id}) [{c.emp.podId.toUpperCase()}] - Status: {c.sched?.status || 'Unknown'}
                    </option>
                  ))}
              </optgroup>
            </select>
            <p className="text-[10px] text-slate-400 mt-1">
              Recommendation: Pod Delta floaters (e.g., Devansh Pandey) are cross-trained across all 4 processes.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Audit Log / Manager Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedEmployeeId}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserCheck className="w-4 h-4" />
              Confirm Backup & Re-Validate Roster
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
