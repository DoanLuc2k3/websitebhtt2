import { Typography, Row, Col, Input, Button } from "antd";
import "../style/AppFooter.css";
import footerLogo from "../assets/images/logo2.jpg";

import redbullLogo from "../assets/images/redbull.png";

import cr7Logo from "../assets/images/cr7logo.png";
import vietnamLogo from "../assets/images/vietnamlogo.png";
import idealLogo from "../assets/images/ideal.png";
import visaLogo from "../assets/images/visa.png";
import MastercardLogo from "../assets/images/mastercard.png";
import giropay from "../assets/images/giropay.png";
import GooglePay from "../assets/images/gpay.png";
import PayPal from "../assets/images/paypal.png";
import KCB from "../assets/images/kcb.png";
import CBC from "../assets/images/cbc.png";
import KLARNA from "../assets/images/klarna.png";
import APAY from "../assets/images/apay.png";
import {
  FacebookFilled,
  TwitterSquareFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
const { Text } = Typography;
const AppFooter = () => {
  return (
    <div className="footer">
      <Row gutter={16} className="footer-row">
        <Col className="footer-logo" span={8}>
          <img src={footerLogo} alt="" />
          <div className="subscribe-input">
            <Input
              className="footer-input"
              placeholder="Enter your Email"
            ></Input>
            <Button className="footer-button" type="primary">
              Subscribe
            </Button>
          </div>
          <Text className="footer-text-gaith">
            @Gaith 2025 All Right reserved
          </Text>
        </Col>
        <Col className="quick-link" span={3}>
          <Text strong className="quick-link">
            Quick Links
          </Text>
          <br />
          <Text className="quick-link-content">Shop</Text>
          <br />
          <Text className="quick-link-content">About Us</Text>
          <br />
          <Text className="quick-link-content">Blogs</Text>
          <br />
          <Text className="quick-link-content">FAQ</Text>
          <br />
          <Text className="quick-link-content">Customer Service</Text>
          <br />
          <Text className="quick-link-content">Contact Us</Text>
        </Col>
        <Col className="legal-link" span={3}>
          <Text strong className="legal-link">
            Legal Link
          </Text>
          <br />
          <Text className="legal-link-content">Privacy Policy</Text>
          <br />
          <Text className="legal-link-content">Term & Conditions</Text>
          <br />
          <Text className="legal-link-content">Imprint</Text>
          <br />
          <Text className="legal-link-content">Cookie Policy</Text>
          <br />
          <Text className="legal-link-content">Refund Policy</Text>
          <br />
          <Text className="legal-link-content">Shipping Policy</Text> <br />
          <Text className="legal-link-content">Compliance Information</Text>
          <br />
          <div className="social-icons">
            <FacebookFilled className="icon facebook" />{" "}
            <TwitterSquareFilled className="icon twitter" />{" "}
            <CloseCircleFilled className="icon xicon" />
          </div>
        </Col>
        <Col className="contact-information" span={3}>
          <Text strong className="contact-information">
            Contact Information
          </Text>
          <br />
          <Text className="contact-information-content">Email</Text>
          <br />
          <Text className="contact-information-content">Information</Text>
          <br />
          <Text className="contact-information-content">Address</Text>
        </Col>
        <Col className="connect-payment" span={7}>
          <div className="logo-connect">
            <img className="logo-connect-content" src={vietnamLogo} alt="" />
            <img className="logo-connect-content" src={redbullLogo} alt="" />
            <img className="logo-connect-content" src={cr7Logo} alt="" />
          </div>
          <div className="card-logo">
            <div className="card-logo-item1">
                <div className="card-ideal">
                    <img className="" src={idealLogo} alt="" />
                </div>
                <div className="card-ideal">
                    <img className="" src={visaLogo} alt="" />
                </div>
                <div className="card-ideal">
                    <img className="" src={MastercardLogo} alt="" />
                </div>
                <div className="card-ideal">
                    <img className="" src={giropay} alt="" />
                </div>
                <div className="card-ideal">
                    <img className="" src={GooglePay} alt="" />
                </div>
            </div>
            <div className="card-logo-item2">
                <div className="card-ideal">
                    <img className="" src={PayPal} alt="" />
                </div>
                <div className="card-ideal">
                    <img className="" src={KCB} alt="" />
                </div>
                <div className="card-ideal">
                    <img className="" src={CBC} alt="" />
                </div>
                <div className="card-ideal">
                    <img className="" src={KLARNA} alt="" />
                </div>
                <div className="card-ideal">
                    <img className="" src={APAY} alt="" />
                </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default AppFooter;
