import PaymentMethod from "../../models/payment_method.model.js";

export async function seedPaymentMethods() {
  const methods = await PaymentMethod.bulkCreate([
    {
      name: "Tiền mặt khi nhận hàng",
      code: "COD",
      description: "Thanh toán khi nhận hàng tại nhà",
      logo: "https://cdn-icons-png.flaticon.com/512/2460/2460482.png",
      is_active: true,
    },
    {
      name: "Chuyển khoản ngân hàng",
      code: "BANK_TRANSFER",
      description: "Chuyển khoản qua tài khoản ngân hàng",
      logo: "https://cdn-icons-png.flaticon.com/512/2830/2830284.png",
      is_active: true,
    },
    {
      name: "ZaloPay",
      code: "ZALOPAY",
      description: "Thanh toán qua ví ZaloPay",
      logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay.png",
      is_active: true,
    },
    {
      name: "VNPay",
      code: "VNPAY",
      description: "Thanh toán qua cổng VNPay",
      logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR.png",
      is_active: true,
    },
    {
      name: "MoMo",
      code: "MOMO",
      description: "Thanh toán qua ví MoMo",
      logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png",
      is_active: true,
    },
  ]);

  console.log(`✅ Seeded ${methods.length} payment methods`);
  return methods;
}
