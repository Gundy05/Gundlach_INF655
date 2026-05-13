import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const onAuthScreen = location.pathname === "/login" || location.pathname === "/register";

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="site-header">
      <div className="nav-bar">
        <NavLink className="brand-lockup" to="/">
          <span className="brand-mark">PG</span>
          <span className="brand-copy">
            <strong>Pocket Guard</strong>
            <small>Track spending with less guesswork.</small>
          </span>
        </NavLink>

        {!onAuthScreen ? (
          <nav className="nav-links" aria-label="Primary navigation">
            <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/">
              Home
            </NavLink>

            {user ? (
              <>
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                  to="/dashboard"
                >
                  Dashboard
                </NavLink>
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                  to="/expenses/new"
                >
                  Add Expense
                </NavLink>
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                  to="/expenses"
                >
                  Expenses
                </NavLink>
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                  to="/settings"
                >
                  Profile/Settings
                </NavLink>
              </>
            ) : null}
          </nav>
        ) : (
          <div className="nav-links nav-links-minimal" />
        )}

        <div className="nav-actions">
          {user ? (
            <>
              <p className="welcome-copy">
                Welcome, <strong>{user.displayName || user.email}</strong>
              </p>
              <button className="ghost-button" onClick={handleLogout} type="button">
                Log Out
              </button>
            </>
          ) : (
            <>
              <NavLink className="ghost-button" to="/login">
                Log In
              </NavLink>
              <NavLink className="primary-button" to="/register">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
