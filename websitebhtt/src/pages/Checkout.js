import React, { useState } from "react";
import "../style/Checkout.css";

import {
  Layout,
  Row,
  Col,
  Typography,
  Form,
  Input,

  DatePicker,
  Radio,
  Button,
  Divider,
  Result,
  Descriptions,
} from "antd";

import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { saveOrder } from "../API";

const { Title, Text } = Typography;


const Checkout = () => {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = React.useState(false);

  // State (giữ nguyên)
  const [orderedItems, setOrderedItems] = useState([]);
  const [orderTotals, setOrderTotals] = useState({
    total: 0,
    discount: 0,
    shipping: 0,
  });
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  const [deliveryForm] = Form.useForm();
  const [scheduleForm] = Form.useForm();
  const [paymentForm] = Form.useForm();

  const { cartItems, clearCart } = useCart();
  const { currentUser, isLoggedIn } = useAuth();
  const location = useLocation();
  const buyNowItems = (location && location.state && location.state.buyNowItems) || null;

  // Use buyNowItems (passed from product listing) if present; otherwise use cartItems
  const itemsForOrder = buyNowItems && buyNowItems.length > 0 ? buyNowItems : cartItems;

  // Logic tính toán (giữ nguyên)
  const subtotal = itemsForOrder.reduce(
    (acc, item) => acc + (item.product.price || 0) * item.quantity,
    0
  );
  const discount = subtotal * 0.2;
  const deliveryFee = subtotal > 0 ? 20 : 0;
  const total = subtotal - discount + deliveryFee;

  // CẬP NHẬT HÀM NÀY (Giữ nguyên logic sửa lỗi date)
  const handleConfirmOrder = async () => {
    try {
      // Validate và lấy giá trị từ 3 form
      const deliveryValues = await deliveryForm.validateFields();
      const scheduleValues = await scheduleForm.validateFields();
      const paymentValues = await paymentForm.validateFields();

      // Gom tất cả thông tin form lại
      const allFormInfo = {
        ...deliveryValues,
        ...scheduleValues,
        ...paymentValues,
      };

      // ===== SỬA LỖI "INVALID DATE" =====
      // Chuyển đổi đối tượng 'dayjs' thành chuỗi ISO string chuẩn
      if (allFormInfo.date) {
        allFormInfo.date = allFormInfo.date.toISOString();
      }
      // ===================================

      // LƯU LẠI TẤT CẢ THÔNG TIN
      setOrderedItems([...itemsForOrder]); // Lưu sản phẩm
      setOrderTotals({
        // Lưu tổng tiền
        total: total,
        discount: discount,
        shipping: deliveryFee,
        subtotal: subtotal,
      });
      setDeliveryInfo(allFormInfo); // Lưu thông tin giao hàng (với date đã là string)

      setShowSuccess(true);
      // Persist order to storage so admin can see it
      try {
        const orderPayload = {
          items: itemsForOrder.map(ci => ({ id: ci.product.id, title: ci.product.title, price: ci.product.price, quantity: ci.quantity, thumbnail: ci.product.thumbnail })),
          totals: { total, discount, shipping: deliveryFee, subtotal },
          delivery: allFormInfo,
          customer: isLoggedIn && currentUser ? { name: currentUser.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim() : currentUser.email || 'User', email: currentUser.email } : { name: allFormInfo.name || 'Guest', email: allFormInfo.email || '' },
          status: 'processing',
        };
        saveOrder(orderPayload);
      } catch (e) {
        console.error('save order failed', e);
      }
      // Only clear global cart if there were real cart items (don't clear when using buy-now state only)
      if (cartItems && cartItems.length > 0) clearCart();
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
    }
  };

  const handleClosePopup = () => {
    setShowSuccess(false);
    navigate("/");
  };

  return (
    <Layout className="checkout-page">
      <Row className="checkout" gutter={16}>
        {/* CỘT TRÁI */}
        <Col className="checkout-col-left" span={14}>
          <Title level={5} className="delivery-information-title">
            Delivery Information
          </Title>
          <Form
            form={deliveryForm}
            className="delivery-information-form"
            layout="vertical"
          >
            {/* Hàng 1: Name và Phone */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[
                    { required: true, message: "Please enter your name" },
                  ]}
                >
                  <Input placeholder="Enter your name"></Input>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Phone"
                  rules={[
                    { required: true, message: "Please enter your phone" },
                  ]}
                >
                  <Input placeholder="Enter your Number"></Input>
                </Form.Item>
              </Col>
            </Row>
            {/* Hàng 2: Email và City */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Invalid email format" },
                  ]}
                >
                  <Input placeholder="Enter your Email"></Input>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="city"
                  label="City"
                  rules={[{ required: true, message: "Please enter your city" }]}
                >
                  <Input placeholder="Enter your City"></Input>
                </Form.Item>
              </Col>
            </Row>
            {/* Hàng 3: Address (Full width) - Đã chuyển lên trên */}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[
                    { required: true, message: "Please enter your address" },
                  ]}
                >
                  <Input placeholder="Enter your house number and street name"></Input>
                </Form.Item>
              </Col>
            </Row>
            {/* Hàng 4: State/Province và Zip/Postal Code - Đã gộp và đơn giản hóa */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="state"
                  label="State/Province"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your state/province",
                    },
                  ]}
                >
                  <Input placeholder="e.g., Vietnam"></Input>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="zip" label="Zip/Postal Code">
                  <Input placeholder="e.g., 001122"></Input>
                </Form.Item>
              </Col>
              {/* Đã loại bỏ trường State (abbr) */}
            </Row>
          </Form>

          <Title level={5} className="schedule-delivery-title">
            Schedule Delivery
          </Title>
          <Form
            form={scheduleForm}
            className="schedule-delivery-form"
            layout="vertical"
          >
            {/* Giữ nguyên: Date Picker */}
            <Row gutter={16}>
              <Col className="schedule-delivery-dates" span={24}>
                <Form.Item
                  name="date"
                  label="Date"
                  rules={[
                    { required: true, message: "Please select a date" },
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            {/* Giữ nguyên: Note */}
            <Row gutter={16}>
              <Col className="schedule-delivery-note" span={24}>
                <Form.Item name="note" label="Note" rules={[{ required: false }]}>
                  <Input.TextArea placeholder="Enter your note (e.g., call before delivery)" />
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <Title level={5} className="schedule-delivery-title">
            Payment Method
          </Title>
          <Form
            form={paymentForm}
            className="payment-method-form"
            layout="vertical"
          >
            {/* Giữ nguyên: Payment Radio Group */}
            <Form.Item
              className="payment-method-form-item"
              name="payment"
              label=""
              rules={[
                { required: true, message: "Please select a payment method" },
              ]}
            >
              <Radio.Group>
                <Radio value="Online Payment">Online Payment (Credit/Debit Card)</Radio>
                <Radio value="Card on Delivery">Card on Delivery (POS)</Radio>
                <Radio value="Cash on Delivery">Cash on Delivery</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Col>

        {/* CỘT PHẢI - (Giữ nguyên) */}
        <Col className="checkout-col-right" span={10}>
          <Title level={5} className="order-summary-title">
            Order Summary
          </Title>
          <Form className="checkout-col-right-form">
            {/* ... (Hiển thị sản phẩm động - giữ nguyên) ... */}
            {itemsForOrder.map((item) => (
              <Row
                className="order-summary-row"
                gutter={16}
                key={item.product.id}
              >
                <Col className="order-summary-col-image" span={5}>
                  <img
                    className=""
                    src={item.product.thumbnail}
                    alt={item.product.title}
                  />
                </Col>
                <Col className="order-summary-col-content" span={14}>
                  <Text className="order-summary-content-name">
                    {item.product.title}
                  </Text>
                  <br />
                  <Text className="order-summary-content-code">
                    {item.product.category}
                  </Text>
                  <br />
                  <Text className="order-summary-content-price">
                    ${item.product.price}
                  </Text>
                </Col>
                <Col className="order-summary-col-quality" span={5}>
                  <Text style={{ fontSize: 16 }}>Qty: {item.quantity}</Text>
                </Col>
              </Row>
            ))}

            <Divider style={{ marginTop: "20px" }} />

            {/* ... (Tính tiền động - giữ nguyên) ... */}
            <Row className="subtotal-price-checkout" gutter={16}>
              <Col className="subtotal-price-checkout-title" span={12}>
                <Text>Subtotal</Text>
              </Col>
              <Col className="subtotal-price-checkout-content" span={12}>
                <Text>${subtotal.toFixed(2)}</Text>
              </Col>
            </Row>
            <Row className="subtotal-price-checkout" gutter={16}>
              <Col className="subtotal-price-checkout-title" span={12}>
                <Text style={{ color: "red" }}>Discount(-20%)</Text>
              </Col>
              <Col
                className="subtotal-price-checkout-content"
                span={12}
                style={{ color: "red" }}
              >
                <Text type="danger">-${discount.toFixed(2)}</Text>
              </Col>
            </Row>
            <Row className="subtotal-price-checkout" gutter={16}>
              <Col className="subtotal-price-checkout-title" span={12}>
                <Text>Shipping</Text>
              </Col>
              <Col className="subtotal-price-checkout-content" span={12}>
                <Text>${deliveryFee.toFixed(2)}</Text>
              </Col>
            </Row>
            <Row className="total-price-checkout" gutter={16}>
              <Col className="total-price-checkout-title" span={12}>
                <Text>Total</Text>
              </Col>
              <Col className="total-price-checkout-content" span={12}>
                <Text>${total.toFixed(2)}</Text>
              </Col>
            </Row>
            <Button
              type="primary"
              className="confirm-order-button"
              onClick={handleConfirmOrder}
              disabled={!(itemsForOrder && itemsForOrder.length > 0)}
            >
              Confirm Order
            </Button>
          </Form>
        </Col>
      </Row>

      {/* POPUP (Giữ nguyên) */}
      {showSuccess && (
        <div className="order-success-overlay">
          <div className="order-success-div">
            <Result
              status="success"
              title="Thank you for your order!"
              subTitle={
                <>
                  <Text className="text-success">Your order ID: </Text>
                  <div className="id-order-succcess">#LM20251027</div>
                </>
              }
              extra={
                <div className="order-success-details">
                  <Descriptions column={1} size="default" bordered>
                    <Descriptions.Item label="Estimated Delivery">
                      <b>Friday, Oct 30, 2025</b>
                    </Descriptions.Item>
                    <Descriptions.Item label="Email Sent To">
                      <b>{deliveryInfo?.email || "user@gmail.com"}</b>
                    </Descriptions.Item>
                  </Descriptions>

                  <Text className="spam-warning">
                    Please check your <b>Spam</b> folder if you don’t see the
                    email.
                  </Text>

                  <Text
                    className="review-your-order"
                    onClick={() =>
                      navigate("/revieworder", {
                        state: {
                          items: orderedItems,
                          totals: orderTotals,
                          delivery: deliveryInfo,
                        },
                      })
                    }
                  >
                    Review your order
                  </Text>

                  <Button
                    type="primary"
                    onClick={handleClosePopup}
                    size="large"
                    style={{ marginTop: 24, width: "100%" }}
                  >
                    Continue Shopping
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      )}
    </Layout>
  );
};
export default Checkout;