const products = [
  {
    id: "graphic-track-set", name: "Rune Graphic Track Set", category: "sets", group: "Streetwear set",
    price: 86500, image: "assets/graphic-track-set.jpg", badge: "Statement piece",
    description: "A bold monochrome co-ord with all-over graphic detail. Style the pieces together or let each one do its own thing.", sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "colorblock-fleece", name: "Colour Story Fleece Set", category: "outerwear", group: "Layering · Cream / oxblood",
    price: 72500, image: "assets/colorblock-fleece-set.jpg", badge: "Just landed",
    description: "A soft, colour-blocked overshirt that brings a little warmth and a lot of personality to your everyday layers.", sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "heart-shirt", name: "Heart-on-Sleeve Shirt", category: "shirts", group: "Short sleeve · Cream / red",
    price: 48500, image: "assets/heart-patch-shirt-look.jpg", badge: "Good mood",
    description: "A relaxed cream shirt with playful red heart patches. Wear it open over a tee or button it up and let it lead.", sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "cord-overshirt", name: "Everyday Cord Overshirt", category: "outerwear", group: "Corduroy · 3 colours",
    price: 69500, image: "assets/cord-overshirts.jpg", badge: "Easy layer",
    description: "A clean, easy-to-layer corduroy jacket shown in a warm neutral, soft cream and inky charcoal colour story.", sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "olive-shirt", name: "Olive After Hours Set", category: "shirts", group: "Short sleeve · Olive",
    price: 63500, image: "assets/olive-shirt-look.jpg", badge: "Wear on repeat",
    description: "A soft olive short-sleeve shirt, styled with relaxed charcoal trousers and polished loafers for an easy evening fit.", sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "statement-knit", name: "Colour Pop Statement Knit", category: "knitwear", group: "Textured knit · Multi",
    price: 78500, image: "assets/color-pop-knit-look.jpg", badge: "Main character",
    description: "A fuzzy, feel-good knit with colour-block stripes that does the heavy lifting. Keep everything else relaxed.", sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "zip-sweatshirt", name: "Contrast Zip Sweatshirt", category: "knitwear", group: "Quarter zip · Forest / cream",
    price: 59500, image: "assets/zip-collar-sweatshirt.jpg", badge: "Daily rotation",
    description: "A forest-green and cream quarter-zip with a crisp contrast collar. A sporty classic with a fresh point of view.", sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "mustard-jacket", name: "Mustard Hardware Jacket", category: "outerwear", group: "Statement layer · Ochre",
    price: 92500, image: "assets/mustard-statement-jacket.jpg", badge: "One to remember",
    description: "A rich ochre statement layer with tactile detailing and standout metal hardware. Made for the one-piece outfit.", sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "utility-poncho", name: "Utility Hooded Poncho", category: "outerwear", group: "Utility · Espresso",
    price: 88500, image: "assets/utility-poncho.jpg", badge: "Off-script pick",
    description: "A sculptural hooded layer with contrast panels, practical pockets and an easy, throw-it-on shape.", sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "after-hours-set", name: "After Hours Street Set", category: "sets", group: "Streetwear · Black / yellow",
    price: 82500, image: "assets/streetwear-editorial.jpg", badge: "The night edit",
    description: "An all-black streetwear look with cargo details and a hit of bright yellow. A full look for off-duty plans.", sizes: ["S", "M", "L", "XL"]
  }
];

const fitRecipes = [
  { title: "Colour after dark", description: "A soft statement up top, easy layers below. Made for plans after six.", pieces: ["statement-knit", "cord-overshirt", "after-hours-set"] },
  { title: "Earth tones, with intent", description: "Olive and ochre bring warmth; utility details keep the whole thing relaxed.", pieces: ["olive-shirt", "mustard-jacket", "utility-poncho"] },
  { title: "Good mood uniform", description: "A heart-forward shirt, a soft layer, and one graphic piece to finish strong.", pieces: ["heart-shirt", "colorblock-fleece", "graphic-track-set"] },
  { title: "Off duty, upgraded", description: "Easy olive, a crisp collar, and corduroy texture for the in-between plans.", pieces: ["olive-shirt", "zip-sweatshirt", "cord-overshirt"] }
];

