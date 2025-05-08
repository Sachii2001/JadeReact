import React from 'react';

const CustomizationPreview = ({ selectedProduct, formData }) => {
  // If no product is selected, show a placeholder
  if (!selectedProduct) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
        <h3 className="text-xl font-semibold mb-4">Preview</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">Select a product to customize</p>
        </div>
      </div>
    );
  }

  // Price multipliers for different materials
  const materialMultipliers = {
    'Gold': 1.5,
    'Silver': 1,
    'Rose Gold': 1.3,
    'Platinum': 2,
    'White Gold': 1.4,
    'Titanium': 1.2
  };

  // Price additions for gems
  const gemAdditions = {
    'Diamond': 1000,
    'Ruby': 800,
    'Sapphire': 750,
    'Emerald': 900,
    'Amethyst': 300,
    'Topaz': 400,
    'Pearl': 200,
    'None': 0
  };

  // Calculate the final price based on customizations
  const calculatePrice = () => {
    const basePrice = selectedProduct?.price || 0;
    const materialMultiplier = materialMultipliers[formData?.customizationOptions?.metalType] || 1;
    const gemAddition = gemAdditions[formData?.customizationOptions?.gemType] || 0;
    
    return (basePrice * materialMultiplier) + gemAddition;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
      <h3 className="text-xl font-semibold mb-4">Preview</h3>
      
      {/* Product Image */}
      <div className="mb-4">
        <img
          src={selectedProduct.image}
          alt={selectedProduct.name}
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>

      {/* Customization Details */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Product:</span>
          <span className="font-medium">{selectedProduct.name}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Metal Type:</span>
          <span className="font-medium">
            {formData?.customizationOptions?.metalType || 'Not selected'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Gem Type:</span>
          <span className="font-medium">
            {formData?.customizationOptions?.gemType || 'None'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Size:</span>
          <span className="font-medium">
            {formData?.customizationOptions?.size || 'Not specified'}
          </span>
        </div>

        {formData?.customizationOptions?.engraving && (
          <div className="flex justify-between">
            <span className="text-gray-600">Engraving:</span>
            <span className="font-medium">{formData.customizationOptions.engraving}</span>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex justify-between text-lg">
            <span className="text-gray-600">Base Price:</span>
            <span className="font-medium">${selectedProduct.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold mt-2">
            <span>Total Price:</span>
            <span className="text-blue-600">${calculatePrice().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPreview;