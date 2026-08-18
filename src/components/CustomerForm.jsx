import React from 'react';
import { User, Phone, Mail, FileText, AlertCircle } from 'lucide-react';
import './CustomerForm.css';

export default function CustomerForm({
  customerData,
  onChange,
  errors
}) {
  return (
    <div className="customer-form-section">
      <h3 className="form-section-title">Customer Information</h3>

      {/* Name Field */}
      <div className="form-group">
        <label htmlFor="customer-name">
          <User size={14} />
          <span>Full Name *</span>
        </label>
        <input
          type="text"
          id="customer-name"
          name="name"
          placeholder="e.g. Rishab Kumar"
          value={customerData.name}
          onChange={onChange}
          className={errors.name ? 'input-error' : ''}
        />
        {errors.name && (
          <span className="field-error-msg">
            <AlertCircle size={12} />
            {errors.name}
          </span>
        )}
      </div>

      {/* Phone Field */}
      <div className="form-group">
        <label htmlFor="customer-phone">
          <Phone size={14} />
          <span>Phone Number (WhatsApp) (Optional)</span>
        </label>
        <input
          type="tel"
          id="customer-phone"
          name="phone"
          placeholder="e.g. +91 98765 43210"
          value={customerData.phone}
          onChange={onChange}
          className={errors.phone ? 'input-error' : ''}
        />
        {errors.phone && (
          <span className="field-error-msg">
            <AlertCircle size={12} />
            {errors.phone}
          </span>
        )}
      </div>

      {/* Email Field */}
      <div className="form-group">
        <label htmlFor="customer-email">
          <Mail size={14} />
          <span>Email Address (Optional)</span>
        </label>
        <input
          type="email"
          id="customer-email"
          name="email"
          placeholder="e.g. customer@example.com"
          value={customerData.email}
          onChange={onChange}
        />
      </div>

      {/* Note Field */}
      <div className="form-group">
        <label htmlFor="customer-note">
          <FileText size={14} />
          <span>Order Note / Delivery Instructions (Optional)</span>
        </label>
        <textarea
          id="customer-note"
          name="note"
          rows={3}
          placeholder="Any special instructions or questions..."
          value={customerData.note}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
