import { Pod, Process, Brand, BrandProcessRule, Employee, PublicHoliday, PlannedLeave } from '../types';

export const INITIAL_PODS: Pod[] = [
  {
    id: 'pod-1',
    name: 'Pod Alpha (E-Commerce Titans)',
    leadId: 'EMP-001',
    leadName: 'Aarav Sharma',
    color: 'emerald',
    description: 'Specializes in high-velocity D2C consumer goods & Tier-1 brands.',
  },
  {
    id: 'pod-2',
    name: 'Pod Beta (D2C Velocity)',
    leadId: 'EMP-009',
    leadName: 'Rohan Mehra',
    color: 'sky',
    description: 'Handles high-conversion cart recovery, retention, and rapid scaling.',
  },
  {
    id: 'pod-3',
    name: 'Pod Gamma (Omnichannel Care)',
    leadId: 'EMP-017',
    leadName: 'Neha Deshmukh',
    color: 'violet',
    description: 'Logistics, NDR resolution, and multi-channel fulfillment operations.',
  },
  {
    id: 'pod-4',
    name: 'Pod Delta (Rapid Response)',
    leadId: 'EMP-025',
    leadName: 'Kunal Singhania',
    color: 'amber',
    description: 'Critical coverage contingency, cross-brand floaters, and escalations.',
  },
];

export const INITIAL_PROCESSES: Process[] = [
  {
    id: 'proc-cs',
    name: 'Customer Support (CS)',
    code: 'CS',
    description: 'Omnichannel ticket, email, WhatsApp, and live-chat customer inquiry resolution.',
    color: '#0284c7', // Sky blue
  },
  {
    id: 'proc-acc',
    name: 'Abandoned Cart Conversions (ACC)',
    code: 'ACC',
    description: 'High-intent outbound reach-out, checkout drop-off recovery, and discount incentives.',
    color: '#10b981', // Emerald green
  },
  {
    id: 'proc-ndr',
    name: 'Non-Delivery Report (NDR)',
    code: 'NDR',
    description: 'Courier return-to-origin prevention, re-attempt scheduling, and address correction.',
    color: '#f59e0b', // Amber
  },
  {
    id: 'proc-ret',
    name: 'Retention',
    code: 'RET',
    description: 'VIP client engagement, subscription renewals, post-purchase churn reduction.',
    color: '#8b5cf6', // Violet
  },
];

