import { useFormik } from 'formik';
import * as Yup from 'yup';
import Input from '../ui/Input';
import Button from '../ui/Button';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Validation Schema
const discountSchema = Yup.object().shape({
  code: Yup.string()
    .required('Discount code is required')
    .matches(/^[A-Z0-9]+$/, 'Only uppercase letters and numbers allowed')
    .min(5, 'Discount code must be at least 5 characters')
    .max(20, 'Discount code cannot exceed 20 characters'),
  percentage: Yup.number()
    .required('Discount percentage is required')
    .typeError('Must be a valid number')
    .integer('Must be a whole number')
    .min(1, 'Minimum discount is 1%')
    .max(100, 'Maximum discount is 100%'),
  validUntil: Yup.date()
    .required('Expiry date is required')
    .min(new Date(), 'Date must be in the future')
});

const DiscountForm = ({ initialValues, onSubmit, isSubmitting, onUpdateSuccess }) => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  // Formik Configuration
  const formik = useFormik({
    initialValues: initialValues || {
      code: '',
      percentage: '',
      validUntil: ''
    },
    validationSchema: discountSchema,
    onSubmit: async (values) => {
      try {
        let response;
        if (initialValues) {
          // If editing, make PUT request
          response = await axios.put(`http://localhost:5000/api/discounts/${initialValues._id}`, values);
        } else {
          // If creating a new promotion, make POST request
          response = await axios.post('http://localhost:5000/api/discounts', values);
        }

        if (response.status === 200 || response.status === 201) {
          toast.success(initialValues ? 'Discount updated successfully!' : 'Discount created successfully!');
          formik.resetForm();
          if (onUpdateSuccess) onUpdateSuccess();
          navigate('/admin/dashboard');
        } else {
          throw new Error('Failed to save discount');
        }
      } catch (error) {
        console.error('Error handling Discount:', error);
        toast.error('Error saving Discount. Please try again later.');
      }
    }
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {initialValues ? 'Update Discount' : 'Create Discount Code'}
        </h1>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Discount Code Input */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Code
            </label>
            <Input
              name="code"
              type="text"
              formik={formik}
              placeholder="SUMMER2023"
              autoComplete="off"
              autoFocus
              className="w-full"
              transformValue={(value) => value.toUpperCase()}
            />
          </div>

          {/* Discount Percentage Input */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Percentage
            </label>
            <div className="relative">
              <Input
                name="percentage"
                type="number"
                formik={formik}
                min="1"
                max="100"
                className="w-full pl-3 pr-8"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
            </div>
          </div>

          {/* Expiry Date Input */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valid Until
            </label>
            <Input
              name="validUntil"
              type="date"
              formik={formik}
              min={today}
              className="w-full"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!formik.isValid || isSubmitting}
              className="w-full justify-center py-2 px-4"
            >
              {initialValues ? 'Update Discount' : 'Create Discount'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiscountForm;
