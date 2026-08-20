export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const { storeConfig, emailData } = req.body;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [storeConfig?.orderEmail || 'billingve@gmail.com'],
        subject: `New Order from ${emailData?.customer_name || 'Customer'} - ${storeConfig?.storeName || 'Vardhaman Enterprise'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 8px;">
              New Order Received - ${storeConfig?.storeName || 'Vardhaman Enterprise'}
            </h2>
            <p><strong>Customer Name:</strong> ${emailData?.customer_name}</p>
            <p><strong>Phone Number:</strong> ${emailData?.customer_phone}</p>
            ${emailData?.customer_dealer ? `<p><strong>Dealer Name:</strong> ${emailData.customer_dealer}</p>` : ''}
            ${emailData?.order_note !== 'None' ? `<p><strong>Note:</strong> ${emailData.order_note}</p>` : ''}
            
            <h3 style="margin-top: 20px;">Order Items:</h3>
            <pre style="background: #f4f4f5; padding: 12px; border-radius: 6px; font-size: 14px; white-space: pre-wrap;">${emailData?.order_items}</pre>
            
            <h3 style="color: #10b981; font-size: 18px;">Total: ${emailData?.order_total}</h3>
            <p style="font-size: 12px; color: #71717a; margin-top: 24px;">Order Date: ${emailData?.order_date}</p>
          </div>
        `
      })
    });

    const data = await response.json();
    if (response.ok) {
      return res.status(200).json({ success: true, data });
    } else {
      return res.status(response.status).json({ success: false, message: data.message || 'Resend error' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
