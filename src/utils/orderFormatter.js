import storeConfig from '../config/storeConfig';
import { formatPrice } from './priceFormatter';

/**
 * Formats an order object into a WhatsApp pre-filled text message.
 * @param {Object} order - Canonical order object
 * @returns {string} Plain text formatted message for WhatsApp
 */
export const formatOrderForWhatsApp = (order) => {
  const { customer, items, total, note, storeName, createdAt } = order;
  const actualStoreName = storeName || storeConfig.storeName;

  let message = `*NEW WEBSITE ORDER*\n`;
  if (actualStoreName) {
    message += `*Store:* ${actualStoreName}\n`;
  }

  message += `\n*ITEMS:*\n`;
  items.forEach((item, index) => {
    message += `${index + 1}. *${item.name}* × ${item.quantity} - ${formatPrice(item.subtotal)}\n`;
  });

  message += `\n*Total Amount:* ${formatPrice(total)}\n\n`;

  message += `*CUSTOMER DETAILS:*\n`;
  message += `*Name: ${customer.name}*\n`;
  if (customer.phone && customer.phone.trim()) {
    message += `*Phone:* ${customer.phone.trim()}\n`;
  }
  if (customer.dealerName && customer.dealerName.trim()) {
    message += `*Dealer:* ${customer.dealerName.trim()}\n`;
  }
  if (customer.email && customer.email.trim()) {
    message += `*Email:* ${customer.email.trim()}\n`;
  }

  if (note && note.trim()) {
    message += `\n*Order Note:*\n${note.trim()}\n`;
  }

  const orderDate = createdAt ? new Date(createdAt).toLocaleString() : new Date().toLocaleString();
  message += `\n_Date: ${orderDate}_`;

  return message;
};

/**
 * Formats an order object into template variables suitable for EmailJS.
 * @param {Object} order - Canonical order object
 * @returns {Object} EmailJS template parameters
 */
export const formatOrderForEmail = (order) => {
  const { customer, items, total, note, createdAt } = order;

  const orderItemsFormatted = items
    .map(
      (item) =>
        `${item.name}\nQuantity: ${item.quantity}\nPrice: ${formatPrice(item.price)}\nSubtotal: ${formatPrice(item.subtotal)}`
    )
    .join('\n\n-------------------------\n\n');

  return {
    store_name: storeConfig.storeName,
    customer_name: customer.name,
    customer_phone: customer.phone && customer.phone.trim() ? customer.phone.trim() : 'Not provided',
    customer_dealer: customer.dealerName && customer.dealerName.trim() ? customer.dealerName.trim() : '',
    customer_email: customer.email && customer.email.trim() ? customer.email.trim() : 'Not provided',
    order_items: orderItemsFormatted,
    order_total: formatPrice(total),
    order_note: note && note.trim() ? note.trim() : 'None',
    order_date: createdAt ? new Date(createdAt).toLocaleString() : new Date().toLocaleString(),
    to_email: storeConfig.orderEmail
  };
};
