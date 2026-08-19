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

  // Featured Category Circle Chips matching existing catalogue main categories
  const categoryChips = [
    { name: 'Cook Tops', icon: Flame },
    { name: 'HOB', icon: Flame },
    { name: 'Cooker Hoods', icon: Wind },
    { name: 'Kitchen Sinks SS', displayName: 'Kitchen Sinks', icon: Waves },
    { name: 'Toasters', icon: Zap },
    { name: 'Air Fryer', icon: Sparkles },
    { name: 'Kettles', icon: Coffee },
    { name: 'Food Preperation', displayName: 'Food Prep', icon: Utensils },
    { name: 'Oven Toaster Griller', displayName: 'OTG', icon: Box },
    { name: 'Induction Cooker', icon: Disc },
    { name: 'Steam Cooker', icon: CloudDrizzle },
    { name: 'Water heater', displayName: 'Geysers', icon: Thermometer },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onNavigateToProducts();
    }
  };

  return (
    <div className="home-view">
      {/* Search Input Bar */}
      <form className="home-search-bar" onSubmit={handleSearchSubmit}>
        <Search size={20} className="search-bar-icon" />
        <input
          type="text"
          placeholder="Search products, categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (searchTerm.trim()) onNavigateToProducts();
          }}
        />
        {searchTerm && (
          <button type="button" className="search-go-btn" onClick={onNavigateToProducts} aria-label="Submit search">
            <ArrowRight size={16} />
          </button>
        )}
      </form>

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
          <button className="view-all-link" onClick={onNavigateToProducts}>
            View all
          </button>
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
          <button
            className="category-circle-item"
            onClick={onNavigateToProducts}
          >
            <div className="circle-icon-box more-box">
              <Grid size={20} />
            </div>
            <span className="circle-label">More</span>
          </button>
        </div>
      </div>

      {/* Top Products Horizontal Carousel */}
      <div className="home-section">
        <div className="section-header">
          <h3>Top Products</h3>
          <button className="view-all-link" onClick={onNavigateToProducts}>
            View all
          </button>
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
