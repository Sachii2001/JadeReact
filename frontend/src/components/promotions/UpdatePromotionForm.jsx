import { useFormik } from 'formik';
import * as Yup from 'yup';
import Input from '../ui/Input';
import Button from '../ui/Button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

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

const PromotionUpdateForm = () => {
    const location = useLocation();
    const promotionId = location.state?.promotionId;
  
    if (!promotionId) {
      return <div>Promotion ID is missing or invalid.</div>;
    }
    
    const [promotion, setPromotion] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPromotion = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/promotions/${promotionId}`);
                setPromotion(response.data);
            } catch (error) {
                console.error('Error fetching promotion:', error);
                alert('Error fetching promotion details');
            } finally {
                setLoading(false);
            }
        };

        fetchPromotion();
    }, [promotionId]);

    const formik = useFormik({
        initialValues: promotion || {
            title: '',
            description: '',
            startDate: '',
            endDate: '',
        },
        validationSchema: promotionSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const response = await axios.put(
                    `http://localhost:5000/api/promotions/${promotionId}`,
                    values
                );
                if (response.status === 200) {
                    alert('Promotion updated successfully!');
                    navigate('/');
                } else {
                    alert('Something went wrong. Please try again.');
                }
            } catch (error) {
                console.error('Error updating promotion:', error);
                alert('Error updating promotion. Please try again later.');
            }
        },
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Promotion</h2>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <Input
                            label="Title"
                            name="title"
                            type="text"
                            formik={formik}
                            placeholder="Summer Sale 2023"
                            autoComplete="off"
                            value={formik.values.title}
                        />
                        <Input
                            label="Description"
                            name="description"
                            type="textarea"
                            formik={formik}
                            rows="4"
                            placeholder="Enter promotion details..."
                            value={formik.values.description}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Start Date"
                            name="startDate"
                            type="date"
                            formik={formik}
                            value={formik.values.startDate}
                        />
                        <Input
                            label="End Date"
                            name="endDate"
                            type="date"
                            formik={formik}
                            value={formik.values.endDate}
                        />
                    </div>

                    <div className="flex justify-center space-x-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => formik.resetForm()}
                            disabled={formik.isSubmitting}
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            loading={formik.isSubmitting}
                            disabled={!formik.isValid || formik.isSubmitting || !formik.dirty}
                            className="min-w-[150px]"
                        >
                            Update Promotion
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PromotionUpdateForm;