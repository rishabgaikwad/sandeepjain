// =====================================================
// PRODUCT CATALOGUE DATA
// Add or edit products here easily.
// Copy an existing product object to add a new product.
// =====================================================

/*
  Product Object Fields:
  - id: Unique numeric or string identifier
  - name: Title of the product
  - description: Brief description of the product
  - price: Price as a NUMBER (e.g. 1499, NOT "₹1499")
  - category: Category name for filtering (e.g. "Apparel", "Accessories", "Footwear")
  - image: Path relative to /public (e.g. "/products/product-1.jpg") or external URL fallback
  - isFeatured: Optional boolean to highlight specific products
*/

const products = [
  {
    id: 1,
    name: "Minimalist Linen Shirt",
    description: "Crafted from 100% breathable organic linen with a modern relaxed fit.",
    price: 1899,
    category: "Apparel",
    image: "/products/product-1.jpg"
  },
  {
    id: 2,
    name: "Handcrafted Leather Tote",
    description: "Full-grain artisan leather bag with spacious interior compartment.",
    price: 3499,
    category: "Accessories",
    image: "/products/product-2.jpg"
  },
  {
    id: 3,
    name: "Classic Chronograph Watch",
    description: "Sleek stainless steel watch featuring a minimalist dial and sapphire glass.",
    price: 4999,
    category: "Accessories",
    image: "/products/product-3.jpg"
  },
  {
    id: 4,
    name: "Organic Cotton Hoodie",
    description: "Ultra-soft heavyweight fleece hoodie designed for maximum comfort.",
    price: 2499,
    category: "Apparel",
    image: "/products/product-4.jpg"
  },
  {
    id: 5,
    name: "Suede Urban Sneakers",
    description: "Versatile low-top sneakers featuring cushioned memory foam insoles.",
    price: 2999,
    category: "Footwear",
    image: "/products/product-5.jpg"
  },
  {
    id: 6,
    name: "Matte Ceramic Vase Set",
    description: "Set of two handcrafted ceramic vases for contemporary home decor.",
    price: 1299,
    category: "Home",
    image: "/products/product-6.jpg"
  }
];

export default products;
