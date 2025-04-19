import nodeMailer from "nodemailer";
import { env } from "../ENV/dotenv.service.js";
import { print } from "../Logger/print.service.js";

const { MAIL_PROVIDER, MAIL_PORT, MAIL_HOST, MAIL_USER, MAIL_PASS } = env

const transporter = nodeMailer.createTransport({
  service: MAIL_PROVIDER,
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

const sendMail = async (mailOptions) => {
  try {
    await transporter.sendMail({
      from: MAIL_USER,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
      attachments: mailOptions.attachments,
    });
  } catch (error) {
    print("Error sending email", "error");
    throw error;
  }
};

export { sendMail };

