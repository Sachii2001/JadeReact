import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import AdminTicketForm from "../components/tickets/AdminTicketForm";

const TicketManage = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTickets, setFilteredTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tickets", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTickets(response.data);
      setFilteredTickets(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to fetch tickets");
      setLoading(false);
    }
  };

  const handleUpdateSuccess = () => {
    setSelectedTicket(null);
    fetchTickets();
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredTickets(tickets);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tickets.filter(
      (ticket) =>
        ticket.subject.toLowerCase().includes(query) ||
        ticket.description.toLowerCase().includes(query) ||
        ticket.category.toLowerCase().includes(query) ||
        ticket.status.toLowerCase().includes(query) ||
        (ticket.customerId?.name || "").toLowerCase().includes(query)
    );
    setFilteredTickets(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Manage Tickets
        </h2>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md font-medium"
            >
              Search
            </button>
          </div>
        </div>

        <div className="mx-auto">
          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : selectedTicket ? (
            <AdminTicketForm
              ticket={selectedTicket}
              onUpdateSuccess={handleUpdateSuccess}
              
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-1 max-w-4xl mx-auto">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">
                    No tickets found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try searching with different keywords.
                  </p>
                </div>
              ) : (
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket._id}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {ticket.subject}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {ticket.description}
                        </p>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                            <span className="font-medium">Category:</span>
                            {ticket.category}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                            <span className="font-medium">Status:</span>
                            {ticket.status}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                            <span className="font-medium">Customer:</span>
                            {ticket.customerId?.name || "Unknown"}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="sm:self-start flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default TicketManage;
