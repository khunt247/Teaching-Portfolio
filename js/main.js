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
    
    // Mouse tracking for quote card
    document.querySelectorAll('.quote-card').forEach(card => {
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
        const heroText = document.querySelector('.hero-text');
        if (heroText) {
            heroText.style.opacity = '1';
            heroText.style.filter = 'none';
        }
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger);
    
    const reduceMotionHero = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotionHero) {
        gsap.set('.hero-text', { opacity: 1, filter: 'none' });
    } else {
        gsap.to('.hero-text', {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'sine.out'
        });
    }
    
    gsap.from('.tech-card', {
        scale: 0.8,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        delay: 0.5
    });
    
    // Section animations - ensure cards start visible and animate on scroll
    gsap.utils.toArray('.section').forEach(section => {
        // Skills sit below Projects; filtering projects changes page height and breaks
        // ScrollTrigger positions for this section. Keep skill cards always visible (CSS).
        if (section.id === 'skills') return;

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
            
            // Handle contact button - scroll to bottom of page
            if (href === '#contact') {
                // Close mobile menu if open
                const nav = document.getElementById('mainNav');
                if (nav) {
                    nav.classList.remove('mobile-active');
                }
                
                // Smooth scroll to very bottom of page
                window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: 'smooth'
                });
                return;
            }
            
            // Handle Skills button - scroll to Skills section with proper offset
            if (href === '#skills') {
                // Close mobile menu if open
                const nav = document.getElementById('mainNav');
                if (nav) {
                    nav.classList.remove('mobile-active');
                }
                
                const target = document.querySelector(href);
                if (target) {
                    // Get header height to account for fixed header
                    const header = document.getElementById('header');
                    const headerHeight = header ? header.offsetHeight : 80;
                    
                    // Use minimal offset to position Skills section at the very top
                    // This ensures no Projects section is visible
                    const scrollOffset = headerHeight;
                    
                    // Calculate target position with offset
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - scrollOffset;
                    
                    // Ensure position is not negative
                    const finalPosition = Math.max(0, targetPosition);
                    
                    // Smooth scroll to position
                    window.scrollTo({
                        top: finalPosition,
                        behavior: 'smooth'
                    });
                }
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                // Get header height to account for fixed header
                const header = document.getElementById('header');
                const headerHeight = header ? header.offsetHeight : 80;
                
                // Standard offset for all links (contact is handled above)
                const scrollOffset = headerHeight + 20;
                
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
    const closeBtn = modal?.querySelector('.modal-close'); // Scoped to this modal
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
    function closeModal(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        modal.classList.remove('active');
        document.body.style.overflow = '';
        copyFeedback.classList.remove('show');
        copyBtn.classList.remove('copied');
        copyBtn.querySelector('.copy-text').textContent = 'Copy Email';
    }
    
    // Close button click handler
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Close on overlay click (clicking outside the modal container)
    modal.addEventListener('click', function(e) {
        // Only close if clicking directly on the overlay, not on the modal container or its children
        if (e.target === modal) {
            closeModal(e);
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
// ORBITAL MOTION SYSTEM
// ================================
function initOrbitalMotion() {
    const orbitalElements = document.querySelectorAll('.orbital-element');
    const container = document.querySelector('.hero-animation-container');
    
    if (!container || orbitalElements.length === 0) return;
    
    let animationFrameId;
    let startTime = Date.now();
    
    // Get container dimensions
    function getContainerCenter() {
        const rect = container.getBoundingClientRect();
        return {
            centerX: rect.width / 2,
            centerY: rect.height / 2
        };
    }
    
    // Calculate orbital position
    function calculateOrbit(element, time, initialOffset = 0) {
        const radius = parseFloat(element.dataset.radius) || 120;
        const speed = parseFloat(element.dataset.speed) || 1.0;
        const rotationSpeed = parseFloat(element.dataset.rotationSpeed) || 1.0;
        
        // Convert radius from px to percentage (approximate)
        const center = getContainerCenter();
        const scaleFactor = Math.min(center.centerX, center.centerY) / 500; // Scale based on container
        const scaledRadius = radius * scaleFactor;
        
        // Calculate angle based on time and speed with initial offset
        const angle = ((time * speed * 0.001) + initialOffset) % (Math.PI * 2);
        
        // Calculate position with slight elliptical variation for more natural motion
        const ellipseX = scaledRadius * 1.0;
        const ellipseY = scaledRadius * 0.95;
        const x = Math.cos(angle) * ellipseX;
        const y = Math.sin(angle) * ellipseY;
        
        // Add slight vertical oscillation for depth
        const zOffset = Math.sin(angle * 2) * 5;
        
        // Calculate rotation for element's own axis (clockwise)
        const rotation = (time * rotationSpeed * 0.1) % 360;
        
        return { x, y, rotation, angle, zOffset };
    }
    
    // Update orbital positions
    function updateOrbits() {
        const time = Date.now() - startTime;
        const center = getContainerCenter();
        
        orbitalElements.forEach((element, index) => {
            // Add initial angle offset based on index for staggered starting positions
            const initialOffset = (index * Math.PI * 2) / orbitalElements.length;
            const orbit = calculateOrbit(element, time, initialOffset);
            
            // Apply transforms with 3D perspective
            element.style.transform = `
                translate(-50%, -50%) 
                translate(${orbit.x}px, ${orbit.y}px) 
                rotate(${orbit.rotation}deg)
                translateZ(${orbit.zOffset + Math.sin(orbit.angle) * 10}px)
            `;
            
            // Add 3D perspective effect
            element.style.transformStyle = 'preserve-3d';
            
            // Update glow and halo positions to match element
            const glow = element.querySelector('.element-glow');
            const halo = element.querySelector('.element-halo');
            if (glow) {
                glow.style.transform = `translate(-50%, -50%) translateZ(-5px)`;
            }
            if (halo) {
                halo.style.transform = `translate(-50%, -50%) rotate(${-orbit.rotation * 0.5}deg)`;
            }
        });
        
        animationFrameId = requestAnimationFrame(updateOrbits);
    }
    
    // Start animation
    updateOrbits();
    
    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Animation will recalculate on next frame
        }, 100);
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
}

// ================================
// PARTICLE SYSTEM
// ================================
function initParticleSystem() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;
    
    const container = canvas.parentElement;
    if (!container) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    
    // Set canvas size
    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const angle = Math.random() * Math.PI * 2;
            const radius = 50 + Math.random() * 200;
            
            this.x = centerX + Math.cos(angle) * radius;
            this.y = centerY + Math.sin(angle) * radius;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = 1;
            this.color = this.getRandomColor();
            this.orbitRadius = radius;
            this.orbitAngle = angle;
            this.orbitSpeed = (Math.random() - 0.5) * 0.02;
        }
        
        getRandomColor() {
            const colors = [
                'rgba(139, 92, 246, 1)',   // Purple
                'rgba(20, 184, 166, 1)',  // Teal
                'rgba(245, 158, 11, 1)'   // Amber
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            // Orbital motion
            this.orbitAngle += this.orbitSpeed;
            const targetX = centerX + Math.cos(this.orbitAngle) * this.orbitRadius;
            const targetY = centerY + Math.sin(this.orbitAngle) * this.orbitRadius;
            
            // Smooth movement towards orbital position
            this.x += (targetX - this.x) * 0.05;
            this.y += (targetY - this.y) * 0.05;
            
            // Add drift
            this.x += this.vx;
            this.y += this.vy;
            
            // Boundary wrapping
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
            
            // Keep opacity at 1 always - fully visible
            this.opacity = 1;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Create particles
    function createParticles() {
        const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Draw connections between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const opacity = (1 - distance / 100) * 0.5;
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawConnections();
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    // Initialize
    createParticles();
    animate();
    
    // Recreate particles on resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });
    
    // Cleanup
    window.addEventListener('beforeunload', () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });
}

// ================================
// BRAIN ROTATION
// ================================
function initBrainRotation() {
    const brainCore = document.querySelector('.brain-core');
    if (!brainCore) return;
    
    let rotation = 0;
    const rotationSpeed = 0.02;
    
    function rotateBrain() {
        rotation += rotationSpeed;
        brainCore.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        requestAnimationFrame(rotateBrain);
    }
    
    rotateBrain();
}

// ================================
// PROJECT FILTERING
// ================================
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    // Trigger animation (clear inline transform after so .glass-card hover works)
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                    setTimeout(() => {
                        card.style.transition = '';
                        card.style.opacity = '';
                        card.style.transform = '';
                    }, 350);
                } else {
                    card.classList.add('hidden');
                    card.style.transition = '';
                    card.style.opacity = '';
                    card.style.transform = '';
                }
            });

            if (typeof ScrollTrigger !== 'undefined') {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        ScrollTrigger.refresh();
                    });
                });
            }
        });
    });
}

