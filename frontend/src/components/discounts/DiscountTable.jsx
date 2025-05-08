import React, { useState } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';

const DiscountTable = ({ 
  discounts =[], 
  onEdit, 
  onDelete, 
  isLoading 
}) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (discountId) => {
    setDeletingId(discountId);
    try {
      await onDelete(discountId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">
          Loading discounts...
        </div>
      ) : discounts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No discounts found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discounts.map((discount) => (
            <div 
              key={discount._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-blue-600">
                    {discount.code}
                  </h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {discount.percentage}% OFF
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-4">
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
                  {format(new Date(discount.validUntil), 'MMM dd, yyyy')}
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onEdit(discount)}
                    className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-colors"
                    title="Edit Discount"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(discount._id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                    disabled={deletingId === discount._id}
                    title="Delete Discount"
                  >
                    {deletingId === discount._id ? (
                      <svg 
                        className="animate-spin h-5 w-5 text-red-500" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        ></circle>
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscountTable;