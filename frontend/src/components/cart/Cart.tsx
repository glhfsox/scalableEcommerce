import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../../types';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import Button from '../ui/Button';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state: RootState) => state.cart);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <Button 
            variant="primary" 
            size="md" 
            className="mt-4"
            onClick={() => dispatch({ type: 'cart/fetchCart' })}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
          <p className="mt-1 text-gray-500">Start shopping to add items to your cart.</p>
          <div className="mt-6">
            <Link to="/products">
              <Button variant="primary" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1; // 10% tax

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      dispatch({
        type: 'cart/removeFromCart',
        payload: productId
      });
    } else {
      dispatch({
        type: 'cart/updateQuantity',
        payload: { productId, quantity }
      });
    }
  };

  const handleRemoveItem = (productId: string) => {
    dispatch({
      type: 'cart/removeFromCart',
      payload: productId
    });
  };

  const handleClearCart = () => {
    dispatch({ type: 'cart/clearCart' });
  };

  const handleCheckout = () => {
    // Navigate to checkout page or show checkout modal
    window.location.href = '/checkout';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-8">
          <div className="border-t border-gray-200">
            {items.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
          
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              size="md"
              onClick={handleClearCart}
            >
              Clear Cart
            </Button>
            
            <Link to="/products">
              <Button variant="secondary" size="md">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Cart Summary */}
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            onCheckout={handleCheckout}
          />
          
          {shipping === 0 ? (
            <div className="mt-4 bg-green-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Free shipping applied!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">
                Spend ${(100 - subtotal).toFixed(2)} more to qualify for free shipping.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart; 