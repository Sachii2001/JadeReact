import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas/dist/html2canvas.min.js";
import { toast } from "react-hot-toast";
import Button from "../ui/Button";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminReports = () => {
  const [discountUsage, setDiscountUsage] = useState({
    labels: [],
    datasets: [],
  });
  const [promotionPerformance, setPromotionPerformance] = useState({
    labels: [],
    datasets: [],
  });
  const [userActivity, setUserActivity] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const headers = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      };

      const [discountRes, promoRes, userRes] = await Promise.all([
        axios.get("http://localhost:5000/api/reports/discounts", headers),
        axios.get("http://localhost:5000/api/reports/promotions", headers),
        axios.get("http://localhost:5000/api/reports/users", headers),
      ]);

      setDiscountUsage(discountRes.data);
      setPromotionPerformance(promoRes.data);
      setUserActivity(userRes.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = (title) => ({
    responsive: true,
    plugins: {
      title: { display: true, text: title },
    },
    scales: { y: { beginAtZero: true } },
  });

  const generatePDF = async () => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Header with company branding
      doc.setFontSize(24);
      doc.setTextColor(33, 33, 33); // Dark gray color
      doc.text("Jewelry Shop Admin Reports", 105, 20, { align: "center" });

      // Sub-header for date and company logo
      doc.setFontSize(12);
      doc.setTextColor(150, 150, 150); // Lighter gray for date
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, {
        align: "center",
      });

      // Set background color for the header area
      doc.setFillColor(240, 240, 240); // Light gray background
      doc.rect(15, 40, 270, 180, "F"); // A rounded rectangle for charts area

      const charts = document.querySelectorAll(".chart-container");
      let yPosition = 50; // Adjusted y-position after header

      // Loop over all charts and add them to the PDF with titles and descriptions
      for (const chart of charts) {
        const canvas = await html2canvas(chart);
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 200;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Adding modern border and padding for the charts
        doc.setLineWidth(0.5);
        doc.setDrawColor(200, 200, 200); // Light border color
        doc.rect(15, yPosition - 10, imgWidth + 10, imgHeight + 20); // Border around chart
        doc.addImage(imgData, "PNG", 20, yPosition, imgWidth, imgHeight);

        // Add chart description/summary
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100); // Slightly darker text color for descriptions
        doc.text(
          "Chart Description: This chart shows the performance data",
          20,
          yPosition + imgHeight + 10
        );
        yPosition += imgHeight + 40; // Adjust y-position for next chart
      }

      // Section for Promotion Performance Details
      doc.setFontSize(18);
      doc.setTextColor(33, 33, 33);
      doc.text("Promotion Performance - Detailed Report", 105, yPosition + 10, {
        align: "center",
      });
      yPosition += 15;

      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      const promoData = promotionPerformance?.labels;
      const promoDataValues = promotionPerformance?.datasets?.[0]?.data;

      if (promoData && promoData.length > 0) {
        promoData.forEach((label, index) => {
          doc.text(`${label}: ${promoDataValues?.[index] ?? 0}`, 20, yPosition);
          yPosition += 10;
        });
      } else {
        doc.text("No promotion performance data available.", 20, yPosition);
      }

      // Add Footer with company contact info
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150); // Footer gray color
      doc.text(
        "Company Contact: support@jewelryshop.com | Phone: 123-456-7890",
        105,
        yPosition + 20,
        {
          align: "center",
        }
      );

      doc.save("admin-reports.pdf");
      toast.success("PDF generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Admin Reports</h1>
        <Button
          onClick={generatePDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
        >
          Generate PDF Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 chart-container">
          <h2 className="text-xl font-semibold mb-4">Discount Usage</h2>
          {discountUsage?.labels?.length > 0 ? (
            <Bar
              data={discountUsage}
              options={chartOptions("Discount Usage")}
            />
          ) : (
            <p className="text-gray-500 text-center">
              No discount usage data available
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 chart-container">
          <h2 className="text-xl font-semibold mb-4">Promotion Performance</h2>
          {promotionPerformance?.labels?.length > 0 ? (
            <Bar
              data={promotionPerformance}
              options={chartOptions("Promotion Performance")}
            />
          ) : (
            <p className="text-gray-500 text-center">
              No promotion performance data available
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 chart-container">
          <h2 className="text-xl font-semibold mb-4">User Activity</h2>
          {userActivity?.labels?.length > 0 ? (
            <Bar data={userActivity} options={chartOptions("User Activity")} />
          ) : (
            <p className="text-gray-500 text-center">
              No user activity data available
            </p>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">Detailed Reports</h2>

        <div className="bg-white rounded-lg shadow p-6 detailed-report">
          <h3 className="text-xl font-semibold mb-4">
            Promotion Performance Details
          </h3>
          {promotionPerformance?.labels?.length > 0 ? (
            <div className="space-y-4">
              {promotionPerformance.labels.map((label, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-medium">
                    {promotionPerformance.datasets?.[0]?.data?.[index] ?? 0}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No detailed promotion data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
