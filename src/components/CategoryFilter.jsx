import React from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import './CategoryFilter.css';

export default function CategoryFilter({
  categoryStructure = [],
  selectedCategory,
  selectedSubCategory,
  onSelectCategory,
  onSelectSubCategory
}) {
  // Find current active main category object
  const activeMainCatObj = categoryStructure.find(
    (cat) => cat.name === selectedCategory
  );

  const activeSubcategories = activeMainCatObj?.subcategories || [];

  return (
    <div className="category-filter-container">
      {/* Line 1: Main Category Selection */}
      <div className="filter-select-group">
        <label htmlFor="main-category-select" className="filter-label">
          <Filter size={14} />
          <span>Category</span>
        </label>

        <div className="select-wrapper">
          <select
            id="main-category-select"
            className="filter-select main-select"
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
          >
            <option value="All">All Products</option>
            {categoryStructure.map((catObj) => (
              <option key={catObj.name} value={catObj.name}>
                {catObj.name}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="select-icon" />
        </div>
      </div>

      {/* Line 2: Subcategory Selection (Only shown when a Main Category with subcategories is active) */}
      {selectedCategory !== 'All' && activeSubcategories.length > 0 && (
        <div className="filter-select-group sub-group">
          <label htmlFor="sub-category-select" className="filter-label sub-label">
            <span>Subcategory</span>
          </label>

          <div className="select-wrapper">
            <select
              id="sub-category-select"
              className="filter-select sub-select"
              value={selectedSubCategory || 'ALL_SUB'}
              onChange={(e) => {
                const val = e.target.value;
                onSelectSubCategory(val === 'ALL_SUB' ? null : val);
              }}
            >
              <option value="ALL_SUB">All {selectedCategory} ({activeSubcategories.length} subcategories)</option>
              {activeSubcategories.map((subName) => (
                <option key={subName} value={subName}>
                  {subName}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>
        </div>
      )}
    </div>
  );
}
