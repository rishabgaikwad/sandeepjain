import storeConfig from '../config/storeConfig';
import { formatOrderForWhatsApp } from './orderFormatter';

/**
 * Generates encoded WhatsApp link and opens it in a new window/tab.
 * @param {Object} order - Canonical order object
 * @returns {boolean} True if successfully attempted to open URL
 */
export const openWhatsAppOrder = (order) => {
  const rawNumber = storeConfig.whatsappNumber ? String(storeConfig.whatsappNumber).replace(/[^0-9]/g, '') : '';
  const messageText = formatOrderForWhatsApp(order);
  const encodedText = encodeURIComponent(messageText);
  const whatsappUrl = `https://wa.me/${rawNumber}?text=${encodedText}`;

  try {
    const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Fallback for pop-up blockers: direct location change or link trigger
      window.location.href = whatsappUrl;
    }
    return true;
  } catch (error) {
    console.error('Failed to open WhatsApp URL:', error);
    return false;
  }
};
