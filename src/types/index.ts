export type OperatingRuleType = 
  | '365_DAYS' 
  | 'ALL_EXCEPT_HOLIDAYS' 
  | 'ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS';

export type DailyShiftStatus = 
  | 'WORKING' 
  | 'WEEKLY_OFF' 
  | 'LEAVE' 
  | 'COMP_OFF' 
  | 'PUBLIC_HOLIDAY_OFF';

export type ConflictSeverity = 'CRITICAL' | 'WARNING';

export type ConflictType = 
  | 'COVERAGE_GAP' 
  | 'INSUFFICIENT_STAFFING' 
  | 'UNAVAILABLE_ON_REQUIRED_DAY' 
  | 'SOLE_RESOURCE_LEAVE' 
  | 'DOUBLE_BOOKING';

export interface Pod {
  id: string;
  name: string;
  leadId: string;
  leadName: string;
  color: string;
  description: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  podId: string;
  role: 'Agent' | 'Senior Agent' | 'Pod Lead' | 'Specialist';
  weeklyOffDays: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday
  leaveBalance: number;
  compOffBalance: number;
  assignedBrandIds: string[];
  assignedProcessIds: string[];
  avatar?: string;
}

export interface Brand {
  id: string;
  name: string;
  tier: 'Enterprise' | 'Growth' | 'Essential';
  category: string;
  isSingleResource: boolean;
  requiredProcesses: string[]; // Process IDs
  primaryPodId: string;
}

export interface Process {
  id: string;
  name: string;
  code: 'CS' | 'ACC' | 'NDR' | 'RET';
  description: string;
  color: string;
}

export interface BrandProcessRule {
  id: string;
  brandId: string;
  processId: string;
  operatingRule: OperatingRuleType;
  minStaffRequired: number;
  shiftHours: string;
}

export interface PublicHoliday {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  isMandatory: boolean;
}

export interface PlannedLeave {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  type: 'ANNUAL' | 'SICK' | 'CASUAL' | 'COMP_OFF';
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  reason: string;
}

export interface CompOffCredit {
  id: string;
  employeeId: string;
  earnedDate: string;
  expiryDate: string;
  reason: string;
  isUsed: boolean;
}

export interface RosterCellOverride {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  status: DailyShiftStatus;
  backupForBrandId?: string;
  backupForProcessId?: string;
  notes?: string;
  updatedBy: string;
  updatedAt: string;
}

export interface DailyScheduleInfo {
  date: string;
  dayOfWeek: number; // 0-6
  dayName: string;
  dayNumber: number;
  status: DailyShiftStatus;
  isHoliday: boolean;
  holidayName?: string;
  isWeeklyOffDay: boolean;
  isLeave: boolean;
  leaveType?: string;
  isCompOff: boolean;
  isOverride: boolean;
  overrideNotes?: string;
  backupForBrandId?: string;
  backupForProcessId?: string;
}

export interface ProcessCoverage {
  processId: string;
  processCode: 'CS' | 'ACC' | 'NDR' | 'RET';
  operatingRule: OperatingRuleType;
  isOperatingDay: boolean;
  minStaffRequired: number;
  availableStaffCount: number;
  assignedEmployees: {
    id: string;
    name: string;
    isBackup: boolean;
  }[];
  isAdequate: boolean;
  gapCount: number;
}

export interface BrandDayCoverage {
  brandId: string;
  date: string;
  processes: Record<string, ProcessCoverage>; // processId -> ProcessCoverage
  hasAnyGap: boolean;
  totalGaps: number;
}

export interface Conflict {
  id: string;
  type: ConflictType;
  severity: ConflictSeverity;
  date: string; // YYYY-MM-DD
  brandId?: string;
  brandName?: string;
  processId?: string;
  processName?: string;
  employeeId?: string;
  employeeName?: string;
  title: string;
  description: string;
  impactExplanation: string;
  suggestedResolution: string;
  canAutoResolve?: boolean;
}

export interface MonthlyRosterData {
  year: number;
  month: number; // 1-12
  monthName: string;
  daysCount: number;
  dates: string[];
  daysOfWeek: number[];
  employeeSchedules: Record<string, Record<string, DailyScheduleInfo>>; // employeeId -> date -> schedule
  brandCoverage: Record<string, Record<string, BrandDayCoverage>>; // brandId -> date -> BrandDayCoverage
  conflicts: Conflict[];
  stats: {
    totalEmployees: number;
    totalBrands: number;
    totalOperatingSlots: number;
    coveredOperatingSlots: number;
    coveragePercentage: number;
    criticalConflicts: number;
    warningConflicts: number;
    leavesInMonth: number;
  };
}

export type ActiveView = 
  | 'company-roster' 
  | 'pod-view' 
  | 'brand-view' 
  | 'process-view' 
  | 'employee-view' 
  | 'conflict-center' 
  | 'scenario-demo' 
  | 'assessment-faq';
