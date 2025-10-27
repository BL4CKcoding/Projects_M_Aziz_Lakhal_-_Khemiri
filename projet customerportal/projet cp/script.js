document.addEventListener('DOMContentLoaded', function() {
    // Page Loader
    const pageLoader = document.querySelector('.page-loader');
    if (pageLoader) {
        setTimeout(() => {
            pageLoader.style.opacity = '0';
            setTimeout(() => {
                pageLoader.style.display = 'none';
            }, 500);
        }, 1000);
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

    if (navToggle && sidebar && sidebarOverlay) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSidebar();
        });

        sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (sidebar && !sidebar.contains(e.target)) {
            sidebar.classList.remove('active');
            if (sidebarOverlay) sidebarOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
            mainContent.classList.remove('sidebar-open');
        }
    });

    // Sidebar Accordion
    const sideElements = document.querySelectorAll('.side-element');
    sideElements.forEach(element => {
        const sideName = element.querySelector('.side-name');
        sideName.addEventListener('click', function() {
            element.classList.toggle('active');
        });
    });

    // Carousel Functionality
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;
    let carouselInterval;

    // Initialize dots if container exists
    if (dotsContainer && slides.length > 0) {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            dot.addEventListener('click', () => {
                goToSlide(index);
            });
            dotsContainer.appendChild(dot);
        });
    }

    function updateCarousel() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (dotsContainer && dotsContainer.children[index]) {
                dotsContainer.children[index].classList.remove('active');
            }
        });

        slides[currentIndex].classList.add('active');
        if (dotsContainer && dotsContainer.children[currentIndex]) {
            dotsContainer.children[currentIndex].classList.add('active');
        }
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
        resetCarouselInterval();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
        resetCarouselInterval();
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
        resetCarouselInterval();
    }

    function resetCarouselInterval() {
        clearInterval(carouselInterval);
        if (slides.length > 1) {
            carouselInterval = setInterval(nextSlide, 5000);
        }
    }

    // Event listeners for carousel navigation
    if (prevButton) prevButton.addEventListener('click', prevSlide);
    if (nextButton) nextButton.addEventListener('click', nextSlide);

    // Start carousel if slides exist
    if (slides.length > 0) {
        updateCarousel();
        resetCarouselInterval();
    }

    // Pause carousel on hover
    const heroCarousel = document.querySelector('.hero-carousel');
    if (heroCarousel) {
        heroCarousel.addEventListener('mouseenter', () => {
            clearInterval(carouselInterval);
        });

        heroCarousel.addEventListener('mouseleave', resetCarouselInterval);
    }

    // Product Card Interactions
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const img = this.querySelector('img');
            if (img) img.style.transform = 'scale(1.05)';
        });

        card.addEventListener('mouseleave', function() {
            const img = this.querySelector('img');
            if (img) img.style.transform = 'scale(1)';
        });

        // Add to cart functionality
        const addToCartBtn = card.querySelector('.add-to-cart');
        const cartCount = document.querySelector('.cart-count');
        
        if (addToCartBtn && cartCount) {
            addToCartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Animation for adding to cart
                const productImg = card.querySelector('img');
                if (!productImg) return;
                
                const imgClone = productImg.cloneNode(true);
                imgClone.style.position = 'fixed';
                imgClone.style.width = '50px';
                imgClone.style.height = '50px';
                imgClone.style.objectFit = 'contain';
                imgClone.style.borderRadius = '4px';
                imgClone.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                imgClone.style.zIndex = '1000';
                imgClone.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                
                const imgRect = productImg.getBoundingClientRect();
                imgClone.style.left = `${imgRect.left}px`;
                imgClone.style.top = `${imgRect.top}px`;
                
                document.body.appendChild(imgClone);
                
                const cartButton = document.querySelector('.cart-button');
                if (!cartButton) return;
                
                const cartRect = cartButton.getBoundingClientRect();
                const cartX = cartRect.left + cartRect.width / 2;
                const cartY = cartRect.top + cartRect.height / 2;
                
                setTimeout(() => {
                    imgClone.style.left = `${cartX - 25}px`;
                    imgClone.style.top = `${cartY - 25}px`;
                    imgClone.style.opacity = '0.5';
                    imgClone.style.transform = 'scale(0.5)';
                }, 10);
                
                setTimeout(() => {
                    imgClone.remove();
                    
                    // Update cart count
                    let count = parseInt(cartCount.textContent) || 0;
                    cartCount.textContent = count + 1;
                    
                    // Pulse animation
                    cartCount.style.transform = 'scale(1.5)';
                    setTimeout(() => {
                        cartCount.style.transform = 'scale(1)';
                    }, 300);
                }, 500);
            });
        }
    });

    // Brand Logo Hover Effects
    const brandLogos = document.querySelectorAll('.brand-logo img');
    brandLogos.forEach(logo => {
        logo.addEventListener('mouseenter', function() {
            this.style.filter = 'grayscale(0%)';
            this.style.opacity = '1';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.filter = 'grayscale(100%)';
            this.style.opacity = '0.7';
        });
    });

    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'form-success';
                successMsg.textContent = 'Thanks for subscribing!';
                this.parentNode.appendChild(successMsg);
                
                // Reset form
                emailInput.value = '';
                
                // Remove message after 3 seconds
                setTimeout(() => {
                    successMsg.remove();
                }, 3000);
            }
        });
    }

    // Sticky Header on Scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // Back to Top Button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Search Functionality
    const searchButton = document.querySelector('.search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            const searchInput = document.querySelector('.searchbar');
            if (searchInput && searchInput.value.trim() !== '') {
                alert(`Searching for: ${searchInput.value.trim()}`);
                // In a real implementation, you would filter products or make an API call
            }
        });
    }

    // Login Button
    const loginButton = document.querySelector('.header-right .right-section-button:first-child');
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Show login modal
            const loginModal = document.createElement('div');
            loginModal.className = 'login-modal';
            loginModal.innerHTML = `
                <div class="modal-content">
                    <button class="close-modal">&times;</button>
                    <h3>Login to Your Account</h3>
                    <form class="login-form">
                        <input type="email" placeholder="Email" required>
                        <input type="password" placeholder="Password" required>
                        <button type="submit">Login</button>
                    </form>
                </div>
            `;
            document.body.appendChild(loginModal);
            document.body.classList.add('modal-open');

            // Show modal with animation
            setTimeout(() => {
                loginModal.classList.add('active');
            }, 10);

            // Close modal when clicking the X button
            const closeModal = loginModal.querySelector('.close-modal');
            if (closeModal) {
                closeModal.addEventListener('click', function() {
                    loginModal.classList.remove('active');
                    setTimeout(() => {
                        document.body.removeChild(loginModal);
                        document.body.classList.remove('modal-open');
                    }, 300);
                });
            }

            // Close modal when clicking outside the modal content
            loginModal.addEventListener('click', function(e) {
                if (e.target === loginModal) {
                    loginModal.classList.remove('active');
                    setTimeout(() => {
                        document.body.removeChild(loginModal);
                        document.body.classList.remove('modal-open');
                    }, 300);
                }
            });

            // Form submission
            const loginForm = loginModal.querySelector('.login-form');
            if (loginForm) {
                loginForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    // Here you would typically handle the login logic
                    alert('Login functionality would be implemented here');
                    loginModal.classList.remove('active');
                    setTimeout(() => {
                        document.body.removeChild(loginModal);
                        document.body.classList.remove('modal-open');
                    }, 300);
                });
            }
        });
    }
});