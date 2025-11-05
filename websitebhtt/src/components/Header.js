// Tên file: src/components/Header.js

import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  Button,
  Badge,
  message, 
} from "antd";
import {
  UserOutlined,
  DownOutlined,
  LoginOutlined,
  ShoppingCartOutlined,
  LogoutOutlined, 
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo2.jpg";
import "../App.css";
import React, { useState } from "react";
import Categories from "../pages/Categories";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // <-- Đã có

const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();
  const [showCategories, setShowCategories] = useState(false);

  // Lấy state từ các Context
  const { cartItems } = useCart();
  // === THAY ĐỔI: LẤY THÊM currentUser ===
  const { isLoggedIn, logout, currentUser } = useAuth(); 

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // HÀM XỬ LÝ LOGOUT (Giữ nguyên)
  const handleLogout = () => {
    logout();
    message.success("Bạn đã đăng xuất.");
    navigate("/login");
  };

  // menuItems (Giữ nguyên)
  const menuItems = [
    { key: "home", label: "Home", onClick: () => navigate("/") },
    {
      key: "product",
      label: (
        <div
          onMouseEnter={() => setShowCategories(true)}
          onMouseLeave={() => setShowCategories(false)}
          style={{ position: "relative" }}
        >
          <span
            onClick={() => navigate("/products")}
            style={{ cursor: "pointer" }}
          >
            Products
          </span>
          {showCategories && (
            <div
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
             
            >
              <Categories />
            </div>
          )}
        </div>
      ),
    },
    { key: "about", label: "About", onClick: () => navigate("/about") },
    { key: "contact", label: "Contact", onClick: () => navigate("/contact") },
  ];

  // userMenu (Giữ nguyên)
  const userMenu = {
    items: [
      { key: "1", label: "Profile", onClick: () => navigate("/profile") },
      { key: "2", label: "Log out", onClick: handleLogout },
    ],
  };

  return (
    <Header
      onMouseLeave={() => setShowCategories(false)}
      style={{ position: "relative" }}
    >
      <div className="header-logo" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" />
      </div>
      <Menu mode="horizontal" items={menuItems} />
      <div className="header-right">
        {/* (Phần Badge giỏ hàng giữ nguyên) */}
        <Badge
          count={totalItems}
          showZero
          style={{ marginRight: "16px", cursor: "pointer" }}
          onClick={() => navigate("/cart")}
        >
          <ShoppingCartOutlined
            style={{ fontSize: "24px" }}
          />
        </Badge>

        <Dropdown menu={userMenu} trigger={["click"]}>
          <Space style={{ cursor: "pointer" }}>
            
            {/* === THAY ĐỔI QUAN TRỌNG Ở ĐÂY === */}
            <Avatar 
              // 1. Nếu đăng nhập VÀ currentUser có tồn tại:
              //    - Dùng currentUser.image (có thể là URL từ API
              //      hoặc Base64 do hàm updateUser cập nhật)
              // 2. Component Avatar của AntD tự xử lý cả 2 loại src
              // 3. Nếu src là null, nó sẽ dùng icon dự phòng
              src={isLoggedIn && currentUser ? currentUser.image : null} 
              icon={<UserOutlined />} 
            />
            {/* ================================= */}

            <DownOutlined />
          </Space>
        </Dropdown>

        {/* (Phần nút Login/Logout giữ nguyên) */}
        {isLoggedIn ? (
          <Button
            onClick={handleLogout}
            type="primary"
            icon={<LogoutOutlined />}
            style={{ marginLeft: "16px" }}
          >
            Logout
          </Button>
        ) : (
          <Button
            onClick={() => navigate("/login")}
            type="primary"
            icon={<LoginOutlined />}
            style={{ marginLeft: "16px" }}
          >
            Login
          </Button>
        )}
      </div>
    </Header>
  );
};

export default AppHeader;