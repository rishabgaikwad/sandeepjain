import React from 'react';
import { ShoppingCart } from 'lucide-react';
import storeConfig from '../config/storeConfig';
import './Header.css';

export default function Header({
  activeTab,
  setActiveTab,
  cartCount
}) {
  return (
    <header className="site-header">
      <div className="header-container">
        {/* Brand Logo */}
        <button className="brand-logo" onClick={() => setActiveTab('home')}>
          <span className="logo-badge">S</span>
          <span className="logo-text">{storeConfig.storeName}</span>
        </button>

        {/* Navigation Tabs (Desktop & Mobile Header) */}
        <nav className="header-nav">
          <button
            className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button
            className={`nav-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`nav-tab cart-nav-tab ${activeTab === 'cart' ? 'active' : ''}`}
            onClick={() => setActiveTab('cart')}
          >
            <span>Cart</span>
            <div className="header-cart-icon-wrapper">
              <ShoppingCart size={18} />
              {cartCount > 0 && <span className="header-cart-badge">{cartCount}</span>}
            </div>
          </button>
        </nav>
      </div>
    </header>
  );
}
