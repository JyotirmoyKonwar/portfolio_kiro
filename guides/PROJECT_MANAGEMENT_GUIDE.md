# Project Management Guide

This guide provides detailed instructions for adding, updating, and managing projects in your portfolio website.

## Adding a New Project

### Step 1: Prepare Project Assets

Before adding a project to your portfolio, gather the following:

- **Project preview image** (800x600px recommended, 16:9 aspect ratio)
- **Project description** (2-3 sentences for card, longer description optional)
- **Technology stack** list
- **GitHub repository URL**
- **Live demo URL** (if available)

### Step 2: Add Project Image

1. Navigate to `public/images/` directory
2. Add your project preview image
3. Use a descriptive filename: `project-name-preview.jpg`
4. Supported formats: JPG, PNG, WebP

**Image Guidelines**:
- **Size**: 800x600px or similar 4:3 ratio
- **Quality**: High quality but web-optimized (under 500KB)
- **Content**: Show the project interface, results, or key visual
- **Format**: JPG for photos, PNG for screenshots with text

### Step 3: Update projects.json

1. Open `src/data/projects.json`
2. Add your new project to the array

**Complete Project Object Template**:
```json
{
  "id": "my-new-project",
  "title": "My AI Project",
  "description": "A machine learning project that predicts housing prices using advanced regression techniques and feature engineering.",
  "longDescription": "This comprehensive machine learning project implements multiple regression algorithms to predict housing prices. The project includes extensive data preprocessing, feature engineering, model comparison, and deployment using Flask. Key achievements include 95% accuracy and real-time prediction capabilities.",
  "techStack": [
    "Python",
    "scikit-learn",
    "Pandas",
    "NumPy",
    "Flask",
    "Docker"
  ],
  "githubUrl": "https://github.com/yourusername/housing-price-predictor",
  "liveUrl": "https://housing-predictor-demo.herokuapp.com",
  "imageUrl": "/images/housing-predictor-preview.jpg",
  "featured": true,
  "category": "ML"
}
```

### Step 4: Field-by-Field Guide

#### Required Fields

**`id`** (string, required)
- Unique identifier for the project
- Use lowercase letters, numbers, and hyphens only
- Example: `"housing-price-predictor"`

**`title`** (string, required)
- Project name as displayed on the website
- Keep it concise but descriptive
- Example: `"Housing Price Predictor"`

**`description`** (string, required)
- Brief description for project cards (2-3 sentences)
- Focus on what the project does and key technologies
- Example: `"A machine learning project that predicts housing prices using advanced regression techniques."`

**`techStack`** (array, required)
- List of technologies, frameworks, and tools used
- Order by importance or prominence in the project
- Use standard names: "Python", "TensorFlow", "React", etc.

**`githubUrl`** (string, required)
- Full URL to your GitHub repository
- Must include `https://`
- Example: `"https://github.com/username/project"`

**`imageUrl`** (string, required)
- Path to project preview image
- Must start with `/images/`
- Example: `"/images/project-preview.jpg"`

**`category`** (string, required)
- Project category for filtering/organization
- Options: `"ML"`, `"AI"`, `"Data Science"`, `"Research"`

#### Optional Fields

**`longDescription`** (string, optional)
- Detailed project description
- Used for expanded project views or modals
- Include methodology, results, challenges overcome

**`liveUrl`** (string, optional)
- URL to live demo or deployed application
- Must include `https://`
- Only include if demo is stable and accessible

**`featured`** (boolean, optional)
- Whether to highlight this project
- Featured projects appear first and may have special styling
- Default: `false`

### Step 5: Project Categories

Choose the most appropriate category:

- **"ML"**: Machine Learning projects (predictive models, classification, regression)
- **"AI"**: Artificial Intelligence projects (NLP, computer vision, neural networks)
- **"Data Science"**: Data analysis, visualization, statistical modeling
- **"Research"**: Academic research projects, experimental work

### Step 6: Technology Stack Guidelines

**Popular Technologies by Category**:

