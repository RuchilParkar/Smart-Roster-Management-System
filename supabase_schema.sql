-- ==============================================================================
-- SMART ROSTER MANAGEMENT SYSTEM - DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- DataStraw Operations & Roster Architecture
-- ==============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PODS TABLE
CREATE TABLE IF NOT EXISTS pods (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lead_id VARCHAR(50),
    lead_name VARCHAR(255) NOT NULL,
    color VARCHAR(50) DEFAULT 'emerald',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROCESSES TABLE
CREATE TABLE IF NOT EXISTS processes (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(50) DEFAULT '#0284c7',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BRANDS TABLE
CREATE TABLE IF NOT EXISTS brands (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tier VARCHAR(50) DEFAULT 'Growth' CHECK (tier IN ('Enterprise', 'Growth', 'Essential')),
    category VARCHAR(100),
    is_single_resource BOOLEAN DEFAULT TRUE,
    required_processes TEXT[] NOT NULL,
    primary_pod_id VARCHAR(50) REFERENCES pods(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EMPLOYEES TABLE
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    pod_id VARCHAR(50) REFERENCES pods(id) ON DELETE RESTRICT,
    role VARCHAR(50) DEFAULT 'Agent' CHECK (role IN ('Agent', 'Senior Agent', 'Pod Lead', 'Specialist')),
    weekly_off_days INT[] DEFAULT '{0}', -- 0=Sunday, 1=Monday...
    leave_balance INT DEFAULT 18,
    comp_off_balance INT DEFAULT 0,
    assigned_brand_ids TEXT[] DEFAULT '{}',
    assigned_process_ids TEXT[] DEFAULT '{}',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BRAND PROCESS OPERATING RULES TABLE
CREATE TABLE IF NOT EXISTS brand_process_rules (
    id VARCHAR(100) PRIMARY KEY,
    brand_id VARCHAR(50) REFERENCES brands(id) ON DELETE CASCADE,
    process_id VARCHAR(50) REFERENCES processes(id) ON DELETE CASCADE,
    operating_rule VARCHAR(50) NOT NULL CHECK (operating_rule IN ('365_DAYS', 'ALL_EXCEPT_HOLIDAYS', 'ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS')),
    min_staff_required INT DEFAULT 1 CHECK (min_staff_required >= 1),
    shift_hours VARCHAR(100) DEFAULT '09:00 - 18:00',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (brand_id, process_id)
);

-- 6. PUBLIC HOLIDAYS TABLE
CREATE TABLE IF NOT EXISTS public_holidays (
    id VARCHAR(50) PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    is_mandatory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PLANNED LEAVES TABLE
CREATE TABLE IF NOT EXISTS planned_leaves (
    id VARCHAR(100) PRIMARY KEY,
    employee_id VARCHAR(50) REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    type VARCHAR(50) DEFAULT 'ANNUAL' CHECK (type IN ('ANNUAL', 'SICK', 'CASUAL', 'COMP_OFF')),
    status VARCHAR(50) DEFAULT 'APPROVED' CHECK (status IN ('APPROVED', 'PENDING', 'REJECTED')),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (employee_id, date)
);

-- 8. ROSTER OVERRIDES (MANUAL SHIFT EDITS & BACKUP ASSIGNMENTS)
CREATE TABLE IF NOT EXISTS roster_overrides (
    id VARCHAR(100) PRIMARY KEY,
    employee_id VARCHAR(50) REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('WORKING', 'WEEKLY_OFF', 'LEAVE', 'COMP_OFF', 'PUBLIC_HOLIDAY_OFF')),
    backup_for_brand_id VARCHAR(50) REFERENCES brands(id) ON DELETE SET NULL,
    backup_for_process_id VARCHAR(50) REFERENCES processes(id) ON DELETE SET NULL,
    notes TEXT,
    updated_by VARCHAR(255) DEFAULT 'Operations Manager',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (employee_id, date)
);

-- INDEXES FOR FAST PERFORMANCE ON ROSTER QUERIES
CREATE INDEX IF NOT EXISTS idx_employees_pod ON employees(pod_id);
CREATE INDEX IF NOT EXISTS idx_brand_rules_brand ON brand_process_rules(brand_id);
CREATE INDEX IF NOT EXISTS idx_brand_rules_proc ON brand_process_rules(process_id);
CREATE INDEX IF NOT EXISTS idx_planned_leaves_date ON planned_leaves(date);
CREATE INDEX IF NOT EXISTS idx_planned_leaves_emp ON planned_leaves(employee_id);
CREATE INDEX IF NOT EXISTS idx_roster_overrides_date ON roster_overrides(date);
CREATE INDEX IF NOT EXISTS idx_roster_overrides_emp ON roster_overrides(employee_id);

-- ENABLE ROW LEVEL SECURITY (RLS) FOR PRODUCTION READINESS
ALTER TABLE pods ENABLE ROW LEVEL SECURITY;
ALTER TABLE processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_process_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE planned_leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE roster_overrides ENABLE ROW LEVEL SECURITY;

-- Anonymous read/write policy for dashboard demo purposes (can be restricted in production)
CREATE POLICY "Allow public read on pods" ON pods FOR SELECT USING (true);
CREATE POLICY "Allow public write on pods" ON pods FOR ALL USING (true);

CREATE POLICY "Allow public read on processes" ON processes FOR SELECT USING (true);
CREATE POLICY "Allow public write on processes" ON processes FOR ALL USING (true);

CREATE POLICY "Allow public read on brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Allow public write on brands" ON brands FOR ALL USING (true);

CREATE POLICY "Allow public read on employees" ON employees FOR SELECT USING (true);
CREATE POLICY "Allow public write on employees" ON employees FOR ALL USING (true);

CREATE POLICY "Allow public read on brand_process_rules" ON brand_process_rules FOR SELECT USING (true);
CREATE POLICY "Allow public write on brand_process_rules" ON brand_process_rules FOR ALL USING (true);

CREATE POLICY "Allow public read on public_holidays" ON public_holidays FOR SELECT USING (true);
CREATE POLICY "Allow public write on public_holidays" ON public_holidays FOR ALL USING (true);

CREATE POLICY "Allow public read on planned_leaves" ON planned_leaves FOR SELECT USING (true);
CREATE POLICY "Allow public write on planned_leaves" ON planned_leaves FOR ALL USING (true);

CREATE POLICY "Allow public read on roster_overrides" ON roster_overrides FOR SELECT USING (true);
CREATE POLICY "Allow public write on roster_overrides" ON roster_overrides FOR ALL USING (true);
