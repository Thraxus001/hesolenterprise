// src/utils/constants.js

export const CATEGORIES = {
  TEXTBOOKS: 'textbooks-story-books',
  STATIONERY: 'stationery-office-supplies',
  LAB_EQUIPMENT: 'lab-equipment-chemicals',
  COMPUTER_ICT: 'computer-ict-accessories'
};

export const CATEGORY_NAMES = {
  [CATEGORIES.TEXTBOOKS]: 'Textbooks & Story Books',
  [CATEGORIES.STATIONERY]: 'Stationery & Office Supplies',
  [CATEGORIES.LAB_EQUIPMENT]: 'Laboratory Equipment & Chemicals',
  [CATEGORIES.COMPUTER_ICT]: 'Computer & ICT Accessories'
};

export const CATEGORY_ICONS = {
  [CATEGORIES.TEXTBOOKS]: 'MenuBook',
  [CATEGORIES.STATIONERY]: 'Create',
  [CATEGORIES.LAB_EQUIPMENT]: 'Science',
  [CATEGORIES.COMPUTER_ICT]: 'Computer'
};

// New Product Schema Constants
export const PRODUCT_CATEGORIES = [
  {
    id: 'cbc',
    label: 'CBC Curriculum',
    subcategories: [
      { id: 'pre-primary', label: 'Pre-Primary', grades: ['pp1', 'pp2'] },
      { id: 'lower-primary', label: 'Lower Primary', grades: ['grade-1-3'] },
      { id: 'middle-school', label: 'Middle School', grades: ['grade-4-6'] },
      { id: 'junior-school', label: 'Junior School', grades: ['grade-7-9'] },
      { id: 'religious', label: 'Religious Education', grades: ['grade-1-3', 'grade-4-6', 'grade-7-9'] }
    ],
    curriculum: 'cbc'
  },
  {
    id: 'old-curriculum',
    label: '8-4-4 Curriculum',
    subcategories: [
      { id: 'secondary', label: 'Secondary School', grades: ['form-1-2', 'form-3-4'] },
      { id: 'religious', label: 'Religious Education', grades: ['form-1-2', 'form-3-4'] }
    ],
    curriculum: '8-4-4'
  },
  {
    id: 'story-books',
    label: 'Storybooks & Readers',
    subcategories: [
      { id: 'readers', label: 'Graded Readers', grades: ['pp1', 'grade-1-3', 'grade-4-6'] },
      { id: 'set-books', label: 'Set Books', grades: ['form-3-4'] },
      { id: 'general', label: 'General Fiction' }
    ]
  },
  {
    id: 'stationery',
    label: 'Stationery',
    subcategories: [
      { id: 'writing', label: 'Writing Instruments' },
      { id: 'notebooks', label: 'Notebooks & Paper' },
      { id: 'office', label: 'Office Supplies' },
      { id: 'art', label: 'Art Supplies' },
      { id: 'specialty', label: 'Specialty Paper' },
      { id: 'administrative', label: 'Administrative & Records' },
      { id: 'diaries', label: 'Diaries & Planners' }
    ]
  },
  {
    id: 'ict',
    label: 'ICT Accessories',
    subcategories: [
      { id: 'storage', label: 'Storage Devices' },
      { id: 'peripherals', label: 'Peripherals (Mouse/Keyboard)' },
      { id: 'input', label: 'Input Devices' },
      { id: 'audio', label: 'Audio & Headsets' },
      { id: 'cables', label: 'Cables & Adapters' },
      { id: 'infrastructure', label: 'Infrastructure & Charging' },
      { id: 'network', label: 'Networking' }
    ]
  },
  {
    id: 'lab-equipment',
    label: 'Lab Equipment',
    subcategories: [
      { id: 'biology', label: 'Biology' },
      { id: 'chemistry', label: 'Chemistry' },
      { id: 'physics', label: 'Physics' },
      { id: 'general', label: 'General Equipment' },
      { id: 'safety', label: 'Safety Gear' }
    ]
  }
];

export const GRADE_LEVELS = [
  { id: 'pp1', label: 'PP1' },
  { id: 'pp2', label: 'PP2' },
  { id: 'grade-1-3', label: 'Grade 1-3' },
  { id: 'grade-4-6', label: 'Grade 4-6' },
  { id: 'grade-7-9', label: 'Grade 7-9' },
  { id: 'form-1-2', label: 'Form 1-2' },
  { id: 'form-3-4', label: 'Form 3-4' }
];

export const CURRICULUMS = [
  { id: 'cbc', label: 'CBC' },
  { id: '8-4-4', label: '8-4-4' }
];

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const PAYMENT_METHODS = {
  MPESA: 'mpesa',
  CARD: 'card',
  CASH: 'cash_on_delivery'
};

export const SHIPPING_METHODS = [
  { id: 'standard', name: 'Standard Delivery', price: 200, duration: '3-5 days' },
  { id: 'express', name: 'Express Delivery', price: 500, duration: '1-2 days' }
];

export const TAX_RATE = 0.16; // 16% VAT for Kenya