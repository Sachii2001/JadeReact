import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Customize = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [error, setError] = useState('');

  // Calculate price based on material and theme
  function getCustomizedPrice() {
    if (!product) return 0;
    let price = product.price;
    // Material price modifiers
    if (selectedMaterial) {
      if (selectedMaterial.toLowerCase().includes('gold')) price += 150;
      else if (selectedMaterial.toLowerCase().includes('silver')) price += 60;
      else if (selectedMaterial.toLowerCase().includes('platinum')) price += 200;
      else if (selectedMaterial.toLowerCase().includes('pearl')) price += 90;
      else if (selectedMaterial.toLowerCase().includes('gemstone')) price += 120;
    }
    // Theme price modifiers
    if (selectedTheme) {
      if (selectedTheme.toLowerCase() === 'vintage') price += 80;
      else if (selectedTheme.toLowerCase() === 'modern') price += 40;
      else if (selectedTheme.toLowerCase() === 'luxury') price += 200;
      else if (selectedTheme.toLowerCase() === 'floral') price += 60;
    }
    return price;
  }

  useEffect(() => {
    // Try to get product from navigation state first
    if (location.state && location.state.productDetails) {
      setProduct({
        ...location.state.productDetails,
        options: {
          materials: ['Rose Gold', 'Yellow Gold', 'White Gold', location.state.productDetails.material],
          sizes: ['16 inch', '18 inch', '20 inch', location.state.productDetails.size],
          themes: ['Floral', 'Modern', 'Vintage', location.state.productDetails.theme]
        }
      });
      return;
    }
    // fallback: show error
    setError('Product details not found. Please return to the shop page.');
  }, [productId, location.state]);

  const handleCustomize = async () => {
    if (!selectedMaterial || !selectedSize || !selectedTheme) {
      toast.error('Please select all customization options');
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await fetch("http://localhost:5000/api/customizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          material: selectedMaterial,
          size: selectedSize,
          theme: selectedTheme,
          price: getCustomizedPrice(),
          userId: user?._id,
          userName: user?.name
        })
      });
      if (res.ok) {
        toast.success("Customization saved!");
        setTimeout(() => navigate("/my-customizations"), 1200); // short delay for toast
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to save customization");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    }
  };

  if (error) {
    return <div className="text-red-500 p-8">{error}</div>;
  }
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col items-center justify-center py-8 px-2">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-fadeIn">
        {/* Preview Section */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-100 to-white relative">
          <h2 className="text-2xl font-bold mb-4 tracking-tight text-blue-700">Live Preview</h2>
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-xl shadow-lg bg-white flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-60 h-60 md:w-80 md:h-80 object-contain transition-all duration-300 ease-in-out drop-shadow-xl"
              style={{ filter: selectedTheme === 'Vintage' ? 'sepia(0.5)' : selectedTheme === 'Modern' ? 'contrast(1.2)' : 'none' }}
            />
            {/* Overlay for Material */}
            <div className="absolute top-6 left-6 bg-white/80 text-blue-900 font-semibold px-3 py-1 rounded shadow-md animate-fadeInUp">
              {selectedMaterial || product.material}
            </div>
            {/* Overlay for Size */}
            <div className="absolute top-6 right-6 bg-white/80 text-blue-900 font-semibold px-3 py-1 rounded shadow-md animate-fadeInUp">
              {selectedSize || product.size}
            </div>
            {/* Overlay for Theme */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-blue-500/80 text-white font-semibold px-4 py-1 rounded-full shadow animate-fadeInUp">
              {selectedTheme || product.theme}
            </div>
          </div>
          <div className="mt-6 text-center">
            <span className="text-xl font-bold text-blue-600">
              ₨{getCustomizedPrice().toLocaleString()}
            </span>
            <div className="text-xs text-gray-500 mt-1">Price updates with your choices</div>
          </div>
        </div>
        {/* Customization Section */}
        <div className="flex-1 flex flex-col justify-center p-8 bg-white">
          <h1 className="text-3xl font-extrabold mb-8 text-blue-700">Customize <span className="text-blue-500">{product.name}</span></h1>
          <div className="space-y-6">
            <div>
              <label className="block text-base font-medium mb-2 text-blue-700">Material</label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="">Select Material</option>
                {product.options.materials.map((material) => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-base font-medium mb-2 text-blue-700">Size</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="">Select Size</option>
                {product.options.sizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-base font-medium mb-2 text-blue-700">Theme</label>
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="">Select Theme</option>
                {product.options.themes.map((theme) => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
            </div>
            <div className="mt-8">
              <button
                onClick={handleCustomize}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-6 rounded-xl shadow-lg text-lg font-bold hover:scale-105 transition"
              >
                Confirm Customization
              </button>
            </div>
            <div className="mt-8 p-4 bg-blue-50 rounded-xl shadow-inner">
              <h3 className="text-lg font-bold mb-2 text-blue-700">Current Selections</h3>
              <ul className="text-blue-900 space-y-1">
                <li><span className="font-semibold">Material:</span> {selectedMaterial || product.material}</li>
                <li><span className="font-semibold">Size:</span> {selectedSize || product.size}</li>
                <li><span className="font-semibold">Theme:</span> {selectedTheme || product.theme}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Animations (TailwindCSS custom classes or add to global styles) */}
      <style>{`
        .animate-fadeIn { animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both; }
        .animate-fadeInUp { animation: fadeInUp 0.6s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(.95);} to { opacity: 1; transform: scale(1);} }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(18px);} to { opacity: 1; transform: translateY(0);} }
      `}</style>
    </div>
  );
};

export default Customize;
