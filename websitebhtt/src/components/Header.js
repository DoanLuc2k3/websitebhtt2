import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  Button,
  Typography,
} from "antd";
import {
  UserOutlined,
  DownOutlined,
  LoginOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo2.jpg";
import "../App.css";
import React, { useState } from "react";
import Categories from "../pages/Categories";



const { Header } = Layout;
const { Title } = Typography;

const AppHeader = () => {
  const navigate = useNavigate();
  const [showCategories, setShowCategories] = useState(false);

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
            style={{
              position: "absolute",
              left: "-100px",
              top: "100%",
              width: "400px",
              zIndex: 1000,
            }}
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


  const userMenu = {
    items: [
      { key: "1", label: "Profile", onClick: () => navigate("/profile") },
      { key: "2", label: "Log out", onClick: () => navigate("/login") },
    ],
  };

  return (
    <Header
      onMouseLeave={() => setShowCategories(false)}
      style={{ position: "relative" }}
    >
      <div className="header-logo" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" />
        <Title level={4}>L-M Fashion</Title>
      </div>
      <Menu mode="horizontal" items={menuItems} />
      <div className="header-right">
        <ShoppingCartOutlined
          style={{ fontSize: "24px", marginRight: "16px" }}
          onClick={() => navigate("/cart")}
        />
        <Dropdown menu={userMenu} trigger={["click"]}>
          <Space style={{ cursor: "pointer" }}>
            <Avatar icon={<UserOutlined />} />
            <DownOutlined />
          </Space>
        </Dropdown>
        <Button
          onClick={() => navigate("/login")}
          type="primary"
          icon={<LoginOutlined />}
        >
          Login
        </Button>
      </div>
     
    </Header>
  );
};

export default AppHeader;
