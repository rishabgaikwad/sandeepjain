import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, RotateCcw, SearchX } from 'lucide-react';
import ProductCard from './ProductCard';
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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Subcategories list for currently selected main category
  const currentSubcategories = useMemo(() => {
    if (selectedCategory === 'All') return [];
    const found = categoryStructure.find((c) => c.name === selectedCategory);
    return found ? found.subcategories : [];
  }, [categoryStructure, selectedCategory]);

  // Apply search, category, subcategory, price range filtering
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category Filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Subcategory Filter
      if (selectedSubCategory !== null && product.subCategory !== selectedSubCategory) {
        return false;
      }
      // Price Range Filter
      if (appliedMinPrice !== null && product.price < appliedMinPrice) {
        return false;
      }
      if (appliedMaxPrice !== null && product.price > appliedMaxPrice) {
        return false;
      }
      // Search Term Filter
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
      {/* Top Search & Filter Bar */}
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
          className="mobile-filter-btn"
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        >
          <SlidersHorizontal size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="products-layout">
        {/* Left Sidebar Filter Panel */}
        <aside className={`filter-sidebar ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header">
            <h4>Filters</h4>
            {(selectedCategory !== 'All' || selectedSubCategory !== null || appliedMinPrice !== null || appliedMaxPrice !== null || searchTerm) && (
              <button className="clear-link-btn" onClick={handleClearAll}>
                Clear All
              </button>
            )}
          </div>

          {/* Category Dropdown */}
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

          {/* Sort By Dropdown */}
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

          {/* Price Range Filter */}
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

          {/* Subcategory Checkboxes (if category selected) */}
          {currentSubcategories.length > 0 && (
            <div className="filter-group">
              <label className="filter-label">Subcategories</label>
              <div className="subcategory-checkbox-list">
                <label className="checkbox-item">
                  <input
                    type="radio"
                    name="subcat"
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
                      name="subcat"
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

        {/* Right Product Grid & Results Header */}
        <main className="products-main">
          {/* Results Metadata Header */}
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
              <p>Try adjusting your search query, category, or price range filters.</p>
              <button className="reset-btn" onClick={handleClearAll}>
                <RotateCcw size={16} />
                <span>Reset Filters</span>
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
              >
                <ChevronLeft size={18} />
              </button>

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

              <button
                className="page-btn"
                disabled={safeCurrentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              >
                <ChevronRight size={18} />
              </button>

              <select
                className="per-page-select"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={12}>12 per page</option>
                <option value={20}>20 per page</option>
                <option value={36}>36 per page</option>
              </select>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
