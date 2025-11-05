import React from "react";
import "../style/Contact.css"; // Đảm bảo đã import file CSS
import {
  Typography,
  Row,
  Col,
  Form,
  Input,
  Button,
  Card,
  message,
  Breadcrumb as BreakCrum,
} from "antd";

import { HomeOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;

const Contact = () => {
  return (
    <>
      <div className="contact-banner">
        <div className="contact-banner-content">
          <Title className="contact-banner-title" level={1}>
            CONTACT US
          </Title>
          <BreakCrum>
            <BreakCrum.Item href="/">
              <HomeOutlined />
              <span>Home</span>
            </BreakCrum.Item>
            <BreakCrum.Item>Contact</BreakCrum.Item>
          </BreakCrum>
        </div>
      </div>

      <div className="contact-container" style={{ marginTop: 40 }}>
        
        {/* KHU VỰC THÔNG TIN LIÊN HỆ (3 cột riêng biệt) */}
        <Row gutter={[24, 24]} justify="space-between" style={{ marginBottom: 40 }}>
          <Col xs={24} md={8}>
             <Card className="contact-card" bordered={false} hoverable>
                <div className="contact-info-item">
                    <EnvironmentOutlined className="info-icon" />
                    <div>
                        <Text strong>OUR ADDRESS</Text>
                        <p style={{ margin: 0, color: '#374151' }}>279 Mai Dang Chon, Hoa Quy, Da Nang City</p>
                    </div>
                </div>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card className="contact-card" bordered={false} hoverable>
                <div className="contact-info-item">
                    <PhoneOutlined className="info-icon" />
                    <div>
                        <Text strong>CALL US</Text>
                        <p style={{ margin: 0, color: '#374151' }}>Phone: 0123456789</p>
                    </div>
                </div>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card className="contact-card" bordered={false} hoverable>
                <div className="contact-info-item">
                    <MailOutlined className="info-icon" />
                    <div>
                        <Text strong>EMAIL US</Text>
                        <p style={{ margin: 0, color: '#374151' }}>Email: contact@domain.com</p>
                    </div>
                </div>
            </Card>
          </Col>
        </Row>
        
        {/* KHU VỰC FORM VÀ MAP (2 cột chính) */}
        <Row gutter={[32, 32]} justify="center">
          
          {/* Contact Form */}
          <Col xs={24} sm={24} md={12}>
            {/* Form được bao bọc trong Card, áp dụng style cân đối từ CSS */}
            <Card className="contact-card" bordered={false}>
              {/* Tiêu đề cấp 3, không cần style inline vì CSS đã xử lý margin và căn giữa */}
              <Title level={3}>
                Send Us a Message
              </Title>
              <Form
                className="form-contact"
                layout="vertical"
                onFinish={() =>
                  message.success(
                    "Message sent successfully! We will get back to you as soon as possible."
                  )
                }
              >
                <Form.Item
                  label="Your Name"
                  name="name"
                  rules={[{ required: true, message: "Please enter your name" }]}
                >
                  <Input placeholder="Enter your name" />
                </Form.Item>
                <Form.Item
                  label="Your Email"
                  name="email"
                  rules={[{ required: true, message: "Please enter your email" }]}
                >
                  <Input placeholder="Enter your email address" />
                </Form.Item>
                <Form.Item
                  label="Message"
                  name="message"
                  rules={[{ required: true, message: "Please enter your message" }]}
                >
                  {/* Tăng rows lên 5 để TextArea to hơn, cân đối hơn */}
                  <Input.TextArea className="input-text-message" rows={8} placeholder="Type your message here..." />
                </Form.Item>
                <Form.Item>
                  {/* Dùng size="large" và CSS để nút cao 50px */}
                  <Button type="primary" htmlType="submit" block size="large">
                    Send Message
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Google Map */}
          <Col xs={24} sm={24} md={12}>
            <div className="map-card">
              <div className="map-container">
                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.9315079324944!2d105.81296347596015!3d21.036952280613947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab1dbf34b2bb%3A0x4c3d2c6b5d6a10c3!2zMjY2IMSQ4buZaSBD4bqlbiwgTGl4YSBHaWFpLCBCw6AgxJDhuqFpLCBIw6AgTuG7mWkgMTAwMDA!5e0!3m2!1svi!2s!4v1695200100123!5m2!1svi!2s"
                  loading="lazy"
                  className="contact-map-iframe"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Contact;