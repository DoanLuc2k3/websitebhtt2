import {  Typography, Form, Input, Button, Row, Col , Space } from "antd";
import {
  GoogleOutlined,
  LoginOutlined,
  FacebookFilled,
} from "@ant-design/icons";

const { Title, Text, Link } = Typography;

const Register = () => {
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
                USER REGISTER
              </Title>
               <Form className="form-login">
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
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
            <Button type="primary" htmlType="submit" block>
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
              Already have an account? <Link href="/login">Login now</Link>
            </Text>
          </Form.Item>
        </Form>
            </div>
          </Col>
        </Row>
      </div>
      
    </div>
    // <div className="login-page">
    //   <Card className="login-card">
    //     <Title className="login-title" level={2}>
    //       Register
    //     </Title>
       
    //   </Card>
    // </div>
  );
};

export default Register;
