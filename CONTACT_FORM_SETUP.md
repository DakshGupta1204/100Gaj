# Contact Form Setup

The contact form functionality allows users to send messages directly to your email. Follow these steps to configure it properly:

## Environment Variables

1. In the `.env.local` file at the root of your project, add the following variables:

```
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CONTACT_EMAIL=recipient-email@example.com
```

Replace the placeholder values with your actual credentials:

- `EMAIL_USER`: The email address that will be used to send emails
- `EMAIL_PASSWORD`: The password for that email account
- `CONTACT_EMAIL`: The email address where you want to receive contact form submissions

## For Gmail Users

If you're using Gmail, you'll need to use an "App Password" instead of your regular account password:

1. Go to your Google Account settings (https://myaccount.google.com/)
2. Navigate to Security > 2-Step Verification > App passwords
3. Generate a new app password for "Mail"
4. Use this app password as the `EMAIL_PASSWORD` in your `.env.local` file

## Testing

To test the contact form:

1. Make sure your environment variables are set up correctly
2. Start your development server with `npm run dev`
3. Navigate to the Contact page
4. Fill out the form and submit it
5. Check your recipient email for the message

## Troubleshooting

If emails aren't being sent:

1. Verify that all environment variables are set correctly
2. Check if your email provider allows SMTP access
3. For Gmail users, ensure 2FA is enabled and you're using an app password
4. Check server logs for any error messages 