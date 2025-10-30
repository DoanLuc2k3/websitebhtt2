import React, { useState, useEffect } from "react";
import { Row, Col, Card, Rate, Spin } from "antd";

const { Meta } = Card;

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin size="large" />
      </div>
    );

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={product.title}
                  src={product.thumbnail}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              }
            >
              <Meta
                title={product.title}
                description={
                  <>
                    <p>{product.brand}</p>
                    <p>${product.price}</p>
                    <Rate
                      disabled
                      allowHalf
                      defaultValue={product.rating}
                      style={{ fontSize: "14px" }}
                    />
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ProductList;