// 12 Fictional Brands
// ~83% (10 of 12) are single-resource brands; 2 are multi-resource brands (Lumina Skin & SwiftCart)
export const INITIAL_BRANDS: Brand[] = [
  // Multi-Resource Brands (~20%)
  {
    id: 'brand-1',
    name: 'Lumina Skin',
    tier: 'Enterprise',
    category: 'Clean Beauty & Skincare',
    isSingleResource: false,
    requiredProcesses: ['proc-cs', 'proc-acc', 'proc-ndr', 'proc-ret'],
    primaryPodId: 'pod-1',
  },
  {
    id: 'brand-2',
    name: 'SwiftCart Grocery',
    tier: 'Enterprise',
    category: 'Hyperlocal Quick Commerce',
    isSingleResource: false,
    requiredProcesses: ['proc-cs', 'proc-acc', 'proc-ndr'],
    primaryPodId: 'pod-3',
  },

  // Single-Resource Brands (~80%)
  {
    id: 'brand-3',
    name: 'Bolt Electric',
    tier: 'Growth',
    category: 'EV Mobility & Accessories',
    isSingleResource: true,
    requiredProcesses: ['proc-cs', 'proc-acc'],
    primaryPodId: 'pod-1',
  },
  {
    id: 'brand-4',
    name: 'Zest Organics',
    tier: 'Growth',
    category: 'Cold-Pressed Juices & Superfoods',
    isSingleResource: true,
    requiredProcesses: ['proc-cs', 'proc-ret'],
    primaryPodId: 'pod-2',
  },
  {
    id: 'brand-5',
    name: 'Apex Gear',
    tier: 'Essential',
    category: 'Outdoor & Performance Apparel',
    isSingleResource: true,
    requiredProcesses: ['proc-cs', 'proc-ndr'],
    primaryPodId: 'pod-1', // Key brand for scenario test!
  },
  {
    id: 'brand-6',
    name: 'Novva Health',
    tier: 'Growth',
    category: 'Nutraceuticals & Daily Supplements',
    isSingleResource: true,
    requiredProcesses: ['proc-cs', 'proc-acc'],
    primaryPodId: 'pod-2',
  },
  {
    id: 'brand-7',
    name: 'Velox Footwear',
    tier: 'Essential',
    category: 'Ergonomic Running Shoes',
    isSingleResource: true,
    requiredProcesses: ['proc-cs', 'proc-ndr'],
    primaryPodId: 'pod-3',
  },
  {
    id: 'brand-8',
    name: 'ZenBrew Coffee',
    tier: 'Essential',
    category: 'Artisanal Single-Origin Coffee',
    isSingleResource: true,
    requiredProcesses: ['proc-cs', 'proc-acc'],
    primaryPodId: 'pod-2',
  },
  {
    id: 'brand-9',
    name: 'UrbanPulse Wear',
    tier: 'Essential',
    category: 'Streetwear & Denim',
    isSingleResource: true,
    requiredProcesses: ['proc-cs', 'proc-ndr'],
    primaryPodId: 'pod-3',
  },
  {
    id: 'brand-10',
    name: 'TerraLiving Decor',
    tier: 'Growth',
    category: 'Sustainable Home Furnishing',
    isSingleResource: true,
    requiredProcesses: ['proc-cs', 'proc-ret'],
    primaryPodId: 'pod-4',
  },
  {
    id: 'brand-11',
    name: 'Kura Pets',
    tier: 'Essential',
    category: 'Holistic Pet Nutrition & Toys',
    isSingleResource: true,
    requiredProcesses: ['proc-cs', 'proc-acc'],
    primaryPodId: 'pod-4',
  },
  {
    id: 'brand-12',
    name: 'AeroFit Smartgear',
    tier: 'Growth',
    category: 'Fitness Wearables & IoT Bands',
    isSingleResource: true,
    requiredProcesses: ['proc-cs', 'proc-ndr'],
    primaryPodId: 'pod-4',
  },
];

