import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '../utils/priceFormatter';
import './MobileCartBar.css';

export default function MobileCartBar({ cartCount, cartTotal, onOpenCart }) {
  if (cartCount === 0) return null;

  return (
    <div className="mobile-cart-bar-container">
      <div className="mobile-cart-bar">
        <div className="mobile-cart-info">
          <div className="mobile-cart-badge">
            <ShoppingBag size={18} />
            <span>{cartCount} {cartCount === 1 ? 'Item' : 'Items'}</span>
          </div>
          <div className="mobile-cart-total">
            {formatPrice(cartTotal)}
          </div>
        </div>

        <button className="mobile-view-cart-btn" onClick={onOpenCart} id="mobile-view-cart-btn">
          <span>VIEW CART</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
