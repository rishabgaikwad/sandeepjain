import storeConfig from '../config/storeConfig';
import { formatOrderForWhatsApp } from './orderFormatter';

/**
 * Generates encoded WhatsApp link and opens it cleanly in a new target window
 * without mutating window.location.href or corrupting browser history.
 * @param {Object} order - Canonical order object
 * @returns {boolean} True if successfully attempted to open URL
 */
export const openWhatsAppOrder = (order) => {
  const rawNumber = storeConfig.whatsappNumber ? String(storeConfig.whatsappNumber).replace(/[^0-9]/g, '') : '';
  const messageText = formatOrderForWhatsApp(order);
  const encodedText = encodeURIComponent(messageText);
  const whatsappUrl = `https://wa.me/${rawNumber}?text=${encodedText}`;

  try {
    // Create ephemeral anchor element with target="_blank" to prevent tab history corruption
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    }, 100);

    return true;
  } catch (error) {
    console.error('Failed to open WhatsApp URL:', error);
    return false;
  }
};
