import { 
  Employee, 
  Brand, 
  Process, 
  BrandProcessRule, 
  PublicHoliday, 
  PlannedLeave, 
  RosterCellOverride, 
  MonthlyRosterData, 
  DailyScheduleInfo, 
  BrandDayCoverage, 
  ProcessCoverage, 
  Conflict, 
  DailyShiftStatus 
} from '../types';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function formatDate(year: number, month: number, day: number): string {
  const m = month < 10 ? `0${month}` : `${month}`;
  const d = day < 10 ? `0${day}` : `${day}`;
  return `${year}-${m}-${d}`;
}

export function parseDate(dateStr: string): { year: number; month: number; day: number; dayOfWeek: number } {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return {
    year: y,
    month: m,
    day: d,
    dayOfWeek: dateObj.getDay(),
  };
}

export function getMonthName(monthNumber: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthNumber - 1] || '';
}

/**
 * Checks if a specific brand + process operates on a given date
 * based on its configured operating rule.
 */
export function isBrandProcessOperatingOnDate(
  rule: BrandProcessRule,
  dayOfWeek: number,
  isHoliday: boolean
): boolean {
  switch (rule.operatingRule) {
    case '365_DAYS':
      // 365-day operation: operates every day of the year without exception
      return true;

    case 'ALL_EXCEPT_HOLIDAYS':
      // Operates Mon-Sun, closed only on gazetted public holidays
      return !isHoliday;

    case 'ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS':
      // Operates Mon-Sat, closed on Sundays and gazetted public holidays
      return dayOfWeek !== 0 && !isHoliday;

    default:
      return true;
  }
}

/**
 * Generates the complete monthly roster matrix, calculates coverage for each brand & process,
 * and performs deep conflict detection across all rules.
 */
