const { createClient } = require('@supabase/supabase-js');

// Config
const supabaseUrl = "https://paxnqyuzuxgktqlnlqxi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBheG5xeXV6dXhna3RxbG5scXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1ODczOTAsImV4cCI6MjA4MzE2MzM5MH0.KTfQTBSjLLU4anJbJ3j1xrG0wkGX3IYKz1sqNK_hOUk";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBheG5xeXV6dXhna3RxbG5scXhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzU4NzM5MCwiZXhwIjoyMDgzMTYzMzkwfQ.VSmepQhDLt5qoy0QsLgOCXiSokJFBWXtwuNelBZAlMU"; // User provided key

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Data Mapping (SIMPLIFIED from products.js)
const products = [
    // PP1
    {
        title: 'Mazingira na Mimi - PP1 Environmental Activities',
        category: 'cbc',
        price: 1099,
        stock_quantity: 120,
        isbn: '978-9966-25-201-1',
        description: 'PP1 Environmental Activities book aligned with CBC curriculum.',
        image_url: 'https://via.placeholder.com/300x400?text=Mazingira+PP1',
        status: 'active',
        featured: true,
        author: 'CBC Curriculum Designers'
    },
    {
        title: 'Lugha na Mazoezi - PP1 Language Activities',
        category: 'cbc',
        price: 1150,
        stock_quantity: 95,
        isbn: '978-9966-25-202-8',
        description: 'Language development activities for PP1 learners.',
        image_url: 'https://via.placeholder.com/300x400?text=Lugha+PP1',
        status: 'active',
        author: 'Dr. Wanjiku Maina'
    },
    // Grade 1-3
    {
        title: 'Kiswahili Kitukuzwe - Grade 1',
        category: 'cbc',
        price: 1599,
        stock_quantity: 85,
        isbn: '978-9966-25-204-2',
        description: 'Grade 1 Kiswahili comprehensive textbook.',
        image_url: 'https://via.placeholder.com/300x400?text=Kiswahili+G1',
        status: 'active',
        featured: true,
        author: 'Swahili Language Panel'
    },
    // Stationery
    {
        title: 'CBC Exercise Books Set (All Grades)',
        category: 'stationery',
        price: 4599,
        stock_quantity: 200,
        isbn: 'STAT-CBC-SET-001',
        description: 'Complete set of exercise books for CBC curriculum.',
        image_url: 'https://via.placeholder.com/300x400?text=Ex+Books+Set',
        status: 'active',
        featured: true,
        author: 'StudyMate'
    },
    {
        title: 'Mathematical Set - Premium Quality',
        category: 'stationery',
        price: 450,
        stock_quantity: 500,
        isbn: 'STAT-MATH-SET-001',
        description: 'High quality mathematical set.',
        image_url: 'https://via.placeholder.com/300x400?text=Math+Set',
        status: 'active',
        author: 'Oxford'
    }
];

async function seedData() {
    console.log(`Seeding ${products.length} products...`);

    for (const product of products) {
        const { data, error } = await supabase
            .from('books')
            .upsert(product, { onConflict: 'isbn' }) // Assuming ISBN is unique, or title
            .select();

        if (error) {
            console.error(`Error inserting ${product.title}:`, error.message);
        } else {
            console.log(`inserted: ${product.title}`);
        }
    }
    console.log('Seeding complete!');
}

seedData();
