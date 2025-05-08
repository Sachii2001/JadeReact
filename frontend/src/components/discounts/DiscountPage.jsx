import { useEffect, useState } from 'react';
import DiscountList from './DiscountList'; // Import DiscountList
import { getDiscounts } from '../services/api.js'; // Ensure this API call works properly

const DiscountPage = () => {
  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await getDiscounts();
        setDiscounts(response.data); // Assuming API returns data in the correct format
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };
    fetchDiscounts();
  }, []);

  return (
    <div>
      <h1>Discounts</h1>
      <DiscountList discounts={discounts} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

// Example edit and delete handlers
const handleEdit = (id) => {
  console.log("Editing discount with id:", id);
};

const handleDelete = (id) => {
  console.log("Deleting discount with id:", id);
};

export default DiscountPage;
