import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import CustomizationPreview from '../components/JewPreview/CustomizationPreview';

const PublicCustomization = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedProduct = location.state?.product; // Get the product passed from Shop.jsx

  const [formData, setFormData] = useState({
    customerId: 'guest',
    baseDesign: selectedProduct?.name || '',
    productId: selectedProduct?.id || '',
    customizationOptions: {
      metalType: selectedProduct?.material || '',
      gemType: '',
      size: selectedProduct?.size || '',
      engraving: '',
    },
    specialInstructions: '',
    status: 'Pending',
    priceQuote: selectedProduct?.price || '',
    productName: selectedProduct?.name || '',
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  // Available options for dropdowns
  const metalTypes = [
    'Gold',
    'Silver',
    'Rose Gold',
    'Platinum',
    'White Gold',
    'Titanium',
  ];
  const gemTypes = [
    'Diamond',
    'Ruby',
    'Sapphire',
    'Emerald',
    'Amethyst',
    'Topaz',
    'Pearl',
    'None',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/customization',
        {
          ...formData,
          originalProduct: selectedProduct,
        }
      );
      navigate('/customization-submitted', {
        state: { customizationId: response.data._id },
      });
    } catch (error) {
      console.error('Error submitting customization:', error);
      setErrors({
        submit: 'Failed to submit your customization. Please try again.',
      });
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Customize {selectedProduct?.name || 'Your Jewelry'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Product Display */}
            {selectedProduct && (
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div>
                    <h2 className="text-xl font-semibold">
                      {selectedProduct.name}
                    </h2>
                    <p className="text-gray-600">
                      Base Price: ${selectedProduct.price}
                    </p>
                    <p className="text-gray-600">
                      Material: {selectedProduct.material}
                    </p>
                    <p className="text-gray-600">
                      Size: {selectedProduct.size}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step indicator */}
            <div className="flex mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1">
                  <div
                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                      step === i
                        ? 'bg-blue-500 text-white'
                        : step > i
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    {step > i ? '✓' : i}
                  </div>
                  <p className="text-xs text-center mt-1">
                    {i === 1 ? 'Design' : i === 2 ? 'Details' : 'Review'}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Customization options */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Customize Your {selectedProduct?.name}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Metal Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Metal Type
                      </label>
                      <select
                        name="customizationOptions.metalType"
                        value={formData.customizationOptions.metalType}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Metal</option>
                        {metalTypes.map((metal) => (
                          <option key={metal} value={metal}>
                            {metal}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Gem Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gem Type
                      </label>
                      <select
                        name="customizationOptions.gemType"
                        value={formData.customizationOptions.gemType}
                        onChange={handleChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Gem</option>
                        {gemTypes.map((gem) => (
                          <option key={gem} value={gem}>
                            {gem}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Size
                      </label>
                      <input
                        type="text"
                        name="customizationOptions.size"
                        value={formData.customizationOptions.size}
                        onChange={handleChange}
                        placeholder="e.g., 7"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Engraving */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Engraving
                      </label>
                      <input
                        type="text"
                        name="customizationOptions.engraving"
                        value={formData.customizationOptions.engraving}
                        onChange={handleChange}
                        placeholder="e.g., Forever Yours"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Special Instructions */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Instructions
                    </label>
                    <textarea
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Any additional details or requests..."
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Review and submit */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Review Your Customization
                  </h2>

                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium mb-2">Customization Summary</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <strong>Product:</strong> {selectedProduct?.name}
                      </li>
                      <li>
                        <strong>Base Price:</strong> ${selectedProduct?.price}
                      </li>
                      <li>
                        <strong>Metal Type:</strong>{' '}
                        {formData.customizationOptions.metalType ||
                          'Not specified'}
                      </li>
                      <li>
                        <strong>Gem Type:</strong>{' '}
                        {formData.customizationOptions.gemType ||
                          'Not specified'}
                      </li>
                      <li>
                        <strong>Size:</strong>{' '}
                        {formData.customizationOptions.size || 'Not specified'}
                      </li>
                      <li>
                        <strong>Engraving:</strong>{' '}
                        {formData.customizationOptions.engraving || 'None'}
                      </li>
                      <li>
                        <strong>Special Instructions:</strong>{' '}
                        {formData.specialInstructions || 'None'}
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm text-gray-600 mb-6">
                    By submitting this customization, you're requesting a quote
                    for your custom jewelry. Our team will review your request
                    and contact you with pricing information.
                  </p>

                  {errors.submit && (
                    <p className="text-red-500 mb-4">{errors.submit}</p>
                  )}

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Submit Customization
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Preview panel */}
        <div className="lg:col-span-1">
          <CustomizationPreview
            selectedProduct={selectedProduct}
            formData={formData}
          />
        </div>
      </div>
    </div>
  );
};

export default PublicCustomization;
