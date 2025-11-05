// ================================
// MOBILE MENU
// ================================
function toggleMobileMenu() {
    const nav = document.getElementById('mainNav');
    nav.classList.toggle('mobile-active');
}

// ================================
// PROGRESS BAR
// ================================
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.transform = `scaleX(${scrolled / 100})`;
}

// ================================
// HEADER SCROLL EFFECT
// ================================
function updateHeader() {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// ================================
// MOUSE TRACKING FOR CARDS
// ================================
document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.glass-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    });
});

// ================================
// GSAP ANIMATIONS
// ================================
function initAnimations() {
    if (typeof gsap === 'undefined') {
        // Fallback: ensure all cards are visible if GSAP isn't loaded
        document.querySelectorAll('.glass-card, .project-card, .ai-tool-card, .testimonial-card').forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero animation
    gsap.from('.hero-text > *', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
    });
    
    gsap.from('.tech-card', {
        scale: 0.8,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        delay: 0.5
    });
    
    // Section animations - ensure cards start visible and animate on scroll
    gsap.utils.toArray('.section').forEach(section => {
        const cards = section.querySelectorAll('.glass-card, .project-card, .ai-tool-card, .testimonial-card');
        
        if (cards.length > 0) {
            // Set initial visible state
            gsap.set(cards, { opacity: 1, y: 0 });
            
            // Check if section is already in viewport
            const rect = section.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (!isInViewport) {
                // Only animate if section is not in viewport
                gsap.from(cards, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                        once: true
                    },
                    opacity: 0,
                    y: 50,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power2.out'
                });
            }
        }
    });
    
    // Refresh ScrollTrigger after initialization
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);
}

// ================================
// FORM SUBMISSION
// ================================
function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    alert(`Thank you for reaching out!\n\nYour message has been received. I'll get back to you within 24 hours.\n\nMessage details:\nName: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}`);
    event.target.reset();
}

// ================================
// REFRESH ANIMATIONS ON NAVIGATION
// ================================
function refreshSectionAnimations(targetSection) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    // Wait for smooth scroll to complete
    setTimeout(() => {
        // Check if section is in viewport
        const rect = targetSection.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
        
        if (isInViewport) {
            const cards = targetSection.querySelectorAll('.glass-card, .project-card, .ai-tool-card, .testimonial-card');
            if (cards.length > 0) {
                // Ensure cards are visible
                cards.forEach(card => {
                    const currentOpacity = window.getComputedStyle(card).opacity;
                    if (currentOpacity === '0' || parseFloat(currentOpacity) < 0.5) {
                        gsap.to(card, {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            ease: 'power2.out'
                        });
                    }
                });
            }
        }
        
        // Refresh ScrollTrigger to recalculate positions
        ScrollTrigger.refresh();
    }, 500);
}

// ================================
// SMOOTH SCROLL WITH ANIMATION REFRESH
// ================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Close mobile menu
            const nav = document.getElementById('mainNav');
            if (nav) {
                nav.classList.remove('mobile-active');
            }
            
            // Refresh animations for the target section
            refreshSectionAnimations(target);
        }
    });
});

// ================================
// EVENT LISTENERS
// ================================
window.addEventListener('scroll', () => {
    updateProgressBar();
    updateHeader();
});

// Refresh ScrollTrigger on window resize
window.addEventListener('resize', () => {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
});

// ================================
// INITIALIZATION
// ================================
function init() {
    initAnimations();
    console.log('Portfolio loaded successfully');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

