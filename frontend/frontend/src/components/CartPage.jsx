import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCart, removeFromCart } from "../redux/cartSlice";
import { notifySuccess, notifyError } from "../utils/notification";

export default function CartPage({ apiUrl }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const getToken = () => localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      const res = await fetch(${apiUrl}/cart, {
      headers: { Authorization: Bearer ${getToken()} },
    });
    const data = await res.json();
    dispatch(setCart(data));
  } catch {
    notifyError("Error loading cart");
  }
};

const removeItem = async (id) => {
  try {
    await fetch(${apiUrl}/cart/${id}, {
      method: "DELETE",
          headers: { Authorization: Bearer ${getToken()} },
    });
    dispatch(removeFromCart(id));
    notifySuccess("Item removed");
  } catch {
    notifyError("Failed to remove item");
  }
};

useEffect(() => {
  fetchCart();
}, []);

const totalPrice = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
);

return (
    <div className="container">
      <h2>Cart</h2>
      {cartItems.length === 0 ? (
          <p>Cart is empty</p>
      ) : (
          <>
            {cartItems.map((item) => (
                <div key={item.id}>
                  <p>{item.product.name}</p>
                  <p>Size: {item.selectedSize}</p>
                  <p>Qty: {item.quantity}</p>
                  <button onClick={() => removeItem(item.id)}>Remove</button>
                </div>
            ))}
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
          </>
      )}
    </div>
);
}