export function generateMonthlyRoster(
  year: number,
  month: number,
  employees: Employee[],
  brands: Brand[],
  processes: Process[],
  rules: BrandProcessRule[],
  holidays: PublicHoliday[],
  leaves: PlannedLeave[],
  overrides: RosterCellOverride[] = []
): MonthlyRosterData {
  const daysCount = getDaysInMonth(year, month);
  const dates: string[] = [];
  const daysOfWeek: number[] = [];

  // Pre-index public holidays for fast O(1) lookup
  const holidayMap = new Map<string, PublicHoliday>();
  holidays.forEach(h => holidayMap.set(h.date, h));

  // Pre-index leaves by employeeId + date
  const leaveMap = new Map<string, PlannedLeave>();
  leaves.forEach(l => {
    if (l.status === 'APPROVED' || l.status === 'PENDING') {
      leaveMap.set(`${l.employeeId}_${l.date}`, l);
    }
  });

  // Pre-index overrides by employeeId + date
  const overrideMap = new Map<string, RosterCellOverride>();
  overrides.forEach(o => {
    overrideMap.set(`${o.employeeId}_${o.date}`, o);
  });

  // Pre-index brand rules by `${brandId}_${processId}`
  const ruleMap = new Map<string, BrandProcessRule>();
  rules.forEach(r => {
    ruleMap.set(`${r.brandId}_${r.processId}`, r);
  });

  // Generate calendar days
  for (let d = 1; d <= daysCount; d++) {
    const dateStr = formatDate(year, month, d);
    const dateObj = new Date(year, month - 1, d);
    dates.push(dateStr);
    daysOfWeek.push(dateObj.getDay());
  }

  // 1. Compute Daily Schedule for each Employee
  const employeeSchedules: Record<string, Record<string, DailyScheduleInfo>> = {};

  employees.forEach(emp => {
    employeeSchedules[emp.id] = {};

    dates.forEach((dateStr, idx) => {
      const dayOfWeek = daysOfWeek[idx];
      const dayNumber = idx + 1;
      const isHoliday = holidayMap.has(dateStr);
      const holidayObj = holidayMap.get(dateStr);
      const isWeeklyOffDay = emp.weeklyOffDays.includes(dayOfWeek);
      const leaveObj = leaveMap.get(`${emp.id}_${dateStr}`);
      const overrideObj = overrideMap.get(`${emp.id}_${dateStr}`);

      let status: DailyShiftStatus = 'WORKING';
      let isOverride = false;
      let overrideNotes: string | undefined;
      let backupBrandId: string | undefined;
      let backupProcessId: string | undefined;

      if (overrideObj) {
        status = overrideObj.status;
        isOverride = true;
        overrideNotes = overrideObj.notes;
        backupBrandId = overrideObj.backupForBrandId;
        backupProcessId = overrideObj.backupForProcessId;
      } else if (leaveObj) {
        status = leaveObj.type === 'COMP_OFF' ? 'COMP_OFF' : 'LEAVE';
      } else if (isWeeklyOffDay) {
        status = 'WEEKLY_OFF';
      } else if (isHoliday) {
        // Evaluate if any of the employee's assigned brands operate on this holiday
        // Client coverage takes precedence over employee holiday preference
        const hasMandatoryOperatingBrand = emp.assignedBrandIds.some(bId => {
          return emp.assignedProcessIds.some(pId => {
            const rule = ruleMap.get(`${bId}_${pId}`);
            return rule && rule.operatingRule === '365_DAYS';
          });
        });

        if (hasMandatoryOperatingBrand) {
          // Must work to fulfill 365-day client contract!
          status = 'WORKING';
        } else {
          // Brand operations are closed on public holidays
          status = 'PUBLIC_HOLIDAY_OFF';
        }
      } else {
        status = 'WORKING';
      }

      employeeSchedules[emp.id][dateStr] = {
        date: dateStr,
        dayOfWeek,
        dayName: DAY_NAMES[dayOfWeek],
        dayNumber,
        status,
        isHoliday,
        holidayName: holidayObj?.name,
        isWeeklyOffDay,
        isLeave: !!leaveObj,
        leaveType: leaveObj?.type,
        isCompOff: status === 'COMP_OFF',
        isOverride,
        overrideNotes,
        backupForBrandId: backupBrandId,
        backupForProcessId: backupProcessId,
      };
    });
  });

  // 2. Compute Brand & Process Daily Coverage
  const brandCoverage: Record<string, Record<string, BrandDayCoverage>> = {};
  const conflicts: Conflict[] = [];
  let totalOperatingSlots = 0;
  let coveredOperatingSlots = 0;
  let leavesInMonth = 0;

  // Count leaves in this month
  leaves.forEach(l => {
    const { year: ly, month: lm } = parseDate(l.date);
    if (ly === year && lm === month) {
      leavesInMonth++;
    }
  });

  brands.forEach(brand => {
    brandCoverage[brand.id] = {};

    dates.forEach((dateStr, idx) => {
      const dayOfWeek = daysOfWeek[idx];
      const isHoliday = holidayMap.has(dateStr);
      let brandHasGap = false;
      let brandGapCount = 0;
      const processCoverageMap: Record<string, ProcessCoverage> = {};

      brand.requiredProcesses.forEach(procId => {
        const process = processes.find(p => p.id === procId);
        const rule = ruleMap.get(`${brand.id}_${procId}`) || {
          id: `rule-${brand.id}-${procId}`,
          brandId: brand.id,
          processId: procId,
          operatingRule: 'ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS',
          minStaffRequired: 1,
          shiftHours: '09:00 - 18:00',
        };

        const isOperatingDay = isBrandProcessOperatingOnDate(rule, dayOfWeek, isHoliday);

        if (isOperatingDay) {
          totalOperatingSlots++;
        }

        // Find employees working on this brand & process on this date
        const assignedEmployees: { id: string; name: string; isBackup: boolean }[] = [];

        employees.forEach(emp => {
          const schedule = employeeSchedules[emp.id]?.[dateStr];
          if (!schedule || schedule.status !== 'WORKING') return;

          // Check direct assignment
          const isDirectlyAssigned = 
            emp.assignedBrandIds.includes(brand.id) && 
            emp.assignedProcessIds.includes(procId);

          // Check backup override assignment
          const isBackupAssigned = 
            schedule.backupForBrandId === brand.id && 
            schedule.backupForProcessId === procId;

          if (isDirectlyAssigned || isBackupAssigned) {
            assignedEmployees.push({
              id: emp.id,
              name: emp.name,
              isBackup: isBackupAssigned,
            });
          }
        });

        const availableStaffCount = assignedEmployees.length;
        const isAdequate = !isOperatingDay || availableStaffCount >= rule.minStaffRequired;
        const gapCount = isOperatingDay ? Math.max(0, rule.minStaffRequired - availableStaffCount) : 0;

        if (isOperatingDay && isAdequate) {
          coveredOperatingSlots++;
        }

        if (gapCount > 0) {
          brandHasGap = true;
          brandGapCount += gapCount;

          // CONFLICT DETECTION
          const allAssignedToThisProcess = employees.filter(
            e => e.assignedBrandIds.includes(brand.id) && e.assignedProcessIds.includes(procId)
          );

          if (availableStaffCount === 0) {
            // Check if it's a single resource on leave or off
            if (brand.isSingleResource || allAssignedToThisProcess.length === 1) {
              const soleAgent = allAssignedToThisProcess[0];
              const soleSchedule = soleAgent ? employeeSchedules[soleAgent.id]?.[dateStr] : null;
              const reason = soleSchedule?.status === 'LEAVE' 
                ? `is on approved leave (${soleSchedule.leaveType || 'Annual'})` 
                : soleSchedule?.status === 'WEEKLY_OFF'
                ? `is scheduled for weekly off`
                : `is currently unavailable (${soleSchedule?.status || 'Unknown'})`;

              conflicts.push({
                id: `conflict-sole-gap-${brand.id}-${procId}-${dateStr}`,
                type: 'SOLE_RESOURCE_LEAVE',
                severity: 'CRITICAL',
                date: dateStr,
                brandId: brand.id,
                brandName: brand.name,
                processId: procId,
                processName: process?.name || procId,
                employeeId: soleAgent?.id,
                employeeName: soleAgent?.name,
                title: `Critical Coverage Gap: Sole Resource Unavailable for ${brand.name}`,
                description: `${brand.name} has mandatory ${rule.operatingRule.replace(/_/g, ' ')} operations for ${process?.name}. ${soleAgent ? soleAgent.name : 'No specialist'} ${reason} on ${dateStr}.`,
                impactExplanation: `Zero active agents scheduled. Direct SLA breach under client master agreement (${rule.shiftHours}). Customer inquiries and support tickets will remain unhandled.`,
                suggestedResolution: `Reassign a cross-trained floater agent (e.g., from Pod Delta) or adjust shift overrides to provide backup coverage.`,
                canAutoResolve: true,
              });
            } else {
              conflicts.push({
                id: `conflict-gap-${brand.id}-${procId}-${dateStr}`,
                type: 'COVERAGE_GAP',
                severity: 'CRITICAL',
                date: dateStr,
                brandId: brand.id,
                brandName: brand.name,
                processId: procId,
                processName: process?.name || procId,
                title: `Zero Coverage Gap: ${brand.name} (${process?.code || procId})`,
                description: `Mandatory operating day requires ${rule.minStaffRequired} staff, but 0 agents are working.`,
                impactExplanation: `Operations for ${brand.name} will be completely halted during active client operating hours.`,
                suggestedResolution: `Assign backup agents to cover ${brand.name} on ${dateStr}.`,
                canAutoResolve: true,
              });
            }
          } else {
            // Insufficient staffing (some agents present, but below minStaffRequired)
            conflicts.push({
              id: `conflict-insufficient-${brand.id}-${procId}-${dateStr}`,
              type: 'INSUFFICIENT_STAFFING',
              severity: 'WARNING',
              date: dateStr,
              brandId: brand.id,
              brandName: brand.name,
              processId: procId,
              processName: process?.name || procId,
              title: `Insufficient Staffing: ${brand.name} (${process?.code})`,
              description: `Only ${availableStaffCount} of ${rule.minStaffRequired} required staff scheduled on ${dateStr}.`,
              impactExplanation: `High ticket queue volumes may lead to delayed turnaround time (TAT).`,
              suggestedResolution: `Shift additional agent capacity to ${brand.name} for this date.`,
              canAutoResolve: true,
            });
          }
        }

        processCoverageMap[procId] = {
          processId: procId,
          processCode: process?.code || 'CS',
          operatingRule: rule.operatingRule,
          isOperatingDay,
          minStaffRequired: rule.minStaffRequired,
          availableStaffCount,
          assignedEmployees,
          isAdequate,
          gapCount,
        };
      });

      brandCoverage[brand.id][dateStr] = {
        brandId: brand.id,
        date: dateStr,
        processes: processCoverageMap,
        hasAnyGap: brandHasGap,
        totalGaps: brandGapCount,
      };
    });
  });

  // 3. Double Booking and Leave-clash verification for employees
  employees.forEach(emp => {
    dates.forEach(dateStr => {
      const sched = employeeSchedules[emp.id]?.[dateStr];
      if (!sched) return;

      const leave = leaveMap.get(`${emp.id}_${dateStr}`);
      const override = overrideMap.get(`${emp.id}_${dateStr}`);

      // Check if employee has an approved leave but is overridden to WORKING without notice
      if (leave && override && override.status === 'WORKING') {
        conflicts.push({
          id: `conflict-leave-override-${emp.id}-${dateStr}`,
          type: 'DOUBLE_BOOKING',
          severity: 'WARNING',
          date: dateStr,
          employeeId: emp.id,
          employeeName: emp.name,
          title: `Leave Clash Override: ${emp.name}`,
          description: `${emp.name} had approved leave for "${leave.reason}", but has been manually overridden to WORKING status.`,
          impactExplanation: `Risk of employee no-show unless formal compensation/comp-off has been agreed upon.`,
          suggestedResolution: `Confirm agent availability and credit an extra comp-off day.`,
          canAutoResolve: false,
        });
      }
    });
  });

  const criticalConflicts = conflicts.filter(c => c.severity === 'CRITICAL').length;
  const warningConflicts = conflicts.filter(c => c.severity === 'WARNING').length;
  const coveragePercentage = totalOperatingSlots > 0 
    ? Math.round((coveredOperatingSlots / totalOperatingSlots) * 1000) / 10 
    : 100;

  return {
    year,
    month,
    monthName: getMonthName(month),
    daysCount,
    dates,
    daysOfWeek,
    employeeSchedules,
    brandCoverage,
    conflicts,
    stats: {
      totalEmployees: employees.length,
      totalBrands: brands.length,
      totalOperatingSlots,
      coveredOperatingSlots,
      coveragePercentage,
      criticalConflicts,
      warningConflicts,
      leavesInMonth,
    },
  };
}
