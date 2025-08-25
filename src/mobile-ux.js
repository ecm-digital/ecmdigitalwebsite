// ===== MOBILE UX OPTIMIZATIONS =====

// Mobile touch gesture handling
class MobileUXOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupTouchGestures();
        this.setupMobileNavigation();
        this.setupPerformanceOptimizations();
        this.setupAccessibility();
        this.setupMobileForms();
        this.setupMobileChatbot();
    }

    // Touch gesture handling
    setupTouchGestures() {
        if ('ontouchstart' in window) {
            this.setupSwipeGestures();
            this.setupPullToRefresh();
            this.setupTouchFeedback();
        }
    }

    setupSwipeGestures() {
        let startX, startY, endX, endY;
        const minSwipeDistance = 50;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;

            const deltaX = endX - startX;
            const deltaY = endY - startY;

            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.handleSwipeRight();
                } else {
                    this.handleSwipeLeft();
                }
            }
        });
    }

    handleSwipeLeft() {
        // Handle left swipe - could be used for navigation
        console.log('Swiped left');
    }

    handleSwipeRight() {
        // Handle right swipe - could be used for navigation
        console.log('Swiped right');
    }

    setupPullToRefresh() {
        let startY = 0;
        let currentY = 0;
        let pullDistance = 0;
        const threshold = 100;

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (window.scrollY === 0 && startY > 0) {
                currentY = e.touches[0].clientY;
                pullDistance = currentY - startY;

                if (pullDistance > 0 && pullDistance < threshold) {
                    this.showPullToRefreshIndicator(pullDistance);
                }
            }
        });

        document.addEventListener('touchend', () => {
            if (pullDistance > threshold) {
                this.handlePullToRefresh();
            }
            this.hidePullToRefreshIndicator();
            startY = 0;
            pullDistance = 0;
        });
    }

    showPullToRefreshIndicator(distance) {
        let indicator = document.querySelector('.pull-to-refresh');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'pull-to-refresh';
            indicator.innerHTML = 'Pociągnij w dół, aby odświeżyć';
            document.body.insertBefore(indicator, document.body.firstChild);
        }
        indicator.style.transform = `translateY(${Math.min(distance, 60)}px)`;
        indicator.style.opacity = Math.min(distance / 100, 1);
    }

    hidePullToRefreshIndicator() {
        const indicator = document.querySelector('.pull-to-refresh');
        if (indicator) {
            indicator.style.transform = 'translateY(-60px)';
            indicator.style.opacity = 0;
            setTimeout(() => {
                if (indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            }, 300);
        }
    }

    handlePullToRefresh() {
        // Reload the page or refresh content
        window.location.reload();
    }

    setupTouchFeedback() {
        // Add touch feedback to interactive elements
        const touchElements = document.querySelectorAll('.btn, .service-card, .team-card, .nav-link');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', () => {
                element.style.transform = 'scale(0.98)';
                element.style.transition = 'transform 0.1s ease';
            });

            element.addEventListener('touchend', () => {
                element.style.transform = 'scale(1)';
            });
        });
    }

    // Mobile navigation enhancements
    setupMobileNavigation() {
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');

        if (navbarToggler && navbarCollapse) {
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
                    if (navbarCollapse.classList.contains('show')) {
                        navbarToggler.click();
                    }
                }
            });

            // Close mobile menu when clicking on nav links
            const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (navbarCollapse.classList.contains('show')) {
                        navbarToggler.click();
                    }
                });
            });

            // Smooth scroll to sections
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href.startsWith('#')) {
                        e.preventDefault();
                        const target = document.querySelector(href);
                        if (target) {
                            const navbarHeight = document.querySelector('.navbar').offsetHeight;
                            const targetPosition = target.offsetTop - navbarHeight - 20;
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }
                });
            });
        }
    }

    // Performance optimizations for mobile
    setupPerformanceOptimizations() {
        // Lazy load images
        this.setupLazyLoading();
        
        // Reduce animations on mobile for better performance
        if (window.innerWidth <= 768) {
            this.optimizeAnimations();
        }

        // Optimize scroll performance
        this.optimizeScrollPerformance();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('image-lazy');
                        img.classList.add('image-loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('image-lazy');
                img.classList.add('image-loaded');
            });
        }
    }

    optimizeAnimations() {
        // Reduce animation complexity on mobile
        const animatedElements = document.querySelectorAll('.service-card, .team-card, .feature-card');
        
        animatedElements.forEach(element => {
            element.style.transition = 'all 0.2s ease';
        });
    }

    optimizeScrollPerformance() {
        let ticking = false;
        
        function updateScroll() {
            // Handle scroll-based animations
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick);
    }

    // Accessibility improvements for mobile
    setupAccessibility() {
        // Improve focus management
        this.setupFocusManagement();
        
        // Add skip links functionality
        this.setupSkipLinks();
        
        // Improve keyboard navigation
        this.setupKeyboardNavigation();
    }

    setupFocusManagement() {
        // Keep focus within mobile menu when open
        const navbarCollapse = document.querySelector('.navbar-collapse');
        const focusableElements = navbarCollapse ? 
            navbarCollapse.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])') : [];

        if (focusableElements.length > 0) {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            // Trap focus within mobile menu
            document.addEventListener('keydown', (e) => {
                if (navbarCollapse.classList.contains('show')) {
                    if (e.key === 'Tab') {
                        if (e.shiftKey) {
                            if (document.activeElement === firstElement) {
                                e.preventDefault();
                                lastElement.focus();
                            }
                        } else {
                            if (document.activeElement === lastElement) {
                                e.preventDefault();
                                firstElement.focus();
                            }
                        }
                    }
                }
            });
        }
    }

    setupSkipLinks() {
        const skipLinks = document.querySelectorAll('.skip-link');
        
        skipLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    setupKeyboardNavigation() {
        // Improve keyboard navigation for mobile
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close mobile menu with Escape key
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    document.querySelector('.navbar-toggler').click();
                }
            }
        });
    }

    // Mobile form optimizations
    setupMobileForms() {
        // Prevent zoom on input focus (iOS)
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                if (window.innerWidth <= 768) {
                    input.style.fontSize = '16px';
                }
            });

            input.addEventListener('blur', () => {
                input.style.fontSize = '';
            });
        });

        // Auto-hide keyboard on form submission
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', () => {
                if (window.innerWidth <= 768) {
                    document.activeElement.blur();
                }
            });
        });
    }

    // Mobile chatbot optimizations
    setupMobileChatbot() {
        const chatbotToggle = document.querySelector('.chatbot-toggle');
        const chatbotModal = document.querySelector('.chatbot-modal');

        if (chatbotToggle && chatbotModal) {
            // Optimize chatbot for mobile
            chatbotModal.addEventListener('touchstart', (e) => {
                e.stopPropagation();
            });

            // Close chatbot when clicking outside
            document.addEventListener('touchstart', (e) => {
                if (!chatbotModal.contains(e.target) && !chatbotToggle.contains(e.target)) {
                    chatbotModal.style.display = 'none';
                }
            });

            // Optimize chatbot scrolling
            const chatbotMessages = chatbotModal.querySelector('.chatbot-messages');
            if (chatbotMessages) {
                chatbotMessages.style.webkitOverflowScrolling = 'touch';
            }
        }
    }
}

