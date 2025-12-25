import PaymentMethod from "../models/payment_method.model.js";
import { deleteFromCloudinary } from "./cloudinary.service.js";
import { PaginationService } from "./pagination.service.js";

export const PaymentMethodService = {
  async getAll({ page = 1, limit = 10, search, is_active }) {
    const where = {};
    if (is_active !== undefined) where.is_active = is_active;

    return await PaginationService.paginate(PaymentMethod, {
      page,
      limit,
      where,
      search: search ? { key: "name", value: search } : null,
      order: [["created_at", "DESC"]],
    });
  },

  async getById(id) {
    const method = await PaymentMethod.findByPk(id);
    return method ? method.toJSON() : null;
  },

async create(data, file) {
  try {
    const logo = file ? file.path || file.filename || file.url : null;
    const is_active = data.is_active === "true" || data.is_active === true || data.is_active === 1;

    const method = await PaymentMethod.create({
      name: data.name,
      code: data.code,
      description: data.description,
      logo,
      is_active,
    });

    return method.toJSON();
  } catch (error) {
    console.error("PaymentMethodService.create error:", error);
    console.error("Data:", data);
    if (file) console.error("File:", file);
    throw new Error(error.message || "Create payment method failed");
  }
},

async update(id, data, file) {
  try {
    const method = await PaymentMethod.findByPk(id);
    if (!method) throw new Error("Payment method not found");

    let logo = method.logo;

    if (file) {
      if (logo) {
        try {
          await deleteFromCloudinary(logo); 
        } catch (err) {
          console.warn("Delete old logo failed:", err.message);
        }
      }

      logo = file.path || file.filename || file.url;
    }

    const is_active = data.is_active === "true" || data.is_active === true || data.is_active === 1;

    await method.update({
      name: data.name,
      code: data.code,
      description: data.description,
      logo,
      is_active,
    });

    return method.toJSON();
  } catch (err) {
    console.error("PaymentMethodService.update error:", err);
    console.error("Data:", data);
    if (file) console.error("File:", file);
    throw new Error(err.message || "Update payment method failed");
  }
},


  async delete(id) {
    try {
      const method = await PaymentMethod.findByPk(id);
      if (!method) return false;

      if (method.logo) {
        await deleteFromCloudinary(method.logo).catch((e) =>
          console.warn("Delete logo failed:", e.message)
        );
      }

      const deleted = await PaymentMethod.destroy({ where: { id } });
      return deleted > 0;
    } catch (error) {
      console.error("PaymentMethodService.delete error:", error);
      throw new Error(error.message || "Delete payment method failed");
    }
  },
};
