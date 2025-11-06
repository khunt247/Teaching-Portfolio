# Metadata JSON Files - Guide

## Overview

All project categories now have comprehensive `metadata.json` files that can be used to dynamically generate your portfolio's project section. These files follow a consistent structure and include all necessary information for displaying projects professionally.

## File Locations

```
Projects/
├── python-programming/
│   └── metadata.json          ✅ Created
├── physical-education-curriculum/
│   └── metadata.json          ✅ Created
├── learning-methodology/
│   └── metadata.json          ✅ Created
└── professional-development/
    └── metadata.json          ✅ Created
```

## Metadata Structure

Each `metadata.json` file contains:

### Top-Level Properties
- `category` - Category identifier (slug format)
- `title` - Display title for the category
- `description` - Category overview
- `categoryIcon` - Icon identifier (or emoji if supported)
- `projects` - Array of project objects

### Project Object Properties
- `id` - Unique identifier (slug format)
- `title` - Project title
- `type` - Project type (jupyter-notebook, presentation, document, etc.)
- `file` - Relative path to the project file
- `preview` - Path to preview image (optional)
- `description` - Detailed project description
- `tags` - Array of relevant tags
- `learningObjectives` - Array of learning objectives
- `targetAudience` - Target audience description
- `metrics` - Object with measurable metrics
- `files` - Array of file objects (for multiple files)

## Usage Examples

### For Static HTML Generation
You can read these JSON files and generate HTML project cards:

```javascript
// Example: Load and display projects
fetch('Projects/python-programming/metadata.json')
  .then(response => response.json())
  .then(data => {
    data.projects.forEach(project => {
      // Generate project card HTML
    });
  });
```

### For Dynamic Portfolio Display
These files can be used with:
- JavaScript/TypeScript to dynamically load projects
- Static site generators (Jekyll, Hugo, etc.)
- React/Vue components for interactive portfolios
- Python scripts to generate HTML

## Customization

### Adding New Projects
1. Open the appropriate `metadata.json` file
2. Add a new project object to the `projects` array
3. Follow the existing structure and format
4. Ensure all required fields are included

### Updating Existing Projects
- Modify any field in the project object
- Ensure JSON syntax remains valid (commas, quotes, etc.)
- Validate JSON after editing

### Adding Prezi Presentations
1. Create a new folder in `learning-methodology/prezi/`
2. Add `prezi-url.txt` with the Prezi URL
3. Add `metadata.txt` with presentation details
4. Update `learning-methodology/metadata.json` with the new presentation

## Validation

All metadata.json files have been validated and are properly formatted JSON. They include:
- ✅ Proper JSON syntax
- ✅ Consistent structure across categories
- ✅ Comprehensive project descriptions
- ✅ Learning objectives where applicable
- ✅ Tags for filtering/categorization
- ✅ Metrics for portfolio display

## Next Steps

1. **Review** - Review each metadata.json file and customize descriptions as needed
2. **Add Previews** - Create preview images for projects (screenshots, thumbnails)
3. **Generate HTML** - Use these JSON files to generate the portfolio HTML
4. **Update** - Keep metadata.json files updated as you add new projects

## File Sizes

- `python-programming/metadata.json` - ~5KB
- `physical-education-curriculum/metadata.json` - ~12KB
- `learning-methodology/metadata.json` - ~4KB
- `professional-development/metadata.json` - ~2KB

All files are optimized and ready for web use.

---

**Created:** During portfolio reorganization
**Status:** ✅ All metadata files created and validated

