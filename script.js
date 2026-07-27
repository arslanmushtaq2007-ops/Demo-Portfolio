/* ============================================================
   MUHAMMAD ARSLAN — PORTFOLIO JAVASCRIPT
   Table of Contents:
   1.  Preloader
   2.  Custom Cursor (Glow + Dot)
   3.  Particle System (Canvas)
   4.  Navigation (Scroll, Mobile Menu, Active Link)
   5.  Typing Animation
   6.  Animated Counters
   7.  Skill Progress Bars
   8.  Scroll Reveal (Intersection Observer)
   9.  Button Ripple Effect
   10. Contact Form
   11. Back to Top
   12. Current Year
   13. Parallax Effect
   ============================================================ */

(function () {
    'use strict';

    /* ============================
       1. PRELOADER
    ============================ */
    window.addEventListener('load', function () {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
                // Remove from DOM after transition
                setTimeout(() => loader.remove(), 700);
            }, 1200);
        }
    });

    /* ============================
       2. CUSTOM CURSOR
    ============================ */
    const cursorGlow = document.getElementById('cursorGlow');
    const cursorDot = document.getElementById('cursorDot');

    if (cursorGlow && cursorDot && window.matchMedia('(hover: hover)').matches) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;
        let dotX = 0, dotY = 0;

        // Track mouse position
        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth follow animation using lerp
        function animateCursor() {
            // Glow follows with lag (smooth trail)
            glowX += (mouseX - glowX) * 0.1;
            glowY += (mouseY - glowY) * 0.1;
            cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px) translate(-50%, -50%)`;

            // Dot follows quickly
            dotX += (mouseX - dotX) * 0.5;
            dotY += (mouseY - dotY) * 0.5;
            cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effect on interactive elements
        const hoverElements = document.querySelectorAll('a, button, .skill-card, .service-card, .project-card, .testimonial-card, .stat-card, input, textarea');

        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursorDot.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorDot.classList.remove('hover'));
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
            cursorDot.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursorGlow.style.opacity = '1';
            cursorDot.style.opacity = '1';
        });
    }

    /* ============================
       3. PARTICLE SYSTEM (Optimized for performance)
    ============================ */
    const canvas = document.getElementById('particlesCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle class
        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.5 + 0.1;

                // Random color: blue, purple, cyan
                const colors = ['0, 212, 255', '168, 85, 247', '34, 211, 238'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Wrap around edges
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = `rgba(${this.color}, 0.5)`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            // Cap particle count at 25 to fix lag and drastically improve performance
            const count = Math.min(Math.floor(window.innerWidth / 15), 25);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections between nearby particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - distance / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.shadowBlur = 0;
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();

        // Recreate particles on resize
        let resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(initParticles, 250);
        });

        // Pause animation when tab is hidden (performance)
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animateParticles();
            }
        });
    }

    /* ============================
       4. NAVIGATION
    ============================ */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        const expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !expanded);
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // Active navigation highlighting using Intersection Observer
    const navObserverOptions = {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0
    };

    const navObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));

    /* ============================
       5. TYPING ANIMATION
    ============================ */
    const typingText = document.getElementById('typingText');
    const roles = [
        'AI Engineer',
        'Full Stack Developer',
        'Frontend Developer',
        'Backend Developer',
        'Python Developer',
        'Java Developer',
        'Machine Learning Enthusiast'
    ];

    if (typingText) {
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingDelay = 100;

        function typeWriter() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typingText.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingDelay = 50;
            } else {
                typingText.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingDelay = 100;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                // Pause at end of word
                typingDelay = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingDelay = 500;
            }

            setTimeout(typeWriter, typingDelay);
        }

        // Start typing after preloader
        setTimeout(typeWriter, 1500);
    }

    /* ============================
       6. ANIMATED COUNTERS
    ============================ */
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.ceil(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + suffix;
                }
            };

            updateCounter();
        });
    }

    /* ============================
       7. SKILL PROGRESS BARS
    ============================ */
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    let skillsAnimated = false;

    function animateSkillBars() {
        if (skillsAnimated) return;
        skillsAnimated = true;

        skillBars.forEach(bar => {
            const percent = bar.getAttribute('data-percent');
            setTimeout(() => {
                bar.style.width = percent + '%';
            }, 100);
        });
    }

    /* ============================
       8. SCROLL REVEAL (Intersection Observer)
    ============================ */
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered delay for grouped elements
                const siblings = entry.target.parentElement.querySelectorAll('[data-reveal]');
                const index = Array.from(siblings).indexOf(entry.target);
                const delay = Math.min(index * 80, 400);

                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Trigger counters and skill bars when their sections are visible
    const aboutSection = document.getElementById('about');
    const skillsSection = document.getElementById('skills');

    if (aboutSection) {
        const aboutObserver = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    aboutObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        aboutObserver.observe(aboutSection);
    }

    if (skillsSection) {
        const skillsObserver = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        skillsObserver.observe(skillsSection);
    }

    /* ============================
       9. BUTTON RIPPLE EFFECT
    ============================ */
    const rippleButtons = document.querySelectorAll('.ripple');

    rippleButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    /* ============================
       10. CONTACT FORM
    ============================ */
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic validation
            const name = contactForm.querySelector('#name').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            const message = contactForm.querySelector('#message').value.trim();

            if (!name || !email || !message) {
                // Shake animation for invalid fields could be added here
                return;
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return;
            }

            // Simulate sending (replace with actual API call)
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i><span>Sending...</span>';
            submitBtn.disabled = true;

            setTimeout(() => {
                formSuccess.classList.add('show');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                // Hide success message after 5 seconds
                setTimeout(() => {
                    formSuccess.classList.remove('show');
                }, 5000);
            }, 1500);
        });
    }

    /* ============================
       11. BACK TO TOP
    ============================ */
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ============================
       12. CURRENT YEAR
    ============================ */
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* ============================
       13. PARALLAX EFFECT
    ============================ */
    // Subtle parallax for hero visual and background orbs
    const heroVisual = document.querySelector('.hero-visual');
    const bgOrbs = document.querySelectorAll('.bg-orb');

    let parallaxTicking = false;

    window.addEventListener('scroll', function () {
        if (!parallaxTicking) {
            requestAnimationFrame(function () {
                const scrolled = window.pageYOffset;

                // Parallax for hero visual (only on hero viewport)
                if (heroVisual && scrolled < window.innerHeight) {
                    heroVisual.style.transform = `translateY(${scrolled * 0.15}px)`;
                }

                // Parallax for background orbs
                bgOrbs.forEach((orb, index) => {
                    const speed = (index + 1) * 0.05;
                    orb.style.transform = `translateY(${scrolled * speed}px)`;
                });

                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    });

    /* ============================
       14. SMOOTH SCROLL FALLBACK
    ============================ */
    // Ensure smooth scrolling for older browsers
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 1;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ============================
       15. KEYBOARD ACCESSIBILITY
    ============================ */
    // Close mobile menu on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            hamburger.focus();
        }
    });

})();
