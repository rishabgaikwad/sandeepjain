import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { formatPrice } from '../utils/priceFormatter';
import './ProductCard.css';

export default function ProductCard({
  product,
  cartQuantity = 0,
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity
}) {
  return (
    <div className="product-card">
      <div className="product-card-header">
        <span className="product-category-badge">
          {product.category}
          {product.subCategory ? ` • ${product.subCategory}` : ''}
        </span>
      </div>

      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        {product.description ? (
          <p className="product-description">{product.description}</p>
        ) : null}

        <div className="product-card-footer">
          <div className="price-wrapper">
            <span className="price-label">MRP</span>
            <span className="product-price">{formatPrice(product.price)}</span>
          </div>

          {cartQuantity > 0 ? (
            <div className="product-qty-control">
              <button
                className="product-qty-btn"
                onClick={() => onDecreaseQuantity(product.id)}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>

              <span className="product-qty-value">{cartQuantity}</span>

              <button
                className="product-qty-btn"
                onClick={() => onIncreaseQuantity(product.id)}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              className="add-to-cart-btn"
              onClick={() => onAddToCart(product)}
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus size={16} />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
