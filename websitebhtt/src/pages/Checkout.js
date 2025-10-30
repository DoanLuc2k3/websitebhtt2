import React from "react";
import "../style/Checkout.css";
import logoImg from "../assets/images/logo2.jpg";
import {
  Layout,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Space,
  Button,
  Divider,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Title, Text } = Typography;
const { Option } = Select;
const Checkout = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(1);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const handleConfirmOrder = () => {
    setShowSuccess(true);
  };
  const handleClosePopup = () => {
    setShowSuccess(false);
  };
  return (
    <Layout className="checkout-page">
      <Row className="checkout" gutter={16}>
        <Col className="checkout-col-left" span={14}>
          <Title level={5} className="delivery-information-title">
            Delivery Information
          </Title>
          <Form className="delivery-information-form" layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Enter your name"></Input>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Phone"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Enter your Number"></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Enter your Email"></Input>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="city"
                  label="City"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Enter your City"></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="state"
                  label="State"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Vietnam"></Input>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="zip" label="Zip">
                  <Input placeholder="001122"></Input>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="shortState" label="State (abbr)">
                  <Select placeholder="CA">
                    <Option value="ca">CA</Option>
                    <Option value="vn">VN</Option>
                    <Option value="phi">Phi</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="address"
                  label="Address"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Enter your Address"></Input>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Title level={5} className="schedule-delivery-title">
            Schedule Delivery
          </Title>
          <Form className="schedule-delivery-form" layout="vertical">
            <Row gutter={16}>
              <Col className="schedule-delivery-dates" span={24}>
                <Form.Item
                  name="date"
                  label="Date"
                  rules={[{ required: true }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="schedule-delivery-note" span={24}>
                <Form.Item
                  name="note"
                  label="Note"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Enter your note"></Input>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Title level={5} className="schedule-delivery-title">
            Payment Method
          </Title>
          <Form className="payment-method-form" layout="vertical">
            <Form.Item
              className="payment-method-form-item"
              name="payment"
              label=""
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio value="Online Payment">Online Payment</Radio>
                <Radio value="Card on Delivery">Card on Delivery</Radio>
                <Radio value="POS on Delivery">POS on Delivery</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Col>

        {/* <Form className="checkout-col-right-form"> */}
        <Col className="checkout-col-right" span={10}>
          <Title level={5} className="order-summary-title">
            Order Summary
          </Title>
          <Form className="checkout-col-right-form">
            <Row className="order-summary-row" gutter={16}>
              <Col className="order-summary-col-image" span={5}>
                <img
                  className=""
                  src="https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg"
                  alt=""
                />
              </Col>
              <Col className="order-summary-col-content" span={14}>
                <Text className="order-summary-content-name">Jacket</Text>
                <br />
                <Text className="order-summary-content-code">TOASB-2S</Text>
                <br />
                <Text className="order-summary-content-price">
                  2.500.000 VND
                </Text>
              </Col>
              <Col className="order-summary-col-quality" span={5}>
                <Space className="quantity-product-cart">
                  <Button
                    onClick={() => setValue((prev) => Math.max(prev - 1, 1))}
                  >
                    -
                  </Button>
                  <Text>{value}</Text>
                  <Button onClick={() => setValue((prev) => prev + 1)}>
                    +
                  </Button>
                </Space>
              </Col>
            </Row>
            <Row className="order-summary-row" gutter={16}>
              <Col className="order-summary-col-image" span={5}>
                <img
                  className=""
                  src="https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg"
                  alt=""
                />
              </Col>
              <Col className="order-summary-col-content" span={14}>
                <Text className="order-summary-content-name">Jacket</Text>
                <br />
                <Text className="order-summary-content-code">TOASB-2S</Text>
                <br />
                <Text className="order-summary-content-price">
                  2.500.000 VND
                </Text>
              </Col>
              <Col className="order-summary-col-quality" span={5}>
                <Space className="quantity-product-cart">
                  <Button
                    onClick={() => setValue((prev) => Math.max(prev - 1, 1))}
                  >
                    -
                  </Button>
                  <Text>{value}</Text>
                  <Button onClick={() => setValue((prev) => prev + 1)}>
                    +
                  </Button>
                </Space>
              </Col>
            </Row>
            <Row className="order-summary-row" gutter={16}>
              <Col className="order-summary-col-image" span={5}>
                <img
                  className=""
                  src="https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg"
                  alt=""
                />
              </Col>
              <Col className="order-summary-col-content" span={14}>
                <Text className="order-summary-content-name">Jacket</Text>
                <br />
                <Text className="order-summary-content-code">TOASB-2S</Text>
                <br />
                <Text className="order-summary-content-price">
                  2.500.000 VND
                </Text>
              </Col>
              <Col className="order-summary-col-quality" span={5}>
                <Space className="quantity-product-cart">
                  <Button
                    onClick={() => setValue((prev) => Math.max(prev - 1, 1))}
                  >
                    -
                  </Button>
                  <Text>{value}</Text>
                  <Button onClick={() => setValue((prev) => prev + 1)}>
                    +
                  </Button>
                </Space>
              </Col>
            </Row>
            <Divider style={{ marginTop: "190px" }} />
            <Row className="subtotal-price-checkout" gutter={16}>
              <Col className="subtotal-price-checkout-title" span={12}>
                <Text>Subtotal</Text>
              </Col>
              <Col className="subtotal-price-checkout-content" span={12}>
                <Text>2.500.000 VND</Text>
              </Col>
            </Row>
            <Row className="subtotal-price-checkout" gutter={16}>
              <Col className="subtotal-price-checkout-title" span={12}>
                <Text>Shipping</Text>
              </Col>
              <Col className="subtotal-price-checkout-content" span={12}>
                <Text>0 VND</Text>
              </Col>
            </Row>
            <Row className="total-price-checkout" gutter={16}>
              <Col className="total-price-checkout-title" span={12}>
                <Text>Total</Text>
              </Col>
              <Col className="total-price-checkout-content" span={12}>
                <Text>2.500.000 VND VND</Text>
              </Col>
            </Row>
            <Button
              type="primary"
              className="confirm-order-button"
              onClick={handleConfirmOrder}
            >
              Confirm Order
            </Button>
          </Form>
        </Col>
        {/* </Form> */}
      </Row>
      {/* ✅ Popup overlay */}
      {showSuccess && (
        <div className="order-success-overlay">
          <div className="order-success-div">
            <Row className="order-success">
              <Col className="success-left" span={6}>
                <img src={logoImg} alt="success" style={{ width: "150px" }} />
              </Col>
              <Col className="success-right" span={18}>
                <Title className="thank-title" level={4}>
             🎉 Order placed successfully!
                </Title>
                <Text className="text-success">Your order ID: </Text>
                <div className="id-order-succcess">#LM20251027</div>
                <br />
                <Text className="text-success">You can </Text>
                <Text className="review-your-order" onClick={() => navigate("/revieworder")}>Review your order</Text>
                <br />
                <Text className="text-success">
                  Estimated delivery date <ShoppingCartOutlined />:{" "}
                  <b>Friday, Oct 30, 2025</b>
                </Text>
                <br />
                <Text className="text-success">
                  Detailed information has been sent to your email:
                  <b> user@gmail.com </b>
                </Text>
                <div className="text-success" style={{ marginTop: "10px" }}>
                  Please check your <b>Spam</b> folder if you don’t see the
                  email.
                </div>
                <div style={{ marginTop: "20px" }}>
                  <Button type="primary" onClick={handleClosePopup}>
                    Close
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </Layout>
  );
};
export default Checkout;
