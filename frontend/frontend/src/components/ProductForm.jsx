import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../utils/notification";
const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export default function ProductForm({ apiUrl }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: "" 
  });

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => notifyError("Failed to load categories"));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      notifyError("Name is required");
      return;
    }

    if (!formData.price || formData.price <= 0) {
      notifyError("Valid price required");
      return;
    }

    if (!formData.category) {
      notifyError("Category is required");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          image: formData.image || "https://picsum.photos/300",
          sizes: selectedSizes,
        })
      });

      if (!res.ok) throw new Error("Failed to create");

      notifySuccess("Product created successfully!");
      setTimeout(() => navigate("/shop"), 1000);
    } catch (err) {
      notifyError("Failed to create product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-form">
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input
            name="image"
            value={formData.image}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Sizes</label>
          <div className="size-checkboxes">
            {AVAILABLE_SIZES.map((size) => (
              <label key={size} className="size-checkbox">
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(size)}
                  onChange={() => toggleSize(size)}
                />
                {size}
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate("/shop")} disabled={isLoading}>
            Cancel
          </button>
          <button type="submit" disabled={isLoading}>{isLoading ? "Creating..." : "Create"}</button>
        </div>
      </form>
    </div>
  );
}

