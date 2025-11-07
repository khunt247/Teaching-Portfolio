"""
Batch Convert PowerPoint Files to PDF
This script converts all .pptx files in the Projects directory to .pdf format
so they can be viewed directly in the portfolio modal.
"""

import os
from pathlib import Path
import comtypes.client
import sys

def convert_pptx_to_pdf(pptx_path, pdf_path):
    """Convert a PowerPoint file to PDF using COM automation"""
    try:
        # Create PowerPoint application object
        powerpoint = comtypes.client.CreateObject("Powerpoint.Application")
        powerpoint.Visible = 1
        
        # Convert paths to absolute paths
        pptx_abs = str(pptx_path.resolve())
        pdf_abs = str(pdf_path.resolve())
        
        # Open the presentation
        presentation = powerpoint.Presentations.Open(pptx_abs, WithWindow=False)
        
        # Save as PDF (format 32 is PDF)
        presentation.SaveAs(pdf_abs, 32)
        
        # Close presentation
        presentation.Close()
        
        print(f"✅ Converted: {pptx_path.name}")
        return True
        
    except Exception as e:
        print(f"❌ Error converting {pptx_path.name}: {e}")
        return False
    
    finally:
        # Quit PowerPoint
        try:
            powerpoint.Quit()
        except:
            pass

def main():
    # Base directory
    base_dir = Path(__file__).parent
    projects_dir = base_dir / "Projects"
    
    if not projects_dir.exists():
        print(f"❌ Projects directory not found: {projects_dir}")
        sys.exit(1)
    
    # Find all .pptx files
    pptx_files = list(projects_dir.rglob("*.pptx"))
    
    if not pptx_files:
        print("No PowerPoint files found.")
        return
    
    print(f"Found {len(pptx_files)} PowerPoint files to convert\n")
    print("="*60)
    
    converted = 0
    skipped = 0
    failed = 0
    
    for pptx_file in pptx_files:
        # Create PDF path (same location, .pdf extension)
        pdf_file = pptx_file.with_suffix('.pdf')
        
        # Skip if PDF already exists
        if pdf_file.exists():
            print(f"⏭️  Skipped: {pptx_file.name} (PDF already exists)")
            skipped += 1
            continue
        
        # Convert
        if convert_pptx_to_pdf(pptx_file, pdf_file):
            converted += 1
        else:
            failed += 1
    
    print("="*60)
    print(f"\n📊 Conversion Summary:")
    print(f"   ✅ Converted: {converted}")
    print(f"   ⏭️  Skipped: {skipped}")
    print(f"   ❌ Failed: {failed}")
    print(f"   📁 Total: {len(pptx_files)}")
    print("="*60)
    
    if converted > 0:
        print("\n✨ Next Steps:")
        print("1. Update your HTML project cards to use .pdf instead of .pptx")
        print("2. The PDFs will display perfectly in the modal just like your other PDFs")
        print("3. You can keep the .pptx files as backups or delete them")

if __name__ == "__main__":
    print("🔄 PowerPoint to PDF Converter")
    print("="*60)
    main()
