import { useState } from "react";
import Banner from "../components/Banner";
import ProductList from "../components/ProductList";
import Categories from "../components/Categories";

export default function Home() {
    const [category, setCategory] = useState("all");

    return (
        <>
            <Banner />

            <div className="layout">
                <Categories
                    category={category}
                    setCategory={setCategory}
                />

                <ProductList
                    apiUrl="http://localhost:5000/products"
                    category={category}
                />
            </div>
        </>
    );
}