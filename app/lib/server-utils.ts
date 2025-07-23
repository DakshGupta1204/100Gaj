'use server'

import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// JWT token generation
export const generateToken = (payload: object, expiresIn = '1d'): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  
  const secret = Buffer.from(process.env.JWT_SECRET, 'utf-8');
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string): any => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  
  try {
    const secret = Buffer.from(process.env.JWT_SECRET, 'utf-8');
    return jwt.verify(token, secret);
  } catch (_error) {

    return null;
  }
};

// Generate verification token
export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate 6-digit verification code
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Email sending
export const sendEmail = async (to: string, subject: string, html: string): Promise<boolean> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: process.env.EMAIL_SERVER_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    return true;
  } catch (_error) {

    return false;
  }
};

// Email templates
export const getVerificationEmailTemplate = (code: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify your email address</h2>
      <p>Thank you for signing up! Please use the following code to verify your email address:</p>
      <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
        <strong>${code}</strong>
      </div>
      <p>If you didn't request this verification, you can safely ignore this email.</p>
    </div>
  `;
};

export const getPasswordResetEmailTemplate = (code: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset your password</h2>
      <p>We received a request to reset your password. Please use the following code to reset your password:</p>
      <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
        <strong>${code}</strong>
      </div>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
    </div>
  `;
}; 