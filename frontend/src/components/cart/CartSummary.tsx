import React from 'react';
import Button from '../ui/Button';

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  onCheckout: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  shipping,
  tax,
  onCheckout,
}) => {
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900">${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between">
            <span className="text-lg font-medium text-gray-900">Total</span>
            <span className="text-lg font-medium text-gray-900">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <Button
        variant="primary"
        size="lg"
        className="w-full mt-6"
        onClick={onCheckout}
      >
        Checkout
      </Button>
    </div>
  );
};

export default CartSummary; 