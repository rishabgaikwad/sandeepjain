import React, { useState, useEffect } from 'react';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import './FilterModal.css';

export default function FilterModal({
  isOpen,
  onClose,
  categoryStructure,
  selectedCategory,
  selectedSubCategory,
  onSelectCategory,
  onSelectSubCategory,
  sortBy,
  setSortBy,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onApplyFilters,
  onClearAll
}) {
  const [localCategory, setLocalCategory] = useState(selectedCategory);
  const [localSubCategory, setLocalSubCategory] = useState(selectedSubCategory);
  const [localSortBy, setLocalSortBy] = useState(sortBy);
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalCategory(selectedCategory);
      setLocalSubCategory(selectedSubCategory);
      setLocalSortBy(sortBy);
      setLocalMinPrice(minPrice);
      setLocalMaxPrice(maxPrice);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, selectedCategory, selectedSubCategory, sortBy, minPrice, maxPrice]);

  if (!isOpen) return null;

  // Subcategories list for currently selected category
  const currentSubcategories = localCategory !== 'All'
    ? (categoryStructure.find((c) => c.name === localCategory)?.subcategories || [])
    : [];

  const handleCategoryChange = (catName) => {
    setLocalCategory(catName);
    setLocalSubCategory(null);
  };

  const handleApply = (e) => {
    e.preventDefault();
    onSelectCategory(localCategory);
    onSelectSubCategory(localSubCategory);
    setSortBy(localSortBy);
    setMinPrice(localMinPrice);
    setMaxPrice(localMaxPrice);
    onApplyFilters();
    onClose();
  };

  const handleReset = () => {
    setLocalCategory('All');
    setLocalSubCategory(null);
    setLocalSortBy('name-asc');
    setLocalMinPrice('');
    setLocalMaxPrice('');
    onClearAll();
    onClose();
  };

  return (
    <div className="filter-modal-backdrop" onClick={onClose}>
      <div className="filter-modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="filter-modal-header">
          <div className="modal-title-row">
            <SlidersHorizontal size={20} className="modal-icon" />
            <h3>Filter Products</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close filters">
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <form className="filter-modal-body" onSubmit={handleApply}>
          {/* Main Category */}
          <div className="filter-field-group">
            <label>Category</label>
            <select
              value={localCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="modal-select"
            >
              <option value="All">All Categories</option>
              {categoryStructure.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          {currentSubcategories.length > 0 && (
            <div className="filter-field-group">
              <label>Subcategory</label>
              <select
                value={localSubCategory || ''}
                onChange={(e) => setLocalSubCategory(e.target.value ? e.target.value : null)}
                className="modal-select"
              >
                <option value="">All Subcategories</option>
                {currentSubcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort By */}
          <div className="filter-field-group">
            <label>Sort By</label>
            <select
              value={localSortBy}
              onChange={(e) => setLocalSortBy(e.target.value)}
              className="modal-select"
            >
              <option value="name-asc">Name (A - Z)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-field-group">
            <label>Price Range (₹)</label>
            <div className="modal-price-inputs">
              <input
                type="number"
                placeholder="Min Price"
                value={localMinPrice}
                onChange={(e) => setLocalMinPrice(e.target.value)}
                className="modal-price-input"
              />
              <span className="price-sep">to</span>
              <input
                type="number"
                placeholder="Max Price"
                value={localMaxPrice}
                onChange={(e) => setLocalMaxPrice(e.target.value)}
                className="modal-price-input"
              />
            </div>
          </div>
        </form>

        {/* Modal Sticky Footer */}
        <div className="filter-modal-footer">
          <button type="button" className="modal-clear-btn" onClick={handleReset}>
            <RotateCcw size={16} />
            <span>Clear All</span>
          </button>
          <button type="button" className="modal-apply-btn" onClick={handleApply}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
