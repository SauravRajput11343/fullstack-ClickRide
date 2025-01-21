import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transportObject = {
  service: "gmail",
  host: "smtp.gmail.email",
  secure: true,
  port: 587,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
};

export const transporter = nodemailer.createTransport(transportObject);
