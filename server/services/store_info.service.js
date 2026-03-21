import { StoreInfo } from "../models/index.js";

export const StoreInfoService = {
  async get() {
    let info = await StoreInfo.findOne();
    if (!info) {
      // Trả về object mặc định nếu chưa có dữ liệu
      return {
        address: "",
        phone: "",
        email: "",
        map_url: "",
        working_hours: "",
        facebook_url: "",
        instagram_url: "",
        logo_url: "",
      };
    }
    return info;
  },

  async update(data) {
    let info = await StoreInfo.findOne();
    const updateData = {
      address: data.address,
      phone: data.phone,
      email: data.email,
      map_url: data.map_url,
      working_hours: data.working_hours,
      facebook_url: data.facebook_url,
      instagram_url: data.instagram_url,
      logo_url: data.logo_url,
    };

    if (info) {
      await info.update(updateData);
      return info;
    } else {
      return StoreInfo.create(updateData);
    }
  },
};
