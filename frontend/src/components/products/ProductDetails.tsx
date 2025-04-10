import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Product } from '../../types';
import Button from '../ui/Button';

interface ProductDetailsProps {
  product: Product;
  onAddToCart: (productId: string, quantity: number) => void;
  onAddToWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  isInWishlist = false,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="mb-4 aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-center object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-black' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-center object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            
            {/* Price */}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="ml-2 text-lg text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.originalPrice && (
                <span className="ml-2 text-sm px-2 py-1 bg-red-100 text-red-700 rounded">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">In Stock</span>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <span className="ml-2 text-red-500">
                  Only {product.stock} left!
                </span>
              )}
            </div>

            {/* Description */}
            <div className="text-gray-700 mb-6">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p>{product.description}</p>
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Quantity</h3>
                <div className="flex items-center">
                  <button
                    onClick={decrementQuantity}
                    className="p-2 rounded-l-md border border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200"
                    disabled={quantity <= 1}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 p-2 text-center border-t border-b border-gray-300"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="p-2 rounded-r-md border border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200"
                    disabled={quantity >= product.stock}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-4">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={() => onAddToCart(product.id, quantity)}
                disabled={product.stock <= 0}
              >
                Add to Cart
              </Button>
              
              {onAddToWishlist && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onAddToWishlist(product.id)}
                  className={isInWishlist ? 'text-red-600 border-red-600' : ''}
                >
                  <svg className="w-5 h-5 mr-1" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </Button>
              )}
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 