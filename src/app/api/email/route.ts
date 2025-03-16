// pages/api/sendEmail.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, feature } = await request.json();

    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing email configuration:', {
        hasUser: !!process.env.EMAIL_USER,
        hasPass: !!process.env.EMAIL_PASS
      });
      throw new Error('Email service not properly configured');
    }

    console.log('Attempting to create transport with:', {
      user: process.env.EMAIL_USER,
      hasPass: !!process.env.EMAIL_PASS,
      host: 'smtp.gmail.com'
    });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true, // Enable debug logging
      logger: true // Enable built-in logger
    });

    // Verify connection configuration
    console.log('Verifying transport configuration...');
    try {
      const verifyResult = await transporter.verify();
      console.log('Transport verification result:', verifyResult);
    } catch (verifyError) {
      console.error('Email configuration error:', {
        error: verifyError,
        message: verifyError instanceof Error ? verifyError.message : 'Unknown error',
        stack: verifyError instanceof Error ? verifyError.stack : undefined
      });
      throw new Error('Email service configuration error. Please check credentials.');
    }

    console.log('Attempting to send email...');
    const mailResult = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      replyTo: `${name} <${email}>`,
      to: process.env.EMAIL_USER,
      subject: 'New Feature Request - SPY Compare',
      text: `
Name: ${name}
Email: ${email}
Feature Request:
${feature}
      `,
      html: `
<h2>New Feature Request from SPY Compare</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Feature Request:</strong></p>
<p>${feature.replace(/\n/g, '<br>')}</p>
      `,
    });

    console.log('Email sent successfully:', mailResult);

    return NextResponse.json(
      { success: true, message: 'Email sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in email route:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    const errorMessage = error instanceof Error ? error.message : 'Error sending email.';
    return NextResponse.json(
      {
        success: false,
        message: errorMessage.includes('configuration error')
          ? 'Email service configuration error. Please try again later.'
          : 'Failed to send email. Please try again later.',
        debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
