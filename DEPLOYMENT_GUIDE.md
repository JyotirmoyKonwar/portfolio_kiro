# Deployment Guide

This guide provides comprehensive instructions for deploying your portfolio website using free hosting services, with a focus on Vercel as the recommended platform.

## Overview

Your portfolio website is built as a static React application that can be deployed on various free hosting platforms. This guide covers setup, deployment, and maintenance for multiple free hosting options.

## Recommended: Vercel (100% Free)

Vercel offers the best free tier for React applications with automatic deployments, custom domains, and built-in performance optimization.

### Why Vercel?

- **Unlimited personal projects** on free tier
- **Automatic deployments** from GitHub
- **Built-in performance optimization**
- **Free custom domain support**
- **Serverless functions** included (for analytics)
- **Global CDN** for fast loading worldwide
- **Zero configuration** for React apps

### Vercel Setup Instructions

#### Step 1: Prepare Your Repository

1. **Ensure your code is on GitHub**:
   ```bash
   # If not already initialized
   git init
   git add .
   git commit -m "Initial commit"
   
   # Create GitHub repository and push
   git remote add origin https://github.com/yourusername/your-portfolio.git
   git push -u origin main
   ```

2. **Verify build works locally**:
   ```bash
   npm run build
   npm run preview
   ```

#### Step 2: Deploy to Vercel

**Option A: Vercel CLI (Recommended)**

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   cd ai-portfolio-website
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project? **N**
   - Project name: **your-portfolio** (or desired name)
   - Directory: **./ai-portfolio-website** (if running from parent directory)
   - Want to override settings? **N**

**Option B: Vercel Dashboard**