// ================================
// PROJECT MODAL
// ================================
function openProjectModal(projectType) {
    const modal = document.getElementById('projectModal');
    const modalContent = document.getElementById('projectModalContent');
    
    if (!modal || !modalContent) return;
    
    let content = '';
    
    switch(projectType) {
        case 'pe-units':
            content = `
                <h2 style="margin-bottom: 1.5rem; color: var(--text);">Physical Education Unit Presentations</h2>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">
                    Complete collection of 10 unit presentations covering fitness, flexibility, strength, agility, and team sports.
                </p>
                <div class="project-collection-list">
                    <div class="collection-item">
                        <h4>Agility Training</h4>
                        <p>Agility training fundamentals and drills</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/units/AGILITY.pdf", "Agility Training", "pdf")'>View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Circuit Training</h4>
                        <p>Comprehensive circuit training program</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/units/Circuit Training Education Presentation.pdf", "Circuit Training Education", "pdf")'>View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Core Strength</h4>
                        <p>Core strengthening exercises and progression</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/units/CORE STRENGTH.pdf", "Core Strength Training", "pdf")'>View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Dynamic Stretching</h4>
                        <p>Dynamic warm-up stretches and mobility</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/units/DYNAMIC STRETCHING.pdf", "Dynamic Stretching", "pdf")'>View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Fitness Unit</h4>
                        <p>Comprehensive fitness unit covering all components</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/units/FITNESS UNIT.pdf", "Fitness Unit", "pdf")'>View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Flexibility Unit</h4>
                        <p>Flexibility training principles and techniques</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/units/FLEXIBILITY UNIT.pdf", "Flexibility Unit", "pdf")'>View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Jump Rope</h4>
                        <p>Jump rope techniques and progressions</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/units/JUMP ROPE.pdf", "Jump Rope", "pdf")'>View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Static Stretching</h4>
                        <p>Static stretching techniques for cool-down</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/units/STATIC STRETCHING.pdf", "Static Stretching", "pdf")'>View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Volleyball 101</h4>
                        <p>Volleyball fundamentals and gameplay</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/units/Volleyball 101.pdf", "Volleyball 101", "pdf")'>View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Introductory Vocabulary</h4>
                        <p>Essential PE terminology and concepts</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/units/Introductory Vocab.pdf", "Introductory Vocabulary", "pdf")'>View</button>
                    </div>
                </div>
            `;
            break;
            
        case 'pe-classroom':
            content = `
                <h2 style="margin-bottom: 1.5rem; color: var(--text);">Classroom Management & Community Building</h2>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">
                    Presentations focused on establishing expectations, building community, and maintaining positive learning environments.
                </p>
                <div class="project-collection-list">
                    <div class="collection-item">
                        <h4>Classroom Expectation Quiz</h4>
                        <p>Interactive quiz for reviewing expectations</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/classroom-management/Classroom Expectation Quiz.pdf", "Classroom Expectation Quiz", "pdf")'>View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Gym Housekeeping</h4>
                        <p>Guidelines for maintaining gym equipment</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/classroom-management/GYM HOUSEKEEPING.pdf", "Gym Housekeeping", "pdf")'>View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Respect</h4>
                        <p>Sportsmanship and positive behavior</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/classroom-management/RESPECT.pdf", "Respect", "pdf")'>View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Getting to Know Each Other</h4>
                        <p>Icebreaker activities for building community</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/classroom-management/GETTING TO KNOW.pdf", "Getting to Know Each Other", "pdf")'>View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Getting to Know Each Other II</h4>
                        <p>Continued community-building activities</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/classroom-management/GETTING TO KNOW EACH OTHER II.pdf", "Getting to Know Each Other II", "pdf")'>View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Getting to Know Each Other III</h4>
                        <p>Advanced team-building exercises</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/classroom-management/GETTING TO KNOW EACH OTHER III.pdf", "Getting to Know Each Other III", "pdf")'>View</button>
                    </div>
                </div>
            `;
            break;
            
        case 'lms-case-study':
            content = `
                <div style="max-width: 52rem;">
                <h2 style="margin: 0 0 0.35rem; color: var(--text); font-size: 1.35rem; line-height: 1.3; letter-spacing: -0.02em;">Learning Management System Prototype — Case Study</h2>
                <p style="color: var(--text-muted); margin: 0 0 1.35rem; font-size: 0.9375rem; line-height: 1.55;">
                    A walkthrough of the problem, research signals, iterations, and the resulting interactive prototype.
                </p>

                <div style="margin-bottom: 1.35rem; padding-bottom: 1.35rem; border-bottom: 1px solid var(--glass-border);">
                    <h3 style="color: var(--text); font-size: 1.05rem; margin: 0 0 0.65rem; font-weight: 700;">1. Problem</h3>
                    <p style="color: var(--text-muted); margin: 0 0 0.65rem; line-height: 1.65; font-size: 0.9375rem;">
                        Self-paced learners often lose momentum when progress is buried in files, multiple tools, or long scrolling pages—they cannot quickly answer: <em>Where am I? What is done? What is next today?</em>
                        That ambiguity increases dropout and support questions before anyone reaches the actual instruction.
                    </p>
                    <p style="color: var(--text-muted); margin: 0; line-height: 1.65; font-size: 0.9375rem;">
                        <strong style="color: var(--text);">Who it is for:</strong> the <strong>learner</strong> completing modular training (micro-learning blocks, media, downloads, short checks) in one place.
                        A secondary audience is <strong>instructional designers and stakeholders</strong> who need a clear, shippable mental model of the experience before engineering invest in tutoring, transcripts, or adaptive paths.
                    </p>
                </div>

                <div style="margin-bottom: 1.35rem; padding-bottom: 1.35rem; border-bottom: 1px solid var(--glass-border);">
                    <h3 style="color: var(--text); font-size: 1.05rem; margin: 0 0 0.65rem; font-weight: 700;">2. Research</h3>
                    <p style="color: var(--text-muted); margin: 0 0 0.85rem; line-height: 1.65; font-size: 0.9375rem;">
                        Before laying out screens, I pressure-tested assumptions against how people actually finish online courses: visible progress beats hidden completion states; learners anchor on <em>today</em> and the <em>next actionable step</em>; mixing media and files in one module rhythm reduces context switching.
                    </p>
                    <div style="display: flex; flex-direction: column; gap: 0.55rem;">
                        <div style="display: flex; gap: 0.6rem; align-items: flex-start; color: var(--text-muted); line-height: 1.65; font-size: 0.9375rem;">
                            <span aria-hidden="true" style="flex-shrink: 0; color: var(--primary); font-weight: 700; font-size: 0.85rem; line-height: 1.65; width: 1rem; text-align: center;">►</span>
                            <span><strong style="color: var(--text);">Jobs to be done:</strong> resume quickly, complete a bounded chunk, see proof of movement.</span>
                        </div>
                        <div style="display: flex; gap: 0.6rem; align-items: flex-start; color: var(--text-muted); line-height: 1.65; font-size: 0.9375rem;">
                            <span aria-hidden="true" style="flex-shrink: 0; color: var(--primary); font-weight: 700; font-size: 0.85rem; line-height: 1.65; width: 1rem; text-align: center;">►</span>
                            <span><strong style="color: var(--text);">Heuristic lens:</strong> Nielsen-style passes for recognition, error prevention (clear next step), and consistency of navigation.</span>
                        </div>
                        <div style="display: flex; gap: 0.6rem; align-items: flex-start; color: var(--text-muted); line-height: 1.65; font-size: 0.9375rem;">
                            <span aria-hidden="true" style="flex-shrink: 0; color: var(--primary); font-weight: 700; font-size: 0.85rem; line-height: 1.65; width: 1rem; text-align: center;">►</span>
                            <span><strong style="color: var(--text);">Platform patterns:</strong> borrowed what works from familiar LMS dashboards without copying noisy defaults that obscure progress.</span>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 1.35rem; padding-bottom: 1.35rem; border-bottom: 1px solid var(--glass-border);">
                    <h3 style="color: var(--text); font-size: 1.05rem; margin: 0 0 0.65rem; font-weight: 700;">3. Iteration</h3>
                    <p style="color: var(--text-muted); margin: 0 0 0.85rem; line-height: 1.65; font-size: 0.9375rem;">
                        Design moved from <strong style="color: var(--text);">storyboards and low-fidelity flows</strong> (module shell, where progress “lives,” and the day-level view) into a <strong style="color: var(--text);">single high-fidelity prototype</strong> so interactions could be critiqued as a whole, not as isolated mockups.
                    </p>
                    <div style="display: flex; flex-direction: column; gap: 0.55rem;">
                        <div style="display: flex; gap: 0.6rem; align-items: flex-start; color: var(--text-muted); line-height: 1.65; font-size: 0.9375rem;">
                            <span aria-hidden="true" style="flex-shrink: 0; color: var(--primary); font-weight: 700; font-size: 0.85rem; line-height: 1.65; width: 1rem; text-align: center;">►</span>
                            <span><strong style="color: var(--text);">Early concept:</strong> module-first layout with resources stacked—clear for designers, still too easy for learners to lose the “today” story.</span>
                        </div>
                        <div style="display: flex; gap: 0.6rem; align-items: flex-start; color: var(--text-muted); line-height: 1.65; font-size: 0.9375rem;">
                            <span aria-hidden="true" style="flex-shrink: 0; color: var(--primary); font-weight: 700; font-size: 0.85rem; line-height: 1.65; width: 1rem; text-align: center;">►</span>
                            <span><strong style="color: var(--text);">Revision:</strong> elevated <em>progress by module and by day</em> so the learner always has a hierarchy: program → today → next step.</span>
                        </div>
                        <div style="display: flex; gap: 0.6rem; align-items: flex-start; color: var(--text-muted); line-height: 1.65; font-size: 0.9375rem;">
                            <span aria-hidden="true" style="flex-shrink: 0; color: var(--primary); font-weight: 700; font-size: 0.85rem; line-height: 1.65; width: 1rem; text-align: center;">►</span>
                            <span><strong style="color: var(--text);">Refinement:</strong> tightened the rhythm inside each module—video, visuals, downloads, short quiz—in one scannable column to match micro-learning behavior.</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.6rem; align-items: flex-start; margin-top: 1rem; padding: 0.85rem 1rem; background: rgba(139, 92, 246, 0.08); border-radius: 8px; border-left: 3px solid var(--primary); color: var(--text-muted); font-size: 0.875rem; line-height: 1.65;">
                        <span aria-hidden="true" style="flex-shrink: 0; color: var(--primary); font-weight: 700; font-size: 0.85rem; line-height: 1.65; width: 1rem; text-align: center;">►</span>
                        <span><strong style="color: var(--text);">Artifacts:</strong> The image under Solution is the consolidated high-fidelity prototype that encodes those decisions.</span>
                    </div>
                </div>

                <div style="margin-bottom: 1.35rem; padding-bottom: 1.35rem; border-bottom: 1px solid var(--glass-border);">
                    <h3 style="color: var(--text); font-size: 1.05rem; margin: 0 0 0.65rem; font-weight: 700;">4. Solution</h3>
                    <p style="color: var(--text-muted); margin: 0 0 1rem; line-height: 1.65; font-size: 0.9375rem;">
                        The prototype is a compact, fully interactive learning shell: learners always know location, completion, and next actions; each module combines guided media, resources, and check-ins; the structure leaves natural hooks for tutoring, transcripts, adaptive questioning, and personalization without tearing up the core IA.
                    </p>
                    <figure style="margin: 0 0 1rem; padding: 0;">
                        <img src="images/LMS Prototype.png" alt="High-fidelity LMS prototype showing dashboard, module progress, and learning shell" style="width: 100%; height: auto; border-radius: 10px; border: 1px solid var(--glass-border); display: block;" loading="lazy" />
                        <figcaption style="color: var(--text-muted); font-size: 0.8125rem; margin-top: 0.5rem; line-height: 1.5;">High-fidelity prototype — learner view with progress and module experience.</figcaption>
                    </figure>
                    <div style="display: flex; flex-direction: column; gap: 0.55rem;">
                        <div style="display: flex; gap: 0.6rem; align-items: flex-start; color: var(--text-muted); line-height: 1.65; font-size: 0.9375rem;">
                            <span aria-hidden="true" style="flex-shrink: 0; color: var(--primary); font-weight: 700; font-size: 0.85rem; line-height: 1.65; width: 1rem; text-align: center;">►</span>
                            <span><strong style="color: var(--text);">Because</strong> learners need orientation → <strong style="color: var(--text);">always-on</strong> placement and next step.</span>
                        </div>
                        <div style="display: flex; gap: 0.6rem; align-items: flex-start; color: var(--text-muted); line-height: 1.65; font-size: 0.9375rem;">
                            <span aria-hidden="true" style="flex-shrink: 0; color: var(--primary); font-weight: 700; font-size: 0.85rem; line-height: 1.65; width: 1rem; text-align: center;">►</span>
                            <span><strong style="color: var(--text);">Because</strong> modules bundle multiple asset types → <strong style="color: var(--text);">one</strong> column rhythm per module.</span>
                        </div>
                        <div style="display: flex; gap: 0.6rem; align-items: flex-start; color: var(--text-muted); line-height: 1.65; font-size: 0.9375rem;">
                            <span aria-hidden="true" style="flex-shrink: 0; color: var(--primary); font-weight: 700; font-size: 0.85rem; line-height: 1.65; width: 1rem; text-align: center;">►</span>
                            <span><strong style="color: var(--text);">Because</strong> future smart features matter → <strong style="color: var(--text);">extensible</strong> structure without a full redesign.</span>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 0;">
                    <h3 style="color: var(--text); font-size: 1.05rem; margin: 0 0 0.65rem; font-weight: 700;">5. Validation</h3>
                    <div style="display: flex; flex-direction: column; gap: 0.55rem; margin-bottom: 1.5rem;">
                        <div style="display: flex; gap: 0.6rem; align-items: flex-start; color: var(--text-muted); line-height: 1.65; font-size: 0.9375rem;">
                            <span aria-hidden="true" style="flex-shrink: 0; color: var(--primary); font-weight: 700; font-size: 0.85rem; line-height: 1.65; width: 1rem; text-align: center;">►</span>
                            <span>Direction checked with <strong style="color: var(--text);">task-based critique</strong> (walkthroughs against the jobs above), <strong style="color: var(--text);">heuristic review</strong>, and <strong style="color: var(--text);">stakeholder review</strong> of the interactive prototype for clarity of the learner story.</span>
                        </div>
                        <div style="display: flex; gap: 0.6rem; align-items: flex-start; color: var(--text-muted); line-height: 1.65; font-size: 0.9375rem;">
                            <span aria-hidden="true" style="flex-shrink: 0; color: var(--primary); font-weight: 700; font-size: 0.85rem; line-height: 1.65; width: 1rem; text-align: center;">►</span>
                            <span>Next layer: <strong style="color: var(--text);">moderated usability sessions</strong> with real learners on resume/next-step tasks, and an <strong style="color: var(--text);">accessibility audit</strong> before build.</span>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 0.25rem; padding-top: 1.1rem; border-top: 1px solid var(--glass-border);">
                    <button class="btn-view" onclick='closeProjectModal(); viewArtifact("images/LMS Prototype.png", "Learning Management System Prototype", "image");'>Open prototype (full viewer)</button>
                </div>
                </div>
            `;
            break;

        case 'middle-school-pe-curriculum':
            content = `
                <h2 style="margin-bottom: 1.5rem; color: var(--text);">Middle School Physical Education Curriculum Development</h2>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">
                    Comprehensive curriculum design project demonstrating the complete process of curriculum creation and development for middle school physical education programs (grades 6-8). Includes curriculum mapping, scope and sequence, learning objectives, assessment strategies, and instructional alignment.
                </p>
                <div class="project-collection-list">
                    <div class="collection-item">
                        <h4>Curriculum Project - Full Document</h4>
                        <p>Complete middle school PE curriculum development project</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/planning/Curriculum Project.pdf", "Middle School PE Curriculum Development", "document")'>📄 View PDF</button>
                    </div>
                </div>
            `;
            break;
            
        case 'prezi':
            content = `
                <h2 style="margin-bottom: 1.5rem; color: var(--text);">Prezi Presentations</h2>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">
                    Interactive Prezi presentations for engaging, non-linear learning experiences. Add your Prezi URLs to view these presentations.
                </p>
                <div class="project-collection-list">
                    <div class="collection-item">
                        <h4>Example Presentation 1</h4>
                        <p>Placeholder for Prezi presentation. Add your Prezi URL and metadata when ready.</p>
                        <a href="#" onclick="alert('Please add your Prezi URL to Projects/learning-methodology/prezi/example-presentation-1/prezi-url.txt'); return false;">📝 Add Prezi URL</a>
                    </div>
                    <div class="collection-item">
                        <h4>Example Presentation 2</h4>
                        <p>Placeholder for Prezi presentation. Add your Prezi URL and metadata when ready.</p>
                        <a href="#" onclick="alert('Please add your Prezi URL to Projects/learning-methodology/prezi/example-presentation-2/prezi-url.txt'); return false;">📝 Add Prezi URL</a>
                    </div>
                </div>
            `;
            break;
    }
    
    modalContent.innerHTML = content;
    
    // Show modal (project-modal has display:none in CSS)
    modal.style.display = 'flex';
    
    // Force reflow to ensure transition works
    modal.offsetHeight;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Setup close handlers (these will be cleaned up when modal closes)
    setupProjectModalCloseHandlers();
}

