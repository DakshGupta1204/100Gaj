import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { name, email, phone, rating, websiteQuality, userExperience } = await request.json();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_SERVER_USER,
            to: process.env.EMAIL_SERVER_USER,
            subject: `Website Feedback - Rating: ${rating}/5`,
            html: `
                <h2>Website Feedback</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Rating:</strong> ${rating}/5</p>
                <p><strong>Website Quality Feedback:</strong> ${websiteQuality}</p>
                <p><strong>User Experience Feedback:</strong> ${userExperience}</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ success: true, message: 'Feedback sent successfully' });
    } catch (_error) {

        return NextResponse.json(
            { success: false, message: 'Failed to send feedback' },
            { status: 500 }
        );
    }
}