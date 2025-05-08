import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navLinks = [
    { label: "Shop", to: "/shop" },
    { label: "Promotions", to: "/user-promotions" },
    { label: "Discounts", to: "/user-discounts" },
    { label: "Raise Ticket", to: "/ticket-raise" },
    { label: "View Tickets", to: "/ticket-status" },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-700 to-purple-700 px-4 py-3 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/shop" className="text-2xl font-extrabold text-white tracking-tight drop-shadow-lg">
          Jewellery Shop
        </Link>
        <nav className="flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-white px-3 py-2 rounded-md font-semibold transition hover:bg-white/20 ${
                location.pathname === link.to ? "bg-white/30" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
