import React, { useState } from 'react';
import { X, CalendarPlus, User, AlertTriangle } from 'lucide-react';
import { Employee, PlannedLeave } from '../../types';

interface AddLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  selectedEmployeeId?: string;
  defaultDate?: string;
  onAddLeave: (leave: PlannedLeave) => void;
}

export const AddLeaveModal: React.FC<AddLeaveModalProps> = ({
  isOpen,
  onClose,
  employees,
  selectedEmployeeId,
  defaultDate,
  onAddLeave,
}) => {
  if (!isOpen) return null;

  const [employeeId, setEmployeeId] = useState<string>(selectedEmployeeId || (employees[0]?.id || ''));
  const [date, setDate] = useState<string>(defaultDate || '2026-11-12');
  const [type, setType] = useState<'ANNUAL' | 'SICK' | 'CASUAL' | 'COMP_OFF'>('ANNUAL');
  const [reason, setReason] = useState<string>('');

  const selectedEmp = employees.find(e => e.id === employeeId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !date) return;

    const newLeave: PlannedLeave = {
      id: `leave-${Date.now()}`,
      employeeId,
      date,
      type,
      status: 'APPROVED',
      reason: reason.trim() || 'Manager approved time-off',
    };

    onAddLeave(newLeave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CalendarPlus className="w-5 h-5 text-indigo-400" />
              Schedule Planned Leave / Comp-Off
            </h3>
            <p className="text-xs text-slate-400">
              Submit employee leave to trigger immediate coverage validation
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
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Select Employee</label>
            <select
              value={employeeId}
              onChange={e => setEmployeeId(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {employees.map(e => (
                <option key={e.id} value={e.id}>
                  {e.name} ({e.id}) - {e.role} [{e.podId.toUpperCase()}]
                </option>
              ))}
            </select>
            {selectedEmp && selectedEmp.assignedBrandIds.length > 0 && (
              <p className="text-[11px] text-slate-400 mt-1">
                Assigned Brands: {selectedEmp.assignedBrandIds.join(', ')}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Leave Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Leave Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="ANNUAL">Annual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="CASUAL">Casual Leave</option>
                <option value="COMP_OFF">Comp-Off (CO)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Reason / Notes</label>
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Personal travel, medical checkup"
              className="w-full text-xs bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
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
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500 text-white hover:bg-indigo-400 transition shadow-lg shadow-indigo-500/20 flex items-center gap-1.5"
            >
              Confirm Leave & Re-Validate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
