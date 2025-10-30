import React, { useState, useEffect, useCallback, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import "./i18n";
import "antd/dist/reset.css"; // cần cho Ant Design v5
// import "../src/components/Header";
// import "../src/components/Footer";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
// 🏠 --- USER COMPONENTS ---
import Header from "./components/Header";
import Footer from "./components/Footer";
import ChatBubble from "./components/ChatBubble";
import Banner from "./components/Banner";

// 🧩 --- ADMIN COMPONENTS ---
import PageContent from "./components/PageContent";
import SideMenu from "./components/SideMenu";
import Customers from "./pages/Customers";
import Dashbaord from "./pages/Dashbaord";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import Help  from "./pages/Help";
import Staffs from "./pages/Staffs";
import Promotion from "./pages/Promotion";

// 🏠 --- USER PAGES ---
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductsList from "./pages/ProductsList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CartProducts from "./pages/CartProducts";
import Checkout from "./pages/Checkout";
import ProductDetail from "./pages/ProductDetail";
import Product from "./pages/Product";
import ShoppingCart from "./pages/ShoppingCart";
import ReviewOrder from "./pages/ReviewOrder";

const DARK_MODE_KEY = "app_dark_mode";

// ========== GIAO DIỆN USER ==========
function UserLayout() {
  const location = useLocation();
  const showBannerPaths = ["/", "/products", "/about"];
  const showBanner = showBannerPaths.includes(location.pathname);

  return (
    <>
      <Header />
      {showBanner && <Banner />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<ProductsList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<CartProducts />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/product" element={<Product />} />
        <Route path="/shoppingcart" element={<ShoppingCart />} />
        <Route path="/revieworder" element={<ReviewOrder />} />
      </Routes>
      <ChatBubble />
      <Footer />
    </>
  );
}

// ========== GIAO DIỆN ADMIN ==========
function AdminLayout() {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem(DARK_MODE_KEY);
    if (savedMode !== null) {
      setIsDarkMode(savedMode === "true");
    }
  }, []);

  const handleToggleDarkMode = useCallback((newMode) => {
    setIsDarkMode(newMode);
    localStorage.setItem(DARK_MODE_KEY, newMode.toString());
  }, []);

  const toggleSideMenu = () => setIsSideMenuOpen((prev) => !prev);

  return (
    <div className={`App ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <AppHeader
        toggleSideMenu={toggleSideMenu}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />
      <div className="SideMenuAndPageContent">
        <SideMenu
          isSideMenuOpen={isSideMenuOpen}
          toggleSideMenu={toggleSideMenu}
        />
        <PageContent />
      </div>
      <AppFooter />
      {isSideMenuOpen && <div className="menu-overlay" onClick={toggleSideMenu} />}
    </div>
  );
}

// ========== APP CHÍNH ==========
function App() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 50, textAlign: "center", fontSize: 20 }}>
          Đang tải... (Loading...)
        </div>
      }
    >
      <BrowserRouter>
        <Routes>
          {/* User layout hiển thị đầu tiên */}
          <Route path="/*" element={<UserLayout />} />

          {/* Admin layout riêng biệt */}
          <Route path="/admin/*" element={<AdminLayout />} />
          
          
          <Route path="/inventory" element={<Inventory />}></Route>
                <Route path="/orders" element={<Orders />}></Route>
                <Route path="/customers" element={<Customers />}></Route>
                <Route path="/help" element={<Help />}></Route>
                <Route path="/staffs" element={<Staffs />}></Route>
                <Route path="/promotion" element={<Promotion />}></Route>
                <Route path="/dashboard" element={<Dashbaord />}></Route>
        </Routes>
        <AppFooter/>
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
