import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

// Utility function for combining tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 

/**
 * Hashes a password using bcrypt
 * @param password Plain text password to hash
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compares a plain text password with a hashed password
 * @param password Plain text password
 * @param hashedPassword Hashed password to compare against
 * @returns Boolean indicating if passwords match
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Generates a random 6-digit verification code
 * @returns 6-digit verification code as string
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Sends an email using nodemailer
 * @param to Recipient email address
 * @param subject Email subject
 * @param html HTML content of the email
 * @returns Promise resolving to delivery info
 */
export async function sendEmail(to: string, subject: string, html: string) {
  // Configure transporter (you should use environment variables for these values)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: process.env.EMAIL_SERVER_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  
  // Send email
  const info = await transporter.sendMail({
    from: `"100GAJ Properties" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  return info;
}

/**
 * Generates the HTML template for verification emails
 * @param verificationCode The verification code to include in the email
 * @returns HTML content for the verification email
 */
export function getVerificationEmailTemplate(verificationCode: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #eaeaea;
          border-radius: 5px;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #eaeaea;
        }
        .logo {
          max-width: 150px;
          margin-bottom: 10px;
        }
        .content {
          padding: 20px 0;
        }
        .verification-code {
          text-align: center;
          font-size: 24px;
          letter-spacing: 5px;
          margin: 30px 0;
          font-weight: bold;
          color: #f97316; /* orange-500 */
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #666;
          padding-top: 20px;
          border-top: 1px solid #eaeaea;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://yourdomain.com/logo.png" alt="100GAJ Logo" class="logo">
          <h2>Verify Your Email Address</h2>
        </div>
        <div class="content">
          <p>Thank you for signing up with 100GAJ! Please use the verification code below to complete your registration:</p>
          
          <div class="verification-code">${verificationCode}</div>
          
          <p>This code will expire in 24 hours. If you did not create an account, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} 100GAJ. All rights reserved.</p>
          <p>If you have any questions, please contact our support team at support@100gaj.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generates a password reset email template
 * @param resetToken The password reset token/link
 * @returns HTML content for the password reset email
 */
export function getPasswordResetEmailTemplate(verificationCode: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #eaeaea;
          border-radius: 5px;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #eaeaea;
        }
        .content {
          padding: 20px 0;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #f97316;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #666;
          padding-top: 20px;
          border-top: 1px solid #eaeaea;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Reset Your Password</h2>
        </div>
        <div class="content">
          <p>You requested a password reset for your 100GAJ account. Click the button below to create a new password:</p>
          
          <div style="text-align: center;">
            <p class="button">${verificationCode}</p>
          </div>
          
          <p>This code will expire in 1 hour. If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} 100GAJ. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateToken(payload: { userId: string; email: string }): string {
  // Verify that JWT_SECRET is defined
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  // Create the token with user data
  const token = jwt.sign(
    {
      sub: payload.userId,
      email: payload.email,
      iat: Math.floor(Date.now() / 1000),
    },
    secret,
    { expiresIn: '7d' } // Token expires in 7 days
  );

  return token;
}

export function verifyToken(token: string): { userId: string; email: string } {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  try {
    const decoded = jwt.verify(token, secret) as { sub: string; email: string };
    return { userId: decoded.sub, email: decoded.email };
  } catch (_error) {
    throw new Error(`Invalid or expired token: ${_error}`);
  }
}
