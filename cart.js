// Shopping Cart Functionality
document.addEventListener("DOMContentLoaded", () => {
    // Initialize cart from localStorage or create empty cart
    let cart = JSON.parse(localStorage.getItem("davesCart")) || []
  
    // Update cart badge count
    updateCartBadge()
  
    // Add event listeners to "Add to Cart" buttons if on menu page
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn")
    if (addToCartButtons.length > 0) {
      addToCartButtons.forEach((button) => {
        button.addEventListener("click", function (e) {
          e.preventDefault()
  
          const menuItem = this.closest(".menu-item")
          const itemName = menuItem.querySelector("h3").textContent
          const itemPrice = Number.parseFloat(menuItem.querySelector(".price").textContent.replace("$", ""))
          const itemImage = menuItem.querySelector("img").src
  
          // Check if item already exists in cart
          const existingItemIndex = cart.findIndex((item) => item.name === itemName)
  
          if (existingItemIndex > -1) {
            // Item exists, increment quantity
            cart[existingItemIndex].quantity += 1
          } else {
            // Add new item to cart
            cart.push({
              name: itemName,
              price: itemPrice,
              image: itemImage,
              quantity: 1,
            })
          }
  
          // Save cart to localStorage
          saveCart()
  
          // Show notification
          showNotification(`${itemName} added to cart!`)
  
          // Update cart badge
          updateCartBadge()
  
          // Render cart items immediately after adding to cart
          renderCartItems()
        })
      })
    }
  
    // Cart toggle functionality
    const cartToggle = document.getElementById("cart-toggle")
    if (cartToggle) {
      cartToggle.addEventListener("click", () => {
        document.getElementById("cart-sidebar").classList.toggle("active")
      })
    }
  
    // Close cart when clicking outside
    document.addEventListener("click", (e) => {
      const cartSidebar = document.getElementById("cart-sidebar")
      const cartToggle = document.getElementById("cart-toggle")
  
      if (
        cartSidebar &&
        cartSidebar.classList.contains("active") &&
        !cartSidebar.contains(e.target) &&
        cartToggle &&
        !cartToggle.contains(e.target)
      ) {
        cartSidebar.classList.remove("active")
      }
    })
  
    // Render cart items if cart sidebar exists
    const cartItemsContainer = document.getElementById("cart-items")
    if (cartItemsContainer) {
      renderCartItems()
    }
  
    // Function to save cart to localStorage
    function saveCart() {
      localStorage.setItem("davesCart", JSON.stringify(cart))
    }
  
    // Function to update cart badge count
    function updateCartBadge() {
      const cartBadge = document.getElementById("cart-badge")
      if (cartBadge) {
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0)
        cartBadge.textContent = itemCount
  
        if (itemCount > 0) {
          cartBadge.classList.add("active")
        } else {
          cartBadge.classList.remove("active")
        }
      }
    }
  
    // Function to render cart items
    function renderCartItems() {
      const cartItemsContainer = document.getElementById("cart-items")
      const cartTotalElement = document.getElementById("cart-total")
      const emptyCartMessage = document.getElementById("empty-cart-message")
  
      if (cartItemsContainer) {
        // Clear current items
        cartItemsContainer.innerHTML = ""
  
        if (cart.length === 0) {
          // Show empty cart message
          if (emptyCartMessage) {
            emptyCartMessage.style.display = "block"
          }
          if (cartTotalElement) {
            cartTotalElement.textContent = "$0.00"
          }
          return
        }
  
        // Hide empty cart message
        if (emptyCartMessage) {
          emptyCartMessage.style.display = "none"
        }
  
        // Calculate total
        let total = 0
  
        // Add each item to the cart
        cart.forEach((item, index) => {
          const itemTotal = item.price * item.quantity
          total += itemTotal
  
          const cartItemElement = document.createElement("div")
          cartItemElement.className = "cart-item"
          cartItemElement.innerHTML = `
                      <div class="cart-item-image">
                          <img src="${item.image}" alt="${item.name}">
                      </div>
                      <div class="cart-item-details">
                          <h4>${item.name}</h4>
                          <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                          <div class="cart-item-controls">
                              <button class="quantity-btn decrease" data-index="${index}">-</button>
                              <span class="quantity">${item.quantity}</span>
                              <button class="quantity-btn increase" data-index="${index}">+</button>
                              <button class="remove-btn" data-index="${index}">Remove</button>
                          </div>
                      </div>
                  `
  
          cartItemsContainer.appendChild(cartItemElement)
        })
  
        // Update total
        if (cartTotalElement) {
          cartTotalElement.textContent = `$${total.toFixed(2)}`
        }
  
        // Add event listeners to quantity and remove buttons
        const decreaseButtons = document.querySelectorAll(".quantity-btn.decrease")
        const increaseButtons = document.querySelectorAll(".quantity-btn.increase")
        const removeButtons = document.querySelectorAll(".remove-btn")
  
        decreaseButtons.forEach((button) => {
          button.addEventListener("click", function () {
            const index = Number.parseInt(this.getAttribute("data-index"))
            if (cart[index].quantity > 1) {
              cart[index].quantity -= 1
            } else {
              cart.splice(index, 1)
            }
            saveCart()
            renderCartItems()
            updateCartBadge()
          })
        })
  
        increaseButtons.forEach((button) => {
          button.addEventListener("click", function () {
            const index = Number.parseInt(this.getAttribute("data-index"))
            cart[index].quantity += 1
            saveCart()
            renderCartItems()
            updateCartBadge()
          })
        })
  
        removeButtons.forEach((button) => {
          button.addEventListener("click", function () {
            const index = Number.parseInt(this.getAttribute("data-index"))
            cart.splice(index, 1)
            saveCart()
            renderCartItems()
            updateCartBadge()
          })
        })
      }
    }
  
    // Clear cart functionality
    const clearCartButton = document.getElementById("clear-cart")
    if (clearCartButton) {
      clearCartButton.addEventListener("click", () => {
        cart = []
        saveCart()
        renderCartItems()
        updateCartBadge()
        showNotification("Cart cleared!")
      })
    }
  
    // Checkout functionality
    const checkoutButton = document.getElementById("checkout-btn")
    if (checkoutButton) {
      checkoutButton.addEventListener("click", () => {
        if (cart.length === 0) {
          showNotification("Your cart is empty!")
          return
        }
  
        alert("Thank you for your order! This would normally proceed to payment processing.")
        cart = []
        saveCart()
        renderCartItems()
        updateCartBadge()
        document.getElementById("cart-sidebar").classList.remove("active")
      })
    }
  
    // Function to show notification
    function showNotification(message) {
      const notification = document.createElement("div")
      notification.className = "notification"
      notification.textContent = message
  
      document.body.appendChild(notification)
  
      // Trigger animation
      setTimeout(() => {
        notification.classList.add("show")
      }, 10)
  
      // Remove notification after 3 seconds
      setTimeout(() => {
        notification.classList.remove("show")
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 300)
      }, 3000)
    }
  })  