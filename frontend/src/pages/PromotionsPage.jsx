import { useState, useEffect } from 'react';
import { getPromotions, createPromotion, updatePromotion, deletePromotion } from '../services/promotionService';
import PromotionList from '../components/promotions/PromotionList';
import PromotionForm from '../components/promotions/PromotionForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import useToast from '../hooks/useToast';

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setIsLoading(true);
    try {
      const data = await getPromotions();
      setPromotions(data);
    } catch (error) {
      showToast('error', 'Failed to load promotions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (promotionData) => {
    try {
      if (currentPromotion) {
        await updatePromotion(currentPromotion._id, promotionData);
        showToast('success', 'Promotion updated successfully');
      } else {
        await createPromotion(promotionData);
        showToast('success', 'Promotion created successfully');
      }
      fetchPromotions();
      setIsModalOpen(false);
    } catch (error) {
      showToast('error', error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePromotion(id);
      showToast('success', 'Promotion deleted successfully');
      fetchPromotions();
    } catch (error) {
      showToast('error', 'Failed to delete promotion');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Promotions Management</h1>
        <Button onClick={() => {
          setCurrentPromotion(null);
          setIsModalOpen(true);
        }}>
          Create Promotion
        </Button>
      </div>

      {isLoading && promotions.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading promotions...</p>
        </div>
      ) : (
        <PromotionList
          promotions={promotions}
          onEdit={(promotion) => {
            setCurrentPromotion(promotion);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPromotion ? 'Edit Promotion' : 'Create Promotion'}
      >
        <PromotionForm
          initialValues={currentPromotion}
          onSubmit={handleSubmit}
        />
      </Modal>

      <Toast 
        type={toast.type} 
        message={toast.message} 
        isVisible={toast.isVisible} 
        onClose={hideToast} 
      />
    </div>
  );
};

export default PromotionsPage;