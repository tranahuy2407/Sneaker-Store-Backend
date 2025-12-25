  import { PaymentMethodService } from "../services/paymentMethod.service.js";

  export const getAllPaymentMethods = async (req, res) => {
    try {
      const { page, limit, search, is_active } = req.query;
      const result = await PaymentMethodService.getAll({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        search,
        is_active: is_active !== undefined ? is_active === "true" : undefined,
      });
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      console.error("getAllPaymentMethods error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  export const getPaymentMethodById = async (req, res) => {
    try {
      const method = await PaymentMethodService.getById(req.params.id);
      if (!method)
        return res.status(404).json({ success: false, message: "Not found" });

      res.status(200).json({ success: true, data: method });
    } catch (error) {
      console.error("getPaymentMethodById error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  export const createPaymentMethod = async (req, res) => {
    try {
      const data = req.body;
      const file = req.file;

      const method = await PaymentMethodService.create(data, file);
      res.status(201).json({ success: true, data: method });
    } catch (error) {
      console.error("createPaymentMethod error:", error);
      res.status(500).json({ success: false, message: error.message, file: req.file });
    }
  };

  export const updatePaymentMethod = async (req, res) => {
    try {
      const data = req.body;
      const file = req.file;

      const updated = await PaymentMethodService.update(req.params.id, data, file);
      if (!updated)
        return res.status(404).json({ success: false, message: "Not found" });

      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      console.error("updatePaymentMethod error:", err);
      res.status(500).json({ success: false, message: err.message, file: req.file });
    }
  };

  export const deletePaymentMethod = async (req, res) => {
    try {
      const deleted = await PaymentMethodService.delete(req.params.id);
      if (!deleted)
        return res.status(404).json({ success: false, message: "Not found" });

      res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
      console.error("deletePaymentMethod error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
