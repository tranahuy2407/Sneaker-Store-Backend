import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// transporter.verify((error, success) => {
//   if (error) {
//     console.error("Mail Transporter Error:", error);
//   } else {
//     console.log("Mail Transporter is ready to send messages");
//   }
// });

export const sendForgotPasswordEmail = async (to, resetUrl) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: "Đặt lại mật khẩu - Sneaker Store",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Yêu cầu đặt lại mật khẩu</h2>
        <p>Chào bạn,</p>
        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấn vào nút bên dưới để tiến hành thay đổi mật khẩu:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Đặt lại mật khẩu</a>
        </div>
        <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
        <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #777; text-align: center;">© 2026 Sneaker Store. All rights reserved.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

export const sendOrderConfirmationEmail = async (to, orderData) => {
  const { orderId, totalAmount, items, customerName } = orderData;
  
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (x${item.quantity})</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toLocaleString('vi-VN')}đ</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: `Xác nhận đơn hàng #${orderId} - Sneaker Store`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #28a745; text-align: center;">Cảm ơn bạn đã đặt hàng!</h2>
        <p>Chào <strong>${customerName}</strong>,</p>
        <p>Đơn hàng <strong>#${orderId}</strong> của bạn đã được tiếp nhận và đang trong quá trình xử lý.</p>
        
        <h3 style="border-bottom: 2px solid #333; padding-bottom: 5px;">Chi tiết đơn hàng</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f9f9f9;">
              <th style="padding: 10px; text-align: left;">Sản phẩm</th>
              <th style="padding: 10px; text-align: right;">Giá</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Tổng cộng</td>
              <td style="padding: 10px; font-weight: bold; text-align: right; color: #d9534f; font-size: 18px;">${totalAmount.toLocaleString('vi-VN')}đ</td>
            </tr>
          </tfoot>
        </table>

        <p style="margin-top: 20px;">Chúng tôi sẽ thông báo cho bạn khi đơn hàng được giao.</p>
        <p>Mọi thắc mắc vui lòng liên hệ hotline: <strong>1900 xxxx</strong></p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #777; text-align: center;">© 2026 Sneaker Store. All rights reserved.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};