// Add your store's WhatsApp number in international format (digits only) to enable order handoff.
const STORE_WHATSAPP = "";
const money = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
const grid = document.querySelector("#product-grid");
const emptyState = document.querySelector("#empty-state");
const searchResults = document.querySelector("#search-results");
const quickView = document.querySelector("#quick-view");
const overlay = document.querySelector("#overlay");
const bagDrawer = document.querySelector("#bag-drawer");
const toast = document.querySelector("#toast");
let activeFilter = "all";
let searchTerm = "";
let sortByPrice = false;
let selectedQuickSize = "M";
let activeFitIndex = 0;
let toastTimer;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function getSaved(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

let cart = getSaved("offscript-cart", []);
let favorites = getSaved("offscript-favorites", []);

function renderProducts() {
  const query = searchTerm.trim().toLowerCase();
  let visible = products.filter((product) => {
    const matchesCategory = activeFilter === "all" || product.category === activeFilter;
    const matchesSearch = !query || `${product.name} ${product.group} ${product.description}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  if (sortByPrice) visible = [...visible].sort((a, b) => a.price - b.price);
  grid.innerHTML = visible.map((product, index) => `
    <article class="product-card" style="animation-delay:${Math.min(index * 45, 270)}ms">
      <div class="product-media" data-quick="${product.id}" tabindex="0" role="button" aria-label="View ${escapeHtml(product.name)} details">
        <img src="${product.image}" alt="${escapeHtml(product.name)} — ${escapeHtml(product.group)}" loading="lazy">
        <span class="product-badge">${escapeHtml(product.badge)}</span>
        <button class="favorite-button ${favorites.includes(product.id) ? "is-saved" : ""}" data-favorite="${product.id}" aria-label="${favorites.includes(product.id) ? "Remove" : "Save"} ${escapeHtml(product.name)} ${favorites.includes(product.id) ? "from" : "to"} favourites" aria-pressed="${favorites.includes(product.id)}">${favorites.includes(product.id) ? "♥" : "♡"}</button>
        <button class="quick-add" data-quick="${product.id}">Choose your size <span aria-hidden="true">+</span></button>
      </div>
      <div class="product-info"><div class="product-info-top"><h3>${escapeHtml(product.name)}</h3><span class="product-price">${money.format(product.price)}</span></div><p>${escapeHtml(product.group)}</p></div>
    </article>`).join("");
  emptyState.hidden = visible.length !== 0;
  grid.hidden = visible.length === 0;
  searchResults.textContent = query ? `${visible.length} ${visible.length === 1 ? "piece" : "pieces"} found for “${searchTerm.trim()}”` : "";
}

function renderFit(index, animate = false) {
  activeFitIndex = index;
  const recipe = fitRecipes[index];
  document.querySelector("#fit-number").textContent = `FIT NO. ${String(index + 1).padStart(2, "0")}`;
  document.querySelector("#fit-name").textContent = recipe.title;
  document.querySelector("#fit-description").textContent = recipe.description;
  const fitResult = document.querySelector("#fit-result");
  fitResult.classList.remove("is-shuffling");
  fitResult.innerHTML = recipe.pieces.map((id, pieceIndex) => {
    const product = products.find((item) => item.id === id);
    return `<article class="fit-card" style="animation-delay:${pieceIndex * 55}ms">
      <div class="fit-card-media"><img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy"><span class="fit-card-index">0${pieceIndex + 1} / THE FIT</span></div>
      <div class="fit-card-info"><div><p>${escapeHtml(product.group)}</p><h3>${escapeHtml(product.name)}</h3><button class="fit-card-link" data-fit-product="${product.id}">View piece <span aria-hidden="true">↗</span></button></div><span class="fit-card-price">${money.format(product.price)}</span></div>
    </article>`;
  }).join("");
  if (animate) {
    void fitResult.offsetWidth;
    fitResult.classList.add("is-shuffling");
  }
}

function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll(".filter-chip").forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  renderProducts();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function openQuickView(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  selectedQuickSize = product.sizes[0];
  document.querySelector("#quick-content").innerHTML = `
    <div class="quick-content">
      <img src="${product.image}" alt="${escapeHtml(product.name)}">
      <div class="quick-copy">
        <p class="eyebrow">OFFSCRIPT / THE EDIT</p>
        <h2 id="quick-title">${escapeHtml(product.name)}</h2>
        <p class="quick-price">${money.format(product.price)}</p>
        <p>${escapeHtml(product.description)}</p>
        <p class="size-label">Choose a size</p>
        <div class="size-options" role="group" aria-label="Choose a size">${product.sizes.map((size, index) => `<button class="size-option ${index === 0 ? "is-selected" : ""}" data-size="${size}" aria-pressed="${index === 0}">${size}</button>`).join("")}</div>
        <button class="button button-dark" data-add="${product.id}">Add to bag <span aria-hidden="true">↗</span></button>
      </div>
    </div>`;
  quickView.showModal();
}

function saveCart() {
  try { localStorage.setItem("offscript-cart", JSON.stringify(cart)); } catch { /* Storage is optional for this demo. */ }
  renderBag();
}

function addToBag(id, size) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  const existing = cart.find((line) => line.id === id && line.size === size);
  if (existing) existing.quantity += 1;
  else cart.push({ id, size, quantity: 1 });
  saveCart();
  quickView.close();
  showToast(`${product.name} · ${size} added to your bag`);
  setTimeout(openBag, 250);
}

function renderBag() {
  const validCart = cart.filter((line) => products.some((product) => product.id === line.id));
  if (validCart.length !== cart.length) cart = validCart;
  const quantity = cart.reduce((sum, line) => sum + line.quantity, 0);
  const total = cart.reduce((sum, line) => sum + products.find((product) => product.id === line.id).price * line.quantity, 0);
  document.querySelector("#bag-count").textContent = quantity;
  document.querySelector("#open-bag").setAttribute("aria-label", `Open shopping bag with ${quantity} ${quantity === 1 ? "item" : "items"}`);
  document.querySelector("#drawer-count").textContent = `(${quantity})`;
  document.querySelector("#bag-subtotal").textContent = money.format(total);
  document.querySelector("#bag-empty").hidden = quantity > 0;
  document.querySelector("#drawer-footer").hidden = quantity === 0;
  document.querySelector("#bag-items").innerHTML = cart.map((line) => {
    const product = products.find((item) => item.id === line.id);
    return `<div class="bag-line"><img src="${product.image}" alt=""><div><h3>${escapeHtml(product.name)}</h3><p>Size ${escapeHtml(line.size)} · Qty ${line.quantity}</p><strong>${money.format(product.price * line.quantity)}</strong></div><button data-remove="${line.id}" data-size="${escapeHtml(line.size)}" aria-label="Remove ${escapeHtml(product.name)} size ${escapeHtml(line.size)} from bag">×</button></div>`;
  }).join("");
  document.querySelector("#checkout-hint").textContent = "";
  try { localStorage.setItem("offscript-cart", JSON.stringify(cart)); } catch { /* Storage is optional for this demo. */ }
}

function openBag() {
  overlay.hidden = false;
  bagDrawer.inert = false;
  bagDrawer.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => bagDrawer.classList.add("is-open"));
  document.body.classList.add("is-locked");
  bagDrawer.querySelector("[data-close]").focus();
}

function closeBag() {
  bagDrawer.classList.remove("is-open");
  bagDrawer.setAttribute("aria-hidden", "true");
  bagDrawer.inert = true;
  document.body.classList.remove("is-locked");
  setTimeout(() => {
    if (!quickView.open) overlay.hidden = true;
  }, 320);
}

function closeEverything() {
  if (quickView.open) quickView.close();
  if (!bagDrawer.inert) closeBag();
  else overlay.hidden = true;
}

document.querySelectorAll(".filter-chip").forEach((button) => button.addEventListener("click", () => setFilter(button.dataset.filter)));
grid.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) {
    event.stopPropagation();
    const id = favoriteButton.dataset.favorite;
    favorites = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    try { localStorage.setItem("offscript-favorites", JSON.stringify(favorites)); } catch { /* Storage is optional for this demo. */ }
    renderProducts();
    return;
  }
  const quick = event.target.closest("[data-quick]");
  if (quick) openQuickView(quick.dataset.quick);
});
grid.addEventListener("keydown", (event) => {
  const card = event.target.closest("[data-quick]");
  if (card && (event.key === "Enter" || event.key === " ") && event.target === card) {
    event.preventDefault();
    openQuickView(card.dataset.quick);
  }
});
document.querySelector("#quick-content").addEventListener("click", (event) => {
  const sizeButton = event.target.closest("[data-size]");
  if (sizeButton) {
    selectedQuickSize = sizeButton.dataset.size;
    document.querySelectorAll(".size-option").forEach((button) => {
      const selected = button === sizeButton;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }
  const addButton = event.target.closest("[data-add]");
  if (addButton) addToBag(addButton.dataset.add, selectedQuickSize);
});
document.querySelector(".modal-close").addEventListener("click", () => quickView.close());
quickView.addEventListener("click", (event) => { if (event.target === quickView) quickView.close(); });
quickView.addEventListener("close", () => { if (bagDrawer.inert) overlay.hidden = true; document.body.classList.remove("is-locked"); });
document.querySelector("#open-bag").addEventListener("click", openBag);
document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", closeBag));
overlay.addEventListener("click", closeEverything);
document.querySelector("#bag-items").addEventListener("click", (event) => {
  const remove = event.target.closest("[data-remove]");
  if (!remove) return;
  cart = cart.filter((line) => !(line.id === remove.dataset.remove && line.size === remove.dataset.size));
  saveCart();
});
document.querySelector("#checkout-button").addEventListener("click", () => {
  const hint = document.querySelector("#checkout-hint");
  if (!STORE_WHATSAPP) {
    hint.textContent = "To take orders, add your store WhatsApp number in script.js (international digits only).";
    return;
  }
  const orderLines = cart.map((line) => {
    const product = products.find((item) => item.id === line.id);
    return `• ${product.name} — size ${line.size} × ${line.quantity} (${money.format(product.price * line.quantity)})`;
  });
  const total = cart.reduce((sum, line) => sum + products.find((product) => product.id === line.id).price * line.quantity, 0);
  const message = `Hi Offscript! I'd like to place an order:\n${orderLines.join("\n")}\n\nSubtotal: ${money.format(total)}`;
  window.open(`https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});

const searchPanel = document.querySelector("#search-panel");
const searchInput = document.querySelector("#product-search");
document.querySelector(".search-toggle").addEventListener("click", () => {
  searchPanel.hidden = !searchPanel.hidden;
  if (!searchPanel.hidden) searchInput.focus();
});
searchInput.addEventListener("input", () => { searchTerm = searchInput.value; renderProducts(); });
document.querySelector("#clear-search").addEventListener("click", () => { searchInput.value = ""; searchTerm = ""; renderProducts(); searchInput.focus(); });
document.querySelector("#sort-button").addEventListener("click", (event) => {
  sortByPrice = !sortByPrice;
  event.currentTarget.innerHTML = sortByPrice ? 'PRICE: LOW TO HIGH <span aria-hidden="true">↑</span>' : 'SORT <span aria-hidden="true">↕</span>';
  renderProducts();
});
document.querySelector("#reset-filters").addEventListener("click", () => {
  searchInput.value = "";
  searchTerm = "";
  setFilter("all");
});

document.querySelectorAll(".look-shop").forEach((button) => button.addEventListener("click", () => {
  const ids = { olive: "olive-shirt", heart: "heart-shirt", street: "after-hours-set" };
  openQuickView(ids[button.dataset.look]);
}));
document.querySelector("#shuffle-fit").addEventListener("click", () => {
  let nextIndex = activeFitIndex;
  while (nextIndex === activeFitIndex) nextIndex = Math.floor(Math.random() * fitRecipes.length);
  renderFit(nextIndex, true);
});
document.querySelector("#fit-result").addEventListener("click", (event) => {
  const button = event.target.closest("[data-fit-product]");
  if (button) openQuickView(button.dataset.fitProduct);
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  nav.classList.toggle("is-open", !isOpen);
});
nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  nav.classList.remove("is-open");
}));

document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#newsletter-email");
  document.querySelector("#form-message").textContent = `Thanks for signing up, ${email.value}! ✳`;
  email.value = "";
});
document.querySelector("#year").textContent = new Date().getFullYear();
renderProducts();
renderFit(0);
renderBag();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));
} else {
  document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !bagDrawer.inert) closeBag();
});
