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
    console.log("Thất bại:", errorInfo);
  };

  return (
    <div className="login-page">
      <div className="login">
        <Row className="login-row">
          {/* --- CỘT BÊN TRÁI (TEXT CHÀO MỪNG) --- */}
          <Col className="login-col-left" span={14}>
            <Space direction="vertical" size="small">
              <Title className="title-left" level={1}>
                Chào mừng!!
              </Title>
              <Text className="text-left">
                Vui lòng đăng nhập vào tài khoản của bạn để tận hưởng trải nghiệm cá nhân hóa hơn, truy cập các ưu đãi độc quyền, dễ dàng theo dõi đơn hàng và nhận các thông tin cập nhật mới nhất dành riêng cho bạn.
              </Text>
            </Space>
          </Col>
          
          {/* --- CỘT BÊN PHẢI (FORM ĐĂNG KÝ) --- */}
          <Col span={10} className="login-col-right">
            <div>
              <Title className="login-title" level={2}>
                Đăng ký
              </Title>
              <Form
                className="form-login"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                autoComplete="off"
              >
                <Form.Item
                  label="Tên người dùng"
                  name="username"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên người dùng" },
                  ]}
                >
                  <Input placeholder="Tên người dùng" />
                </Form.Item>
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu" },
                  ]}
                >
                  <Input.Password placeholder="Mật khẩu" />
                </Form.Item>
                <Form.Item
                  label="Xác nhận Mật khẩu"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Hai mật khẩu không khớp")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Xác nhận Mật khẩu" />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                  >
                    <LoginOutlined />
                    Đăng ký
                  </Button>
                </Form.Item>
                  <Form.Item className="or-login-with-form-item">
                     <Text className="or-login">Hoặc đăng ký bằng</Text>
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
                        Đã có tài khoản?{" "}
                        <Link href="/login">Đăng nhập ngay</Link>
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