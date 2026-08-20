import React from 'react';
import { Search, Flame, Wind, Waves, Sparkles, Zap, Coffee, CloudDrizzle, Disc, Utensils, Box, Thermometer, Grid, ShieldCheck, Truck, Award, ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import './HomeView.css';

export default function HomeView({
  products,
  categoryStructure,
  cartMap,
  onAddToCart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onNavigateToProducts,
  onSelectCategory,
  searchTerm,
  setSearchTerm
}) {
  // Top 6 featured products for Home showcase carousel
  const topProducts = products.slice(0, 6);

  // Complete list of categories from CATEGORY_STRUCTURE
  const categoryChips = [
    { name: 'Kitchen Sinks SS', displayName: 'Kitchen Sinks', icon: Waves },
    { name: 'Cook Tops', icon: Flame },
    { name: 'HOB', icon: Flame },
    { name: 'Cooker Hoods', icon: Wind },
    { name: 'Toasters', icon: Zap },
    { name: 'Air Fryer', icon: Sparkles },
    { name: 'Steam Cooker', icon: CloudDrizzle },
    { name: 'Induction Cooker', icon: Disc },
    { name: 'Food Preperation', displayName: 'Food Prep', icon: Utensils },
    { name: 'Oven Toaster Griller', displayName: 'OTG', icon: Box },
    { name: 'Tandoor', icon: Flame },
    { name: 'Kettles', icon: Coffee },
    { name: 'Easyclean & Island Chimney', displayName: 'Island Chimney', icon: Wind },
    { name: 'Auto Clean Chimney', displayName: 'Auto Clean', icon: Wind },
    { name: 'CR & Built-In Appliances', displayName: 'Built-In Apps', icon: Box },
    { name: 'Water heater', displayName: 'Geysers', icon: Thermometer },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onNavigateToProducts();
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSelectSearchResult = (product) => {
    setSearchTerm(product.name);
    onNavigateToProducts();
  };

  // Live matching products for dropdown auto-search
  const searchResults = React.useMemo(() => {
    if (!searchTerm.trim()) return [];
    const query = searchTerm.toLowerCase().trim();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(query))
      )
      .slice(0, 6);
  }, [products, searchTerm]);

  return (
    <div className="home-view">
      {/* Search Input Bar with Live Auto-Search Suggestions */}
      <div className="home-search-container">
        <form className="home-search-bar" onSubmit={handleSearchSubmit}>
          <Search size={20} className="search-bar-icon" />
          <input
            type="text"
            placeholder="Search products, categories..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button type="button" className="search-go-btn" onClick={onNavigateToProducts} aria-label="Submit search">
              <ArrowRight size={16} />
            </button>
          )}
        </form>

        {/* Live Auto-Search Suggestions Dropdown */}
        {searchTerm.trim() !== '' && (
          <div className="search-suggestions-dropdown">
            {searchResults.length > 0 ? (
              <>
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    className="suggestion-item"
                    onClick={() => handleSelectSearchResult(product)}
                  >
                    <Search size={14} className="suggestion-icon" />
                    <div className="suggestion-text">
                      <span className="suggestion-name">{product.name}</span>
                      <span className="suggestion-category">{product.category}</span>
                    </div>
                  </button>
                ))}
                <button className="view-all-results-btn" onClick={onNavigateToProducts}>
                  <span>See all results for "{searchTerm}"</span>
                  <ArrowRight size={14} />
                </button>
              </>
            ) : (
              <div className="no-suggestions-item">
                No products found matching "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Compact Premium Imageless Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Premium Kitchen Appliances<br />Built for Performance</h2>
          <button className="shop-now-btn" onClick={onNavigateToProducts}>
            Shop Now
          </button>
        </div>
        <div className="hero-graphic">
          <Flame size={64} className="hero-flame-icon" />
        </div>
      </div>

      {/* Shop by Category Section */}
      <div className="home-section">
        <div className="section-header">
          <h3>Shop by Category</h3>
        </div>

        <div className="category-circle-row">
          {categoryChips.map((chip) => {
            const Icon = chip.icon;
            return (
              <button
                key={chip.name}
                className="category-circle-item"
                onClick={() => {
                  onSelectCategory(chip.name);
                  onNavigateToProducts();
                }}
              >
                <div className="circle-icon-box">
                  <Icon size={22} />
                </div>
                <span className="circle-label">{chip.displayName || chip.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Products Horizontal Carousel */}
      <div className="home-section">
        <div className="section-header">
          <h3>Top Products</h3>
        </div>

        <div className="top-products-carousel-wrapper">
          <div className="top-products-carousel">
            {topProducts.map((product) => (
              <div key={product.id} className="carousel-card-item">
                <ProductCard
                  product={product}
                  cartQuantity={cartMap[product.id] || 0}
                  onAddToCart={onAddToCart}
                  onIncreaseQuantity={onIncreaseQuantity}
                  onDecreaseQuantity={onDecreaseQuantity}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Badges Footer Row */}
      <div className="trust-badges-row">
        <div className="trust-badge-item">
          <Award size={18} className="trust-icon" />
          <span>Best Quality</span>
        </div>
        <div className="trust-badge-item">
          <Truck size={18} className="trust-icon" />
          <span>Fast Delivery</span>
        </div>
        <div className="trust-badge-item">
          <ShieldCheck size={18} className="trust-icon" />
          <span>Trusted by Dealers</span>
        </div>
      </div>
    </div>
  );
}
