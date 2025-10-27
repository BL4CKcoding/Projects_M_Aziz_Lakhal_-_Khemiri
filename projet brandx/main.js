// Global state management
const state = {
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoading: false
};

// Sample product data (in a real app, this would come from a backend API)
const products = [
    {
        id: 1,
        name: "Premium Logo T-Shirt",
        price: 39.99,
        originalPrice: 49.99,
        image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573",
        category: "tshirts",
        colors: ["#000", "#7D0A0A", "#1a1a2e"],
        sizes: ["S", "M", "L", "XL"],
        rating: 4.5,
        reviews: 24,
        badge: "New"
    },
    // ... rest of the products array
];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
    loadCartDrawer();
    initializeCart();
    initializeCommon();
    
    // Initialize page-specific functionality
    const currentPage = getCurrentPage();
    switch(currentPage) {
        case 'collections':
            initializeCollections();
            break;
        case 'contact':
            initializeContactForm();
            initializeFAQAccordion();
            initializeMap();
            break;
        case 'wishlist':
            initializeWishlist();
            break;
        case 'about':
            // Any about page specific initialization
            initializeAbout();
            break;
        case 'checkout':
            initializeCheckout();
            break;
    }
});

// Utility function to determine current page
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('collections')) return 'collections';
    if (path.includes('contact')) return 'contact';
    if (path.includes('wishlist')) return 'wishlist';
    if (path.includes('about')) return 'about';
    return 'home';
}

// Common Components Loading
async function loadHeader() {
    const header = `
        <header class="header">
            <!-- ... existing header HTML ... -->
        </header>
    `;
    document.getElementById('header-placeholder').innerHTML = header;
}

async function loadFooter() {
    const footer = document.getElementById('footer-placeholder');
    if (footer) {
        const response = await fetch('/footer.html');
        const html = await response.text();
        footer.innerHTML = html;
    }
}

async function loadCartDrawer() {
    const cartDrawer = `
        <!-- ... existing cart drawer HTML ... -->
    `;
    document.getElementById('cart-drawer-placeholder').innerHTML = cartDrawer;
}

// Cart Functions
function updateCart() {
    const cartItems = state.cart;
    localStorage.setItem('cart', JSON.stringify(cartItems));
    renderCartItems();
    updateCartCount();
    updateCartTotal();
}

function updateCartCount() {
    const count = state.cart.reduce((total, item) => total + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'block' : 'none';
    }
}

