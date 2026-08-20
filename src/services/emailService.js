import storeConfig from '../config/storeConfig';
import { formatOrderForEmail } from '../utils/orderFormatter';

/**
 * Sends order notification email via Resend API.
 * @param {Object} order - Canonical order object
 * @returns {Promise<{success: boolean, isConfigured: boolean, message: string}>}
 */
export const sendOrderEmail = async (order) => {
  try {
    const emailData = formatOrderForEmail(order);

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        storeConfig: {
          storeName: storeConfig.storeName,
          orderEmail: storeConfig.orderEmail
        },
        emailData
      })
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.success) {
      return {
        success: true,
        isConfigured: true,
        message: 'Order email sent successfully to store admin.'
      };
    } else {
      return {
        success: false,
        isConfigured: true,
        message: data.message || `API error code ${response.status}`
      };
    }
  } catch (error) {
    console.error('Email API error:', error);
    return {
      success: false,
      isConfigured: true,
      message: error?.message || 'Failed to send email through server API.'
    };
  }
};
