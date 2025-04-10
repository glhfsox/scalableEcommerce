import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../types';
import SearchBar from '../ui/SearchBar';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement search logic here
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-black">
            eShop
          </Link>

          {/* Search */}
          <div className="w-1/3">
            <SearchBar 
              products={[]} 
              onSearch={handleSearch} 
            />
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link to="/products" className="text-gray-700 hover:text-black">
              Products
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-black">
              Categories
            </Link>
            
            {/* Auth Links */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/account" className="text-gray-700 hover:text-black flex items-center">
                  {/* User icon */}
                  <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{user?.name}</span>
                </Link>
                <button 
                  className="text-gray-700 hover:text-black"
                  onClick={() => dispatch({ type: 'auth/logout' })}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-black">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                  Register
                </Link>
              </div>
            )}

            {/* Wishlist */}
            <Link to="/wishlist" className="text-gray-700 hover:text-black">
              {/* Heart icon */}
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="text-gray-700 hover:text-black relative">
              {/* Shopping cart icon */}
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 