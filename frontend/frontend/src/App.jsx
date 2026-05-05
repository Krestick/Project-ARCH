import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductForm from "./components/ProductForm";
import ProductEdit from "./components/ProductEdit";
import ProductDetailPage from "./components/ProductDetailPage";
import CartPage from "./components/CartPage";
import Home from "./pages/Home";
import Shop from "./pages/Shop";

const API_URL = "http://localhost:5000";

function App() {
  const user = useSelector((state) => state.auth.user);

  return (
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<Shop />} />

          <Route
              path="/products/new"
              element={
                user?.role === "admin" ? (
                    <ProductForm apiUrl={`${API_URL}/products`} />
                ) : (
                    <Navigate to="/login" />
                )
              }
          />

          <Route
              path="/products/:id/edit"
              element={
                user?.role === "admin" ? (
                    <ProductEdit apiUrl={`${API_URL}/products`} />
                ) : (
                    <Navigate to="/login" />
                )
              }
          />
          <Route
              path="/products/:id"
              element={<ProductDetailPage apiUrl={`${API_URL}/products`} />}
          />
          <Route
              path="/cart"
              element={user ? <CartPage apiUrl={API_URL} /> : <Navigate to="/login" />}
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

        <Footer />
      </BrowserRouter>
  );
}

export default App;