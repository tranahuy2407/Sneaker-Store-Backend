import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const SNEAKER_LOGO_CID = "logo_sneaker";
const LOGO_ATTACHMENT = {
  filename: "logo.jfif",
  path: path.join(__dirname, "../assets/sneaker-logo.jfif"),
  cid: SNEAKER_LOGO_CID,
};

export const sendForgotPasswordEmail = async (to, resetUrl) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: "Đặt lại mật khẩu - Sneaker Store",
    attachments: [LOGO_ATTACHMENT],
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
            <img src="cid:${SNEAKER_LOGO_CID}" alt="Sneaker Store Logo" style="max-width: 120px; height: auto; margin: 0 auto 10px; display: block;">
            <h1 style="color: #ffffff; margin: 0; letter-spacing: 2px; font-weight: 800; font-size: 24px;">SNEAKER STORE</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px;">
            <h2 style="color: #333; font-size: 22px; margin-top: 0;">Yêu cầu đặt lại mật khẩu</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">Chào bạn,</p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Để đảm bảo an toàn, vui lòng nhấn nút bên dưới để đổi mật khẩu mới:</p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #000000 0%, #333333 100%); color: #ffffff; padding: 16px 35px; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); display: inline-block;">Đặt lại mật khẩu</a>
            </div>
            
            <p style="color: #999; font-size: 14px; font-style: italic;">Lưu ý: Liên kết này sẽ tự động hết hạn sau 1 giờ. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="color: #777; font-size: 12px; margin: 0;">&copy; 2026 Sneaker Store. 123 Street Name, Saigon, VN.</p>
            <p style="color: #777; font-size: 12px; margin: 10px 0 0;">Bạn nhận được email này vì đã đăng ký tài khoản trên website của chúng tôi.</p>
          </div>
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

