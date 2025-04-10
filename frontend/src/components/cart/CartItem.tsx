import React from 'react';
import { CartItem as CartItemType } from '../../types';
import Button from '../ui/Button';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <div className="w-24 h-24 flex-shrink-0">
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-medium text-gray-900">
          {item.product.name}
        </h3>
        <p className="text-gray-500 text-sm">
          ${item.product.price.toFixed(2)}
        </p>
        <div className="mt-2 flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            -
          </Button>
          <span className="mx-2 text-gray-900">{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
          >
            +
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="ml-4"
            onClick={() => onRemove(item.product.id)}
          >
            Remove
          </Button>
        </div>
      </div>
      <div className="ml-4 text-right">
        <p className="text-lg font-medium text-gray-900">
          ${(item.product.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default CartItem; 