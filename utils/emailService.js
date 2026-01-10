const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.REPORT_EMAIL,
    pass: process.env.REPORT_EMAIL_PASSWORD
  }
});

exports.sendEmail = async (subject, html) => {
  await transporter.sendMail({
    from: `"JBD Mart Reports" <${process.env.REPORT_EMAIL}>`,
    to: [
      "agarwalpress1@gmail.com",
      "ankur.iistian@gmail.com"
    ],
    subject,
    html
  });
};
