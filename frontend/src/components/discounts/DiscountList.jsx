import DiscountCard from './DiscountCard'; // Assuming DiscountCard is a component that displays each discount
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2

const DiscountList = () => {
  const [discounts, setDiscounts] = useState([]); // State to store discounts
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error
  const navigate = useNavigate(); // Initialize the navigate function

  // Fetch discount data from API
  useEffect(() => {
    const fetchDiscounts = async () => {
      console.log("Fetching discounts..."); // Debug log for API call

      try {
        const response = await axios.get('http://localhost:5000/api/discounts'); // Adjust the URL as necessary
        console.log("Discounts fetched successfully: ", response.data); // Debug log for successful fetch
        setDiscounts(response.data); // Set fetched discounts to state
      } catch (err) {
        console.error('Error fetching discounts: ', err); // Debug log for error
        setError('Failed to load discounts'); // Set error if the request fails
      } finally {
        console.log("API call completed"); // Debug log for completion
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchDiscounts(); // Call fetch function when the component mounts
  }, []); // Empty dependency array to fetch only once when the component mounts

  const handleDelete = async (discountId) => {
    console.log("Attempting to delete discount with ID: ", discountId); // Debug log for delete action

    // Show SweetAlert2 confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      reverseButtons: true, // Reverse the buttons so the "No" button appears on the left
    });

    if (result.isConfirmed) {
      // If the user confirmed the deletion
      console.log("User confirmed deletion"); // Debug log for confirmation

      try {
        const response = await axios.delete(`http://localhost:5000/api/discounts/${discountId}`);
        console.log("Discount deleted successfully: ", response); // Debug log for successful delete
        if (response.status === 200) {
          setDiscounts(discounts.filter(discount => discount._id !== discountId)); // Remove deleted discount from state
          Swal.fire('Deleted!', 'The discount has been deleted.', 'success');
        }
      } catch (err) {
        console.error('Error deleting discount: ', err); // Debug log for error
        setError('Failed to delete discount');
        Swal.fire('Error!', 'There was an issue deleting the discount.', 'error');
      }
    } else {
      // If the user canceled the deletion
      console.log("User canceled deletion"); // Debug log for cancellation
      Swal.fire('Cancelled', 'Your discount is safe :)', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <span className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></span>
        <div className="text-gray-500">Loading discounts...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (discounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
        <div className="text-gray-400 text-lg">No discounts available.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold text-green-900 mb-8 text-center tracking-tight">Available Discounts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {discounts.map(discount => (
          <DiscountCard
            key={discount._id}
            discount={discount}
            onEdit={() => navigate('/updatedis', { state: { discount } })}
            onDelete={() => handleDelete(discount._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default DiscountList;
