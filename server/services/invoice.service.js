import { Invoice } from '../models/index.js';
import { PaginationService } from './pagination.service.js';

export const InvoiceService = {
    //get all
    async getAll({ page = 1, limit = 10, search, order_id }) {
        const where = {};
        if (order_id !== undefined) where.order_id = order_id;
        return await PaginationService.paginate(Invoice, {
            page,
            limit,          
            where,
            include: [
                { association: "order" },
                
            ],
            search: search ? { key: "id", value: search } : null,
            order: [["created_at", "DESC"]],

        });
    },
    //get by id
    async getById(id) {
        const invoice = await Invoice.findByPk(id);
        return invoice ? invoice.toJSON() : null;
    },
    //add 
    async create(data) {    
        try {
            const invoice = await Invoice.create({
                order_id: data.order_id,
                total_amount: data.total_amount,
            });
            return invoice.toJSON();
        } catch (error) {
            console.error("InvoiceService.create error:", error);
            console.error("Data:", data);
            throw new Error(error.message || "Create invoice failed");
        }   
    },
    //update
    async update(id, data) {
        try {
            const invoice = await Invoice.findByPk(id);
            if (!invoice) throw new Error("Invoice not found");
            invoice.order_id = data.order_id !== undefined ? data.order_id : invoice.order_id;
            invoice.total_amount = data.total_amount !== undefined ? data.total_amount : invoice.total_amount;
            await invoice.save();
            return invoice.toJSON();
        }
        catch (error) {
            console.error("InvoiceService.update error:", error);
            console.error("Data:", data);
            throw new Error(error.message || "Update invoice failed");
        }
    },
    //delete
    async delete(id) {
        try {
            const invoice = await Invoice.findByPk(id);

            if (!invoice) throw new Error("Invoice not found");
            await invoice.destroy();
            return true;
        } catch (error) {

            console.error("InvoiceService.delete error:", error);
            throw new Error(error.message || "Delete invoice failed");
        }
    },

}