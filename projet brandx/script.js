document.addEventListener('DOMContentLoaded', function() {
    // Page Loader
    const pageLoader = document.querySelector('.page-loader');
    if(pageLoader) {
        setTimeout(() => {
            pageLoader.style.opacity = '0';
            setTimeout(() => pageLoader.remove(), 500);
        }, 1000);
    }

    // Cart Management
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    function updateCartCount() {
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
    }

    function addToCart(product) {
        const existing = cart.find(item => item.id === product.id);
        if(existing) {
            existing.quantity++;
        } else {
            cart.push({...product, quantity: 1});
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showCartNotification('Product added to cart');
    }

    // Product Interactions
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            if (!productCard) return;

            const product = {
                id: productCard.dataset.id || Date.now().toString(), // Fallback ID if none exists
                name: productCard.querySelector('.product-name').textContent,
                price: parseFloat(productCard.querySelector('.current-price').textContent.replace('$', '')),
                image: productCard.querySelector('.product-image').src,
                size: productCard.querySelector('.size.selected')?.textContent || 'One Size'
            };
            addToCart(product);
        });
    });

    // Wishlist Functionality
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            icon.classList.toggle('far');
            icon.classList('fas');
        });
    });

    // Filter Functionality
    const filterProducts = () => {
        const activeFilters = {
            categories: [...document.querySelectorAll('.filter-options input:checked')]
                        .map(input => input.nextElementSibling.textContent.trim()),
            price: parseInt(document.querySelector('.price-range').value)
        };

        document.querySelectorAll('.product-card').forEach(card => {
            const category = card.querySelector('.product-category').textContent;
            const price = parseFloat(card.querySelector('.current-price').textContent.replace('$', ''));
            
            const categoryMatch = activeFilters.categories.length === 0 || 
                                activeFilters.categories.includes(category);
            const priceMatch = price <= activeFilters.price;
            
            card.style.display = (categoryMatch && priceMatch) ? 'block' : 'none';
        });
    };

    document.querySelectorAll('.filter-options input, .price-range').forEach(element => {
        element.addEventListener('change', filterProducts);
    });

    // Carousel Functionality
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const carouselDots = document.querySelector('.carousel-dots');
    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(index) {
        carouselSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % carouselSlides.length;
        showSlide(currentSlide);
    }

    function createDots() {
        carouselSlides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            dot.addEventListener('click', () => {
                currentSlide = i;
                showSlide(i);
                resetAutoSlide();
            });
            carouselDots.appendChild(dot);
        });
        showSlide(0);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    if(carouselSlides.length > 0) {
        createDots();
        resetAutoSlide();
    }

    // Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mainContent = document.querySelector('.main-content');

    function toggleSidebar() {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        mainContent.classList.toggle('sidebar-open');
    }

    if(navToggle && sidebar && sidebarOverlay) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSidebar();
        });

        sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    // Back to Top Button
    const backToTop = document.querySelector('.back-to-top');
    if(backToTop) {
        window.addEventListener('scroll', () => {
            window.scrollY > 300 
                ? backToTop.classList.add('show')
                : backToTop.classList.remove('show');
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Form Validation
    const validatePassword = (password) => {
        const requirements = {
            length: password.length >= 8,
            number: /\d/.test(password),
            special: /[!@#$%^&*]/.test(password)
        };
        
        document.querySelectorAll('[data-requirement]').forEach(item => {
            const req = item.dataset.requirement;
            item.classList.toggle('valid', requirements[req]);
        });
        
        return Object.values(requirements).every(Boolean);
    };

    document.querySelectorAll('input[type="password"]').forEach(input => {
        input.addEventListener('input', function() {
            validatePassword(this.value);
        });
    });

    // Cart Page Functionality
    if (document.querySelector('.cart-items')) {
        renderCartItems();
    }

    function renderCartItems() {
        const cartItems = document.querySelector('.cart-items');
        const emptyMessage = document.querySelector('.cart-empty-message');
        
        if (!cartItems) return;

        if (cart.length === 0) {
            emptyMessage?.classList.remove('hidden');
            cartItems.innerHTML = '';
            return;
        }

        emptyMessage?.classList.add('hidden');
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <div class="cart-item-meta">
                        <span class="cart-item-size">${item.size || 'One Size'}</span>
                    </div>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn minus" data-id="${item.id}" data-action="decrease">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" 
                               data-id="${item.id}">
                        <button class="quantity-btn plus" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `).join('');

        // Add event listeners for quantity buttons and remove buttons
        cartItems.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                const action = this.dataset.action;
                updateQuantity(id, action === 'increase' ? 1 : -1);
            });
        });

        cartItems.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const id = this.dataset.id;
                const value = parseInt(this.value);
                if (value > 0 && value <= 99) {
                    updateQuantity(id, value, true);
                }
            });
        });

        cartItems.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                removeFromCart(id);
            });
        });

        updateCartSummary();
    }

    function updateQuantity(productId, change, isDirectValue = false) {
        const item = cart.find(item => item.id === productId);
        if (!item) return;

        if (isDirectValue) {
            item.quantity = change;
        } else {
            const newQuantity = item.quantity + change;
            if (newQuantity > 0 && newQuantity <= 99) {
                item.quantity = newQuantity;
            }
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
        showCartNotification('Product removed from cart');
    }

    function updateCartSummary() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 100 ? 0 : 10;
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + shipping + tax;

        document.querySelectorAll('.subtotal').forEach(el => {
            el.textContent = `$${subtotal.toFixed(2)}`;
        });
        
        document.querySelectorAll('.shipping').forEach(el => {
            el.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        });
        
        document.querySelectorAll('.tax').forEach(el => {
            el.textContent = `$${tax.toFixed(2)}`;
        });
        
        document.querySelectorAll('.total').forEach(el => {
            el.textContent = `$${total.toFixed(2)}`;
        });
    }

    // Notification System
    function showCartNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }, 100);
    }

    // Size Selection on Product Page
    document.querySelectorAll('.size').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.size').forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Checkout Process
    if (document.querySelector('.checkout-page')) {
        const checkoutSections = document.querySelectorAll('.checkout-section');
        const progressSteps = document.querySelectorAll('.progress-step');
        let currentStep = 1;
        
        function showStep(step) {
            checkoutSections.forEach(section => {
                section.classList.remove('active');
                if (section.dataset.section == step) {
                    section.classList.add('active');
                }
            });
            
            progressSteps.forEach(progressStep => {
                progressStep.classList.remove('active');
                if (progressStep.dataset.step <= step) {
                    progressStep.classList.add('active');
                }
            });
            
            currentStep = step;
            
            if (step === 3) {
                updateReviewSection();
            }
        }

        function updateReviewSection() {
            const shippingData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zip: document.getElementById('zip').value
            };
            
            document.querySelector('.shipping-summary').innerHTML = `
                ${shippingData.firstName} ${shippingData.lastName}<br>
                ${shippingData.address}<br>
                ${shippingData.city}, ${shippingData.state} ${shippingData.zip}
            `;
            
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
            document.querySelector('.payment-summary').innerHTML = 
                paymentMethod === 'credit' ? 'Credit Card ending in ' + 
                document.getElementById('cardNumber').value.slice(-4) : 'PayPal';

            // Update order items in review section
            const orderItems = document.querySelector('.order-items');
            if (orderItems) {
                orderItems.innerHTML = cart.map(item => `
                    <div class="order-item">
                        <span>${item.name} x ${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('');
            }
        }
        
        // Event Listeners for Navigation
        document.querySelectorAll('.next-step-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const nextStep = parseInt(btn.dataset.next);
                if (validateStep(currentStep)) {
                    showStep(nextStep);
                }
            });
        });
        
        document.querySelectorAll('.back-step-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const prevStep = parseInt(btn.dataset.back);
                showStep(prevStep);
            });
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const step = parseInt(btn.dataset.step);
                showStep(step);
            });
        });

        // Payment method toggle
        document.querySelectorAll('input[name="payment"]').forEach(input => {
            input.addEventListener('change', function() {
                const creditCardForm = document.querySelector('.credit-card-form');
                if (creditCardForm) {
                    creditCardForm.style.display = this.value === 'credit' ? 'block' : 'none';
                }
            });
        });
        
        // Place Order Handler
        document.querySelector('.place-order-btn')?.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty');
                return;
            }
            
            // Here you would typically send the order to a server
            alert('Thank you for your order! We will process it shortly.');
            
            // Clear cart and redirect to confirmation page
            localStorage.removeItem('cart');
            cart = [];
            window.location.href = 'index.html';
        });
        
        // Initialize checkout page
        loadCheckoutSummary();
    }

    // Navigation
    document.querySelectorAll('.cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    });

    document.querySelectorAll('.checkout-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (cart.length === 0) {
                alert('Your cart is empty');
                return;
            }
            window.location.href = 'checkout.html';
        });
    });

    // Initialize cart
    updateCartCount();
});

// Product Image Thumbnail Switch
document.querySelectorAll('.thumbnails img').forEach(thumb => {
    thumb.addEventListener('click', function() {
        // Remove active class from all thumbnails
        document.querySelectorAll('.thumbnails img').forEach(img => {
            img.classList.remove('active');
        });
        
        // Set clicked thumbnail as active
        this.classList.add('active');
        
        // Update main image
        const mainImg = document.querySelector('.main-image img');
        mainImg.src = this.src;
    });
});