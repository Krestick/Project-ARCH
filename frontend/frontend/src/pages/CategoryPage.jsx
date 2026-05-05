import { useParams } from "react-router-dom";
import ProductList from "../components/ProductList";

export default function CategoryPage() {
    const { name } = useParams();

    return (
        <div className="layout">
            <h2>{name.toUpperCase()}</h2>

            <ProductList
                apiUrl="http://localhost:5000/products"
                category={name}
            />
        </div>
    );
}