import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import CartItem from './CartItem';
import CustomerForm from './CustomerForm';
import OrderSummary from './OrderSummary';
import { formatPrice } from '../utils/priceFormatter';
import { sendOrderEmail } from '../services/emailService';
import { openWhatsAppOrder } from '../utils/whatsapp';
import storeConfig from '../config/storeConfig';
import './CartDrawer.css';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  cartTotal,
  cartCount,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveFromCart,
  onClearCart,
  onBrowseProducts
}) {
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    note: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);

  // Close on Escape key and handle body scroll locking
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

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

    if (customerData.phone && customerData.phone.trim()) {
      // Basic international phone validation (allowing digits, spaces, plus, dashes) if provided
      const cleanPhone = customerData.phone.replace(/[^0-9+]/g, '');
      if (cleanPhone.length < 7) {
        newErrors.phone = 'Please enter a valid phone number';
      }
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

    // Generate Canonical Order Object
    const canonicalOrder = {
      storeName: storeConfig.storeName,
      customer: {
        name: customerData.name.trim(),
        phone: customerData.phone.trim(),
        email: customerData.email.trim()
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

    // Step 1: Attempt EmailJS send
    const emailResult = await sendOrderEmail(canonicalOrder);

    // Step 2: Open WhatsApp
    const whatsappSuccess = openWhatsAppOrder(canonicalOrder);

    setIsSubmitting(false);

    // Step 3: Set order success state
    setOrderStatus({
      order: canonicalOrder,
      emailResult,
      whatsappSuccess
    });
  };

  const handleResetOrder = () => {
    setOrderStatus(null);
    setCustomerData({ name: '', phone: '', email: '', note: '' });
    setErrors({});
    onClearCart();
  };

  const handleReopenWhatsApp = (order) => {
    openWhatsAppOrder(order);
  };

  if (!isOpen) return null;

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-header-title">
            <ShoppingBag size={20} />
            <span>Your Cart</span>
            {cartCount > 0 && <span className="cart-header-count">({cartCount})</span>}
          </div>
          <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="cart-drawer-body">
          {orderStatus ? (
            <OrderSummary
              orderStatus={orderStatus}
              onResetOrder={handleResetOrder}
              onReopenWhatsApp={handleReopenWhatsApp}
            />
          ) : cart.length === 0 ? (
            <div className="empty-cart-state">
              <ShoppingBag size={64} className="empty-cart-icon" />
              <h3>Your cart is empty</h3>
              <p>Add products to your cart to place an order via WhatsApp and email.</p>
              <button
                className="browse-products-btn"
                onClick={() => {
                  onClose();
                  onBrowseProducts();
                }}
              >
                Browse Products
              </button>
            </div>
          ) : (
            <>
              {/* Product List */}
              <div className="cart-items-list">
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onIncrease={onIncreaseQuantity}
                    onDecrease={onDecreaseQuantity}
                    onRemove={onRemoveFromCart}
                  />
                ))}
              </div>

              {/* Order Total Breakdown */}
              <div className="cart-subtotal-box">
                <div className="subtotal-row">
                  <span>Subtotal</span>
                  <span className="subtotal-amount">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* Customer Information Form */}
              <form id="order-form" onSubmit={handlePlaceOrder}>
                <CustomerForm
                  customerData={customerData}
                  onChange={handleInputChange}
                  errors={errors}
                />

                <div className="cart-drawer-footer-inline">
                  <button
                    type="submit"
                    className="place-order-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="spinner" />
                        <span>PLACING ORDER...</span>
                      </>
                    ) : (
                      <>
                        <span>PLACE ORDER</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
