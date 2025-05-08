import { Outlet, Link, useLocation } from 'react-router-dom';

const DashboardLayout = () => {
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/admin';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex">
      <aside className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-10 hidden md:block">
        <div className="flex flex-col h-full p-6">
          <div className="text-2xl font-extrabold text-blue-700 mb-8 tracking-tight">
            Admin Dashboard
          </div>
          <nav className="flex-1 flex flex-col gap-4">
            <Link
              to="/admin/dashboard"
              className={`font-semibold rounded px-3 py-2 transition ${
                location.pathname === '/dashboard'
                  ? 'text-blue-700 bg-blue-50'
                  : 'hover:bg-blue-50'
              }`}
            >
              Overview
            </Link>
            <Link
              to="/admin/discountlist"
              className={`rounded px-3 py-2 transition ${
                location.pathname === '/discountlist'
                  ? 'text-blue-700 bg-blue-50'
                  : 'hover:bg-blue-50'
              }`}
            >
              Discounts
            </Link>
            <Link
              to="/admin/promotionsList"
              className={`rounded px-3 py-2 transition ${
                location.pathname === '/promotionsList'
                  ? 'text-blue-700 bg-blue-50'
                  : 'hover:bg-blue-50'
              }`}
            >
              Promotions
            </Link>
            <Link
              to="/admin/coupons"
              className={`rounded px-3 py-2 transition ${
                location.pathname === '/admin/coupons'
                  ? 'text-blue-700 bg-blue-50'
                  : 'hover:bg-blue-50'
              }`}
            >
              Coupon Manager
            </Link>
            <Link
              to="/admin/tickets"
              className={`rounded px-3 py-2 transition ${
                location.pathname === '/admin/tickets'
                  ? 'text-blue-700 bg-blue-50'
                  : 'hover:bg-blue-50'
              }`}
            >
              Tickets
            </Link>
            <Link
              to="/admin/adminreports"
              className={`rounded px-3 py-2 transition ${
                location.pathname === '/admin/adminreports'
                  ? 'text-blue-700 bg-blue-50'
                  : 'hover:bg-blue-50'
              }`}
            >
              Admin Reports
            </Link>
            <Link
              to="/admin/customizations"
              className={`rounded px-3 py-2 transition ${
                location.pathname === '/admin/customizations'
                  ? 'text-blue-700 bg-blue-50'
                  : 'hover:bg-blue-50'
              }`}
            >
              Customizations
            </Link>
          </nav>
          <div className="mt-auto pt-6 border-t">
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 md:ml-64 min-h-screen p-6 bg-white rounded-tl-3xl shadow-xl border-l border-blue-100">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
