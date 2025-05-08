import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

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
    .min(new Date(), 'Date must be in the future'),
});

const UpdateDiscountForm = ({ initialValues, onUpdateSuccess }) => {
  const today = new Date().toISOString().split('T')[0];

  const formik = useFormik({
    initialValues: initialValues || {
      code: '',
      percentage: '',
      validUntil: '',
    },
    validationSchema: discountSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await axios.put(`http://localhost:5000/api/discounts/${initialValues._id}`, values);
        if (response.status === 200) {
          alert('Discount updated successfully!');
          resetForm();
          if (onUpdateSuccess) onUpdateSuccess();
        } else {
          alert('Something went wrong. Please try again later.');
        }
      } catch (error) {
        console.error('Error updating discount:', error);
        alert('Error updating discount. Please try again later.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
          Update Discount Code
        </h1>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Discount Code Input */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Discount Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              value={formik.values.code}
              onChange={(e) => formik.setFieldValue('code', e.target.value.toUpperCase())}
              onBlur={formik.handleBlur}
              placeholder="SUMMER2023"
              autoComplete="off"
              autoFocus
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                formik.touched.code && formik.errors.code ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formik.touched.code && formik.errors.code && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.code}</p>
            )}
          </div>

          {/* Discount Percentage Input */}
          <div>
            <label htmlFor="percentage" className="block text-sm font-medium text-gray-700 mb-2">
              Discount Percentage
            </label>
            <div className="relative">
              <input
                id="percentage"
                name="percentage"
                type="number"
                value={formik.values.percentage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min="1"
                max="100"
                placeholder="25"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors pr-10 ${
                  formik.touched.percentage && formik.errors.percentage ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
            </div>
            {formik.touched.percentage && formik.errors.percentage && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.percentage}</p>
            )}
          </div>

          {/* Expiry Date Input */}
          <div>
            <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700 mb-2">
              Valid Until
            </label>
            <input
              id="validUntil"
              name="validUntil"
              type="date"
              value={formik.values.validUntil}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min={today}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${
                formik.touched.validUntil && formik.errors.validUntil ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formik.touched.validUntil && formik.errors.validUntil && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.validUntil}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid}
              className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                formik.isSubmitting || !formik.isValid ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {formik.isSubmitting ? 'Updating...' : 'Update Discount'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDiscountForm;