import { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

const AdminCouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    percentage: 0,
    validUntil: "",
  });
  const [message, setMessage] = useState("");
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const [userSearch, setUserSearch] = useState("");

  // Filter users by search (define before using in assignableUsers)
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // --- Assign Users to Discount ---
  const [assignSelectedDiscount, setAssignSelectedDiscount] = useState("");
  const [assignSelectedUsers, setAssignSelectedUsers] = useState([]);
  // Helper: filter assignable users (not already assigned)
  const assignableUsers = filteredUsers.filter((u) => {
    const discountUsers = users.filter(
      (u) => u.discount && u.discount._id === assignSelectedDiscount
    );
    const assignedToAll =
      discountUsers.length > 0 &&
      discountUsers.every((u) => u.discount._id === assignSelectedDiscount);
    return !assignedToAll;
  });

  // Fetch all coupons and users
  useEffect(() => {
    fetchCoupons();
    fetchUsers();
    fetchDiscounts();
  }, []);

  async function fetchCoupons() {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/coupons", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCoupons(res.data);
  }
  async function fetchUsers() {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/coupons/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  }
  async function fetchDiscounts() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/discounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiscounts(res.data);
    } catch (err) {
      toast.error("Failed to fetch discounts");
    }
  }

  // Create a new coupon
  async function handleCreateCoupon(e) {
    e.preventDefault();
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/coupons",
        { ...newCoupon },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCoupon({ code: "", percentage: 0, validUntil: "" });
      fetchCoupons();
      setMessage("Coupon created!");
    } catch (err) {
      setMessage("Error creating coupon");
    }
  }

  // Assign handler
  async function handleAssignUsers(e) {
    e.preventDefault();
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!assignSelectedDiscount) {
        toast.error("Please select a discount.");
        return;
      }
      if (assignSelectedUsers.length === 0) {
        toast.error("Please select at least one user.");
        return;
      }
      // Assign users to discount, not promotion
      console.log("Assigning users to discount (creating coupons for each user):", {
        discountId: assignSelectedDiscount,
        userIds: assignSelectedUsers,
      });
      await axios.post(
        "http://localhost:5000/api/coupons/assign-users-to-discount",
        { discountId: assignSelectedDiscount, userIds: assignSelectedUsers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Coupons created for users!");
      setAssignSelectedUsers([]);
    } catch (err) {
      setMessage("Error assigning users to discount");
      if (err.response) {
        toast.error(`Error: ${err.response.data.message}`);
        console.error("Backend error:", err.response.data);
      } else {
        toast.error("Unknown error assigning users to discount.");
      }
    }
  }

  // Admin Logout
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  return (
    <div className="container mx-auto p-6">
      <Toaster position="top-right" />
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4">Admin Coupon Manager</h2>
      {message && <div className="mb-4 text-blue-700">{message}</div>}

      {/* User Table with Search and Selection */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold">All Users</h3>
          <input
            type="text"
            className="border rounded px-3 py-1 w-64"
            placeholder="Search users by name or email..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto rounded shadow border">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Select</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-3 text-center text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSelected = assignSelectedUsers.includes(u._id);
                  return (
                    <tr
                      key={u._id}
                      className={`border-b hover:bg-blue-50 transition cursor-pointer ${
                        isSelected ? "bg-blue-100" : ""
                      }`}
                      onClick={() => {
                        if (isSelected) {
                          setAssignSelectedUsers((prev) =>
                            prev.filter((id) => id !== u._id)
                          );
                        } else {
                          setAssignSelectedUsers((prev) => [...prev, u._id]);
                        }
                      }}
                    >
                      <td className="p-3 font-medium">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">
                        <button
                          type="button"
                          className={`border rounded px-2 py-1 ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-white text-blue-600"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isSelected) {
                              setAssignSelectedUsers((prev) =>
                                prev.filter((id) => id !== u._id)
                              );
                            } else {
                              setAssignSelectedUsers((prev) => [
                                ...prev,
                                u._id,
                              ]);
                            }
                          }}
                        >
                          {isSelected ? "Deselect" : "Select"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Users to Discount */}
      <form onSubmit={handleAssignUsers} className="mb-8 space-y-2">
        <div>
          <label className="block">Select Discount</label>
          <select
            className="border p-2 rounded w-full"
            value={assignSelectedDiscount}
            onChange={(e) => {
              setAssignSelectedDiscount(e.target.value);
              setAssignSelectedUsers([]);
            }}
            required
          >
            <option value="">-- Select Discount --</option>
            {discounts.map((d) => (
              <option key={d._id} value={d._id}>
                {d.code} ({d.percentage}% off, valid until {new Date(d.validUntil).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>
        {/* No select dropdown for users, use table above */}
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          type="submit"
          disabled={
            !assignSelectedDiscount || assignSelectedUsers.length === 0
          }
          tabIndex={0}
        >
          Assign Users
        </button>
      </form>
      {/* Coupon List */}
      <div>
        <h3 className="text-xl font-semibold mb-2">All Coupons</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Code</th>
              <th className="p-2 border">Percentage</th>
              <th className="p-2 border">Valid Until</th>
              <th className="p-2 border">Assigned Users</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id}>
                <td className="p-2 border">{c.code}</td>
                <td className="p-2 border">{c.percentage}%</td>
                <td className="p-2 border">
                  {new Date(c.validUntil).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  {c.assignedTo && c.assignedTo.length > 0 ? (
                    <ul>
                      {c.assignedTo.map((u) => (
                        <li key={u._id}>
                          {u.name} ({u.email})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCouponManager;