function setupProjectModalCloseHandlers() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    
    // Remove any existing handlers first
    const oldCloseBtn = modal.querySelector('.modal-close');
    if (oldCloseBtn) {
        const newCloseBtn = oldCloseBtn.cloneNode(true);
        oldCloseBtn.parentNode.replaceChild(newCloseBtn, oldCloseBtn);
        newCloseBtn.addEventListener('click', closeProjectModal);
    }
    
    // Store handlers so we can remove them later
    if (!modal._clickHandler) {
        modal._clickHandler = function(e) {
            if (e.target === modal) {
                closeProjectModal();
            }
        };
    }
    
    if (!modal._escapeHandler) {
        modal._escapeHandler = function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeProjectModal();
            }
        };
    }
    
    // Remove old listeners
    modal.removeEventListener('click', modal._clickHandler);
    document.removeEventListener('keydown', modal._escapeHandler);
    
    // Add new listeners
    modal.addEventListener('click', modal._clickHandler);
    document.addEventListener('keydown', modal._escapeHandler);
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        // Remove event listeners
        if (modal._clickHandler) {
            modal.removeEventListener('click', modal._clickHandler);
        }
        if (modal._escapeHandler) {
            document.removeEventListener('keydown', modal._escapeHandler);
        }
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Hide modal after transition
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// ================================
// JUPYTER NOTEBOOK SCREENSHOT MAPPING
// ================================
/**
 * Maps Jupyter notebook file paths to their screenshot image paths
 * @param {string} notebookPath - Path to the .ipynb file
 * @returns {string[]} Array of screenshot image paths, or empty array if not found
 */