// Initialize mobile UX optimizations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileUXOptimizer();
});

// Additional mobile-specific utilities
const MobileUtils = {
    // Check if device is mobile
    isMobile: () => {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    // Check if device supports touch
    isTouchDevice: () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    // Get device pixel ratio
    getPixelRatio: () => {
        return window.devicePixelRatio || 1;
    },

    // Check if device is high-DPI
    isHighDPI: () => {
        return window.devicePixelRatio > 1;
    },

    // Get viewport dimensions
    getViewportDimensions: () => {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
        };
    },

    // Add mobile-specific classes to body
    addMobileClasses: () => {
        const body = document.body;
        
        if (this.isMobile()) {
            body.classList.add('mobile-device');
        }
        
        if (this.isTouchDevice()) {
            body.classList.add('touch-device');
        }
        
        if (this.isHighDPI()) {
            body.classList.add('high-dpi');
        }
    },

    // Optimize images for device
    optimizeImages: () => {
        const images = document.querySelectorAll('img');
        const pixelRatio = this.getPixelRatio();
        
        images.forEach(img => {
            if (pixelRatio > 1 && img.dataset.src2x) {
                img.src = img.dataset.src2x;
            }
        });
    }
};

// Initialize mobile utilities
document.addEventListener('DOMContentLoaded', () => {
    MobileUtils.addMobileClasses();
    MobileUtils.optimizeImages();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MobileUXOptimizer, MobileUtils };
}
