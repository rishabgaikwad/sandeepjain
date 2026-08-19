import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeView from './components/HomeView';
import ProductsView from './components/ProductsView';
import CartView from './components/CartView';

import productsData from './data/products';
import { CATEGORY_STRUCTURE } from './data/categories';
import { useCart } from './hooks/useCart';
import storeConfig from './config/storeConfig';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'products' | 'cart'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Map product IDs to current cart quantity
  const cartMap = useMemo(() => {
    const map = {};
    cart.forEach((item) => {
      map[item.id] = item.quantity;
    });
    return map;
  }, [cart]);

  const handleSelectCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setSelectedSubCategory(null);
  };

  const handleSelectSubCategory = (subCategoryName) => {
    setSelectedSubCategory(subCategoryName);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedSubCategory(null);
    setSearchTerm('');
  };

  return (
    <div className="app-container">
      {/* 1. Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItemCount}
      />

      {/* 2. Main View Renderer */}
      <main className="main-content">
        {activeTab === 'home' && (
          <HomeView
            products={productsData}
            categoryStructure={CATEGORY_STRUCTURE}
            cartMap={cartMap}
            onAddToCart={addToCart}
            onIncreaseQuantity={increaseQuantity}
            onDecreaseQuantity={decreaseQuantity}
            onNavigateToProducts={() => setActiveTab('products')}
            onSelectCategory={handleSelectCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        )}

        {activeTab === 'products' && (
          <ProductsView
            products={productsData}
            categoryStructure={CATEGORY_STRUCTURE}
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            onSelectCategory={handleSelectCategory}
            onSelectSubCategory={handleSelectSubCategory}
            cartMap={cartMap}
            onAddToCart={addToCart}
            onIncreaseQuantity={increaseQuantity}
            onDecreaseQuantity={decreaseQuantity}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onResetFilters={handleResetFilters}
          />
        )}

        {activeTab === 'cart' && (
          <CartView
            cart={cart}
            cartTotal={cartTotal}
            cartCount={cartItemCount}
            onIncreaseQuantity={increaseQuantity}
            onDecreaseQuantity={decreaseQuantity}
            onRemoveFromCart={removeFromCart}
            onClearCart={clearCart}
            onNavigateToProducts={() => setActiveTab('products')}
          />
        )}
      </main>

      {/* 3. Footer */}
      <footer className="site-footer">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} {storeConfig.storeName}. All rights reserved.</p>
          <p className="footer-tagline">Single-Page Product Catalogue — WhatsApp & Email Ordering Enabled</p>
        </div>
      </footer>

      {/* 4. Mobile Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItemCount}
      />
    </div>
  );
}
