# AI Portfolio Website

A modern, professional portfolio website built for Computer Science Master's students specializing in AI and Data Science. Built with React, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Modern Design**: Deep blue theme with cyan/electric blue accents
- **Responsive**: Fully responsive design that works on all devices
- **Animations**: Smooth animations and transitions using Framer Motion
- **Easy to Maintain**: JSON-based content management for easy updates
- **Performance Optimized**: Built with Vite for fast development and optimized builds
- **TypeScript**: Full type safety throughout the application
- **Analytics**: Built-in resume download and view tracking

## 🛠️ Tech Stack

- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with custom color palette
- **Animations**: Framer Motion
- **Icons**: Lucide React & React Icons
- **Build Tool**: Vite
- **Deployment**: Ready for Vercel, Netlify, or GitHub Pages

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Hero/           # Hero section component
│   ├── About/          # About section component
│   ├── Projects/       # Projects showcase component
│   ├── Research/       # Research & publications component
│   ├── Skills/         # Skills visualization component
│   ├── Contact/        # Contact section component
│   ├── Layout/         # Layout components
│   └── UI/             # Reusable UI components
├── data/               # JSON data files
│   ├── portfolio.json  # Personal information
│   ├── projects.json   # Project data
│   ├── skills.json     # Skills data
│   └── research.json   # Research & publications
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
└── assets/             # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ai-portfolio-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 📝 Customization

### Quick Start Customization

For detailed customization instructions, see our comprehensive guides:

- **[📖 Content Update Guide](CONTENT_UPDATE_GUIDE.md)** - Complete guide for updating all content
- **[🚀 Project Management Guide](PROJECT_MANAGEMENT_GUIDE.md)** - Step-by-step project addition and management
- **[🛠 Skills Update Guide](SKILLS_UPDATE_GUIDE.md)** - Managing technical skills and categories
- **[🌐 Deployment Guide](DEPLOYMENT_GUIDE.md)** - Free hosting setup and deployment options

### Quick Reference

**Update Personal Info** (`src/data/portfolio.json`):
```json
{
  "personal": {
    "name": "Your Name",
    "title": "CS M. Tech Student | AI & Data Science",
    "email": "your.email@university.edu"
  }
}
```

**Add New Project** (`src/data/projects.json`):
```json
{
  "id": "unique-project-id",
  "title": "Project Title",
  "description": "Brief description",
  "techStack": ["Python", "TensorFlow"],
  "githubUrl": "https://github.com/user/project",
  "imageUrl": "/images/project-preview.jpg",
  "featured": true,
  "category": "AI"
}
```

**Update Skills** (`src/data/skills.json`):
```json
{
  "category": "Programming Languages",
  "skills": [
    {"name": "Python", "level": "Advanced"},
    {"name": "JavaScript", "level": "Intermediate"}
  ]
}
```

## 🎨 Color Customization

The color palette is defined in `tailwind.config.js`. You can customize the colors by modifying the theme:

```js
colors: {
  primary: {
    bg: '#0f172a',           // Main background
    'bg-secondary': '#1e293b', // Card backgrounds
  },
  accent: {
    primary: '#06b6d4',      // Primary accent (cyan)
    secondary: '#3b82f6',    // Secondary accent (blue)
  },
  // ... more colors
}
```

## 📱 Deployment

### Free Hosting Options (100% Free)

**Vercel (Recommended)**:
```bash
npm install -g vercel
vercel
```

**Netlify**: Connect GitHub repository, build command: `npm run build`, publish directory: `dist`

**GitHub Pages**: Automatic deployment workflow included (see `.github/workflows/deploy.yml`)

For detailed deployment instructions and configuration, see **[🌐 Deployment Guide](DEPLOYMENT_GUIDE.md)**.

## 📊 Analytics

The website includes built-in analytics for tracking:
- Resume downloads
- Page views
- Contact form submissions

Analytics data is stored locally and can be extended with backend integration.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📚 Complete Documentation

For comprehensive guides and detailed instructions:

**[📋 Documentation Index](DOCUMENTATION_INDEX.md)** - Complete guide to all available documentation

**Quick Links**:
- [🚀 Quick Start Checklist](QUICK_START_CHECKLIST.md) - Complete setup guide (60 minutes)
- [📖 Content Update Guide](CONTENT_UPDATE_GUIDE.md) - Update all website content
- [🛠 Project Management Guide](PROJECT_MANAGEMENT_GUIDE.md) - Add and manage projects
- [🌐 Deployment Guide](DEPLOYMENT_GUIDE.md) - Free hosting setup
- [🔧 Maintenance Guide](MAINTENANCE_GUIDE.md) - Keep your site updated

## 🆘 Support

If you need help:
1. **Start with**: [Documentation Index](DOCUMENTATION_INDEX.md) to find the right guide
2. **For setup**: Follow the [Quick Start Checklist](QUICK_START_CHECKLIST.md)
3. **For specific tasks**: Use the detailed guides linked above
4. **For issues**: Check troubleshooting sections in relevant guides
5. **Still stuck?** Open an issue with specific details

---

Built with ❤️ for CS students specializing in AI & Data Science