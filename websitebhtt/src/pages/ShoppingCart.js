import "../style/CartProducts.css";
import React from "react";
import cartImg from "../assets/images/cart-icon.png";
import {
  Row,
  Col,
  Typography,
  Button,
  Badge,
  Checkbox,
  Space,
  Divider,
  Input,
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
const { Title, Text } = Typography;
const ShoppingCart = () => {
  const [value, setValue] = React.useState(1);
  return (
    <div className="shopping-card-page">
      <Title className="shopping-cart-title" level={2}>
        SHOPPING CART
      </Title>
      <Row gutter={16} className="order-status-shopping">
        <Col className="order-confirm" span={4}>
          <Text>Order Status: </Text>
        </Col>
        <Col className="order-confirm" span={4}>
          <Loading3QuartersOutlined style={{ fontSize: 24 }} />
          <Text>Confirming</Text>
        </Col>
        <Col className="order-confirm" span={4}>
          <CheckCircleOutlined style={{ fontSize: 24 }} />
          <Text>Order Confirmed</Text>
        </Col>

        <Col className="order-confirm" span={4}>
          <Badge count={3} color="red" offset={[-2, 5]}>
            <ShoppingCartOutlined style={{ fontSize: 24 }} />
          </Badge>
          <Text>Shipping</Text>
        </Col>
        <Col className="order-confirm" span={4}>
          <SmileOutlined style={{ fontSize: 24 }} />
          <Text>Shipped</Text>
        </Col>
        <Col className="order-confirm" span={4}>
          <Badge count={2} color="red" offset={[-2, 5]}>
            <StarOutlined style={{ fontSize: 24 }} />
          </Badge>
          <Text>Awaiting Review</Text>
        </Col>
      </Row>
       <div>
        {/* <Title level={4} className="your-cart">
          Your Cart
        </Title> */}
        <img className="cart-img" src={cartImg} alt="" style={{width:"35px", height:"35px"}} />
        <Title className="cart-title-shopping" level={3}>Shopping Cart</Title>
       </div>
      <div className="shopping-cart-content">
       
        <Row className="shopping-cart-content" gutter={32}>
          <Col span={15} className="shopping-col-left">
            <div className="select-card">
              <div className="select-card-item">
                <Checkbox className="select-checkbox">Select All</Checkbox>
                <Button type="primary" className="delete-cart-button">
                  Delete
                </Button>
              </div>
            </div>
            <div className="product-card-shopping">
              <div className="product-card-shopping-item">
                <Row className="item-cart">
                  <Col span={5} className="item-cart-col">
                    <img
                      src="https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg"
                      alt="Denim Jacket"
                    />
                  </Col>
                  <Col span={10} className="item-cart-col">
                    <Text className="item-text">Jacket</Text> <br />
                    <Text className="item-attribute">Size:</Text>
                    <Text className="item-value"> XL</Text>
                    <br />
                    <Text className="item-attribute">Color</Text>
                    <Text className="item-value"> Blue</Text>
                    <br />
                    <Text className="item-price">$145</Text>
                  </Col>
                  <Col span={9} className="action-cart">
                    <DeleteOutlined
                      className="delete-icon"
                      style={{ fontSize: "24px" }}
                    />
                    <Space className="quantity-product-cart">
                      <Button
                        onClick={() =>
                          setValue((prev) => Math.max(prev - 1, 1))
                        }
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
                <Divider />
                <Row className="item-cart">
                  <Col span={5} className="item-cart-col">
                    <img
                      src="https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg"
                      alt="Denim Jacket"
                    />
                  </Col>
                  <Col span={10} className="item-cart-col">
                    <Text className="item-text">Jacket</Text> <br />
                    <Text className="item-attribute">Size:</Text>
                    <Text className="item-value"> XL</Text>
                    <br />
                    <Text className="item-attribute">Color</Text>
                    <Text className="item-value"> Blue</Text>
                    <br />
                    <Text className="item-price">$145</Text>
                  </Col>
                  <Col span={9} className="action-cart">
                    <DeleteOutlined
                      className="delete-icon"
                      style={{ fontSize: "24px" }}
                    />
                    <Space className="quantity-product-cart">
                      <Button
                        onClick={() =>
                          setValue((prev) => Math.max(prev - 1, 1))
                        }
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
                <Divider />
                <Row className="item-cart">
                  <Col span={5} className="item-cart-col">
                    <img
                      src="https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg"
                      alt="Denim Jacket"
                    />
                  </Col>
                  <Col span={10} className="item-cart-col">
                    <Text className="item-text">Jacket</Text> <br />
                    <Text className="item-attribute">Size:</Text>
                    <Text className="item-value"> XL</Text>
                    <br />
                    <Text className="item-attribute">Color</Text>
                    <Text className="item-value"> Blue</Text>
                    <br />
                    <Text className="item-price">$145</Text>
                  </Col>
                  <Col span={9} className="action-cart">
                    <DeleteOutlined
                      className="delete-icon"
                      style={{ fontSize: "24px" }}
                    />
                    <Space className="quantity-product-cart">
                      <Button
                        onClick={() =>
                          setValue((prev) => Math.max(prev - 1, 1))
                        }
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
              </div>
            </div>
          </Col>
          <Col span={9} className="shopping-col-right">
            <div className="sumary-card">
              <div className="sumary-item">
                <Title level={5} className="order-sumary">
                  Order Sumary
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
                    <Text className="text-price-summary">$600</Text>
                    <br />
                    <Text className="text-discount">$100</Text>
                    <br />
                    <Text className="text-price-summary">$20</Text>
                    <br />
                  </Col>
                </Row>
                <Divider style={{ marginTop: "8px" }} />
                <Row className="price-summary">
                  <Col className="total-title" span={12}>
                    Total
                  </Col>
                  <Col className="total-value" span={12}>
                    $520
                  </Col>
                </Row>
                <Button className="go-to-checkout" type="primary">
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
export default ShoppingCart;
