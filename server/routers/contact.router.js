import express from "express";
import { ContactController } from "../controllers/contact.controller.js";
import { admin } from "../middlewares/auth.middleware.js";

const contactRouter = express.Router();

contactRouter.post("/api/v1/contacts", ContactController.create);

contactRouter.get("/api/v1/admin/contacts", admin, ContactController.getAll);
contactRouter.get("/api/v1/admin/contacts/:id", admin, ContactController.getById);
contactRouter.patch("/api/v1/admin/contacts/:id/status", admin, ContactController.updateStatus);
contactRouter.post("/api/v1/admin/contacts/:id/reply", admin, ContactController.reply);
contactRouter.delete("/api/v1/admin/contacts/:id", admin, ContactController.delete);

export default contactRouter;
