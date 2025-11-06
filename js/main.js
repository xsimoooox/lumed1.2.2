// main.js - Script principal pour toutes les pages AVN
document.addEventListener('DOMContentLoaded', function() {
    // ==================== FONCTIONNALITÉS GLOBALES ====================
    
    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Fonction pour cacher le preloader
        function hidePreloader() {
            preloader.style.opacity = '0';
            setTimeout(function() {
                preloader.style.display = 'none';
            }, 500);
        }
        
        // Cacher le preloader après le chargement complet
        if (document.readyState === 'complete') {
            hidePreloader();
        } else {
            window.addEventListener('load', function() {
                setTimeout(hidePreloader, 1000);
            });
        }
    }

    // Theme Toggle
    const themeToggle = document.getElementById('dark-mode-toggle');
    if (themeToggle) {
        // Initialize theme: use saved preference, otherwise system preference
        const saved = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = saved || (systemPrefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.checked = currentTheme === 'dark';
        
        // Keep UI and storage in sync on toggle
        themeToggle.addEventListener('change', function() {
            const theme = this.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });

        // If no saved preference, follow system changes dynamically
        if (!saved && window.matchMedia) {
            const mq = window.matchMedia('(prefers-color-scheme: dark)');
            const applySystemTheme = (e) => {
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                themeToggle.checked = newTheme === 'dark';
            };
            // Modern browsers
            if (mq.addEventListener) {
                mq.addEventListener('change', applySystemTheme);
            } else if (mq.addListener) {
                // Safari fallback
                mq.addListener(applySystemTheme);
            }
        }
    } else {
        // Apply theme even if the toggle UI is not present on the page
        const saved = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = saved || (systemPrefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
    }

    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Sticky Navbar
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.padding = '10px 0';
                navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.padding = '15px 0';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        });
    }

    // Active Navigation Link
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', function() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Back to Top Button
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Admin/login pages removed — authentication code omitted

    // ==================== PAGE ACCUEIL (index.html) ====================

    // Events Carousel
    const carouselTrack = document.getElementById('carousel-track');
    if (carouselTrack) {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const carouselIndicators = document.getElementById('carousel-indicators');
        
        // Charger les événements depuis le localStorage
        const events = JSON.parse(localStorage.getItem('avnEvents')) || [];
        const upcomingEvents = events.filter(event => 
            event.type !== 'historical' && new Date(event.date) >= new Date()
        ).slice(0, 4); // Prendre les 4 premiers événements
        
        // Si pas d'événements, utiliser des événements par défaut
        const displayEvents = upcomingEvents.length > 0 ? upcomingEvents : [
            {
                id: 1,
                title: "Tech Innovation Workshop",
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                image: "assets/event1.jpg",
                description: "Hands-on workshop on the latest technology trends and innovations."
            },
            {
                id: 2,
                title: "AI Applications Seminar",
                date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                image: "assets/event2.jpg",
                description: "Exploring the latest advancements in AI applications across various domains."
            }
        ];
        
        // Create event cards
        displayEvents.forEach((event, index) => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <div class="event-image">
                    <img src="${event.image || 'assets/event-default.jpg'}" alt="${event.title}">
                </div>
                <span class="event-date">${new Date(event.date).toLocaleDateString()}</span>
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <a href="events.html" class="btn btn-outline">Read More</a>
            `;
            carouselTrack.appendChild(eventCard);
            
            // Create indicators
            const indicator = document.createElement('button');
            indicator.className = 'carousel-indicator';
            if (index === 0) indicator.classList.add('active');
            indicator.setAttribute('data-index', index);
            carouselIndicators.appendChild(indicator);
        });
        
        const indicators = document.querySelectorAll('.carousel-indicator');
        let currentIndex = 0;
        
        function updateCarousel() {
            carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
        }
        
        nextBtn.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % displayEvents.length;
            updateCarousel();
        });
        
        prevBtn.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + displayEvents.length) % displayEvents.length;
            updateCarousel();
        });
        
        indicators.forEach(indicator => {
            indicator.addEventListener('click', function() {
                currentIndex = parseInt(this.getAttribute('data-index'));
                updateCarousel();
            });
        });
        
        // Auto slide
        let autoSlide = setInterval(function() {
            currentIndex = (currentIndex + 1) % displayEvents.length;
            updateCarousel();
        }, 5000);
        
        // Pause auto slide on hover
        carouselTrack.addEventListener('mouseenter', function() {
            clearInterval(autoSlide);
        });
        
        carouselTrack.addEventListener('mouseleave', function() {
            autoSlide = setInterval(function() {
                currentIndex = (currentIndex + 1) % displayEvents.length;
                updateCarousel();
            }, 5000);
        });
    }

    // Testimonials Carousel
    const testimonials = document.querySelectorAll('.testimonial');
    if (testimonials.length > 0) {
        const testimonialBtns = document.querySelectorAll('.testimonial-btn');
        let currentTestimonial = 0;
        
        function showTestimonial(index) {
            testimonials.forEach(testimonial => {
                testimonial.classList.remove('active');
            });
            
            testimonialBtns.forEach(btn => {
                btn.classList.remove('active');
            });
            
            testimonials[index].classList.add('active');
            testimonialBtns[index].classList.add('active');
            currentTestimonial = index;
        }
        
        testimonialBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                showTestimonial(index);
            });
        });
        
        // Auto rotate testimonials
        setInterval(function() {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 6000);
    }

    // ==================== PAGE ABOUT (about.html) ====================

    // Division tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    if (tabButtons.length > 0) {
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to current button and pane
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // ==================== PAGE EVENTS (events.html) ====================

    // Countdown timer
    const countdownTimer = document.getElementById('days');
    if (countdownTimer) {
        function updateCountdown() {
            const eventDate = new Date('2024-03-15T09:00:00').getTime();
            const now = new Date().getTime();
            const distance = eventDate - now;
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
            
            if (distance < 0) {
                clearInterval(countdownInterval);
                document.querySelector('.countdown-timer').innerHTML = '<h3>Event Started!</h3>';
            }
        }
        
        const countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // Events Filter and Grid
    const eventsContainer = document.querySelector('.events-container');
    if (eventsContainer) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        // Charger les événements depuis le localStorage
        const events = JSON.parse(localStorage.getItem('avnEvents')) || [];
        
        // Événements par défaut si aucun événement n'existe
        const defaultEvents = [
            {
                id: 1,
                title: "Tech Innovation Summit 2024",
                date: "2024-03-15",
                type: "conference",
                status: "upcoming",
                image: "assets/event1.jpg",
                description: "Annual summit featuring keynote speakers, workshops, and project showcases from the intersection of technology and innovation.",
                location: "UEMF Innovation Center"
            },
            {
                id: 2,
                title: "AI Applications Workshop",
                date: "2024-02-10",
                type: "workshop",
                status: "upcoming",
                image: "assets/event2.jpg",
                description: "Hands-on workshop on implementing machine learning algorithms for various applications.",
                location: "UEMF AI Lab"
            }
        ];
        
        const allEvents = events.length > 0 ? events : defaultEvents;
        
        function displayEvents(filter = 'all') {
            eventsContainer.innerHTML = '';
            
            const filteredEvents = allEvents.filter(event => {
                if (filter === 'all') return true;
                if (filter === 'upcoming') return event.status === 'upcoming' || new Date(event.date) >= new Date();
                if (filter === 'past') return event.status === 'past' || new Date(event.date) < new Date();
                if (filter === 'historical') return event.type === 'historical';
                return event.type === filter;
            });
            
            if (filteredEvents.length === 0) {
                eventsContainer.innerHTML = '<p class="no-events">Aucun événement trouvé pour ce filtre.</p>';
                return;
            }
            
            filteredEvents.forEach(event => {
                const eventDate = new Date(event.date);
                const formattedDate = eventDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                const eventCard = document.createElement('div');
                eventCard.className = 'event-card-detailed';
                eventCard.innerHTML = `
                    <div class="event-image-detailed">
                        <img src="${event.image || 'assets/event-default.jpg'}" alt="${event.title}">
                    </div>
                    <div class="event-content-detailed">
                        <div class="event-meta">
                            <span class="event-date">${formattedDate}</span>
                            <span class="event-type">${event.type}</span>
                        </div>
                        <h3>${event.title}</h3>
                        <p>${event.description}</p>
                        ${event.location ? `
                            <div class="event-location">
                                <i class="fas fa-map-marker-alt"></i> ${event.location}
                            </div>
                        ` : ''}
                        <a href="#" class="btn btn-outline" style="margin-top: 15px;">View Details</a>
                    </div>
                `;
                eventsContainer.appendChild(eventCard);
            });
        }
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const filter = this.getAttribute('data-filter');
                displayEvents(filter);
            });
        });
        
        // Initial display
        displayEvents();
    }

    // ==================== PAGE MEMBERS (members.html) ====================

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                const isActive = answer.classList.contains('active');
                
                // Close all answers
                document.querySelectorAll('.faq-answer').forEach(ans => {
                    ans.classList.remove('active');
                });
                
                // Toggle current answer
                if (!isActive) {
                    answer.classList.add('active');
                }
                
                // Rotate arrow
                const arrow = this.querySelector('i');
                if (arrow) {
                    arrow.style.transform = isActive ? 'rotate(0deg)' : 'rotate(180deg)';
                }
            });
        });
    }

    // ==================== FONCTIONNALITÉS COMMUNES ====================

    // Animated Counters (pour toutes les pages)
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (counters.length > 0) {
        function animateCounters() {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const increment = target / 200;
                
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(animateCounters, 1);
                } else {
                    counter.innerText = target;
                }
            });
        }
        
        // Observer pour déclencher l'animation quand la section est visible
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        // Observer les sections qui contiennent des compteurs
        document.querySelectorAll('#featured-projects, #club-stats').forEach(section => {
            if (section) counterObserver.observe(section);
        });
    }

    // Form Submissions (tous les formulaires)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Récupérer le type de formulaire
            const formId = this.id || 'form';
            let message = 'Thank you for your submission!';

            if (formId.includes('newsletter')) {
                message = 'Thank you for subscribing to our newsletter!';
            } else if (formId.includes('member')) {
                message = 'Thank you for your membership application! We will review it and contact you soon.';
            } else if (formId.includes('contact')) {
                message = 'Thank you for your message! We will get back to you as soon as possible.';
            } else if (formId.includes('event-registration')) {
                message = 'Thank you for registering! We will send you confirmation details shortly.';
            } else if (formId.includes('volunteer')) {
                message = 'Thank you for your interest in volunteering! We will contact you about available opportunities.';
            }

            // Simulation d'envoi réussi
            alert(message);
            this.reset();
        });
    });

    // Intersection Observer for general animations
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observer les sections principales
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Initialize Particles.js for hero background (page d'accueil)
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#9f8bcb'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: true
                },
                size: {
                    value: 3,
                    random: true
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#9f8bcb',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    }
                }
            },
            retina_detect: true
        });
    }

    // Gestion des images manquantes
    document.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            e.target.style.display = 'none';
            console.log('Image not found:', e.target.src);
        }
    }, true);

    // Amélioration de l'accessibilité
    document.addEventListener('keydown', function(e) {
        // Fermer le menu mobile avec la touche Escape
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Amélioration des performances - Lazy loading pour les images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    console.log('AVN Website loaded successfully!');
});

// Gestion du rechargement de la page pour maintenir la position
window.addEventListener('beforeunload', function() {
    // Sauvegarder la position de défilement
    sessionStorage.setItem('scrollPosition', window.pageYOffset);
});

window.addEventListener('load', function() {
    // Restaurer la position de défilement
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
        sessionStorage.removeItem('scrollPosition');
    }
});

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// Service Worker pour le cache (optionnel pour PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('SW registered: ', registration);
        }).catch(function(registrationError) {
            console.log('SW registration failed: ', registrationError);
        });
    });
}
