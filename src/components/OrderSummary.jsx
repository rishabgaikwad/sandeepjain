import React from 'react';
import { CheckCircle2, MessageSquare, Mail, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import { formatPrice } from '../utils/priceFormatter';
import './OrderSummary.css';

export default function OrderSummary({
  orderStatus,
  onResetOrder,
  onReopenWhatsApp
}) {
  const { order, emailResult, whatsappSuccess } = orderStatus;

  return (
    <div className="order-summary-container">
      <div className="order-status-badge">
        <CheckCircle2 size={44} className="success-icon" />
        <h3 className="order-status-title">ORDER READY</h3>
        <p className="order-status-subtitle">
          Your order has been prepared successfully.
        </p>
      </div>

      <div className="status-checklist">
        {/* Email Status */}
        <div className={`status-checklist-item ${emailResult?.success ? 'success' : 'warning'}`}>
          <div className="status-item-icon">
            <Mail size={18} />
          </div>
          <div className="status-item-info">
            <span className="status-item-label">Admin Email Notification</span>
            <span className="status-item-text">
              {emailResult?.success ? (
                '✓ Order sent automatically to store email'
              ) : emailResult?.isConfigured === false ? (
                'ℹ Demo Mode: EmailJS keys pending setup in storeConfig.js'
              ) : (
                `⚠️ Email failed: ${emailResult?.message || 'Check connection'}`
              )}
            </span>
          </div>
        </div>

        {/* WhatsApp Status */}
        <div className={`status-checklist-item ${whatsappSuccess ? 'success' : 'warning'}`}>
          <div className="status-item-icon">
            <MessageSquare size={18} />
          </div>
          <div className="status-item-info">
            <span className="status-item-label">WhatsApp Order Message</span>
            <span className="status-item-text">
              {whatsappSuccess
                ? '✓ WhatsApp order prepared and opened'
                : '⚠️ Could not open WhatsApp automatically'}
            </span>
          </div>
        </div>
      </div>

      <div className="whatsapp-instruction-box">
        <p>
          <strong>Important:</strong> Please send the pre-filled WhatsApp message in your chat app to complete your order inquiry with our admin.
        </p>
        <button className="reopen-whatsapp-btn" onClick={() => onReopenWhatsApp(order)}>
          <MessageSquare size={16} />
          <span>Open WhatsApp Again</span>
        </button>
      </div>

      {/* Brief Order Details Preview */}
      {order && (
        <div className="order-details-preview">
          <h4 className="preview-heading">Order Preview</h4>
          <div className="preview-row">
            <span>Customer:</span>
            <strong>{order.customer.name}</strong>
          </div>
          <div className="preview-row">
            <span>Phone:</span>
            <strong>{order.customer.phone}</strong>
          </div>
          <div className="preview-row">
            <span>Items:</span>
            <strong>{order.items.length} product(s)</strong>
          </div>
          <div className="preview-row total">
            <span>Total:</span>
            <strong>{formatPrice(order.total)}</strong>
          </div>
        </div>
      )}

      <div className="order-summary-actions">
        <button className="start-new-order-btn" onClick={onResetOrder}>
          <RefreshCw size={16} />
          <span>Start New Order</span>
        </button>
      </div>
    </div>
  );
}
