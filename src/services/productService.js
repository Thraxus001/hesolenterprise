import { supabase } from '../config/supabaseConfig';

export const productService = {
  // Fetch all products with optional filters
  getAllProducts: async ({ category, limit, featured } = {}) => {
    let query = supabase
      .from('books')
      .select('*');

    if (category && category !== 'all') {
      if (Array.isArray(category)) {
        query = query.in('category', category);
      } else {
        query = query.eq('category', category);
      }
    }

    if (featured) {
      query = query.eq('featured', true);
    }

    // Only show active products to customers
    query = query.neq('status', 'inactive');

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    // Map DB fields to frontend format if necessary
    return data.map(mapProductFromDb);
  },

  // Get single product by IDs
  getProductById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return mapProductFromDb(data);
    } catch (err) {
      console.warn('Error fetching product by ID:', err.message);
      return null;
    }
  },

  // Get recent/featured products (for Home page)
  getFeaturedProducts: async (limit = 4) => {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('featured', true)
      .eq('status', 'active')
      .limit(limit);

    if (error) throw error;
    return data.map(mapProductFromDb);
  }
};

// Helper: Map Database snake_case to Frontend camelCase
const mapProductFromDb = (dbProduct) => {
  if (!dbProduct) return null;
  return {
    ...dbProduct,
    // Ensure numeric values are numbers
    price: Number(dbProduct.price),
    stockQuantity: dbProduct.stock_quantity, // Map stock_quantity -> stockQuantity
    comparePrice: dbProduct.compare_price || 0, // Assuming you might add this column later or calculate it
    rating: 4.5, // Hardcoded for now as DB doesn't have ratings table yet
    reviewCount: 0,
    images: dbProduct.additional_images || [],
    features: dbProduct.features || [], // Ensure features is always an array
    mainImage: dbProduct.image_url,
    // Ensure all required fields for UI are present
    category: dbProduct.category,
    subcategory: dbProduct.subcategory,
    gradeLevel: dbProduct.grade_level,
    curriculum: dbProduct.curriculum,
    description: dbProduct.description,
    name: dbProduct.title, // Map title -> name
    id: dbProduct.id
  };
};