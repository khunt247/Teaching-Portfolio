# Jupyter Notebook Screenshots

This directory contains screenshot images of Jupyter notebooks for display in the portfolio.

## Required Screenshots

Add the following screenshot files to this directory:

1. **Python 4 Beginners Week_1.png** - Screenshot of the "Python 4 Beginners Week_1.ipynb" notebook
2. **backtest_tutorial.png** - Screenshot of the "backtest_tutorial.ipynb" notebook
3. **backtest_tutorial_explained.png** - Screenshot of the "backtest_tutorial_explained.ipynb" notebook

## How to Create Screenshots

1. Open the Jupyter notebook in JupyterLab or Jupyter Notebook
2. Scroll through the entire notebook to ensure all content is visible
3. Take a screenshot of the entire notebook (you may need multiple screenshots if the notebook is long)
4. Save the screenshot(s) with the exact filename(s) listed above

## Multiple Screenshots

If a notebook is too long for a single screenshot, you can add multiple screenshots by:

1. Naming them sequentially: `notebook_name_1.png`, `notebook_name_2.png`, etc.
2. Updating the mapping in `js/main.js` in the `getNotebookScreenshots()` function to include all screenshot paths

Example:
```javascript
'Projects/python-programming/notebooks/example.ipynb': [
    'Projects/python-programming/screenshots/example_1.png',
    'Projects/python-programming/screenshots/example_2.png',
    'Projects/python-programming/screenshots/example_3.png'
]
```

## Image Format

- **Format**: PNG (recommended) or JPG
- **Quality**: High resolution for readability
- **Aspect Ratio**: Preserve the notebook's natural aspect ratio

