// src/pages/CartProducts.js
import "../style/CartProducts.css";
import React, { useState } from "react";
import cartImg from "../assets/images/cart-icon.png";
import cartGif from "../assets/images/cart.gif";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Typography,
  Button,
  Image,
  Badge,
  Checkbox,
  Space,
  Divider,
  Input,
  Empty,
  Rate,
  Modal,
} from "antd";
import {
  TagsOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
  SmileOutlined,
  StarOutlined,
  Loading3QuartersOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useCart } from "../context/CartContext"; 
import { useOrder } from "../context/OrderContext"; // <-- 1. THÊM IMPORT NÀY

const { Title, Text } = Typography;

const CartProducts = () => {
  const navigate = useNavigate();
  const [selectAll, setSelectAll] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  
  // === 2. THÊM DÒNG NÀY ĐỂ LẤY SỐ ĐẾM ===
  const { confirmingCount } = useOrder();
  // ======================================

  // --- Tính toán tổng tiền (giữ nguyên) ---
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const discount = subtotal * 0.2;
  const deliveryFee = subtotal > 0 ? 20 : 0; 
  const total = subtotal - discount + deliveryFee;

  // --- Hàm xử lý khi nhấn nút Delete (giữ nguyên) ---
  const handleDeleteClick = () => {
    if (selectAll && cartItems.length > 0) {
      Modal.confirm({
        title: "Xác nhận xóa sản phẩm",
        content: "Are you sure you want to delete all products?",
        okText: "Confirm",
        cancelText: "Cancel",
        onOk: () => {
          clearCart(); 
          setSelectAll(false); 
        },
      });
    }
  };
  // --------------------------------

  return (
    <div className="shopping-card-page">
      {/* Phần Cart Gif và Order Status (GIỮ NGUYÊN) */}
      <div className="cart-gif-container">
        <Image className="cart-gif" src={cartGif} preview={false} />
        <Title className="shopping-cart-title" level={2}>
          SHOPPING CART
        </Title>
      </div>

      <Row gutter={16} className="order-status-shopping">
        {/* (Các Col status giữ nguyên) */}
        <Col className="order-confirm" span={4}>
          <Text className="order-status-title">Order Status: </Text>
        </Col>

        {/* === 3. THAY ĐỔI DUY NHẤT TẠI ĐÂY === */}
        <Col className="order-confirm" span={4}>
          <div className="checkpoint-col">
            {/* Bọc icon "Confirming" trong Badge */}
            <Badge count={confirmingCount} color="red" offset={[-2, 5]}>
              <Loading3QuartersOutlined style={{ fontSize: 24 }} />
            </Badge>
            <Text>Confirming</Text>
            <span className="checkpoint" />
          </div>
        </Col>
        {/* ================================== */}

        <Col className="order-confirm" span={4}>
          <div className="checkpoint-col">
            <CheckCircleOutlined style={{ fontSize: 24 }} />
            <Text>Order Confirmed</Text>
            <span className="checkpoint" />
          </div>
        </Col>
        <Col className="order-confirm" span={4}>
          <div className="checkpoint-col">
            <Badge count={3} color="red" offset={[-2, 5]}>
              <ShoppingCartOutlined style={{ fontSize: 24 }} />
            </Badge>
            <Text>Shipping</Text>
            <span className="checkpoint" />
          </div>
        </Col>
        <Col className="order-confirm" span={4}>
          <div className="checkpoint-col">
            <SmileOutlined style={{ fontSize: 24 }} />
            <Text>Shipped</Text>
            <span className="checkpoint" />
          </div>
        </Col>
        <Col className="order-confirm" span={4}>
          <div className="checkpoint-col">
            <Badge count={2} color="red" offset={[-2, 5]}>
              <StarOutlined style={{ fontSize: 24 }} />
            </Badge>
            <Text>Awaiting Review</Text>
            <span className="checkpoint" />
          </div>
        </Col>
      </Row>
      {/* ------------------------------------------ */}

      {/* (Toàn bộ phần còn lại của file giữ nguyên) */}
      <div>
        <img
          className="cart-img"
          src={cartImg}
          alt=""
          style={{ width: "35px", height: "35px" }}
        />
        <Title className="cart-title-shopping" level={3}>
          Shopping Cart
        </Title>
      </div>
      <div className="shopping-cart-content">
        <Row className="shopping-cart-content" gutter={32}>
          <Col span={15} className="shopping-col-left">
            <div className="select-card">
              <div className="select-card-item">
                <Checkbox
                  className="select-checkbox"
                  checked={selectAll}
                  onChange={(e) => setSelectAll(e.target.checked)}
                >
                  Select All
                </Checkbox>
                <Button
                  type="primary"
                  className="delete-cart-button"
                  onClick={handleDeleteClick}
                  disabled={!selectAll || cartItems.length === 0}
                >
                  Delete
                </Button>
              </div>
            </div>
            <div className="product-card-shopping">
              <div className="product-card-shopping-item">
                {cartItems.length === 0 ? (
                  <Empty description="Your cart is empty" />
                ) : (
                  cartItems.map((item) => (
                    <React.Fragment key={item.product.id}>
                      <Row className="item-cart">
                        <Col span={5} className="item-cart-col">
                          <img
                            src={item.product.thumbnail}
                            alt={item.product.title}
                          />
                        </Col>
                        <Col span={10} className="item-cart-col">
                          <Text className="item-text">
                            {item.product.title}
                          </Text>{" "}
                          <br />
                          <Text
                            className="item-attribute"
                            ellipsis={{ tooltip: item.product.description }}
                          >
                            {item.product.description}{" "}
                          </Text>
                          <br />
                          <Rate
                            disabled
                            defaultValue={Math.round(item.product.rating)}
                            style={{ fontSize: 14 }}
                          />
                          <br />
                          <Text className="item-price">
                            ${item.product.price}
                          </Text>
                        </Col>
                        <Col span={9} className="action-cart">
                          <DeleteOutlined
                            className="delete-icon"
                            style={{ fontSize: "24px" }}
                            onClick={() => removeFromCart(item.product.id)}
                          />
                          <Space className="quantity-product-cart">
                            <Button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                            >
                              -
                            </Button>
                            <Text>{item.quantity}</Text>
                            <Button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                            >
                              +
                            </Button>
                          </Space>
                        </Col>
                      </Row>
                      <Divider />
                    </React.Fragment>
                  ))
                )}
              </div>
            </div>
          </Col>
          <Col span={9} className="shopping-col-right">
            <div className="sumary-card">
              <div className="sumary-item">
                <Title level={5} className="order-sumary">
                  Order Summary
                </Title>
                <div className="coupon-apply">
                  <div className="coupon-left">
                    <TagsOutlined style={{ fontSize: "20px" }} />
                    <Input
                      className="coupoint-text"
                      placeholder="Coupon Code"
                    ></Input>
                  </div>
                  <Button className="apply-button" type="primary">
                    Apply
                  </Button>
                </div>

                <Row className="price-summary">
                  <Col span={12} className="price-summary-col">
                    <Text className="title-price-summary">Subtotal</Text>
                    <br />
                    <Text className="title-price-summary">Discount(-20%)</Text>
                    <br />
                    <Text className="title-price-summary">Delivery Free</Text>
                  </Col>
                  <Col span={12} className="value-price-summary">
                    <Text className="text-price-summary">
                      ${subtotal.toFixed(2)}
                    </Text>
                    <br />
                    <Text className="text-discount">
                      -${discount.toFixed(2)}
                    </Text>
                    <br />
                    <Text className="text-price-summary">
                      ${deliveryFee.toFixed(2)}
                    </Text>
                    <br />
                  </Col>
                </Row>
                <Divider style={{ marginTop: "8px" }} />
                <Row className="price-summary">
                  <Col className="total-title" span={12}>
                    Total
                  </Col>
                  <Col className="total-value" span={12}>
                    ${total.toFixed(2)}
                  </Col>
                </Row>
                <Button
                  className="go-to-checkout"
                  type="primary"
                  onClick={() => navigate("/checkout")}
                >
                  Go to Checkout →
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default CartProducts;