function updateCartTotal() {
    const subtotal = calculateSubtotal();
    const tax = (subtotal * 0.1).toFixed(2); // 10% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = (parseFloat(subtotal) + parseFloat(tax) + shipping).toFixed(2);

    const subtotalEl = document.querySelector('.cart-subtotal');
    const taxEl = document.querySelector('.cart-tax');
    const shippingEl = document.querySelector('.cart-shipping');
    const totalEl = document.querySelector('.cart-total');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal}`;
    if (taxEl) taxEl.textContent = `$${tax}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total}`;

    // Update checkout button state
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.disabled = state.cart.length === 0;
    }
}

function renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;

    if (state.cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="collections.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        return;
    }

    cartItemsContainer.innerHTML = state.cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image || 'images/default-product.jpg'}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-price">
                    <p class="item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div class="quantity-controls">
                    <button type="button" class="quantity-btn minus" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <input type="number" min="1" max="99" value="${item.quantity}" 
                           onchange="updateQuantityInput(${item.id}, this.value)" 
                           class="quantity-input">
                    <button type="button" class="quantity-btn plus" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button type="button" class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function updateQuantity(itemId, change) {
    const itemIndex = state.cart.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;

    const newQuantity = state.cart[itemIndex].quantity + change;
    if (newQuantity < 1) {
        removeFromCart(itemId);
        return;
    }

    if (newQuantity > 99) return;

    state.cart[itemIndex].quantity = newQuantity;
    updateCart();
    showNotification('Cart updated', 'success');
}

function updateQuantityInput(itemId, value) {
    const quantity = parseInt(value);
    if (isNaN(quantity) || quantity < 1) return;
    
    const itemIndex = state.cart.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;

    const newQuantity = Math.min(99, Math.max(1, quantity));
    state.cart[itemIndex].quantity = newQuantity;
    updateCart();
    showNotification('Cart updated', 'success');
}

function removeFromCart(itemId) {
    const itemIndex = state.cart.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;

    const cartItem = document.querySelector(`.cart-item[data-id="${itemId}"]`);
    if (cartItem) {
        cartItem.classList.add('removing');
        setTimeout(() => {
            state.cart = state.cart.filter(item => item.id !== itemId);
            updateCart();
            showNotification('Item removed from cart', 'success');
        }, 300);
    } else {
        state.cart = state.cart.filter(item => item.id !== itemId);
        updateCart();
        showNotification('Item removed from cart', 'success');
    }
}

function addToCart(product) {
    if (!product) return;

    const existingItem = state.cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        state.cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    showNotification('Item added to cart', 'success');

    // Open cart drawer
    const cartDrawer = document.querySelector('.cart-drawer');
    if (cartDrawer) {
        cartDrawer.classList.add('active');
        document.querySelector('.cart-drawer-overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function calculateSubtotal() {
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

function closeCart() {
    const cartDrawer = document.querySelector('.cart-drawer');
    const overlay = document.querySelector('.cart-drawer-overlay');
    if (cartDrawer && overlay) {
        cartDrawer.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function proceedToCheckout() {
    if (state.cart.length === 0) {
        showNotification('Cannot checkout with empty cart', 'error');
        return;
    }

    // Save cart state
    localStorage.setItem('checkoutCart', JSON.stringify(state.cart));
    window.location.href = '/checkout.html';
}

// Wishlist System
function toggleWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const isInWishlist = wishlist.includes(productId);
    
    if (isInWishlist) {
        // Remove from wishlist
        const updatedWishlist = wishlist.filter(id => id !== productId);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        showNotification('Item removed from wishlist', 'info');
    } else {
        // Add to wishlist
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showNotification('Item added to wishlist', 'success');
    }
    
    // Update all wishlist buttons for this product
    updateWishlistButtons(productId);
    // Update wishlist count
    updateWishlistCount();
}

function updateWishlistButtons(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const isInWishlist = wishlist.includes(productId);
    
    // Update all wishlist buttons for this product
    document.querySelectorAll(`.add-to-wishlist[data-product-id="${productId}"], .wishlist-btn[data-product-id="${productId}"]`).forEach(btn => {
        const icon = btn.querySelector('i');
        if (icon) {
            icon.style.color = isInWishlist ? '#ff4444' : 'inherit';
            btn.classList.toggle('active', isInWishlist);
        }
    });
}

function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const count = wishlist.length;
    
    // Update all wishlist count elements
    document.querySelectorAll('.wishlist-count').forEach(element => {
        element.textContent = count;
        element.style.display = count > 0 ? 'flex' : 'none';
    });
}

function loadWishlistItems() {
    const wishlistContainer = document.querySelector('.wishlist-items');
    const emptyWishlist = document.querySelector('.empty-wishlist');
    if (!wishlistContainer) return;

    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = '';
        if (emptyWishlist) {
            emptyWishlist.classList.remove('hidden');
        }
        return;
    }

    if (emptyWishlist) {
        emptyWishlist.classList.add('hidden');
    }

    // Clear existing items
    wishlistContainer.innerHTML = '';

    // Add each wishlist item
    wishlist.forEach(productId => {
        const product = products.find(p => p.id === parseInt(productId));
        if (product) {
            const itemHTML = `
                <div class="wishlist-item" data-id="${productId}">
                    <div class="wishlist-item-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="wishlist-item-details">
                        <h3>${product.name}</h3>
                        <div class="price">$${product.price.toFixed(2)}</div>
                        <div class="wishlist-item-actions">
                            <button class="add-to-cart-btn" onclick="addToCart(${productId})">
                                <i class="fas fa-shopping-cart"></i>
                                Add to Cart
                            </button>
                            <button class="remove-from-wishlist-btn" onclick="removeFromWishlist(${productId})">
                                <i class="fas fa-trash"></i>
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
            wishlistContainer.insertAdjacentHTML('beforeend', itemHTML);
        }
    });
}

function removeFromWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const updatedWishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    
    // Update UI
    updateWishlistButtons(productId);
    updateWishlistCount();
    loadWishlistItems();
    showNotification('Item removed from wishlist', 'info');
}

// Initialize wishlist functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update wishlist count
    updateWishlistCount();
    
    // Update all wishlist buttons
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist.forEach(productId => {
        updateWishlistButtons(productId);
    });
    
    // Load wishlist items if on wishlist page
    if (document.querySelector('.wishlist-items')) {
        loadWishlistItems();
    }
    
    // Add click handlers to all wishlist buttons
    document.querySelectorAll('.add-to-wishlist, .wishlist-btn').forEach(btn => {
        const productId = btn.getAttribute('data-product-id');
        if (productId) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleWishlist(productId);
            });
        }
    });
});

