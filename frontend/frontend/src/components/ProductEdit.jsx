import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../utils/notification";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductEdit({ apiUrl }) {
  const { id } = useParams();
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
  const [isLoadingForm, setIsLoadingForm] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl.replace(/\/products.*/, "")}/categories`)
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch(() => {});
    }, []);

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  useEffect(() => {
    fetch(`${apiUrl}/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            name: data.name || "",
            price: data.price || "",
            image: data.image || "",
            description: data.description || "",
            category: data.category?.name || data.category || "",
          });
          setSelectedSizes(data.sizes || []);
        })
        .catch(() => {
          notifyError("Error loading product");
        })
        .finally(() => setIsLoadingForm(false));
  }, [apiUrl, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const res = await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          image: formData.image || "https://picsum.photos/300",
          sizes: selectedSizes,
        }),
      });

      if (!res.ok) throw new Error();

      notifySuccess("Product updated successfully!");
      setTimeout(() => navigate("/shop"), 1000);
    } catch {
      notifyError("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingForm) return <div className="container"><p>Loading...</p></div>;

  return (
      <div className="product-form">
        <h2>Edit Product</h2>

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
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
  );
}

