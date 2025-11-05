import React, { useState } from "react";
import {
  Typography, Form, Input, Button, Row, Col, Space, message,
} from "antd";
import {
  GoogleOutlined, LoginOutlined, FacebookFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../data/authService"; // Import hàm đã cập nhật
import "../style/Login.css"; // Đảm bảo bạn có import CSS

const { Title, Text, Link } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const { username, password } = values;
    setLoading(true);

    try {
      // Gọi hàm register (lưu vào localStorage)
      const newUserData = await registerUser(username, password);
      
      console.log("User mới đã được lưu vào localStorage:", newUserData);
      message.success("Đăng ký thành công! Đang chuyển đến trang đăng nhập...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      // Lỗi sẽ được ném ra (vd: 'Tên đăng nhập đã tồn tại')
      message.error(error.message);
      setLoading(false); // Chỉ set false khi lỗi
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // ... (Toàn bộ phần JSX return của bạn giữ nguyên, không cần thay đổi)
  return (
    <div className="login-page">
      <div className="login">
        <Row className="login-row">
          <Col className="login-col-left" span={14}>
            <Space direction="vertical" size="small">
              <Title className="title-left" level={1}>
                Welcome !!
              </Title>
              <Text className="text-left">
                Please log in to your account to enjoy a more personalized
                experience, access exclusive deals, track your orders easily,
                and receive the latest updates tailored just for you.
              </Text>
            </Space>
          </Col>
          <Col span={10} className="login-col-right">
            <div>
              <Title className="login-title" level={2}>
                Register
              </Title>
              <Form
                className="form-login"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                autoComplete="off"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: "Please enter your username" },
                  ]}
                >
                  <Input placeholder="Username" />
                </Form.Item>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please enter your password" },
                  ]}
                >
                  <Input.Password placeholder="Password" />
                </Form.Item>
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Please confirm your password" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("The two passwords do not match")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Confirm Password" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                  >
                    <LoginOutlined />
                    Register
                  </Button>
                </Form.Item>
                 <Form.Item className="or-login-with-form-item">
                   <Text className="or-login">Or register with</Text>
                 </Form.Item>
                 <Row className="login-with" justify="center" gutter={16}>
                   <Col>
                     <Button className="btn-login-google">
                       <GoogleOutlined />
                       Google
                     </Button>
                   </Col>
                   <Col>
                     <Button className="btn-login-facebook">
                       <FacebookFilled />
                       Facebook
                     </Button>
                   </Col>
                 </Row>
                 <Form.Item className="dont-have">
                   <Text className="dont-have-account">
                     Already have an account?{" "}
                     <Link href="/login">Login now</Link>
                   </Text>
                 </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Register;