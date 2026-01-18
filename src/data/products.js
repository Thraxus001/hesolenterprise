// src/data/products.js
// Add this to your products.js file or create a categories.js file

export const ALL_CATEGORIES = [
  // Educational Products
  { id: 'cbc', name: 'CBC Curriculum', type: 'educational', icon: '🏫' },
  { id: 'old-curriculum', name: 'Old Curriculum (8-4-4)', type: 'educational', icon: '📘' },
  { id: 'story-books', name: 'Story Books', type: 'educational', icon: '📚' },

  // ICT Products
  { id: 'computer-ict', name: 'Computers & ICT', type: 'ict', icon: '💻' },
  { id: 'accessories', name: 'ICT Accessories', type: 'ict', icon: '🖱️' },

  // Lab Equipment
  { id: 'lab-equipment', name: 'Laboratory Equipment', type: 'lab', icon: '🧪' },
  { id: 'chemicals', name: 'Chemicals & Supplies', type: 'lab', icon: '⚗️' },
  { id: 'safety-equipment', name: 'Safety Equipment', type: 'lab', icon: '🛡️' },

  // Stationery
  { id: 'stationery', name: 'Stationery', type: 'stationery', icon: '✏️' },
  { id: 'office-supplies', name: 'Office Supplies', type: 'stationery', icon: '📎' },
  { id: 'art-supplies', name: 'Art Supplies', type: 'stationery', icon: '🎨' }
];


export const GRADE_ORDER = [
  'pp1', 'pp2', 'grade-1-3', 'grade-4-6', 'grade-7-9', 'form-1-2', 'form-3-4'
];
// Add these constants at the top of your products.js file
export const PRODUCT_TYPES = {
  TEXTBOOKS: 'textbooks',
  STORY_BOOKS: 'story-books',
  STATIONERY: 'stationery',
  LAB_EQUIPMENT: 'lab-equipment',
  COMPUTER_ICT: 'computer-ict',
  ACCESSORIES: 'accessories'
};

export const GRADE_LEVELS = {
  PP1: 'pp1',
  PP2: 'pp2',
  GRADE1_3: 'grade-1-3',
  GRADE4_6: 'grade-4-6',
  GRADE7_9: 'grade-7-9',
  FORM1_2: 'form-1-2',
  FORM3_4: 'form-3-4'
};

