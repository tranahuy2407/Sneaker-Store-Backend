import { InvoiceService } from "../services/invoice.service.js";

//get all
export const getAllInvoices = async (req, res) => {
    try {
        const { page, limit, search, order_id } = req.query;

        const result = await InvoiceService.getAll({

            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            search,
            order_id: order_id !== undefined ? parseInt(order_id) : undefined,
        });
        res.status(200).json({ success: true, ...result });

    } catch (error) {

        res.status(500).json({ success: false, message: error.message });
    }
};
//get by 
export const getInvoiceById = async (req, res) => {
    try {
        const invoice = await InvoiceService.getById(req.params.id);
        if (!invoice)
            return res.status(404).json({ success: false, message: "Not found" });
        res.status(200).json({ success: true, data: invoice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
//create
export const createInvoice = async (req, res) => {
    try {
        const data = req.body;
        const invoice = await InvoiceService.create(data);
        res.status(201).json({ success: true, data: invoice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
//update
export const updateInvoice = async (req, res) => {
    try {
        const data = req.body;

        const updated = await InvoiceService.update(req.params.id, data);
        if (!updated)

            return res.status(404).json({ success: false, message: "Not found" });
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
//delete
export const deleteInvoice = async (req, res) => {
    try {
        const deleted = await InvoiceService.delete(req.params.id);
        if (!deleted)
            return res.status(404).json({ success: false, message: "Not found" });
        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
    

