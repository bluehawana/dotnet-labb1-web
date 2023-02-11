var shoppingCart = (function () {
  let cart = [];

  class Item {
    constructor(name, price, count) {
      this.name = name;
      this.price = price;
      this.count = count;
    }
  }

  function saveCart() {
    sessionStorage.setItem("shoppingCart", JSON.stringify(cart));
  }

  function loadCart() {
    cart = JSON.parse(sessionStorage.getItem("shoppingCart"));
  }

  if (sessionStorage.getItem("shoppingCart")) {
    loadCart();
  }

  return {
    addItemToCart(name, price, count) {
      let existingItem = cart.find((item) => item.name === name);
      if (existingItem) {
        existingItem.count++;
      } else {
        cart.push(new Item(name, price, count));
      }
      saveCart();
    },
    setCountForItem(name, count) {
      let item = cart.find((item) => item.name === name);
      if (item) {
        item.count = count;
      }
    },
    removeItemFromCart(name) {
      let itemIndex = cart.findIndex((item) => item.name === name);
      if (itemIndex !== -1) {
        let item = cart[itemIndex];
        item.count--;
        if (item.count === 0) {
          cart.splice(itemIndex, 1);
        }
      }
      saveCart();
    },
    removeItemFromCartAll(name) {
      let itemIndex = cart.findIndex((item) => item.name === name);
      if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
      }
      saveCart();
    },
    clearCart() {
      cart = [];
      saveCart();
    },
    totalCount() {
      return cart.reduce((total, item) => total + item.count, 0);
    },
    totalCart() {
      return cart
        .reduce((total, item) => total + item.price * item.count, 0)
        .toFixed(2);
    },
    listCart() {
      return cart.map((item) => ({
        ...item,
        total: (item.price * item.count).toFixed(2),
      }));
    },
  };
})();

$(".add-to-cart").click(function (event) {
  event.preventDefault();
  let name = $(this).data("name");
  let price = Number($(this).data("price"));
  shoppingCart.addItemToCart(name, price, 1);
  displayCart();
});

$(".clear-cart").click(function () {
  shoppingCart.clearCart();
  displayCart();
});

function displayCart() {
  let cartArray = shoppingCart.listCart();
  let output = "";
  for (let item of cartArray) {
    output += `
      <tr>
        <td>${item.name}</td>
        <td>(${item.price})</td>
        <td>
          <div class="input-group">
            <button class="minus-item input-group-addon btn btn-primary" data-name=${item.name}>-</button>
            <input type="number" class="item-count form-control" data-name="${item.name}" value="${item.count}">
            <button class="plus-item btn btn-primary input-group-addon" data-name=${item.name}>+</button>
          </div>
        </td>
        <td><button class="delete-item btn btn-danger" data-name=${item.name}>X</button></td>
        = 
        <td>${item.total}</td>
      </tr>`;
  }
  $(".show-cart").html(output);
  $(".total-cart").html(shoppingCart.totalCart());
  $(".total-count").html(shoppingCart.totalCount());
}

$(".show-cart").on("click", ".delete-item", function (event) {
  event.preventDefault();
  let name = $(this).data("name");
  shoppingCart.removeItemFromCartAll(name);
  displayCart();
});

$(".show-cart").on("click", ".minus-item", function (event) {
  event.preventDefault();
  let name = $(this).data("name");
  shoppingCart.removeItemFromCart(name);
  displayCart();
});

$(".show-cart").on("click", ".plus-item", function (event) {
  event.preventDefault();
  let name = $(this).data("name");
  shoppingCart.addItemToCart(name, 0, 1);
  displayCart();
});

$(".show-cart").on("change", ".item-count", function (event) {
  let name = $(this).data("name");
  let count = Number($(this).val());
  shoppingCart.setCountForItem(name, count);
  displayCart();
});

displayCart();
