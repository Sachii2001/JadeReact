import React from 'react';
import Button from '../ui/Button';
import { format } from 'date-fns';

const PromotionCard = ({ promotion, onEdit, onDelete }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl border border-blue-100 hover:scale-[1.03] hover:shadow-2xl transition-all duration-200 overflow-hidden m-0">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <h3 className="text-xl font-bold text-white line-clamp-1">{promotion.title}</h3>
      </div>
      {/* Card Content */}
      <div className="p-6">
        {/* Description */}
        <p className="text-gray-700 mb-4 line-clamp-3">{promotion.description}</p>
        {/* Date Range */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-medium">{format(new Date(promotion.startDate), 'MMM d, yyyy')}</span>
          <span className="mx-2">-</span>
          <span className="font-medium">{format(new Date(promotion.endDate), 'MMM d, yyyy')}</span>
        </div>
        {/* Status Badge */}
        <div className="mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm ${
            new Date(promotion.endDate) > new Date() 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {new Date(promotion.endDate) > new Date() ? 'Active' : 'Expired'}
          </span>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <Button 
           onClick={() => onEdit(promotion)}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Button>
          <Button 
            onClick={() => onDelete(promotion._id)}
            variant="danger"
            size="sm"
            className="flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromotionCard;