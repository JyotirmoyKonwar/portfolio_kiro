# Skills Update Guide

This guide provides detailed instructions for managing and updating the skills section of your portfolio website.

## Overview

The skills section showcases your technical abilities organized by categories. Skills are stored in `src/data/skills.json` and displayed as interactive badges with optional proficiency levels.

## File Structure

**Location**: `src/data/skills.json`

The file contains an array of skill categories, each with its own set of skills:

```json
[
  {
    "category": "Programming Languages",
    "skills": [
      {"name": "Python", "level": "Advanced"},
      {"name": "JavaScript", "level": "Intermediate"}
    ]
  },
  {
    "category": "AI/ML Frameworks",
    "skills": [
      {"name": "TensorFlow", "level": "Advanced"},
      {"name": "PyTorch", "level": "Intermediate"}
    ]
  }
]
```

## Skill Categories

### Recommended Categories for AI/Data Science Portfolio

1. **Programming Languages**
   - Core languages you're proficient in
   - Examples: Python, R, JavaScript, Java, C++, SQL

2. **AI/ML Frameworks**
   - Machine learning and AI libraries
   - Examples: TensorFlow, PyTorch, scikit-learn, Keras, OpenCV

3. **Data Science Tools**
   - Data manipulation and analysis tools
   - Examples: Pandas, NumPy, Matplotlib, Seaborn, Jupyter, Tableau

4. **Web Technologies**
   - Frontend and backend technologies
   - Examples: React, Node.js, Flask, Django, HTML/CSS

5. **Databases**
   - Database systems and query languages
   - Examples: PostgreSQL, MongoDB, MySQL, SQLite, Redis

6. **Cloud & DevOps**
   - Cloud platforms and deployment tools
   - Examples: AWS, Google Cloud, Docker, Kubernetes, Git

7. **Research Tools**
   - Academic and research-specific tools
   - Examples: LaTeX, MATLAB, Stata, SPSS, Zotero

## Adding New Skills

### Step 1: Choose the Right Category

Determine which existing category your skill belongs to, or create a new category if needed.

### Step 2: Add to Existing Category

```json
{
  "category": "Programming Languages",
  "skills": [
    {"name": "Python", "level": "Advanced"},
    {"name": "JavaScript", "level": "Intermediate"},
    {"name": "Go", "level": "Beginner"}  // New skill added
  ]
}
```

### Step 3: Create New Category

If your skill doesn't fit existing categories:

```json
[
  // ... existing categories ...
  {
    "category": "Mobile Development",
    "skills": [
      {"name": "React Native", "level": "Intermediate"},
      {"name": "Flutter", "level": "Beginner"}
    ]
  }
]
```

## Skill Levels

### Proficiency Levels

Use these standardized levels to indicate your proficiency:

- **"Beginner"**: Basic understanding, limited practical experience
- **"Intermediate"**: Solid understanding, can work independently on projects
- **"Advanced"**: Deep expertise, can mentor others, solve complex problems
- **"Expert"**: Recognized expertise, can architect solutions, thought leader

### Level Guidelines by Experience

**Beginner (0-6 months experience)**:
- Completed tutorials or coursework
- Built simple projects or exercises
- Understands basic concepts and syntax

**Intermediate (6 months - 2 years)**:
- Used in multiple projects
- Comfortable with common patterns and libraries
- Can debug and solve problems independently

**Advanced (2+ years)**:
- Deep understanding of best practices
- Experience with complex projects
- Can optimize performance and architecture

**Expert (5+ years or recognized expertise)**:
- Industry recognition or significant contributions
- Can design systems and mentor others
- Stays current with latest developments

## Skill Organization Best Practices

### Category Ordering

Order categories by relevance to your target roles:

1. Most relevant to your career goals first
2. Core technical skills before supporting tools
3. Specialized skills after general ones

**Example for ML Engineer Role**:
1. Programming Languages
2. AI/ML Frameworks
3. Data Science Tools
4. Cloud & DevOps
5. Databases
6. Web Technologies

### Skill Ordering Within Categories

Within each category, order skills by:
1. Proficiency level (Advanced/Expert first)
2. Relevance to target roles
3. Frequency of use

### Skill Selection Strategy

**Quality over Quantity**:
- Include 15-25 total skills across all categories
- Focus on skills you can confidently discuss in interviews
- Remove outdated or rarely-used technologies

**Relevance Focus**:
- Prioritize skills mentioned in target job descriptions
- Include trending technologies in your field
- Balance foundational and cutting-edge skills

## Common Skill Categories and Examples

### Programming Languages
```json
{
  "category": "Programming Languages",
  "skills": [
    {"name": "Python", "level": "Advanced"},
    {"name": "R", "level": "Intermediate"},
    {"name": "SQL", "level": "Advanced"},
    {"name": "JavaScript", "level": "Intermediate"},
    {"name": "Java", "level": "Intermediate"},
    {"name": "C++", "level": "Beginner"}
  ]
}
```

