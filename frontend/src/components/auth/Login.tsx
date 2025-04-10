import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { validateForm } from '../../utils/validation';

type ValidationRuleType = 'required' | 'email' | 'password' | 'name' | 'match';

interface LoginFormData {
  email: string;
  password: string;
}

interface ValidationRule {
  type: ValidationRuleType;
  message: string;
  matchValue?: string;
}

const Login: React.FC = () => {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
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
      email: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Invalid email format' }
      ],
      password: [
        { type: 'required', message: 'Password is required' }
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
      dispatch({ type: 'auth/loginRequest' });
      // Mock successful login
      setTimeout(() => {
        dispatch({ 
          type: 'auth/loginSuccess', 
          payload: { 
            user: { id: '1', name: 'User', email: formData.email },
            token: 'mock-token'
          } 
        });
        // Use window.location instead of navigate
        window.location.href = '/';
      }, 1000);
    } catch (error: any) {
      setErrors({ submit: error.message || 'Login failed' });
      dispatch({ type: 'auth/loginFailure', payload: error.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-black hover:text-gray-800">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
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
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-black hover:text-gray-800">
                Forgot your password?
              </Link>
            </div>
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
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 