// Brand Process Working Rules:
// 1. 365-day operations
// 2. All days except public holidays
// 3. All days except Sundays and public holidays
// Different rules for different processes within the same brand!
export const INITIAL_RULES: BrandProcessRule[] = [
  // Brand 1: Lumina Skin (Multi-process, different rules within same brand)
  { id: 'rule-b1-cs', brandId: 'brand-1', processId: 'proc-cs', operatingRule: '365_DAYS', minStaffRequired: 1, shiftHours: '24x7 Coverage' },
  { id: 'rule-b1-acc', brandId: 'brand-1', processId: 'proc-acc', operatingRule: 'ALL_EXCEPT_HOLIDAYS', minStaffRequired: 1, shiftHours: '10:00 - 19:00' },
  { id: 'rule-b1-ndr', brandId: 'brand-1', processId: 'proc-ndr', operatingRule: 'ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS', minStaffRequired: 1, shiftHours: '09:00 - 18:00' },
  { id: 'rule-b1-ret', brandId: 'brand-1', processId: 'proc-ret', operatingRule: 'ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS', minStaffRequired: 1, shiftHours: '10:00 - 18:00' },

  // Brand 2: SwiftCart Grocery
  { id: 'rule-b2-cs', brandId: 'brand-2', processId: 'proc-cs', operatingRule: '365_DAYS', minStaffRequired: 1, shiftHours: '07:00 - 23:00' },
  { id: 'rule-b2-acc', brandId: 'brand-2', processId: 'proc-acc', operatingRule: '365_DAYS', minStaffRequired: 1, shiftHours: '09:00 - 21:00' },
  { id: 'rule-b2-ndr', brandId: 'brand-2', processId: 'proc-ndr', operatingRule: 'ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS', minStaffRequired: 1, shiftHours: '08:00 - 17:00' },

  // Brand 3: Bolt Electric (Single-resource brand)
  { id: 'rule-b3-cs', brandId: 'brand-3', processId: 'proc-cs', operatingRule: 'ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS', minStaffRequired: 1, shiftHours: '09:30 - 18:30' },
  { id: 'rule-b3-acc', brandId: 'brand-3', processId: 'proc-acc', operatingRule: 'ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS', minStaffRequired: 1, shiftHours: '10:00 - 19:00' },

  // Brand 4: Zest Organics (Single-resource brand)
  { id: 'rule-b4-cs', brandId: 'brand-4', processId: 'proc-cs', operatingRule: 'ALL_EXCEPT_HOLIDAYS', minStaffRequired: 1, shiftHours: '09:00 - 18:00' },
  { id: 'rule-b4-ret', brandId: 'brand-4', processId: 'proc-ret', operatingRule: 'ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS', minStaffRequired: 1, shiftHours: '10:00 - 18:00' },

  // Brand 5: Apex Gear (CRITICAL TEST BRAND: 365-day CS requirement, single resource assigned!)
  { id: 'rule-b5-cs', brandId: 'brand-5', processId: 'proc-cs', operatingRule: '365_DAYS', minStaffRequired: 1, shiftHours: '09:00 - 21:00' },
  { id: 'rule-b5-ndr', brandId: 'brand-5', processId: 'proc-ndr', operatingRule: 'ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS', minStaffRequired: 1, shiftHours: '09:00 - 18:00' },

  // Brand 6: Novva Health
  { id: 'rule-b6-cs', brandId: 'brand-6', processId: 'proc-cs', operatingRule: 'ALL_EXCEPT_HOLIDAYS', minStaffRequired: 1, shiftHours: '09:00 - 19:00' },
  { id: 'rule-b6-acc', brandId: 'brand-6', processId: 'proc-acc', operatingRule: 'ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS', minStaffRequired: 1, shiftHours: '10:00 - 19:00' },

  // Brand 7: Velox Footwear
  { id: 'rule-b7-cs', brandId: 'brand-7', processId: 'proc-cs', operatingRule: 'ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS', minStaffRequired: 1, shiftHours: '09:00 - 18:00' },
  { id: 'rule-b7-ndr', brandId: 'brand-7', processId: 'proc-ndr', operatingRule: 'ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS', minStaffRequired: 1, shiftHours: '09:00 - 18:00' },

  // Brand 8: ZenBrew Coffee
  { id: 'rule-b8-cs', brandId: 'brand-8', processId: 'proc-cs', operatingRule: 'ALL_EXCEPT_HOLIDAYS', minStaffRequired: 1, shiftHours: '08:00 - 17:00' },
  { id: 'rule-b8-acc', brandId: 'brand-8', processId: 'proc-acc', operatingRule: 'ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS', minStaffRequired: 1, shiftHours: '10:00 - 18:00' },

  // Brand 9: UrbanPulse Wear
  { id: 'rule-b9-cs', brandId: 'brand-9', processId: 'proc-cs', operatingRule: 'ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS', minStaffRequired: 1, shiftHours: '10:00 - 19:00' },
  { id: 'rule-b9-ndr', brandId: 'brand-9', processId: 'proc-ndr', operatingRule: 'ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS', minStaffRequired: 1, shiftHours: '09:00 - 18:00' },

  // Brand 10: TerraLiving Decor
  { id: 'rule-b10-cs', brandId: 'brand-10', processId: 'proc-cs', operatingRule: 'ALL_EXCEPT_HOLIDAYS', minStaffRequired: 1, shiftHours: '09:30 - 18:30' },
  { id: 'rule-b10-ret', brandId: 'brand-10', processId: 'proc-ret', operatingRule: 'ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS', minStaffRequired: 1, shiftHours: '10:00 - 18:00' },

  // Brand 11: Kura Pets
  { id: 'rule-b11-cs', brandId: 'brand-11', processId: 'proc-cs', operatingRule: '365_DAYS', minStaffRequired: 1, shiftHours: '09:00 - 20:00' },
  { id: 'rule-b11-acc', brandId: 'brand-11', processId: 'proc-acc', operatingRule: 'ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS', minStaffRequired: 1, shiftHours: '10:00 - 19:00' },

  // Brand 12: AeroFit Smartgear
  { id: 'rule-b12-cs', brandId: 'brand-12', processId: 'proc-cs', operatingRule: 'ALL_EXCEPT_HOLIDAYS', minStaffRequired: 1, shiftHours: '09:00 - 18:00' },
  { id: 'rule-b12-ndr', brandId: 'brand-12', processId: 'proc-ndr', operatingRule: 'ALL_EXCEPT_SUNDAYS_AND_HOLIDAYS', minStaffRequired: 1, shiftHours: '09:00 - 18:00' },
];

