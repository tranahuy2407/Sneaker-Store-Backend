import AddressService from "../services/address.service.js";

class AddressController {
  static async getProvinces(req, res) {
    try {
      const provinces = await AddressService.fetchProvinces();
      res.json({ success: true, data: provinces });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getDistricts(req, res) {
    try {
      const { provinceId } = req.params;
      const districts = await AddressService.fetchDistricts(provinceId);
      res.json({ success: true, data: districts });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getWards(req, res) {
    try {
      const { districtId } = req.params;
      const wards = await AddressService.fetchWards(districtId);
      res.json({ success: true, data: wards });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

export default AddressController;
