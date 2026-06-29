tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        primary: '#4361ee',
                    }
                }
            }
        }
    

        
        window.onload = () => {            
            AOS.init({                 
                duration: 1000,                 
                once: true,                 
                offset: 50,                
                easing: 'ease-out-cubic'            
            });            
            initTypewriter();            
            initSkillObserver();
            init3DTilt();
        };

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

            const cards = document.querySelectorAll('.skill-card, .project-card, .edu-card, .cert-card');
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
                    card.style.borderColor = 'var(--primary)';
                    card.style.boxShadow = '0 25px 40px -15px rgba(67, 97, 238, 0.25), 0 0 20px rgba(67, 97, 238, 0.1)';
                    card.style.zIndex = '20';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
                    card.style.borderColor = 'var(--border)';
                    card.style.boxShadow = 'none';
                    card.style.zIndex = '1';
                });
            });
        }

        // Scroll Effects        
        const navbar = document.getElementById('navbar');        
        const btt = document.getElementById('btt');

        window.onscroll = () => {            
            if (window.scrollY > 50) {                
                navbar.classList.add('glass-nav');                
                navbar.classList.remove('h-20');                
                navbar.classList.add('h-16');                
                navbar.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.1)';            
            } else {                
                navbar.classList.remove('glass-nav');                
                navbar.classList.remove('h-16');                
                navbar.classList.add('h-20');                
                navbar.style.boxShadow = 'none';            
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