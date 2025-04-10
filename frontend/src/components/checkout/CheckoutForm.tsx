import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const CheckoutForm: React.FC = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      // Validate shipping information
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    } else if (step === 2) {
      // Validate payment information
      if (!formData.cardName) newErrors.cardName = 'Name on card is required';
      
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number';
      }
      
      if (!formData.expiryDate) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Invalid format (MM/YY)';
      }
      
      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'Invalid CVV';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real application, you would make an API call to process the payment
      // For now, we'll simulate a successful payment after a short delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      dispatch({ type: 'cart/clearCart' });
      
      // Navigate to success page
      window.location.href = '/checkout/success';
    } catch (error: any) {
      setErrors({
        submit: error.message || 'Payment processing failed. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
      
      {/* Checkout Steps */}
      <div className="mb-8">
        <div className="flex justify-between">
          <div className={`flex-1 text-center ${currentStep >= 1 ? 'text-black' : 'text-gray-400'}`}>
            <div className={`rounded-full h-8 w-8 mx-auto flex items-center justify-center border-2 ${currentStep >= 1 ? 'border-black bg-black text-white' : 'border-gray-300'}`}>
              1
            </div>
            <div className="mt-1">Shipping</div>
          </div>
          <div className={`flex-1 text-center ${currentStep >= 2 ? 'text-black' : 'text-gray-400'}`}>
            <div className={`rounded-full h-8 w-8 mx-auto flex items-center justify-center border-2 ${currentStep >= 2 ? 'border-black bg-black text-white' : 'border-gray-300'}`}>
              2
            </div>
            <div className="mt-1">Payment</div>
          </div>
          <div className={`flex-1 text-center ${currentStep >= 3 ? 'text-black' : 'text-gray-400'}`}>
            <div className={`rounded-full h-8 w-8 mx-auto flex items-center justify-center border-2 ${currentStep >= 3 ? 'border-black bg-black text-white' : 'border-gray-300'}`}>
              3
            </div>
            <div className="mt-1">Review</div>
          </div>
        </div>
        <div className="mt-2 flex">
          <div className={`h-1 flex-1 ${currentStep >= 2 ? 'bg-black' : 'bg-gray-300'}`}></div>
          <div className={`h-1 flex-1 ${currentStep >= 3 ? 'bg-black' : 'bg-gray-300'}`}></div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Step 1: Shipping Information */}
        {currentStep === 1 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
              />
              <Input
                label="Last Name"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                className="md:col-span-2"
              />
              <Input
                label="Address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                className="md:col-span-2"
              />
              <Input
                label="City"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="State"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  error={errors.state}
                />
                <Input
                  label="ZIP Code"
                  name="zipCode"
                  type="text"
                  value={formData.zipCode}
                  onChange={handleChange}
                  error={errors.zipCode}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleNextStep}
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 2: Payment Information */}
        {currentStep === 2 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <Input
                label="Name on Card"
                name="cardName"
                type="text"
                value={formData.cardName}
                onChange={handleChange}
                error={errors.cardName}
              />
              <Input
                label="Card Number"
                name="cardNumber"
                type="text"
                value={formData.cardNumber}
                onChange={handleChange}
                error={errors.cardNumber}
                placeholder="XXXX XXXX XXXX XXXX"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry Date"
                  name="expiryDate"
                  type="text"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  error={errors.expiryDate}
                  placeholder="MM/YY"
                />
                <Input
                  label="CVV"
                  name="cvv"
                  type="text"
                  value={formData.cvv}
                  onChange={handleChange}
                  error={errors.cvv}
                  placeholder="XXX"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handlePrevStep}
              >
                Back to Shipping
              </Button>
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleNextStep}
              >
                Continue to Review
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 3: Order Review */}
        {currentStep === 3 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Review</h2>
            
            {/* Order summary */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Order Summary</h3>
              <div className="border-t border-b border-gray-200 py-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between py-2">
                    <div className="flex">
                      <span className="text-gray-900 font-medium">{item.product.name}</span>
                      <span className="text-gray-600 ml-2">x {item.quantity}</span>
                    </div>
                    <span className="text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 space-y-2">
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
                <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Shipping info summary */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Shipping Information</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p>{formData.firstName} {formData.lastName}</p>
                <p>{formData.address}</p>
                <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                <p>{formData.email}</p>
              </div>
            </div>
            
            {/* Payment info summary */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Payment Information</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p>{formData.cardName}</p>
                <p>**** **** **** {formData.cardNumber.slice(-4)}</p>
                <p>Expires: {formData.expiryDate}</p>
              </div>
            </div>
            
            {errors.submit && (
              <div className="mb-4 text-red-500 text-center">
                {errors.submit}
              </div>
            )}
            
            <div className="mt-6 flex justify-between">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handlePrevStep}
                disabled={isProcessing}
              >
                Back to Payment
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Place Order'
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CheckoutForm; 