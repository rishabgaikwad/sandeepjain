import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { formatPrice } from '../utils/priceFormatter';
import './ProductCard.css';

export default function ProductCard({ product, onAddToCart }) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

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

          <button
            className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAdded ? (
              <>
                <Check size={16} />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
