# Single-Page Product Catalogue (WhatsApp + EmailJS Ordering)

A production-quality, fast, responsive single-page product catalogue website built with **React**, **Vite**, and **Modern Vanilla CSS**.

Allows customers to browse products, filter by categories or search, add items to cart, enter their contact information, and place an order that is instantly sent to **Admin WhatsApp** and **Admin Email Inbox** via EmailJS.

---

## 🚀 Key Features

* **Single-Page Architecture**: Zero extra pages, zero routes. Everything happens seamlessly on the homepage.
* **Dual Order Dispatch**: Sends a pre-formatted order message to WhatsApp AND dispatches an automatic email through EmailJS.
* **No Authentication / Account Required**: Zero friction for customers.
* **Responsive Design**: Flawless experience across Mobile (320px+), Tablet, and Desktop displays.
* **Local Persistence**: Shopping cart state automatically saved to browser `localStorage`.
* **Zero Database / Server**: Pure static React app that is easy to deploy on Vercel, Netlify, or GitHub Pages.

---

## 🛠️ Setup & Configuration

### 1. Store Configuration (`src/config/storeConfig.js`)

Edit [`src/config/storeConfig.js`](file:///c:/Users/rishab/sandeepcrm/src/config/storeConfig.js) to configure store name, WhatsApp number, admin email, currency, and EmailJS credentials:

```javascript
const storeConfig = {
  storeName: "AURORA BOUTIQUE",

  // IMPORTANT: Use international number WITHOUT '+' or spaces (e.g. 919876543210)
  whatsappNumber: "919876543210",

  orderEmail: "admin@auroraboutique.com",

  currency: "₹",

  email: {
    serviceId: "YOUR_EMAILJS_SERVICE_ID",
    templateId: "YOUR_EMAILJS_TEMPLATE_ID",
    publicKey: "YOUR_EMAILJS_PUBLIC_KEY"
  }
};
```

---

### 2. Managing Products (`src/data/products.js`)

All products are defined in [`src/data/products.js`](file:///c:/Users/rishab/sandeepcrm/src/data/products.js). To add a product, simply copy an existing product object:

```javascript
{
  id: 7,
  name: "New Product Name",
  description: "Short product description",
  price: 1999, // Must be a number (NOT "₹1999")
  category: "Apparel",
  image: "/products/product-7.jpg"
}
```

---

### 3. Product Images (`public/products/`)

Store your product images inside [`public/products/`](file:///c:/Users/rishab/sandeepcrm/public/products/).

Reference them in `src/data/products.js` like:
`image: "/products/your-image.jpg"`

---

### 4. Setting Up EmailJS for Automatic Email Orders

1. Sign up for a free account at [EmailJS.com](https://www.emailjs.com/).
2. Create an **Email Service** (e.g., connected to Gmail, Outlook, or SMTP).
3. Create an **Email Template**.
4. In your Email Template settings, use these exact template variable names:
   * `{{store_name}}`
   * `{{customer_name}}`
   * `{{customer_phone}}`
   * `{{customer_email}}`
   * `{{order_items}}`
   * `{{order_total}}`
   * `{{order_note}}`
   * `{{order_date}}`
5. Copy your **Service ID**, **Template ID**, and **Public Key**.
6. Paste them into [`src/config/storeConfig.js`](file:///c:/Users/rishab/sandeepcrm/src/config/storeConfig.js).

---

## 🏃 Running Locally

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```
