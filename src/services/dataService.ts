import { 
  Pod, 
  Process, 
  Brand, 
  BrandProcessRule, 
  Employee, 
  PublicHoliday, 
  PlannedLeave, 
  RosterCellOverride,
  DailyShiftStatus
} from '../types';
import { 
  INITIAL_PODS, 
  INITIAL_PROCESSES, 
  INITIAL_BRANDS, 
  INITIAL_RULES, 
  INITIAL_EMPLOYEES, 
  INITIAL_HOLIDAYS, 
  INITIAL_LEAVES 
} from '../data/sampleData';
import { getSupabaseClient, getSupabaseCredentials } from '../lib/supabaseClient';

const STORAGE_KEYS = {
  PODS: 'srm_pods',
  PROCESSES: 'srm_processes',
  BRANDS: 'srm_brands',
  RULES: 'srm_rules',
  EMPLOYEES: 'srm_employees',
  HOLIDAYS: 'srm_holidays',
  LEAVES: 'srm_leaves',
  OVERRIDES: 'srm_overrides',
};

export interface AppDataState {
  pods: Pod[];
  processes: Process[];
  brands: Brand[];
  rules: BrandProcessRule[];
  employees: Employee[];
  holidays: PublicHoliday[];
  leaves: PlannedLeave[];
  overrides: RosterCellOverride[];
  isSupabaseConnected: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
}

export class DataService {
  private static instance: DataService;

  private constructor() {}

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Load state from local storage or fallback to initial defaults
  public loadInitialData(): AppDataState {
    const { isConfigured } = getSupabaseCredentials();

    try {
      const storedPods = localStorage.getItem(STORAGE_KEYS.PODS);
      const storedProcesses = localStorage.getItem(STORAGE_KEYS.PROCESSES);
      const storedBrands = localStorage.getItem(STORAGE_KEYS.BRANDS);
      const storedRules = localStorage.getItem(STORAGE_KEYS.RULES);
      const storedEmployees = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      const storedHolidays = localStorage.getItem(STORAGE_KEYS.HOLIDAYS);
      const storedLeaves = localStorage.getItem(STORAGE_KEYS.LEAVES);
      const storedOverrides = localStorage.getItem(STORAGE_KEYS.OVERRIDES);

      return {
        pods: storedPods ? JSON.parse(storedPods) : INITIAL_PODS,
        processes: storedProcesses ? JSON.parse(storedProcesses) : INITIAL_PROCESSES,
        brands: storedBrands ? JSON.parse(storedBrands) : INITIAL_BRANDS,
        rules: storedRules ? JSON.parse(storedRules) : INITIAL_RULES,
        employees: storedEmployees ? JSON.parse(storedEmployees) : INITIAL_EMPLOYEES,
        holidays: storedHolidays ? JSON.parse(storedHolidays) : INITIAL_HOLIDAYS,
        leaves: storedLeaves ? JSON.parse(storedLeaves) : INITIAL_LEAVES,
        overrides: storedOverrides ? JSON.parse(storedOverrides) : [],
        isSupabaseConnected: isConfigured,
        isSyncing: false,
        lastSyncedAt: localStorage.getItem('srm_last_synced_at'),
      };
    } catch (e) {
      console.error('Failed reading local storage, falling back to defaults:', e);
      return {
        pods: INITIAL_PODS,
        processes: INITIAL_PROCESSES,
        brands: INITIAL_BRANDS,
        rules: INITIAL_RULES,
        employees: INITIAL_EMPLOYEES,
        holidays: INITIAL_HOLIDAYS,
        leaves: INITIAL_LEAVES,
        overrides: [],
        isSupabaseConnected: isConfigured,
        isSyncing: false,
        lastSyncedAt: null,
      };
    }
  }

