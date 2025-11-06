# Katie Hunt - Teaching Portfolio

A modern, responsive single-page portfolio website showcasing the work of Katie Hunt as an Educator, Front-End Engineer, and AI Integration Specialist. Built with vanilla HTML, CSS, and JavaScript, featuring smooth animations, glassmorphism design, and accessible user experience.

## 🌟 Features

### Design & User Experience
- **Glassmorphism UI**: Modern glassmorphic design with dark theme and gradient accents
- **Animated Background**: Neural grid pattern with gradient orbs and code rain effects
- **Smooth Animations**: GSAP-powered scroll animations and hover effects
- **Responsive Design**: Fully responsive layout optimized for all device sizes
- **Progress Indicator**: Scroll progress bar at the top of the page
- **Interactive Elements**: Mouse-tracking effects on glass cards

### Accessibility
- **ARIA Labels**: Comprehensive accessibility attributes throughout
- **Skip Links**: Navigation skip link for keyboard users
- **Semantic HTML**: Proper semantic structure for screen readers
- **Keyboard Navigation**: Full keyboard support for all interactive elements

### Sections
1. **Hero Section**: Animated introduction with role badges and statistics
2. **About Section**: Professional narrative and core principles
3. **Projects Section**: Portfolio showcase with 6 featured projects
4. **Skills Section**: Comprehensive skill categories with proficiency indicators
5. **Contact Section**: Social links and email modal

### Interactive Features
- **Email Modal**: Click-to-copy email functionality with visual feedback
- **Mobile Menu**: Hamburger menu for mobile navigation
- **Scroll Animations**: Elements animate into view on scroll
- **Smooth Scrolling**: Smooth navigation between sections

## 🛠️ Technologies Used

### Core
- **HTML5**: Semantic markup
- **CSS3**: Custom properties, animations, glassmorphism effects
- **Vanilla JavaScript**: No framework dependencies

### Libraries
- **GSAP 3.12.2**: Animation library for smooth scroll-triggered animations
  - ScrollTrigger plugin for scroll-based animations
- **Google Fonts**: 
  - Inter (body text)
  - Space Grotesk (display headings)

### External Resources
- CDN-hosted libraries (no package manager required)
- Google Fonts API

## 📁 Project Structure

```
Teaching Portfolio/
│
├── Katie_Hunt_Portfolio_Final.html    # Main HTML file
├── css/
│   └── styles.css                     # All styles and animations
├── js/
│   └── main.js                        # JavaScript functionality
├── images/
│   ├── Hero Section Picture 1.png     # Hero section image
│   └── Hero Section Picture 4.png    # Additional hero image
├── Projects/                           # Portfolio project files
│   ├── *.ipynb                        # Jupyter notebooks
│   ├── *.pptx                         # PowerPoint presentations
│   ├── *.docx                         # Word documents
│   └── *.pdf                          # PDF documents
├── Katie_Hunt_Resume_.pdf             # Resume PDF
└── teaching-portfolio-improvement-prompt.md
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for development)

### Installation

1. **Clone or Download** the repository:
   ```bash
   git clone <repository-url>
   cd "Teaching Portfolio"
   ```

2. **Open the HTML file**:
   - **Option 1**: Simply open `Katie_Hunt_Portfolio_Final.html` in your web browser
   - **Option 2**: Use a local development server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (with http-server installed)
     npx http-server
     
     # Then navigate to http://localhost:8000
     ```

3. **No build process required** - The project uses CDN-hosted libraries and requires no compilation.

## 📝 Usage

### Viewing the Portfolio
Simply open `Katie_Hunt_Portfolio_Final.html` in any modern web browser. The portfolio is fully functional as a standalone file with external CSS and JavaScript.

### Navigation
- Use the header navigation menu to jump to different sections
- Click "Let's Connect" button to open the email modal
- Scroll down to view all sections with smooth animations
- Use the mobile menu (☰) on smaller screens

### Email Contact
1. Click any "Let's Connect" or email icon
2. Modal opens with email address
3. Click "Copy Email" button to copy to clipboard
4. Visual feedback confirms successful copy

## 🎨 Customization

### Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
    --primary: #8b5cf6;        /* Main brand color */
    --secondary: #14b8a6;      /* Accent color */
    --accent: #f59e0b;         /* Highlight color */
    --bg-dark: #0f0f23;        /* Background color */
}
```

### Content
- **Personal Information**: Update meta tags and structured data in the `<head>` section
- **About Section**: Modify text content in the About section (lines 198-254)
- **Projects**: Add/edit project cards in the Projects section (lines 269-443)
- **Skills**: Update skill categories and items in the Skills section (lines 448-653)
- **Contact**: Update social links and email in the Contact section (lines 657-669)

### Images
Replace hero images in the `images/` directory and update the `src` attributes in the HTML.

### Animations
Adjust GSAP animation settings in `js/main.js`:
- Scroll trigger thresholds
- Animation durations
- Stagger delays

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ Internet Explorer (not supported)

## 🔍 SEO Features

- **Meta Tags**: Comprehensive meta description, keywords, and Open Graph tags
- **Structured Data**: JSON-LD schema for rich search results
- **Semantic HTML**: Proper heading hierarchy and semantic elements
- **Accessibility**: ARIA labels and roles for better indexing

## 📊 Performance

- **CDN Resources**: External libraries loaded via CDN for caching
- **Optimized CSS**: CSS variables for efficient styling
- **Lazy Animations**: Scroll-triggered animations for performance
- **Minimal JavaScript**: Vanilla JS with no heavy framework overhead

## 🐛 Troubleshooting

### Animations Not Working
- Ensure internet connection (GSAP loaded from CDN)
- Check browser console for JavaScript errors
- Verify GSAP library is loading: `console.log(typeof gsap)`

### Images Not Displaying
- Verify image paths in `images/` directory
- Check that image filenames match exactly (case-sensitive)
- Ensure images are in the correct relative path

### Styles Not Loading
- Verify `css/styles.css` path is correct
- Check browser console for 404 errors
- Ensure file structure matches the project layout

## 📄 License

© 2025 Katie Hunt. All rights reserved.

This portfolio is created for personal/professional use. All content, including text, images, and design, is proprietary to Katie Hunt.

## 👤 Author

**Katie Hunt**
- Email: katiehunt95@gmail.com
- LinkedIn: [katie-hunt-](https://www.linkedin.com/in/katie-hunt-/)
- GitHub: [khunt247](https://github.com/khunt247)
- Portfolio: [Frontend Portfolio](https://khunt247.github.io/FrontEnd-Engineer-Portfolio/)

## 🙏 Acknowledgments

- **GSAP**: GreenSock Animation Platform for smooth animations
- **Google Fonts**: Inter and Space Grotesk typography
- **Design Inspiration**: Modern glassmorphism and dark theme design trends

---

**Built with passion at the intersection of education, technology, and innovation.**

