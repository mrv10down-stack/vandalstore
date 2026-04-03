// ============================================
// CONFIGURATION
// ============================================

const SCROLL_THRESHOLD = 100;
const PROMO_CODES = {
    'VANDAL10': 10,
    'WELCOME20': 20,
    'VIP15': 15
};

// ============================================
// LOADING SCREEN
// ============================================

const loadingScreen = document.getElementById('loadingScreen');
if (loadingScreen) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1600);
    });
}

// ============================================
// DARK/LIGHT MODE TOGGLE
// ============================================

const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('vandal-theme') || 'dark';

if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeToggle) themeToggle.textContent = '☀️';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        if (current === 'light') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('vandal-theme', 'dark');
            themeToggle.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('vandal-theme', 'light');
            themeToggle.textContent = '☀️';
        }
    });
}

// ============================================
// CURSOR TRAIL
// ============================================

const cursorDot = document.getElementById('cursorDot');
if (cursorDot && window.innerWidth > 768) {
    const dots = [];
    const TRAIL_LENGTH = 12;

    for (let i = 0; i < TRAIL_LENGTH; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-dot';
        dot.style.width = (8 - i * 0.5) + 'px';
        dot.style.height = (8 - i * 0.5) + 'px';
        dot.style.opacity = (0.7 - i * 0.05);
        document.body.appendChild(dot);
        dots.push({ el: dot, x: 0, y: 0 });
    }
    cursorDot.remove();

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrail() {
        dots.forEach((dot, i) => {
            const target = i === 0 ? { x: mouseX, y: mouseY } : dots[i - 1];
            dot.x += (target.x - dot.x) * 0.3;
            dot.y += (target.y - dot.y) * 0.3;
            dot.el.style.left = dot.x + 'px';
            dot.el.style.top = dot.y + 'px';
        });
        requestAnimationFrame(animateTrail);
    }
    animateTrail();
}

// ============================================
// SCROLL TO TOP
// ============================================

const scrollTopBtn = document.getElementById('scrollTopBtn');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

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
// CURRENT PAGE INDICATOR
// ============================================

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
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
// SHOPPING CART SYSTEM
// ============================================

let cart = JSON.parse(localStorage.getItem('vandal-cart') || '[]');
let appliedPromo = null;

const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItemsEl = document.getElementById('cartItems');
const cartBadge = document.getElementById('cartBadge');
const cartTotal = document.getElementById('cartTotal');
const promoInput = document.getElementById('promoInput');
const promoApply = document.getElementById('promoApply');
const promoMsg = document.getElementById('promoMsg');
const checkoutBtn = document.getElementById('checkoutBtn');
const cryptoBtn = document.getElementById('cryptoBtn');

function openCart() {
    if (cartSidebar) cartSidebar.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('open');
}

function closeCart() {
    if (cartSidebar) cartSidebar.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');
}

if (cartBtn) cartBtn.addEventListener('click', openCart);
if (cartClose) cartClose.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

function updateCartUI() {
    if (!cartItemsEl) return;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
    } else {
        cartItemsEl.innerHTML = cart.map((item, i) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.product}</h4>
                    <span>${item.duration}</span>
                </div>
                <span class="cart-item-price">€${item.price.toFixed(2)}</span>
                <button class="cart-item-remove" data-index="${i}">✕</button>
            </div>
        `).join('');

        cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                cart.splice(idx, 1);
                localStorage.setItem('vandal-cart', JSON.stringify(cart));
                updateCartUI();
            });
        });
    }

    // Update badge
    if (cartBadge) {
        cartBadge.textContent = cart.length;
        cartBadge.classList.toggle('empty', cart.length === 0);
    }

    // Update total
    let subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    let discount = appliedPromo ? (subtotal * appliedPromo / 100) : 0;
    let total = subtotal - discount;
    if (cartTotal) cartTotal.textContent = `€${total.toFixed(2)}`;
}

// Add to cart from buy buttons
document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const product = btn.dataset.product;
        const duration = btn.dataset.duration;
        const price = parseFloat(btn.dataset.price);

        if (product && duration && price) {
            cart.push({ product, duration, price });
            localStorage.setItem('vandal-cart', JSON.stringify(cart));
            updateCartUI();
            openCart();
            showNotification(`${product} (${duration}) added to cart!`);
        } else {
            showNotification('Coming soon!');
        }
    });
});

// Promo code
if (promoApply) {
    promoApply.addEventListener('click', () => {
        const code = promoInput.value.trim().toUpperCase();
        if (PROMO_CODES[code]) {
            appliedPromo = PROMO_CODES[code];
            promoMsg.textContent = `✓ ${appliedPromo}% discount applied!`;
            promoMsg.className = 'promo-msg success';
            updateCartUI();
        } else {
            promoMsg.textContent = '✕ Invalid promo code';
            promoMsg.className = 'promo-msg error';
            appliedPromo = null;
            updateCartUI();
        }
    });
}

// Checkout buttons
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        showNotification('Redirecting to Sellix checkout...');
    });
}

if (cryptoBtn) {
    cryptoBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        showNotification('Crypto payment coming soon!');
    });
}

// Initialize cart on load
updateCartUI();

// ============================================
// COUNTDOWN TIMER
// ============================================

const countdownTimer = document.getElementById('countdownTimer');
if (countdownTimer) {
    // Set deal end to 7 days from now (persisted)
    let dealEnd = localStorage.getItem('vandal-deal-end');
    if (!dealEnd) {
        dealEnd = Date.now() + 7 * 24 * 60 * 60 * 1000;
        localStorage.setItem('vandal-deal-end', dealEnd);
    }
    dealEnd = parseInt(dealEnd);

    function updateCountdown() {
        const now = Date.now();
        const diff = dealEnd - now;

        if (diff <= 0) {
            // Reset the deal
            dealEnd = Date.now() + 7 * 24 * 60 * 60 * 1000;
            localStorage.setItem('vandal-deal-end', dealEnd);
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        const cdDays = document.getElementById('cdDays');
        const cdHours = document.getElementById('cdHours');
        const cdMins = document.getElementById('cdMins');
        const cdSecs = document.getElementById('cdSecs');

        if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
        if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
        if (cdMins) cdMins.textContent = String(mins).padStart(2, '0');
        if (cdSecs) cdSecs.textContent = String(secs).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ============================================
// TABS SYSTEM
// ============================================

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        const container = btn.closest('.tabs-container');

        container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const target = container.querySelector(`#tab-${tabId}`);
        if (target) target.classList.add('active');
    });
});

