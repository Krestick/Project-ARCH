import { useState } from "react";
import Categories from "../components/Categories";
import ProductList from "../components/ProductList";

export default function Shop() {
  const [category, setCategory] = useState("all");

  return (
    <div className="layout-wrapper">
      <Categories 
        category={category}
        setCategory={setCategory}
      />

      <ProductList 
        apiUrl="http://localhost:5000/products"
        category={category}
      />
    </div>
  );
}