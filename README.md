# 🗓️ Smart Roster Management System (DataStraw Operations Hub)

A production-grade, intelligent workforce rostering, multi-brand SLA coverage enforcement, and automated conflict detection system designed strictly for the **DataStraw Internship Assessment**.

Built with **React 19**, **Vite**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL)**.

---

## 🌟 Executive Summary

Modern Direct-to-Consumer (D2C) e-commerce operations face a significant structural risk: **over 80% of client brands rely on a single dedicated resource**. When that sole specialist takes leave or an unscheduled absence on a mandatory client operating day, the client's SLA is directly breached, resulting in unhandled support queues, lost cart revenue, and contractual penalties.

This application solves this operational vulnerability by:
1. **Decoupling Brand Operating Calendars from Employee Weekly Offs**: Mandatory client operational schedules always take strict priority over individual employee preferences.
2. **Real-Time Constraint Validation & Conflict Detection**: Automatically detects zero-coverage gaps, insufficient staffing, and sole-resource absences.
3. **Automated & Manual Mitigation**: Equips managers with a Rapid Response Floater Pool (Pod Delta) and a 1-click backup reassignment workflow with instant re-validation.

---

## 🚀 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript + Vite 8 | Ultra-fast client-side rendering with strict type safety |
| **Styling & Design** | Tailwind CSS + Lucide Icons | Polished, modern operations dashboard with dark mode and glassmorphism |
| **Database & Persistence** | Supabase (PostgreSQL) + LocalStorage | Relational database schema with Row Level Security (RLS) and offline fallback |
| **Roster Engine** | Custom TypeScript Constraint Solver | Synchronous $O(E \times D + B \times P \times D)$ evaluation (&lt; 8ms execution) |

---

## 📦 Project Setup & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node v24.13.0)
- **NPM**: v9.0.0 or higher

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/RuchilParkar/Smart-Roster-Management-System.git
cd Smart-Roster-Management-System

