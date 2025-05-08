import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800 mb-6 drop-shadow-lg">Welcome to Jewellery Shop</h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Discover unique collections, exclusive promotions, and special discounts on fine jewellery. Shop the latest trends or raise a support ticket if you need help.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
          <Link to="/shop" className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow transition">Shop Now</Link>
          <Link to="/user-promotions" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow transition">View Promotions</Link>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/ticket-raise" className="border border-blue-700 text-blue-700 hover:bg-blue-50 font-semibold px-8 py-3 rounded-lg text-lg transition">Raise Ticket</Link>
          <Link to="/ticket-status" className="border border-purple-600 text-purple-700 hover:bg-purple-50 font-semibold px-8 py-3 rounded-lg text-lg transition">View Tickets</Link>
        </div>
      </div>
    </main>
  );
};

export default Homepage;
