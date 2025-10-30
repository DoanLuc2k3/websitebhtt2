// src/pages/Profile.js
import React from "react";
import {
  Typography,
  Button,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Avatar,
  Divider,
} from "antd";
import {
  EditOutlined,
  CameraOutlined,
  CreditCardOutlined,
  DollarOutlined,
  LockOutlined,
  CustomerServiceOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const Profile = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log("Updated information:", values);
  };

  return (
    <div className="profile-page">
      <div className="profile-page-title">
        <Title className="title-profile" level={1}>
          Hello Luc Doan
        </Title>
        <Text className="text-profile">
          Hello and welcome to our site! We’re so excited to share our world
          with you,
          <br /> to let you explore everything we’ve built with passion and
          care.
        </Text>
        <br />
        <Button className="edit-profile-button" type="primary">
          Edit Profile
        </Button>
      </div>
      <div className="page-content">
        <div className="profile-grid">
          {/* Update Form */}

          <div className="profile-form-card">
            <Row className="my-account-header">
              <Col className="my-account-title" span={12}>
                <Text strong>My Account</Text>
              </Col>
              <Col className="setting-button" span={12}>
                <Button type="primary">Settings</Button>
              </Col>
            </Row>
            <Title className="user-info-title" level={5}>
              USER INFORMATION
            </Title>
            <Form
              className="my-account-form"
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Row className="username-email" gutter={32}>
                <Col className="username-col" span={12}>
                  <Form.Item
                    name="name"
                    label="Full Name"
                    initialValue="Doan Ba Luc"
                  >
                    <Input placeholder="Enter your full name" />
                  </Form.Item>
                </Col>
                <Col className="email-col" span={12}>
                  <Form.Item
                    name="email"
                    label="Email address"
                    initialValue="doanluc197@gmail.com"
                  >
                    <Input placeholder="Enter your email" />
                  </Form.Item>
                </Col>
              </Row>
              <Row className="first-last-name" gutter={32}>
                <Col className="first-name-col" span={12}>
                  <Form.Item
                    name="firstname"
                    label="First Name"
                    initialValue="Doan"
                  >
                    <Input placeholder="Enter your First name" />
                  </Form.Item>
                </Col>
                <Col className="last-name-col" span={12}>
                  <Form.Item
                    name="lastname"
                    label="Last name"
                    initialValue="Luc"
                  >
                    <Input placeholder="Enter your Last name" />
                  </Form.Item>
                </Col>
              </Row>
              <Row className="phone-birth" gutter={32}>
                <Col className="phone-col" span={12}>
                  <Form.Item
                    name="phone"
                    label="Phone"
                    initialValue="0123456789"
                  >
                    <Input placeholder="Enter your phone number" />
                  </Form.Item>
                </Col>
                <Col className="birth-col" span={12}>
                  <Form.Item
                    name="birth"
                    label="Date of Birth"
                    initialValue={dayjs("2003-08-26", "YYYY-MM-DD")}
                  >
                    <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row className="phone-birth" gutter={32}>
                <Col className="phone-col" span={12}>
                  <Form.Item
                    name="address"
                    label="Address"
                    initialValue="Ngu Hanh Son, Da Nang"
                  >
                    <Input placeholder="Enter your address" />
                  </Form.Item>
                </Col>
                <Col className="birth-col" span={12}>
                  <Form.Item
                    name="citizen identification card"
                    label="Citizen identification card"
                    initialValue="000111333444"
                  >
                    <Input placeholder="Enter your ID" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button
                  className="save-change-button"
                  type="primary"
                  htmlType="submit"
                >
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </div>
          {/* Profile Card */}

          <div className="profile-card">
            <div className="profile-avatar">
              <Avatar
                size={180} // kích thước (px)
                src="https://jbagy.me/wp-content/uploads/2025/03/Hinh-anh-avatar-dragon-ball-super-cool-ngau-6.jpg" // link ảnh
              />
              <div className="avatar-overlay">
                <CameraOutlined className="camera-icon" />
              </div>
            </div>
            <div className="profile-name">
              Doan Ba Luc <EditOutlined /><br />
              <text className="doanluc197">doanluc197@gmail.com</text>
            </div>

            <Divider />

            <Row
              className="connect-bank-row"
              gutter={16}
              justify="space-between"
            >
              <Col className="connect-bank-col" span={12}>
                Liên kết ngân hàng
              </Col>
              <Col className="icon-bank-col" span={12}>
                <CreditCardOutlined />
              </Col>
            </Row>

            <Divider />
            <Row
              className="connect-bank-row"
              gutter={16}
              justify="space-between"
            >
              <Col className="connect-bank-col" span={12}>
                Kho gói V.I.P
              </Col>
              <Col className="icon-bank-col" span={12}>
                <DollarOutlined />
              </Col>
            </Row>
            <Divider />
            <Row
              className="connect-bank-row"
              gutter={16}
              justify="space-between"
            >
              <Col className="connect-bank-col" span={15}>
                Điều khoản và chính sách
              </Col>
              <Col className="icon-bank-col" span={9}>
                <LockOutlined />
              </Col>
            </Row>
            <Divider />
            <Row
              className="connect-bank-row"
              gutter={16}
              justify="space-between"
            >
              <Col className="connect-bank-col" span={15}>
                Liên hệ với chúng tôi
              </Col>
              <Col className="icon-bank-col" span={9}>
                <CustomerServiceOutlined />
              </Col>
            </Row>
            <Divider />
            <Row
              className="connect-bank-row"
              gutter={16}
              justify="space-between"
            >
              <Col className="connect-bank-col" span={15}>
                Đăng xuất
              </Col>
              <Col className="icon-bank-col" span={9}>
                <LogoutOutlined />
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <div className="banner-footer"></div>
    </div>
  );
};

export default Profile;
