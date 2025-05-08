import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/promotions");
        setPromotions(response.data);
      } catch (err) {
        setError("Failed to load promotions");
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <span className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></span>
      <div className="text-gray-500">Loading promotions...</div>
    </div>
  );
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (promotions.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
      <div className="text-gray-400 text-lg">No active promotions.</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold text-blue-900 mb-8 text-center tracking-tight">Today's Best Promotions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {promotions.map(promo => (
          <div key={promo._id} className="relative group bg-white rounded-2xl shadow-xl border border-blue-100 p-6 hover:scale-[1.03] hover:shadow-2xl transition-all duration-200 overflow-hidden">
            <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
              {Math.max(0, Math.ceil((new Date(promo.endDate) - Date.now())/(1000*60*60*24)))} days left
            </div>
            <h3 className="text-xl font-bold text-blue-700 mb-2 line-clamp-1">{promo.title}</h3>
            <p className="text-gray-700 mb-4 line-clamp-3">{promo.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="bg-blue-50 px-2 py-1 rounded">Start: {new Date(promo.startDate).toLocaleDateString()}</span>
              <span className="bg-blue-50 px-2 py-1 rounded">End: {new Date(promo.endDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-end">
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors duration-150"
                onClick={() => navigate(`/shop?promo=${promo._id}`)}
              >
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPromotions;
