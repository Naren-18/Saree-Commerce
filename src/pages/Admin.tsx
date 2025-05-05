import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Product } from '../types/product';
import * as productService from '../services/productService';

const Admin = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    description: '',
    image: '',
    category: 'Silk',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const products = await productService.getProducts();
      setProductList(products);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setNewProduct(product);
    setPreviewUrl(product.image);
  };

  const handleDelete = async (id: number) => {
    try {
      await productService.deleteProduct(id);
      setProductList(prevList => prevList.filter(product => product.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.match('image.*')) {
      setError('Please select an image file');
      return;
    }

    setSelectedFile(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      throw new Error('No image selected');
    }

    // Upload the file to Supabase
    const imageUrl = await productService.uploadProductImage(selectedFile);
    return imageUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      let imageUrl = '';
      
      // Handle image upload
      if (selectedFile) {
        imageUrl = await handleImageUpload();
      } else if (editingProduct?.image) {
        imageUrl = editingProduct.image;
      } else {
        setError('Please select an image');
        setIsSubmitting(false);
        return;
      }
      
      const productData = {
        ...newProduct,
        image: imageUrl
      };
      
      if (editingProduct) {
        const updatedProduct = await productService.updateProduct(editingProduct.id, productData);
        setProductList(prevList =>
          prevList.map(product =>
            product.id === editingProduct.id ? updatedProduct : product
          )
        );
        setEditingProduct(null);
      } else {
        const addedProduct = await productService.addProduct(productData as Omit<Product, 'id'>);
        setProductList(prevList => [...prevList, addedProduct]);
      }
      
      // Reset form
      setNewProduct({ name: '', price: 0, description: '', image: '', category: 'Silk' });
      setSelectedFile(null);
      setPreviewUrl(null);
      setError(null);
    } catch (err) {
      setError(editingProduct ? 'Failed to update product' : 'Failed to add product');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['Silk', 'Cotton', 'Designer', 'Traditional'] as const;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fffcf5]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d35400]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffcf5] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#8b4513]">Admin Dashboard</h1>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-500 p-4 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md mb-8 overflow-hidden"
          style={{ backgroundColor: '#fffcf5', border: '1px solid #d3b17d' }}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-[#8b4513]">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#8b4513] mb-2">Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-4 py-2 border border-[#d3b17d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d35400]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#8b4513] mb-2">Price (₹)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-[#d3b17d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d35400]"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#8b4513] mb-2">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-4 py-2 border border-[#d3b17d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d35400]"
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8b4513] mb-2">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-4 py-2 border border-[#d3b17d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d35400] min-h-[100px]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#8b4513] mb-2">Product Image</label>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-[#d3b17d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d35400]"
                  />
                </div>
                {previewUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-[#8b4513] mb-2">Preview:</p>
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="h-40 w-auto object-cover rounded-lg border border-[#d3b17d]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.jpg';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 bg-[#d35400] text-white rounded-lg hover:bg-[#8b4513] transition-colors flex items-center ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingProduct ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    editingProduct ? 'Update Product' : 'Add Product'
                  )}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setNewProduct({ name: '', price: 0, description: '', image: '', category: 'Silk' });
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>

        <div className="bg-white rounded-lg shadow-md overflow-x-auto" style={{ backgroundColor: '#fffcf5', border: '1px solid #d3b17d' }}>
          <table className="min-w-full divide-y divide-[#d3b17d]">
            <thead className="bg-[#f9f1e7]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#8b4513] uppercase tracking-wider">
                  Image
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#8b4513] uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#8b4513] uppercase tracking-wider hidden sm:table-cell">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#8b4513] uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#8b4513] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d3b17d]">
              {productList.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-[#f9f1e7] transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-16 w-16 object-cover rounded-lg border border-[#d3b17d]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.jpg';
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-[#8b4513]">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#f9f1e7] text-[#8b4513]">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8b4513]">
                    ₹{product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-[#d35400] hover:text-[#8b4513] mr-4 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
