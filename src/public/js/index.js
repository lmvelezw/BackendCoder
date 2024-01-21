document.querySelectorAll(".delete-product").forEach((button) => {
  button.addEventListener("click", async (event) => {
    event.preventDefault();

    const productId = button.dataset.productId;
    const cartId = button.dataset.cartId;
    console.log("pcto", cartId);
    const requestUrl = `/api/cart/${cartId}/product/${productId}`;

    try {
      const response = await fetch(requestUrl, {
        method: "DELETE",
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
});

document
  .querySelector(".deleteAllItems")
  .addEventListener("click", async () => {
    const button = document.querySelector(".deleteAllItems");
    const cartId = button.dataset.cartId;

    console.log("carroeliminar", cartId);

    try {
      const response = await fetch(`/api/cart/${cartId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed to delete all items");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
