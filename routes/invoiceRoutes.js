import express from "express";
import Invoice from "../models/Invoice.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Create invoice
router.post("/", protect, async (req, res) => {
  try {
    const { clientName, email, date, dueDate, amount, workDetail, status } =
      req.body;

    const invoice = new Invoice({
      user: req.user,
      clientName,
      email,
      date,
      dueDate,
      amount,
      workDetail,
      status,
    });

    const createdInvoice = await invoice.save();
    res.status(201).json(createdInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 📌 Get all invoices
router.get("/", protect, async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user }).sort({
      createdAt: -1,
    });

    // Auto mark overdue
    const today = new Date();
    for (let inv of invoices) {
      if (
        inv.dueDate &&
        new Date(inv.dueDate) < today &&
        inv.status !== "Paid"
      ) {
        inv.status = "Overdue";
        await inv.save();
      }
    }

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Get single invoice
router.get("/:id", protect, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Update invoice (edit)
router.put("/:id", protect, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    invoice.clientName = req.body.clientName || invoice.clientName;
    invoice.email = req.body.email || invoice.email;
    invoice.date = req.body.date || invoice.date;
    invoice.dueDate = req.body.dueDate || invoice.dueDate;
    invoice.amount = req.body.amount || invoice.amount;
    invoice.workDetail = req.body.workDetail || invoice.workDetail;
    invoice.status = req.body.status || invoice.status;

    const updated = await invoice.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Update only status
router.put("/:id/status", protect, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    invoice.status = req.body.status || invoice.status;
    await invoice.save();

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 Delete invoice
router.delete("/:id", protect, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    await invoice.deleteOne();
    res.json({ message: "Invoice removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