export const CURRICULUM_TYPES = {
  CBC: 'cbc',
  OLD_844: '8-4-4',
  BOTH: 'both'
};
// src/data/products.js
export const products = [
  // ========== CBC CURRICULUM (PP1 to Grade 9) ==========

  // Pre-Primary 1 (PP1)
  {
    id: 'cbc_pp1_001',
    name: 'Mazingira na Mimi - PP1 Environmental Activities',
    category: 'cbc',
    subcategory: 'pp1',
    grade: 'PP1',
    subject: 'Environmental Activities',
    curriculum: 'CBC',
    price: 1099,
    originalPrice: 1299,
    discount: 15,
    sku: 'CBC-PP1-EA-001',
    description: 'PP1 Environmental Activities book aligned with CBC curriculum.',
    longDescription: 'Covers environmental awareness, hygiene, safety, and care for the environment. Includes colorful illustrations and practical activities.',
    features: [
      'Aligned with CBC curriculum',
      'Colorful illustrations',
      'Practical activities',
      'Parent/Teacher guide included'
    ],
    images: ['/images/products/cbc-pp1-env.jpg'],
    stock: 120,
    inStock: true,
    rating: 4.7,
    reviewCount: 56,
    author: 'CBC Curriculum Designers',
    publisher: 'KICD Approved',
    isbn: '978-9966-25-201-1',
    pages: 80,
    edition: '2024 Edition',
    weight: '0.3 kg',
    ageRange: '4-5 years',
    tags: ['cbc', 'pp1', 'environmental', 'pre-primary', 'kenya'],
    createdAt: '2024-01-10'
  },
  {
    id: 'cbc_pp1_002',
    name: 'Lugha na Mazoezi - PP1 Language Activities',
    category: 'cbc',
    subcategory: 'pp1',
    grade: 'PP1',
    subject: 'Language Activities',
    curriculum: 'CBC',
    price: 1150,
    sku: 'CBC-PP1-LA-001',
    description: 'Language development activities for PP1 learners.',
    longDescription: 'Focuses on listening, speaking, pre-reading and pre-writing skills in English and Kiswahili.',
    features: [
      'Bilingual approach',
      'Phonics introduction',
      'Storytelling activities',
      'Interactive exercises'
    ],
    images: ['/images/products/cbc-pp1-language.jpg'],
    stock: 95,
    inStock: true,
    rating: 4.6,
    reviewCount: 42,
    author: 'Dr. Wanjiku Maina',
    publisher: 'Longhorn Publishers',
    isbn: '978-9966-25-202-8',
    pages: 85,
    edition: '2024 Edition',
    tags: ['cbc', 'pp1', 'language', 'english', 'kiswahili'],
    createdAt: '2024-01-15'
  },

  // Pre-Primary 2 (PP2)
  {
    id: 'cbc_pp2_001',
    name: 'Mathematical Activities for PP2',
    category: 'cbc',
    subcategory: 'pp2',
    grade: 'PP2',
    subject: 'Mathematical Activities',
    curriculum: 'CBC',
    price: 1299,
    originalPrice: 1499,
    discount: 13,
    sku: 'CBC-PP2-MA-001',
    description: 'Introduction to basic mathematical concepts for PP2.',
    longDescription: 'Covers numbers 1-50, shapes, patterns, measurements, and basic problem-solving activities.',
    features: [
      'Number recognition 1-50',
      'Basic shapes and patterns',
      'Measurement activities',
      'Problem-solving exercises'
    ],
    images: ['/images/products/cbc-pp2-math.jpg'],
    stock: 110,
    inStock: true,
    rating: 4.8,
    reviewCount: 67,
    author: 'Mathematics Panel',
    publisher: 'KICD Approved',
    isbn: '978-9966-25-203-5',
    pages: 95,
    edition: '2024 Edition',
    tags: ['cbc', 'pp2', 'mathematics', 'pre-primary'],
    createdAt: '2024-01-20'
  },

  // Grade 1-3 (Lower Primary)
  {
    id: 'cbc_grade1_001',
    name: 'Kiswahili Kitukuzwe - Grade 1',
    category: 'cbc',
    subcategory: 'grade-1-3',
    grade: 'Grade 1',
    subject: 'Kiswahili',
    curriculum: 'CBC',
    price: 1599,
    sku: 'CBC-G1-KS-001',
    description: 'Grade 1 Kiswahili comprehensive textbook.',
    longDescription: 'Covers listening, speaking, reading, and writing skills in Kiswahili. Includes cultural elements.',
    features: [
      'Reading passages',
      'Writing exercises',
      'Cultural content',
      'Assessment activities'
    ],
    images: ['/images/products/cbc-grade1-kiswahili.jpg'],
    stock: 85,
    inStock: true,
    rating: 4.7,
    reviewCount: 89,
    author: 'Swahili Language Panel',
    publisher: 'OUP Kenya',
    isbn: '978-9966-25-204-2',
    pages: 150,
    edition: '2024 Edition',
    tags: ['cbc', 'grade1', 'kiswahili', 'lower-primary'],
    createdAt: '2024-02-01'
  },
  {
    id: 'cbc_grade2_001',
    name: 'English Activities Grade 2',
    category: 'cbc',
    subcategory: 'grade-1-3',
    grade: 'Grade 2',
    subject: 'English',
    curriculum: 'CBC',
    price: 1650,
    sku: 'CBC-G2-EN-001',
    description: 'English language activities for Grade 2 learners.',
    longDescription: 'Develops literacy skills through stories, poems, and practical language use.',
    features: [
      'Phonics development',
      'Reading comprehension',
      'Creative writing',
      'Oral skills'
    ],
    images: ['/images/products/cbc-grade2-english.jpg'],
    stock: 75,
    inStock: true,
    rating: 4.6,
    reviewCount: 54,
    author: 'English Language Panel',
    publisher: 'Longhorn Publishers',
    isbn: '978-9966-25-205-9',
    pages: 160,
    edition: '2024 Edition',
    tags: ['cbc', 'grade2', 'english', 'language'],
    createdAt: '2024-02-05'
  },
  {
    id: 'cbc_grade3_001',
    name: 'Environmental Activities Grade 3',
    category: 'cbc',
    subcategory: 'grade-1-3',
    grade: 'Grade 3',
    subject: 'Environmental Activities',
    curriculum: 'CBC',
    price: 1799,
    sku: 'CBC-G3-EA-001',
    description: 'Environmental studies for Grade 3 CBC curriculum.',
    longDescription: 'Covers conservation, environmental care, health education, and community activities.',
    features: [
      'Environmental conservation',
      'Health education',
      'Practical activities',
      'Community projects'
    ],
    images: ['/images/products/cbc-grade3-environmental.jpg'],
    stock: 90,
    inStock: true,
    rating: 4.8,
    reviewCount: 72,
    author: 'Science Panel',
    publisher: 'KICD Approved',
    isbn: '978-9966-25-206-6',
    pages: 140,
    edition: '2024 Edition',
    tags: ['cbc', 'grade3', 'environmental', 'science'],
    createdAt: '2024-02-10'
  },

  // Grade 4-6 (Middle School)
  {
    id: 'cbc_grade4_001',
    name: 'Science and Technology Grade 4',
    category: 'cbc',
    subcategory: 'grade-4-6',
    grade: 'Grade 4',
    subject: 'Science and Technology',
    curriculum: 'CBC',
    price: 1999,
    originalPrice: 2299,
    discount: 13,
    sku: 'CBC-G4-ST-001',
    description: 'Integrated Science and Technology for Grade 4.',
    longDescription: 'Introduces scientific concepts and basic technology applications.',
    features: [
      'Scientific investigation',
      'Technology applications',
      'Experiments',
      'Digital literacy'
    ],
    images: ['/images/products/cbc-grade4-science.jpg'],
    stock: 65,
    inStock: true,
    rating: 4.7,
    reviewCount: 61,
    author: 'Science & Technology Panel',
    publisher: 'OUP Kenya',
    isbn: '978-9966-25-207-3',
    pages: 180,
    edition: '2024 Edition',
    tags: ['cbc', 'grade4', 'science', 'technology'],
    createdAt: '2024-02-15'
  },
  {
    id: 'cbc_grade5_001',
    name: 'Social Studies Grade 5',
    category: 'cbc',
    subcategory: 'grade-4-6',
    grade: 'Grade 5',
    subject: 'Social Studies',
    curriculum: 'CBC',
    price: 1850,
    sku: 'CBC-G5-SS-001',
    description: 'Comprehensive Social Studies for Grade 5.',
    longDescription: 'Covers history, geography, citizenship, and social issues.',
    features: [
      'Kenyan history',
      'Geographical concepts',
      'Citizenship education',
      'Cultural diversity'
    ],
    images: ['/images/products/cbc-grade5-social.jpg'],
    stock: 70,
    inStock: true,
    rating: 4.5,
    reviewCount: 49,
    author: 'Social Studies Panel',
    publisher: 'Longhorn Publishers',
    isbn: '978-9966-25-208-0',
    pages: 170,
    edition: '2024 Edition',
    tags: ['cbc', 'grade5', 'social-studies', 'history'],
    createdAt: '2024-02-20'
  },
  {
    id: 'cbc_grade6_001',
    name: 'Agriculture Grade 6',
    category: 'cbc',
    subcategory: 'grade-4-6',
    grade: 'Grade 6',
    subject: 'Agriculture',
    curriculum: 'CBC',
    price: 2099,
    sku: 'CBC-G6-AG-001',
    description: 'Agricultural concepts for Grade 6 learners.',
    longDescription: 'Practical agriculture covering crop production, animal husbandry, and agribusiness.',
    features: [
      'Crop production',
      'Animal husbandry',
      'Agricultural tools',
      'Agribusiness basics'
    ],
    images: ['/images/products/cbc-grade6-agriculture.jpg'],
    stock: 60,
    inStock: true,
    rating: 4.6,
    reviewCount: 53,
    author: 'Agriculture Panel',
    publisher: 'KLB',
    isbn: '978-9966-25-209-7',
    pages: 175,
    edition: '2024 Edition',
    tags: ['cbc', 'grade6', 'agriculture', 'practical'],
    createdAt: '2024-02-25'
  },

  // Grade 7-9 (Junior Secondary)
  {
    id: 'cbc_grade7_001',
    name: 'Pre-Technical Studies Grade 7',
    category: 'cbc',
    subcategory: 'grade-7-9',
    grade: 'Grade 7',
    subject: 'Pre-Technical Studies',
    curriculum: 'CBC',
    price: 2399,
    originalPrice: 2699,
    discount: 11,
    sku: 'CBC-G7-PT-001',
    description: 'Introduction to technical skills for Grade 7.',
    longDescription: 'Covers drawing, materials, tools, and basic technical concepts.',
    features: [
      'Technical drawing',
      'Materials science',
      'Tools and equipment',
      'Safety procedures'
    ],
    images: ['/images/products/cbc-grade7-technical.jpg'],
    stock: 55,
    inStock: true,
    rating: 4.7,
    reviewCount: 48,
    author: 'Technical Education Panel',
    publisher: 'JKF',
    isbn: '978-9966-25-210-3',
    pages: 190,
    edition: '2024 Edition',
    tags: ['cbc', 'grade7', 'technical', 'junior-secondary'],
    createdAt: '2024-03-01'
  },
  {
    id: 'cbc_grade8_001',
    name: 'Business Studies Grade 8',
    category: 'cbc',
    subcategory: 'grade-7-9',
    grade: 'Grade 8',
    subject: 'Business Studies',
    curriculum: 'CBC',
    price: 2250,
    sku: 'CBC-G8-BS-001',
    description: 'Business concepts for Grade 8 learners.',
    longDescription: 'Introduces entrepreneurship, business management, and financial literacy.',
    features: [
      'Entrepreneurship skills',
      'Business management',
      'Financial literacy',
      'Market research'
    ],
    images: ['/images/products/cbc-grade8-business.jpg'],
    stock: 50,
    inStock: true,
    rating: 4.5,
    reviewCount: 41,
    author: 'Business Studies Panel',
    publisher: 'OUP Kenya',
    isbn: '978-9966-25-211-0',
    pages: 185,
    edition: '2024 Edition',
    tags: ['cbc', 'grade8', 'business', 'entrepreneurship'],
    createdAt: '2024-03-05'
  },
  {
    id: 'cbc_grade9_001',
    name: 'Integrated Science Grade 9',
    category: 'cbc',
    subcategory: 'grade-7-9',
    grade: 'Grade 9',
    subject: 'Integrated Science',
    curriculum: 'CBC',
    price: 2599,
    sku: 'CBC-G9-IS-001',
    description: 'Advanced integrated science for Grade 9.',
    longDescription: 'Comprehensive coverage of physics, chemistry, biology, and environmental science.',
    features: [
      'Physics concepts',
      'Chemistry experiments',
      'Biology topics',
      'Environmental science'
    ],
    images: ['/images/products/cbc-grade9-science.jpg'],
    stock: 45,
    inStock: true,
    rating: 4.8,
    reviewCount: 56,
    author: 'Integrated Science Panel',
    publisher: 'KLB',
    isbn: '978-9966-25-212-7',
    pages: 210,
    edition: '2024 Edition',
    tags: ['cbc', 'grade9', 'science', 'integrated'],
    createdAt: '2024-03-10'
  },

  // ========== OLD CURRICULUM (Form 3-4) ==========

  // Form 3
  {
    id: 'form3_001',
    name: 'Chemistry Form 3 - Old Curriculum',
    category: 'old-curriculum',
    subcategory: 'form-3',
    grade: 'Form 3',
    subject: 'Chemistry',
    curriculum: '8-4-4',
    price: 2699,
    originalPrice: 2999,
    discount: 10,
    sku: 'OLD-F3-CHEM-001',
    description: 'Comprehensive chemistry textbook for Form 3 (Old Curriculum).',
    longDescription: 'Covers organic chemistry, acids and bases, salts, and chemical calculations.',
    features: [
      'Organic chemistry',
      'Acids, bases and salts',
      'Chemical calculations',
      'Revision questions'
    ],
    images: ['/images/products/old-form3-chemistry.jpg'],
    stock: 40,
    inStock: true,
    rating: 4.6,
    reviewCount: 78,
    author: 'Prof. Joseph Kimani',
    publisher: 'KLB',
    isbn: '978-9966-25-301-1',
    pages: 320,
    edition: '2023 Edition',
    tags: ['old-curriculum', 'form3', 'chemistry', '8-4-4'],
    createdAt: '2023-09-15'
  },
  {
    id: 'form3_002',
    name: 'Mathematics Form 3',
    category: 'old-curriculum',
    subcategory: 'form-3',
    grade: 'Form 3',
    subject: 'Mathematics',
    curriculum: '8-4-4',
    price: 2450,
    sku: 'OLD-F3-MATH-001',
    description: 'Form 3 Mathematics (Old Curriculum).',
    longDescription: 'Covers sequences, series, vectors, statistics, and probability.',
    features: [
      'Sequences and series',
      'Vectors',
      'Statistics',
      'Probability'
    ],
    images: ['/images/products/old-form3-math.jpg'],
    stock: 35,
    inStock: true,
    rating: 4.7,
    reviewCount: 65,
    author: 'Mathematics Panel',
    publisher: 'OUP Kenya',
    isbn: '978-9966-25-302-8',
    pages: 300,
    edition: '2023 Edition',
    tags: ['old-curriculum', 'form3', 'mathematics'],
    createdAt: '2023-09-20'
  },

  // Form 4
  {
    id: 'form4_001',
    name: 'Physics Form 4 - Final Revision',
    category: 'old-curriculum',
    subcategory: 'form-4',
    grade: 'Form 4',
    subject: 'Physics',
    curriculum: '8-4-4',
    price: 2799,
    originalPrice: 3199,
    discount: 12,
    sku: 'OLD-F4-PHY-001',
    description: 'Physics revision for Form 4 (Old Curriculum).',
    longDescription: 'Complete revision guide covering all Form 4 physics topics for KCSE preparation.',
    features: [
      'Complete syllabus coverage',
      'KCSE revision questions',
      'Practical experiments',
      'Answer guides'
    ],
    images: ['/images/products/old-form4-physics.jpg'],
    stock: 30,
    inStock: true,
    rating: 4.8,
    reviewCount: 92,
    author: 'Physics Panel',
    publisher: 'KLB',
    isbn: '978-9966-25-303-5',
    pages: 350,
    edition: '2024 Edition',
    tags: ['old-curriculum', 'form4', 'physics', 'kcse'],
    createdAt: '2023-10-05'
  },
  {
    id: 'form4_002',
    name: 'Biology Form 4 - Revision Guide',
    category: 'old-curriculum',
    subcategory: 'form-4',
    grade: 'Form 4',
    subject: 'Biology',
    curriculum: '8-4-4',
    price: 2550,
    sku: 'OLD-F4-BIO-001',
    description: 'Comprehensive biology revision for Form 4.',
    longDescription: 'Covers genetics, evolution, ecology, and human physiology for KCSE preparation.',
    features: [
      'Genetics and evolution',
      'Ecology',
      'Human physiology',
      'KCSE past papers'
    ],
    images: ['/images/products/old-form4-biology.jpg'],
    stock: 32,
    inStock: true,
    rating: 4.7,
    reviewCount: 76,
    author: 'Biology Panel',
    publisher: 'JKF',
    isbn: '978-9966-25-304-2',
    pages: 340,
    edition: '2024 Edition',
    tags: ['old-curriculum', 'form4', 'biology', 'revision'],
    createdAt: '2023-10-10'
  },

  // ========== STORY BOOKS (Current High School) ==========

  {
    id: 'story_001',
    name: 'The River and The Source',
    category: 'story-books',
    subcategory: 'high-school',
    type: 'Set Book',
    curriculum: 'KCSE',
    price: 1499,
    sku: 'STORY-RIVER-001',
    description: 'Margaret Ogola - KCSE Set Book',
    longDescription: 'The epic story of four generations of Kenyan women, their struggles and triumphs.',
    features: [
      'KCSE set book',
      'African literature',
      'Women empowerment',
      'Cultural heritage'
    ],
    images: ['/images/products/river-and-source.jpg'],
    stock: 85,
    inStock: true,
    rating: 4.9,
    reviewCount: 245,
    author: 'Margaret Ogola',
    publisher: 'Focus Publishers',
    isbn: '978-9966-25-401-1',
    pages: 280,
    edition: '2024 Edition',
    tags: ['story-book', 'kcse', 'set-book', 'african-literature'],
    createdAt: '2023-11-01'
  },
  {
    id: 'story_002',
    name: 'Betrayal in the City',
    category: 'story-books',
    subcategory: 'high-school',
    type: 'Set Book',
    curriculum: 'KCSE',
    price: 1350,
    sku: 'STORY-BETRAYAL-001',
    description: 'Francis Imbuga - Drama Set Book',
    longDescription: 'A play exploring political oppression and resistance in post-colonial Africa.',
    features: [
      'Drama text',
      'Political themes',
      'Character analysis',
      'Study guide included'
    ],
    images: ['/images/products/betrayal-city.jpg'],
    stock: 70,
    inStock: true,
    rating: 4.7,
    reviewCount: 189,
    author: 'Francis Imbuga',
    publisher: 'Longhorn Publishers',
    isbn: '978-9966-25-402-8',
    pages: 120,
    edition: '2024 Edition',
    tags: ['story-book', 'drama', 'kcse', 'set-book'],
    createdAt: '2023-11-05'
  },
  {
    id: 'story_003',
    name: 'Memories We Lost and Other Stories',
    category: 'story-books',
    subcategory: 'high-school',
    type: 'Set Book',
    curriculum: 'KCSE',
    price: 1599,
    originalPrice: 1799,
    discount: 11,
    sku: 'STORY-MEMORIES-001',
    description: 'KCSE Short Stories Compilation',
    longDescription: 'Collection of short stories by various African authors, prescribed for KCSE.',
    features: [
      'Short stories collection',
      'Various authors',
      'Literary analysis',
      'Thematic studies'
    ],
    images: ['/images/products/memories-we-lost.jpg'],
    stock: 65,
    inStock: true,
    rating: 4.8,
    reviewCount: 167,
    author: 'Various Authors',
    publisher: 'KLB',
    isbn: '978-9966-25-403-5',
    pages: 200,
    edition: '2024 Edition',
    tags: ['story-book', 'short-stories', 'kcse', 'african'],
    createdAt: '2023-11-10'
  },
  {
    id: 'story_004',
    name: 'A Doll\'s House',
    category: 'story-books',
    subcategory: 'high-school',
    type: 'Set Book',
    curriculum: 'KCSE',
    price: 1299,
    sku: 'STORY-DOLL-001',
    description: 'Henrik Ibsen - World Literature',
    longDescription: 'Classic play exploring gender roles and societal expectations.',
    features: [
      'World literature classic',
      'Gender themes',
      'Character development',
      'Critical analysis guide'
    ],
    images: ['/images/products/dolls-house.jpg'],
    stock: 55,
    inStock: true,
    rating: 4.6,
    reviewCount: 134,
    author: 'Henrik Ibsen',
    publisher: 'Penguin Classics',
    isbn: '978-9966-25-404-2',
    pages: 110,
    edition: '2024 Edition',
    tags: ['story-book', 'drama', 'classic', 'world-literature'],
    createdAt: '2023-11-15'
  },
  {
    id: 'story_005',
    name: 'The Pearl',
    category: 'story-books',
    subcategory: 'high-school',
    type: 'Set Book',
    curriculum: 'KCSE',
    price: 1199,
    sku: 'STORY-PEARL-001',
    description: 'John Steinbeck - American Classic',
    longDescription: 'Novella exploring themes of greed, wealth, and human nature.',
    features: [
      'American classic',
      'Thematic exploration',
      'Character study',
      'Study questions'
    ],
    images: ['/images/products/the-pearl.jpg'],
    stock: 60,
    inStock: true,
    rating: 4.7,
    reviewCount: 156,
    author: 'John Steinbeck',
    publisher: 'Penguin Books',
    isbn: '978-9966-25-405-9',
    pages: 96,
    edition: '2024 Edition',
    tags: ['story-book', 'novella', 'classic', 'american'],
    createdAt: '2023-11-20'
  },
  {
    id: 'story_006',
    name: 'Inheritance',
    category: 'story-books',
    subcategory: 'high-school',
    type: 'Set Book',
    curriculum: 'KCSE',
    price: 1650,
    sku: 'STORY-INHERITANCE-001',
    description: 'David Mulwa - African Drama',
    longDescription: 'Play addressing issues of governance, corruption, and leadership in Africa.',
    features: [
      'Political drama',
      'African themes',
      'Character analysis',
      'Study guide'
    ],
    images: ['/images/products/inheritance.jpg'],
    stock: 45,
    inStock: true,
    rating: 4.8,
    reviewCount: 123,
    author: 'David Mulwa',
    publisher: 'Longhorn Publishers',
    isbn: '978-9966-25-406-6',
    pages: 140,
    edition: '2024 Edition',
    tags: ['story-book', 'drama', 'african', 'political'],
    createdAt: '2023-11-25'
  },

  // ========== STATIONERY (Essential Supplies) ==========

  {
    id: 'stationery_001',
    name: 'CBC Exercise Books Set (All Grades)',
    category: 'stationery',
    subcategory: 'exercise-books',
    price: 4599,
    sku: 'STAT-CBC-SET-001',
    description: 'Complete set of exercise books for CBC curriculum.',
    longDescription: 'Includes specialized books for different subjects and activities as per CBC requirements.',
    features: [
      'Subject-specific books',
      'CBC recommended formats',
      'Quality paper',
      'Durable covers'
    ],
    images: ['/images/products/cbc-exercise-set.jpg'],
    stock: 200,
    inStock: true,
    rating: 4.9,
    reviewCount: 345,
    brand: 'StudyMate',
    pages: 'Various',
    packQuantity: 20,
    tags: ['stationery', 'exercise-books', 'cbc', 'school-supplies'],
    createdAt: '2024-01-05'
  },
  {
    id: 'stationery_002',
    name: 'Mathematical Set - Premium Quality',
    category: 'stationery',
    subcategory: 'math-set',
    price: 899,
    sku: 'STAT-MATH-SET-001',
    description: 'Complete mathematical set for students.',
    longDescription: 'Includes compass, protractor, set squares, ruler, and pencil.',
    features: [
      'Metal compass',
      '180° protractor',
      '2 set squares',
      '15cm ruler'
    ],
    images: ['/images/products/math-set.jpg'],
    stock: 150,
    inStock: true,
    rating: 4.7,
    reviewCount: 234,
    brand: 'GeoMaster',
    color: 'Blue',
    material: 'Metal/Plastic',
    tags: ['stationery', 'math-set', 'geometry', 'school'],
    createdAt: '2023-12-15'
  }
];

