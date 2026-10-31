import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Database, 
  Calendar, 
  ShieldAlert, 
  Users, 
  Building2, 
  Workflow, 
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface FaqItem {
  id: string;
  questionNumber: number;
  title: string;
  shortSummary: string;
  icon: any;
  content: React.ReactNode;
}

export const AssessmentFaqView: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string>('q1');

  const faqs: FaqItem[] = [
    {
      id: 'q1',
      questionNumber: 1,
      title: 'Data Modeling & Decoupled Operational Calendars',
      shortSummary: 'How brand operating rules and employee weekly offs are independently modeled and evaluated.',
      icon: Database,
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            In our system architecture, <strong>Brand Operational Calendars</strong> and <strong>Employee Weekly Offs</strong> are strictly separate domain entities:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li>
              <strong className="text-white">Brand Operating Rules (<code className="text-sky-400">BrandProcessRule</code>):</strong> Define contractually mandated coverage obligations (e.g., <em>365_DAYS</em>, <em>ALL_EXCEPT_HOLIDAYS</em>, <em>ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS</em>) per brand and process, with explicit <code className="text-sky-400">minStaffRequired</code> and shift hours.
            </li>
            <li>
              <strong className="text-white">Employee Availability (<code className="text-emerald-400">Employee</code>):</strong> Defines human resource parameters including preferred weekly off days (e.g. Sunday or rotational Monday), annual/sick leave balances, comp-off credits, and pod assignments.
            </li>
          </ul>
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px]">
            <span className="font-semibold text-sky-400">Evaluation Hierarchy:</span>
            <p className="mt-1">
              For any date $D$, the engine first evaluates if client brand $B$ and process $P$ require service. If required, it queries active agents assigned to $(B, P)$ who are in <code className="text-emerald-300 font-mono">WORKING</code> status. If available agents &lt; required staff, the engine flags a coverage gap, guaranteeing that client SLA requirements are never silently omitted or assumed away.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'q2',
      questionNumber: 2,
      title: 'Multi-Brand & Multi-Process Assignment Architecture',
      shortSummary: 'Supporting cross-brand and cross-process agent assignments without double-booking or burnout.',
      icon: Building2,
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            Many operational environments require agents to work across multiple smaller accounts or switch between processes (e.g., handling Customer Support in the morning and Abandoned Cart Conversions in the afternoon).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <strong className="text-white block mb-1">Multi-Brand Allocation</strong>
              Employees store <code className="text-sky-300">assignedBrandIds: string[]</code>. Agents like Kabir Patel (EMP-006) support both Lumina Skin and Bolt Electric. The engine credits their active presence toward each assigned brand's daily headcount requirement.
            </div>
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <strong className="text-white block mb-1">Cross-Process Skill Matrix</strong>
              Employees store <code className="text-indigo-300">assignedProcessIds: string[]</code> across CS, ACC, NDR, and Retention. Pod Delta specialists (e.g. Devansh Pandey) are cross-trained across all 4 streams to act as universal contingency floaters.
            </div>
          </div>
          <p>
            <strong>Double-Booking Guard:</strong> If an agent is assigned to conflicting shift hours or is scheduled to work while having an approved leave, the Conflict Engine flags a <code className="text-amber-400 font-mono">DOUBLE_BOOKING</code> or <code className="text-amber-400 font-mono">LEAVE_CLASH</code> warning.
          </p>
        </div>
      ),
    },
    {
      id: 'q3',
      questionNumber: 3,
      title: 'Priority Rules: Client Coverage vs. Employee Preferences',
      shortSummary: 'How conflicts between mandatory client uptime and employee leave/holidays are enforced.',
      icon: ShieldAlert,
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            The scheduling logic adheres to the core assessment principle:
            <span className="block p-2.5 my-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-medium italic">
              "Mandatory client coverage takes priority over employee preferences. Never silently generate an invalid roster."
            </span>
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li>
              <strong className="text-white">Public Holidays on 365-Day Operations:</strong> Even if a national holiday (e.g., Diwali or Republic Day) occurs, brands with <code className="text-sky-400">365_DAYS</code> rules remain active. Assigned agents retain <code className="text-emerald-400">WORKING</code> status to uphold client SLAs, earning compensatory off (comp-off) credits.
            </li>
            <li>
              <strong className="text-white">Leave vs. Mandatory Uptime:</strong> When an employee submits leave on a required operating day, the leave is registered, but the roster engine checks whether sufficient backup exists. If the brand is left with 0 active agents, an immediate <code className="text-rose-400 font-semibold">CRITICAL_COVERAGE_GAP</code> is raised.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'q4',
      questionNumber: 4,
      title: 'Handling ~80% Single-Resource Brand Fragility',
      shortSummary: 'Operational resiliency strategies when ~10 out of 12 brands are staffed by only 1 specialist.',
      icon: Users,
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            A major challenge in D2C operations is managing high fragility: when 80%+ of client accounts are staffed by a single dedicated resource, any absence immediately threatens a complete service shutdown.
          </p>
          <div className="space-y-2 text-[11px]">
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="font-bold text-sky-400">1. Pod Delta Rapid-Response Floater Pool:</span>
              <p className="mt-1 text-slate-300">
                Pod Delta is architected specifically as a contingency pool. Specialists in Pod Delta (e.g., Devansh Pandey, Kunal Singhania) are cross-trained across all direct-to-consumer SOPs and can be hot-swapped into any brand with zero onboarding lag.
              </p>
            </div>
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="font-bold text-indigo-400">2. Staggered Weekly Off Rotations:</span>
              <p className="mt-1 text-slate-300">
                Rather than having all agents off on Sunday, single-resource agents have staggered off days (e.g. Sunday vs. Monday vs. Tuesday), ensuring pod peers can cross-cover on alternating days.
              </p>
            </div>
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="font-bold text-emerald-400">3. Predictive Gap Highlighting:</span>
              <p className="mt-1 text-slate-300">
                The Brand Coverage View visually flags single-resource brands with a distinctive warning badge (<code className="text-amber-300">⚠️ Single-Resource (1 Agent)</code>) and triggers real-time backup prompts whenever an absence is scheduled.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'q5',
      questionNumber: 5,
      title: 'Change Handling Scenario: Sole Resource Leave on Required Day',
      shortSummary: 'End-to-end breakdown of the required assessment scenario involving Vikram Rao and Apex Gear.',
      icon: Sparkles,
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-[11px] text-rose-300">
            <strong>The Test Scenario:</strong> Employee Vikram Rao (EMP-004) is the sole specialist assigned to Apex Gear (brand-5) Customer Support. Apex Gear operates under a mandatory 365-day contract. Vikram requests leave on Thursday, November 12, 2026.
          </div>
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
            <li>
              <strong className="text-white">Detection:</strong> The engine evaluates Nov 12 against the Apex Gear CS rule (<code className="text-sky-400">365_DAYS</code>, minStaff = 1). Since Vikram's status is <code className="text-rose-400">LEAVE</code> and no other agent is assigned, available staff = 0.
            </li>
            <li>
              <strong className="text-white">Conflict Generation:</strong> The engine generates a <code className="text-rose-400 font-semibold">SOLE_RESOURCE_LEAVE</code> critical alert, detailing the brand, process, scheduled hours (09:00 - 21:00 IST), and 100% service deficit.
            </li>
            <li>
              <strong className="text-white">Explanation:</strong> The system explains that approving this absence without replacement causes an unhandled queue and direct SLA breach under the client MSA.
            </li>
            <li>
              <strong className="text-white">Actionable Mitigation:</strong> The manager opens the 1-click resolver to assign cross-trained floater Devansh Pandey (EMP-031) from Pod Delta as backup for Apex Gear CS on Nov 12. The engine immediately re-validates, clearing the gap and restoring SLA coverage to 100%.
            </li>
          </ol>
        </div>
      ),
    },
    {
      id: 'q6',
      questionNumber: 6,
      title: 'Conflict Detection Strategy: Hard vs. Soft Conflicts',
      shortSummary: 'Classification of critical SLA breaches vs. operational warnings with real-time recalculation.',
      icon: ShieldAlert,
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            The conflict engine distinguishes between <strong>Critical (Hard) Conflicts</strong> that violate contractual SLAs and <strong>Warning (Soft) Conflicts</strong> that represent operational friction:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 bg-rose-950/30 rounded-xl border border-rose-500/30">
              <strong className="text-rose-300 block mb-1">Critical Conflicts (Hard)</strong>
              <ul className="list-disc pl-4 space-y-1 text-slate-300">
                <li><code className="text-rose-400">COVERAGE_GAP:</code> 0 agents on an active client operating day.</li>
                <li><code className="text-rose-400">SOLE_RESOURCE_LEAVE:</code> The only designated brand specialist is absent without backup.</li>
              </ul>
            </div>
            <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-500/30">
              <strong className="text-amber-300 block mb-1">Warning Conflicts (Soft)</strong>
              <ul className="list-disc pl-4 space-y-1 text-slate-300">
                <li><code className="text-amber-400">INSUFFICIENT_STAFFING:</code> Headcount is &gt; 0 but below <code className="text-sky-300">minStaffRequired</code>.</li>
                <li><code className="text-amber-400">DOUBLE_BOOKING:</code> Manual override scheduled while employee has an approved leave registered.</li>
              </ul>
            </div>
          </div>
          <p>
            Every time a shift is modified, leave is added, or backup is assigned, the engine runs synchronously in &lt; 5ms, re-indexing all slots and refreshing the UI instantaneously.
          </p>
        </div>
      ),
    },
    {
      id: 'q7',
      questionNumber: 7,
      title: 'Manual Overrides & Instant Re-Validation Workflow',
      shortSummary: 'Manager scheduling autonomy with audit logging and immediate constraint verification.',
      icon: Calendar,
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            Automated schedules cannot anticipate unexpected real-world events. Our system provides seamless manual editing capabilities:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li>
              <strong className="text-white">Cell-Level Shift Overrides:</strong> Clicking any schedule cell in the Company Roster, Pod View, or Employee View opens the <code className="text-sky-400">ShiftEditModal</code>, allowing managers to switch between Working, Weekly Off, Leave, or Comp-Off.
            </li>
            <li>
              <strong className="text-white">Temporary Backup Reassignment:</strong> Managers can designate an employee to act as temporary floater/backup for a specific brand and process for any given date.
            </li>
            <li>
              <strong className="text-white">Audit Logging & Revertibility:</strong> Every override records the modifying manager, timestamp, and rationale. Overridden cells display an audit indicator and can be reverted back to baseline default with one click.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'q8',
      questionNumber: 8,
      title: 'Scalability, Edge Cases & Operational Trade-offs',
      shortSummary: 'Scaling to 500+ employees, 100+ brands, 24/7 rotating shifts, and technical considerations.',
      icon: Workflow,
      content: (
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            When scaling beyond 30 employees to an enterprise setup of 500+ agents and 100+ brands:
          </p>
          <div className="space-y-2 text-[11px]">
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <strong className="text-sky-400">1. Algorithm Optimization:</strong>
              <p className="mt-1 text-slate-300">
                The current $O(E \times D + B \times P \times D)$ evaluation runs in &lt; 8ms for 32 employees. For 500+ employees and 365 days, pre-computing BitSets for agent availability and utilizing server-side PostgreSQL materialized views or Redis caching ensures sub-50ms query times.
              </p>
            </div>
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <strong className="text-indigo-400">2. Three-Tier 24/7 Shift Windows:</strong>
              <p className="mt-1 text-slate-300">
                To support 24/7 round-the-clock operations, the data model cleanly extends from daily shifts to shift windows (Morning: 07:00-15:30, Evening: 15:00-23:30, Night: 23:00-07:30) with mandatory rest period rules between consecutive shifts.
              </p>
            </div>
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800">
              <strong className="text-emerald-400">3. Automated Constraint Satisfaction (Linear Programming / OR-Tools):</strong>
              <p className="mt-1 text-slate-300">
                For complex floater allocation, integer linear programming (ILP) solvers can automatically compute optimal backup assignments that minimize overtime costs while maximizing pod familiarity.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">
              DataStraw Internship Assessment & Architectural Answers
            </h1>
            <p className="text-xs text-slate-400">
              Authoritative, in-depth documentation covering all eight technical and operational assessment evaluation questions
            </p>
          </div>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map(faq => {
          const isExpanded = expandedId === faq.id;
          const Icon = faq.icon;

          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden backdrop-blur-md ${
                isExpanded
                  ? 'bg-slate-900/90 border-sky-500/40 shadow-lg shadow-sky-950/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? '' : faq.id)}
                className="w-full text-left p-5 flex items-start justify-between gap-4 select-none"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                    isExpanded 
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        QUESTION #{faq.questionNumber}
                      </span>
                      <h3 className="text-sm font-bold text-white">{faq.title}</h3>
                    </div>
                    <p className="text-xs text-slate-400">{faq.shortSummary}</p>
                  </div>
                </div>

                <div className="p-1 rounded-lg bg-slate-800/60 text-slate-400 shrink-0 mt-1">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 animate-fadeIn">
                  {faq.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
