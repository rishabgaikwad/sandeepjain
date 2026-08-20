/**
 * Sends order notification to Telegram via Vercel serverless API.
 * @param {Object} order - Canonical order object
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendOrderTelegram = async (order) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('/api/send-telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      body: JSON.stringify({ order })
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.success) {
      return {
        success: true,
        message: 'Telegram notification sent successfully.'
      };
    } else {
      return {
        success: false,
        message: data.message || `API error status ${response.status}`
      };
    }
  } catch (error) {
    console.error('Telegram notification fetch error:', error);
    return {
      success: false,
      message: error?.message || 'Failed to dispatch Telegram notification'
    };
  }
};
