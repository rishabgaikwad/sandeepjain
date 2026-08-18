import React from 'react';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, MessageSquare } from 'lucide-react';
import storeConfig from '../config/storeConfig';
import './Hero.css';

export default function Hero({ onShopClick }) {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            Direct Order Catalogue
          </div>
          <h1 className="hero-title">
            Discover Our Handpicked Collection
          </h1>
          <p className="hero-description">
            Browse premium products, add items to your cart, and place orders directly via WhatsApp and automatic Email notifications. No login required.
          </p>

          <div className="hero-actions">
            <button className="hero-primary-btn" onClick={onShopClick}>
              <span>Explore Products</span>
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="hero-features">
            <div className="feature-item">
              <MessageSquare size={16} className="feature-icon" />
              <span>Instant WhatsApp Confirmation</span>
            </div>
            <div className="feature-item">
              <ShieldCheck size={16} className="feature-icon" />
              <span>No Account Needed</span>
            </div>
            <div className="feature-item">
              <Truck size={16} className="feature-icon" />
              <span>Fast Admin Processing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
