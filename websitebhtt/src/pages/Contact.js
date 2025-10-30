import React from "react";
import {
  Typography,
  Row,
  Col,
  Divider,
  Form,
  Input,
  Button,
  Card,
  message,
  Breadcrumb as BreakCrum,
} from "antd";

const { HomeOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined } = require("@ant-design/icons");
const { Title, Text } = Typography;

const Contact = () => {
  return (
    <>
      <div className="contact-banner">
        <div className="contact-banner-content">
          <Title className="contact-title" level={1}>
            CONTACT
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

      <div className="contact-container" style={{ marginTop: 24 }}>
        <Row gutter={[32, 32]} justify="center">
          {/* Contact Information */}
          <Col xs={24} sm={24} md={10}>
            <div className="contact-info">
              <div className="contact-info-item">
                <EnvironmentOutlined className="info-icon" />
                <Text className="contact-info-title">
                  279 Mai Dang Chon, Hoa Quy, Da Nang City
                </Text>
              </div>
              <div className="contact-info-item">
                <PhoneOutlined className="info-icon" />
                <Text className="contact-info-title">Phone: 0123456789</Text>
              </div>
              <div className="contact-info-item">
                <MailOutlined className="info-icon" />
                <Text className="contact-info-title">Email: contact@domain.com</Text>
              </div>

              <Divider />

              {/* Contact Form */}
              <Card className="contact-card">
                <Title level={4}>Send Us a Message</Title>
                <Form
                  className="form-contact"
                  onFinish={() =>
                    message.success(
                      "Message sent successfully! We will get back to you as soon as possible."
                    )
                  }
                >
                  <Form.Item
                    name="name"
                    rules={[{ required: true, message: "Please enter your name" }]}
                  >
                    <Input placeholder="Your name" />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    rules={[{ required: true, message: "Please enter your email" }]}
                  >
                    <Input placeholder="Your email" />
                  </Form.Item>
                  <Form.Item
                    name="message"
                    rules={[{ required: true, message: "Please enter your message" }]}
                  >
                    <Input.TextArea rows={4} placeholder="Message" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                      Send Message
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </div>
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
