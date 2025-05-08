import { useEffect, useState } from "react";
import axios from "axios";
import {
  DocumentDuplicateIcon,
  CheckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const UserDiscounts = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCouponId, setCopiedCouponId] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id;

        if (!userId) {
          throw new Error("User ID not found");
        }

        const response = await axios.get(
          `http://localhost:5000/api/coupons/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCoupons(response.data);
      } catch (err) {
        setError("Failed to load coupons: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  if (loading)
    return (
      <div className="text-center py-8 text-gray-500">Loading coupons...</div>
    );
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (coupons.length === 0)
    return (
      <div className="text-center py-8 text-gray-400">No active coupons.</div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12 relative">
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Coupons
        </span>
        <div className="absolute bottom-0 left-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-x-1/2 translate-y-4"></div>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coupons.map((coupon) => (
          <div
            key={coupon._id}
            className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
          >
            <div className="flex flex-col h-full">
              {/* Expiration Ribbon */}
              <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg">
                Expires: {new Date(coupon.validUntil).toLocaleDateString()}
              </div>

              <div className="flex-1">
                <div className="mb-4">
                  <button
                    className="w-full text-left hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(coupon.code);
                      setCopiedCouponId(coupon._id);
                      setTimeout(() => setCopiedCouponId(null), 2000);
                    }}
                  >
                    <h3 className="text-2xl font-black text-gray-900 mb-2 font-mono tracking-tighter flex items-center justify-between">
                      <span>{coupon.code}</span>
                      {copiedCouponId === coupon._id ? (
                        <CheckIcon className="w-6 h-6 text-green-500 animate-pulse" />
                      ) : (
                        <DocumentDuplicateIcon className="w-6 h-6 text-gray-400 hover:text-blue-400 transition-colors" />
                      )}
                    </h3>
                  </button>
                  <p className="text-gray-600 font-medium">
                    {coupon.promotion?.title || "Special Discount"}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-3xl font-bold text-blue-600">
                      {coupon.percentage}%
                    </span>
                    <span className="text-gray-600 font-medium">OFF</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-gray-500">
                  <UserIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Issued by: {coupon.createdBy?.name || "Store Admin"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDiscounts;
