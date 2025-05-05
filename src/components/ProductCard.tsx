import { motion } from 'framer-motion';
import type { Product } from '../types/product';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiShoppingBag, FiEye } from 'react-icons/fi';

interface ProductCardProps {
  product: Product;
  isAuthenticated?: boolean;
}

const ProductCard = ({ product, isAuthenticated = false }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { id, name, price, description, image, category } = product;

  const handleAddToCart = () => {
    if (isAuthenticated) {
      addToCart(product);
    } else {
      navigate('/login');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
      style={{ backgroundColor: '#fffcf5', border: '1px solid #d3b17d' }}
    >
      <div className="relative pb-[100%] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.jpg';
          }}
        />
        <div className="absolute top-2 right-2">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#f9f1e7] text-[#8b4513]">
            {category}
          </span>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              navigate(`/product/${id}`);
            }}
            className="bg-white rounded-md font-medium flex items-center space-x-2 px-4 py-2 navbar-logo"
          >
            <FiEye />
            <span>View Details</span>
          </motion.button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-[#8b4513] mb-2 line-clamp-2">
          {name}
        </h3>
        <p className="text-sm text-[#666] mb-4 flex-grow line-clamp-3">
          {description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-[#d35400]">
            ₹{price.toLocaleString()}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="px-4 py-2 bg-[#d35400] text-white rounded-lg hover:bg-[#8b4513] transition-colors text-sm flex items-center space-x-1"
          >
            <FiShoppingBag size={16} />
            <span>Add to Cart</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
