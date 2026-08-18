import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '../utils/priceFormatter';
import './CartItem.css';

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove
}) {
  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.image} alt={item.name} onError={(e) => { e.target.style.display = 'none'; }} />
      </div>

      <div className="cart-item-details">
        <div className="cart-item-header">
          <h4 className="cart-item-name">{item.name}</h4>
          <button
            className="cart-item-remove-btn"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="cart-item-unit-price">{formatPrice(item.price)} each</div>

        <div className="cart-item-footer">
          <div className="quantity-controls">
            <button
              className="qty-btn"
              onClick={() => onDecrease(item.id)}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="qty-value">{item.quantity}</span>
            <button
              className="qty-btn"
              onClick={() => onIncrease(item.id)}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="cart-item-subtotal">
            {formatPrice(item.subtotal)}
          </div>
        </div>
      </div>
    </div>
  );
}
