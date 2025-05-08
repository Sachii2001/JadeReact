import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../ui/Input";
import Button from "../ui/Button";
import axios from "axios";

// Validation schema for the ticket form
const ticketSchema = Yup.object().shape({
  subject: Yup.string()
    .required("Subject is required")
    .max(100, "Subject cannot exceed 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .max(500, "Description cannot exceed 500 characters"),
  category: Yup.string()
    .required("Category is required")
    .oneOf(
      ["Promotion", "Discount", "Order", "Product", "Other"],
      "Invalid category"
    ),
});

const TicketForm = ({ onSubmitSuccess }) => {
  const formik = useFormik({
    initialValues: {
      subject: "",
      description: "",
      category: "",
    },
    validationSchema: ticketSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/tickets",
          values,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }, // Assuming JWT auth
          }
        );
        if (response.status === 201) {
          alert("Ticket raised successfully!");
          formik.resetForm();
          if (onSubmitSuccess) onSubmitSuccess();
        } else {
          alert("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Error raising ticket:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          alert("Error: " + error.response.data.message);
        } else if (error.message) {
          alert("Error: " + error.message);
        } else {
          alert("Error raising ticket. Please try again later.");
        }
      }
    },
  });

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Raise a Support Ticket
      </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <Input
            name="subject"
            type="text"
            formik={formik}
            placeholder="Issue with discount code"
            autoComplete="off"
            autoFocus
            className="w-full"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Input
            name="description"
            type="textarea"
            formik={formik}
            rows="4"
            placeholder="Please describe your issue..."
            className="w-full"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="Promotion">Promotion</option>
            <option value="Discount">Discount</option>
            <option value="Order">Order</option>
            <option value="Product">Product</option>
            <option value="Other">Other</option>
          </select>
          {formik.touched.category && formik.errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.category}
            </p>
          )}
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            loading={formik.isSubmitting}
            disabled={!formik.isValid || formik.isSubmitting}
            className="w-full justify-center py-2 px-4"
          >
            Submit Ticket
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;
