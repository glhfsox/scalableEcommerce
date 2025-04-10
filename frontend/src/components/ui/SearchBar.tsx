import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../../types';
import Input from './Input';

interface SearchBarProps {
  products: Product[];
  onSearch: (query: string) => void;
  onSelectProduct?: (product: Product) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  products,
  onSearch,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = (value: string) => {
    setQuery(value);
    onSearch(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSelectProduct = (product: Product) => {
    setQuery(product.name);
    setShowSuggestions(false);
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <Input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setShowSuggestions(query.length > 0)}
      />
      {showSuggestions && filteredProducts.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              onClick={() => handleSelectProduct(product)}
            >
              <div className="flex items-center">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-8 h-8 object-cover rounded mr-3"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 