export const sendOrderConfirmationEmail = async (to, orderData) => {
  const { orderCode, totalAmount, items, customerName, orderId } = orderData;
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 15px 10px; border-bottom: 1px solid #efefef;">
        <span style="display: block; font-weight: bold; color: #333;">${item.name}</span>
        <span style="color: #888; font-size: 13px;">Số lượng: ${item.quantity}</span>
      </td>
      <td style="padding: 15px 10px; border-bottom: 1px solid #efefef; text-align: right; font-weight: bold; color: #1a1a1a;">
        ${item.price.toLocaleString('vi-VN')}đ
      </td>
    </tr>
  `).join('');

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: `Xác nhận đơn hàng #${orderCode} - Sneaker Store`,
    attachments: [LOGO_ATTACHMENT],
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background-color: #28a745; padding: 30px; text-align: center;">
            <img src="cid:${SNEAKER_LOGO_CID}" alt="Sneaker Store Logo" style="max-width: 120px; height: auto; margin: 0 auto 10px; display: block;">
            <h1 style="color: #ffffff; margin: 0; letter-spacing: 2px; font-weight: 800; font-size: 24px;">SNEAKER STORE</h1>
          </div>
          
          <!-- Success Hero -->
          <div style="padding: 40px 40px 20px; text-align: center;">
            <div style="width: 60px; height: 60px; background-color: #d4edda; border-radius: 50%; display: inline-block; line-height: 60px; margin-bottom: 20px;">
              <span style="color: #28a745; font-size: 30px;">✔</span>
            </div>
            <h2 style="margin: 0; color: #333; font-size: 24px;">Cảm ơn bạn đã đặt hàng!</h2>
            <p style="color: #666; margin-top: 10px;">Chào <strong>${customerName}</strong>, đơn hàng <strong>#${orderCode}</strong> của bạn đã được tiếp nhận.</p>
          </div>

          <!-- Order Table -->
          <div style="padding: 0 40px 20px;">
            <h3 style="color: #1a1a1a; font-size: 18px; border-bottom: 2px solid #1a1a1a; padding-bottom: 8px; margin-bottom: 15px;">Chi tiết đơn hàng</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td style="padding: 20px 10px; font-size: 18px; font-weight: bold; color: #333;">TỔNG CỘNG</td>
                  <td style="padding: 20px 10px; text-align: right; font-size: 24px; font-weight: 900; color: #d9534f;">
                    ${totalAmount.toLocaleString('vi-VN')} đ
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- CTA / Support -->
          <div style="padding: 0 40px 40px; text-align: center;">
            <p style="color: #666; margin-bottom: 25px;">Chúng tôi sẽ thông báo cho bạn ngay khi hàng được giao.</p>
            <a href="${process.env.FRONTEND_URL}/orders/${orderId}/tracking" style="background-color: #1a1a1a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px;">Theo dõi đơn hàng</a>
            <p style="margin-top: 30px; color: #999; font-size: 13px;">Hỗ trợ khách hàng: <strong>1900 xxxx</strong></p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="color: #777; font-size: 12px; margin: 0;">&copy; 2026 Sneaker Store. All rights reserved.</p>
          </div>
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

export const sendOrderCancelEmail = async (to, orderData) => {
  const { orderCode, reason, customerName } = orderData;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: `Thông báo huỷ đơn hàng #${orderCode} - Sneaker Store`,
    attachments: [LOGO_ATTACHMENT],
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background-color: #dc3545; padding: 30px; text-align: center;">
            <img src="cid:${SNEAKER_LOGO_CID}" alt="Sneaker Store Logo" style="max-width: 120px; height: auto; margin: 0 auto 10px; display: block;">
            <h1 style="color: #ffffff; margin: 0; letter-spacing: 2px; font-weight: 800; font-size: 24px;">SNEAKER STORE</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px; text-align: center;">
            <h2 style="color: #333; font-size: 22px;">Đơn hàng đã bị huỷ</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">Chào <strong>${customerName}</strong>,</p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">Chúng tôi rất tiếc phải thông báo rằng đơn hàng <strong>#${orderCode}</strong> của bạn đã bị huỷ.</p>
            
            <div style="background-color: #fff5f5; border-left: 4px solid #dc3545; padding: 20px; margin: 25px 0; text-align: left;">
              <p style="margin: 0; color: #c0392b; font-weight: bold;">Lý do huỷ đơn:</p>
              <p style="margin: 5px 0 0; color: #555;">${reason || "Yêu cầu từ khách hàng hoặc hệ thống tự động huỷ."}</p>
            </div>

            <p style="color: #777; font-size: 14px;">Nếu đã thanh toán trả trước, số tiền sẽ được hoàn trả lại cho bạn trong vòng 3-5 ngày làm việc.</p>
            <p style="color: #777; font-size: 14px; margin-top: 15px;">Chúng tôi hy vọng sẽ được phục vụ bạn trong lần mua sắm tới.</p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="color: #777; font-size: 12px; margin: 0;">&copy; 2026 Sneaker Store. Mọi thắc mắc liên hệ 1900 xxxx.</p>
          </div>
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

export const sendContactReplyEmail = async (to, data) => {
  const { name, originalMessage, replyMessage, subject } = data;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: `Phản hồi liên hệ: ${subject || "Yêu cầu từ khách hàng"} - Sneaker Store`,
    attachments: [LOGO_ATTACHMENT],
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; padding: 40px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background-color: #1a1a1a; padding: 30px; text-align: center;">
            <img src="cid:${SNEAKER_LOGO_CID}" alt="Sneaker Store Logo" style="max-width: 120px; height: auto; margin: 0 auto 10px; display: block;">
            <h1 style="color: #ffffff; margin: 0; letter-spacing: 2px; font-weight: 800; font-size: 24px;">SNEAKER STORE</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px;">
            <h2 style="color: #333; font-size: 20px; margin-top: 0;">Xin chào ${name},</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">Cảm ơn bạn đã liên hệ với Sneaker Store. Chúng tôi đã nhận được tin nhắn của bạn và có phản hồi như sau:</p>
            
            <div style="background-color: #f8f9fa; border-left: 4px solid #1a1a1a; padding: 20px; margin: 25px 0;">
              <p style="margin: 0; color: #1a1a1a; font-weight: bold; font-size: 14px; text-transform: uppercase;">Phản hồi từ Sneaker Store:</p>
              <p style="margin: 10px 0 0; color: #444; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${replyMessage}</p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee;">
              <p style="color: #999; font-size: 13px; font-weight: bold; margin-bottom: 5px;">Tin nhắn gốc của bạn:</p>
              <p style="color: #999; font-size: 13px; font-style: italic; margin: 0;">"${originalMessage}"</p>
            </div>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-top: 30px;">Nếu bạn có thêm bất kỳ thắc mắc nào, vui lòng phản hồi lại email này hoặc liên hệ hotline của chúng tôi.</p>
            <p style="color: #333; font-size: 16px; font-weight: bold;">Trân trọng,<br>Đội ngũ Sneaker Store</p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
            <p style="color: #777; font-size: 12px; margin: 0;">&copy; 2026 Sneaker Store. 123 Street Name, Saigon, VN.</p>
          </div>
        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};
