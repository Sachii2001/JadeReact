import { useFormik } from 'formik';
import * as Yup from 'yup';
import Input from '../ui/Input';
import Button from '../ui/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Make sure to import navigate
// Validation schema for the promotion form
const promotionSchema = Yup.object().shape({
  title: Yup.string()
    .required('Promotion title is required')
    .max(50, 'Title cannot exceed 50 characters')
    .matches(/^[^\d].*/, 'Title cannot start with a number'), 
  description: Yup.string()
    .required('Description is required')
    .max(200, 'Description cannot exceed 200 characters')
    .matches(/^[^\d].*/, 'Description cannot start with a number'), 
  startDate: Yup.date()
    .required('Start date is required')
    .min(new Date(), 'Start date must be in the future'),
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after start date')
    .test(
      'max-duration',
      'Promotion cannot exceed 90 days',
      function(endDate) {
        const { startDate } = this.parent;
        if (!startDate || !endDate) return true;
        const diffInDays = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
        return diffInDays <= 90;
      }
    )
});

const PromotionForm = ({ initialValues, onSubmit, isSubmitting }) => {

    const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateFormatted = maxDate.toISOString().split('T')[0];

  const formik = useFormik({
    initialValues: initialValues || {
      title: '',
      description: '',
      startDate: '',
      endDate: ''
    },
    validationSchema: promotionSchema,
    onSubmit: async (values) => {
      try {
        let response;
        if (initialValues) {
          // If editing, make PUT request
          response = await axios.put(`http://localhost:5000/api/promotions/${initialValues._id}`, values);
        } else {
          // If creating a new promotion, make POST request
          response = await axios.post('http://localhost:5000/api/promotions', values);
        }

        if (response.status === 200 || response.status === 201) {
          alert(initialValues ? 'Promotion updated successfully!' : 'Promotion created successfully!');
          formik.resetForm();
          if (onUpdateSuccess) onUpdateSuccess(); // Call the onUpdateSuccess function after a successful update
        } else {
          alert('Something went wrong. Please try again later.');
        }
      } catch (error) {
        console.error('Error handling promotion:', error);
        alert('Error saving promotion. Please try again later.');
      }
    }
  });


  const onUpdateSuccess = async () => {
    // After successful update, navigate to '/promotionlist'
    navigate('/promotionsList');
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {initialValues ? 'Edit Promotion' : 'Create New Promotion'}
        </h2>
        
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Title"
              name="title"
              type="text"
              formik={formik}
              placeholder="Summer Sale 2023"
              autoComplete="off"
              autoFocus
            />
            
            <Input
              label="Description"
              name="description"
              type="textarea"
              formik={formik}
              rows="4"
              placeholder="Enter promotion details..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="startDate"
              type="date"
              formik={formik}
              min={today}
              max={maxDateFormatted}
              onChange={(e) => {
                formik.handleChange(e);
                if (formik.values.endDate && new Date(e.target.value) > new Date(formik.values.endDate)) {
                  formik.setFieldValue('endDate', '');
                }
              }}
            />
            
            <Input
              label="End Date"
              name="endDate"
              type="date"
              formik={formik}
              min={formik.values.startDate || today}
              max={maxDateFormatted}
              disabled={!formik.values.startDate}
            />
          </div>
          
          <div className="flex justify-center space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => formik.resetForm()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!formik.isValid || isSubmitting || !formik.dirty}
              className="min-w-[150px]"
            >
              {initialValues ? 'Update Promotion' : 'Create Promotion'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromotionForm;