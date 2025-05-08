import axios from "axios";

// Get discounts (send JWT if available)
export async function getDiscounts() {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios.get("http://localhost:5000/api/discounts", { headers });
  return response.data;
}

// Get all promotions (for coupon creation UI)
export async function getPromotions() {
  const response = await axios.get("http://localhost:5000/api/promotions");
  return response.data;
}
