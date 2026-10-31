

## 1. How did you model employees, brands, processes, pods, and their relationships?

I designed the system using a relational data model to maintain flexibility and avoid unnecessary data duplication.

- **Employees:** Each employee has a unique ID, name, email, assigned role, pod, weekly off day, leave balances, and assigned brand/process responsibilities.
- **Pods:** Employees are grouped into operational pods, each managed by a designated Pod Lead.
- **Brands:** Each brand represents a client account and contains its operating calendar rules and staffing requirements.
- **Processes:** The system supports four core processes: Customer Support (CS), Abandoned Cart Conversions (ACC), Non-Delivery Report (NDR), and Retention.
- **Assignments:** Employee-to-brand and employee-to-process relationships are maintained through assignment mappings, supporting multiple assignments without duplicating employee records.

This structure allows an employee to work across multiple brands and processes while maintaining centralized employee information.

## 2. How does your system generate a roster and determine whether it satisfies the required constraints?

The system uses a synchronous constraint-based scheduling engine implemented in `src/utils/rosterEngine.ts`.

For every employee and calendar day, the engine evaluates:

1. Employee availability and weekly off days.
2. Approved annual, casual, and sick leaves.
3. Compensatory off credits.
4. Brand and process operating calendars.
5. Required staffing levels.
6. Employee-to-brand and employee-to-process assignments.

Based on these conditions, the engine generates daily roster statuses such as Working (W), Off (OFF), Leave (L), Comp-Off (CO), and Public Holiday (PH).

After generating the roster, it validates coverage requirements and identifies conflicts such as insufficient staffing, coverage gaps, sole-resource leave, and scheduling clashes.

The engine recalculates synchronously whenever a schedule is modified, ensuring that updated coverage and conflict information is immediately reflected in the interface.

## 3. How did you handle the difference between single-resource brands and brands with multiple employees?

I handled these two categories differently based on their operational risk.

### Single-Resource Brands

- A dedicated employee is assigned to the brand.
- The system identifies the employee as a sole resource.
- Any approved or proposed absence that creates a coverage gap triggers a critical conflict.
- Cross-trained employees from other pods can be assigned as temporary backups.

### Multi-Resource Brands

- Multiple employees can be assigned to the same brand and process.
- Staffing requirements are evaluated against the number of available employees.
- The system can maintain coverage even when one employee is unavailable, provided sufficient resources remain.

This approach protects fragile single-resource accounts while allowing flexible resource allocation for larger accounts.

## 4. What happens when an employee manages all processes for a brand but is unavailable on a required working day?

The system first checks whether the employee is the only assigned resource for the affected brand and processes.

If the employee is unavailable due to leave, weekly off, or another scheduling constraint:

1. The scheduling engine identifies the affected processes.
2. It checks the brand's operating calendar to determine whether coverage is mandatory.
3. It generates a critical coverage conflict if no replacement is available.
4. It identifies eligible cross-trained employees who can act as backups.
5. A Pod Lead or authorized administrator can assign a temporary replacement.
6. The engine revalidates the roster and updates coverage status.

**Example: Apex Gear Scenario**

Vikram Rao (EMP-004) is the only Customer Support specialist assigned to Apex Gear. When he requests leave on November 12, 2026, the system detects a 0/1 staffing gap and allows Devansh Pandey (EMP-031) from Pod Delta to be assigned as temporary backup.

After reassignment, the system recalculates coverage and updates the status to COVERED (1/1 Staff).

## 5. How does your system handle conflicting requirements or insufficient staffing?

The system uses a conflict detection and prioritization mechanism.

### Conflict Categories

| Conflict | Description |
|---|---|
| `COVERAGE_GAP` | No employee is scheduled during mandatory operating hours. |
| `SOLE_RESOURCE_LEAVE` | The only specialist assigned to a brand is unavailable. |
| `INSUFFICIENT_STAFFING` | Available employees are fewer than the required minimum. |
| `DOUBLE_BOOKING` | An employee has conflicting assignments. |
| `LEAVE_CLASH` | A working override conflicts with approved leave. |

The system distinguishes between hard constraints and soft preferences.

**Hard Constraints:**
- Approved leave.
- Employee availability.
- Scheduling conflicts.
- Mandatory staffing requirements.

**Soft Constraints:**
- Preferred weekly offs.
- Resource allocation convenience.
- Operational workload distribution.

When requirements cannot all be satisfied, the system prioritizes operational coverage while respecting employee availability and approved leave. It highlights unresolved conflicts instead of silently generating an invalid roster.

Human intervention is required when no valid staffing solution exists.

## 6. Which parts of the process did you automate, and which did you leave under human control? Why?

### Automated Processes

- Monthly roster generation.
- Employee availability validation.
- Weekly off and leave handling.
- Brand and process coverage calculations.
- Conflict detection and categorization.
- Immediate roster revalidation.
- Coverage status and staffing gap updates.

### Human-Controlled Processes

- Employee leave approval.
- Manual shift overrides.
- Temporary backup assignments.
- Resolution of critical staffing conflicts.
- Final operational approval of the roster.

I automated repetitive and rule-based decisions to reduce manual effort and scheduling errors. However, I retained human control over decisions that require operational judgment, accountability, and coordination between Pod Leads and management.

## 7. If the company doubled its team and brand count, what would you change about your solution?

The current implementation is designed to demonstrate the scheduling workflow with 32 employees and 12 brands. If the organization expanded to 500+ employees and 100+ brands, I would make the following improvements:

1. **Database Optimization:** Use properly indexed PostgreSQL tables, optimized queries, and database-level constraints.
2. **Scheduling Architecture:** Move from synchronous client-side scheduling to a dedicated backend scheduling service for larger workloads.
3. **Advanced Optimization:** Introduce constraint-solving algorithms or optimization libraries to minimize staffing gaps and balance workloads.
4. **Caching:** Use Redis for frequently accessed roster and staffing information.
5. **Background Processing:** Generate large monthly rosters through asynchronous jobs.
6. **Role-Based Access Control:** Introduce more granular permissions for administrators, Pod Leads, and employees.
7. **Monitoring:** Add structured logging, performance monitoring, and audit trails for roster changes.

These improvements would make the application more scalable, maintainable, and suitable for enterprise operations.

## 8. If you had one additional week to work on this, what would you improve first?

I would prioritize improving the scheduling engine and its conflict-resolution capabilities.

My first improvements would be:

1. **Advanced Backup Recommendations:** Automatically rank eligible backup employees based on process skills, availability, pod capacity, and existing assignments.
2. **Fair Workload Distribution:** Ensure that working days, weekly offs, and assignments are distributed fairly across employees.
3. **Automated Testing:** Add comprehensive unit and integration tests for roster generation, leave scenarios, and scheduling conflicts.
4. **Audit History:** Maintain a record of who modified a roster, what changed, and when it happened.
5. **Performance Optimization:** Benchmark scheduling performance with larger datasets.
6. **Improved Reporting:** Add downloadable monthly rosters and coverage reports.