# Install dependencies
npm install
```

### 2. Configure Environment (Optional - Supabase Database)
The application works **100% out of the box** in offline/local mock mode with pre-seeded sample data. To connect to an active Supabase PostgreSQL instance:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Add your Supabase credentials in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Open your Supabase project's **SQL Editor** and run the contents of `supabase_schema.sql` to initialize the database tables, relations, and RLS policies.
4. Alternatively, click the **"Supabase Active / Local Mock"** widget in the sidebar within the app UI to configure credentials at runtime or trigger 1-click database synchronization!

### 3. Start the Development Server
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🏢 Core System Modules

### 1. Employee Management
- Pre-seeded with **32 operational employees** (exceeding the 30-employee requirement).
- Stores Employee Name, Corporate Email, ID (`EMP-001` through `EMP-032`), Role, Assigned Pod, Preferred Weekly Offs, Leave Balances, and Comp-Off Credits.
- Staggered off days (Sundays, Mondays, Tuesdays, Saturdays) across team members to guarantee weekend coverage.

### 2. Pod Management
- **4 Operational Pods**, each headed by a dedicated Pod Lead:
  - **Pod Alpha (E-Commerce Titans)** &bull; *Lead: Aarav Sharma* &bull; Tier-1 D2C Enterprise accounts.
  - **Pod Beta (D2C Velocity)** &bull; *Lead: Rohan Mehra* &bull; Cart recovery, retention, and rapid scaling.
  - **Pod Gamma (Omnichannel Care)** &bull; *Lead: Neha Deshmukh* &bull; Logistics, NDR resolution, and multi-channel fulfillment.
  - **Pod Delta (Rapid Response)** &bull; *Lead: Kunal Singhania* &bull; Cross-trained contingency floater pool.

### 3. Brand Management
- **12 Fictional D2C Brands**:
  - **~83% Single-Resource Brands (10 brands)**: Bolt Electric, Zest Organics, Apex Gear, Novva Health, Velox Footwear, ZenBrew Coffee, UrbanPulse Wear, TerraLiving Decor, Kura Pets, AeroFit Smartgear.
  - **Multi-Resource Brands (2 brands)**: Lumina Skin (4 processes), SwiftCart Grocery (3 processes).

### 4. Process Management
- **4 Core Operational Streams**:
  1. **Customer Support (CS)**: Omnichannel tickets, WhatsApp, live chat inquiries.
  2. **Abandoned Cart Conversions (ACC)**: High-intent checkout drop-off recovery.
  3. **Non-Delivery Report (NDR)**: Return-to-origin (RTO) courier prevention.
  4. **Retention**: Subscription renewals and VIP customer lifecycle care.
- Supports cross-trained employees working across multiple processes simultaneously.

### 5. Working Rules & Operating Calendars
- **3 Operating Rules**:
  - `365_DAYS`: Mandatory coverage 365 days/year (no closures for weekends or gazetted holidays).
  - `ALL_EXCEPT_HOLIDAYS`: Operates Mon-Sun, closed only on gazetted public holidays.
  - `ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS`: Operates Mon-Sat, closed on Sundays and public holidays.
- **Process-Level Rule Granularity**: Different processes within the same brand follow different rules (e.g. Lumina Skin CS is 365-day, whereas its ACC stream is Mon-Sat except holidays).

### 6. Monthly Roster Generation & Shift Badges
- Dynamic calendar generation for any selected month and year.
- Shift Badges:
  - `W` (Emerald / Sky): Active working shift (with override marker if modified).
  - `OFF` (Slate): Scheduled weekly off rest day.
  - `L` (Rose): Approved annual / sick / casual leave.
  - `CO` (Violet): Compensatory off day credit.
  - `PH` (Amber): Gazetted public holiday closure.

### 7. Interactive Roster Views
1. **Company-Wide Roster**: Complete employee $\times$ day matrix with pod, brand, process, and status filters.
2. **Pod-Wise View**: Tactical pod breakdowns, Pod Lead spotlights, and pod capacity metrics.
3. **Brand-Wise Coverage Matrix**: Visual green/red matrix comparing required client staffing vs. actual scheduled agents for every brand and process.
4. **Process-Wise View**: Staffing distribution curves across CS, ACC, NDR, and Retention.
5. **Employee-Wise View**: Individual calendar view with leave balances and scheduled duties.

### 8. Conflict Detection & SLA Center
Identifies and categorizes:
- **Zero-Coverage Gaps (`COVERAGE_GAP`)**: Critical SLA breach where 0 agents are scheduled on an active client operating day.
- **Sole-Resource Absences (`SOLE_RESOURCE_LEAVE`)**: The only designated agent for a brand is absent without a scheduled backup.
- **Insufficient Staffing (`INSUFFICIENT_STAFFING`)**: Available agents &lt; `minStaffRequired`.
- **Double Assignments (`DOUBLE_BOOKING` / `LEAVE_CLASH`)**: Working overrides during approved leaves.

### 9. Manual Editing & Re-Validation
- Managers can click any schedule cell to override shifts, adjust off days, or assign temporary floaters.
- Roster recalculates synchronously, re-indexing conflicts and updating SLA metrics in real time.

---

## 🎯 Change Handling Scenario (Requirement #10)

### Case Study: Single-Resource Brand Leave Request on Mandatory Working Day
- **Brand**: Apex Gear (Brand-5) &bull; D2C Outdoor Apparel.
- **Rule**: Customer Support runs under mandatory **365-day operations** (09:00 - 21:00 IST), requiring at least 1 agent daily.
- **Assigned Specialist**: **Vikram Rao (EMP-004)** is the **sole resource** assigned to Apex Gear CS.
- **Event**: Vikram submits an Annual Leave request for **November 12, 2026 (Thursday)**.

### Step-by-Step Resolution Demonstrated in App:
1. **The Request**: Vikram Rao's leave is registered in the system.
2. **SLA Engine Detection**: The engine evaluates Nov 12 against Apex Gear CS. Required staff = 1, Scheduled staff = 0 (100% deficit). Flags `CRITICAL_COVERAGE_GAP`.
3. **Root Cause Explanation**: Decoupled operating calendars mandate client coverage over agent preferences. Approving without replacement leads to unhandled queues and direct breach of the client MSA.
4. **Manager Mitigation**: Manager assigns cross-trained floater **Devansh Pandey (EMP-031)** from Pod Delta.
5. **Live Verification**: Roster instantly re-validates, the conflict clears, and Apex Gear displays `COVERED (1/1 Staff)`.

---

## 📚 Answers to Assessment Questions

### 1. How did you model employees, brands, processes, pods, and their relationships?

I designed the system using a relational data model to maintain flexibility and avoid unnecessary duplication:
- **Employees**: Each employee has a unique ID, name, email, assigned role, pod, weekly off day, leave balances, and assigned brand/process responsibilities.
- **Pods**: Employees are grouped into operational pods, each managed by a designated Pod Lead.
- **Brands**: Each brand represents a client account and contains its operating calendar rules and staffing requirements.
- **Processes**: The system supports four core processes: Customer Support (CS), Abandoned Cart Conversions (ACC), Non-Delivery Report (NDR), and Retention.
- **Assignments**: Employee-to-brand and employee-to-process relationships are maintained through assignment mappings, supporting multiple assignments without duplicating employee records.

This structure allows an employee to work across multiple brands and processes while maintaining centralized employee information.

---

### 2. How does your system generate a roster and determine whether it satisfies the required constraints?

The system uses a synchronous constraint-based scheduling engine implemented in `src/utils/rosterEngine.ts`.

For every employee and calendar day, the engine evaluates:
- Employee availability and weekly off days.
- Approved annual, casual, and sick leaves.
- Compensatory off credits.
- Brand and process operating calendars.
- Required staffing levels.
- Employee-to-brand and employee-to-process assignments.

Based on these conditions, the engine generates daily roster statuses such as Working (`W`), Off (`OFF`), Leave (`L`), Comp-Off (`CO`), and Public Holiday (`PH`).

After generating the roster, it validates coverage requirements and identifies conflicts such as insufficient staffing, coverage gaps, sole-resource leave, and scheduling clashes.

The engine recalculates synchronously whenever a schedule is modified, ensuring that updated coverage and conflict information is immediately reflected in the interface.

---

### 3. How did you handle the difference between single-resource brands and brands with multiple employees?

I handled these two categories differently based on their operational risk:

**Single-resource brands:**
- A dedicated employee is assigned to the brand.
- The system identifies the employee as a sole resource.
- Any approved or proposed absence that creates a coverage gap triggers a critical conflict (`SOLE_RESOURCE_LEAVE`).
- Cross-trained employees from other pods (like Pod Delta) can be assigned as temporary backups.

**Multi-resource brands:**
- Multiple employees can be assigned to the same brand and process.
- Staffing requirements are evaluated against the number of available employees.
- The system can maintain coverage even when one employee is unavailable, provided sufficient resources remain.

This approach protects fragile single-resource accounts while allowing flexible resource allocation for larger accounts.

---

### 4. What happens when an employee manages all processes for a brand but is unavailable on a required working day?

The system first checks whether the employee is the only assigned resource for the affected brand and processes.

If the employee is unavailable due to leave, weekly off, or another scheduling constraint:
1. The scheduling engine identifies the affected processes.
2. It checks the brand's operating calendar to determine whether coverage is mandatory.
3. It generates a critical coverage conflict if no replacement is available.
4. It identifies eligible cross-trained employees who can act as backups.
5. A Pod Lead or authorized administrator can assign a temporary replacement.
6. The engine revalidates the roster and updates coverage status.

For example, in the Apex Gear scenario, Vikram Rao (`EMP-004`) is the only Customer Support specialist. When he requests leave on November 12, 2026, the system detects a 0/1 staffing gap and allows Devansh Pandey (`EMP-031`) from Pod Delta to be assigned as temporary backup.

---

### 5. How does your system handle conflicting requirements or insufficient staffing?

The system uses a conflict detection and prioritization mechanism.

Conflicts are categorized into:
- `COVERAGE_GAP`: No employee is scheduled during mandatory operating hours.
- `SOLE_RESOURCE_LEAVE`: The only specialist assigned to a brand is unavailable.
- `INSUFFICIENT_STAFFING`: Available employees are fewer than the required minimum.
- `DOUBLE_BOOKING` / `LEAVE_CLASH`: An employee has conflicting assignments or a working override during approved leave.

The system distinguishes between hard constraints and soft preferences:
- **Hard constraints** include approved leave, employee availability, scheduling conflicts, and mandatory staffing requirements.
- **Soft preferences** include preferred weekly offs and resource allocation convenience.

When requirements cannot all be satisfied, the system prioritizes operational coverage while respecting employee availability and approved leave. It highlights unresolved conflicts instead of silently generating an invalid roster. Human intervention is required when no valid staffing solution exists.

---

### 6. Which parts of the process did you automate, and which did you leave under human control? Why?

**Automated processes:**
- Monthly roster generation.
- Employee availability validation.
- Weekly off and leave handling.
- Brand and process coverage calculations.
- Conflict detection and categorization.
- Immediate roster revalidation.
- Coverage status and staffing gap updates.

**Human-controlled processes:**
- Employee leave approval.
- Manual shift overrides.
- Temporary backup assignments.
- Resolution of critical staffing conflicts.
- Final operational approval of the roster.

I automated repetitive and rule-based decisions to reduce manual effort and scheduling errors. However, I retained human control over decisions that require operational judgment, accountability, and coordination between Pod Leads and management.

---

### 7. If the company doubled its team and brand count, what would you change about your solution?

The current implementation is designed to demonstrate the scheduling workflow with 32 employees and 12 brands. If the organization expanded to 500+ employees and 100+ brands, I would make the following improvements:
- **Database optimization**: Use properly indexed PostgreSQL tables, optimized queries, and database-level constraints.
- **Scheduling architecture**: Move from synchronous client-side scheduling to a dedicated backend scheduling service for larger workloads.
- **Advanced optimization**: Introduce constraint-solving algorithms or optimization libraries (like Google OR-Tools) to minimize staffing gaps and balance workloads.
- **Caching**: Use Redis for frequently accessed roster and staffing information.
- **Background processing**: Generate large monthly rosters through asynchronous jobs.
- **Role-based access control**: Introduce more granular permissions for administrators, Pod Leads, and employees.
- **Monitoring**: Add structured logging, performance monitoring, and audit trails for roster changes.

These improvements would make the application more scalable, maintainable, and suitable for enterprise operations.

---

### 8. If you had one additional week to work on this, what would you improve first?

I would prioritize improving the scheduling engine and its conflict-resolution capabilities:
- **Advanced backup recommendations**: Automatically rank eligible backup employees based on process skills, availability, pod capacity, and existing assignments.
- **Fair workload distribution**: Ensure that working days, weekly offs, and assignments are distributed fairly across employees.
- **Automated testing**: Add comprehensive unit and integration tests for roster generation, leave scenarios, and scheduling conflicts.
- **Audit history**: Maintain a record of who modified a roster, what changed, and when it happened.
- **Performance optimization**: Benchmark scheduling performance with larger datasets.
- **Improved reporting**: Add downloadable monthly rosters and coverage reports (CSV / PDF exports).

---

## 📂 File Structure

```
Smart-Roster-Management/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── SummaryCards.tsx         # KPI overview cards
│   │   ├── layout/
│   │   │   ├── Header.tsx               # Month navigation & SLA stats
│   │   │   └── Sidebar.tsx              # View selector & DB status
│   │   ├── modals/
│   │   │   ├── AddLeaveModal.tsx        # Leave scheduler modal
│   │   │   ├── BackupAssignModal.tsx    # 1-click floater assignment
│   │   │   ├── ShiftEditModal.tsx       # Manual shift override editor
│   │   │   └── SupabaseConfigModal.tsx  # Supabase credentials & sync
│   │   └── views/
│   │       ├── AssessmentFaqView.tsx    # Comprehensive 8 questions Q&A
│   │       ├── BrandView.tsx            # Brand SLA coverage matrix
│   │       ├── CompanyRosterView.tsx    # Monthly master roster grid
│   │       ├── ConflictCenterView.tsx   # Conflict triage & alerts
│   │       ├── EmployeeView.tsx         # Individual agent schedule
│   │       ├── PodView.tsx              # Pod lead & capacity hub
│   │       ├── ProcessView.tsx          # CS/ACC/NDR/Retention views
│   │       └── ScenarioDemoView.tsx     # Change handling case study
│   ├── data/
│   │   └── sampleData.ts                # 32 employees, 12 brands, rules
│   ├── lib/
│   │   └── supabaseClient.ts            # Supabase connection client
│   ├── services/
│   │   └── dataService.ts               # Storage & persistence layer
│   ├── types/
│   │   └── index.ts                     # TypeScript definitions
│   ├── utils/
│   │   └── rosterEngine.ts              # Roster & conflict engine
│   ├── App.tsx                          # Main application component
│   ├── index.css                        # Tailwind directives & styles
│   └── main.tsx                         # React entrypoint
├── supabase_schema.sql                  # Production PostgreSQL schema
├── tailwind.config.js                   # Tailwind configuration
├── tsconfig.json                        # TypeScript configuration
├── package.json                         # Project dependencies
└── README.md                            # Complete documentation & answers
```

---

## 🛡️ License
Built for the **DataStraw Internship Assessment**.
All rights reserved.