// Collections Page Functions
function initializeCollections() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.querySelector('.sort-select');
    const priceRange = document.querySelector('.price-range');
    
    if (!document.querySelector('.products-grid')) return;

    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.id;
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.product-price').dataset.price;
            
            // Add to cart animation
            this.classList.add('adding');
            setTimeout(() => {
                this.classList.remove('adding');
                // Update cart count
                const cartCount = document.querySelector('.cart-count');
                if (cartCount) {
                    cartCount.textContent = parseInt(cartCount.textContent || 0) + 1;
                }
                // Show success message
                showNotification('Product added to cart successfully!', 'success');
            }, 1000);
            
            // Save to cart
            addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            });
        });
    });

    // Filter functionality
    if (filterButtons) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.dataset.filter;
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                filterProducts(filter);
            });
        });
    }

    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }

    // Price range functionality
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            filterByPrice(this.value);
        });
    }
}

function filterAndRenderProducts() {
    // ... existing filterAndRenderProducts function ...
}

function renderProducts() {
    // ... existing renderProducts function ...
}

function showQuickView(productId) {
    // ... existing showQuickView function ...
}

function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function sortProducts(method) {
    const productsGrid = document.querySelector('.products-grid');
    const products = Array.from(document.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.product-price').dataset.price);
        const priceB = parseFloat(b.querySelector('.product-price').dataset.price);
        
        if (method === 'price-low-high') {
            return priceA - priceB;
        } else if (method === 'price-high-low') {
            return priceB - priceA;
        }
    });
    
    productsGrid.innerHTML = '';
    products.forEach(product => productsGrid.appendChild(product));
}

function filterByPrice(maxPrice) {
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        const price = parseFloat(product.querySelector('.product-price').dataset.price);
        if (price <= maxPrice) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Contact Page Functions
function initializeContactForm() {
    // ... existing contact form initialization ...
}

function initializeFAQAccordion() {
    // ... existing FAQ accordion initialization ...
}

function initializeMap() {
    // ... existing map initialization ...
}

// Wishlist Page Functions
function initializeWishlist() {
    // ... existing wishlist initialization ...
}

function updateWishlistDisplay() {
    // ... existing updateWishlistDisplay function ...
}

// Checkout Page Functions
function initializeCheckout() {
    const checkoutCart = JSON.parse(localStorage.getItem('checkoutCart'));
    if (!checkoutCart || checkoutCart.length === 0) {
        window.location.href = '/';
        return;
    }

    renderCheckoutItems(checkoutCart);
    updateCheckoutSummary(checkoutCart);
    initializeCheckoutForm();
}

function renderCheckoutItems(items) {
    const container = document.querySelector('.checkout-items');
    if (!container) return;

    container.innerHTML = items.map(item => `
        <div class="checkout-item">
            <div class="checkout-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="checkout-item-details">
                <h4 class="checkout-item-name">${item.name}</h4>
                <div class="checkout-item-meta">Quantity: ${item.quantity}</div>
                <div class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        </div>
    `).join('');
}

function updateCheckoutSummary(items) {
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const total = subtotal + tax + shipping;

    document.querySelector('.checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.checkout-tax').textContent = `$${tax.toFixed(2)}`;
    document.querySelector('.checkout-shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.querySelector('.checkout-total').textContent = `$${total.toFixed(2)}`;
}

function initializeCheckoutForm() {
    const form = document.getElementById('shippingForm');
    if (!form) return;

    // Input formatting
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');
    const phoneInput = document.getElementById('phone');

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.match(/.{1,4}/g).join(' ');
            }
            e.target.value = value.substring(0, 19); // 16 digits + 3 spaces
        });
    }

    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            e.target.value = value.substring(0, 5); // MM/YY format
        });
    }

    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }

    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = formatPhoneNumber(e.target.value);
        });
    }

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateCheckoutForm(form)) {
            return;
        }

        const submitButton = form.querySelector('.place-order-btn');
        submitButton.disabled = true;
        submitButton.classList.add('loading');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Clear cart and checkout data
            localStorage.removeItem('cart');
            localStorage.removeItem('checkoutCart');
            state.cart = [];

            // Show success message and redirect
            showNotification('Order placed successfully!', 'success');
            setTimeout(() => {
                window.location.href = '/order-confirmation.html';
            }, 1500);
        } catch (error) {
            showNotification('Error processing order. Please try again.', 'error');
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    });
}

