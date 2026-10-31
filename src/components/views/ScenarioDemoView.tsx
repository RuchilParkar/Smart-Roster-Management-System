import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  User, 
  Building2, 
  Calendar, 
  ArrowRight, 
  AlertTriangle, 
  UserCheck, 
  RotateCcw,
  Clock,
  Layers,
  FileText
} from 'lucide-react';
import { 
  Employee, 
  Brand, 
  Process, 
  MonthlyRosterData, 
  RosterCellOverride, 
  PlannedLeave 
} from '../../types';

interface ScenarioDemoViewProps {
  rosterData: MonthlyRosterData;
  employees: Employee[];
  brands: Brand[];
  processes: Process[];
  leaves: PlannedLeave[];
  overrides: RosterCellOverride[];
  onApplyOverride: (override: RosterCellOverride) => void;
  onResetScenario: () => void;
}

export const ScenarioDemoView: React.FC<ScenarioDemoViewProps> = ({
  rosterData,
  employees,
  brands,
  processes,
  leaves,
  overrides,
  onApplyOverride,
  onResetScenario,
}) => {
  // Scenario Context:
  // Brand: Apex Gear (brand-5)
  // Employee: Vikram Rao (EMP-004)
  // Date: 2026-11-12 (Thursday)
  // Process: CS (Customer Support) with 365-Day mandatory rule

  const SCENARIO_DATE = '2026-11-12';
  const TARGET_BRAND_ID = 'brand-5';
  const TARGET_PROCESS_ID = 'proc-cs';
  const TARGET_EMP_ID = 'EMP-004';
  const FLOATER_EMP_ID = 'EMP-031'; // Devansh Pandey (Pod Delta floater)

  const targetBrand = brands.find(b => b.id === TARGET_BRAND_ID);
  const targetEmp = employees.find(e => e.id === TARGET_EMP_ID);
  const floaterEmp = employees.find(e => e.id === FLOATER_EMP_ID);
  const targetProcess = processes.find(p => p.id === TARGET_PROCESS_ID);

  // Check if scenario conflict is currently active or resolved
  const activeConflict = rosterData.conflicts.find(
    c => c.brandId === TARGET_BRAND_ID && c.processId === TARGET_PROCESS_ID && c.date === SCENARIO_DATE
  );

  const isResolved = !activeConflict;

  // Check if floater override is present
  const floaterOverride = overrides.find(
    o => o.employeeId === FLOATER_EMP_ID && o.date === SCENARIO_DATE && o.backupForBrandId === TARGET_BRAND_ID
  );

  const handleResolveWithFloater = () => {
    const override: RosterCellOverride = {
      id: `backup-floater-${FLOATER_EMP_ID}-${SCENARIO_DATE}`,
      employeeId: FLOATER_EMP_ID,
      date: SCENARIO_DATE,
      status: 'WORKING',
      backupForBrandId: TARGET_BRAND_ID,
      backupForProcessId: TARGET_PROCESS_ID,
      notes: 'SLA Mitigation: Assigned Pod Delta cross-trained floater Devansh Pandey to cover Apex Gear CS during Vikram Rao annual leave.',
      updatedBy: 'Operations Lead (Scenario Resolution)',
      updatedAt: new Date().toISOString(),
    };

    onApplyOverride(override);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Assessment Case Study Header */}
      <div className="bg-gradient-to-r from-sky-950/60 via-slate-900 to-indigo-950/60 border border-sky-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                DataStraw Internship Requirement #10
              </span>
              <span className="text-xs text-slate-400">Change Handling Scenario Demonstration</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Single-Resource Brand Leave Request on Required Working Day
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Demonstrating automated gap detection, root cause explanation, client SLA breach prevention, and manager mitigation workflow when the sole assigned resource requests leave on a mandatory client operating day.
            </p>
          </div>

          <button
            onClick={onResetScenario}
            className="px-3.5 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 flex items-center gap-2 transition"
            title="Reset scenario to initial unmitigated state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>
        </div>
      </div>

      {/* 4-Step Interactive Process Walkthrough */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Step 1: The Request */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
              STEP 1: THE REQUEST
            </span>
            <User className="w-4 h-4 text-sky-400" />
          </div>

          <h3 className="text-sm font-bold text-white">Leave Submitted</h3>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs space-y-1.5">
            <div>
              <span className="text-slate-500">Employee:</span>{' '}
              <strong className="text-white">{targetEmp?.name}</strong> ({targetEmp?.id})
            </div>
            <div>
              <span className="text-slate-500">Target Date:</span>{' '}
              <span className="text-amber-300 font-medium">Nov 12, 2026 (Thursday)</span>
            </div>
            <div>
              <span className="text-slate-500">Account:</span>{' '}
              <span className="text-white font-medium">{targetBrand?.name}</span>
            </div>
            <div>
              <span className="text-slate-500">Assignment:</span>{' '}
              <span className="text-rose-400 font-semibold">100% Sole Specialist</span>
            </div>
            <div>
              <span className="text-slate-500">Leave Reason:</span>{' '}
              <span className="text-slate-300 italic">"Family wedding attendance"</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Vikram Rao is the only employee assigned to handle Apex Gear's Customer Support.
          </p>
        </div>

        {/* Step 2: Detection */}
        <div className={`p-4 rounded-2xl border space-y-3 backdrop-blur-md transition-all ${
          activeConflict 
            ? 'bg-rose-950/20 border-rose-500/40' 
            : 'bg-emerald-950/20 border-emerald-500/40'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              activeConflict ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              STEP 2: SLA ENGINE
            </span>
            {activeConflict ? <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>

          <h3 className="text-sm font-bold text-white">
            {activeConflict ? 'Coverage Gap Detected!' : 'Coverage Restored!'}
          </h3>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs space-y-1.5">
            <div>
              <span className="text-slate-500">Client Contract:</span>{' '}
              <strong className="text-sky-300">365-Day Operations</strong>
            </div>
            <div>
              <span className="text-slate-500">Hours Required:</span>{' '}
              <span className="text-slate-200">09:00 - 21:00 IST</span>
            </div>
            <div>
              <span className="text-slate-500">Min Staff Needed:</span>{' '}
              <span className="text-slate-200">1 Agent</span>
            </div>
            <div>
              <span className="text-slate-500">Scheduled Staff:</span>{' '}
              <strong className={activeConflict ? 'text-rose-400' : 'text-emerald-400'}>
                {activeConflict ? '0 Agents (100% Deficit)' : '1 Agent on Duty'}
              </strong>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            {activeConflict 
              ? 'Engine immediately flag: CRITICAL_COVERAGE_GAP. Client SLA will be violated if unhandled.' 
              : 'Backup agent actively assigned. Required minimum staffing is met.'}
          </p>
        </div>

        {/* Step 3: Explanation */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              STEP 3: ROOT CAUSE
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>

          <h3 className="text-sm font-bold text-white">Issue Explanation</h3>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2 leading-relaxed">
            <p>
              <strong className="text-amber-300">Decoupled Calendars:</strong> Brand operating rules and employee off days are separate entities.
            </p>
            <p>
              <strong className="text-white">Priority Rule:</strong> Mandatory client coverage takes strict priority over individual employee preferences.
            </p>
            <p className="text-rose-300">
              <strong className="text-rose-400">Impact:</strong> Apex Gear incoming customer tickets will sit completely unattended, violating the Master Services Agreement (MSA).
            </p>
          </div>
        </div>

        {/* Step 4: Resolution */}
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                STEP 4: MITIGATION
              </span>
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>

            <h3 className="text-sm font-bold text-white">Manager Resolution</h3>

            <p className="text-[11px] text-slate-400 mt-2 mb-3">
              Deploy cross-trained floater <strong className="text-white">Devansh Pandey</strong> from Pod Delta (Rapid Response) to cover Apex Gear on Nov 12.
            </p>

            <div className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1 mb-3">
              <div>Floater: <strong>Devansh Pandey (EMP-031)</strong></div>
              <div>Skillset: Omnichannel CS, ACC, NDR</div>
              <div>Pod: Pod Delta (Contingency Floater)</div>
            </div>
          </div>

          <div>
            {activeConflict ? (
              <button
                onClick={handleResolveWithFloater}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition"
              >
                <UserCheck className="w-4 h-4" />
                <span>Assign Backup & Re-Validate</span>
              </button>
            ) : (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-xs text-emerald-300 font-semibold">
                &check; Resolved: SLA Maintained
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live System Comparison State */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-sky-400" />
          Live Operational Audit Log & Roster Status (Nov 12, 2026)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Vikram Rao Status */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white">Vikram Rao (Sole Specialist)</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                LEAVE (Approved)
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Annual leave remains honored and approved. Vikram is relieved from duty on Nov 12 without impacting employee wellbeing.
            </p>
          </div>

          {/* Apex Gear Account Status */}
          <div className={`p-4 rounded-xl border ${
            isResolved 
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white">Apex Gear Account SLA Status</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                isResolved 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              }`}>
                {isResolved ? 'COVERED (1/1 Staff)' : 'BREACH (0/1 Staff)'}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {isResolved 
                ? 'Devansh Pandey (Pod Delta) is on duty covering Customer Support. 100% of tickets handled on schedule.' 
                : 'Zero active coverage. Customer inquiries queued without response. High escalations risk.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
