import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import MobileCartBar from './components/MobileCartBar';

import productsData from './data/products';
import { useCart } from './hooks/useCart';
import storeConfig from './config/storeConfig';
import './App.css';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
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

  // Extract unique categories from products
  const categories = useMemo(() => {
    const set = new Set();
    productsData.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, []);

  // Filter products by search term and category
  const filteredProducts = useMemo(() => {
    return productsData.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;

      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
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
          <div className="catalogue-title-area">
            <h2 className="catalogue-title">Our Products</h2>
            <p className="catalogue-subtitle">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} available
            </p>
          </div>

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={filteredProducts}
          onAddToCart={addToCart}
          onResetFilters={handleResetFilters}
          hasFilters={selectedCategory !== 'All' || searchTerm.trim() !== ''}
        />
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} {storeConfig.storeName}. All rights reserved.</p>
          <p className="footer-tagline">Single-Page Product Catalogue — WhatsApp & Email Ordering Enabled</p>
        </div>
      </footer>

      {/* 4. Cart Drawer (Slide-over panel) */}
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

      {/* 5. Fixed Mobile Cart Bar */}
      <MobileCartBar
        cartCount={cartItemCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
      />
    </div>
  );
}
