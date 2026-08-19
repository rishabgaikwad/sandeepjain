import React from 'react';
import { Plus, Minus } from 'lucide-react';
import ProductVisual from './ProductVisual';
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
      {/* Imageless Premium Product Visual Panel */}
      <ProductVisual
        category={product.category}
        subCategory={product.subCategory}
        productName={product.name}
        size="medium"
      />

      {/* Product Information & Price */}
      <div className="product-info">
        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        <div className="product-card-footer">
          <span className="product-price">{formatPrice(product.price)}</span>

          {cartQuantity > 0 ? (
            <div className="product-qty-control">
              <button
                className="qty-action-btn"
                onClick={() => onDecreaseQuantity(product.id)}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="qty-count">{cartQuantity}</span>
              <button
                className="qty-action-btn"
                onClick={() => onIncreaseQuantity(product.id)}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              className="add-btn-circle"
              onClick={() => onAddToCart(product)}
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
