import React from 'react';
import { Home, LayoutGrid, ShoppingCart } from 'lucide-react';
import './BottomNav.css';

export default function BottomNav({ activeTab, setActiveTab, cartCount }) {
  return (
    <nav className="bottom-nav">
      <button
        className={`bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => setActiveTab('home')}
      >
        <Home size={20} />
        <span>Home</span>
      </button>

      <button
        className={`bottom-nav-item ${activeTab === 'products' ? 'active' : ''}`}
        onClick={() => setActiveTab('products')}
      >
        <LayoutGrid size={20} />
        <span>Products</span>
      </button>

      <button
        className={`bottom-nav-item ${activeTab === 'cart' ? 'active' : ''}`}
        onClick={() => setActiveTab('cart')}
      >
        <div className="bottom-cart-icon-wrapper">
          <ShoppingCart size={20} />
          {cartCount > 0 && <span className="bottom-cart-badge">{cartCount}</span>}
        </div>
        <span>Cart</span>
      </button>
    </nav>
  );
}
