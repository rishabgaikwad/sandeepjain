const storeConfig = {
  // The name of your store displayed in header, hero, and order emails/messages
  storeName: "Vardhaman Enterprise",

  // Admin WhatsApp number in international format WITHOUT '+' or spaces or dashes
  // Example: "919876543210" (NOT "+91 98765 43210")
  whatsappNumber: "918977920400",

  // Admin email address where email notifications will be sent
  orderEmail: "billingve@gmail.com",

  // Currency symbol used across the website
  currency: "₹",

  // Resend API Configuration (https://resend.com)
  resend: {
    // Verified sender email in Resend (default for testing is 'onboarding@resend.dev')
    fromEmail: "onboarding@resend.dev"
  }
};

export default storeConfig;
