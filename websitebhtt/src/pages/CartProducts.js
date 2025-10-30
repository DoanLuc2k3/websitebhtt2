import "../style/CartProducts.css";
import React from "react";
import cartImg from "../assets/images/cart-icon.png";
import cartGif from "../assets/images/cart.gif";
import {  useNavigate } from "react-router-dom";
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
const CartProducts = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(1);
  return (
    <div className="shopping-card-page">
      <div className="cart-gif-container">
  <Image
    className="cart-gif"
    src={cartGif}
    preview={false}
  />
  <Title className="shopping-cart-title" level={2}>
    SHOPPING CART
  </Title>
</div>

      <Row gutter={16} className="order-status-shopping">
        <Col className="order-confirm" span={4}>
          <Text className="order-status-title">Order Status: </Text>
        </Col>

        <Col className="order-confirm" span={4}>
          <div className="checkpoint-col">
            <Loading3QuartersOutlined style={{ fontSize: 24 }} />
            <Text>Confirming</Text>
            <span className="checkpoint" />
          </div>
        </Col>

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

      <div>
        {/* <Title level={4} className="your-cart">
          Your Cart
        </Title> */}
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
                <Button className="go-to-checkout" type="primary" onClick={() => navigate("/checkout")}>
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

// import React from "react";
// import {  useNavigate } from "react-router-dom";
// import {
//   Typography,
//   Row,
//   Col,
//   Divider,
//   Space,
//   Button,
//   Card,
// } from "antd";

// const { Title, Text } = Typography;

// const CartProducts = () => {
//   const [value, setValue] = React.useState(1);
//   const navigate = useNavigate();

//   return (
//     <>
//       <div className="cart-product">
//         <Title className="title-cart-product">SHOPPING CART</Title>
//         <div className="cart-product-container">
//           <Row
//             className="cart-product-content"
//             justify="center"
//             align="middle"
//             gutter={[16, 16]}
//           >
//             {/* LEFT SIDE */}
//             <Col span={14} className="cart-product-content-left">
//               <Divider className="divider-left" />
//               <Row>
//                 <Col
//                   className="cart-product-content-left-information"
//                   span={16}
//                 >
//                   <Title level={5} className="cart-product-name-product">
//                     Men's Stylish Denim Jacket
//                   </Title>
//                   <Text className="cart-product-price">5,300,000 VND</Text>
//                   <br />
//                   <div className="size-color-cart-product">
//                     <Text>
//                       <Text style={{ fontWeight: "bold" }}>Size |</Text> 36
//                     </Text>
//                     <br />
//                     <Text>
//                       <Text style={{ fontWeight: "bold" }}>Color |</Text> BLUE
//                     </Text>
//                     <br />
//                   </div>
//                   <Space className="quantity-product-cart">
//                     <Button
//                       onClick={() => setValue((prev) => Math.max(prev - 1, 1))}
//                     >
//                       -
//                     </Button>
//                     <Text>{value}</Text>
//                     <Button onClick={() => setValue((prev) => prev + 1)}>
//                       +
//                     </Button>
//                   </Space>
//                 </Col>
//                 <Col className="cart-product-content-left-image" span={8}>
//                   <img
//                     src="https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg"
//                     alt="Denim Jacket"
//                   />
//                 </Col>
//               </Row>

//               <Divider className="divider-left" />
//               <Row>
//                 <Col
//                   className="cart-product-content-left-information"
//                   span={16}
//                 >
//                   <Title level={5} className="cart-product-name-product">
//                     Men's Stylish Denim Jacket
//                   </Title>
//                   <Text className="cart-product-price">5,300,000 VND</Text>
//                   <br />
//                   <div className="size-color-cart-product">
//                     <Text>
//                       <Text style={{ fontWeight: "bold" }}>Size |</Text> 36
//                     </Text>
//                     <br />
//                     <Text>
//                       <Text style={{ fontWeight: "bold" }}>Color |</Text> BLUE
//                     </Text>
//                     <br />
//                   </div>
//                   <Space className="quantity-product-cart">
//                     <Button
//                       onClick={() => setValue((prev) => Math.max(prev - 1, 1))}
//                     >
//                       -
//                     </Button>
//                     <Text>{value}</Text>
//                     <Button onClick={() => setValue((prev) => prev + 1)}>
//                       +
//                     </Button>
//                   </Space>
//                 </Col>
//                 <Col className="cart-product-content-left-image" span={8}>
//                   <img
//                     src="https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg"
//                     alt="Denim Jacket"
//                   />
//                 </Col>
//               </Row>

//               <Divider className="divider-left" />
//               <Row>
//                 <Col
//                   className="cart-product-content-left-information"
//                   span={16}
//                 >
//                   <Title level={5} className="cart-product-name-product">
//                     Men's Stylish Denim Jacket
//                   </Title>
//                   <Text className="cart-product-price">5,300,000 VND</Text>
//                   <br />
//                   <div className="size-color-cart-product">
//                     <Text>
//                       <Text style={{ fontWeight: "bold" }}>Size |</Text> 36
//                     </Text>
//                     <br />
//                     <Text>
//                       <Text style={{ fontWeight: "bold" }}>Color |</Text> BLUE
//                     </Text>
//                     <br />
//                   </div>
//                   <Space className="quantity-product-cart">
//                     <Button
//                       onClick={() => setValue((prev) => Math.max(prev - 1, 1))}
//                     >
//                       -
//                     </Button>
//                     <Text>{value}</Text>
//                     <Button onClick={() => setValue((prev) => prev + 1)}>
//                       +
//                     </Button>
//                   </Space>
//                 </Col>
//                 <Col className="cart-product-content-left-image" span={8}>
//                   <img
//                     src="https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg"
//                     alt="Denim Jacket"
//                   />
//                 </Col>
//               </Row>
//             </Col>

//             {/* RIGHT SIDE */}
//             <Col span={10} className="cart-product-content-right">
//               <Card className="order-summary-box">
//                 <Title level={4} className="order-summary-title">
//                   Order Summary
//                 </Title>
//                 <Divider />
//                 <Row justify="space-between" align="middle" className="subtotal">
//                   <Col className="subtotal-title">
//                     <Text>SUBTOTAL</Text>
//                   </Col>
//                   <Col className="subtotal-price">
//                     <Text>5,300,000 VND</Text>
//                   </Col>
//                 </Row>
//                 <Row justify="space-between" align="middle" className="shipping">
//                   <Col className="shipping-title">
//                     <Text>SHIPPING</Text>
//                   </Col>
//                   <Col className="shipping-price">
//                     <Text>Free</Text>
//                   </Col>
//                 </Row>
//                 <Row justify="space-between" align="middle" className="postage">
//                   <Col className="postage-title">
//                     <Text>POSTAGE</Text>
//                   </Col>
//                   <Col className="postage-price">
//                     <Text>2,500,000 VND</Text>
//                   </Col>
//                 </Row>
//                 <Divider />
//                 <Row justify="space-between" align="middle" className="total">
//                   <Col className="total-title">
//                     <Text>TOTAL</Text>
//                   </Col>
//                   <Col className="total-price">
//                     <Text>2,500,000 VND</Text>
//                   </Col>
//                 </Row>
//                 <Divider />
//                 <Button className="checkout-button" type="primary" block onClick={() => navigate("/checkout")}>
//                   Proceed to Checkout
//                 </Button>
//               </Card>
//             </Col>
//           </Row>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CartProducts;
