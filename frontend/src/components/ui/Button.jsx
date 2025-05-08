import React from 'react';

const Button = ({ children, onClick, variant = 'solid', size = 'md', loading = false, disabled = false }) => {
  // Classes for different variants (solid, outline, etc.)
  const variantClasses = {
    solid: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500',
    outline: 'border border-blue-500 text-blue-500 hover:bg-blue-100 focus:ring-blue-500',
    // Add more variants as needed
  };

  // Classes for different sizes (sm, md, lg)
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${loading ? 'cursor-wait' : ''}`}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="w-5 h-5 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
