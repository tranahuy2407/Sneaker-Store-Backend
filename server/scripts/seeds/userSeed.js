import User from "../../models/user.model.js";
import bcrypt from "bcrypt";

export async function seedUsers() {
  const password = await bcrypt.hash("user123", 10);

  const users = await User.bulkCreate([
    {
      username: "Nguyễn Văn An",
      email: "nguyenvanan@gmail.com",
      password,
      status: "Active",
    },
    {
      username: "Trần Thị Bích",
      email: "tranthibibich@gmail.com",
      password,
      status: "Active",
    },
    {
      username: "Lê Hoàng Cường",
      email: "lehoangcuong@gmail.com",
      password,
      status: "Active",
    },
    {
      username: "Phạm Thị Dung",
      email: "phamthidung@gmail.com",
      password,
      status: "Active",
    },
    {
      username: "Hoàng Minh Em",
      email: "hoangminhem@gmail.com",
      password,
      status: "Active",
    },
    {
      username: "Đặng Thị Hoa",
      email: "dangthihoa@gmail.com",
      password,
      status: "Active",
    },
    {
      username: "Vũ Văn Giang",
      email: "vuvangiang@gmail.com",
      password,
      status: "Active",
    },
    {
      username: "Bùi Thị Hương",
      email: "buithihuong@gmail.com",
      password,
      status: "Active",
    },
    {
      username: "Tống Minh Khôi",
      email: "tongminhkhoi@gmail.com",
      password,
      status: "Active",
    },
    {
      username: "Ngô Thị Lan",
      email: "ngothilan@gmail.com",
      password,
      status: "Inactive",
    },
  ]);

  console.log(`✅ Seeded ${users.length} users`);
  return users;
}
