export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('Telegram notifications skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured.');
    return res.status(200).json({
      success: false,
      message: 'Telegram credentials are not configured in environment variables.'
    });
  }

  const { order } = req.body || {};

  if (!order || !order.customer || !Array.isArray(order.items)) {
    return res.status(400).json({ success: false, message: 'Invalid order payload' });
  }

  try {
    const { customer, items, total, note, storeName, createdAt } = order;

    let itemsList = items
      .map((item, index) => `${index + 1}. <b>${escapeHtml(item.name)}</b> × ${item.quantity} - ₹${item.subtotal}`)
      .join('\n');

    let text = `<b>NEW WEBSITE ORDER</b>\n`;
    if (storeName) {
      text += `<b>Store:</b> ${escapeHtml(storeName)}\n`;
    }
    text += `\n<b>ITEMS:</b>\n${itemsList}\n\n`;
    text += `<b>Total Amount:</b> ₹${total}\n\n`;
    text += `<b>CUSTOMER DETAILS:</b>\n`;
    text += `<b>Name:</b> ${escapeHtml(customer.name)}\n`;
    if (customer.phone && customer.phone.trim()) {
      text += `<b>Phone:</b> ${escapeHtml(customer.phone.trim())}\n`;
    }
    if (customer.dealerName && customer.dealerName.trim()) {
      text += `<b>Dealer:</b> ${escapeHtml(customer.dealerName.trim())}\n`;
    }
    if (customer.email && customer.email.trim()) {
      text += `<b>Email:</b> ${escapeHtml(customer.email.trim())}\n`;
    }
    if (note && note.trim()) {
      text += `\n<b>Order Note:</b>\n${escapeHtml(note.trim())}\n`;
    }
    text += `\n<i>Date: ${escapeHtml(createdAt ? new Date(createdAt).toLocaleString() : new Date().toLocaleString())}</i>`;

    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.ok) {
      return res.status(200).json({ success: true, message: 'Telegram notification sent successfully' });
    } else {
      console.error('Telegram API error:', data.description || 'Unknown error');
      return res.status(200).json({
        success: false,
        message: data.description || 'Failed to dispatch Telegram message'
      });
    }
  } catch (error) {
    console.error('Telegram serverless handler error:', error.message);
    return res.status(200).json({
      success: false,
      message: 'Server error processing Telegram notification'
    });
  }
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
