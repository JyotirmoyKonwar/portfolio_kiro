# EmailJS Setup - Step by Step

## Current Issue
Your contact form is falling back to mailto because EmailJS isn't properly configured. Let's fix this!

## Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Click "Sign Up" (it's free)
3. Verify your email address

## Step 2: Add Email Service
1. In EmailJS dashboard, click "Email Services"
2. Click "Add New Service"
3. Choose your email provider:
   - **Gmail**: Most common choice
   - **Outlook**: If you use Microsoft email
   - **Yahoo**: If you use Yahoo email
4. Follow the setup instructions for your provider
5. **IMPORTANT**: Copy the "Service ID" (looks like `service_xxxxxxx`)

## Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Replace the default template with this:

**Subject:**
```
New message from {{from_name}} - {{subject}}
```

**Content:**
```
You have received a new message from your portfolio contact form.

From: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This email was sent from your portfolio website contact form.
```

4. Click "Save"
5. **IMPORTANT**: Copy the "Template ID" (looks like `template_xxxxxxx`)

## Step 4: Get Public Key
1. Go to "Account" in the left sidebar
2. Click "General"
3. Find "Public Key" section
4. **IMPORTANT**: Copy your public key (looks like `user_xxxxxxxxxxxxxxx`)

## Step 5: Update Your .env File
Replace the content in your `.env` file with your actual credentials:

```bash
# Replace these with your actual EmailJS credentials
VITE_EMAILJS_SERVICE_ID=service_your_actual_id
VITE_EMAILJS_TEMPLATE_ID=template_your_actual_id
VITE_EMAILJS_PUBLIC_KEY=user_your_actual_key

# Your contact email
VITE_CONTACT_EMAIL=jyotirmoykonwarjk@gmail.com
```

## Step 6: Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 7: Test the Setup
1. Open your browser to http://localhost:5173 (or whatever port it shows)
2. Go to the contact form
3. Look for the "🔧 Debug Info" section (only visible in development)
4. Check that all items show "✓ Set" and "✓ Yes"
5. Fill out and submit the form
6. Check your email inbox (and spam folder)

## Troubleshooting

### If Debug Info shows "✗ Missing":
- Double-check your `.env` file has the correct variable names
- Make sure there are no spaces around the `=` sign
- Restart the development server

### If EmailJS Loaded shows "✗ No":
- Check browser console for errors
- Make sure you have internet connection
- Try refreshing the page

### If form still opens mailto:
- Check browser console for error messages
- Click "Log Status to Console" button in debug section
- Make sure all environment variables are set correctly

### If emails aren't received:
- Check your spam/junk folder
- Verify the email template in EmailJS dashboard
- Test sending an email directly from EmailJS dashboard

## Quick Test
Once everything is set up, you can test by:
1. Opening browser console (F12)
2. Filling out the contact form
3. Submitting it
4. Looking for success/error messages in console
5. Checking your email

## Need Help?
If you're still having issues:
1. Check the browser console for error messages
2. Take a screenshot of the debug info section
3. Verify your EmailJS dashboard shows the service and template are active

The debug info will help identify exactly what's missing!