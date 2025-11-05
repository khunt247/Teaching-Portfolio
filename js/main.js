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
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            // Handle scrolling to top
            if (href === '#' || href === '#top') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // Close mobile menu
                const nav = document.getElementById('mainNav');
                if (nav) {
                    nav.classList.remove('mobile-active');
                }
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                // Get header height to account for fixed header
                const header = document.getElementById('header');
                const headerHeight = header ? header.offsetHeight : 80;
                
                // Special handling for "Get in Touch" button to show Skills + Contact together
                const isGetInTouchButton = this.id === 'get-in-touch-btn' || href === '#contact';
                let scrollOffset;
                
                if (isGetInTouchButton) {
                    // Position Contact section lower in viewport to show Skills section above
                    // Calculate offset to show Contact section at ~40% down the viewport
                    const viewportHeight = window.innerHeight;
                    scrollOffset = headerHeight - (viewportHeight * 0.35);
                } else {
                    // Standard offset for other links
                    scrollOffset = headerHeight + 20;
                }
                
                // Calculate target position with offset
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - scrollOffset;
                
                // Ensure position is not negative
                const finalPosition = Math.max(0, targetPosition);
                
                // Smooth scroll to position
                window.scrollTo({
                    top: finalPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu
                const nav = document.getElementById('mainNav');
                if (nav) {
                    nav.classList.remove('mobile-active');
                }
                
                // Refresh animations for the target section after scroll
                setTimeout(() => {
                    refreshSectionAnimations(target);
                }, 300);
            }
        });
    });
}

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
// EMAIL MODAL FUNCTIONALITY
// ================================
function initEmailModal() {
    const modal = document.getElementById('emailModal');
    const emailTriggers = document.querySelectorAll('.email-modal-trigger');
    const closeBtn = document.querySelector('.modal-close');
    const copyBtn = document.getElementById('copyBtn');
    const emailDisplay = document.getElementById('emailDisplay');
    const copyFeedback = document.getElementById('copyFeedback');
    const defaultEmail = 'katiehunt95@gmail.com';
    
    if (!modal || emailTriggers.length === 0) return;
    
    // Open modal - handle multiple triggers
    emailTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const emailAddress = trigger.getAttribute('data-email') || defaultEmail;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            emailDisplay.textContent = emailAddress;
        });
    });
    
    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        copyFeedback.classList.remove('show');
        copyBtn.classList.remove('copied');
        copyBtn.querySelector('.copy-text').textContent = 'Copy Email';
    }
    
    closeBtn?.addEventListener('click', closeModal);
    
    // Close on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Copy email to clipboard
    copyBtn?.addEventListener('click', async function() {
        const emailToCopy = emailDisplay.textContent || defaultEmail;
        try {
            await navigator.clipboard.writeText(emailToCopy);
            
            // Show success feedback
            copyFeedback.classList.add('show');
            copyBtn.classList.add('copied');
            copyBtn.querySelector('.copy-text').textContent = 'Copied!';
            
            // Reset after 3 seconds
            setTimeout(() => {
                copyFeedback.classList.remove('show');
                copyBtn.classList.remove('copied');
                copyBtn.querySelector('.copy-text').textContent = 'Copy Email';
            }, 3000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = emailToCopy;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                copyFeedback.classList.add('show');
                copyBtn.classList.add('copied');
                copyBtn.querySelector('.copy-text').textContent = 'Copied!';
                setTimeout(() => {
                    copyFeedback.classList.remove('show');
                    copyBtn.classList.remove('copied');
                    copyBtn.querySelector('.copy-text').textContent = 'Copy Email';
                }, 3000);
            } catch (fallbackErr) {
                alert('Failed to copy email. Please copy manually: ' + emailToCopy);
            }
            document.body.removeChild(textArea);
        }
    });
}

// ================================
// INITIALIZATION
// ================================
function init() {
    initSmoothScroll();
    initAnimations();
    initEmailModal();
    console.log('Portfolio loaded successfully');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

