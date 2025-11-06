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

    // Update item count in cart icon
    const countBoxes = document.querySelectorAll(".nav-cart .count-box");
    countBoxes.forEach((box) => {
      box.textContent = totalItems;
    });

    // Update progress bar free shipping
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

    //
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
        thresholdText.innerHTML = ` You've got <span class="fw-medium">Free Shipping!</span>`;
      }
    }
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

        // Check if cart is empty
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

  updateCart();
});
