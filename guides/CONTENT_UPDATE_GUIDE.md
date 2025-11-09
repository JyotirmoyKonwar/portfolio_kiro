# Content Update Guide

This guide provides step-by-step instructions for updating your portfolio website content without needing extensive web development knowledge.

## Overview

Your portfolio website is built with a data-driven approach, meaning most content can be updated by simply editing JSON files in the `src/data/` directory. No code changes are required for most updates.

## Quick Reference

- **Personal Information**: `src/data/portfolio.json`
- **Projects**: `src/data/projects.json`
- **Skills**: `src/data/skills.json`
- **Research/Publications**: `src/data/research.json`
- **About Section**: `src/data/about.json`

## File Structure

```
src/data/
├── portfolio.json    # Personal info, contact details, social links
├── projects.json     # Project showcase data
├── skills.json       # Technical skills and categories
├── research.json     # Publications and research work
└── about.json        # About section content
```

## Common Updates

### 1. Updating Personal Information

**File**: `src/data/portfolio.json`

```json
{
  "personal": {
    "name": "Your Full Name",
    "title": "CS M. Tech Student | AI & Data Science",
    "tagline": "Your compelling tagline here",
    "email": "your.email@university.edu",
    "location": "City, Country",
    "bio": "Brief professional bio...",
    "resumeUrl": "/documents/resume.pdf"
  },
  "social": {
    "linkedin": "https://linkedin.com/in/yourprofile",
    "github": "https://github.com/yourusername",
    "scholar": "https://scholar.google.com/citations?user=youruser",
    "twitter": "https://twitter.com/yourhandle"
  }
}
```

**What you can update**:
- Name and title
- Tagline (appears in hero section)
- Contact email
- Location
- Bio text
- Social media links

### 2. Adding/Updating Projects

**File**: `src/data/projects.json`

This file contains an array of project objects. Each project should follow this structure:

```json
{
  "id": "unique-project-id",
  "title": "Project Title",
  "description": "Brief description for project card",
  "longDescription": "Detailed description (optional)",
  "techStack": ["Python", "TensorFlow", "React"],
  "githubUrl": "https://github.com/username/project",
  "liveUrl": "https://project-demo.com",
  "imageUrl": "/images/project-preview.jpg",
  "featured": true,
  "category": "ML"
}
```

**Field Explanations**:
- `id`: Unique identifier (use lowercase with hyphens)
- `title`: Project name as it appears on the site
- `description`: Short description for project cards (2-3 sentences)
- `longDescription`: Detailed description (optional, for expanded view)
- `techStack`: Array of technologies used
- `githubUrl`: Link to GitHub repository
- `liveUrl`: Link to live demo (optional)
- `imageUrl`: Path to project preview image
- `featured`: Whether to highlight this project
- `category`: One of "ML", "AI", "Data Science", "Research"

### 3. Updating Skills

**File**: `src/data/skills.json`

Skills are organized by categories:

```json
[
  {
    "category": "Programming Languages",
    "skills": [
      {"name": "Python", "level": "Advanced"},
      {"name": "JavaScript", "level": "Intermediate"},
      {"name": "R", "level": "Intermediate"}
    ]
  },
  {
    "category": "AI/ML Frameworks",
    "skills": [
      {"name": "TensorFlow", "level": "Advanced"},
      {"name": "PyTorch", "level": "Intermediate"},
      {"name": "scikit-learn", "level": "Advanced"}
    ]
  }
]
```

**Skill Levels**: "Beginner", "Intermediate", "Advanced", "Expert"

### 4. Adding Research/Publications

**File**: `src/data/research.json`

```json
[
  {
    "id": "research-1",
    "title": "Paper Title",
    "authors": ["Your Name", "Co-Author Name"],
    "venue": "Conference/Journal Name",
    "year": 2024,
    "abstract": "Paper abstract...",
    "pdfUrl": "https://link-to-paper.com",
    "arxivUrl": "https://arxiv.org/abs/xxxx.xxxxx",
    "status": "published"
  }
]
```

**Status Options**: "published", "submitted", "in-progress"

## Image Management

### Adding Project Images

1. Place images in `public/images/` directory
2. Use descriptive filenames: `project-name-preview.jpg`
3. Recommended size: 800x600px or 16:9 aspect ratio
4. Supported formats: JPG, PNG, WebP

### Updating Resume

1. Place your resume PDF in `public/documents/`
2. Name it `resume.pdf` or update the `resumeUrl` in `portfolio.json`

## Testing Your Changes

After making updates:

1. **Local Testing** (if you have development environment):
   ```bash
   npm run dev
   ```

2. **Production Testing**:
   - Commit and push your changes
   - Check the deployed site after automatic deployment

## Common Issues and Solutions

### JSON Syntax Errors

**Problem**: Site doesn't load after updates
**Solution**: Validate your JSON syntax
- Use a JSON validator online
- Check for missing commas, quotes, or brackets
- Ensure proper nesting

### Missing Images

**Problem**: Project images don't display
**Solution**: 
- Verify image path in JSON matches actual file location
- Ensure images are in `public/images/` directory
- Check file extensions match exactly

### Broken Links

**Problem**: External links don't work
**Solution**:
- Ensure URLs include `https://`
- Test links in a browser before adding

## Best Practices

1. **Backup**: Always backup your data files before major changes
2. **Small Changes**: Make small, incremental updates and test
3. **Consistent Formatting**: Follow the existing JSON structure exactly
4. **Image Optimization**: Compress images before uploading
5. **Professional Content**: Keep descriptions professional and concise

## Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Validate JSON syntax using online tools
3. Compare your changes with the original file structure
4. Revert to a previous working version if needed

## Next Steps

- See `PROJECT_MANAGEMENT_GUIDE.md` for detailed project addition workflow
- See `SKILLS_UPDATE_GUIDE.md` for comprehensive skills management
- See `DEPLOYMENT_GUIDE.md` for deployment and hosting information