import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Loader2, Trash2, Plus, Minus, ShieldCheck, ArrowLeft } from 'lucide-react';
import ProductVisual from './ProductVisual';
import { formatPrice } from '../utils/priceFormatter';
import { sendOrderEmail } from '../services/emailService';
import { sendOrderTelegram } from '../services/telegramService';
import { openWhatsAppOrder } from '../utils/whatsapp';
import storeConfig from '../config/storeConfig';
import OrderSummary from './OrderSummary';
import './CartView.css';

export default function CartView({
  cart,
  cartTotal,
  cartCount,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveFromCart,
  onClearCart,
  onNavigateToProducts
}) {
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    dealerName: '',
    note: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!customerData.name || !customerData.name.trim()) {
      newErrors.name = 'Please enter your name';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const canonicalOrder = {
      storeName: storeConfig.storeName,
      customer: {
        name: customerData.name.trim(),
        phone: customerData.phone.trim(),
        dealerName: customerData.dealerName.trim()
      },
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal
      })),
      total: cartTotal,
      note: customerData.note.trim(),
      createdAt: new Date().toISOString()
    };

    // Step 1: Concurrently dispatch Email and Telegram requests before opening WhatsApp
    const [emailPromiseResult, telegramPromiseResult] = await Promise.allSettled([
      sendOrderEmail(canonicalOrder),
      sendOrderTelegram(canonicalOrder)
    ]);

    const emailResult = emailPromiseResult.status === 'fulfilled'
      ? emailPromiseResult.value
      : { success: false, message: emailPromiseResult.reason?.message || 'Email dispatch failed' };

    const telegramResult = telegramPromiseResult.status === 'fulfilled'
      ? telegramPromiseResult.value
      : { success: false, message: telegramPromiseResult.reason?.message || 'Telegram dispatch failed' };

    // Step 2: Open WhatsApp after API requests have been dispatched
    const whatsappSuccess = openWhatsAppOrder(canonicalOrder);

    setIsSubmitting(false);

    setOrderStatus({
      order: canonicalOrder,
      emailResult,
      whatsappSuccess,
      telegramResult
    });

    // Clear the cart so the website is fresh for new orders
    onClearCart();
  };

  const handleResetOrder = () => {
    setOrderStatus(null);
    setCustomerData({ name: '', phone: '', dealerName: '', note: '' });
    setErrors({});
    onClearCart();
  };

  const handleReopenWhatsApp = (order) => {
    openWhatsAppOrder(order);
  };

  if (orderStatus) {
    return (
      <div className="cart-view-container">
        <OrderSummary
          orderStatus={orderStatus}
          onResetOrder={handleResetOrder}
          onReopenWhatsApp={handleReopenWhatsApp}
        />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-view-container">
        <div className="empty-cart-card">
          <ShoppingBag size={64} className="empty-cart-icon" />
          <h2>Your Cart is Empty</h2>
          <p>Explore our wide collection of Glen appliances and add products to your cart.</p>
          <button className="browse-btn" onClick={onNavigateToProducts}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-view-container">
      {/* Top Mobile Title Bar */}
      <div className="cart-page-header">
        <button className="back-btn" onClick={onNavigateToProducts}>
          <ArrowLeft size={20} />
          <span>Cart</span>
        </button>
        <span className="cart-count-badge">({cartCount})</span>
      </div>

      <div className="cart-split-layout">
        {/* Left Column: Cart Items List */}
        <div className="cart-items-column">
          <div className="section-card">
            <h3 className="card-heading">Your Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h3>

            <div className="cart-items-wrapper">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-visual-thumb">
                    <ProductVisual
                      category={item.category}
                      subCategory={item.subCategory}
                      productName={item.name}
                      size="small"
                    />
                  </div>

                  <div className="item-details-left">
                    <div className="item-title-line">
                      <h4 className="item-name">{item.name}</h4>
                      <button
                        className="item-remove-btn"
                        onClick={() => onRemoveFromCart(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <span className="item-qty-label">Qty: {item.quantity}</span>

                    <div className="item-price-qty-line">
                      <span className="item-subtotal-price">{formatPrice(item.subtotal)}</span>

                      <div className="item-qty-picker">
                        <button
                          className="qty-btn"
                          onClick={() => onDecreaseQuantity(item.id)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => onIncreaseQuantity(item.id)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Banner */}
          <div className="security-banner">
            <ShieldCheck size={22} className="shield-icon" />
            <div>
              <strong>Secure & Easy Ordering</strong>
              <p>Your order will be sent to us on WhatsApp for instant confirmation.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout Form */}
        <div className="cart-checkout-column">
          {/* Order Summary Box */}
          <div className="section-card">
            <h3 className="card-heading">Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal ({cartCount} items)</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>

            <div className="summary-row">
              <span>GST (0%)</span>
              <span>₹0</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping-text">Free</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row total-row">
              <span>Total Amount</span>
              <span className="total-amount-val">{formatPrice(cartTotal)}</span>
            </div>
          </div>

          {/* Customer Details Form */}
          <form className="section-card customer-details-form" onSubmit={handlePlaceOrder}>
            <h3 className="card-heading">Customer Details</h3>

            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Rishab Kumar"
                value={customerData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number (Optional)</label>
              <input
                type="tel"
                inputMode="tel"
                name="phone"
                placeholder="e.g. +91 98765 43210"
                value={customerData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Dealer Name (Optional)</label>
              <input
                type="text"
                name="dealerName"
                placeholder="e.g. Jain Traders"
                value={customerData.dealerName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Order Note / Delivery Instructions (Optional)</label>
              <textarea
                name="note"
                rows={2}
                placeholder="Any special instructions or questions..."
                value={customerData.note}
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              className="send-whatsapp-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="spinner" />
                  <span>SENDING ORDER...</span>
                </>
              ) : (
                <>
                  <span>Send Order via WhatsApp</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
