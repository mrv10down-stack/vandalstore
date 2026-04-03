// ============================================
// CONFIGURATION
// ============================================

const SCROLL_THRESHOLD = 100;

// ============================================
// NAVBAR FUNCTIONALITY
// ============================================

const navbar = document.querySelector('.navbar');
let isScrolled = false;

window.addEventListener('scroll', () => {
    if (window.scrollY > SCROLL_THRESHOLD && !isScrolled) {
        navbar.classList.add('scrolled');
        isScrolled = true;
    } else if (window.scrollY <= SCROLL_THRESHOLD && isScrolled) {
        navbar.classList.remove('scrolled');
        isScrolled = false;
    }
});

// ============================================
// NAVBAR BUTTON INTERACTIONS
// ============================================

document.querySelector('.btn-login').addEventListener('click', () => {
    console.log('🔐 Login button clicked');
    showNotification('Login feature coming soon!');
});

document.querySelector('.btn-signup').addEventListener('click', () => {
    console.log('✨ Sign Up button clicked');
    showNotification('Sign Up feature coming soon!');
});

// ============================================
// HERO SECTION INTERACTIONS
// ============================================

document.querySelector('.btn-primary').addEventListener('click', () => {
    console.log('🛍️ Browse Products clicked');
    document.querySelector('.products').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
});

document.querySelector('.btn-secondary').addEventListener('click', () => {
    console.log('🔑 Go to Your Keys clicked');
    showNotification('Your Keys dashboard is loading...');
});

// ============================================
// PRODUCT CARD INTERACTIONS
// ============================================

const productArrowButtons = document.querySelectorAll('.btn-arrow');

productArrowButtons.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.product-card');
        const productName = card.querySelector('.product-name').textContent;
        const productPrice = card.querySelector('.product-price').textContent;
        
        console.log(`🛒 Added to cart: ${productName} - ${productPrice}`);
        
        // Visual feedback animation
        btn.style.animation = 'none';
        setTimeout(() => {
            btn.style.animation = '';
        }, 10);
        
        // Pulse effect
        const originalTransform = btn.style.transform;
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            btn.style.transform = originalTransform;
        }, 300);
    });
});

// ============================================
// SCROLL ANIMATIONS (AOS - Animate On Scroll)
// ============================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observerCallback = (entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger animation
            setTimeout(() => {
                entry.target.classList.add('aos-animate');
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach((element) => {
    observer.observe(element);
});

// ============================================
// PRODUCT CARD HOVER EFFECTS
// ============================================

const productCards = document.querySelectorAll('.product-card');

productCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
        console.log(`👁️ Viewing: ${card.querySelector('.product-name').textContent}`);
    });
});

// ============================================
// BUTTON RIPPLE EFFECT
// ============================================

document.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
    });
});

// ============================================
// SMOOTH HOVER EFFECTS FOR CARDS
// ============================================

productCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');
    });
});

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #8B0000 0%, #B30000 100%);
        color: #fff;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(179, 0, 0, 0.6);
        z-index: 10000;
        animation: slideInRight 0.4s ease-out;
        border: 1px solid rgba(220, 20, 60, 0.5);
        font-weight: 600;
        letter-spacing: 0.5px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add animation keyframes if not already present
    if (!document.querySelector('style[data-notification]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notification', 'true');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove after 3 seconds with animation
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 3000);
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

window.addEventListener('load', () => {
    console.log('%c🎮 VANDAL STORE LOADED', 'color: #B30000; font-size: 18px; font-weight: bold; text-shadow: 0 0 10px rgba(179,0,0,0.8)');
    console.log('%cPremium gaming enhancements. Undetected. Instant delivery.', 'color: #DC143C; font-size: 13px; font-weight: 600');
    console.log('%c⚡ Performance: All systems operational', 'color: #8B0000; font-size: 12px');
});

// ============================================
// TOUCH SUPPORT FOR MOBILE
// ============================================

if (window.innerWidth <= 768) {
    document.querySelectorAll('button').forEach((btn) => {
        btn.addEventListener('touchstart', function() {
            this.style.opacity = '0.8';
        });
        
        btn.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
    });

    // Enhanced touch feedback for product cards
    productCards.forEach((card) => {
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// ============================================
// PARALLAX SCROLL EFFECT (SUBTLE)
// ============================================

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const hero = document.querySelector('.hero-glow-bg');
    
    if (hero && scrollY < window.innerHeight) {
        hero.style.transform = `translateY(${scrollY * 0.5}px)`;
    }
});

// ============================================
// RESPONSIVE BEHAVIOR
// ============================================

window.addEventListener('resize', () => {
    const isMobile = window.innerWidth <= 768;
    
    // Disable parallax on mobile
    if (isMobile) {
        const hero = document.querySelector('.hero-glow-bg');
        if (hero) {
            hero.style.transform = 'none';
        }
    }
});

// ============================================
// KEYBOARD NAVIGATION SUPPORT
// ============================================

document.addEventListener('keydown', (e) => {
    // Skip to products section with 'P' key
    if (e.key.toLowerCase() === 'p') {
        document.querySelector('.products').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Skip to top with 'Home' key
    if (e.key === 'Home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// ============================================
// CLEANUP ON PAGE UNLOAD
// ============================================

window.addEventListener('beforeunload', () => {
    console.log('👋 Vandal Store session ended');
});