1. **Visit [vercel.com](https://vercel.com)**
2. **Sign up/Login** with GitHub account
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure project**:
   - Framework Preset: **Vite**
   - Root Directory: **ai-portfolio-website** (if in subdirectory)
   - Build Command: **npm run build**
   - Output Directory: **dist**
6. **Click "Deploy"**

#### Step 3: Configure Custom Domain (Optional)

1. **In Vercel Dashboard**, go to your project
2. **Navigate to "Settings" → "Domains"**
3. **Add your custom domain**
4. **Follow DNS configuration instructions**

#### Step 4: Set Up Automatic Deployments

Automatic deployments are enabled by default when you connect your GitHub repository. Every push to the main branch will trigger a new deployment.

**To configure deployment settings**:
1. Go to project settings in Vercel dashboard
2. Navigate to "Git" section
3. Configure branch settings if needed

### Vercel Configuration File

Create `vercel.json` in your project root for advanced configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## Alternative Free Hosting Options

### Netlify

**Pros**: Generous free tier, form handling, easy setup
**Cons**: Slightly more complex than Vercel for React apps

#### Netlify Setup

1. **Visit [netlify.com](https://netlify.com)**
2. **Sign up with GitHub**
3. **Click "New site from Git"**
4. **Choose your repository**
5. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Deploy site**

#### Netlify Configuration

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### GitHub Pages

**Pros**: Integrated with GitHub, simple setup
**Cons**: Limited to static sites, no serverless functions

#### GitHub Pages Setup

1. **Create `.github/workflows/deploy.yml`**:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

2. **Enable GitHub Pages**:
   - Go to repository Settings
   - Navigate to Pages section
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch

3. **Update Vite config** for GitHub Pages:

```javascript
// vite.config.ts
export default defineConfig({
  base: '/your-repository-name/',
  // ... other config
})
```

### Surge.sh

**Pros**: Simple CLI deployment, custom domains
**Cons**: Manual deployment process

#### Surge Setup

1. **Install Surge CLI**:
   ```bash
   npm install -g surge
   ```

2. **Build and deploy**:
   ```bash
   npm run build
   cd dist
   surge
   ```

3. **Follow prompts** for domain and account setup

## Environment Configuration

### Environment Variables

For different environments, create environment files:

**`.env.local`** (local development):
```
VITE_ANALYTICS_ENABLED=true
VITE_ENVIRONMENT=development
```

**`.env.production`** (production):
```
VITE_ANALYTICS_ENABLED=true
VITE_ENVIRONMENT=production
```

### Build Optimization

Ensure optimal production builds:

**`vite.config.ts`**:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion']
        }
      }
    }
  }
})
```

## Domain Setup

### Custom Domain Configuration

#### For Vercel:
1. Add domain in Vercel dashboard
2. Configure DNS records:
   - **A Record**: `@` → `76.76.19.61`
   - **CNAME**: `www` → `cname.vercel-dns.com`

#### For Netlify:
1. Add domain in Netlify dashboard
2. Configure DNS records:
   - **A Record**: `@` → Netlify's IP
   - **CNAME**: `www` → `your-site.netlify.app`

### SSL Certificates

All recommended platforms provide free SSL certificates automatically:
- **Vercel**: Automatic SSL with Let's Encrypt
- **Netlify**: Automatic SSL with Let's Encrypt
- **GitHub Pages**: Automatic SSL for custom domains

## Monitoring and Analytics

### Deployment Monitoring

**Vercel**:
- Built-in deployment logs and monitoring
- Performance insights in dashboard
- Real-time error tracking

**Netlify**:
- Deployment logs and build notifications
- Form submission tracking
- Split testing capabilities

### Performance Monitoring

Add performance monitoring to your site:

```javascript
// src/utils/performance.ts
export const trackPerformance = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart);
    });
  }
};
```

## Troubleshooting

### Common Deployment Issues

**Build Failures**:
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Test build locally before deploying

**Routing Issues (404 on refresh)**:
- Configure redirects for SPA routing
- Ensure `index.html` fallback is set up

**Environment Variable Issues**:
- Prefix variables with `VITE_` for Vite
- Set variables in hosting platform dashboard
- Don't commit sensitive variables to Git

**Performance Issues**:
- Enable compression in hosting settings
- Optimize images and assets
- Use code splitting for large bundles

### Debugging Deployment

1. **Check build logs** in hosting platform dashboard
2. **Test production build locally**:
   ```bash
   npm run build
   npm run preview
   ```
3. **Verify environment variables** are set correctly
4. **Check browser console** for runtime errors

## Maintenance and Updates

### Regular Maintenance Tasks

**Weekly**:
- Monitor site performance and uptime
- Check for broken links or images
- Review analytics data

**Monthly**:
- Update dependencies:
  ```bash
  npm update
  npm audit fix
  ```
- Review and optimize bundle size
- Check for security vulnerabilities

**Quarterly**:
- Review hosting platform usage and limits
- Update content and projects
- Optimize images and assets

### Backup Strategy

**Code Backup**:
- Primary: GitHub repository
- Secondary: Local development environment
- Tertiary: Download repository archive periodically

**Content Backup**:
- Export JSON data files regularly
- Backup images and documents
- Keep version history in Git

## Cost Management

### Free Tier Limits

**Vercel Free Tier**:
- 100GB bandwidth per month
- Unlimited personal projects
- 100 serverless function invocations per day
- 6,000 build minutes per month

**Netlify Free Tier**:
- 100GB bandwidth per month
- 300 build minutes per month
- 1,000 form submissions per month

**GitHub Pages**:
- 1GB storage
- 100GB bandwidth per month
- 10 builds per hour

### Monitoring Usage

- Set up usage alerts in hosting dashboards
- Monitor bandwidth and build minutes
- Optimize assets to reduce bandwidth usage

## Security Best Practices

### Content Security

- Never commit sensitive data to Git
- Use environment variables for configuration
- Regularly update dependencies
- Enable HTTPS (automatic on recommended platforms)

### Access Control

- Use strong passwords for hosting accounts
- Enable two-factor authentication
- Limit repository access to necessary collaborators
- Regularly review access permissions

## Next Steps

After successful deployment:

1. **Test your live site** thoroughly
2. **Set up monitoring** and analytics
3. **Configure custom domain** if desired
4. **Share your portfolio** with your network
5. **Set up regular maintenance** schedule

For ongoing management:
- See `CONTENT_UPDATE_GUIDE.md` for updating content
- See `PROJECT_MANAGEMENT_GUIDE.md` for adding projects
- Monitor hosting platform documentation for updates and new features