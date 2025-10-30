import {
  Layout,
  Row,
  Col,
  Image,
  Typography,
  Space,
  Radio,
  Button,

} from "antd";
import React, { useState } from "react";
import { ShoppingCartOutlined, MoneyCollectOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ProductDetail = () => {
  const images = [
    "https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg",
    "https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg",
    "https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg",
    "https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg",
  ];

  const [mainImage, setMainImage] = useState(images[0]);
  const [color, setColor] = useState("green");
  const [value, setValue] = React.useState(1);
  const [size, setSize] = useState("M");
  const sizes = ["S", "M", "L", "XL", "XXL"];

  const colors = [
    { name: "blue", code: "#4f6df5" },
    { name: "green", code: "#43d49e" },
    { name: "red", code: "#f54d4d" },
    { name: "yellow", code: "#f5c04f" },
  ];

  return (
    <Layout className="product-detail-layout">
      <Row className="product-detail" gutter={32}>
        <Col span={12}>
          <Row gutter={16}>
            <Col span={4}>
              <Row gutter={[8, 8]}>
                {images.map((img, index) => (
                  <Col key={index} span={24}>
                    <Image
                      width={80}
                      src={img}
                      preview={false}
                      style={{
                        cursor: "pointer",
                        border:
                          img === mainImage
                            ? "2px solid #1677ff"
                            : "1px solid #ddd",
                        borderRadius: 8,
                      }}
                      onClick={() => setMainImage(img)}
                    />
                  </Col>
                ))}
              </Row>
            </Col>

            <Col span={20}>
              <Image.PreviewGroup>
                <Image
                  src={mainImage}
                  width="100%"
                  style={{
                    borderRadius: 12,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                  }}
                />
              </Image.PreviewGroup>
            </Col>
          </Row>
        </Col>

        <Col className="product-detail-info" span={12}>
          <Space>
            <Title level={3} className="product-detail-info-title">
              Men's Stylish Denim Jacket
            </Title>
            <Text className="rate-text">⭐5.0</Text>
          </Space>

          <Title className="product-detail-info-price" level={4}>2.500.000 VND</Title>

          <Text className="text-rate-info">
            Pay in 4 interest free installment for orders over 1.000.000 VND
            with shop
          </Text>

          <br />
          <Text strong className="select-color">
            Select Color
          </Text>

          <div className="color-selector">
            {colors.map((c) => (
              <div
                key={c.name}
                className={`color-circle ${color === c.name ? "selected" : ""}`}
                style={{ backgroundColor: c.code }}
                onClick={() => setColor(c.name)}
              />
            ))}
          </div>
          <Text strong className="select-size">
            Select Size
          </Text>
          <div style={{ marginTop: 16 }}>
            <Radio.Group
              onChange={(e) => setSize(e.target.value)}
              value={size}
              className="size-radio-group"
            >
              {sizes.map((s) => (
                <Radio.Button key={s} value={s}>
                  {s}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
          <Text strong className="select-quanlity">
            Quanlity
          </Text>
          <Space className="quantity-product-cart">
            <Button onClick={() => setValue((prev) => Math.max(prev - 1, 1))}>
              -
            </Button>
            <Text>{value}</Text>
            <Button onClick={() => setValue((prev) => prev + 1)}>+</Button>
          </Space>
          <Row className="primary-buy" gutter={16}>
            <Col span={12} className="add-to-cart">
              <Button className="add-to-cart-button">
                {" "}
                <ShoppingCartOutlined /> Add to cart
              </Button>
            </Col>
            <Col span={12} className="buy-now">
              <Button className="buy-now-button" type="primary">
                <MoneyCollectOutlined />
                Buy it now
              </Button>
            </Col>
          </Row>
          <div>
            <Text className="text-product-info">
            Celebrate the power and simplicity of the Swoosh. This warm brushed
            fleece hoodie made with some extra room through the shoulder
          </Text>
          {/* <Divider/> */}
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

export default ProductDetail;