// 32 Employees (at least 30 required) across 4 Pods
export const INITIAL_EMPLOYEES: Employee[] = [
  // --- POD ALPHA (8 Employees) ---
  {
    id: 'EMP-001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@datastraw.io',
    podId: 'pod-1',
    role: 'Pod Lead',
    weeklyOffDays: [0], // Sunday
    leaveBalance: 16,
    compOffBalance: 2,
    assignedBrandIds: ['brand-1'],
    assignedProcessIds: ['proc-cs', 'proc-ret'],
  },
  {
    id: 'EMP-002',
    name: 'Priya Iyer',
    email: 'priya.iyer@datastraw.io',
    podId: 'pod-1',
    role: 'Senior Agent',
    weeklyOffDays: [0], // Sunday
    leaveBalance: 14,
    compOffBalance: 1,
    assignedBrandIds: ['brand-1'],
    assignedProcessIds: ['proc-cs', 'proc-acc'],
  },
  {
    id: 'EMP-003',
    name: 'Rohan Joshi',
    email: 'rohan.joshi@datastraw.io',
    podId: 'pod-1',
    role: 'Agent',
    weeklyOffDays: [1], // Monday (staggered off for weekend coverage!)
    leaveBalance: 18,
    compOffBalance: 0,
    assignedBrandIds: ['brand-1'],
    assignedProcessIds: ['proc-cs', 'proc-ndr'],
  },
  {
    id: 'EMP-004',
    name: 'Vikram Rao', // Sole resource for Apex Gear!
    email: 'vikram.rao@datastraw.io',
    podId: 'pod-1',
    role: 'Agent',
    weeklyOffDays: [0], // Sunday
    leaveBalance: 12,
    compOffBalance: 1,
    assignedBrandIds: ['brand-5'], // Apex Gear
    assignedProcessIds: ['proc-cs', 'proc-ndr'],
  },
  {
    id: 'EMP-005',
    name: 'Ananya Verma',
    email: 'ananya.verma@datastraw.io',
    podId: 'pod-1',
    role: 'Agent',
    weeklyOffDays: [0],
    leaveBalance: 15,
    compOffBalance: 0,
    assignedBrandIds: ['brand-3'], // Bolt Electric
    assignedProcessIds: ['proc-cs', 'proc-acc'],
  },
  {
    id: 'EMP-006',
    name: 'Kabir Patel',
    email: 'kabir.patel@datastraw.io',
    podId: 'pod-1',
    role: 'Agent',
    weeklyOffDays: [0],
    leaveBalance: 20,
    compOffBalance: 3,
    assignedBrandIds: ['brand-1', 'brand-3'], // Overlapping brands!
    assignedProcessIds: ['proc-acc'],
  },
  {
    id: 'EMP-007',
    name: 'Meera Nair',
    email: 'meera.nair@datastraw.io',
    podId: 'pod-1',
    role: 'Specialist',
    weeklyOffDays: [0],
    leaveBalance: 14,
    compOffBalance: 1,
    assignedBrandIds: ['brand-1'],
    assignedProcessIds: ['proc-ret'],
  },
  {
    id: 'EMP-008',
    name: 'Arjun Das',
    email: 'arjun.das@datastraw.io',
    podId: 'pod-1',
    role: 'Agent',
    weeklyOffDays: [0],
    leaveBalance: 17,
    compOffBalance: 0,
    assignedBrandIds: ['brand-3'],
    assignedProcessIds: ['proc-ndr'],
  },

  // --- POD BETA (8 Employees) ---
  {
    id: 'EMP-009',
    name: 'Rohan Mehra',
    email: 'rohan.mehra@datastraw.io',
    podId: 'pod-2',
    role: 'Pod Lead',
    weeklyOffDays: [0],
    leaveBalance: 15,
    compOffBalance: 2,
    assignedBrandIds: ['brand-4'], // Zest Organics
    assignedProcessIds: ['proc-cs', 'proc-ret'],
  },
  {
    id: 'EMP-010',
    name: 'Sneha Kapoor',
    email: 'sneha.kapoor@datastraw.io',
    podId: 'pod-2',
    role: 'Senior Agent',
    weeklyOffDays: [0],
    leaveBalance: 13,
    compOffBalance: 1,
    assignedBrandIds: ['brand-6'], // Novva Health
    assignedProcessIds: ['proc-cs', 'proc-acc'],
  },
  {
    id: 'EMP-011',
    name: 'Tanvi Sen',
    email: 'tanvi.sen@datastraw.io',
    podId: 'pod-2',
    role: 'Agent',
    weeklyOffDays: [0],
    leaveBalance: 18,
    compOffBalance: 0,
    assignedBrandIds: ['brand-8'], // ZenBrew Coffee
    assignedProcessIds: ['proc-cs', 'proc-acc'],
  },
  {
    id: 'EMP-012',
    name: 'Karthik Pillai',
    email: 'karthik.pillai@datastraw.io',
    podId: 'pod-2',
    role: 'Agent',
    weeklyOffDays: [1], // Monday
    leaveBalance: 16,
    compOffBalance: 2,
    assignedBrandIds: ['brand-4', 'brand-6'], // Multi-brand
    assignedProcessIds: ['proc-acc'],
  },
  {
    id: 'EMP-013',
    name: 'Divya Nambiar',
    email: 'divya.nambiar@datastraw.io',
    podId: 'pod-2',
    role: 'Agent',
    weeklyOffDays: [0],
    leaveBalance: 14,
    compOffBalance: 1,
    assignedBrandIds: ['brand-8'],
    assignedProcessIds: ['proc-cs'],
  },
  {
    id: 'EMP-014',
    name: 'Aditya Chawla',
    email: 'aditya.chawla@datastraw.io',
    podId: 'pod-2',
    role: 'Specialist',
    weeklyOffDays: [0],
    leaveBalance: 19,
    compOffBalance: 0,
    assignedBrandIds: ['brand-4'],
    assignedProcessIds: ['proc-ret'],
  },
  {
    id: 'EMP-015',
    name: 'Pooja Hegde',
    email: 'pooja.hegde@datastraw.io',
    podId: 'pod-2',
    role: 'Agent',
    weeklyOffDays: [2], // Tuesday
    leaveBalance: 11,
    compOffBalance: 1,
    assignedBrandIds: ['brand-6'],
    assignedProcessIds: ['proc-cs'],
  },
  {
    id: 'EMP-016',
    name: 'Manish Rawat',
    email: 'manish.rawat@datastraw.io',
    podId: 'pod-2',
    role: 'Agent',
    weeklyOffDays: [0],
    leaveBalance: 17,
    compOffBalance: 0,
    assignedBrandIds: ['brand-8'],
    assignedProcessIds: ['proc-acc'],
  },

  // --- POD GAMMA (8 Employees) ---
  {
    id: 'EMP-017',
    name: 'Neha Deshmukh',
    email: 'neha.deshmukh@datastraw.io',
    podId: 'pod-3',
    role: 'Pod Lead',
    weeklyOffDays: [0],
    leaveBalance: 15,
    compOffBalance: 2,
    assignedBrandIds: ['brand-2'], // SwiftCart
    assignedProcessIds: ['proc-cs', 'proc-ndr'],
  },
  {
    id: 'EMP-018',
    name: 'Sameer Kulkarni',
    email: 'sameer.kulkarni@datastraw.io',
    podId: 'pod-3',
    role: 'Senior Agent',
    weeklyOffDays: [0],
    leaveBalance: 12,
    compOffBalance: 1,
    assignedBrandIds: ['brand-2'], // SwiftCart
    assignedProcessIds: ['proc-acc', 'proc-ndr'],
  },
  {
    id: 'EMP-019',
    name: 'Varun Bhatia',
    email: 'varun.bhatia@datastraw.io',
    podId: 'pod-3',
    role: 'Agent',
    weeklyOffDays: [1], // Monday
    leaveBalance: 19,
    compOffBalance: 0,
    assignedBrandIds: ['brand-2'],
    assignedProcessIds: ['proc-cs'],
  },
  {
    id: 'EMP-020',
    name: 'Ishita Banerjee',
    email: 'ishita.banerjee@datastraw.io',
    podId: 'pod-3',
    role: 'Agent',
    weeklyOffDays: [0],
    leaveBalance: 14,
    compOffBalance: 2,
    assignedBrandIds: ['brand-7'], // Velox Footwear
    assignedProcessIds: ['proc-cs', 'proc-ndr'],
  },
  {
    id: 'EMP-021',
    name: 'Gaurav Sethi',
    email: 'gaurav.sethi@datastraw.io',
    podId: 'pod-3',
    role: 'Agent',
    weeklyOffDays: [0],
    leaveBalance: 16,
    compOffBalance: 0,
    assignedBrandIds: ['brand-9'], // UrbanPulse Wear
    assignedProcessIds: ['proc-cs', 'proc-ndr'],
  },
  {
    id: 'EMP-022',
    name: 'Ritu Saxena',
    email: 'ritu.saxena@datastraw.io',
    podId: 'pod-3',
    role: 'Specialist',
    weeklyOffDays: [0],
    leaveBalance: 18,
    compOffBalance: 1,
    assignedBrandIds: ['brand-2', 'brand-7'],
    assignedProcessIds: ['proc-ndr'],
  },
  {
    id: 'EMP-023',
    name: 'Nikhil Chauhan',
    email: 'nikhil.chauhan@datastraw.io',
    podId: 'pod-3',
    role: 'Agent',
    weeklyOffDays: [0],
    leaveBalance: 15,
    compOffBalance: 0,
    assignedBrandIds: ['brand-9'],
    assignedProcessIds: ['proc-cs'],
  },
  {
    id: 'EMP-024',
    name: 'Shalini Gupta',
    email: 'shalini.gupta@datastraw.io',
    podId: 'pod-3',
    role: 'Agent',
    weeklyOffDays: [6], // Saturday
    leaveBalance: 13,
    compOffBalance: 1,
    assignedBrandIds: ['brand-2'],
    assignedProcessIds: ['proc-cs', 'proc-acc'],
  },

  // --- POD DELTA (8 Employees) ---
  {
    id: 'EMP-025',
    name: 'Kunal Singhania',
    email: 'kunal.singhania@datastraw.io',
    podId: 'pod-4',
    role: 'Pod Lead',
    weeklyOffDays: [0],
    leaveBalance: 14,
    compOffBalance: 3,
    assignedBrandIds: ['brand-10'], // TerraLiving
    assignedProcessIds: ['proc-cs', 'proc-ret'],
  },
  {
    id: 'EMP-026',
    name: 'Bhavna Menon',
    email: 'bhavna.menon@datastraw.io',
    podId: 'pod-4',
    role: 'Senior Agent',
    weeklyOffDays: [0],
    leaveBalance: 12,
    compOffBalance: 1,
    assignedBrandIds: ['brand-11'], // Kura Pets
    assignedProcessIds: ['proc-cs', 'proc-acc'],
  },
  {
    id: 'EMP-027',
    name: 'Harsh Vardhan',
    email: 'harsh.vardhan@datastraw.io',
    podId: 'pod-4',
    role: 'Agent',
    weeklyOffDays: [0],
    leaveBalance: 17,
    compOffBalance: 0,
    assignedBrandIds: ['brand-12'], // AeroFit Smartgear
    assignedProcessIds: ['proc-cs', 'proc-ndr'],
  },
  {
    id: 'EMP-028',
    name: 'Deepika Nair',
    email: 'deepika.nair@datastraw.io',
    podId: 'pod-4',
    role: 'Agent',
    weeklyOffDays: [1], // Monday
    leaveBalance: 15,
    compOffBalance: 2,
    assignedBrandIds: ['brand-10', 'brand-11'],
    assignedProcessIds: ['proc-cs'],
  },
  {
    id: 'EMP-029',
    name: 'Siddharth Roy',
    email: 'siddharth.roy@datastraw.io',
    podId: 'pod-4',
    role: 'Specialist',
    weeklyOffDays: [0],
    leaveBalance: 19,
    compOffBalance: 1,
    assignedBrandIds: ['brand-12'],
    assignedProcessIds: ['proc-cs', 'proc-ndr'],
  },
  {
    id: 'EMP-030',
    name: 'Tanya Malhotra',
    email: 'tanya.malhotra@datastraw.io',
    podId: 'pod-4',
    role: 'Agent',
    weeklyOffDays: [0],
    leaveBalance: 16,
    compOffBalance: 0,
    assignedBrandIds: ['brand-10'],
    assignedProcessIds: ['proc-ret'],
  },
  {
    id: 'EMP-031',
    name: 'Devansh Pandey', // Floating agent for cross-pod coverage!
    email: 'devansh.pandey@datastraw.io',
    podId: 'pod-4',
    role: 'Agent',
    weeklyOffDays: [0],
    leaveBalance: 20,
    compOffBalance: 1,
    assignedBrandIds: ['brand-11', 'brand-12'],
    assignedProcessIds: ['proc-cs', 'proc-acc', 'proc-ndr'],
  },
  {
    id: 'EMP-032',
    name: 'Kavita Reddy',
    email: 'kavita.reddy@datastraw.io',
    podId: 'pod-4',
    role: 'Agent',
    weeklyOffDays: [6], // Saturday
    leaveBalance: 14,
    compOffBalance: 2,
    assignedBrandIds: ['brand-10', 'brand-12'],
    assignedProcessIds: ['proc-cs'],
  },
];

