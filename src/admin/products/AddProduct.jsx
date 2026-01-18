import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabaseConfig';
import { Upload, X } from 'lucide-react';
import { PRODUCT_CATEGORIES, GRADE_LEVELS } from '../../utils/constants';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [productData, setProductData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    category: '',
    subcategory: '',
    gradeLevel: '',
    curriculum: '',
    price: '',
    cost_price: '',
    stock_quantity: 0,
    min_stock_level: 5,
    image_url: '',
    published_date: '',
    publisher: '',
    pages: '',
    language: 'English',
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    status: 'active',
    featured: false
  });

  // Dynamic Options based on selection
  const selectedCategoryObj = PRODUCT_CATEGORIES.find(c => c.id === productData.category);
  const subcategoryOptions = selectedCategoryObj ? selectedCategoryObj.subcategories : [];

  const selectedSubcategoryObj = subcategoryOptions.find(s => s.id === productData.subcategory);
  const availableGrades = selectedSubcategoryObj && selectedSubcategoryObj.grades
    ? GRADE_LEVELS.filter(g => selectedSubcategoryObj.grades.includes(g.id))
    : [];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProductData(prev => {
      const newState = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };

      // Reset downstream fields when upstream fields change
      if (name === 'category') {
        const catObj = PRODUCT_CATEGORIES.find(c => c.id === value);
        newState.subcategory = '';
        newState.gradeLevel = '';
        newState.curriculum = catObj ? (catObj.curriculum || '') : '';
      } else if (name === 'subcategory') {
        newState.gradeLevel = '';
      }

      return newState;
    });
  };

  const handleDimensionChange = (dimension, value) => {
    setProductData(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [dimension]: value
      }
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase Storage
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `book-covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('book-covers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('book-covers')
        .getPublicUrl(filePath);

      setProductData(prev => ({
        ...prev,
        image_url: publicUrl
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!productData.title || !productData.author || !productData.isbn || !productData.price || !productData.category) {
        throw new Error('Please fill in all required fields');
      }

      // Check if ISBN already exists
      const { data: existing } = await supabase
        .from('books')
        .select('id')
        .eq('isbn', productData.isbn)
        .single();

      if (existing) {
        throw new Error('A book with this ISBN already exists');
      }

      // Prepare data for insertion (map camelCase to snake_case for DB)
      const productToInsert = {
        title: productData.title,
        author: productData.author,
        isbn: productData.isbn,
        description: productData.description,
        category: productData.category,
        subcategory: productData.subcategory || null,
        grade_level: productData.gradeLevel || null, // Map to grade_level
        curriculum: productData.curriculum || null,
        price: parseFloat(productData.price),
        cost_price: productData.cost_price ? parseFloat(productData.cost_price) : null,
        stock_quantity: parseInt(productData.stock_quantity),
        min_stock_level: parseInt(productData.min_stock_level),
        pages: productData.pages ? parseInt(productData.pages) : null,
        weight: productData.weight ? parseFloat(productData.weight) : null,
        dimensions: productData.dimensions.length ? productData.dimensions : null,
        published_date: productData.published_date || null,
        publisher: productData.publisher,
        language: productData.language,
        status: productData.status,
        featured: productData.featured,
        image_url: productData.image_url
      };

      const { error } = await supabase
        .from('books')
        .insert([productToInsert]);

      if (error) throw error;

      alert('Product added successfully!');
      navigate('/admin/products');
    } catch (error) {
      console.error('Error adding product:', error);
      alert(error.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600 mt-1">Add a new book to your inventory</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-6">
        {/* Basic Information */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={productData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <input
                type="text"
                name="author"
                value={productData.author}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ISBN *
              </label>
              <input
                type="text"
                name="isbn"
                value={productData.isbn}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Categorization - New Section */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Categorization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={productData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select Category</option>
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            {productData.category && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                <select
                  name="subcategory"
                  value={productData.subcategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required={subcategoryOptions.length > 0}
                >
                  <option value="">Select Subcategory</option>
                  {subcategoryOptions.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.label}</option>
                  ))}
                </select>
              </div>
            )}

            {availableGrades.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade Level
                </label>
                <select
                  name="gradeLevel"
                  value={productData.gradeLevel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Grade</option>
                  {availableGrades.map(grade => (
                    <option key={grade.id} value={grade.id}>{grade.label}</option>
                  ))}
                </select>
              </div>
            )}

            {productData.curriculum && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Curriculum
                </label>
                <input
                  type="text"
                  name="curriculum"
                  value={productData.curriculum}
                  readOnly
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="border-b pb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Pricing & Stock */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Stock</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selling Price (Ksh) *
              </label>
              <input
                type="number"
                name="price"
                value={productData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost Price (Ksh)
              </label>
              <input
                type="number"
                name="cost_price"
                value={productData.cost_price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock_quantity"
                value={productData.stock_quantity}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Stock Level
              </label>
              <input
                type="number"
                name="min_stock_level"
                value={productData.min_stock_level}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={productData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={productData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                Featured Product
              </label>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Image</h2>
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-40 w-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setProductData(prev => ({ ...prev, image_url: '' }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="h-40 w-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">No image</span>
                </div>
              )}
            </div>
            <div>
              <label className="block">
                <span className="sr-only">Choose product image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </label>
              <p className="mt-2 text-xs text-gray-500">
                {uploadingImage ? 'Uploading...' : 'JPG, PNG or GIF up to 5MB'}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Publisher
              </label>
              <input
                type="text"
                name="publisher"
                value={productData.publisher}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Published Date
              </label>
              <input
                type="date"
                name="published_date"
                value={productData.published_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pages
              </label>
              <input
                type="number"
                name="pages"
                value={productData.pages}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <input
                type="text"
                name="language"
                value={productData.language}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={productData.weight}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Dimensions */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions (cm)</label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <input
                  type="number"
                  placeholder="Length"
                  value={productData.dimensions.length}
                  onChange={(e) => handleDimensionChange('length', e.target.value)}
                  step="0.1"
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Width"
                  value={productData.dimensions.width}
                  onChange={(e) => handleDimensionChange('width', e.target.value)}
                  step="0.1"
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Height"
                  value={productData.dimensions.height}
                  onChange={(e) => handleDimensionChange('height', e.target.value)}
                  step="0.1"
                  min="0"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;