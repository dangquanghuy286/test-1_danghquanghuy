// ===========Shopping Cart Calculator=============
document.addEventListener("DOMContentLoaded", function () {
  // Update money and item count in cart
  function updateCart() {
    const cartItems = document.querySelectorAll(".tf-mini-cart-item");
    let total = 0;
    let totalItems = 0;

    cartItems.forEach((item) => {
      // Get price and quantity
      const priceElement = item.querySelector(".new-price");
      const quantityInput = item.querySelector(".quantity-product");

      if (priceElement && quantityInput) {
        const price = parseFloat(
          priceElement.textContent.replace("$", "").replace(",", "")
        );
        const quantity = parseInt(quantityInput.value) || 0;

        total += price * quantity;
        totalItems += quantity;
      }
    });

    // Update total money
    const totalElement = document.querySelector(".tf-totals-total-value");
    if (totalElement) {
      totalElement.textContent = `$${total.toFixed(2)} USD`;
    }

    // Update item count
    const countBoxes = document.querySelectorAll(".nav-cart .count-box");
    countBoxes.forEach((box) => {
      box.textContent = totalItems;
    });
    updateShippingProgress(total);
  }

  // Update shipping progress bar
  function updateShippingProgress(total) {
    const freeShippingThreshold = 100;
    const progress = Math.min((total / freeShippingThreshold) * 100, 100);

    const progressBar = document.querySelector(".tf-progress-bar .value");
    if (progressBar) {
      progressBar.style.width = progress + "%";
      progressBar.setAttribute("data-progress", progress);
    }

    const remainingAmount = Math.max(freeShippingThreshold - total, 0);
    const thresholdText = document.querySelector(
      ".tf-mini-cart-threshold .text"
    );
    if (thresholdText) {
      if (remainingAmount > 0) {
        thresholdText.innerHTML = `Spend <span class="fw-medium">$${remainingAmount.toFixed(
          2
        )}</span> more to get <span class="fw-medium">Free Shipping</span>`;
      } else {
        thresholdText.innerHTML = `You've got <span class="fw-medium">Free Shipping!</span>`;
      }
    }
  }

  // Function to add product to cart
  function addToCart() {
    const productSection = document.querySelector(".product-section");
    const productTitle =
      productSection.querySelector(".product-title").textContent;
    const productPrice =
      productSection.querySelector(".product-price").textContent;
    const productImage = productSection.querySelector(".product-image img").src;
    const productVariant = productSection.querySelector(
      ".product-variant select"
    ).value;
    const productQuantity = parseInt(
      productSection.querySelector(".quantity-product").value
    );

    // Check if cart empty message exists and remove it
    const emptyMessage = document.querySelector(
      ".tf-mini-cart-items .text-center"
    );
    if (emptyMessage) {
      emptyMessage.remove();
    }

    // Check if product with same variant already exists in cart
    const existingItem = findCartItem(productTitle, productVariant);

    if (existingItem) {
      // Update quantity of existing item
      const quantityInput = existingItem.querySelector(".quantity-product");
      const currentQty = parseInt(quantityInput.value);
      quantityInput.value = currentQty + productQuantity;
    } else {
      // Create new cart item
      const cartItemsContainer = document.querySelector(".tf-mini-cart-items");
      const newItem = createCartItem(
        productTitle,
        productPrice,
        productImage,
        productVariant,
        productQuantity
      );
      cartItemsContainer.appendChild(newItem);
    }

    // Update cart totals
    updateCart();

    // Open cart sidebar
    const cartOffcanvas = new bootstrap.Offcanvas(
      document.getElementById("shoppingCart")
    );
    cartOffcanvas.show();

    // Reset product quantity to 1
    productSection.querySelector(".quantity-product").value = 1;
  }

  // Find existing cart item
  function findCartItem(title, variant) {
    const cartItems = document.querySelectorAll(".tf-mini-cart-item");
    for (let item of cartItems) {
      const itemTitle = item.querySelector(".title").textContent;
      const itemVariant = item.querySelector(".info-variant select").value;
      if (itemTitle === title && itemVariant === variant) {
        return item;
      }
    }
    return null;
  }

  // Create cart item element
  function createCartItem(title, price, image, variant, quantity) {
    const div = document.createElement("div");
    div.className = "tf-mini-cart-item file-delete";

    const priceValue = price.replace("$", "").trim();

    div.innerHTML = `
      <div class="tf-mini-cart-image">
        <a href="product-detail.html">
          <img
            class="ls-is-cached lazyloaded"
            data-src="${image}"
            src="${image}"
            alt="img-product"
          />
        </a>
      </div>
      <div class="tf-mini-cart-info">
        <div class="d-flex justify-content-between">
          <a
            class="title link text-md fw-medium"
            href="product-detail.html"
            >${title}</a
          >
          <i class="icon icon-close remove fs-12"></i>
        </div>
        <div class="info-variant">
          <select class="text-xs">
            <option value="${variant}" selected>${variant}</option>
          </select>
          <i class="icon-pen edit"></i>
        </div>
        <p class="price-wrap text-sm fw-medium">
          <span class="new-price text-primary">$${priceValue}</span>
        </p>
        <div class="wg-quantity small">
          <button class="btn-quantity minus-btn">-</button>
          <input
            class="quantity-product font-4"
            type="text"
            name="number"
            value="${quantity}"
          />
          <button class="btn-quantity plus-btn">+</button>
        </div>
      </div>
    `;

    return div;
  }

  // Handle increase/decrease quantity buttons
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("plus-btn")) {
      const input = e.target.previousElementSibling;
      input.value = parseInt(input.value) + 1;
      updateCart();
    }

    if (e.target.classList.contains("minus-btn")) {
      const input = e.target.nextElementSibling;
      if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
        updateCart();
      }
    }
  });

  // Handle quantity input changes
  document.addEventListener("input", function (e) {
    if (e.target.classList.contains("quantity-product")) {
      let value = parseInt(e.target.value) || 1;
      if (value < 1) value = 1;
      e.target.value = value;
      updateCart();
    }
  });

  // Handle remove product button
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove")) {
      const item = e.target.closest(".tf-mini-cart-item");
      if (item) {
        item.remove();
        updateCart();

        const remainingItems = document.querySelectorAll(".tf-mini-cart-item");
        if (remainingItems.length === 0) {
          const cartItems = document.querySelector(".tf-mini-cart-items");
          if (cartItems) {
            cartItems.innerHTML =
              '<div class="text-center py-5"><p class="text-muted">Your cart is empty</p></div>';
          }
        }
      }
    }
  });

  const addToCartBtn = document.querySelector(".add-to-cart-btn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", addToCart);
  }

  // Initial cart update
  updateCart();
});
