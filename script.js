tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        primary: '#0ea5e9',      /* Sky Blue */
                        primaryLight: '#38bdf8', 
                        secondary: '#3b82f6',    /* Royal Blue */
                        accent: '#6366f1',       /* Space Indigo */
                    },
                    boxShadow: {
                        'glow-primary': '0 0 20px rgba(14, 165, 233, 0.4)',
                        'glow-secondary': '0 0 20px rgba(59, 130, 246, 0.4)',
                        'glow-accent': '0 0 20px rgba(99, 102, 241, 0.4)',
                    },
                    animation: {
                        'spin-slow': 'spin 15s linear infinite',
                    }
                }
            }
        }
    


        window.onload = () => {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 50,
                easing: 'ease-out-quint', /* Smoother easing curve */
                delay: 100
            });
            initTypewriter();
            initSkillObserver();
            init3DTilt();
            initProjectFilter();
            initSpaceField();
            initParallax();
        };

        // Smooth Canvas Space Particle Field (depth-layered, twinkling dust)
        function initSpaceField() {
            const canvas = document.getElementById('space-canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let particles = [];
            let w, h, mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

            function resize() {
                w = canvas.width = window.innerWidth;
                h = canvas.height = window.innerHeight;
            }
            resize();
            window.addEventListener('resize', resize);

            const COUNT = window.innerWidth < 768 ? 50 : 110;
            for (let i = 0; i < COUNT; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: Math.random() * 1.6 + 0.3,
                    depth: Math.random() * 0.6 + 0.2, // parallax depth factor
                    baseAlpha: Math.random() * 0.5 + 0.3,
                    twinkleSpeed: Math.random() * 0.02 + 0.005,
                    twinklePhase: Math.random() * Math.PI * 2,
                    driftX: (Math.random() - 0.5) * 0.06,
                    driftY: (Math.random() - 0.5) * 0.06
                });
            }

            window.addEventListener('mousemove', (e) => {
                targetX = (e.clientX / w - 0.5);
                targetY = (e.clientY / h - 0.5);
            });

            function animate() {
                if (!document.documentElement.classList.contains('dark')) {
                    requestAnimationFrame(animate);
                    return;
                }
                ctx.clearRect(0, 0, w, h);
                // ease mouse position for smooth parallax (lerp)
                mouseX += (targetX - mouseX) * 0.04;
                mouseY += (targetY - mouseY) * 0.04;

                particles.forEach(p => {
                    p.twinklePhase += p.twinkleSpeed;
                    p.x += p.driftX;
                    p.y += p.driftY;
                    if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
                    if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

                    const parallaxX = mouseX * 40 * p.depth;
                    const parallaxY = mouseY * 40 * p.depth;
                    const alpha = p.baseAlpha * (0.5 + 0.5 * Math.sin(p.twinklePhase));

                    ctx.beginPath();
                    ctx.arc(p.x + parallaxX, p.y + parallaxY, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(186, 230, 253, ${alpha})`;
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
                    ctx.fill();
                });

                requestAnimationFrame(animate);
            }
            requestAnimationFrame(animate);
        }

        // Smooth parallax depth for hero blobs and profile image based on mouse movement
        function initParallax() {
            if (window.matchMedia("(pointer: coarse)").matches) return;
            const blobs = document.querySelectorAll('.blob-shape');
            let mx = 0, my = 0, cx = 0, cy = 0;

            window.addEventListener('mousemove', (e) => {
                mx = (e.clientX / window.innerWidth - 0.5);
                my = (e.clientY / window.innerHeight - 0.5);
            });

            function loop() {
                cx += (mx - cx) * 0.05;
                cy += (my - cy) * 0.05;

                blobs.forEach((b, i) => {
                    const factor = i % 2 === 0 ? 25 : -25;
                    b.style.translate = `${cx * factor}px ${cy * factor}px`;
                });

                requestAnimationFrame(loop);
            }
            loop();
        }

        // Project Filtering Logic
        function initProjectFilter() {
            const filterBtns = document.querySelectorAll('.filter-btn');
            const projectItems = document.querySelectorAll('.project-item');

            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Remove active classes from all buttons
                    filterBtns.forEach(b => {
                        b.className = "filter-btn px-6 py-2.5 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors";
                    });
                    
                    // Add active classes to clicked button
                    btn.className = "filter-btn active px-6 py-2.5 rounded-full bg-gradient-to-r from-primary to-primaryLight text-white font-bold text-sm shadow-[0_0_15px_rgba(14,165,233,0.4)] transition-all";

                    const filterValue = btn.getAttribute('data-filter');

                    projectItems.forEach(item => {
                        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                            item.style.display = 'flex';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 10);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'scale(0.95)';
                            setTimeout(() => {
                                if (item.style.opacity === '0') {
                                    item.style.display = 'none';
                                }
                            }, 300);
                        }
                    });
                });
            });
        }

        // Dark/Light Theme Auto-Adjust and Toggle Logic
        const themeBtn = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        const htmlElement = document.documentElement;
        const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const applyTheme = (isDark) => {
            if (isDark) {
                htmlElement.classList.add('dark');
                themeIcon.className = 'fas fa-sun text-yellow-400 drop-shadow-md';
                themeIcon.style.transform = 'rotate(360deg) scale(1.2)';
            } else {
                htmlElement.classList.remove('dark');
                themeIcon.className = 'fas fa-moon text-slate-700';
                themeIcon.style.transform = 'rotate(0deg) scale(1)';
            }
        };

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            applyTheme(savedTheme === 'dark');
        } else {
            applyTheme(systemThemeQuery.matches);
        }

        systemThemeQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) applyTheme(e.matches);
        });

        themeBtn.onclick = () => {
            const isCurrentlyDark = htmlElement.classList.contains('dark');
            const newThemeDark = !isCurrentlyDark;
            applyTheme(newThemeDark);
            localStorage.setItem('theme', newThemeDark ? 'dark' : 'light');
        };

        // 3D Tilt Effect - Disabled on Mobile for performance
        function init3DTilt() {
            if (window.matchMedia("(pointer: coarse)").matches) return;

            const cards = document.querySelectorAll('.skill-card, .project-card, .edu-card, .cert-card, .pub-card');
            cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = ((y - centerY) / centerY) * -5;
                    const rotateY = ((x - centerX) / centerX) * 5;
                    
                    card.style.transition = 'transform 0.1s ease'; 
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
                    card.style.zIndex = '20';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
                    card.style.zIndex = '1';
                });
            });
        }

        // Scroll Effects
        const navbar = document.getElementById('navbar');
        const navbarInner = document.getElementById('navbar-inner');
        const btt = document.getElementById('btt');
        const scrollProgress = document.getElementById('scroll-progress');

        window.onscroll = () => {
            // Scroll Progress Bar Update
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            if(scrollProgress) scrollProgress.style.width = scrolled + "%";

            if (window.scrollY > 50) {
                navbar.classList.replace('pt-4', 'pt-2');
                navbar.classList.replace('md:pt-6', 'md:pt-2');
                if (navbarInner) navbarInner.classList.replace('py-3', 'py-2');
                if (navbarInner) navbarInner.classList.replace('md:py-4', 'md:py-2');
            } else {
                navbar.classList.replace('pt-2', 'pt-4');
                navbar.classList.replace('md:pt-2', 'md:pt-6');
                if (navbarInner) navbarInner.classList.replace('py-2', 'py-3');
                if (navbarInner) navbarInner.classList.replace('md:py-2', 'md:py-4');
            }

            if (window.scrollY > 400) {
                btt.classList.replace('opacity-0', 'opacity-100');
                btt.classList.remove('pointer-events-none');
            } else {
                btt.classList.replace('opacity-100', 'opacity-0');
                btt.classList.add('pointer-events-none');
            }
        };

        btt.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

        // Mobile Menu Logic
        const mobileToggle = document.getElementById('mobile-toggle');
        const mobileClose = document.getElementById('mobile-close');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        const toggleMenu = (open) => {
            if (open) {
                mobileMenu.classList.remove('invisible');
                setTimeout(() => {
                    mobileMenu.classList.remove('translate-x-full');
                    mobileMenu.classList.add('translate-x-0');
                }, 10);
                document.body.classList.add('overflow-hidden');
            } else {
                mobileMenu.classList.add('translate-x-full');
                mobileMenu.classList.remove('translate-x-0');
                
                setTimeout(() => {
                    if (mobileMenu.classList.contains('translate-x-full')) {
                        mobileMenu.classList.add('invisible');
                    }
                }, 500);
                
                document.body.classList.remove('overflow-hidden');
            }
        };

        mobileToggle.onclick = () => toggleMenu(true);
        mobileClose.onclick = () => toggleMenu(false);
        mobileLinks.forEach(link => link.onclick = () => toggleMenu(false));

        // Typewriter Effect
        function initTypewriter() {
            const words = ["Frontend Development", "UI/UX Architecture", "React Engineering", "Creative Design"];
            let wordIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            const target = document.getElementById('typewriter');

            function type() {
                const currentWord = words[wordIndex];
                if (isDeleting) {
                    target.textContent = currentWord.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    target.textContent = currentWord.substring(0, charIndex + 1);
                    charIndex++;
                }

                let typeSpeed = isDeleting ? 40 : 100;

                if (!isDeleting && charIndex === currentWord.length) {
                    isDeleting = true;
                    typeSpeed = 2000; 
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    typeSpeed = 500;
                }

                setTimeout(type, typeSpeed);
            }
            type();
        }

        function initSkillObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bars = entry.target.querySelectorAll('.progress-bar-fill');
                        bars.forEach(bar => {
                            bar.style.width = bar.dataset.width;
                        });
                    }
                });
            }, { threshold: 0.1 });

            const skillsSection = document.getElementById('skills');
            if (skillsSection) observer.observe(skillsSection);
        }

        // WhatsApp Redirection logic
        document.getElementById('contactForm').onsubmit = (e) => {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;
            
            const whatsappNumber = "919842123720";
            const encodedMessage = encodeURIComponent(
                `Hello Gowtham! My name is ${name}.\nEmail: ${email}\nMessage: ${message}`
            );
            
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            const toast = document.getElementById('toast');
            toast.classList.replace('translate-y-24', 'translate-y-0');
            toast.classList.replace('opacity-0', 'opacity-100');
            
            setTimeout(() => {
                window.open(whatsappURL, '_blank');
                e.target.reset();
                toast.classList.replace('translate-y-0', 'translate-y-24');
                toast.classList.replace('opacity-100', 'opacity-0');
            }, 1000);
        };