function getNotebookScreenshots(notebookPath) {
    // Mapping of notebook file paths to screenshot paths
    const screenshotMap = {
        'Projects/python-programming/notebooks/Python 4 Beginners Week_1.ipynb': [
            'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P1.png',
            'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P2.png',
            'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P3.png',
            'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P4.png',
            'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P5.png',
            'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P6.png',
            'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P7.png',
            'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P8.png',
            'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P9.png',
            'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P10.png',
            'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P11.png'
        ],
        'Projects/python-programming/notebooks/backtest_tutorial.ipynb': [
            'Projects/python-programming/screenshots/backtest_tutorial P1.png',
            'Projects/python-programming/screenshots/backtest_tutorial P2.png',
            'Projects/python-programming/screenshots/backtest_tutorial P3.png',
            'Projects/python-programming/screenshots/backtest_tutorial P4.png',
            'Projects/python-programming/screenshots/backtest_tutorial P5.png'
        ],
        'Projects/python-programming/notebooks/backtest_tutorial_explained.ipynb': [
            'Projects/python-programming/screenshots/backtest_tutorial_explained P1.png',
            'Projects/python-programming/screenshots/backtest_tutorial_explained P2.png',
            'Projects/python-programming/screenshots/backtest_tutorial_explained P3.png',
            'Projects/python-programming/screenshots/backtest_tutorial_explained P4.png',
            'Projects/python-programming/screenshots/backtest_tutorial_explained P5.png',
            'Projects/python-programming/screenshots/backtest_tutorial_explained P6.png',
            'Projects/python-programming/screenshots/backtest_tutorial_explained P7.png',
            'Projects/python-programming/screenshots/backtest_tutorial_explained P8.png',
            'Projects/python-programming/screenshots/backtest_tutorial_explained P9.png'
        ]
    };
    
    // For notebooks with multiple screenshots, you can add multiple paths:
    // Example:
    // 'Projects/python-programming/notebooks/example.ipynb': [
    //     'Projects/python-programming/screenshots/example_1.png',
    //     'Projects/python-programming/screenshots/example_2.png',
    //     'Projects/python-programming/screenshots/example_3.png'
    // ]
    
    return screenshotMap[notebookPath] || [];
}

/**
 * Gets the description for a screenshot image
 * @param {string} screenshotPath - Path to the screenshot image
 * @returns {string} Description text for the screenshot
 */
function getScreenshotDescription(screenshotPath) {
    const descriptionMap = {
        'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P1.png': 'Day 1 Introduction & Learning Objectives - Title: "Day 1: Introduction to Python, Printing, and Comments". Learning objectives: understand Python, use print(), write comments. "What is Python?" explanation. First print() examples with "Hello, world!" outputs. Introduction to comments with # symbol.',
        'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P2.png': 'Print Function Practice & Comments - Continuation of print() examples showing "Learning Python is fun!". Introduction to comments: "Use # to add comments. Python ignores comments when running the code". Code examples demonstrating comments above print statements. Practice tasks: print your name and print a motivational quote.',
        'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P3.png': 'Stretch Challenge & Day 1 Knowledge Check - Stretch challenge: write a script printing name and two things you\'re excited to learn, using at least two comments. Multiple-choice questions covering: what print() does, comment syntax (#), correct print() syntax, arithmetic operations with print(), and purpose of comments.',
        'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P4.png': 'Day 2 Introduction - Transition to Day 2: Variables and Assignment. Learning objectives: understand variables, assign values, follow naming rules. Introduction: "A variable is like a labeled box that holds information".',
        'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P5.png': 'Variable Basics & Naming Rules - Variable assignment examples: name = \'Alice\', age = 30. Variable naming rules: must start with letter/underscore, no spaces, case-sensitive. Examples of valid variable names: user_name, _hidden_value. Practice task: create a variable to store your favorite food.',
        'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P6.png': 'Variable Practice & Day 2 Knowledge Check - Practice tasks: store favorite food, store height, print both with labels. Stretch challenge: store name, age, and location; print a sentence using them. Beginning of Day 2 multiple-choice questions on variables.',
        'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P7.png': 'Day 2 Knowledge Check - Completion of Day 2 multiple-choice questions: valid variable names, arithmetic operations with variables, poor variable naming practices, and what happens when assigning variables.',
        'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P8.png': 'Day 3 Introduction: Data Types - Title: "Day 3: Data Types and Type Checking". Learning objectives: identify basic data types, check variable types, understand strings/integers/floats. "What are Data Types?" explanation. Code examples using type() function: type(\'Hello\'), type(42), type(3.14). "Why Data Types Matter" explanation.',
        'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P9.png': 'Data Types Practice Tasks - Practice tasks: create and check types for string, float, and integer variables. Stretch challenge: create three variables (one string, one integer, one float) and print a sentence describing each with its type.',
        'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P10.png': 'Day 3 Knowledge Check - Multiple-choice questions on: type of \'Hello\' (str), function to check variable type (type()), output of type(4.5) (<class \'float\'>), float identification (10.0), and importance of data types.',
        'Projects/python-programming/screenshots/Python 4 Beginners Week_1 P11.png': 'Day 3 Completion - Completion of the Day 3 section on data types and type checking.',
        'Projects/python-programming/screenshots/backtest_tutorial P1.png': 'Introduction and Project Structure - Title: "Backtesting Trading Strategies in Python". Introduction section with learning objectives: download financial data, build and test a basic trading strategy (Moving Average Crossover), backtest performance, visualize using line charts and candlesticks, add basic performance metrics (Sharpe Ratio), and organize project for future expansion. Includes suggested project folder structure with directories for data, strategies, notebooks, utils, and configuration files.',
        'Projects/python-programming/screenshots/backtest_tutorial P2.png': 'Importing Libraries and Downloading Data - Section 1: Import Libraries and Download Data. Shows Python imports: yfinance, pandas, matplotlib, numpy, and mplfinance. Defines download_data() function that downloads historical stock data for a given ticker and date range, with default values for Apple (AAPL) stock from 2020-01-01 to 2024-01-01.',
        'Projects/python-programming/screenshots/backtest_tutorial P3.png': 'Data Download and Display - Execution of download_data() function for Apple (AAPL) stock. Displays the first 5 rows of the downloaded DataFrame showing columns: Date, Open, High, Low, Close, Adj Close, and Volume. Dates range from 2020-01-02 to 2020-01-08.',
        'Projects/python-programming/screenshots/backtest_tutorial P4.png': 'Moving Average Crossover Strategy - Section 2: Build a Basic Trading Strategy (Moving Average Crossover). Explains the strategy: generates buy signals when short-term MA crosses above long-term MA, and sell signals when short-term MA crosses below long-term MA. Defines moving_average_crossover_strategy() function that calculates short and long moving averages, generates trading signals, and determines trading positions.',
        'Projects/python-programming/screenshots/backtest_tutorial P5.png': 'Applying the Strategy and Displaying Signals - Application of moving_average_crossover_strategy() to Apple data. Displays the first 5 rows of the signals DataFrame showing columns: signal (0.0 or 1.0), short_ma (short-term moving average), long_ma (long-term moving average), and positions (indicating buy/sell/neutral). Initial rows show NaN values for moving averages until enough data is available for calculation.',
        'Projects/python-programming/screenshots/backtest_tutorial_explained P1.png': 'Introduction and Project Structure - Title: "Backtesting Trading Strategies in Python". Introduction section with learning objectives: download financial data, build and test a basic trading strategy (Moving Average Crossover), backtest performance, visualize using line charts and candlesticks, add basic performance metrics (Sharpe Ratio), and organize project for future expansion. Includes suggested project folder structure with directories for data, strategies, notebooks, utils, and configuration files.',
        'Projects/python-programming/screenshots/backtest_tutorial_explained P2.png': 'Step 1-3: Setup and Data Download - Step 1: Install Required Packages (pip install command for yfinance, pandas, matplotlib, numpy, mplfinance). Step 2: Import Python libraries (yfinance, pandas, numpy, matplotlib, mplfinance). Step 3: Download Historical Financial Data - defines download_data() function that fetches OHLC data for a given ticker and date range, with default values for Apple (AAPL) stock from 2020-01-01 to 2024-01-01. The function cleans the data before returning.',
        'Projects/python-programming/screenshots/backtest_tutorial_explained P3.png': 'Step 3: Data Download Output - Execution of download_data() function showing FutureWarning about yfinance changes, progress bar, and data table output. Displays first rows of downloaded Apple stock data with columns: Price, Open, High, Low, Close, and Date ranging from 2020-01-02 to 2020-01-08.',
        'Projects/python-programming/screenshots/backtest_tutorial_explained P4.png': 'Step 4: Moving Average Crossover Strategy - Creates a Simple Moving Average Crossover Strategy. Explains the strategy generates signals when short-term MA crosses above or below long-term MA. Buy signal when short MA > long MA, sell signal when short MA < long MA. Defines generate_signals() function that calculates Short_MA and Long_MA, generates Signal and Position columns.',
        'Projects/python-programming/screenshots/backtest_tutorial_explained P5.png': 'Step 5: Backtest the Strategy - Simulates applying the strategy to historical data. Explains the process: calculate daily returns, multiply returns by the signal (whether in the market or not), calculate cumulative performance for both strategy and market (buy & hold). Defines backtest_strategy() function that calculates Daily_Return, Strategy_Return, cumulative_strategy, and cumulative_market returns.',
        'Projects/python-programming/screenshots/backtest_tutorial_explained P6.png': 'Step 6: Visualize Strategy vs Market - Plots cumulative returns over time to compare strategy with buy-and-hold baseline. Defines plot_performance() function using matplotlib to create a line chart showing "Strategy vs Market Performance" with Strategy (blue line) and Market Buy & Hold (orange line) over time, with date labels and legend.',
        'Projects/python-programming/screenshots/backtest_tutorial_explained P7.png': 'Step 7: Candlestick Chart Visualization - Uses mplfinance to display a candlestick chart with moving averages for better technical visibility. Defines plot_candlesticks() function that handles MultiIndex columns, ensures required columns (Open, High, Low, Close), and plots candlestick chart with 20 and 50 period moving averages using yahoo style. Shows UserWarning about plotting large amounts of data.',
        'Projects/python-programming/screenshots/backtest_tutorial_explained P8.png': 'Step 8: Sharpe Ratio Evaluation - Evaluates strategy performance with Sharpe Ratio metric. Explains that Sharpe Ratio tells if returns are worth the risk (higher is better) and adjusts returns for volatility compared to risk-free rate. Defines calculate_sharpe_ratio() function that calculates excess return and annualized Sharpe Ratio using 252 trading days. Displays calculated Sharpe Ratio value.',
        'Projects/python-programming/screenshots/backtest_tutorial_explained P9.png': 'How to Add Your Own Strategies & Next Steps - Explains two methods for adding custom trading strategies: Option 1: Inline in the Notebook (great for fast testing) and Option 2: As a Separate Python File (best practice). Provides code examples for both methods, including creating generate_rsi_signals() function. Notes that strategy functions must return modified data DataFrame with at least Signal and Position columns. Also provides suggestions for further exploration: Try new strategies (RSI-based, Bollinger Bands, MACD or Mean Reversion), improve performance analytics (add drawdown analysis, calculate max drawdown, win rate), refactor and modularize (move strategies to strategies/, move plots to utils/, create reusable scripts), and try advanced tools (backtrader, bt, or vectorbt).'
    };
    
    return descriptionMap[screenshotPath] || '';
}