function validateCheckoutForm(form) {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    const cardNumberRegex = /^\d{4} \d{4} \d{4} \d{4}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    const cvvRegex = /^\d{3}$/;
    const zipCodeRegex = /^\d{5}(-\d{4})?$/;

    // Clear previous errors
    form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
        group.querySelector('.error-message').textContent = '';
    });

    // Validate each field
    const fields = {
        fullName: {
            regex: /.+/,
            message: 'Please enter your full name'
        },
        email: {
            regex: emailRegex,
            message: 'Please enter a valid email address'
        },
        phone: {
            regex: phoneRegex,
            message: 'Please enter a valid phone number'
        },
        address: {
            regex: /.+/,
            message: 'Please enter your address'
        },
        city: {
            regex: /.+/,
            message: 'Please enter your city'
        },
        state: {
            regex: /.+/,
            message: 'Please enter your state'
        },
        zipCode: {
            regex: zipCodeRegex,
            message: 'Please enter a valid ZIP code'
        },
        cardNumber: {
            regex: cardNumberRegex,
            message: 'Please enter a valid card number'
        },
        expiryDate: {
            regex: expiryDateRegex,
            message: 'Please enter a valid expiry date (MM/YY)'
        },
        cvv: {
            regex: cvvRegex,
            message: 'Please enter a valid CVV'
        }
    };

    Object.entries(fields).forEach(([fieldName, validation]) => {
        const input = form.querySelector(`#${fieldName}`);
        if (!input) return;

        const group = input.closest('.form-group');
        const errorElement = group.querySelector('.error-message');
        
        if (!validation.regex.test(input.value.trim())) {
            group.classList.add('error');
            errorElement.textContent = validation.message;
            isValid = false;
        }
    });

    return isValid;
}

// Common Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }, 100);
}

function formatPhoneNumber(value) {
    value = value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.length <= 3) {
            return value;
        } else if (value.length <= 6) {
            return value.slice(0, 3) + '-' + value.slice(3);
        } else {
            return value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
        }
    }
    return value;
}

// Initialize common functionality
function initializeCommon() {
    // Cart toggle
    const cartBtn = document.getElementById('cartBtn');
    const cartDrawer = document.querySelector('.cart-drawer');
    const cartOverlay = document.querySelector('.cart-drawer-overlay');
    const cartClose = document.querySelector('.cart-drawer-close');

    if (cartBtn && cartDrawer) {
        cartBtn.addEventListener('click', () => {
            cartDrawer.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        [cartClose, cartOverlay].forEach(el => {
            el?.addEventListener('click', () => {
                cartDrawer.classList.remove('active');
                cartOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = formatPhoneNumber(e.target.value);
        });
    });

    // Smooth scroll
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
}

// Initialize cart functionality
function initializeCart() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            state.cart = JSON.parse(savedCart);
        } catch (e) {
            state.cart = [];
            localStorage.removeItem('cart');
        }
    }

    // Initial render
    renderCartItems();
    updateCartCount();
    updateCartTotal();

    // Setup cart toggle
    const cartBtn = document.getElementById('cartBtn');
    const cartDrawer = document.querySelector('.cart-drawer');
    const cartOverlay = document.querySelector('.cart-drawer-overlay');
    const cartClose = document.querySelector('.cart-drawer-close');

    if (cartBtn && cartDrawer) {
        cartBtn.addEventListener('click', () => {
            cartDrawer.classList.add('active');
            if (cartOverlay) cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        if (cartClose) {
            cartClose.addEventListener('click', closeCart);
        }
        if (cartOverlay) {
            cartOverlay.addEventListener('click', closeCart);
        }
    }
}

// About Page Functions
function initializeAbout() {
    if (!document.querySelector('.about-section')) return;

    // Parallax effect
    window.addEventListener('scroll', function() {
        const parallaxSections = document.querySelectorAll('.parallax');
        parallaxSections.forEach(section => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            section.style.backgroundPosition = `center ${rate}px`;
        });
    });

    // Animate sections on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(section => {
        observer.observe(section);
    });

    // Team member hover effects
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        const socialLinks = member.querySelector('.social-links');
        if (socialLinks) {
            member.addEventListener('mouseenter', () => {
                socialLinks.style.opacity = '1';
            });
            member.addEventListener('mouseleave', () => {
                socialLinks.style.opacity = '0';
            });
        }
    });
}

// Export necessary functions and variables
window.state = state;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.toggleWishlist = toggleWishlist;
window.showQuickView = showQuickView;
window.showNotification = showNotification;

// Checkout calculations
function updateCheckoutSummary() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tva = subtotal * 0.19; // 19% TVA
    const shipping = 10; // Fixed shipping cost
    const fiscalStamp = 1; // Fixed fiscal stamp
    const total = subtotal + tva + shipping + fiscalStamp;

    // Update the summary display
    document.querySelector('.checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.checkout-tva').textContent = `$${tva.toFixed(2)}`;
    document.querySelector('.checkout-shipping').textContent = `$${shipping.toFixed(2)}`;
    document.querySelector('.checkout-stamp').textContent = `$${fiscalStamp.toFixed(2)}`;
    document.querySelector('.checkout-total').textContent = `$${total.toFixed(2)}`;

    // Update the items display
    const checkoutItems = document.querySelector('.checkout-items');
    checkoutItems.innerHTML = cartItems.map(item => `
        <div class="checkout-item">
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>Quantity: ${item.quantity}</p>
                <p class="item-price">$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        </div>
    `).join('');
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.checkout-container')) {
        updateCheckoutSummary();
    }
}); 