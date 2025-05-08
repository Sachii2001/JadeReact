import { useEffect, useState } from "react";

export default function UserCustomizations() {
  const [customizations, setCustomizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`http://localhost:5000/api/customizations?userId=${user._id}`);
        const data = await res.json();
        setCustomizations(data);
      } catch (err) {
        setCustomizations([]);
      } finally {
        setLoading(false);
      }
    }
    if (user?._id) fetchData();
    else setLoading(false);
  }, [user?._id]);

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-8 animate-fadeIn">
        <h2 className="text-3xl font-extrabold mb-8 text-blue-700 text-center">My Customizations</h2>
        {customizations.length === 0 ? (
          <div className="text-center text-gray-500">No customizations found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-blue-800 text-lg">
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Material</th>
                  <th className="px-4 py-2">Size</th>
                  <th className="px-4 py-2">Theme</th>
                  <th className="px-4 py-2">Price (LKR)</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Placed</th>
                </tr>
              </thead>
              <tbody>
                {customizations.map((c) => (
                  <tr key={c._id} className="bg-blue-50 hover:bg-blue-100 rounded-xl shadow transition">
                    <td className="px-4 py-2 font-semibold text-blue-900">{c.productName}</td>
                    <td className="px-4 py-2">{c.material}</td>
                    <td className="px-4 py-2">{c.size}</td>
                    <td className="px-4 py-2">{c.theme}</td>
                    <td className="px-4 py-2 font-bold text-blue-700">₨{c.price?.toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <span className={`px-3 py-1 rounded-full text-white text-sm font-bold shadow-lg transition
                        ${c.status === 'Pending' ? 'bg-yellow-500' :
                          c.status === 'In Progress' ? 'bg-blue-500' :
                          c.status === 'Completed' ? 'bg-green-600' : 'bg-gray-400'}`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style>{`
        .animate-fadeIn { animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(.98);} to { opacity: 1; transform: scale(1);} }
      `}</style>
    </div>
  );
}
