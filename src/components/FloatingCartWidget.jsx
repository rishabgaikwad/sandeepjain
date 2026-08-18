import React from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { formatPrice } from '../utils/priceFormatter';
import './FloatingCartWidget.css';

export default function FloatingCartWidget({ cartCount, cartTotal, onOpenCart }) {
  if (cartCount === 0) return null;

  return (
    <div className="floating-cart-widget-container">
      <div className="floating-cart-widget" onClick={onOpenCart}>
        <div className="cart-widget-info">
          <div className="cart-widget-icon-badge">
            <ShoppingCart size={18} />
            <span className="cart-widget-count">
              {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
            </span>
          </div>
          <div className="cart-widget-total">
            {formatPrice(cartTotal)}
          </div>
        </div>

        <button
          className="cart-widget-btn"
          onClick={(e) => {
            e.stopPropagation();
            onOpenCart();
          }}
          aria-label="View Cart"
        >
          <span>VIEW CART</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
