import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const DiscountCard = ({ discount, onEdit, onDelete }) => {
  // Validate discount data
  if (!discount || !discount.code || !discount.percentage || !discount.validUntil) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-500">
        Invalid discount data
      </div>
    );
  }

  // Format date safely
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-xl border border-green-100 hover:scale-[1.03] hover:shadow-2xl transition-all duration-200 overflow-hidden p-0 m-0">
      <div className="p-6">
        {/* Header with code and actions */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-green-700 break-all whitespace-normal">{discount.code}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(discount)}
              className="text-green-600 hover:bg-green-50 p-2 rounded-full transition-colors"
              aria-label="Edit discount"
            >
              <Pencil size={20} />
            </button>
            <button
              onClick={() => onDelete(discount._id)}
              className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
              aria-label="Delete discount"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
        {/* Discount percentage with badge */}
        <div className="flex items-center mb-2">
          <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-semibold mr-2">
            {discount.percentage}% OFF
          </span>
          <span className="text-gray-500 text-xs">({discount.percentage}% off)</span>
        </div>
        {/* Valid until date */}
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <svg 
            className="w-4 h-4 mr-1 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <span>Valid Until: <span className="font-semibold">{formatDate(discount.validUntil)}</span></span>
        </div>
        {/* Status indicator */}
        <div className="mt-2">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm ${
            new Date(discount.validUntil) > new Date() 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-200 text-gray-500'
          }`}>
            {new Date(discount.validUntil) > new Date() ? 'Active' : 'Expired'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DiscountCard;