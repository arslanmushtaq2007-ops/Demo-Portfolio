/* ============================================================
   PREMIUM PORTFOLIO JAVASCRIPT — 120FPS OPTIMIZED
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* 1. PRELOADER */
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => loader.style.display = 'none', 500);
            }, 500);
        }
    });

    /* 2. CUSTOM CURSOR (GPU ACCELERATED) */
    const cursorGlow = document.getElementById('cursorGlow');
    const cursorDot = document.getElementById('cursorDot');

    if (cursorGlow && cursorDot && window.matchMedia('(hover: hover)').matches) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;
        let dotX = 0, dotY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function renderCursor() {
            // Smooth lerp for trailing effect
            glowX += (mouseX - glowX) * 0.1;
            glowY += (mouseY - glowY) * 0.1;
            dotX += (mouseX - dotX) * 0.5;
            dotY += (mouseY - dotY) * 0.5;

            // Use translate3d for GPU acceleration (forces 120fps)
            cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
            cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

            requestAnimationFrame(renderCursor);
        }
        renderCursor();

        // Hover effect
        document.querySelectorAll('a, button, input, textarea').forEach(el => {
            el.addEventListener('mouseenter', () => cursorDot.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursorDot.classList.remove('hover'));
        });
    }

    /* 3. NAVIGATION */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    /* 4. SCROLL REVEAL (Intersection Observer) */
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a slight stagger for grouped elements
                const siblings = entry.target.parentElement.querySelectorAll('[data-reveal]');
                const index = Array.from(siblings).indexOf(entry.target);
                const delay = Math.min(index * 80, 400); // Max 400ms delay

                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);

                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    /* 5. TYPING ANIMATION */
    const typingText = document.getElementById('typingText');
    const roles = [
        'AI Engineer',
        'Full Stack Developer',
        'Frontend Developer',
        'Backend Developer',
        'Python Developer',
        'Java Developer',
        'ML Enthusiast'
    ];

    if (typingText) {
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typingText.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before next word
            }

            setTimeout(type, typeSpeed);
        }
        setTimeout(type, 1000);
    }

    /* 6. ANIMATED COUNTERS */
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const suffix = counter.getAttribute('data-suffix') || '';
            let current = 0;
            const duration = 2000;
            const stepTime = 16; // ~60fps
            const increment = target / (duration / stepTime);

            const updateCounter = () => {
                current += increment;
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

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    aboutObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        aboutObserver.observe(aboutSection);
    }

    /* 7. SKILL BARS */
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    let skillsAnimated = false;

    function animateSkillBars() {
        if (skillsAnimated) return;
        skillsAnimated = true;

        skillBars.forEach(bar => {
            const targetWidth = bar.style.getPropertyValue('--target-width');
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 100);
        });
    }

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        skillsObserver.observe(skillsSection);
    }

    /* 8. ACTIVE NAV LINK ON SCROLL */
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 100;
                    if (window.scrollY >= sectionTop) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + current) {
                        link.classList.add('active');
                    }
                });
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    /* 9. CONTACT FORM */
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                formSuccess.classList.add('show');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                setTimeout(() => formSuccess.classList.remove('show'), 5000);
            }, 1500);
        });
    }

    /* 10. BACK TO TOP */
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) backToTop.classList.add('show');
        else backToTop.classList.remove('show');
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* 11. CURRENT YEAR */
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

});
