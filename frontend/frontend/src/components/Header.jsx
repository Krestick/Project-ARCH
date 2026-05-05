import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; 
import { logout } from "../redux/authSlice"; 

export default function Header() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); 
    navigate("/");
  };

  return (
    <header className="header">
      <Link to="/" className="logo">Clothing Shop</Link>

      <ul className="nav">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/shop">Shop</Link></li>

        {user ? (
          <>
            <li><Link to="/cart">Cart 🛒</Link></li>

            {user.role === "admin" && (
              <li>
                <Link to="/products/new" className="nav-admin">
                  + Add Product
                </Link>
              </li>
            )}

            <li className="nav-user">
              {user.username || user.name}
              {user.role === "admin" && (
                <span className="admin-badge">Admin</span>
              )}
            </li>

            <li onClick={handleLogout} style={{ cursor: "pointer" }}>
              Logout
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </header>
  );
}