// ================================
// ARTIFACT IMAGE ZOOM / PAN + EVENTS
// ================================
/**
 * Dispatches portfolio image interaction events (view, zoom, pan, reset).
 * Listen: document.addEventListener('artifact-image', (e) => { ... e.detail })
 */
function emitArtifactImageEvent(detail) {
    document.dispatchEvent(new CustomEvent('artifact-image', { bubbles: true, detail }));
}

/**
 * @param {HTMLElement} rootEl - Container with [data-zoom-viewport], [data-zoom-layer], img[data-zoom-img]; optional toolbar [data-zoom-in|out|reset|label]
 * @param {{ filePath: string, title?: string, context?: string }} meta
 * @returns {{ reset: () => void, destroy: () => void } | null}
 */
function initArtifactImageZoomPan(rootEl, meta) {
    const viewport = rootEl.querySelector('[data-zoom-viewport]');
    const layer = rootEl.querySelector('[data-zoom-layer]');
    const img = rootEl.querySelector('[data-zoom-img]') || (layer && layer.querySelector('img'));
    if (!viewport || !layer || !img) return null;

    const zoomInBtn = rootEl.querySelector('[data-zoom-in]');
    const zoomOutBtn = rootEl.querySelector('[data-zoom-out]');
    const zoomResetBtn = rootEl.querySelector('[data-zoom-reset]');
    const zoomLabel = rootEl.querySelector('[data-zoom-label]');

    const minScale = 1;
    const maxScale = 4;
    let scale = 1;
    let tx = 0;
    let ty = 0;

    let dragging = false;
    let lastPointerX = 0;
    let lastPointerY = 0;

    let pinchStartDist = 0;
    let pinchStartScale = 1;

    let zoomEmitTimer = null;
    /** @type {{ x0: number, y0: number, tx0: number, ty0: number } | null} */
    let touchOne = null;

    const ctx = meta.context || 'artifact-modal';

    layer.style.transformOrigin = 'center center';

    function applyTransform() {
        if (scale <= 1) {
            tx = 0;
            ty = 0;
            scale = 1;
        }
        layer.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
        if (zoomLabel) zoomLabel.textContent = `${Math.round(scale * 100)}%`;
    }

    function scheduleZoomEmit() {
        if (zoomEmitTimer) clearTimeout(zoomEmitTimer);
        zoomEmitTimer = setTimeout(() => {
            zoomEmitTimer = null;
            emitArtifactImageEvent({
                type: 'zoom',
                filePath: meta.filePath,
                title: meta.title,
                context: ctx,
                scale,
                tx,
                ty
            });
        }, 250);
    }

    function clampScale(s) {
        return Math.min(maxScale, Math.max(minScale, s));
    }

    function zoomAtViewPoint(clientX, clientY, nextScale) {
        const rect = viewport.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const mx = clientX - cx;
        const my = clientY - cy;
        const prevScale = scale;
        scale = clampScale(nextScale);
        if (prevScale === 0) return;
        const ratio = scale / prevScale;
        tx = mx - (mx - tx) * ratio;
        ty = my - (my - ty) * ratio;
        applyTransform();
        scheduleZoomEmit();
    }

    /** @param {number} dir +1 zoom in, -1 zoom out */
    function nudgeZoom(dir) {
        const factor = dir > 0 ? 1.12 : 1 / 1.12;
        const rect = viewport.getBoundingClientRect();
        zoomAtViewPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, scale * factor);
    }

    function resetView() {
        scale = 1;
        tx = 0;
        ty = 0;
        applyTransform();
        emitArtifactImageEvent({
            type: 'reset',
            filePath: meta.filePath,
            title: meta.title,
            context: ctx,
            scale: 1,
            tx: 0,
            ty: 0
        });
    }

    applyTransform();

    emitArtifactImageEvent({
        type: 'view',
        filePath: meta.filePath,
        title: meta.title,
        context: ctx
    });

    function onWheel(e) {
        e.preventDefault();
        const factor = e.deltaY > 0 ? 0.92 : 1.08;
        zoomAtViewPoint(e.clientX, e.clientY, scale * factor);
    }

    function onPointerDown(e) {
        if (e.pointerType === 'touch') return;
        if (zoomInBtn && zoomInBtn.contains(e.target)) return;
        if (zoomOutBtn && zoomOutBtn.contains(e.target)) return;
        if (zoomResetBtn && zoomResetBtn.contains(e.target)) return;
        dragging = true;
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
        viewport.style.cursor = 'grabbing';
        try {
            viewport.setPointerCapture(e.pointerId);
        } catch (_) { /* ignore */ }
    }

    function onPointerMove(e) {
        if (!dragging) return;
        const dx = e.clientX - lastPointerX;
        const dy = e.clientY - lastPointerY;
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
        if (scale > 1) {
            tx += dx;
            ty += dy;
            applyTransform();
        }
    }

    function onPointerUp(e) {
        if (!dragging) return;
        dragging = false;
        viewport.style.cursor = 'grab';
        try {
            viewport.releasePointerCapture(e.pointerId);
        } catch (_) { /* ignore */ }
        if (scale > 1) {
            emitArtifactImageEvent({
                type: 'pan',
                filePath: meta.filePath,
                title: meta.title,
                context: ctx,
                scale,
                tx,
                ty
            });
        }
    }

    function touchDistance(t0, t1) {
        const dx = t0.clientX - t1.clientX;
        const dy = t0.clientY - t1.clientY;
        return Math.hypot(dx, dy);
    }

    function onTouchStart(e) {
        if (e.touches.length === 2) {
            pinchStartDist = touchDistance(e.touches[0], e.touches[1]);
            pinchStartScale = scale;
            touchOne = null;
        } else if (e.touches.length === 1) {
            pinchStartDist = 0;
            if (scale > 1) {
                const t = e.touches[0];
                touchOne = { x0: t.clientX, y0: t.clientY, tx0: tx, ty0: ty };
            } else {
                touchOne = null;
            }
        }
    }

    function onTouchMove(e) {
        if (e.touches.length === 2) {
            if (pinchStartDist <= 0) {
                pinchStartDist = touchDistance(e.touches[0], e.touches[1]);
                pinchStartScale = scale;
            }
            e.preventDefault();
            const d = touchDistance(e.touches[0], e.touches[1]);
            const next = clampScale(pinchStartScale * (d / pinchStartDist));
            const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
            zoomAtViewPoint(mx, my, next);
            pinchStartDist = d;
            pinchStartScale = scale;
        } else if (e.touches.length === 1 && touchOne && scale > 1) {
            e.preventDefault();
            const t = e.touches[0];
            tx = touchOne.tx0 + (t.clientX - touchOne.x0);
            ty = touchOne.ty0 + (t.clientY - touchOne.y0);
            applyTransform();
        }
    }

    function onTouchEnd(e) {
        if (e.touches.length < 2) {
            pinchStartDist = 0;
        }
        if (e.touches.length === 0 && touchOne && scale > 1) {
            emitArtifactImageEvent({
                type: 'pan',
                filePath: meta.filePath,
                title: meta.title,
                context: ctx,
                scale,
                tx,
                ty
            });
        }
        if (e.touches.length === 0) {
            touchOne = null;
        } else if (e.touches.length === 1 && scale > 1) {
            const t = e.touches[0];
            touchOne = { x0: t.clientX, y0: t.clientY, tx0: tx, ty0: ty };
        }
    }

    viewport.style.cursor = 'grab';
    viewport.style.touchAction = 'none';

    viewport.addEventListener('wheel', onWheel, { passive: false });
    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', onPointerUp);
    viewport.addEventListener('pointercancel', onPointerUp);
    viewport.addEventListener('touchstart', onTouchStart, { passive: true });
    viewport.addEventListener('touchmove', onTouchMove, { passive: false });
    viewport.addEventListener('touchend', onTouchEnd);

    if (zoomInBtn) zoomInBtn.addEventListener('click', () => nudgeZoom(1));
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => nudgeZoom(-1));
    if (zoomResetBtn) zoomResetBtn.addEventListener('click', resetView);

    rootEl._artifactZoomReset = resetView;

    return {
        reset: resetView,
        destroy() {
            viewport.removeEventListener('wheel', onWheel);
            viewport.removeEventListener('pointerdown', onPointerDown);
            viewport.removeEventListener('pointermove', onPointerMove);
            viewport.removeEventListener('pointerup', onPointerUp);
            viewport.removeEventListener('pointercancel', onPointerUp);
            viewport.removeEventListener('touchstart', onTouchStart);
            viewport.removeEventListener('touchmove', onTouchMove);
            viewport.removeEventListener('touchend', onTouchEnd);
            if (zoomEmitTimer) clearTimeout(zoomEmitTimer);
            delete rootEl._artifactZoomReset;
        }
    };
}

