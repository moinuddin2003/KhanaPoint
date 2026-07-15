import { Outlet } from "react-router";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
export default function Layout() {
  return (
    <div className="app-container">
      {/* Persistent Navigation Bar */}
      <Navbar />

      {/* Dynamic Route Content Placeholder */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Persistent Footer */}
      <Footer />
    </div>
  );
}
