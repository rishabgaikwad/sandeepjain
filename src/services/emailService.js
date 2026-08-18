import emailjs from '@emailjs/browser';
import storeConfig from '../config/storeConfig';
import { formatOrderForEmail } from '../utils/orderFormatter';

/**
 * Sends order notification email via EmailJS frontend SDK.
 * @param {Object} order - Canonical order object
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendOrderEmail = async (order) => {
  const { serviceId, templateId, publicKey } = storeConfig.email;

  // Check if configuration placeholders are still present
  if (
    !serviceId ||
    !templateId ||
    !publicKey ||
    serviceId === 'YOUR_EMAILJS_SERVICE_ID' ||
    templateId === 'YOUR_EMAILJS_TEMPLATE_ID' ||
    publicKey === 'YOUR_EMAILJS_PUBLIC_KEY'
  ) {
    console.warn(
      'EmailJS is not fully configured in storeConfig.js. Skipping actual email dispatch.'
    );
    return {
      success: false,
      isConfigured: false,
      message: 'EmailJS keys are not configured in storeConfig.js.'
    };
  }

  try {
    const templateParams = formatOrderForEmail(order);
    const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);

    if (response.status === 200) {
      return {
        success: true,
        isConfigured: true,
        message: 'Order email sent successfully to store admin.'
      };
    } else {
      return {
        success: false,
        isConfigured: true,
        message: `EmailJS responded with status code ${response.status}`
      };
    }
  } catch (error) {
    console.error('EmailJS error:', error);
    return {
      success: false,
      isConfigured: true,
      message: error?.text || error?.message || 'Failed to send email through EmailJS.'
    };
  }
};
