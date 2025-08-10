// Product data
const products = [
  { id: 1, name: "Pink Bob", price: 800, img: "InShot_20240423_022643173.jpg" },
  { id: 2, name: "Closure", price: 1200, img: "InShot_20240423_014400710.jpg" },
  {
    id: 3,
    name: "Jet Black Full Frontal",
    price: 1500,
    img: "InShot_20240423_014400710.jpg",
  },
  {
    id: 4,
    name: "Vietnamese",
    price: 1800,
    img: "WhatsApp Video 2025-06-01 at 07.00.58_08aa6be6.mp4",
  },
  {
    id: 5,
    name: "Jerry Curls",
    price: 1000,
    img: "InShot_20240423_022643173.jpg",
  },
  {
    id: 6,
    name: "Water Weave",
    price: 1100,
    img: "InShot_20240423_022450924.jpg",
  },
  { id: 7, name: "Burgundy", price: 900, img: "InShot_20240423_022530477.jpg" },
  { id: 8, name: "Piano", price: 950, img: "InShot_20240423_022612173.jpg" },
  {
    id: 9,
    name: "T-Part Jerry Curls",
    price: 1150,
    img: "InShot_20240423_022643173.jpg",
  },
];

// Load cart or empty
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let appliedCoupon = null;

// Render products dynamically with filter
function renderProducts(filter = "") {
  const container = document.getElementById("productsContainer");
  container.innerHTML = "";
  const term = filter.toLowerCase();

  products.forEach((product) => {
    if (product.name.toLowerCase().includes(term)) {
      const card = document.createElement("div");
      card.className = "product-card";

      const media = product.img.endsWith(".mp4")
        ? `<video controls src="${product.img}"></video>`
        : `<img src="${product.img}" alt="${product.name}">`;

      card.innerHTML = `
        <h4>${product.name}</h4>
        ${media}
        <div>Price: R${product.price}</div>
        <button data-id="${product.id}">Add to Cart</button>
      `;
      container.appendChild(card);
    }
  });

  container.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.getAttribute("data-id"));
      const product = products.find((p) => p.id === id);
      addToCart(product);
    });
  });
}

// Add product to cart
function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  renderCart();
  showCartNotification(product);
}

// Save cart
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Render cart display
function renderCart() {
  const cartContainer = document.getElementById("cart-display");
  // Remove old cart items but keep header and coupon controls
  cartContainer
    .querySelectorAll(".cart-item, .cart-total")
    .forEach((el) => el.remove());

  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div>
        <strong>${item.name}</strong><br>
        Price: R${item.price}
      </div>
      <div>
        <button onclick="changeQuantity(${item.id}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity(${item.id}, 1)">+</button>
      </div>
      <div style="margin-left:15px;">R${(item.price * item.quantity).toFixed(
        2
      )}</div>
      <button onclick="removeFromCart(${
        item.id
      })" style="margin-left:10px;color:red;">X</button>
    `;
    cartContainer.insertBefore(itemDiv, document.getElementById("coupon-code"));
  });

  if (appliedCoupon === "SEGOSS10") total *= 0.9;
  if (appliedCoupon === "SEGOSS20") total *= 0.8;

  let totalDiv = document.querySelector(".cart-total");
  if (!totalDiv) {
    totalDiv = document.createElement("div");
    totalDiv.className = "cart-total";
    totalDiv.style =
      "margin-top:15px; font-weight:700; font-size:1.2em; text-align:right; color:#833471;";
    cartContainer.appendChild(totalDiv);
  }
  totalDiv.textContent = `Total: R${total.toFixed(2)}`;
}

// Change item quantity in cart
function changeQuantity(id, change) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(id);
  } else {
    saveCart();
    renderCart();
  }
}

// Remove item from cart
function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart();
  renderCart();
}

// Coupon apply button
document.getElementById("apply-coupon").addEventListener("click", () => {
  const code = document
    .getElementById("coupon-code")
    .value.trim()
    .toUpperCase();
  if (code === "SEGOSS10" || code === "SEGOSS20") {
    appliedCoupon = code;
    alert(`Coupon applied: ${code}`);
  } else {
    appliedCoupon = null;
    alert("Invalid coupon code");
  }
  renderCart();
});

// Show add-to-cart notification popup
function showCartNotification(product) {
  const notif = document.getElementById("cart-notification");
  document.getElementById("notif-img").src = product.img;
  document.getElementById(
    "notif-text"
  ).textContent = `${product.name} added to cart ✅`;
  notif.classList.add("show");
  setTimeout(() => notif.classList.remove("show"), 2000);
}

// Search input filtering
document.getElementById("searchInput").addEventListener("input", (e) => {
  renderProducts(e.target.value);
});

// Initial load
renderProducts();
renderCart();

// Expose global functions for inline event handlers in cart
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;

document.getElementById("year").textContent = new Date().getFullYear();

// Redirect to Instagram page
function goToInstagram() {
  window.location.href =
    "https://www.instagram.com/segosshair?igsh=ZHc3b2U0cDMwbTVu";
}

// Redirect to WhatsApp chat link
function goToWhatsapp() {
  window.location.href = "https://wa.me/qr/FBEPAOOALXZJJ1";
}

// Email button: open mail client with pre-filled email
document.addEventListener("DOMContentLoaded", () => {
  const emailBtn = document.getElementById("sendEmail");
  emailBtn.addEventListener("click", () => {
    const email = "Segosshair@gmail.com";
    const subject = "Segoss Hair Inquiry";
    const body = "Hello, I would like to know more about your products.";
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  });
});

