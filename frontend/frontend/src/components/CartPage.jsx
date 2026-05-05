import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCart, removeFromCart, clearCart } from "../redux/cartSlice";
import { notifySuccess, notifyError } from "../utils/notification";

export default function CartPage({ apiUrl }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [ordering, setOrdering] = useState(false);

  const getToken = () => localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      const res = await fetch(`${apiUrl}/cart`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      dispatch(setCart(data));
    } catch {
      notifyError("Error loading cart");
    }
  };

  const removeItem = async (id) => {
    try {
      await fetch(`${apiUrl}/cart/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      dispatch(removeFromCart(id));
      notifySuccess("Item removed");
    } catch {
      notifyError("Failed to remove item");
    }
  };

  const placeOrder = async () => {
    setOrdering(true);
    try {
      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      dispatch(clearCart());
      notifySuccess("Order placed successfully!");
    } catch {
      notifyError("Failed to place order");
    } finally {
      setOrdering(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // CartItemResponse is flat: { id, productId, name, price, image, category, quantity, selectedSize }
  const totalPrice = cartItems.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
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
                  <div key={item.id} className="cart-item">
                    <img src={item.image || "https://picsum.photos/80"} alt={item.name} style={{ width: 80, height: 80, objectFit: "cover" }} />
                    <div>
                      <p><strong>{item.name}</strong></p>
                      {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                      <p>Qty: {item.quantity}</p>
                      <p>${parseFloat(item.price).toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
              ))}
              <h3>Total: ${totalPrice.toFixed(2)}</h3>
              <button onClick={placeOrder} disabled={ordering} className="btn-order">
                {ordering ? "Placing order..." : "Place Order"}
              </button>
            </>
        )}
      </div>
  );
}