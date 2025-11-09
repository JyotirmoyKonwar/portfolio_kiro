# Email Configuration Guide

This guide explains how to set up email functionality for your portfolio contact form. The contact form supports multiple email sending methods with automatic fallbacks.

## Table of Contents

1. [Overview](#overview)
2. [Method 1: EmailJS (Recommended)](#method-1-emailjs-recommended)
3. [Method 2: Custom Backend API](#method-2-custom-backend-api)
4. [Method 3: Mailto Fallback](#method-3-mailto-fallback)
5. [Environment Variables](#environment-variables)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

## Overview

The contact form uses a tiered approach for sending emails:

1. **Primary**: EmailJS (client-side email service)
2. **Secondary**: Custom backend API (if configured)
3. **Fallback**: Opens user's default email client with pre-filled content

## Method 1: EmailJS (Recommended)

EmailJS is a client-side email service that allows you to send emails directly from your frontend without a backend server.

### Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Set Up Email Service

1. **Add Email Service**:
   - Go to "Email Services" in your EmailJS dashboard
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the setup instructions for your provider
   - Note down the **Service ID**

2. **Create Email Template**:
   - Go to "Email Templates"
   - Click "Create New Template"
   - Use this template structure:

```html
Subject: New Contact Form Message: {{subject}}

From: {{from_name}} <{{from_email}}>
To: {{to_name}}

Subject: {{subject}}

Message:
{{message}}

---
This message was sent from your portfolio contact form.
```

3. **Template Variables**:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{subject}}` - Message subject
   - `{{message}}` - Message content
   - `{{to_name}}` - Your name (recipient)

4. **Note the Template ID** from the template settings

### Step 3: Get Public Key

1. Go to "Account" → "General"
2. Find your **Public Key** (User ID)
3. Copy this key

### Step 4: Configure Environment Variables

Create a `.env` file in your project root:

```bash
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

Replace the placeholder values with your actual EmailJS credentials.

### Step 5: Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to the contact form
3. Fill out and submit the form
4. Check your email for the message

## Method 2: Custom Backend API

If you prefer to use your own backend service for sending emails:

### Step 1: Create Backend Endpoint

Create an API endpoint that accepts POST requests with this structure:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Hello",
  "message": "This is a test message"
}
```

### Step 2: Configure API Endpoint

Add your API endpoint to the `.env` file:

```bash
VITE_EMAIL_API_ENDPOINT=https://your-api.com/api/contact
```

### Step 3: Backend Implementation Examples

**Node.js/Express with Nodemailer:**

```javascript
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  try {
    await transporter.sendMail({
      from: email,
      to: process.env.RECIPIENT_EMAIL,
      subject: `Portfolio Contact: ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`
    });
    
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
});
```

## Method 3: Mailto Fallback

If both EmailJS and custom API fail, the form will automatically open the user's default email client with pre-filled content.

This method requires no configuration but depends on the user having an email client installed.

## Environment Variables

Create a `.env` file in your project root with these variables:

```bash
# EmailJS Configuration (Primary method)
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx

# Custom API Configuration (Alternative method)
VITE_EMAIL_API_ENDPOINT=https://your-api.com/api/contact

# Your contact email (for fallback mailto links)
VITE_CONTACT_EMAIL=your.email@example.com
```

### Environment Variable Descriptions

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service identifier | For EmailJS |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template identifier | For EmailJS |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key (User ID) | For EmailJS |
| `VITE_EMAIL_API_ENDPOINT` | Custom backend API endpoint | For custom API |
| `VITE_CONTACT_EMAIL` | Your email address | For fallback |

## Testing

### Test EmailJS Configuration

1. Open browser developer tools
2. Go to Console tab
3. Look for initialization messages:
   - ✅ "EmailJS service initialized successfully"
   - ⚠️ "EmailJS configuration is incomplete..."

### Test Form Submission

1. Fill out the contact form
2. Submit the form
3. Check for success/error messages
4. Verify email delivery

### Debug Email Service Status

Add this to your browser console to check configuration:

```javascript
// Check email service status
import { getEmailServiceStatus } from './src/config/emailConfig';
console.log(getEmailServiceStatus());
```

## Troubleshooting

### Common Issues

1. **"EmailJS configuration is incomplete"**
   - Check that all environment variables are set with `VITE_` prefix
   - Ensure `.env` file is in the project root
   - Restart the development server after adding variables

2. **"Failed to send email"**
   - Verify EmailJS service is active
   - Check template ID is correct
   - Ensure email service is properly configured in EmailJS dashboard

3. **CORS Errors**
   - EmailJS should handle CORS automatically
   - For custom APIs, ensure CORS is configured on your backend

4. **Environment Variables Not Loading**
   - Variables must start with `VITE_` (for Vite projects)
   - Restart development server after changes
   - Check `.env` file is not in `.gitignore`

### Testing Checklist

- [ ] EmailJS account created and verified
- [ ] Email service added to EmailJS
- [ ] Email template created with correct variables
- [ ] Environment variables configured
- [ ] Development server restarted
- [ ] Form submission tested
- [ ] Email delivery confirmed

### Security Notes

- Never commit `.env` files to version control
- Use `.env.example` for documentation
- EmailJS public key is safe to expose (it's meant to be public)
- For production, consider using environment variables from your hosting provider

### Production Deployment

When deploying to production:

1. **Vercel/Netlify**: Add environment variables in the dashboard
2. **Heroku**: Use `heroku config:set VITE_EMAILJS_SERVICE_ID=your_value`
3. **Other platforms**: Follow their environment variable documentation

### Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify EmailJS dashboard for service status
3. Test with a simple HTML form first
4. Check EmailJS documentation: https://www.emailjs.com/docs/

## Example .env File

```bash
# Copy this to .env and replace with your actual values

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=user_def456

# Your contact email
VITE_CONTACT_EMAIL=your.email@example.com
```

Remember to restart your development server after creating or modifying the `.env` file!