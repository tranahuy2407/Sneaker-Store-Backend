import bcrypt from "bcrypt";
import Admin from "../../models/admin.model.js";

export async function seedAdmins() {
  const password = await bcrypt.hash("admin123", 10);

  const admins = await Admin.bulkCreate([
    { username: "admin", password, role: "Admin" },
    { username: "superadmin", password, role: "SuperAdmin" },
    { username: "manager1", password, role: "Admin" },
  ]);

  console.log(`✅ Seeded ${admins.length} admins`);
  return admins;
}
