/* ============================================================
   PORTFOLIO — SCRIPT.JS
   Interactive Features & Animations
   Author: Divyasree Gollapalli
   ============================================================ */

(function () {
    'use strict';

    /* ──────────────────────────────────────────────────────────
       1. PARTICLE BACKGROUND (Canvas)
       ────────────────────────────────────────────────────────── */
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Slight attraction towards mouse
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 200) {
                this.x += dx * 0.002;
                this.y += dy * 0.002;
            }

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(65, 105, 225, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    const opacity = (1 - dist / 130) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(65, 105, 225, ${opacity})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });


    /* ──────────────────────────────────────────────────────────
       2. TYPING ANIMATION
       ────────────────────────────────────────────────────────── */
    const titles = [
        'Web Developer',
        'Aspiring AI Agent',
        'Automation Enthusiast',
        'Creative Problem Solver',
        'Future Tech Innovator'
    ];
    const heroTitleEl = document.getElementById('heroTitle');
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function typeEffect() {
        const current = titles[titleIndex];

        if (isDeleting) {
            heroTitleEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            heroTitleEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === current.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typeSpeed = 400; // Brief pause before next word
        }

        setTimeout(typeEffect, typeSpeed);
    }

    setTimeout(typeEffect, 1200);


    /* ──────────────────────────────────────────────────────────
       3. PARALLAX MOUSE EFFECT (Hero floating shapes)
       ────────────────────────────────────────────────────────── */
    const heroSection = document.querySelector('.hero');
    const floatingShapes = document.querySelectorAll('.floating-shape');

    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const moveX = (e.clientX - rect.left - centerX) / centerX;
        const moveY = (e.clientY - rect.top - centerY) / centerY;

        floatingShapes.forEach((shape, i) => {
            const depth = (i + 1) * 8;
            const rotateAmount = (i + 1) * 2;
            shape.style.transform = `translate(${moveX * depth}px, ${moveY * depth}px) rotate(${moveX * rotateAmount}deg)`;
        });
    });


    /* ──────────────────────────────────────────────────────────
       4. NAVBAR — Scroll Effects & Active Section
       ────────────────────────────────────────────────────────── */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    function updateNavbar() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    function updateActiveNav() {
        let currentSection = 'hero';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom > 150) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === currentSection) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', () => {
        updateNavbar();
        updateActiveNav();
    });


    /* ──────────────────────────────────────────────────────────
       5. HAMBURGER MENU (Mobile)
       ────────────────────────────────────────────────────────── */
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('navLinks');

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    function toggleMenu() {
        hamburger.classList.toggle('open');
        navLinksContainer.classList.toggle('open');
        overlay.classList.toggle('open');
        document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Close menu on link click
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('open')) {
                toggleMenu();
            }
        });
    });


    /* ──────────────────────────────────────────────────────────
       6. DARK MODE TOGGLE
       ────────────────────────────────────────────────────────── */
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';

    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('portfolio-theme', next);
    });


    /* ──────────────────────────────────────────────────────────
       7. SCROLL REVEAL (Intersection Observer)
       ────────────────────────────────────────────────────────── */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));


    /* ──────────────────────────────────────────────────────────
       8. ANIMATED SKILL BARS (Trigger on Scroll)
       ────────────────────────────────────────────────────────── */
    const skillItems = document.querySelectorAll('.skill-item');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const progress = item.getAttribute('data-progress');
                item.style.setProperty('--progress', progress + '%');
                item.classList.add('animated');
                skillObserver.unobserve(item);
            }
        });
    }, { threshold: 0.3 });

    skillItems.forEach(item => skillObserver.observe(item));


    /* ──────────────────────────────────────────────────────────
       9. 3D TILT EFFECT (Project Cards)
       ────────────────────────────────────────────────────────── */
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });


    /* ──────────────────────────────────────────────────────────
       10. MAGNETIC HOVER BUTTONS
       ────────────────────────────────────────────────────────── */
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
            btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });

        btn.addEventListener('mouseenter', () => {
            btn.style.transition = 'none';
        });
    });


    /* ──────────────────────────────────────────────────────────
       11. BACK TO TOP BUTTON
       ────────────────────────────────────────────────────────── */
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    /* ──────────────────────────────────────────────────────────
       12. CONTACT FORM VALIDATION
       ────────────────────────────────────────────────────────── */
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const formSuccess = document.getElementById('formSuccess');

    // Email regex pattern
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    function validateField(input, errorEl, validationFn) {
        const value = input.value.trim();
        const error = validationFn(value);
        if (error) {
            input.classList.add('error');
            errorEl.textContent = error;
            return false;
        } else {
            input.classList.remove('error');
            errorEl.textContent = '';
            return true;
        }
    }

    function validateName(value) {
        if (!value) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        return '';
    }

    function validateEmail(value) {
        if (!value) return 'Email is required';
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
    }

    function validateMessage(value) {
        if (!value) return 'Message is required';
        if (value.length < 10) return 'Message must be at least 10 characters';
        return '';
    }

    // Real-time validation
    nameInput.addEventListener('blur', () => validateField(nameInput, nameError, validateName));
    emailInput.addEventListener('blur', () => validateField(emailInput, emailError, validateEmail));
    messageInput.addEventListener('blur', () => validateField(messageInput, messageError, validateMessage));

    // Clear error on input
    nameInput.addEventListener('input', () => {
        if (nameInput.classList.contains('error')) {
            validateField(nameInput, nameError, validateName);
        }
    });

    emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('error')) {
            validateField(emailInput, emailError, validateEmail);
        }
    });

    messageInput.addEventListener('input', () => {
        if (messageInput.classList.contains('error')) {
            validateField(messageInput, messageError, validateMessage);
        }
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateField(nameInput, nameError, validateName);
        const isEmailValid = validateField(emailInput, emailError, validateEmail);
        const isMessageValid = validateField(messageInput, messageError, validateMessage);

        if (isNameValid && isEmailValid && isMessageValid) {
            // Show success animation
            formSuccess.classList.add('show');
            contactForm.reset();

            // Hide success after 3 seconds
            setTimeout(() => {
                formSuccess.classList.remove('show');
            }, 3000);
        }
    });


    /* ──────────────────────────────────────────────────────────
       13. SMOOTH SCROLL for anchor links
       ────────────────────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

})();
