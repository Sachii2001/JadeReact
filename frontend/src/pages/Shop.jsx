import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { getDiscounts } from "../services/api.js";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Shop = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const promoId = query.get("promo");
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [couponError, setCouponError] = useState("");

  // Get current user from localStorage (if logged in)
  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const fetchPromotion = async () => {
      setLoading(true);
      try {
        if (promoId) {
          const res = await axios.get(
            `http://localhost:5000/api/promotions/${promoId}`
          );
          setPromotion(res.data);
          // Use mock data for products based on promotion
          // You can customize this logic to show different products for different promotions
          let mockProducts = [];
          if (promoId === "681087acb087329a904bd80c") {
            // "Spring Elegance" Promotion - Floral, pastel, nature-inspired jewelry
            mockProducts = [
              {
                id: 1,
                name: "Rose Gold Blossom Necklace",
                price: 320,
                size: "18 inch",
                material: "Rose Gold",
                theme: "Floral",
                image:
                  "https://ae-pic-a1.aliexpress-media.com/kf/Sedf3fd5f1eb34422869a2aeb21bf4d24m.jpg_220x220q75.jpg_.avif",
              },
              {
                id: 2,
                name: "Daisy Pearl Studs",
                price: 150,
                size: "Small",
                material: "Pearl & Silver",
                theme: "Nature",
                image:
                  "https://ae-pic-a1.aliexpress-media.com/kf/S90eb175a06b84a33a9f8fd967a453eccH.jpg_220x220q75.jpg_.avif",
              },
              {
                id: 3,
                name: "Pastel Gemstone Bracelet",
                price: 210,
                size: "7.5 inch",
                material: "Multi-gemstone",
                theme: "Pastel",
                image:
                  "https://www.pomegranate-london.co.uk/cdn/shop/products/greta-pastel-gemstone-bracelet_1728x.png?v=1675707147",
              },
              {
                id: 4,
                name: "Leaf Motif Ring",
                price: 180,
                size: "7 US",
                material: "Sterling Silver",
                theme: "Nature",
                image:
                  "https://ae-pic-a1.aliexpress-media.com/kf/S96dfb0a92ec5429e9bba68286ab90e00h.jpg_220x220q75.jpg_.avif",
              },
              {
                id: 5,
                name: "Cherry Blossom Brooch",
                price: 260,
                size: "3x2 cm",
                material: "Enamel & Gold-plated",
                theme: "Floral",
                image:
                  "https://ae-pic-a1.aliexpress-media.com/kf/S678cb81dedaf453ba232cb67d70da2fe8.jpg_220x220q75.jpg_.avif",
              },
              {
                id: 6,
                name: "Butterfly Charm Anklet",
                price: 140,
                size: "9 inch",
                material: "Silver",
                theme: "Nature",
                image:
                  "https://ae-pic-a1.aliexpress-media.com/kf/S4533635b754245119f9f3d2cf67092902.jpg_220x220q75.jpg_.avif",
              },
            ];
          } else if (promoId === "681087acb087329a904bd80d") {
            // "Royal Heritage" Promotion - Regal, gemstone, luxury-inspired jewelry
            mockProducts = [
              {
                id: 7,
                name: "Emerald Queen Necklace",
                price: 680,
                size: "20 inch",
                material: "Emerald & Gold",
                theme: "Regal",
                image:
                  "https://ae-pic-a1.aliexpress-media.com/kf/HTB1aRoVXLfsK1RjSszbq6AqBXXaH.jpg_220x220q75.jpg_.avif",
              },
              {
                id: 8,
                name: "Sapphire Crown Ring",
                price: 520,
                size: "8 US",
                material: "Sapphire & Platinum",
                theme: "Royal",
                image:
                  "https://ae-pic-a1.aliexpress-media.com/kf/S4d3b3052b6c243f08154f21134ac2b8fv/48x48.png_.avif",
              },
              {
                id: 9,
                name: "Ruby Regal Bracelet",
                price: 470,
                size: "7 inch",
                material: "Ruby & Gold",
                theme: "Luxury",
                image:
                  "https://ae-pic-a1.aliexpress-media.com/kf/S05016e7187074fe68f1ba410ea01e5852.jpg_220x220q75.jpg_.avif",
              },
              {
                id: 10,
                name: "Diamond Tiara Studs",
                price: 430,
                size: "Medium",
                material: "Diamond & White Gold",
                theme: "Royal",
                image:
                  "https://ae-pic-a1.aliexpress-media.com/kf/S609c5d8aed3745c29d569dc898bd3f592.jpg_220x220q75.jpg_.avif",
              },
              {
                id: 11,
                name: "Opal Heritage Brooch",
                price: 390,
                size: "4x3 cm",
                material: "Opal & Silver",
                theme: "Heritage",
                image:
                  "https://ae-pic-a1.aliexpress-media.com/kf/S96231bb04ed647deafb1a44c35f9ac792.jpg_220x220q75.jpg_.avif",
              },
              {
                id: 12,
                name: "Garnet Majestic Anklet",
                price: 310,
                size: "10 inch",
                material: "Garnet & Gold-plated",
                theme: "Luxury",
                image:
                  "https://ae-pic-a1.aliexpress-media.com/kf/H8b4daf2c60584b8398b1b9a99db00d6c4.jpg_220x220q75.jpg_.avif",
              },
            ];
          } else {
            // "Minimalist Chic" Promotion - Sleek, modern, everyday-wear jewelry
            mockProducts = [
              {
                id: 13,
                name: "Bar Pendant Necklace",
                price: 120,
                size: "18 inch",
                material: "Sterling Silver",
                theme: "Minimalist",
                image:
                  "https://image.brilliantearth.com/media/product_images/KN/BE487619-S_white_top.jpg",
              },
              {
                id: 14,
                name: "Tiny Hoop Earrings",
                price: 99,
                size: "Small",
                material: "Gold-plated",
                theme: "Chic",
                image:
                  "https://cdn.shopify.com/s/files/1/0797/3637/3533/files/1-BoldSmallHoops-YG-Stack_221.jpg?v=1731436447&width=600&crop=center",
              },
              {
                id: 15,
                name: "Simple Chain Bracelet",
                price: 110,
                size: "7 inch",
                material: "Stainless Steel",
                theme: "Minimalist",
                image:
                  "https://edgeofember.com/cdn/shop/products/Ballchainbracelet1.jpg?v=1650449063&width=1445",
              },
              {
                id: 16,
                name: "Geometric Signet Ring",
                price: 180,
                size: "7 US",
                material: "Silver",
                theme: "Modern",
                image:
                  "https://ae-pic-a1.aliexpress-media.com/kf/Sed92570884604b4b9a7f3f4f4ba08118P.jpg_220x220q75.jpg_.avif",
              },
              {
                id: 17,
                name: "Infinity Studs",
                price: 105,
                size: "Tiny",
                material: "White Gold",
                theme: "Minimalist",
                image:
                  "https://ae-pic-a1.aliexpress-media.com/kf/S2cc578f2b3bf47e099b849548057373eu.jpg_220x220q75.jpg_.avif",
              },
              {
                id: 18,
                name: "Open Circle Pendant",
                price: 135,
                size: "2 cm",
                material: "Gold-plated",
                theme: "Modern",
                image:
                  "https://ae-pic-a1.aliexpress-media.com/kf/Sa20f32ab841241febcc43593d5431d86l.jpg_220x220q75.jpg_.avif",
              },
            ];
          }
          setProducts(mockProducts);
        }
        // Fetch discounts (now user-specific from backend)
        async function fetchDiscounts() {
          try {
            const data = await getDiscounts();
            setDiscounts(data);
          } catch (err) {
            setError("Failed to load discounts");
          }
        }
        fetchDiscounts();
      } catch (err) {
        setError("Failed to load promotion or discounts.");
      } finally {
        setLoading(false);
      }
    };
    fetchPromotion();
  }, [promoId]);

  // Helper to calculate days left
  function getDaysLeft(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }

  const handleCustomize = (product) => {
    navigate(`/customize/${product.id}`, {
      state: {
        productDetails: product,
      },
    });
  };

  // Helper to get the best (highest) valid discount for all products
  function getBestDiscount() {
    const now = new Date();
    // Only consider not expired discounts
    const validDiscounts = discounts.filter(
      (d) => d.validUntil && new Date(d.validUntil) > now && d.percentage > 0
    );
    if (validDiscounts.length === 0) return null;
    // Return the highest percentage discount
    return validDiscounts.reduce(
      (max, d) => (d.percentage > max ? d.percentage : max),
      0
    );
  }

  // Helper to calculate discounted price
  function getDiscountedPrice(price, discountPercent) {
    if (!discountPercent || discountPercent <= 0) return price;
    return Math.round(price * (1 - discountPercent / 100));
  }

  // Coupon code validation logic (use only backend-filtered discounts)
  async function handleApplyCoupon() {
    setCouponError("");
    setAppliedDiscount(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/coupons/validate",
        { code: coupon.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.valid) {
        setAppliedDiscount(res.data.coupon);
        setCouponError("");
      } else {
        setAppliedDiscount(null);
        setCouponError(res.data.message || "Invalid or expired coupon code");
      }
    } catch (err) {
      setAppliedDiscount(null);
      if (err.response && err.response.data && err.response.data.message) {
        setCouponError(err.response.data.message);
      } else {
        setCouponError("Error validating coupon code");
      }
    }
  }

  // User Logout
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <span className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></span>
        <div className="text-gray-500">Loading shop...</div>
      </div>
    );
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!promotion)
    return (
      <div className="text-center py-8 text-gray-400">Promotion not found.</div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
      <div className="flex justify-end mb-4">
        {currentUser && (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
          >
            Logout
          </button>
        )}
      </div>
      {/* Promotion Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 py-12 mb-10 shadow-xl">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">
              {promotion.title}
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-4 max-w-2xl">
              {promotion.description}
            </p>
            <div className="flex items-center text-blue-200 text-sm gap-4 mb-2">
              <span className="bg-blue-900/30 px-3 py-1 rounded-full font-semibold">
                Start: {new Date(promotion.startDate).toLocaleDateString()}
              </span>
              <span className="bg-blue-900/30 px-3 py-1 rounded-full font-semibold">
                End: {new Date(promotion.endDate).toLocaleDateString()}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold shadow mb-2">
                {getDaysLeft(promotion.endDate)} days left
              </span>
            </div>
          </div>
          <div className="hidden md:block flex-1 text-center">
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
              alt="Jewellery"
              className="w-64 h-64 object-cover rounded-3xl shadow-2xl border-4 border-white/40 mx-auto"
            />
          </div>
        </div>
      </div>
      {/* Coupon input */}
      <div className="max-w-md mx-auto mb-8 flex gap-2">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={handleApplyCoupon}
        >
          Apply
        </button>
      </div>
      {couponError && (
        <div className="text-red-500 text-center mb-4">{couponError}</div>
      )}
      {appliedDiscount && (
        <div className="text-green-700 text-center mb-4 font-bold">
          Coupon applied: {appliedDiscount.code} ({appliedDiscount.percentage}%
          OFF)
        </div>
      )}
      {/* Product Grid */}
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold mb-6 text-blue-900 text-center tracking-tight">
          Products in this Promotion
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const discountPercent = appliedDiscount
              ? appliedDiscount.percentage
              : null;
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-xl border border-blue-100 hover:scale-[1.03] hover:shadow-2xl transition-all duration-200 overflow-hidden flex flex-col items-center p-6 group relative"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-36 h-36 object-cover rounded-xl mb-4 border-2 border-blue-50 group-hover:border-blue-300 transition"
                />
                <div className="font-semibold text-lg text-gray-800 mb-1 text-center line-clamp-1">
                  {product.name}
                </div>
                <div className="text-gray-500 text-sm mb-1">
                  {product.theme} | {product.material}
                </div>
                <div className="text-gray-500 text-sm mb-2">{product.size}</div>
                {discountPercent ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-400 line-through text-base">
                        LKR {product.price}
                      </span>
                      <span className="text-green-600 font-extrabold text-2xl">
                        LKR {getDiscountedPrice(product.price, discountPercent)}
                      </span>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-bold shadow mb-2">
                      {discountPercent}% OFF
                    </span>
                  </>
                ) : (
                  <div className="text-blue-600 font-extrabold text-2xl mb-2">
                    LKR {product.price}
                  </div>
                )}
                <div className="w-full space-y-2">
                  <button
                    onClick={() => handleCustomize(product)}
                    className="w-full  cursor-pointer customize-btn bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-gray-900 px-5 py-2.5 rounded-xl font-bold shadow-lg border-2 border-yellow-200 hover:from-yellow-500 hover:to-yellow-400 hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                  >
                    Customize
                  </button>
                  <button 
                    className="w-full cursor-pointer add-to-cart-btn py-2.5 bg-gradient-to-r from-blue-800 via-purple-700 to-indigo-700 text-white rounded-xl text-base font-bold shadow-lg border-2 border-blue-200 hover:from-purple-800 hover:to-blue-900 hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Shop;
