import React from 'react';
import {
  Flame,
  Wind,
  Waves,
  Sparkles,
  Zap,
  Coffee,
  CloudDrizzle,
  Disc,
  Utensils,
  Box,
  Thermometer,
  Layers
} from 'lucide-react';
import './ProductVisual.css';

export default function ProductVisual({ category = '', subCategory = '', productName = '', size = 'medium' }) {
  // Select specific icon based on category/name
  const getCategoryIcon = () => {
    const cat = (category + ' ' + subCategory + ' ' + productName).toLowerCase();

    if (cat.includes('cook top') || cat.includes('hob') || cat.includes('stove')) {
      return <Flame size={size === 'small' ? 20 : size === 'large' ? 44 : 32} className="visual-icon" />;
    }
    if (cat.includes('chimney') || cat.includes('hood')) {
      return <Wind size={size === 'small' ? 20 : size === 'large' ? 44 : 32} className="visual-icon" />;
    }
    if (cat.includes('sink')) {
      return <Waves size={size === 'small' ? 20 : size === 'large' ? 44 : 32} className="visual-icon" />;
    }
    if (cat.includes('toaster') || cat.includes('sandwich')) {
      return <Zap size={size === 'small' ? 20 : size === 'large' ? 44 : 32} className="visual-icon" />;
    }
    if (cat.includes('kettle') || cat.includes('tea') || cat.includes('coffee')) {
      return <Coffee size={size === 'small' ? 20 : size === 'large' ? 44 : 32} className="visual-icon" />;
    }
    if (cat.includes('air fryer') || cat.includes('fryer')) {
      return <Sparkles size={size === 'small' ? 20 : size === 'large' ? 44 : 32} className="visual-icon" />;
    }
    if (cat.includes('steam')) {
      return <CloudDrizzle size={size === 'small' ? 20 : size === 'large' ? 44 : 32} className="visual-icon" />;
    }
    if (cat.includes('induction')) {
      return <Disc size={size === 'small' ? 20 : size === 'large' ? 44 : 32} className="visual-icon" />;
    }
    if (cat.includes('food') || cat.includes('preperation') || cat.includes('chopper')) {
      return <Utensils size={size === 'small' ? 20 : size === 'large' ? 44 : 32} className="visual-icon" />;
    }
    if (cat.includes('oven') || cat.includes('otg') || cat.includes('griller') || cat.includes('tandoor')) {
      return <Box size={size === 'small' ? 20 : size === 'large' ? 44 : 32} className="visual-icon" />;
    }
    if (cat.includes('water heater') || cat.includes('geyser')) {
      return <Thermometer size={size === 'small' ? 20 : size === 'large' ? 44 : 32} className="visual-icon" />;
    }
    return <Layers size={size === 'small' ? 20 : size === 'large' ? 44 : 32} className="visual-icon" />;
  };

  return (
    <div className={`product-visual-panel visual-size-${size}`}>
      <div className="visual-pattern-bg"></div>
      <div className="visual-content">
        <div className="visual-icon-box">
          {getCategoryIcon()}
        </div>
        <span className="visual-brand-tag">GLEN MODEL</span>
      </div>
    </div>
  );
}
