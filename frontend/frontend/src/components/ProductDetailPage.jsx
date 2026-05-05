import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useConfirmModal } from "../hooks/useConfirmModal";
import ConfirmModal from "./ConfirmModal";
import { notifySuccess, notifyError } from "../utils/notification";

export default function ProductDetailPage({ apiUrl }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const confirmModal = useConfirmModal();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${apiUrl}/${id}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setProduct(data);
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]);
      }
    } catch (err) {
      notifyError("Error loading product");
      setError("Error loading product");
    }
  };

  const handleDeleteClick = () => {
    confirmModal.openModal(
      "Delete Product",
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
      handleConfirmDelete
    );
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      notifySuccess("Product deleted successfully!");
      setTimeout(() => navigate("/shop"), 1000);
    } catch {
      notifyError("Failed to delete product");
      setIsDeleting(false);
    }
  };

  const addToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      notifyError("Please select a size");
      return;
    }
    setAddingToCart(true);
    try {
      const res = await fetch("http://localhost:5000/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          product_id: parseInt(id),
          quantity: 1,
          selected_size: selectedSize || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      notifySuccess("Added to cart!");
    } catch {
      notifyError("Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (error) return <div className="container"><p className="error">{error}</p></div>;
  if (!product) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <button onClick={() => navigate(-1)} className="btn-back">
        ← Back
      </button>

      <div className="detail">
        <div className="detail-image">
          <img
            src={product.image || "https://picsum.photos/300"}
            alt={product.name}
          />
        </div>

        <div className="detail-info">
          <h1>{product.name}</h1>
          <p className="price">${parseFloat(product.price).toFixed(2)}</p>
          <p className="category-tag">{product.category}</p>
          <p className="description">{product.description}</p>
          
          {product.sizes && product.sizes.length > 0 && (
            <div className="size-selector">
              <p className="size-label">Select Size:</p>
              <div className="sizes">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? "active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
            </button>
                ))}
        </div>
      </div>
          )}

          {user?.role === "client" && (
          <button
            onClick={addToCart}
            className="btn-add-to-cart"
            disabled={addingToCart}
          >
            {addingToCart ? "Adding..." : "Add to Cart"}
          </button>
          )}

          {user?.role === "admin" && (
            <div className="actions">
              <Link to={`/products/${id}/edit`} className="btn-edit">
                Edit
              </Link>
              <button onClick={handleDeleteClick} className="btn-delete" disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
      </div>
          )}
    </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.handleConfirm}
        onCancel={confirmModal.closeModal}
        isLoading={confirmModal.isLoading}
      />
    </div>
  );
}