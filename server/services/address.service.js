import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const provinces = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/provinces.json"), "utf8")
);

const districts = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/districts.json"), "utf8")
);

const wards = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/wards.json"), "utf8")
);

class AddressService {
  static async fetchProvinces() {
    return provinces;
  }

  static async fetchDistricts(provinceId) {
    if (!provinceId) return [];
    return districts.filter(
      d => String(d.province_id) === String(provinceId)
    );
  }

  static async fetchWards(districtId) {
    if (!districtId) return [];
    return wards.filter(
      w => String(w.district_id) === String(districtId)
    );
  }
}

export default AddressService;
