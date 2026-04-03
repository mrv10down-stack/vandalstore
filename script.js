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

const loginBtn = document.querySelector('.btn-login');
const signupBtn = document.querySelector('.btn-signup');

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        showNotification('Login feature coming soon!');
    });
}

if (signupBtn) {
    signupBtn.addEventListener('click', () => {
        showNotification('Sign Up feature coming soon!');
    });
}

// ============================================
// HERO SECTION INTERACTIONS (Homepage only)
// ============================================

const browsBtn = document.querySelector('.btn-primary');
if (browsBtn) {
    browsBtn.addEventListener('click', () => {
        document.querySelector('.products').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
}

const keysBtn = document.querySelector('.btn-secondary');
if (keysBtn) {
    keysBtn.addEventListener('click', () => {
        showNotification('Your Keys dashboard is loading...');
    });
}

// ============================================
// IMAGE SLIDER
// ============================================

document.querySelectorAll('[data-slider]').forEach((slider) => {
    const track = slider.querySelector('.slider-track');
    const slides = slider.querySelectorAll('.slider-slide');
    const prevBtn = slider.querySelector('[data-slider-prev]');
    const nextBtn = slider.querySelector('[data-slider-next]');
    const dotsContainer = slider.querySelector('.slider-dots');
    let currentIndex = 0;
    const totalSlides = slides.length;

    // Hide controls if only one slide
    if (totalSlides <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (dotsContainer) dotsContainer.style.display = 'none';
    }

    // Create dots
    if (dotsContainer && totalSlides > 1) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    }

    function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            goToSlide(currentIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            goToSlide(currentIndex);
        });
    }
});

// ============================================
// PURCHASE BUTTON INTERACTIONS
// ============================================

document.querySelectorAll('.btn-buy').forEach((btn) => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.price-card');
        const duration = card.querySelector('.duration').textContent;
        const price = card.querySelector('.price').textContent;
        showNotification(`Purchase for ${duration} (${price}) coming soon!`);
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
            setTimeout(() => {
                entry.target.classList.add('aos-animate');
            }, index * 100);
            observer.unobserve(entry.target);
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

document.querySelectorAll('[data-aos]').forEach((element) => {
    observer.observe(element);
});

// ============================================
// PRODUCT CARD HOVER EFFECTS
// ============================================

const productCards = document.querySelectorAll('.product-card');

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
    
    if (!document.querySelector('style[data-notification]')) {
        const style = document.createElement('style');
        style.setAttribute('data-notification', 'true');
        style.textContent = `
            @keyframes slideInRight {
                from { opacity: 0; transform: translateX(100px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes slideOutRight {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(100px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 3000);
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
    
    if (isMobile) {
        const hero = document.querySelector('.hero-glow-bg');
        if (hero) {
            hero.style.transform = 'none';
        }
    }
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
// KEYBOARD NAVIGATION SUPPORT
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.key === 'Home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// ============================================
// PAGE LOAD
// ============================================

window.addEventListener('load', () => {
    console.log('%c🎮 VANDAL STORE LOADED', 'color: #B30000; font-size: 18px; font-weight: bold;');
});

// ============================================
// CLEANUP ON PAGE UNLOAD
// ============================================

window.addEventListener('beforeunload', () => {
    console.log('👋 Vandal Store session ended');
});