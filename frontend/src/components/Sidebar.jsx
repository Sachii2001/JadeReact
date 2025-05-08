import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="w-64 bg-gray-800 text-white h-screen p-4">
            <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
            <nav className="space-y-2">
                <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) =>
                        `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                    }
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/admin/promotions"
                    className={({ isActive }) =>
                        `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                    }
                >
                    Manage Promotions
                </NavLink>
                <NavLink
                    to="/admin/discounts"
                    className={({ isActive }) =>
                        `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                    }
                >
                    Manage Discounts
                </NavLink>
                <NavLink
                    to="/admin/tickets"
                    className={({ isActive }) =>
                        `block p-2 rounded ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
                    }
                >
                    Manage Tickets
                </NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;


