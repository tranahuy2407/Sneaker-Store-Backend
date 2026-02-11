import  express from 'express';
import {
  getAllInvoices,   
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
} from '../controllers/invoice.controller.js';
const invoiceRouter = express.Router();
import { admin } from '../middlewares/auth.middleware.js';

invoiceRouter.get('/api/v1/invoices', admin, getAllInvoices);
invoiceRouter.get('/api/v1/invoices/:id', admin, getInvoiceById);
invoiceRouter.post('/api/v1/invoices', admin, createInvoice);
invoiceRouter.put('/api/v1/invoices/:id', admin, updateInvoice);
invoiceRouter.delete('/api/v1/invoices/:id', admin, deleteInvoice);

export default invoiceRouter;
