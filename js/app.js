const wrapperEl = document.querySelector(".wrapper");
const countEl = document.querySelector(".count");
const searchInput = document.querySelector("#qidiruv");

// let allProducts = [];

    fetch('https://jsonbek.uz/api/products')
  .then(response => response.json())
  .then(json =>  UpdateUi(json))
  .catch((error) => {
    console.log(error);
  });

searchInput.addEventListener("input", (e) => {
  const searchText = e.target.value.toLowerCase();
  const filteredProducts = allProducts.filter(prod => 
    prod.title.toLowerCase().includes(searchText)
  );
  UpdateUi(filteredProducts);
});

window.countSavet = function() {
  let count = Number(countEl.textContent);
  countEl.textContent = count + 1;
};

function UpdateUi(arr) {
  wrapperEl.innerHTML = "";

  arr.forEach(prod => {
    wrapperEl.innerHTML += `
     <div class="product-card">
      <div class="card-badges">
        <span class="badge available">${prod.available ? "Mavjud" : "Qolmagan"}</span>
        <span class="badge rating">★ ${prod.rate}/10</span>
      </div>

      <div class="card-image">
        <img src="${prod.image}" alt="${prod.title}">
      </div>

      <div class="card-content">
        <div class="card-meta">
          <span class="origin">📍 ${prod.origin}</span>
          <span class="product-id">ID: ${prod.id}</span>
        </div>

        <h2 class="product-title">${prod.title}</h2>
        
        <p class="product-description">
          ${prod.description}
        </p>

        <div class="card-footer">
          <div class="price-box">
            <span class="price-label">Narxi:</span>
            <span class="price">${prod.price} so'm</span>
          </div>
          <button onclick="countSavet()" class="buy-btn">Sotib olish</button>
        </div>
      </div>
    </div>
    `;
  });
}

// =======================================================================================================
const savatchaBtn = document.querySelector(".savatcha button");
const cartModal = document.querySelector("#cartModal");
const closeModalBtn = document.querySelector("#closeModal");
const cartItemsEl = document.querySelector("#cartItems");
const totalAmountEl = document.querySelector("#totalAmount");
const orderBtn = document.querySelector("#orderBtn");

let cart = [];

// Sizning eski countSavet funksiyangizni saqlab qolamiz
const originalCountSavet = window.countSavet;

// Tugma bosilganda mahsulot kartasidan nomi, narxi va rasmini o'zi o'qib oladi
window.countSavet = function() {
  if (typeof originalCountSavet === "function") {
    originalCountSavet();
  }

  // Bosilgan tugma joylashgan kartani topish
  const btn = window.event ? window.event.target : null;
  if (!btn) return;

  const card = btn.closest(".product-card");
  if (!card) return;

  const id = card.querySelector(".product-id").textContent.replace("ID:", "").trim();
  const title = card.querySelector(".product-title").textContent.trim();
  const priceText = card.querySelector(".price").textContent.replace(/[^0-9]/g, "");
  const price = Number(priceText);
  const image = card.querySelector(".card-image img").src;

  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, title, price, image, quantity: 1 });
  }

  renderCartModal();
};

// Soni o'zgartirish (+ yoki -)
window.changeModalQty = function(id, delta) {
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== id);
  }
  renderCartModal();
};

// Mahsulotni o'chirish
window.removeModalItem = function(id) {
  cart = cart.filter(p => p.id !== id);
  renderCartModal();
};

// Modal ichini va tepasidagi sonni yangilash
function renderCartModal() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (countEl) countEl.textContent = totalCount;

  cartItemsEl.innerHTML = "";
  let totalPrice = 0;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = "<p style='text-align:center; color:#64748b;'>Savatchangiz hozircha bo'sh</p>";
  } else {
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;

      cartItemsEl.innerHTML += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.title}">
          <div class="cart-item-info">
            <div class="cart-item-title">${item.title}</div>
            <div class="cart-item-price">${item.price} so'm x ${item.quantity} = <b>${itemTotal} so'm</b></div>
          </div>
          <div class="cart-controls">
            <button onclick="changeModalQty('${item.id}', -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="changeModalQty('${item.id}', 1)">+</button>
            <button class="remove-btn" onclick="removeModalItem('${item.id}')">🗑</button>
          </div>
        </div>
      `;
    });
  }

  totalAmountEl.textContent = totalPrice;
}

// Modalni ochish va yopish
savatchaBtn.addEventListener("click", () => {
  renderCartModal();
  cartModal.classList.add("active");
});

closeModalBtn.addEventListener("click", () => {
  cartModal.classList.remove("active");
});

window.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.classList.remove("active");
  }
});

orderBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Savatchangiz bo'sh!");
    return;
  }
  alert("Buyurtmangiz qabul qilindi!");
  cart = [];
  renderCartModal();
  cartModal.classList.remove("active");
});
// ===========