// ================================
// ARTIFACT PREVIEW FUNCTIONALITY
// ================================
function viewArtifact(filePath, title, fileType) {
    const modal = document.getElementById('artifactModal');
    const modalTitle = document.getElementById('artifactModalTitle');
    const modalContent = document.getElementById('artifactModalContent');
    
    if (!modal || !modalContent) return;
    
    modalTitle.textContent = title || 'Artifact Preview';
    modalContent.innerHTML = '<div style="text-align: center; padding: 2rem;"><div class="loading-spinner"></div><p style="color: var(--text-muted); margin-top: 1rem;">Loading artifact...</p></div>';
    
    // Show modal (artifact-modal has display:none in CSS)
    modal.style.display = 'flex';
    
    // Force reflow to ensure transition works
    modal.offsetHeight;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Get file extension
    const fileExtension = filePath.split('.').pop().toLowerCase();
    let previewContent = '';
    
    // Handle different file types
    if (fileExtension === 'pdf') {
        // PDF preview using iframe
        previewContent = `
            <div style="width: 100%; height: 80vh;">
                <iframe 
                    src="${filePath}" 
                    style="width: 100%; height: 100%; border: none; border-radius: var(--radius-md);"
                    title="${title}"
                ></iframe>
            </div>
        `;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension)) {
        // Image preview (zoom / pan + artifact-image events)
        const imgAlt = String(title || 'Artifact')
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;');
        previewContent = `
            <div class="artifact-image-viewer" data-artifact-image-viewer style="display:flex;flex-direction:column;gap:0.5rem;width:100%;align-items:center;">
                <div class="artifact-image-toolbar" style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:center;align-items:center;">
                    <button type="button" data-zoom-out aria-label="Zoom out" style="padding:0.5rem 0.85rem;background:rgba(139,92,246,0.25);border:1px solid var(--primary);color:var(--text);border-radius:var(--radius-md);cursor:pointer;font-weight:600;">−</button>
                    <span data-zoom-label style="min-width:3.5rem;text-align:center;color:var(--text-muted);font-size:0.875rem;font-variant-numeric:tabular-nums;">100%</span>
                    <button type="button" data-zoom-in aria-label="Zoom in" style="padding:0.5rem 0.85rem;background:rgba(139,92,246,0.25);border:1px solid var(--primary);color:var(--text);border-radius:var(--radius-md);cursor:pointer;font-weight:600;">+</button>
                    <button type="button" data-zoom-reset aria-label="Reset zoom and pan" style="padding:0.5rem 0.85rem;background:var(--primary);border:none;color:white;border-radius:var(--radius-md);cursor:pointer;font-weight:600;">Reset</button>
                </div>
                <div data-zoom-viewport style="width:100%;max-width:100%;height:80vh;max-height:80vh;overflow:hidden;border-radius:var(--radius-md);background:rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;">
                    <div data-zoom-layer style="will-change:transform;">
                        <img data-zoom-img src="${filePath}" alt="${imgAlt}" style="max-width:100%;max-height:80vh;width:auto;height:auto;display:block;border-radius:var(--radius-md);box-shadow:var(--shadow-lg);"/>
                    </div>
                </div>
                <p style="margin:0;font-size:0.8rem;color:var(--text-dim);text-align:center;max-width:36rem;line-height:1.4;">Scroll or pinch to zoom · drag to pan when zoomed · + / − / Reset for keyboard-friendly control</p>
            </div>
        `;
    } else if (fileExtension === 'pptx' || fileType === 'presentation') {
        // PowerPoint - Render using pptxjs library
        modalContent.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div class="loading-spinner"></div>
                <p style="color: var(--text-muted); margin-top: 1rem;">Loading presentation...</p>
            </div>
        `;
        
        // Load and render PowerPoint
        fetch(filePath)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => {
                // Create container for slides
                const container = document.createElement('div');
                container.id = 'pptx-container';
                container.style.cssText = `
                    width: 100%;
                    max-height: 75vh;
                    overflow-y: auto;
                    padding: 1rem;
                    background: var(--bg-dark);
                    border-radius: var(--radius-md);
                `;
                
                modalContent.innerHTML = '';
                modalContent.appendChild(container);
                
                // Render PowerPoint slides
                if (typeof PPTX !== 'undefined') {
                    new PPTX().load(arrayBuffer, function() {
                        this.getSlides().forEach((slide, index) => {
                            const slideDiv = document.createElement('div');
                            slideDiv.className = 'pptx-slide';
                            slideDiv.style.cssText = `
                                margin-bottom: 2rem;
                                padding: 1.5rem;
                                background: white;
                                border-radius: var(--radius-md);
                                box-shadow: var(--shadow-lg);
                            `;
                            
                            const slideNumber = document.createElement('div');
                            slideNumber.textContent = `Slide ${index + 1}`;
                            slideNumber.style.cssText = `
                                color: var(--text-muted);
                                font-size: 0.875rem;
                                margin-bottom: 1rem;
                                font-weight: 600;
                            `;
                            slideDiv.appendChild(slideNumber);
                            
                            const slideContent = document.createElement('div');
                            slideContent.style.cssText = `
                                min-height: 400px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            `;
                            slide.render(slideContent);
                            slideDiv.appendChild(slideContent);
                            
                            container.appendChild(slideDiv);
                        });
                    });
                } else {
                    // Fallback if library not loaded
                    modalContent.innerHTML = `
                        <div style="text-align: center; padding: 3rem;">
                            <p style="color: var(--text-muted); margin-bottom: 1rem;">PowerPoint viewer library not loaded.</p>
                            <a href="${filePath}" download class="btn btn-primary" style="display: inline-block; padding: 0.75rem 1.5rem; background: var(--primary); color: white; text-decoration: none; border-radius: var(--radius-md);">
                                📥 Download Presentation
                            </a>
                        </div>
                    `;
                }
            })
            .catch(error => {
                modalContent.innerHTML = `
                    <div style="text-align: center; padding: 3rem;">
                        <p style="color: var(--text-muted); margin-bottom: 1rem;">Unable to load PowerPoint presentation.</p>
                        <p style="color: var(--text-dim); font-size: var(--text-sm); margin-bottom: 2rem;">Error: ${error.message}</p>
                        <a href="${filePath}" download class="btn btn-primary" style="display: inline-block; padding: 0.75rem 1.5rem; background: var(--primary); color: white; text-decoration: none; border-radius: var(--radius-md);">
                            📥 Download Presentation
                        </a>
                    </div>
                `;
            });
        
        // Setup close handlers and return early (async operation)
        setupArtifactModalCloseHandlers();
        return;
    } else if (fileExtension === 'docx' || fileType === 'document') {
        // Word document - Provide download and open options
        previewContent = `
            <div style="text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1.5rem;">📝</div>
                <h3 style="color: var(--text); margin-bottom: 1rem; font-size: 1.5rem;">${title}</h3>
                <p style="color: var(--text-muted); margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">
                    Word documents can be downloaded or opened directly in your default document application.
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2rem;">
                    <a href="${filePath}" download class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.875rem 1.75rem; background: var(--primary); color: white; text-decoration: none; border-radius: var(--radius-md); font-weight: 600; transition: all 0.3s ease;">
                        <span style="font-size: 1.25rem;">📥</span> Download Document
                    </a>
                    <a href="${filePath}" target="_blank" class="btn btn-secondary" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.875rem 1.75rem; background: rgba(139, 92, 246, 0.2); color: var(--primary); text-decoration: none; border: 2px solid var(--primary); border-radius: var(--radius-md); font-weight: 600; transition: all 0.3s ease;">
                        <span style="font-size: 1.25rem;">🔗</span> Open in New Tab
                    </a>
                </div>
                <div style="background: rgba(139, 92, 246, 0.1); padding: 1.5rem; border-radius: var(--radius-md); border-left: 4px solid var(--primary); max-width: 600px; margin: 0 auto;">
                    <p style="color: var(--text); font-size: 0.875rem; margin: 0; line-height: 1.6;">
                        💡 <strong>Tip:</strong> Click "Open in New Tab" to view in your browser, or "Download" to open in Word, Google Docs, or another document app.
                    </p>
                </div>
                <p style="color: var(--text-dim); margin-top: 2rem; font-size: 0.875rem;">
                    File: ${filePath}
                </p>
            </div>
        `;
    } else if (fileExtension === 'ipynb' || fileType === 'jupyter-notebook') {
        // Jupyter Notebook - Display screenshots in slideshow
        const screenshotPaths = getNotebookScreenshots(filePath);
        
        if (screenshotPaths && screenshotPaths.length > 0) {
            // Create slideshow view
            const slideshowId = 'notebook-slideshow-' + Date.now();
            let currentSlide = 0;
            
            // Create slideshow HTML
            const description = getScreenshotDescription(screenshotPaths[0]);
            let slideshowHTML = `
                <div id="${slideshowId}" style="position: relative; max-height: 80vh; padding: 1rem;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 1rem;">
                        <button 
                            id="${slideshowId}-prev" 
                            class="slideshow-nav-btn"
                            style="padding: 0.75rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: 1rem; font-weight: 600; transition: all 0.3s ease; opacity: ${screenshotPaths.length > 1 ? '1' : '0.5'};"
                            ${screenshotPaths.length <= 1 ? 'disabled' : ''}
                        >
                            ← Previous
                        </button>
                        <div style="flex: 1; text-align: center;">
                            <div id="${slideshowId}-slide" style="min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                                <div id="${slideshowId}-zoom-root" data-artifact-image-viewer style="width: 100%; max-width: 100%; margin-bottom: 1rem;">
                                    <div style="display:flex;flex-wrap:wrap;gap:0.35rem;justify-content:center;align-items:center;margin-bottom:0.5rem;">
                                        <button type="button" data-zoom-out aria-label="Zoom out" style="padding:0.35rem 0.65rem;background:rgba(139,92,246,0.25);border:1px solid var(--primary);color:var(--text);border-radius:var(--radius-md);cursor:pointer;font-weight:600;">−</button>
                                        <span data-zoom-label style="min-width:3rem;text-align:center;color:var(--text-muted);font-size:0.8rem;">100%</span>
                                        <button type="button" data-zoom-in aria-label="Zoom in" style="padding:0.35rem 0.65rem;background:rgba(139,92,246,0.25);border:1px solid var(--primary);color:var(--text);border-radius:var(--radius-md);cursor:pointer;font-weight:600;">+</button>
                                        <button type="button" data-zoom-reset aria-label="Reset zoom and pan" style="padding:0.35rem 0.65rem;background:var(--primary);border:none;color:white;border-radius:var(--radius-md);cursor:pointer;font-weight:600;">Reset</button>
                                    </div>
                                    <div data-zoom-viewport style="width:100%;height:60vh;max-height:60vh;overflow:hidden;border-radius:var(--radius-md);background:rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;">
                                        <div data-zoom-layer style="will-change:transform;">
                                            <img 
                                                id="${slideshowId}-image"
                                                data-zoom-img
                                                src="${screenshotPaths[0]}" 
                                                alt="${title} - Screenshot 1"
                                                style="max-width: 100%; max-height: 60vh; height: auto; border-radius: var(--radius-md); box-shadow: var(--shadow-lg); transition: opacity 0.3s ease;"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div id="${slideshowId}-description" style="max-width: 800px; margin: 0 auto; padding: 1rem; background: rgba(139, 92, 246, 0.1); border-radius: var(--radius-md); border-left: 3px solid var(--primary);">
                                    <p style="color: var(--text); font-size: 0.875rem; line-height: 1.6; margin: 0;">${description || ''}</p>
                                </div>
                            </div>
                        </div>
                        <button 
                            id="${slideshowId}-next" 
                            class="slideshow-nav-btn"
                            style="padding: 0.75rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: var(--radius-md); cursor: pointer; font-size: 1rem; font-weight: 600; transition: all 0.3s ease; opacity: ${screenshotPaths.length > 1 ? '1' : '0.5'};"
                            ${screenshotPaths.length <= 1 ? 'disabled' : ''}
                        >
                            Next →
                        </button>
                    </div>
                </div>
            `;
            
            modalContent.innerHTML = slideshowHTML;
            
            const zoomRootEl = document.getElementById(`${slideshowId}-zoom-root`);
            if (zoomRootEl) {
                initArtifactImageZoomPan(zoomRootEl, {
                    filePath,
                    title,
                    context: 'notebook-slideshow'
                });
            }
            
            function resetNotebookSlideZoom() {
                if (zoomRootEl && zoomRootEl._artifactZoomReset) {
                    zoomRootEl._artifactZoomReset();
                }
            }
            
            // Setup navigation handlers
            if (screenshotPaths.length > 1) {
                const prevBtn = document.getElementById(`${slideshowId}-prev`);
                const nextBtn = document.getElementById(`${slideshowId}-next`);
                const imageEl = document.getElementById(`${slideshowId}-image`);
                const descriptionEl = document.getElementById(`${slideshowId}-description`);
                
                function updateSlide(index) {
                    if (index < 0 || index >= screenshotPaths.length) return;
                    
                    currentSlide = index;
                    const path = screenshotPaths[index];
                    const desc = getScreenshotDescription(path);
                    
                    // Update image with fade effect
                    imageEl.style.opacity = '0';
                    setTimeout(() => {
                        imageEl.src = path;
                        imageEl.alt = `${title} - Screenshot ${index + 1}`;
                        imageEl.style.opacity = '1';
                        resetNotebookSlideZoom();
                    }, 150);
                    
                    // Update description
                    if (desc) {
                        descriptionEl.innerHTML = `<p style="color: var(--text); font-size: 0.875rem; line-height: 1.6; margin: 0;">${desc}</p>`;
                    } else {
                        descriptionEl.innerHTML = '';
                    }
                    
                    // Update button states
                    prevBtn.disabled = index === 0;
                    prevBtn.style.opacity = index === 0 ? '0.5' : '1';
                    nextBtn.disabled = index === screenshotPaths.length - 1;
                    nextBtn.style.opacity = index === screenshotPaths.length - 1 ? '0.5' : '1';
                }
                
                prevBtn.addEventListener('click', () => {
                    if (currentSlide > 0) {
                        updateSlide(currentSlide - 1);
                    }
                });
                
                nextBtn.addEventListener('click', () => {
                    if (currentSlide < screenshotPaths.length - 1) {
                        updateSlide(currentSlide + 1);
                    }
                });
                
                // Keyboard navigation
                const keyboardHandler = (e) => {
                    if (modal.classList.contains('active')) {
                        if (e.key === 'ArrowLeft' && currentSlide > 0) {
                            updateSlide(currentSlide - 1);
                        } else if (e.key === 'ArrowRight' && currentSlide < screenshotPaths.length - 1) {
                            updateSlide(currentSlide + 1);
                        }
                    }
                };
                
                document.addEventListener('keydown', keyboardHandler);
                
                // Store handler for cleanup
                modal._keyboardHandler = keyboardHandler;
            }
        } else {
            // Fallback if screenshots not found
            modalContent.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <p style="color: var(--text-muted); margin-bottom: 1rem;">Screenshots for this notebook are not available.</p>
                    <p style="color: var(--text-dim); font-size: var(--text-sm);">File: ${filePath}</p>
                </div>
            `;
        }
        // Setup close handlers
        setupArtifactModalCloseHandlers();
        return; // Early return since we're handling async
    } else {
        // Unknown file type
        previewContent = `
            <div style="text-align: center; padding: 2rem;">
                <p style="color: var(--text-muted); margin-bottom: 1rem;">Preview not available for this file type (${fileExtension}).</p>
                <p style="color: var(--text-dim); font-size: var(--text-sm);">File: ${filePath}</p>
            </div>
        `;
    }
    
    modalContent.innerHTML = previewContent;
    
    const artifactViewer = modalContent.querySelector('[data-artifact-image-viewer]');
    if (artifactViewer) {
        initArtifactImageZoomPan(artifactViewer, {
            filePath,
            title,
            context: 'artifact-modal'
        });
    }
    
    // Setup close handlers (these will be cleaned up when modal closes)
    setupArtifactModalCloseHandlers();
}

