import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientName: { type: String, required: true },
    email: { type: String, required: true },
    date: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    amount: { type: Number, required: true },
    workDetail: { type: String, required: true }, // 🔹 NEW FIELD
    status: {
      type: String,
      enum: ["Pending", "Paid", "Overdue"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
