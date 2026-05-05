import { useState, useEffect } from "react";

export default function Categories({ category, setCategory }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => {});
  }, []);

  return (
    <div className="sidebar">
      <h3>Categories</h3>

      <div 
        className={category === "all" ? "active" : ""}
        onClick={() => setCategory("all")}
      >
        All
      </div>

      {categories.map((cat) => (
        <div
          key={cat.id}
          className={category === cat.name ? "active" : ""}
          onClick={() => setCategory(cat.name)}
        >
          {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
        </div>
      ))}
    </div>
  );
}