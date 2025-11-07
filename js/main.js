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
                    // Trigger animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.classList.add('hidden');
                }
            });
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
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/units/AGILITY.pdf", "Agility Training", "pdf")'>👁️ View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Circuit Training</h4>
                        <p>Comprehensive circuit training program</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/units/Circuit Training Education Presentation.pdf", "Circuit Training Education", "pdf")'>👁️ View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Core Strength</h4>
                        <p>Core strengthening exercises and progression</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/units/CORE STRENGTH.pdf", "Core Strength Training", "pdf")'>👁️ View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Dynamic Stretching</h4>
                        <p>Dynamic warm-up stretches and mobility</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/units/DYNAMIC STRETCHING.pdf", "Dynamic Stretching", "pdf")'>👁️ View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Fitness Unit</h4>
                        <p>Comprehensive fitness unit covering all components</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/units/FITNESS UNIT.pdf", "Fitness Unit", "pdf")'>👁️ View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Flexibility Unit</h4>
                        <p>Flexibility training principles and techniques</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/units/FLEXIBILITY UNIT.pdf", "Flexibility Unit", "pdf")'>👁️ View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Jump Rope</h4>
                        <p>Jump rope techniques and progressions</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/units/JUMP ROPE.pdf", "Jump Rope", "pdf")'>👁️ View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Static Stretching</h4>
                        <p>Static stretching techniques for cool-down</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/units/STATIC STRETCHING.pdf", "Static Stretching", "pdf")'>👁️ View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Volleyball 101</h4>
                        <p>Volleyball fundamentals and gameplay</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/units/Volleyball 101.pdf", "Volleyball 101", "pdf")'>👁️ View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Introductory Vocabulary</h4>
                        <p>Essential PE terminology and concepts</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/units/Introductory Vocab.pdf", "Introductory Vocabulary", "pdf")'>👁️ View</button>
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
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/classroom-management/Classroom Expectation Quiz.pdf", "Classroom Expectation Quiz", "pdf")'>👁️ View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Gym Housekeeping</h4>
                        <p>Guidelines for maintaining gym equipment</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/classroom-management/GYM HOUSEKEEPING.pdf", "Gym Housekeeping", "pdf")'>👁️ View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Respect</h4>
                        <p>Sportsmanship and positive behavior</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/classroom-management/RESPECT.pdf", "Respect", "pdf")'>👁️ View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Getting to Know Each Other</h4>
                        <p>Icebreaker activities for building community</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/classroom-management/GETTING TO KNOW.pdf", "Getting to Know Each Other", "pdf")'>👁️ View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Getting to Know Each Other II</h4>
                        <p>Continued community-building activities</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/classroom-management/GETTING TO KNOW EACH OTHER II.pdf", "Getting to Know Each Other II", "pdf")'>👁️ View</button>
                    </div>
                    <div class="collection-item">
                        <h4>Getting to Know Each Other III</h4>
                        <p>Advanced team-building exercises</p>
                        <button class="btn-view" onclick='viewArtifact("Projects/physical-education-curriculum/presentations/classroom-management/GETTING TO KNOW EACH OTHER III.pdf", "Getting to Know Each Other III", "pdf")'>👁️ View</button>
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
        // Image preview
        previewContent = `
            <div style="text-align: center;">
                <img 
                    src="${filePath}" 
                    alt="${title}"
                    style="max-width: 100%; max-height: 80vh; border-radius: var(--radius-md); box-shadow: var(--shadow-lg);"
                />
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
        // Jupyter Notebook - Try to load and render
        fetch(filePath)
            .then(response => response.json())
            .then(data => {
                // Render notebook cells
                let notebookHTML = '<div style="max-height: 80vh; overflow-y: auto; padding: 1rem;">';
                data.cells.forEach((cell, index) => {
                    if (cell.cell_type === 'markdown') {
                        notebookHTML += `<div style="margin-bottom: 1.5rem; padding: 1rem; background: var(--glass); border-radius: var(--radius-md);">`;
                        notebookHTML += `<pre style="white-space: pre-wrap; color: var(--text); font-family: var(--font-sans); margin: 0;">${cell.source.join('')}</pre>`;
                        notebookHTML += `</div>`;
                    } else if (cell.cell_type === 'code') {
                        notebookHTML += `<div style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(139, 92, 246, 0.1); border-left: 3px solid var(--primary); border-radius: var(--radius-md);">`;
                        notebookHTML += `<pre style="white-space: pre-wrap; color: var(--text); font-family: 'Courier New', monospace; margin: 0; overflow-x: auto;">${cell.source.join('')}</pre>`;
                        if (cell.outputs && cell.outputs.length > 0) {
                            notebookHTML += `<div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--glass-border);">`;
                            cell.outputs.forEach(output => {
                                if (output.output_type === 'stream') {
                                    notebookHTML += `<pre style="color: var(--text-muted); font-family: 'Courier New', monospace; margin: 0;">${output.text.join('')}</pre>`;
                                } else if (output.output_type === 'execute_result' || output.output_type === 'display_data') {
                                    if (output.data && output.data['text/plain']) {
                                        notebookHTML += `<pre style="color: var(--success); font-family: 'Courier New', monospace; margin: 0;">${output.data['text/plain'].join('')}</pre>`;
                                    }
                                }
                            });
                            notebookHTML += `</div>`;
                        }
                        notebookHTML += `</div>`;
                    }
                });
                notebookHTML += '</div>';
                modalContent.innerHTML = notebookHTML;
            })
            .catch(error => {
                modalContent.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <p style="color: var(--text-muted); margin-bottom: 1rem;">Unable to load Jupyter notebook. The file may need to be converted to HTML format for web viewing.</p>
                        <p style="color: var(--text-dim); font-size: var(--text-sm);">Error: ${error.message}</p>
                    </div>
                `;
            });
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
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Hide modal after transition
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
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
// INITIALIZATION
// ================================
function init() {
    initSmoothScroll();
    initAnimations();
    initEmailModal();
    initOrbitalMotion();
    initParticleSystem();
    initBrainRotation();
    initProjectFilters();
    initCounterAnimation();
    // initCustomCursor(); // DISABLED - was preventing navigation clicks
    console.log('Portfolio loaded successfully');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

