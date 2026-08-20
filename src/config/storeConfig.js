const storeConfig = {
  // The name of your store displayed in header, hero, and order emails/messages
  storeName: "Vardhaman Enterprise",

  // Admin WhatsApp number in international format WITHOUT '+' or spaces or dashes
  // Example: "919876543210" (NOT "+91 98765 43210")
  whatsappNumber: "919966410033",

  // Admin email address where email notifications will be sent
  orderEmail: "rishabgaikwad2969@gmail.com",

  // Currency symbol used across the website
  currency: "₹",

  // EmailJS Configuration (Frontend Public Keys)
  // Register at https://www.emailjs.com/
  email: {
    serviceId: "YOUR_EMAILJS_SERVICE_ID",
    templateId: "YOUR_EMAILJS_TEMPLATE_ID",
    publicKey: "YOUR_EMAILJS_PUBLIC_KEY"
  }
};

export default storeConfig;
