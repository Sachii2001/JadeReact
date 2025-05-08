import { useEffect, useState } from "react";
import { getDiscounts, getPromotions } from "../services/api.js";
import StatsCard from "../components/ui/StatsCard";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    discounts: 0,
    promotions: 0,
    isLoading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [discounts, promotions] = await Promise.all([
          getDiscounts(),
          getPromotions(),
        ]);

        // Log the data to see if it's being fetched properly
        console.log("Discounts:", discounts);
        console.log("Promotions:", promotions);

        setStats({
          discounts: discounts.length,
          promotions: promotions.length,
          isLoading: false,
        });
      } catch (error) {
        setStats((prev) => ({ ...prev, isLoading: false }));
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatsCard
          title="Active Discounts"
          value={stats.discounts}
          isLoading={stats.isLoading}
          icon={<DiscountIcon />}
          action={
            <Link to="/discountlist">
              <Button variant="outline" size="sm">
                Manage Discounts
              </Button>
            </Link>
          }
        />

        <StatsCard
          title="Active Promotions"
          value={stats.promotions}
          isLoading={stats.isLoading}
          icon={<PromotionIcon />}
          action={
            <Link to="/promotionsList/">
              <Button variant="outline" size="sm">
                Manage Promotions
              </Button>
            </Link>
          }
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/discount">
            <Button>Create New Discount</Button>
          </Link>
          <Link to="/promotions">
            <Button>Create New Promotion</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const DiscountIcon = () => (
  <svg
    className="w-6 h-6 text-blue-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
    />
  </svg>
);

const PromotionIcon = () => (
  <svg
    className="w-6 h-6 text-purple-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

export default DashboardPage;
