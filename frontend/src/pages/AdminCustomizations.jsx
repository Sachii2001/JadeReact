import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { MagnifyingGlassIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminCustomizations() {
  const [customizations, setCustomizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomizations();
  }, []);

  const fetchCustomizations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customizations');
      setCustomizations(res.data);
    } catch (err) {
      toast.error('Failed to fetch customizations');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/customizations/${id}/status`,
        {
          status: newStatus,
        }
      );
      toast.success('Status updated successfully');
      fetchCustomizations();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;

  // Filter customizations based on search term
  const filteredCustomizations = customizations.filter(custom => 
    custom.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    custom.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    custom.material?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    custom.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add header with logo
    doc.setFontSize(20);
    doc.setTextColor(0, 51, 102);
    doc.text('Customization Orders Report', 15, 20);
    
    // Add report metadata
    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, 30);
    
    // Add summary statistics
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const totalOrders = filteredCustomizations.length;
    const pendingOrders = filteredCustomizations.filter(c => c.status === 'Pending').length;
    const inProgressOrders = filteredCustomizations.filter(c => c.status === 'In Progress').length;
    const completedOrders = filteredCustomizations.filter(c => c.status === 'Completed').length;
    
    doc.text(`Total Orders: ${totalOrders}`, 15, 45);
    doc.text(`Pending: ${pendingOrders}`, 15, 52);
    doc.text(`In Progress: ${inProgressOrders}`, 15, 59);
    doc.text(`Completed: ${completedOrders}`, 15, 66);
    
    // Add table
    const tableData = filteredCustomizations.map(custom => [
      custom.userName,
      custom.productName,
      `${custom.material} (${custom.size})`,
      `₨${custom.price?.toLocaleString()}`,
      custom.status
    ]);
    
    autoTable(doc, {
      startY: 80,
      head: [['Customer', 'Product', 'Details', 'Price', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 51, 102],
        textColor: 255,
        fontSize: 10
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });
    
    // Save the PDF
    doc.save('customization-report.pdf');
  };

  // Calculate status counts for the chart
  const statusCounts = {
    Pending: filteredCustomizations.filter(c => c.status === 'Pending').length,
    'In Progress': filteredCustomizations.filter(c => c.status === 'In Progress').length,
    Completed: filteredCustomizations.filter(c => c.status === 'Completed').length,
  };

  const chartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(255, 206, 86, 0.8)', // Yellow for Pending
          'rgba(54, 162, 235, 0.8)', // Blue for In Progress
          'rgba(75, 192, 192, 0.8)', // Green for Completed
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Customization Orders Status Distribution',
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Manage Customizations</h2>
        
        <div className="flex gap-4 w-full md:w-auto">
          {/* Modern Search Bar */}
          <div className="relative flex-1 md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by customer, product, material or status..."
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Generate Report Button */}
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Customizations Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Customizations</p>
              <p className="text-2xl font-bold text-blue-600">{filteredCustomizations.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        {/* Completed Orders Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Completed Orders</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredCustomizations.filter(c => c.status === 'Completed').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* In Progress Orders Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">
                {filteredCustomizations.filter(c => c.status === 'In Progress').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pending Orders Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-purple-600">
                {filteredCustomizations.filter(c => c.status === 'Pending').length}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
        <div className="max-w-md mx-auto h-[300px] flex items-center justify-center">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCustomizations.map((custom) => (
              <tr key={custom._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {custom.userName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {custom.productName}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    <p>Material: {custom.material}</p>
                    <p>Size: {custom.size}</p>
                    <p>Theme: {custom.theme}</p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    ₨{custom.price?.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      custom.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : custom.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {custom.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    className="rounded-full border-2 border-blue-300 bg-white px-3 py-1 text-sm font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition duration-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
                    value={custom.status}
                    onChange={(e) => updateStatus(custom._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
