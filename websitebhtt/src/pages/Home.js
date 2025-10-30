
import { Layout, Typography, Space, Divider, Card } from "antd";
import { RocketOutlined, StarOutlined, HeartOutlined,  } from "@ant-design/icons";

import ProductsList from "./ProductsList";
import {  useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Title, Paragraph, Text} = Typography;


const features = [
  {
    title: "Fast Delivery",
    desc: "We offer delivery within 24 hours with multiple shipping options to ensure your orders arrive quickly and safely, no matter where you are.",
    icon: <RocketOutlined style={{ fontSize: 24, color: "#1890ff" }} />,
  },
  {
    title: "High-Quality Products",
    desc: "All of our products are carefully selected from trusted suppliers to guarantee quality, durability, and customer satisfaction with every purchase.",
    icon: <StarOutlined style={{ fontSize: 24, color: "#faad14" }} />,
  },
  {
    title: "24/7 Customer Support",
    desc: "Our dedicated customer service team is available around the clock to answer your questions, provide assistance, and ensure a smooth shopping experience.",
    icon: <HeartOutlined style={{ fontSize: 24, color: "#eb2f96" }} />,
  },
];


const Home = () => {
  const navigate = useNavigate();
  return (
    <Layout>
     
      <Content className="page-content" style={{ padding: "24px 0px" }}>
        

        {/* Feature cards (full-bleed) */}
      
        <div className="advantages-title">
          <Title className="advantages-title" level={1}>
            AVANTAGES
          </Title>
        </div>
        <div className="feature-bleed">
          <div
            className="feature-grid feature-row"
            style={{ marginBottom: 24 }}
          >
            {features.map((f) => (
              <div className="feature-item" key={f.title}>
                <Card hoverable className="feature-card">
                  <Space align="start">
                    <div className="feature-icon">{f.icon}</div>
                    <div>
                      <Title level={5} style={{ margin: 0 }}>
                        {f.title}
                      </Title>
                      <Paragraph style={{ margin: 0 }}>{f.desc}</Paragraph>
                    </div>
                  </Space>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        {/* CTA */}
        {/* <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Title level={3} style={{ marginBottom: 12 }}>
            Ready to Shop?
          </Title>
          <Button
            type="primary"
            size="large"
            href="/products"
            className="cta-button"
          >
            View All Products
          </Button>
        </div> */}

        {/* Danh sách sản phẩm */}
        <ProductsList />
        <Divider />
        <div className="about-us-title">
          <Title className="about-us-title-content" level={1}>
            ABOUT US
          </Title>
          <Text className="about-us-text" onClick={()=> navigate("/about")}>See more >></Text>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
