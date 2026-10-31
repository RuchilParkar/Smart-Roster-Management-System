import React, { useState } from 'react';
import { X, Check, Calendar, User, Building, AlertCircle } from 'lucide-react';
import { Employee, DailyScheduleInfo, DailyShiftStatus, Brand, Process, RosterCellOverride } from '../../types';

interface ShiftEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  date: string;
  schedule: DailyScheduleInfo | null;
  brands: Brand[];
  processes: Process[];
  onSaveOverride: (override: RosterCellOverride) => void;
  onRemoveOverride: (employeeId: string, date: string) => void;
}

export const ShiftEditModal: React.FC<ShiftEditModalProps> = ({
  isOpen,
  onClose,
  employee,
  date,
  schedule,
  brands,
  processes,
  onSaveOverride,
  onRemoveOverride,
}) => {
  if (!isOpen || !employee || !schedule) return null;

  const [status, setStatus] = useState<DailyShiftStatus>(schedule.status);
  const [backupBrandId, setBackupBrandId] = useState<string>(schedule.backupForBrandId || '');
  const [backupProcessId, setBackupProcessId] = useState<string>(schedule.backupForProcessId || '');
  const [notes, setNotes] = useState<string>(schedule.overrideNotes || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const override: RosterCellOverride = {
      id: `override-${employee.id}-${date}`,
      employeeId: employee.id,
      date,
      status,
      backupForBrandId: backupBrandId ? backupBrandId : undefined,
      backupForProcessId: backupProcessId ? backupProcessId : undefined,
      notes: notes.trim() || undefined,
      updatedBy: 'Operations Manager',
      updatedAt: new Date().toISOString(),
    };

    onSaveOverride(override);
    onClose();
  };

  const handleResetToDefault = () => {
    onRemoveOverride(employee.id, date);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500" />

        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-400" />
              Edit Shift Schedule
            </h3>
            <p className="text-xs text-slate-400">
              {date} ({schedule.dayName}) &bull; {employee.name} ({employee.id})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Employee Info Banner */}
          <div className="flex items-center gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/40 text-xs">
            <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              {employee.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-slate-200">{employee.name}</div>
              <div className="text-slate-400">Role: {employee.role} &bull; Pod: {employee.podId.toUpperCase()}</div>
            </div>
            {schedule.isOverride && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                Overridden
              </span>
            )}
          </div>

          {/* Shift Status Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Shift Status for {date}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { val: 'WORKING', label: 'Working (W)', desc: 'Active on duty', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' },
                { val: 'WEEKLY_OFF', label: 'Weekly Off (OFF)', desc: 'Standard rest day', color: 'border-slate-600 bg-slate-800 text-slate-300' },
                { val: 'LEAVE', label: 'Leave (L)', desc: 'Approved absence', color: 'border-rose-500/50 bg-rose-500/10 text-rose-300' },
                { val: 'COMP_OFF', label: 'Comp-Off (CO)', desc: 'Compensatory off', color: 'border-violet-500/50 bg-violet-500/10 text-violet-300' },
              ].map(opt => (
                <button
                  type="button"
                  key={opt.val}
                  onClick={() => setStatus(opt.val as DailyShiftStatus)}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    status === opt.val 
                      ? `${opt.color} ring-2 ring-sky-400 font-semibold` 
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs">{opt.label}</span>
                  <span className="text-[10px] text-slate-500">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Backup Coverage Assignment (Only if Working) */}
          {status === 'WORKING' && (
            <div className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/50 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400">
                <Building className="w-3.5 h-3.5" />
                Assign as Temporary Floater / Backup for Brand
              </div>
              <p className="text-[11px] text-slate-400">
                Use this to bridge coverage gaps when a brand's sole specialist is absent.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Target Brand</label>
                  <select
                    value={backupBrandId}
                    onChange={e => setBackupBrandId(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="">Default Brand Assignments</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name} {b.isSingleResource ? '(1-Agent)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Target Process</label>
                  <select
                    value={backupProcessId}
                    onChange={e => setBackupProcessId(e.target.value)}
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="">Default Process</option>
                    {processes.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Manager Override Notes (Reason for change)
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g., Mandatory client SLA coverage swap, comp-off agreed"
              className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            {schedule.isOverride ? (
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-xs text-rose-400 hover:text-rose-300 transition"
              >
                Revert to Default
              </button>
            ) : <span />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-sky-500 text-white hover:bg-sky-400 transition shadow-lg shadow-sky-500/20 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Apply Override & Re-Validate
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
