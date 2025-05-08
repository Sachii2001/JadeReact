import PromotionCard from './PromotionCard.jsx';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2


const PromotionList = () => {
    const [promotions, setPromotions] = useState([]); // State to store promotions
    const [loading, setLoading] = useState(true); // State for loading
    const [error, setError] = useState(null); // State for error
    const navigate = useNavigate(); // Initialize the navigate function


    // Fetch promotions data from API
    useEffect(() => {
      const fetchPromotions = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/promotions'); // Adjust the URL as necessary
          setPromotions(response.data); // Set fetched promotions to state
        } catch (err) {
          setError('Failed to load promotions'); // Set error if the request fails
        } finally {
          setLoading(false); // Set loading to false once the data is fetched
        }
      };
  
      fetchPromotions(); // Call fetch function when the component mounts
    }, []); // Empty dependency array to fetch only once when the component mounts
  

    

    const handleDelete = async (promotionId) => {
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
          try {
            const response = await axios.delete(`http://localhost:5000/api/promotions/${promotionId}`);
            if (response.status === 200) {
              // Update state first, then show success
              setPromotions(prev => prev.filter(promotion => promotion._id !== promotionId));
              await Swal.fire('Deleted!', 'The promotion has been deleted.', 'success');
            }
          } catch (err) {
            setError('Failed to delete promotion');
            Swal.fire('Error!', 'There was an issue deleting the promotion.', 'error');
          }
        } else {
          // If the user canceled the deletion
          Swal.fire('Cancelled', 'Your promotion is safe :)', 'error');
        }
      };
      

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <span className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></span>
          <div className="text-gray-500">Loading promotions...</div>
        </div>
      );
    }
  
    if (error) {
      return <div className="text-center py-8 text-red-500">{error}</div>;
    }
  
    if (promotions.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
          <div className="text-gray-400 text-lg">No promotions available.</div>
        </div>
      );
    }

    const handleEdit = (promotionId) => {
        
  
        navigate('/updatepromo', { state: { promotionId } }); // Pass promotionId as state
      };
      
  
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-extrabold text-blue-900 mb-8 text-center tracking-tight">Manage Promotions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {promotions.map(promotion => (
            <PromotionCard
              key={promotion._id}
              promotion={promotion}
              onEdit={() => handleEdit(promotion._id)}
              onDelete={() => handleDelete(promotion._id)}
            />
          ))}
        </div>
      </div>
    );
  };
  
  export default PromotionList;