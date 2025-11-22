document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ✨ CUSTOM CURSOR LOGIC (Optimized) ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        // Movement Logic
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline follows with a smooth lag using Web Animation API
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover Logic (Event Delegation) -> Works on dynamic elements too!
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('a, button, input, .hover-trigger');
            if (target) {
                document.body.classList.add('hovering');
            } else {
                document.body.classList.remove('hovering');
            }
        });
    }


    // --- 2. TYPING TEXT ANIMATION (Robust) ---
    const typingText = document.getElementById('typing-text');
    
    if (typingText) {
        const words = ["Kindred Soul.", "Best Friend.", "Partner.", "Adventures."];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function typeEffect() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typingText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50; 
            } else {
                typingText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100; 
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000; 
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; 
            }

            setTimeout(typeEffect, typeSpeed);
        }
        typeEffect();
    }


    // --- 3. ✨ 3D TILT CARD LOGIC (Static Elements) ---
    // Note: Dashboard cards handle their own tilt in dashboard.js
    const cards = document.querySelectorAll('.tilt-card');

    if (cards.length > 0) {
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                // Calculate mouse position relative to the card center
                const x = e.clientX - rect.left - rect.width / 2; 
                const y = e.clientY - rect.top - rect.height / 2;  
                
                // Rotate (Divide by 20 to dampen the effect)
                const rotateX = (y / -20).toFixed(2); 
                const rotateY = (x / 20).toFixed(2);

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });
        });
    }


    // --- 4. SCROLL REVEAL ANIMATION (Intersection Observer) ---
    // This is the modern, high-performance way to handle scroll animations
    const scrollElements = document.querySelectorAll('.scroll-element');

    if (scrollElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scrolled');
                    // Optional: Stop observing once shown to save resources
                    // observer.unobserve(entry.target); 
                }
            });
        }, {
            threshold: 0.15 // Trigger when 15% of element is visible
        });

        scrollElements.forEach((el) => observer.observe(el));
    }

    // Header Shadow on Scroll
    const header = document.querySelector('header');
    if(header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) header.classList.add('shadow-md');
            else header.classList.remove('shadow-md');
        });
    }


    // --- 5. MOBILE MENU TOGGLE ---
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
});
