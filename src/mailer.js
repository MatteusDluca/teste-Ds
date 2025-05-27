// src/mailer.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // seu Gmail
    pass: process.env.GMAIL_PASS, // App Password
  },
});

/**
 * Dispara e-mail de confirmação
 * @param {string} email destino
 */
export async function sendConfirmation(email) {
  await transporter.sendMail({
    from: `"MeuApp" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: 'Confirmação de Login',
    text: `Olá! Seu login com ${email} foi realizado com sucesso.`,
  });
}
