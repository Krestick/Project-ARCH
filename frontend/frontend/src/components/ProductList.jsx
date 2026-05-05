import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { notifyError } from "../utils/notification";

export default function ProductList({ apiUrl, category }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await fetch(apiUrl);

      if (!res.ok) {
        throw new Error("Server error: " + res.status);
      }

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      notifyError("Error loading products");
      setError("Error loading products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered =
      category === "all" || !category
          ? products
          : products.filter((p) => p.category.name === category);

  return (
      <div className="container">
        <div className="header-title">
          <h2>Products</h2>

          {user?.role === "admin" && (
              <Link to="/products/new" className="btn-add">
                + Add Product
              </Link>
          )}
        </div>

        <div className="product-grid">
          {filtered.map((p) => (
              <div
                  key={p.id}
                  className="product-card"
                  onClick={() => navigate(`/products/${p.id}`)}
                  style={{ cursor: "pointer" }}
              >
                <img
                    src={p.image || "https://picsum.photos/300"}
                    alt={p.name}
                />

                <h3>{p.name}</h3>
                <p className="price">${parseFloat(p.price).toFixed(2)}</p>
                <p className="category">{p.category?.name}</p>

                <div className="actions">
                  <Link
                      to={`/products/${p.id}`}
                      className="btn-view"
                      onClick={(e) => e.stopPropagation()}
                  >
                    View
                  </Link>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
}