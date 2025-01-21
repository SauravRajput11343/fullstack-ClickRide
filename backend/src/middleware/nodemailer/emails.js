import { verificationEmailTemplate } from "./emailTemplate.js";
import { rejectEmailTemplate } from "./emailTemplate.js";
import { transporter } from "./nodemailer.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const response = await transporter.sendMail({
      from: {
        name: "ClickRide",
        address: "official.clickride@gmail.com",
      },
      to: email,
      subject: "Verify you account for ClickRide ", //subject line
      // text: "This is a test email", //plain text body
      html: verificationEmailTemplate(verificationToken), //html body
    });
    console.log("Verification email sent successfully");
  } catch (error) {
    console.log("Error in sending verification email:", error.message);
    throw new Error("Error in sending verification email");
  }
};

export const rejectEmail = async (email, fullname) => {
  try {
    const response = await transporter.sendMail({
      from: {
        name: "ClickRide",
        address: "official.clickride@gmail.com",
      }, //sender address
      subject: "Rejection  letter", //subject line,
      to: email, //receiver email, [can be sent to multiple emails by passing an array of emails]
      html: rejectEmailTemplate(fullname), //html body
    });
    console.log("Rejection email sent successfully");
  } catch (error) {
    console.error("Error in sending welcome email:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error in sending welcome email",
    });
  }
};
