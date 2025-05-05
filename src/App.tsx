import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProductDetails from './pages/ProductDetails';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    const role = localStorage.getItem('userRole');
    if (auth === 'true') {
      setIsAuthenticated(true);
      setUserRole(role || undefined);
    } else {
      setIsAuthenticated(false);
      setUserRole(undefined);
    }
  }, []);

  interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRole?: string;
  }

  const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    if (allowedRole && userRole !== allowedRole) {
      return <Navigate to="/" />;
    }

    return <>{children}</>;
  };

  return (
    <Router>
      <CartProvider>
        <Navbar 
          userRole={userRole} 
          setIsAuthenticated={setIsAuthenticated}
          setUserRole={setUserRole}
          isAuthenticated={isAuthenticated}
        />
        <div className="min-h-screen bg-gray-50 pt-16" style={{ backgroundColor: '#FDF6ED' }}>
          <Routes>
            <Route path="/login" element={
              isAuthenticated ? (
                <Navigate to={userRole === 'admin' ? '/admin' : '/'} />
              ) : (
                <Login />
              )
            } />
            <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/admin" element={
              <ProtectedRoute allowedRole="admin">
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute>
                <div>Cart Page</div>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
