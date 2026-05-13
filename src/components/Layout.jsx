import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

function Layout() {
  const location = useLocation();
  const isHomeRoute = location.pathname === "/";

  return (
    <div className="app-shell">
      {isHomeRoute ? null : <Navbar />}
      <main className={`page-shell${isHomeRoute ? " page-shell-home" : ""}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
