import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { validateForm } from '../../utils/validation';

type ValidationRuleType = 'required' | 'email' | 'password' | 'name' | 'match';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationRule {
  type: ValidationRuleType;
  message: string;
  matchValue?: string;
}

const Register: React.FC = () => {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationRules: Record<string, ValidationRule[]> = {
      name: [
        { type: 'required', message: 'Name is required' },
        { type: 'name', message: 'Name must be at least 2 characters' }
      ],
      email: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Invalid email format' }
      ],
      password: [
        { type: 'required', message: 'Password is required' },
        { type: 'password', message: 'Password must be at least 8 characters with uppercase, lowercase, and number' }
      ],
      confirmPassword: [
        { type: 'required', message: 'Please confirm your password' },
        { type: 'match', message: 'Passwords do not match', matchValue: formData.password }
      ]
    };

    const { isValid, errors: validationErrors } = validateForm(
      formData as unknown as Record<string, string>,
      validationRules
    );
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Replace with actual API call when ready
      dispatch({ type: 'auth/registerRequest' });
      // Mock successful registration
      setTimeout(() => {
        dispatch({ 
          type: 'auth/registerSuccess', 
          payload: { 
            user: { id: '1', name: formData.name, email: formData.email },
            token: 'mock-token'
          } 
        });
        // Use window.location instead of navigate
        window.location.href = '/';
      }, 1000);
    } catch (error: any) {
      setErrors({ submit: error.message || 'Registration failed' });
      dispatch({ type: 'auth/registerFailure', payload: error.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-black hover:text-gray-800">
              sign in to your account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
              error={errors.name}
              required
            />
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              error={errors.email}
              required
            />
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              error={errors.password}
              required
            />
            <Input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              error={errors.confirmPassword}
              required
            />
          </div>

          {errors.submit && (
            <div className="text-red-500 text-sm text-center">{errors.submit}</div>
          )}

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
            >
              Create account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 