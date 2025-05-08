/*import { format } from 'date-fns';
import Button from '../ui/Button';

const PromotionCard = ({ promotion, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-4">
        <h3 className="text-lg font-bold text-purple-600">{promotion.title}</h3>
        <p className="mt-2 text-sm text-gray-600">{promotion.description}</p>
        
        <div className="mt-3 text-xs text-gray-500">
          <p>
            {format(new Date(promotion.startDate), 'MMM dd, yyyy')} - 
            {format(new Date(promotion.endDate), 'MMM dd, yyyy')}
          </p>
        </div>
        
        <div className="mt-4 flex space-x-2">
          <Button 
            onClick={() => onEdit(promotion)}
            variant="outline"
            size="sm"
          >
            Edit
          </Button>
          <Button 
            onClick={() => onDelete(promotion._id)}
            variant="danger"
            size="sm"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromotionCard;

*/


import React, { useState } from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';

const PromotionTable = ({ 
  promotions, 
  onEdit, 
  onDelete, 
  isLoading 
}) => {
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  return (
    <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
      <table className="w-full min-w-max table-auto text-left">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Date
            </th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              End Date
            </th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                Loading promotions...
              </td>
            </tr>
          ) : promotions.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No promotions found
              </td>
            </tr>
          ) : (
            promotions.map((promotion) => (
              <tr 
                key={promotion._id} 
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {promotion.title}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {promotion.description}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {format(new Date(promotion.startDate), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {format(new Date(promotion.endDate), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(promotion)}
                      className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-colors"
                      title="Edit Promotion"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(promotion._id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                      title="Delete Promotion"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PromotionTable;