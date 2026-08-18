import React from 'react';
import { ShoppingBag, Search, X } from 'lucide-react';
import storeConfig from '../config/storeConfig';
import './Header.css';

export default function Header({
  cartCount,
  onOpenCart,
  searchTerm,
  setSearchTerm,
  isSearchOpen,
  setIsSearchOpen
}) {
  return (
    <header className="site-header">
      <div className="header-container">
        {/* Brand Logo */}
        <a href="#hero" className="brand-logo">
          <span className="logo-badge">S</span>
          <span className="logo-text">{storeConfig.storeName}</span>
        </a>

        {/* Desktop Search Bar */}
        <div className="header-search-desktop">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search products, categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="desktop-search-input"
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Mobile Search Toggle */}
          <button
            className="mobile-search-toggle"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle search"
          >
            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          {/* Cart Trigger Button */}
          <button
            className="cart-trigger-btn"
            onClick={onOpenCart}
            aria-label={`Open Cart with ${cartCount} items`}
            id="open-cart-btn"
          >
            <ShoppingBag size={20} />
            <span className="cart-label">Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="mobile-search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            id="mobile-search-input"
          />
          {searchTerm && (
            <button
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}
    </header>
  );
}
