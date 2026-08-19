import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, RotateCcw, SearchX } from 'lucide-react';
import ProductCard from './ProductCard';
import FilterModal from './FilterModal';
import './ProductsView.css';

export default function ProductsView({
  products,
  categoryStructure,
  selectedCategory,
  selectedSubCategory,
  onSelectCategory,
  onSelectSubCategory,
  cartMap,
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  searchTerm,
  setSearchTerm,
  onResetFilters
}) {
  const [sortBy, setSortBy] = useState('name-asc');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [appliedMinPrice, setAppliedMinPrice] = useState(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Subcategories list for currently selected main category
  const currentSubcategories = useMemo(() => {
    if (selectedCategory === 'All') return [];
    const found = categoryStructure.find((c) => c.name === selectedCategory);
    return found ? found.subcategories : [];
  }, [categoryStructure, selectedCategory]);

  // Calculate count of active filters for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (selectedSubCategory !== null) count++;
    if (appliedMinPrice !== null || appliedMaxPrice !== null) count++;
    return count;
  }, [selectedCategory, selectedSubCategory, appliedMinPrice, appliedMaxPrice]);

  // Apply filtering
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      if (selectedSubCategory !== null && product.subCategory !== selectedSubCategory) {
        return false;
      }
      if (appliedMinPrice !== null && product.price < appliedMinPrice) {
        return false;
      }
      if (appliedMaxPrice !== null && product.price > appliedMaxPrice) {
        return false;
      }
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesSubCategory = (product.subCategory || '').toLowerCase().includes(query);
        const matchesId = product.id.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesSubCategory && !matchesId) {
          return false;
        }
      }
      return true;
    });
  }, [products, selectedCategory, selectedSubCategory, appliedMinPrice, appliedMaxPrice, searchTerm]);

  // Apply sorting
  const sortedProducts = useMemo(() => {
    const copy = [...filteredProducts];
    if (sortBy === 'price-asc') {
      copy.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      copy.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      copy.sort((a, b) => a.name.localeCompare(b.name));
    }
    return copy;
  }, [filteredProducts, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedProducts, safeCurrentPage, itemsPerPage]);

  const startItemNum = sortedProducts.length === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1;
  const endItemNum = Math.min(safeCurrentPage * itemsPerPage, sortedProducts.length);

  const handleApplyPrice = (e) => {
    e.preventDefault();
    setAppliedMinPrice(minPrice !== '' ? Number(minPrice) : null);
    setAppliedMaxPrice(maxPrice !== '' ? Number(maxPrice) : null);
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    onResetFilters();
    setMinPrice('');
    setMaxPrice('');
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
    setSortBy('name-asc');
    setCurrentPage(1);
  };

  return (
    <div className="products-view">
      {/* Top Search & Mobile Action Bar */}
      <div className="products-search-bar">
        <div className="products-search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search products by name, code, category..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <button
          className="mobile-filter-trigger-btn"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <SlidersHorizontal size={18} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="filter-count-badge">({activeFilterCount})</span>
          )}
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="products-layout">
        {/* Desktop Left Sidebar Filter Panel */}
        <aside className="desktop-filter-sidebar">
          <div className="sidebar-header">
            <h4>Filters</h4>
            {activeFilterCount > 0 && (
              <button className="clear-link-btn" onClick={handleClearAll}>
                Clear All
              </button>
            )}
          </div>

          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                onSelectCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="filter-select"
            >
              <option value="All">All Categories</option>
              {categoryStructure.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name-asc">Name (A - Z)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          <form className="filter-group" onSubmit={handleApplyPrice}>
            <label className="filter-label">Price Range</label>
            <div className="price-inputs-row">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="price-input"
              />
              <span className="to-span">to</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="price-input"
              />
            </div>
            <button type="submit" className="apply-price-btn">
              Apply Price
            </button>
          </form>

          {currentSubcategories.length > 0 && (
            <div className="filter-group">
              <label className="filter-label">Subcategories</label>
              <div className="subcategory-checkbox-list">
                <label className="checkbox-item">
                  <input
                    type="radio"
                    name="subcat-desktop"
                    checked={selectedSubCategory === null}
                    onChange={() => {
                      onSelectSubCategory(null);
                      setCurrentPage(1);
                    }}
                  />
                  <span>All Subcategories</span>
                </label>
                {currentSubcategories.map((sub) => (
                  <label key={sub} className="checkbox-item">
                    <input
                      type="radio"
                      name="subcat-desktop"
                      checked={selectedSubCategory === sub}
                      onChange={() => {
                        onSelectSubCategory(sub);
                        setCurrentPage(1);
                      }}
                    />
                    <span>{sub}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Right Main Product Area */}
        <main className="products-main">
          {/* Results Count Header */}
          <div className="results-header">
            <span className="results-count-text">
              Showing <strong>{startItemNum} - {endItemNum}</strong> of <strong>{sortedProducts.length}</strong> products
            </span>
          </div>

          {/* Product Grid */}
          {paginatedProducts.length === 0 ? (
            <div className="no-products-found">
              <SearchX size={48} className="no-icon" />
              <h3>No Products Found</h3>
              <p>Try changing your search query, category, or price range filters.</p>
              <button className="reset-btn" onClick={handleClearAll}>
                <RotateCcw size={16} />
                <span>Clear Filters</span>
              </button>
            </div>
          ) : (
            <div className="catalog-product-grid">
              {paginatedProducts.map((product) => (
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
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <button
                className="page-btn"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                aria-label="Previous Page"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Desktop Pagination Page Numbers */}
              <div className="desktop-page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - safeCurrentPage) <= 1)
                  .map((page, index, arr) => {
                    const prevPage = arr[index - 1];
                    const hasGap = prevPage && page - prevPage > 1;

                    return (
                      <React.Fragment key={page}>
                        {hasGap && <span className="pagination-gap">...</span>}
                        <button
                          className={`page-number-btn ${safeCurrentPage === page ? 'active' : ''}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              {/* Mobile Compact Page Indicator < 1 / 31 > */}
              <div className="mobile-page-indicator">
                <span><strong>{safeCurrentPage}</strong> / {totalPages}</span>
              </div>

              <button
                className="page-btn"
                disabled={safeCurrentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                aria-label="Next Page"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Sheet Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        categoryStructure={categoryStructure}
        selectedCategory={selectedCategory}
        selectedSubCategory={selectedSubCategory}
        onSelectCategory={onSelectCategory}
        onSelectSubCategory={onSelectSubCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        onApplyFilters={() => setCurrentPage(1)}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
