import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { AiOutlineSearch } from 'react-icons/ai';
import { motion } from 'framer-motion';
import { Product } from '../types/product';
import * as productService from '../services/productService';

interface HomeProps {
  isAuthenticated?: boolean;
}

const Home = ({ isAuthenticated = false }: HomeProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Silk', 'Cotton', 'Designer', 'Traditional'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const fetchedProducts = await productService.getProducts();
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fffcf5]">
      {/* Hero Section */}
      <div className="relative bg-[#8b4513] text-white py-16 sm:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Discover Timeless Elegance
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl mb-8 text-[#f9f1e7]"
          >
            Explore our collection of exquisite Indian sarees
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Search and Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-md mb-8"
          style={{ backgroundColor: '#fff', border: '1px solid #d3b17d' }}
        >
          <div className="space-y-6 md:space-y-0 md:flex md:justify-between md:items-center">
            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search sarees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#d3b17d] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d35400] text-base"
                style={{ backgroundColor: '#fff' }}
              />
              <AiOutlineSearch 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b4513]" 
                size={20} 
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-start md:justify-end">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-[#d35400] text-white shadow-md'
                      : 'bg-[#f9f1e7] text-[#8b4513] hover:bg-[#d3b17d] hover:text-white'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Section Title */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold text-[#8b4513]"
          >
            Our Collection
          </motion.h2>
          <div className="w-24 h-1 bg-[#d35400] mx-auto mt-4"></div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-[#666]"
          >
            Each piece tells a story of tradition and craftsmanship
          </motion.p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d35400]"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-10 px-4"
          >
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#d35400] text-white rounded-lg hover:bg-[#8b4513] transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* No Results Found */}
        {!isLoading && !error && filteredProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-10 px-4"
          >
            <p className="text-[#8b4513] text-lg">No sarees found matching your criteria.</p>
            {products.length === 0 && (
              <p className="mt-2 text-[#8b4513]">
                There are no products in the database. Please add some products in the Admin page.
              </p>
            )}
          </motion.div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && filteredProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="transform transition-transform hover:-translate-y-1"
              >
                <ProductCard
                  product={product}
                  isAuthenticated={isAuthenticated}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 py-8 bg-[#f9f1e7] border-t border-[#d3b17d]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-[#8b4513] mb-2">SareeBazaar</h3>
            <p className="text-[#666]">Where Tradition Meets Elegance</p>
          </div>
          <p className="text-[#8b4513] text-sm">
            Celebrating the rich heritage of Indian textiles &copy; 2025 SareeBazaar
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
