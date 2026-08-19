import React from 'react';
import ProductCard from './ProductCard';
import { SearchX, RotateCcw } from 'lucide-react';
import './ProductGrid.css';

export default function ProductGrid({
  products,
  cartMap = {},
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onResetFilters,
  hasFilters
}) {
  if (products.length === 0) {
    return (
      <div className="no-results-card">
        <SearchX size={48} className="no-results-icon" />
        <h3 className="no-results-title">No Products Found</h3>
        <p className="no-results-text">
          We couldn't find any products matching your current search or category filter.
        </p>
        {hasFilters && (
          <button className="reset-filters-btn" onClick={onResetFilters}>
            <RotateCcw size={16} />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          cartQuantity={cartMap[product.id] || 0}
          onAddToCart={onAddToCart}
          onIncreaseQuantity={onIncreaseQuantity}
          onDecreaseQuantity={onDecreaseQuantity}
        />
      ))}
    </div>
  );
}
