This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, set up your environment variables:

1. Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```

2. Set up MongoDB:
   - Create a MongoDB database (either locally or using MongoDB Atlas)
   - Update the `MONGODB_URI` in your `.env.local` file

3. If using Google OAuth:
   - Set up a project in the [Google Developer Console](https://console.developers.google.com/)
   - Create OAuth credentials and update the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in your `.env.local` file

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication Backend

This project includes a complete authentication system with the following features:

- **User Registration**: Email/password signup with email verification
- **Login**: Secure login with JWT token authentication
- **Email Verification**: Verification codes sent via email
- **Password Reset**: Forgot password flow with verification codes
- **Google OAuth**: Social login with Google
- **Security**: Password hashing, JWT authentication, and expirable tokens

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | POST | Register a new user |
| `/api/auth/login` | POST | User login |
| `/api/auth/verify-email` | POST | Verify email with code |
| `/api/auth/resend-code` | POST | Resend verification code |
| `/api/auth/forgot-password` | POST | Request password reset |
| `/api/auth/reset-password` | POST | Reset password with code |
| `/api/auth/google` | GET | Google OAuth login |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# 100Gaj
