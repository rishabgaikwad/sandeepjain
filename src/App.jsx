import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import FloatingCartWidget from './components/FloatingCartWidget';

import productsData from './data/products';
import { CATEGORY_STRUCTURE } from './data/categories';
import { useCart } from './hooks/useCart';
import storeConfig from './config/storeConfig';
import './App.css';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const {
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartItemCount,
    cartTotal
  } = useCart();

  // Map product IDs to their current cart quantity
  const cartMap = useMemo(() => {
    const map = {};
    cart.forEach((item) => {
      map[item.id] = item.quantity;
    });
    return map;
  }, [cart]);

  // Non-intrusive add to cart: adds product without opening drawer
  const handleAddToCart = (product) => {
    addToCart(product);
  };

  // Handle Main Category Change - automatically resets subcategory
  const handleSelectCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedSubCategory(null);
  };

  // Handle Sub Category Change
  const handleSelectSubCategory = (subCategoryName) => {
    setSelectedSubCategory(subCategoryName);
  };

  // Filter products by search term, main category, and sub category
  const filteredProducts = useMemo(() => {
    return productsData.filter((product) => {
      // Main Category Match
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      // Sub Category Match
      const matchesSubCategory =
        selectedSubCategory === null || product.subCategory === selectedSubCategory;

      // Search Term Match
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        (product.category && product.category.toLowerCase().includes(term)) ||
        (product.subCategory && product.subCategory.toLowerCase().includes(term));

      return matchesCategory && matchesSubCategory && matchesSearch;
    });
  }, [selectedCategory, selectedSubCategory, searchTerm]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedSubCategory(null);
    setSearchTerm('');
  };

  const handleScrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      {/* 1. Header */}
      <Header
        cartCount={cartItemCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
      />

      {/* 2. Hero Section */}
      <Hero onShopClick={handleScrollToProducts} />

      {/* 3. Main Catalogue Area */}
      <main id="products-section" className="main-content">
        <div className="catalogue-header">
          {/* Dedicated Search bar directly above 'Our Products' */}
          <div className="catalogue-search-bar">
            <div className="search-input-wrapper">
              <span className="search-input-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products by model, feature or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="catalogue-search-input"
              />
              {searchTerm && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="catalogue-title-area">
            <h2 className="catalogue-title">Our Products</h2>
            <p className="catalogue-subtitle">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} available
              {selectedCategory !== 'All' && (
                <span>
                  {' '}• <strong>{selectedCategory}</strong>
                  {selectedSubCategory && <span> &rsaquo; <em>{selectedSubCategory}</em></span>}
                </span>
              )}
            </p>
          </div>

          <CategoryFilter
            categoryStructure={CATEGORY_STRUCTURE}
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            onSelectCategory={handleSelectCategory}
            onSelectSubCategory={handleSelectSubCategory}
          />
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={filteredProducts}
          cartMap={cartMap}
          onAddToCart={handleAddToCart}
          onIncreaseQuantity={increaseQuantity}
          onDecreaseQuantity={decreaseQuantity}
          onResetFilters={handleResetFilters}
          hasFilters={selectedCategory !== 'All' || selectedSubCategory !== null || searchTerm.trim() !== ''}
        />
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} {storeConfig.storeName}. All rights reserved.</p>
          <p className="footer-tagline">Single-Page Product Catalogue — WhatsApp & Email Ordering Enabled</p>
        </div>
      </footer>

      {/* 4. Bottom Sheet Cart */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        cartTotal={cartTotal}
        cartCount={cartItemCount}
        onIncreaseQuantity={increaseQuantity}
        onDecreaseQuantity={decreaseQuantity}
        onRemoveFromCart={removeFromCart}
        onClearCart={clearCart}
        onBrowseProducts={handleScrollToProducts}
      />

      {/* 5. Floating Bottom Cart Widget (Desktop & Mobile) */}
      {!isCartOpen && (
        <FloatingCartWidget
          cartCount={cartItemCount}
          cartTotal={cartTotal}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}
    </div>
  );
}