**Languages**: Python, R, JavaScript, Java, C++, SQL
**ML/AI Frameworks**: TensorFlow, PyTorch, scikit-learn, Keras, OpenCV
**Data Tools**: Pandas, NumPy, Matplotlib, Seaborn, Jupyter
**Web Technologies**: React, Flask, Django, Node.js, HTML/CSS
**Databases**: PostgreSQL, MongoDB, MySQL, SQLite
**Cloud/Deployment**: AWS, Google Cloud, Docker, Heroku
**Version Control**: Git, GitHub

### Step 7: Writing Effective Descriptions

**Short Description Tips**:
- Start with what the project does
- Mention key technologies or techniques
- Include impact or results if impressive
- Keep it under 150 characters for mobile display

**Examples**:
- ✅ "Deep learning model for medical image classification achieving 94% accuracy using CNN and transfer learning."
- ✅ "Real-time sentiment analysis web app processing Twitter data with LSTM networks and Flask backend."
- ❌ "This is a project I worked on for my machine learning class where I learned about different algorithms."

**Long Description Tips**:
- Explain the problem you solved
- Describe your approach and methodology
- Highlight key technical achievements
- Mention challenges and how you overcame them
- Include quantifiable results when possible

## Managing Existing Projects

### Updating Project Information

1. Locate the project in `src/data/projects.json` by its `id`
2. Update the relevant fields
3. Save the file
4. Test the changes

### Reordering Projects

Projects appear in the order they're listed in the JSON array. To reorder:

1. Cut the entire project object from its current position
2. Paste it in the desired position
3. Ensure proper JSON syntax (commas between objects)

### Removing Projects

1. Find the project object in the array
2. Delete the entire object
3. Remove any trailing comma if it was the last item
4. Ensure valid JSON syntax

### Updating Project Images

1. Replace the image file in `public/images/`
2. Keep the same filename, or update `imageUrl` in the JSON
3. Clear browser cache to see changes immediately

## Project Showcase Best Practices

### Image Best Practices

1. **Consistency**: Use similar aspect ratios for all project images
2. **Quality**: High-resolution but web-optimized
3. **Content**: Show the actual project interface or results
4. **Branding**: Consider adding a subtle watermark or consistent styling

### Content Best Practices

1. **Diversity**: Showcase different types of projects and technologies
2. **Progression**: Show growth in complexity and skills over time
3. **Impact**: Emphasize real-world applications and results
4. **Completeness**: Include both personal and academic projects

### Technical Best Practices

1. **GitHub Repositories**: Ensure all linked repositories are public and well-documented
2. **Live Demos**: Only link to stable, accessible demos
3. **Documentation**: Each project should have a good README on GitHub
4. **Code Quality**: Clean, commented code reflects well on your skills

## Troubleshooting

### Common Issues

**Project not appearing**:
- Check JSON syntax validity
- Ensure all required fields are present
- Verify the project object is within the main array

**Image not loading**:
- Confirm image file exists in `public/images/`
- Check that `imageUrl` path matches exactly
- Verify image file extension is correct

**Broken GitHub links**:
- Ensure repository is public
- Check URL includes `https://`
- Verify repository still exists

### Validation Checklist

Before publishing project updates:

- [ ] JSON syntax is valid
- [ ] All required fields are present
- [ ] Image file exists and loads
- [ ] GitHub repository is accessible
- [ ] Live demo works (if provided)
- [ ] Technology stack is accurate
- [ ] Descriptions are professional and error-free

## Advanced Tips

### Featured Projects Strategy

Mark 2-3 of your best projects as featured:
- Most technically impressive
- Best demonstrates your target skills
- Has strong visual presentation
- Shows real-world impact

### SEO Optimization

- Use descriptive project titles
- Include relevant keywords in descriptions
- Ensure GitHub repositories have good README files
- Add alt text considerations for images

### Portfolio Curation

- Aim for 4-6 high-quality projects rather than many mediocre ones
- Update regularly as you complete new work
- Remove or update older projects that no longer represent your best work
- Balance different types of projects (personal, academic, collaborative)

## Next Steps

After adding projects:
1. Test the website locally if possible
2. Commit and push changes to trigger deployment
3. Verify projects display correctly on the live site
4. Share your updated portfolio with your network

For more information, see:
- `CONTENT_UPDATE_GUIDE.md` for general content updates
- `DEPLOYMENT_GUIDE.md` for publishing changes