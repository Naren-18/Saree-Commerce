import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiLogIn } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import Cart from './Cart';
import { motion } from 'framer-motion';

interface NavbarProps {
  userRole?: string;
  setIsAuthenticated: (value: boolean) => void;
  setUserRole: (value: string | undefined) => void;
  isAuthenticated: boolean;
}

const Navbar = ({ userRole, setIsAuthenticated, setUserRole, isAuthenticated }: NavbarProps) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { getItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(undefined);
    navigate('/');
  };

  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-50 navbar-custom">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold navbar-logo">
              Saree<span>Bazaar</span>
            </h1>
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated && userRole === 'admin' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin')}
                className="px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors duration-200 navbar-logo"
              >
                <span>Admin</span>
              </motion.button>
            )}
            
            {isAuthenticated && (
              <>
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 rounded-full transition-colors navbar-logo"
                >
                  <FiShoppingCart size={22} />
                  {getItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs w-5 h-5 rounded-full flex items-center justify-center btn-primary">
                      {getItemCount()}
                    </span>
                  )}
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-1.5 rounded-md text-sm font-medium btn-primary"
                >
                  Logout
                </motion.button>
              </>
            )}
            
            {/* {!isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="flex items-center space-x-2 px-4 py-1.5 rounded-md text-sm font-medium btn-primary"
              >
                <FiLogIn size={16} />
                <span>Login</span>
              </motion.button>
            )} */}
          </div>
        </div>
      </div>

      {isAuthenticated && <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
    </motion.nav>
  );
};

export default Navbar;