// ============================================
// PAGE TRANSITIONS
// ============================================

document.querySelectorAll('a:not([href^="#"]):not([href^="mailto"]):not([target])').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        // Only do transition for internal links
        if (href.endsWith('.html') || href === '/') {
            e.preventDefault();
            document.body.style.opacity = '0';
            document.body.style.transform = 'translateY(20px)';
            document.body.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            setTimeout(() => {
                window.location.href = href;
            }, 300);
        }
    });
});

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

    if (totalSlides <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (dotsContainer) dotsContainer.style.display = 'none';
    }

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
// SCROLL ANIMATIONS (AOS)
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
        max-width: 300px;
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
// PARALLAX SCROLL EFFECT
// ============================================

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const hero = document.querySelector('.hero-glow-bg');
    
    if (hero && scrollY < window.innerHeight) {
        hero.style.transform = `translateY(${scrollY * 0.5}px)`;
    }
});

// ============================================
// HERO SECTION INTERACTIONS
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

// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (e.key === 'Home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (e.key === 'Escape') {
        closeCart();
    }
});

// ============================================
// TOUCH SUPPORT FOR MOBILE
// ============================================

if (window.innerWidth <= 768) {
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
// PAGE LOAD
// ============================================

window.addEventListener('load', () => {
    document.body.classList.add('page-transition');
    console.log('%c🎮 VANDAL STORE LOADED', 'color: #B30000; font-size: 18px; font-weight: bold;');
});

// ============================================
// FAQ ACCORDION
// ============================================

document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close all others
        document.querySelectorAll('.faq-item.open').forEach(openItem => {
            openItem.classList.remove('open');
        });

        // Toggle current
        if (!isOpen) {
            item.classList.add('open');
        }
    });
});

// ============================================
// DASHBOARD
// ============================================

const dashLoginBtn = document.getElementById('dashLoginBtn');
const dashEmail = document.getElementById('dashEmail');
const dashMsg = document.getElementById('dashMsg');
const dashboardLogin = document.getElementById('dashboardLogin');
const dashboardContent = document.getElementById('dashboardContent');

if (dashLoginBtn) {
    dashLoginBtn.addEventListener('click', () => {
        const email = dashEmail.value.trim();
        if (!email || !email.includes('@')) {
            dashMsg.textContent = 'Please enter a valid email address.';
            dashMsg.style.color = 'var(--blood-red-bright)';
            return;
        }

        dashMsg.textContent = 'Accessing dashboard...';
        dashMsg.style.color = 'var(--text-secondary)';

        setTimeout(() => {
            dashboardLogin.style.display = 'none';
            dashboardContent.style.display = 'block';
            dashboardContent.classList.add('page-transition');
            showNotification('Welcome to your dashboard!');
        }, 800);
    });
}

// Email notification subscription
const notifBtn = document.getElementById('notifBtn');
const notifEmail = document.getElementById('notifEmail');
const notifMsg = document.getElementById('notifMsg');

if (notifBtn) {
    notifBtn.addEventListener('click', () => {
        const email = notifEmail.value.trim();
        if (!email || !email.includes('@')) {
            notifMsg.textContent = 'Please enter a valid email.';
            notifMsg.style.color = 'var(--blood-red-bright)';
            return;
        }
        notifMsg.textContent = '✓ Successfully subscribed to notifications!';
        notifMsg.style.color = '#4CAF50';
        showNotification('Email notifications enabled!');
    });
}

// Status page - update last checked time
const lastChecked = document.getElementById('lastChecked');
if (lastChecked) {
    const now = new Date();
    lastChecked.textContent = now.toLocaleTimeString();
}