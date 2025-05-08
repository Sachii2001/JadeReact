import { useFormik } from "formik";
import * as Yup from "yup";
import Input from "../ui/Input";
import Button from "../ui/Button";
import axios from "axios";
import { toast } from "react-hot-toast";

// Validation schema for admin ticket updates
const adminTicketSchema = Yup.object().shape({
  status: Yup.string()
    .required("Status is required")
    .oneOf(["Open", "InProgress", "Resolved"], "Invalid status"),
  comments: Yup.string().max(500, "Comment cannot exceed 500 characters"),
});

const AdminTicketForm = ({ ticket, onUpdateSuccess }) => {
  const formik = useFormik({
    initialValues: {
      status: ticket?.status || "Open",
      comments: "",
    },
    validationSchema: adminTicketSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/tickets/${ticket._id}`,
          values,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 200) {
          toast.success("Ticket updated successfully!");
          if (onUpdateSuccess) onUpdateSuccess();
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Error updating ticket:", error);
        toast.error("Error updating ticket. Please try again later.");
      }
    },
  });

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 mx-[280px]">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Update Ticket
      </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="Open">Open</option>
            <option value="InProgress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          {formik.touched.status && formik.errors.status && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.status}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add Comment
          </label>
          <Input
            name="comments"
            type="textarea"
            formik={formik}
            rows="4"
            placeholder="Add a comment..."
            className="w-full"
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            loading={formik.isSubmitting}
            disabled={!formik.isValid || formik.isSubmitting}
            className="w-full justify-center py-2 px-4"
          >
            Update Ticket
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminTicketForm;
