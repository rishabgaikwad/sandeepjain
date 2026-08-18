import React, { useState } from 'react';
import { Plus, Check, ImageOff } from 'lucide-react';
import { formatPrice } from '../utils/priceFormatter';
import './ProductCard.css';

export default function ProductCard({ product, onAddToCart }) {
  const [imageError, setImageError] = useState(false);
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
      <div className="product-image-container">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="product-image"
          />
        ) : (
          <div className="product-image-fallback">
            <ImageOff size={32} />
            <span>Image Unavailable</span>
          </div>
        )}
        <span className="product-category-tag">{product.category}</span>
      </div>

      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-card-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
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