  // Save current state to local storage
  public saveToLocalStorage(state: Partial<AppDataState>) {
    if (state.pods) localStorage.setItem(STORAGE_KEYS.PODS, JSON.stringify(state.pods));
    if (state.processes) localStorage.setItem(STORAGE_KEYS.PROCESSES, JSON.stringify(state.processes));
    if (state.brands) localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(state.brands));
    if (state.rules) localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(state.rules));
    if (state.employees) localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(state.employees));
    if (state.holidays) localStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(state.holidays));
    if (state.leaves) localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(state.leaves));
    if (state.overrides) localStorage.setItem(STORAGE_KEYS.OVERRIDES, JSON.stringify(state.overrides));
  }

  // Reset to sample initial state
  public resetToSampleData(): AppDataState {
    localStorage.removeItem(STORAGE_KEYS.PODS);
    localStorage.removeItem(STORAGE_KEYS.PROCESSES);
    localStorage.removeItem(STORAGE_KEYS.BRANDS);
    localStorage.removeItem(STORAGE_KEYS.RULES);
    localStorage.removeItem(STORAGE_KEYS.EMPLOYEES);
    localStorage.removeItem(STORAGE_KEYS.HOLIDAYS);
    localStorage.removeItem(STORAGE_KEYS.LEAVES);
    localStorage.removeItem(STORAGE_KEYS.OVERRIDES);
    localStorage.removeItem('srm_last_synced_at');

    return this.loadInitialData();
  }

  // Push seed data directly into Supabase (if connected)
  public async seedSupabase(state: AppDataState): Promise<{ success: boolean; message: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, message: 'Supabase client is not configured. Please provide URL & Anon Key.' };
    }

    try {
      // 1. Pods
      await supabase.from('pods').upsert(state.pods.map(p => ({
        id: p.id,
        name: p.name,
        lead_id: p.leadId,
        lead_name: p.leadName,
        color: p.color,
        description: p.description
      })));

      // 2. Processes
      await supabase.from('processes').upsert(state.processes.map(p => ({
        id: p.id,
        name: p.name,
        code: p.code,
        description: p.description,
        color: p.color
      })));

      // 3. Brands
      await supabase.from('brands').upsert(state.brands.map(b => ({
        id: b.id,
        name: b.name,
        tier: b.tier,
        category: b.category,
        is_single_resource: b.isSingleResource,
        required_processes: b.requiredProcesses,
        primary_pod_id: b.primaryPodId
      })));

      // 4. Employees
      await supabase.from('employees').upsert(state.employees.map(e => ({
        id: e.id,
        name: e.name,
        email: e.email,
        pod_id: e.podId,
        role: e.role,
        weekly_off_days: e.weeklyOffDays,
        leave_balance: e.leaveBalance,
        comp_off_balance: e.compOffBalance,
        assigned_brand_ids: e.assignedBrandIds,
        assigned_process_ids: e.assignedProcessIds
      })));

      // 5. Rules
      await supabase.from('brand_process_rules').upsert(state.rules.map(r => ({
        id: r.id,
        brand_id: r.brandId,
        process_id: r.processId,
        operating_rule: r.operatingRule,
        min_staff_required: r.minStaffRequired,
        shift_hours: r.shiftHours
      })));

      // 6. Holidays
      await supabase.from('public_holidays').upsert(state.holidays.map(h => ({
        id: h.id,
        date: h.date,
        name: h.name,
        is_mandatory: h.isMandatory
      })));

      // 7. Leaves
      await supabase.from('planned_leaves').upsert(state.leaves.map(l => ({
        id: l.id,
        employee_id: l.employeeId,
        date: l.date,
        type: l.type,
        status: l.status,
        reason: l.reason
      })));

      const now = new Date().toISOString();
      localStorage.setItem('srm_last_synced_at', now);

      return { success: true, message: 'All operational data successfully synced with Supabase PostgreSQL!' };
    } catch (err: any) {
      console.error('Supabase seeding failed:', err);
      return { success: false, message: err.message || 'Error syncing data to Supabase.' };
    }
  }

  // Pull latest data from Supabase
  public async pullFromSupabase(): Promise<{ success: boolean; data?: Partial<AppDataState>; message: string }> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, message: 'Supabase client is not configured.' };
    }

    try {
      const [
        { data: podsData },
        { data: procData },
        { data: brandsData },
        { data: empsData },
        { data: rulesData },
        { data: holsData },
        { data: leavesData },
        { data: overridesData },
      ] = await Promise.all([
        supabase.from('pods').select('*'),
        supabase.from('processes').select('*'),
        supabase.from('brands').select('*'),
        supabase.from('employees').select('*'),
        supabase.from('brand_process_rules').select('*'),
        supabase.from('public_holidays').select('*'),
        supabase.from('planned_leaves').select('*'),
        supabase.from('roster_overrides').select('*'),
      ]);

      const state: Partial<AppDataState> = {};

      if (podsData && podsData.length > 0) {
        state.pods = podsData.map((p: any) => ({
          id: p.id,
          name: p.name,
          leadId: p.lead_id,
          leadName: p.lead_name,
          color: p.color,
          description: p.description,
        }));
      }

      if (procData && procData.length > 0) {
        state.processes = procData.map((p: any) => ({
          id: p.id,
          name: p.name,
          code: p.code,
          description: p.description,
          color: p.color,
        }));
      }

      if (brandsData && brandsData.length > 0) {
        state.brands = brandsData.map((b: any) => ({
          id: b.id,
          name: b.name,
          tier: b.tier,
          category: b.category,
          isSingleResource: b.is_single_resource,
          requiredProcesses: b.required_processes || [],
          primaryPodId: b.primary_pod_id,
        }));
      }

      if (empsData && empsData.length > 0) {
        state.employees = empsData.map((e: any) => ({
          id: e.id,
          name: e.name,
          email: e.email,
          podId: e.pod_id,
          role: e.role,
          weeklyOffDays: e.weekly_off_days || [0],
          leaveBalance: e.leave_balance,
          compOffBalance: e.comp_off_balance,
          assignedBrandIds: e.assigned_brand_ids || [],
          assignedProcessIds: e.assigned_process_ids || [],
        }));
      }

      if (rulesData && rulesData.length > 0) {
        state.rules = rulesData.map((r: any) => ({
          id: r.id,
          brandId: r.brand_id,
          processId: r.process_id,
          operatingRule: r.operating_rule,
          minStaffRequired: r.min_staff_required,
          shiftHours: r.shift_hours,
        }));
      }

      if (holsData && holsData.length > 0) {
        state.holidays = holsData.map((h: any) => ({
          id: h.id,
          date: h.date,
          name: h.name,
          isMandatory: h.is_mandatory,
        }));
      }

      if (leavesData && leavesData.length > 0) {
        state.leaves = leavesData.map((l: any) => ({
          id: l.id,
          employeeId: l.employee_id,
          date: l.date,
          type: l.type,
          status: l.status,
          reason: l.reason,
        }));
      }

      if (overridesData && overridesData.length > 0) {
        state.overrides = overridesData.map((o: any) => ({
          id: o.id,
          employeeId: o.employee_id,
          date: o.date,
          status: o.status as DailyShiftStatus,
          backupForBrandId: o.backup_for_brand_id,
          backupForProcessId: o.backup_for_process_id,
          notes: o.notes,
          updatedBy: o.updated_by,
          updatedAt: o.updated_at,
        }));
      }

      return {
        success: true,
        data: state,
        message: 'Successfully pulled latest operational data from Supabase.',
      };
    } catch (err: any) {
      console.error('Supabase pull failed:', err);
      return { success: false, message: err.message || 'Error pulling data from Supabase.' };
    }
  }
}

export const dataService = DataService.getInstance();
