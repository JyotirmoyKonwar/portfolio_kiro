# Quick Email Setup Guide

## TL;DR - Get Your Contact Form Working in 5 Minutes

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for free
3. Verify your email

### Step 2: Set Up Email Service
1. In EmailJS dashboard → "Email Services" → "Add New Service"
2. Choose Gmail/Outlook/etc.
3. Follow setup instructions
4. **Copy the Service ID**

### Step 3: Create Email Template
1. Go to "Email Templates" → "Create New Template"
2. Use this template:

```
Subject: Portfolio Contact: {{subject}}

From: {{from_name}} <{{from_email}}>

{{message}}

---
Sent from your portfolio contact form
```

3. **Copy the Template ID**

### Step 4: Get Public Key
1. Go to "Account" → "General"
2. **Copy your Public Key**

### Step 5: Configure Environment Variables
Create `.env` file in your project root:

```bash
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

### Step 6: Test
1. Run `npm run dev`
2. Fill out contact form
3. Check your email!

## What Happens If EmailJS Fails?

The form automatically falls back to opening your default email client with the message pre-filled. No emails are lost!

## Need More Details?

See the complete `EMAIL_SETUP_GUIDE.md` for:
- Custom backend API setup
- Troubleshooting
- Production deployment
- Security considerations

## Common Issues

**"EmailJS configuration is incomplete"**
- Check environment variables are set correctly
- Restart development server
- Variables must start with `VITE_`

**Form submits but no email received**
- Check spam folder
- Verify EmailJS service is active
- Test template in EmailJS dashboard

## Production Deployment

When deploying to Vercel/Netlify:
1. Add environment variables in hosting dashboard
2. Use same variable names (`VITE_EMAILJS_SERVICE_ID`, etc.)
3. Deploy and test

That's it! Your contact form should now send emails directly to your inbox.