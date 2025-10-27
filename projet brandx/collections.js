// DOM Elements
const priceSlider = document.querySelector('.price-slider');
const priceCurrent = document.querySelector('.price-current');
const filterSelects = document.querySelectorAll('.filter-select');
const sizeButtons = document.querySelectorAll('.size-btn');
const sortSelect = document.querySelector('.sort-select');
const productsGrid = document.querySelector('.products-grid');
const productCards = document.querySelectorAll('.product-card');

// Price Range Functionality
priceSlider.addEventListener('input', (e) => {
    const value = e.target.value;
    priceCurrent.textContent = `$${value}`;
    filterProducts();
});

// Size Filter Functionality
sizeButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');
        filterProducts();
    });
});

// Category Filter Functionality
filterSelects.forEach(select => {
    select.addEventListener('change', filterProducts);
});

// Sort Functionality
sortSelect.addEventListener('change', filterProducts);

// Main Filter Function
function filterProducts() {
    const maxPrice = parseInt(priceSlider.value);
    const selectedSizes = Array.from(sizeButtons)
        .filter(btn => btn.classList.contains('active'))
        .map(btn => btn.textContent);
    const selectedCategory = document.querySelector('.filter-select').value;
    const sortBy = sortSelect.value;

    // Filter products
    productCards.forEach(card => {
        const price = parseFloat(card.dataset.price);
        const category = card.dataset.category;
        const sizes = card.dataset.sizes.split(',');
        
        // Price filter
        const priceMatch = price <= maxPrice;
        
        // Size filter
        const sizeMatch = selectedSizes.length === 0 || 
            selectedSizes.some(size => sizes.includes(size));
        
        // Category filter
        const categoryMatch = selectedCategory === 'all' || category === selectedCategory;
        
        // Show/hide based on filters
        if (priceMatch && sizeMatch && categoryMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Sort products
    const visibleProducts = Array.from(productCards)
        .filter(card => card.style.display !== 'none');

    visibleProducts.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        const dateA = new Date(a.dataset.date);
        const dateB = new Date(b.dataset.date);
        const ratingA = parseFloat(a.dataset.rating);
        const ratingB = parseFloat(b.dataset.rating);

        switch (sortBy) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'newest':
                return dateB - dateA;
            case 'popular':
                return ratingB - ratingA;
            default:
                return 0;
        }
    });

    // Reorder products in the grid
    visibleProducts.forEach(product => {
        productsGrid.appendChild(product);
    });
}

// Initialize price display
priceCurrent.textContent = `$${priceSlider.value}`;

// Add data attributes to product cards (this would typically come from your backend)
productCards.forEach(card => {
    // Example data - replace with actual data from your backend
    card.dataset.price = card.querySelector('.current-price').textContent.replace('$', '');
    card.dataset.category = 'tshirts'; // Replace with actual category
    card.dataset.sizes = 'S,M,L,XL'; // Replace with actual sizes
    card.dataset.date = '2024-03-20'; // Replace with actual date
    card.dataset.rating = '4.5'; // Replace with actual rating
}); 