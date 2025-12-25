import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config(); 
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
  pool: {
    max: 5,
    min: 0, 
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: false,
    freezeTableName: true, 
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Kết nối PostgreSQL thành công!");
    await sequelize.query("SELECT 1");
    console.log("Kiểm tra kết nối thành công!");
  } catch (err) {
    console.error("Không thể kết nối đến PostgreSQL:", err);
    throw err; 
  }
};
