import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  error?: string;
  label?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  error,
  label,
  className = '',
  ...props
}: InputProps) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`
          appearance-none relative block w-full px-3 py-2
          border ${error ? 'border-red-300' : 'border-gray-300'}
          placeholder-gray-500 text-gray-900 rounded-md
          focus:outline-none focus:ring-2
          ${error ? 'focus:ring-red-500' : 'focus:ring-black'}
          focus:border-transparent
          sm:text-sm
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input; 