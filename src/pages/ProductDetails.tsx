import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import products from '../data/products.json';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/home')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-96 md:h-[600px]"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </motion.div>
        <motion.div
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-600 text-lg mb-6">{product.description}</p>
          <div className="text-2xl font-bold text-indigo-600 mb-6">₹{product.price}</div>
          <button
            onClick={() => navigate('/home')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300 w-full md:w-auto"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