// Public Holidays (Sample Gazetted Indian / Global Corporate Holidays for 2026)
export const INITIAL_HOLIDAYS: PublicHoliday[] = [
  { id: 'hol-1', date: '2026-01-26', name: 'Republic Day', isMandatory: true },
  { id: 'hol-2', date: '2026-03-25', name: 'Holi', isMandatory: true },
  { id: 'hol-3', date: '2026-05-01', name: 'Labour Day / Maharashtra Day', isMandatory: false },
  { id: 'hol-4', date: '2026-08-15', name: 'Independence Day', isMandatory: true },
  { id: 'hol-5', date: '2026-10-02', name: 'Mahatma Gandhi Jayanti', isMandatory: true },
  { id: 'hol-6', date: '2026-11-08', name: 'Diwali (Deepavali)', isMandatory: true },
  { id: 'hol-7', date: '2026-11-24', name: 'Guru Nanak Jayanti', isMandatory: false },
  { id: 'hol-8', date: '2026-12-25', name: 'Christmas Day', isMandatory: true },
];

// Seeded Planned Leaves to demonstrate real roster conditions and the assessment scenario
export const INITIAL_LEAVES: PlannedLeave[] = [
  // THE KEY ASSESSMENT SCENARIO LEAVE:
  // Vikram Rao (EMP-004), who is the ONLY resource for Apex Gear (brand-5), requests leave on a required working day (e.g., Nov 12, 2026 - Thursday)
  {
    id: 'leave-scenario-test',
    employeeId: 'EMP-004', // Vikram Rao
    date: '2026-11-12',    // A Thursday (Mandatory 365-day operation day for Apex Gear CS!)
    type: 'ANNUAL',
    status: 'APPROVED',
    reason: 'Family wedding attendance in Jaipur',
  },

  // Other realistic leaves for variety
  {
    id: 'leave-2',
    employeeId: 'EMP-002', // Priya Iyer (Lumina Skin CS - multi-resource brand)
    date: '2026-11-05',
    type: 'CASUAL',
    status: 'APPROVED',
    reason: 'Personal urgent appointment',
  },
  {
    id: 'leave-3',
    employeeId: 'EMP-006', // Kabir Patel
    date: '2026-11-18',
    type: 'COMP_OFF',
    status: 'APPROVED',
    reason: 'Comp-off utilized for previous weekend shift',
  },
  {
    id: 'leave-4',
    employeeId: 'EMP-011', // Tanvi Sen (ZenBrew Coffee - single resource)
    date: '2026-11-20',
    type: 'SICK',
    status: 'APPROVED',
    reason: 'Medical recovery leave',
  },
  {
    id: 'leave-5',
    employeeId: 'EMP-020', // Ishita Banerjee (Velox Footwear)
    date: '2026-11-14',
    type: 'ANNUAL',
    status: 'APPROVED',
    reason: 'Annual family festival leave',
  },
];
