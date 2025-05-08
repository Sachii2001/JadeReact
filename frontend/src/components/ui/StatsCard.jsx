import React from 'react';

const StatsCard = ({ title, value, isLoading, icon, action }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center justify-between space-x-4">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
        <div>
          <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">
            {isLoading ? (
              <div className="w-8 h-8 border-4 border-t-4 border-gray-300 rounded-full animate-spin"></div>
            ) : (
              value
            )}
          </p>
        </div>
      </div>
      <div>{action}</div>
    </div>
  );
};

export default StatsCard;
