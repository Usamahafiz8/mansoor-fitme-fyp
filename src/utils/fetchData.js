const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

function setAccessToken(token) {
  localStorage.setItem("token", token);
}
function getAccessToken() {
  return localStorage.getItem("token");
}

function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}
async function getUser() {
  const {success,data} = await fetchUserDetails()
  return data
}

async function registerUser({ fullname, email, password }) {
  const resp = await fetch(API_URL + "/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fullname, email, password }),
  });
  return await resp.json();
}

async function loginUser({ email, password }) {
  const resp = await fetch(API_URL + "/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await resp.json();
  console.log("dara", data);
  if (data.success) {
    setAccessToken(data.token);
    await fetchUserDetails();
  }
  return data;
}

function logoutUser() {
  localStorage.clear();
}

async function createUserCart(products) {
  const resp = await fetch(API_URL + "/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAccessToken(),
    },
    body: JSON.stringify(products.length ? { products } : {}),
  });
  return await resp.json();
}

async function getUserCart() {
  const userID = await getUser();
  const resp = await fetch(API_URL + "/cart/" + userID.id, {
    headers: {
      Authorization: getAccessToken(),
    },
  });
  const cart = await resp.json();
  
  if (cart.products) {
    cart.products = cart.products.map((product) => ({
      id: product.productID._id,
      title: product.productID.title,
      price: product.productID.price,
      image: product.productID.image,
      quantity: product.quantity,
    }));
  }
  return cart;
}

async function addProductsToCart(products) {
  const userID = await getUser();
  console.log("userDU",userID)
  const resp = await fetch(API_URL + "/cart/" + userID.id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAccessToken(),
    },
    body: JSON.stringify({ products }),
  });
  const res= await resp.json()
  if(res?.message == "Cart not found"){
    const response = await createUserCart(products);
    return response
  }

  return res;
}

async function removeProductFromCart(productID) {
  return await patchCart(productID, 0);
}

async function patchCart(productID, quantity) {
  const userID = await getUser();
  console.log("products",productID)
  const resp = await fetch(API_URL + "/cart/" + userID.id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAccessToken(),
    },
    body: JSON.stringify({ productID, quantity }),
  });
  return await resp.json();
}

async function clearCart() {
  const resp = await fetch(API_URL + "/cart/clear", {
    method: "POST",
    headers: {
      Authorization: getAccessToken(),
    },
  });
  return await resp.json();
}

async function fetchUserDetails() {
  const resp = await fetch(API_URL + "/users/me", {
    headers: {
      Authorization: getAccessToken(),
    },
  });
  const {success,data } = await resp.json();

  if (success) {
    setUser(data);
  }
  return { success, data };
}

async function fetchProducts(category, newArrivals = false) {
  let query = `new=${newArrivals ? "true" : "false"}${
    category ? "&category=" + category : ""
  }`;
  console.log("ad", API_URL);

  const resp = await fetch(API_URL + "/products");
  return await resp.json();
}
async function fetchProduct(id) {
  const resp = await fetch(API_URL + "/products/" + id);
  return await resp.json();
}

async function proceedCheckout(products) {
  const resp = await fetch(API_URL + "/checkout/payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({products}),
  });
  return await resp.json();
}

// on production create the order using stripe webhooks
async function createOrder(products, amount, address) {
  const resp = await fetch(API_URL + "/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": getAccessToken(),
    },
    body: JSON.stringify({
      products: products.map((p) => ({
        productID: p.id,
        quantity: p.quantity,
      })),
      amount,
      address,
    }),
  });
  return await resp.json();
}

async function fetchAllOrders() {
  const userID = getUser()._id;
  const resp = await fetch(API_URL + "/orders/user/" + userID, {
    headers: {
      "x-access-token": getAccessToken(),
    },
  });
  return await resp.json();
}

async function fetchOrderDetails(orderID) {
  const resp = await fetch(API_URL + "/orders/" + orderID, {
    headers: {
      "x-access-token": getAccessToken(),
    },
  });
  return await resp.json();
}

async function fetchUsers() {
  const resp = await fetch(API_URL + "/users", {
    headers: {
      Authorization: getAccessToken(),
    },
  });
  const user = await resp.json();
  return user;
}

async function updateUser(userId, updatedInfo) {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: getAccessToken(),
      },
      body: JSON.stringify(updatedInfo),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user");
    }

    const data = await response.json();
    console.log("User updated successfully:", data);
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

async function handleSaveBrandInfo(id, brandInfo) {
  try {
    const response = await fetch(`/api/brand/save`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: id, // Assuming `user._id` is available in the context
        brandInfo,
        brandApplied:true
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update brand info");
    }

    const data = await response.json();
    console.log("Brand info updated successfully:", data);
    // Handle the updated brand info as needed (e.g., update state)
  } catch (error) {
    console.error("Error updating brand info:", error);
  }
}

async function handleAddProduct(id, product) {
  try {
    const response = await fetch(`/api/products/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...product,
        userId: id, // Assuming the user's ID represents the brand ID
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to add product");
    }

    const data = await response.json();
    console.log("Product added successfully:", data);
    // Handle the newly added product as needed (e.g., update state or UI)
  } catch (error) {
    console.error("Error adding product:", error);
  }
}

export default {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  fetchUserDetails,
  fetchProducts,
  fetchProduct,
  createUserCart,
  getUserCart,
  addProductsToCart,
  removeProductFromCart,
  patchCart,
  clearCart,
  proceedCheckout,
  createOrder,
  fetchAllOrders,
  fetchOrderDetails,
  fetchUsers,
  updateUser,
  handleSaveBrandInfo,
  handleAddProduct,
};