### AI/ML Frameworks
```json
{
  "category": "AI/ML Frameworks",
  "skills": [
    {"name": "TensorFlow", "level": "Advanced"},
    {"name": "PyTorch", "level": "Intermediate"},
    {"name": "scikit-learn", "level": "Advanced"},
    {"name": "Keras", "level": "Advanced"},
    {"name": "OpenCV", "level": "Intermediate"},
    {"name": "Hugging Face", "level": "Intermediate"}
  ]
}
```

### Data Science Tools
```json
{
  "category": "Data Science Tools",
  "skills": [
    {"name": "Pandas", "level": "Advanced"},
    {"name": "NumPy", "level": "Advanced"},
    {"name": "Matplotlib", "level": "Advanced"},
    {"name": "Seaborn", "level": "Intermediate"},
    {"name": "Jupyter", "level": "Advanced"},
    {"name": "Tableau", "level": "Intermediate"}
  ]
}
```

### Cloud & DevOps
```json
{
  "category": "Cloud & DevOps",
  "skills": [
    {"name": "AWS", "level": "Intermediate"},
    {"name": "Docker", "level": "Intermediate"},
    {"name": "Git", "level": "Advanced"},
    {"name": "Linux", "level": "Intermediate"},
    {"name": "CI/CD", "level": "Beginner"}
  ]
}
```

## Updating Existing Skills

### Changing Proficiency Levels

As you gain experience, update skill levels:

```json
// Before
{"name": "PyTorch", "level": "Beginner"}

// After gaining experience
{"name": "PyTorch", "level": "Intermediate"}
```

### Renaming Skills

Use industry-standard names:

```json
// Preferred
{"name": "TensorFlow", "level": "Advanced"}

// Avoid
{"name": "TF", "level": "Advanced"}
```

### Removing Outdated Skills

Remove skills that are:
- No longer relevant to your career goals
- Outdated technologies you haven't used recently
- Beginner-level skills you no longer want to highlight

## Advanced Skill Management

### Skill Validation

Before adding a skill, ensure you can:
- Explain the technology and its use cases
- Discuss projects where you've used it
- Answer basic technical questions about it
- Demonstrate practical knowledge if asked

### Portfolio Alignment

Ensure your skills align with:
- **Projects**: Skills should be demonstrated in your project portfolio
- **Resume**: Consistency between website and resume
- **Target Roles**: Skills should match job requirements you're targeting

### Continuous Updates

**Regular Review Schedule**:
- Monthly: Add new skills from recent projects
- Quarterly: Update proficiency levels based on experience
- Annually: Remove outdated skills and reorganize categories

**Skill Development Tracking**:
- Keep notes on when you start learning new technologies
- Track projects where you use each skill
- Update levels based on concrete milestones

## Troubleshooting

### Common Issues

**Skills not displaying**:
- Check JSON syntax validity
- Ensure proper array and object structure
- Verify all required fields are present

**Category not showing**:
- Confirm category has at least one skill
- Check for typos in category name
- Ensure proper JSON formatting

**Inconsistent styling**:
- Use consistent naming conventions
- Standardize proficiency level terms
- Keep category names concise

### Validation Checklist

Before publishing skill updates:

- [ ] JSON syntax is valid
- [ ] All skills have both "name" and "level" fields
- [ ] Proficiency levels use standard terms
- [ ] Skills are organized in logical categories
- [ ] Total number of skills is reasonable (15-25)
- [ ] Skills align with project portfolio
- [ ] No duplicate skills across categories

## Best Practices Summary

### Content Strategy
1. **Be Honest**: Only include skills you can discuss confidently
2. **Stay Current**: Regularly update based on new learning
3. **Be Selective**: Quality over quantity in skill selection
4. **Show Growth**: Update proficiency levels as you improve

### Technical Strategy
1. **Consistent Naming**: Use industry-standard technology names
2. **Logical Grouping**: Organize skills in meaningful categories
3. **Balanced Portfolio**: Mix of foundational and specialized skills
4. **Regular Maintenance**: Keep skills section current and relevant

### Career Strategy
1. **Target Alignment**: Focus on skills relevant to your career goals
2. **Market Awareness**: Include trending technologies in your field
3. **Differentiation**: Highlight unique or specialized skills
4. **Evidence**: Ensure skills are demonstrated in your projects

## Next Steps

After updating skills:
1. Review alignment with your project portfolio
2. Update your resume to match
3. Test the website to ensure proper display
4. Consider adding projects that demonstrate new skills

For more information, see:
- `CONTENT_UPDATE_GUIDE.md` for general content management
- `PROJECT_MANAGEMENT_GUIDE.md` for showcasing skill applications