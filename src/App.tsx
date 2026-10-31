import React, { useState, useMemo, useEffect } from 'react';
import { 
  ActiveView, 
  Employee, 
  DailyScheduleInfo, 
  Conflict, 
  RosterCellOverride, 
  PlannedLeave 
} from './types';
import { dataService, AppDataState } from './services/dataService';
import { generateMonthlyRoster, getMonthName } from './utils/rosterEngine';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { SummaryCards } from './components/dashboard/SummaryCards';
import { CompanyRosterView } from './components/views/CompanyRosterView';
import { PodView } from './components/views/PodView';
import { BrandView } from './components/views/BrandView';
import { ProcessView } from './components/views/ProcessView';
import { EmployeeView } from './components/views/EmployeeView';
import { ConflictCenterView } from './components/views/ConflictCenterView';
import { ScenarioDemoView } from './components/views/ScenarioDemoView';
import { AssessmentFaqView } from './components/views/AssessmentFaqView';

// Modals
import { ShiftEditModal } from './components/modals/ShiftEditModal';
import { BackupAssignModal } from './components/modals/BackupAssignModal';
import { AddLeaveModal } from './components/modals/AddLeaveModal';
import { SupabaseConfigModal } from './components/modals/SupabaseConfigModal';

export const App: React.FC = () => {
  // Navigation & Time State
  const [activeView, setActiveView] = useState<ActiveView>('company-roster');
  const [year, setYear] = useState<number>(2026);
  const [month, setMonth] = useState<number>(11); // November 2026 (Assessment focus month)

  // Core Persistent State
  const [appState, setAppState] = useState<AppDataState>(() => dataService.loadInitialData());

  // Toast / Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Modals State
  const [shiftModalData, setShiftModalData] = useState<{
    isOpen: boolean;
    employee: Employee | null;
    date: string;
    schedule: DailyScheduleInfo | null;
  }>({
    isOpen: false,
    employee: null,
    date: '',
    schedule: null,
  });

  const [backupModalData, setBackupModalData] = useState<{
    isOpen: boolean;
    conflict: Conflict | null;
  }>({
    isOpen: false,
    conflict: null,
  });

  const [leaveModalData, setLeaveModalData] = useState<{
    isOpen: boolean;
    employeeId?: string;
  }>({
    isOpen: false,
  });

  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Sync state with local storage whenever state changes
  useEffect(() => {
    dataService.saveToLocalStorage(appState);
  }, [appState]);

  // Reactive Monthly Roster Generation Engine
  const rosterData = useMemo(() => {
    return generateMonthlyRoster(
      year,
      month,
      appState.employees,
      appState.brands,
      appState.processes,
      appState.rules,
      appState.holidays,
      appState.leaves,
      appState.overrides
    );
  }, [
    year,
    month,
    appState.employees,
    appState.brands,
    appState.processes,
    appState.rules,
    appState.holidays,
    appState.leaves,
    appState.overrides,
  ]);

  // Handlers for Month Navigation
  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  };

  // Shift Override Handlers
  const handleCellClick = (employee: Employee, date: string, schedule: DailyScheduleInfo) => {
    setShiftModalData({
      isOpen: true,
      employee,
      date,
      schedule,
    });
  };

  const handleSaveOverride = (override: RosterCellOverride) => {
    setAppState(prev => {
      const filtered = prev.overrides.filter(
        o => !(o.employeeId === override.employeeId && o.date === override.date)
      );
      return {
        ...prev,
        overrides: [...filtered, override],
      };
    });
    showToast(`Shift updated for ${override.employeeId} on ${override.date}. Roster re-validated!`);
  };

  const handleRemoveOverride = (employeeId: string, date: string) => {
    setAppState(prev => ({
      ...prev,
      overrides: prev.overrides.filter(
        o => !(o.employeeId === employeeId && o.date === date)
      ),
    }));
    showToast(`Reverted schedule override to default.`);
  };

  // Conflict Resolution Handler
  const handleResolveConflict = (conflict: Conflict) => {
    setBackupModalData({
      isOpen: true,
      conflict,
    });
  };

  const handleApplyBackupOverride = (override: RosterCellOverride) => {
    setAppState(prev => {
      const filtered = prev.overrides.filter(
        o => !(o.employeeId === override.employeeId && o.date === override.date)
      );
      return {
        ...prev,
        overrides: [...filtered, override],
      };
    });
    showToast(`Emergency backup assigned! Coverage gap resolved & verified.`);
  };

  // Leave Handlers
  const handleOpenAddLeave = (employeeId?: string) => {
    setLeaveModalData({
      isOpen: true,
      employeeId,
    });
  };

  const handleAddLeave = (leave: PlannedLeave) => {
    setAppState(prev => {
      const filtered = prev.leaves.filter(
        l => !(l.employeeId === leave.employeeId && l.date === leave.date)
      );
      return {
        ...prev,
        leaves: [...filtered, leave],
      };
    });
    showToast(`Planned leave recorded for ${leave.employeeId} on ${leave.date}. Re-validating coverage...`);
  };

  // Reset Sample Data
  const handleResetData = () => {
    if (window.confirm('Reset all operational data back to the default DataStraw assessment sample data?')) {
      const freshData = dataService.resetToSampleData();
      setAppState(freshData);
      setYear(2026);
      setMonth(11);
      showToast('Reset all data to default assessment sample state.');
    }
  };

  // Scenario Demo Quick Trigger
  const handleTriggerScenario = () => {
    setActiveView('scenario-demo');
    setYear(2026);
    setMonth(11);
  };

  // Supabase Push/Pull Actions
  const handleSyncPush = async () => {
    setAppState(prev => ({ ...prev, isSyncing: true }));
    const res = await dataService.seedSupabase(appState);
    setAppState(prev => ({ 
      ...prev, 
      isSyncing: false, 
      lastSyncedAt: res.success ? new Date().toISOString() : prev.lastSyncedAt 
    }));
    showToast(res.message);
  };

  const handleSyncPull = async () => {
    setAppState(prev => ({ ...prev, isSyncing: true }));
    const res = await dataService.pullFromSupabase();
    if (res.success && res.data) {
      setAppState(prev => ({
        ...prev,
        ...res.data,
        isSyncing: false,
        lastSyncedAt: new Date().toISOString(),
      }));
    } else {
      setAppState(prev => ({ ...prev, isSyncing: false }));
    }
    showToast(res.message);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-sky-950/90 border border-sky-400 text-sky-200 text-xs rounded-2xl shadow-2xl backdrop-blur-xl animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Main Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        onSelectView={setActiveView}
        conflictCount={rosterData.conflicts.length}
        criticalConflictCount={rosterData.stats.criticalConflicts}
        isSupabaseConnected={appState.isSupabaseConnected}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Global Navigation Header */}
        <Header
          activeView={activeView}
          year={year}
          month={month}
          monthName={rosterData.monthName}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onMonthChange={(y, m) => { setYear(y); setMonth(m); }}
          onTriggerScenario={handleTriggerScenario}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          coveragePercentage={rosterData.stats.coveragePercentage}
          criticalConflicts={rosterData.stats.criticalConflicts}
          warningConflicts={rosterData.stats.warningConflicts}
          isSupabaseConnected={appState.isSupabaseConnected}
        />

        {/* Global Summary KPI Metric Cards */}
        <SummaryCards
          rosterData={rosterData}
          onOpenConflicts={() => setActiveView('conflict-center')}
          onOpenBrands={() => setActiveView('brand-view')}
          onOpenEmployees={() => setActiveView('employee-view')}
        />

        {/* Active View Container */}
        <main className="flex-1 pb-16">
          {activeView === 'company-roster' && (
            <CompanyRosterView
              rosterData={rosterData}
              employees={appState.employees}
              pods={appState.pods}
              brands={appState.brands}
              processes={appState.processes}
              onCellClick={handleCellClick}
            />
          )}

          {activeView === 'pod-view' && (
            <PodView
              pods={appState.pods}
              employees={appState.employees}
              brands={appState.brands}
              processes={appState.processes}
              rosterData={rosterData}
              onCellClick={handleCellClick}
            />
          )}

          {activeView === 'brand-view' && (
            <BrandView
              brands={appState.brands}
              processes={appState.processes}
              rules={appState.rules}
              rosterData={rosterData}
              employees={appState.employees}
              onResolveConflict={handleResolveConflict}
              onOpenCellOverride={handleCellClick}
            />
          )}

          {activeView === 'process-view' && (
            <ProcessView
              processes={appState.processes}
              brands={appState.brands}
              employees={appState.employees}
              rules={appState.rules}
              rosterData={rosterData}
            />
          )}

          {activeView === 'employee-view' && (
            <EmployeeView
              employees={appState.employees}
              pods={appState.pods}
              brands={appState.brands}
              processes={appState.processes}
              rosterData={rosterData}
              leaves={appState.leaves}
              onOpenAddLeave={handleOpenAddLeave}
              onCellClick={handleCellClick}
            />
          )}

          {activeView === 'conflict-center' && (
            <ConflictCenterView
              rosterData={rosterData}
              onResolveConflict={handleResolveConflict}
              onTriggerScenario={handleTriggerScenario}
            />
          )}

          {activeView === 'scenario-demo' && (
            <ScenarioDemoView
              rosterData={rosterData}
              employees={appState.employees}
              brands={appState.brands}
              processes={appState.processes}
              leaves={appState.leaves}
              overrides={appState.overrides}
              onApplyOverride={handleApplyBackupOverride}
              onResetScenario={() => {
                // Revert any floater override on Nov 12 for scenario
                setAppState(prev => ({
                  ...prev,
                  overrides: prev.overrides.filter(
                    o => !(o.employeeId === 'EMP-031' && o.date === '2026-11-12')
                  ),
                }));
                showToast('Reset scenario demo state to initial conflict.');
              }}
            />
          )}

          {activeView === 'assessment-faq' && (
            <AssessmentFaqView />
          )}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <ShiftEditModal
        isOpen={shiftModalData.isOpen}
        onClose={() => setShiftModalData(prev => ({ ...prev, isOpen: false }))}
        employee={shiftModalData.employee}
        date={shiftModalData.date}
        schedule={shiftModalData.schedule}
        brands={appState.brands}
        processes={appState.processes}
        onSaveOverride={handleSaveOverride}
        onRemoveOverride={handleRemoveOverride}
      />

      <BackupAssignModal
        isOpen={backupModalData.isOpen}
        onClose={() => setBackupModalData({ isOpen: false, conflict: null })}
        conflict={backupModalData.conflict}
        employees={appState.employees}
        rosterData={rosterData}
        onAssignBackup={handleApplyBackupOverride}
      />

      <AddLeaveModal
        isOpen={leaveModalData.isOpen}
        onClose={() => setLeaveModalData({ isOpen: false })}
        employees={appState.employees}
        selectedEmployeeId={leaveModalData.employeeId}
        onAddLeave={handleAddLeave}
      />

      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onSyncPush={handleSyncPush}
        onSyncPull={handleSyncPull}
        isSyncing={appState.isSyncing}
        lastSyncedAt={appState.lastSyncedAt}
      />
    </div>
  );
};

export default App;