function setupArtifactModalCloseHandlers() {
    const modal = document.getElementById('artifactModal');
    if (!modal) return;
    
    // Remove any existing handlers first
    const oldCloseBtn = modal.querySelector('.modal-close');
    if (oldCloseBtn) {
        const newCloseBtn = oldCloseBtn.cloneNode(true);
        oldCloseBtn.parentNode.replaceChild(newCloseBtn, oldCloseBtn);
        newCloseBtn.addEventListener('click', closeArtifactModal);
    }
    
    // Store handlers so we can remove them later
    if (!modal._clickHandler) {
        modal._clickHandler = function(e) {
            if (e.target === modal) {
                closeArtifactModal();
            }
        };
    }
    
    if (!modal._escapeHandler) {
        modal._escapeHandler = function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeArtifactModal();
            }
        };
    }
    
    // Remove old listeners
    modal.removeEventListener('click', modal._clickHandler);
    document.removeEventListener('keydown', modal._escapeHandler);
    
    // Add new listeners
    modal.addEventListener('click', modal._clickHandler);
    document.addEventListener('keydown', modal._escapeHandler);
}

function closeArtifactModal() {
    const modal = document.getElementById('artifactModal');
    if (modal) {
        // Remove event listeners
        if (modal._clickHandler) {
            modal.removeEventListener('click', modal._clickHandler);
        }
        if (modal._escapeHandler) {
            document.removeEventListener('keydown', modal._escapeHandler);
        }
        // Remove keyboard navigation handler if it exists
        if (modal._keyboardHandler) {
            document.removeEventListener('keydown', modal._keyboardHandler);
            delete modal._keyboardHandler;
        }
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Hide modal after transition
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// ================================
// ONEDRIVE POWERPOINT VIEWER
// ================================
function viewOneDrivePowerPoint(url, title) {
    const modal = document.getElementById('artifactModal');
    const modalTitle = document.getElementById('artifactModalTitle');
    const modalContent = document.getElementById('artifactModalContent');
    
    if (!modal || !modalContent) return;
    
    modalTitle.textContent = title || 'PowerPoint Presentation';
    modalContent.innerHTML = `
        <div style="width: 100%; padding: 1rem;">
            <div style="position: relative; width: 100%; height: 75vh; min-height: 400px; overflow: hidden; border-radius: var(--radius-md); background: var(--bg-dark);">
                <iframe 
                    src="${url}" 
                    frameborder="0" 
                    webkitallowfullscreen="" 
                    mozallowfullscreen="" 
                    allowfullscreen="" 
                    allow="autoplay; fullscreen"
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                    title="${title}"
                ></iframe>
            </div>
            <p style="color: var(--text-muted); margin-top: 1rem; text-align: center; font-size: var(--text-sm);">
                Use the controls within the presentation to navigate. If the presentation does not load, use the link below to open in a new tab.
            </p>
            <div style="text-align: center; margin-top: 0.75rem;">
                <a href="${url}" target="_blank" rel="noopener noreferrer" style="color: var(--primary); text-decoration: none; font-size: var(--text-sm); font-weight: 600;">
                    Open in new tab →
                </a>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
    modal.offsetHeight;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setupArtifactModalCloseHandlers();
}

// ================================
// PREZI PRESENTATION VIEWER
// ================================
function viewPrezi(embedUrl, title) {
    const modal = document.getElementById('artifactModal');
    const modalTitle = document.getElementById('artifactModalTitle');
    const modalContent = document.getElementById('artifactModalContent');
    
    if (!modal || !modalContent) return;
    
    modalTitle.textContent = title || 'Prezi Presentation';
    modalContent.innerHTML = `
        <div style="width: 100%; padding: 1rem;">
            <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: var(--radius-md); background: var(--bg-dark);">
                <iframe 
                    src="${embedUrl}" 
                    id="iframe_container" 
                    frameborder="0" 
                    webkitallowfullscreen="" 
                    mozallowfullscreen="" 
                    allowfullscreen="" 
                    allow="autoplay; fullscreen"
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                    title="${title}"
                ></iframe>
            </div>
            <p style="color: var(--text-muted); margin-top: 1rem; text-align: center; font-size: var(--text-sm);">
                Use the controls within the presentation to navigate. Click and drag to explore different sections.
            </p>
        </div>
    `;
    // Show modal (artifact-modal has display:none in CSS)
    modal.style.display = 'flex';
    
    // Force reflow to ensure transition works
    modal.offsetHeight;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Setup close handlers (these will be cleaned up when modal closes)
    setupArtifactModalCloseHandlers();
}

// Make functions globally available
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.viewArtifact = viewArtifact;
window.closeArtifactModal = closeArtifactModal;
window.viewPrezi = viewPrezi;
window.viewOneDrivePowerPoint = viewOneDrivePowerPoint;

// ================================
// COUNTER ANIMATION FOR STATS
// ================================
function initCounterAnimation() {
    const statValues = document.querySelectorAll('.stat-value[data-count]');
    
    if (statValues.length === 0) return;
    
    // Function to animate a single counter
    function animateCounter(element, targetValue, suffix = '') {
        const duration = 2; // Animation duration in seconds
        const startTime = performance.now();
        const startValue = 0;
        
        // Extract numeric value from target (handle cases like "100+" or just "100")
        const numericTarget = parseInt(targetValue) || 0;
        
        function updateCounter(currentTime) {
            const elapsed = (currentTime - startTime) / 1000; // Convert to seconds
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easing function for smooth animation (easeOutCubic)
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (numericTarget - startValue) * easedProgress);
            
            // Update the element text
            element.textContent = currentValue + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Ensure final value is set correctly
                element.textContent = numericTarget + suffix;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Use Intersection Observer to trigger animation when stats come into view
    const observerOptions = {
        threshold: 0.5, // Trigger when 50% of the element is visible
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                
                const targetValue = entry.target.getAttribute('data-count');
                const currentText = entry.target.textContent;
                
                // Extract suffix (like "+") from current text
                const suffix = currentText.replace(/[\d,]/g, '').trim();
                
                // Start animation
                animateCounter(entry.target, targetValue, suffix);
                
                // Unobserve after animation starts
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all stat values
    statValues.forEach(stat => {
        // Set initial value to 0
        const currentText = stat.textContent;
        const suffix = currentText.replace(/[\d,]/g, '').trim();
        stat.textContent = '0' + suffix;
        
        observer.observe(stat);
    });
}

// ================================
// CUSTOM CIRCLE CURSOR
// ================================
function initCustomCursor() {
    // Check if device supports hover (not a touch device)
    if (window.matchMedia('(hover: none)').matches) {
        return; // Skip cursor initialization on touch devices
    }
    
    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    
    const cursorOuter = document.createElement('div');
    cursorOuter.className = 'cursor-outer';
    
    const cursorInner = document.createElement('div');
    cursorInner.className = 'cursor-inner';
    
    cursor.appendChild(cursorOuter);
    cursor.appendChild(cursorInner);
    document.body.appendChild(cursor);
    
    // Update cursor position instantly on mouse move
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
    
    // Add hover effect for interactive elements
    const interactiveElements = 'a, button, input, textarea, .glass-card, .project-card, .tech-card, .filter-btn, .btn';
    
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveElements)) {
            cursor.classList.add('hover');
        }
    });
    
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveElements)) {
            cursor.classList.remove('hover');
        }
    });
    
    // Add click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
    });
    
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.classList.add('hidden');
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.classList.remove('hidden');
    });
}

// ================================
// SITE PRELOADER
// ================================
function initSitePreloader(onReady) {
    const el = document.getElementById('sitePreloader');
    if (!el) {
        onReady();
        return;
    }

    document.body.classList.add('preloader-active');

    const inner = el.querySelector('.site-preloader__content');
    const pyramid = el.querySelector('.preloader-pyramid');
    const nameParts = el.querySelectorAll('.preloader-name-part');
    const rule = el.querySelector('.preloader-rule');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const cleanup = () => {
        document.body.classList.remove('preloader-active');
        el.removeAttribute('role');
        el.removeAttribute('aria-modal');
        el.removeAttribute('aria-label');
        if (el.parentNode) el.parentNode.removeChild(el);
        onReady();
    };

    let dismissed = false;

    const dismissReduced = () => {
        if (dismissed) return;
        dismissed = true;
        el.style.transition = 'opacity 0.2s ease';
        el.style.opacity = '0';
        setTimeout(cleanup, 220);
    };

    const dismissFallback = () => {
        if (dismissed) return;
        dismissed = true;
        cleanup();
    };

    if (prefersReduced) {
        const kick = () => setTimeout(dismissReduced, 320);
        if (document.readyState === 'complete') kick();
        else window.addEventListener('load', kick);
        setTimeout(dismissFallback, 8000);
        return;
    }

    if (typeof gsap === 'undefined') {
        const kick = () => setTimeout(dismissFallback, 400);
        if (document.readyState === 'complete') kick();
        else window.addEventListener('load', kick);
        setTimeout(dismissFallback, 8000);
        return;
    }

    const pageStart = performance.now();
    const minVisibleMs = 2200;
    let introDone = false;
    let loadDone = document.readyState === 'complete';

    const floatTween = gsap.to(pyramid, {
        y: 5,
        duration: 2.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        paused: true
    });

    const introTl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
            introDone = true;
            floatTween.play(0);
            maybeDismiss();
        }
    });

    introTl
        .from(pyramid, {
            scale: 0.55,
            opacity: 0,
            y: 48,
            rotationX: 12,
            duration: 1,
            ease: 'back.out(1.35)'
        })
        .from(
            nameParts,
            {
                y: 36,
                opacity: 0,
                stagger: 0.14,
                duration: 0.72
            },
            '-=0.42'
        )
        .from(
            rule,
            {
                scaleX: 0,
                opacity: 0,
                duration: 0.55,
                ease: 'power2.out',
                transformOrigin: 'center center'
            },
            '-=0.38'
        );

    const tryDismiss = () => {
        if (!introDone || !loadDone || dismissed) return;
        const elapsed = performance.now() - pageStart;
        const wait = Math.max(0, minVisibleMs - elapsed);
        setTimeout(runExit, wait);
    };

    const maybeDismiss = () => tryDismiss();

    window.addEventListener('load', () => {
        loadDone = true;
        tryDismiss();
    });

    function runExit() {
        if (dismissed) return;
        dismissed = true;
        floatTween.kill();
        const exitTl = gsap.timeline({
            onComplete: cleanup
        });
        exitTl
            .to(inner, {
                opacity: 0,
                y: -28,
                scale: 0.94,
                duration: 0.52,
                ease: 'power2.in'
            })
            .to(
                el,
                {
                    opacity: 0,
                    duration: 0.58,
                    ease: 'power3.inOut'
                },
                '-=0.28'
            );
    }

    setTimeout(() => {
        if (!dismissed && document.getElementById('sitePreloader')) runExit();
    }, 12000);
}

// ================================
// INITIALIZATION
// ================================
function init() {
    initSmoothScroll();
    initEmailModal();
    initOrbitalMotion();
    initParticleSystem();
    initBrainRotation();
    initProjectFilters();
    initSitePreloader(() => {
        initAnimations();
        initCounterAnimation();
        console.log('Portfolio loaded successfully');
    });
    // initCustomCursor(); // DISABLED - was preventing navigation clicks
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