// Helper functions
export const getProductById = (id) => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category) => {
  return products.filter(product => product.category === category);
};

export const getProductsBySubcategory = (subcategory) => {
  return products.filter(product => product.subcategory === subcategory);
};

export const getProductsByCurriculum = (curriculum) => {
  return products.filter(product => product.curriculum === curriculum);
};

export const getProductsByGrade = (grade) => {
  return products.filter(product => product.grade === grade);
};

export const getProductsBySubject = (subject) => {
  return products.filter(product => product.subject === subject);
};

export const getFeaturedProducts = () => {
  return products.filter(product => product.rating >= 4.5).slice(0, 8);
};

export const getNewArrivals = () => {
  return [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);
};

export const getCBCProducts = () => {
  return products.filter(product => product.curriculum === 'CBC');
};

export const getOldCurriculumProducts = () => {
  return products.filter(product => product.curriculum === '8-4-4');
};

export const getStoryBooks = () => {
  return products.filter(product => product.category === 'story-books');
};

export const searchProducts = (query) => {
  const searchLower = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(searchLower) ||
    product.description.toLowerCase().includes(searchLower) ||
    product.subject?.toLowerCase().includes(searchLower) ||
    product.grade?.toLowerCase().includes(searchLower) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchLower))
  );
};

export const getRelatedProducts = (currentProductId, count = 4) => {
  const currentProduct = getProductById(currentProductId);
  if (!currentProduct) return [];

  return products
    .filter(product =>
      product.id !== currentProductId &&
      (product.category === currentProduct.category ||
        product.grade === currentProduct.grade ||
        product.subject === currentProduct.subject ||
        product.curriculum === currentProduct.curriculum)
    )
    .slice(0, count);
};