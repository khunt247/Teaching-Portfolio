# PowerPoint to PDF Conversion Guide

## Overview
This guide will help you convert all PowerPoint presentations to PDF format so they can be viewed directly in your portfolio modal without any downloads.

## Prerequisites
- ✅ Windows OS (you have this)
- ✅ Microsoft PowerPoint installed (required for conversion)
- ✅ Python installed (you already have this)

## Step 1: Run the Conversion Script

Open your terminal in the portfolio directory and run:

```powershell
python convert_pptx_to_pdf.py
```

### What the script does:
1. Finds all `.pptx` files in the `Projects` directory
2. Converts each one to `.pdf` format
3. Saves PDFs in the same location as the original files
4. Skips files that are already converted
5. Shows a summary of results

### Expected Output:
```
🔄 PowerPoint to PDF Converter
============================================================
Found 20 PowerPoint files to convert

============================================================
✅ Converted: AGILITY.pptx
✅ Converted: BASKETBALL 101.pptx
✅ Converted: CORE STRENGTH.pptx
... (and so on)
============================================================

📊 Conversion Summary:
   ✅ Converted: 20
   ⏭️  Skipped: 0
   ❌ Failed: 0
   📁 Total: 20
============================================================
```

## Step 2: Update HTML Project Cards

After conversion, you need to update your project cards to point to the PDF files instead of PPTX files.

### Find and Replace in `index.html`:

**Before:**
```html
<button onclick="viewArtifact('Projects/physical-education-curriculum/presentations/units/AGILITY.pptx', 'Agility Training', 'presentation')">
    View Artifact
</button>
```

**After:**
```html
<button onclick="viewArtifact('Projects/physical-education-curriculum/presentations/units/AGILITY.pdf', 'Agility Training', 'pdf')">
    View Artifact
</button>
```

### Quick Find & Replace:
1. Open `index.html`
2. Find: `.pptx', 'Agility Training', 'presentation'`
3. Replace: `.pdf', 'Agility Training', 'pdf'`
4. Repeat for each presentation

**OR** use this bulk find/replace:
- Find: `\.pptx'`
- Replace: `.pdf'`
- Find: `'presentation')`
- Replace: `'pdf')`

## Step 3: Update JavaScript (Optional)

The JavaScript already handles PDFs perfectly! No changes needed to `js/main.js` since PDFs display in iframes just like your existing PDF artifacts.

## Step 4: Test

1. Refresh your browser at `http://localhost:8000`
2. Navigate to Projects section
3. Click "View Collection" on "Physical Education Unit Presentations"
4. Click any presentation
5. It should now display as a PDF in the modal! 🎉

## File Structure After Conversion

```
Projects/
└── physical-education-curriculum/
    └── presentations/
        ├── units/
        │   ├── AGILITY.pptx          (original - can keep or delete)
        │   ├── AGILITY.pdf           (new - displays in modal)
        │   ├── BASKETBALL 101.pptx
        │   ├── BASKETBALL 101.pdf
        │   └── ...
        ├── classroom-management/
        │   └── ...
        └── assessments/
            └── ...
```

## Benefits of PDF Format

✅ **Direct viewing** - Opens in modal instantly
✅ **No downloads** - Users view content immediately  
✅ **Universal support** - Works in all browsers
✅ **Reliable** - No JavaScript library dependencies
✅ **Fast** - Lightweight and quick to load
✅ **Professional** - Maintains formatting perfectly

## Troubleshooting

### If conversion fails:
1. **Make sure PowerPoint is installed** - The script uses PowerPoint to convert
2. **Close PowerPoint** - Make sure no presentations are open
3. **Check file permissions** - Ensure you can read/write in the Projects folder
4. **Run as Administrator** - Right-click terminal → "Run as Administrator"

### If a specific file fails:
- Open the .pptx file in PowerPoint manually
- File → Save As → PDF
- Save it in the same location

## Cleanup (Optional)

After confirming PDFs work:
1. You can delete the original `.pptx` files to save space
2. Or keep them as editable backups
3. The portfolio only needs the `.pdf` files

## Need Help?

If you encounter any issues:
1. Check the error message in the terminal
2. Verify PowerPoint is installed and working
3. Try converting one file manually first
4. Make sure Python and comtypes are installed: `pip install comtypes`

---

**Ready to convert?** Run the script and let's get your presentations displaying beautifully in the modal! 🚀
