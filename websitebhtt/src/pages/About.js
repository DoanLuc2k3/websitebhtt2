
import "../style/About.css";
import {
 
  Row,
  Col,
 
  Typography,
  Button,
  Divider,
  Card,
  Rate,
} from "antd";
import {
 
  ArrowRightOutlined,
  FacebookFilled,
  TwitterOutlined,
  InstagramFilled,
  LinkedinFilled,
  CheckCircleFilled
} from "@ant-design/icons";

import "../assets/style.css";

import avtMember from "../assets/images/avtmember.png";


const { Text, Title } = Typography;

const About = () => {

  return (
    <div className="about-us-page">
      <div className="title-about">
        <Title level={2} className="title-left-about">
          We Always Provide The <br />
          Best Service
        </Title>
        <div className="title-right-about">
          <Text strong>Services</Text>
          <br />
          <Text>
            We always try to give users the best experience when shopping on our
            website, ensuring that every visit is smooth, enjoyable, and meets
            their needs in the most convenient way possible.
          </Text>
        </div>
      </div>
      <div style={{ padding: "0 90px" }}>
        <Divider className="divider-about" />
      </div>
      <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <Row className="about-us-service" gutter={16}>
          <Col className="about-us-service-col" span={8}>
            <div className="content">
              <img
                src="https://umm.edu.vn/wp-content/uploads/2023/04/Phan-cong-ro-rang-de-phat-trien-doi-ngu-nhan-su-600x400.png"
                alt=""
              />
              <Title level={4}>Office Clean</Title>
              <Text>
                We always try to give users the best experience when shopping on
                our website, ensuring that every visit is smooth, enjoyable, and
                meets their needs in the most convenient way possible.
              </Text>
              <br />
              <Button type="secondary">
                See more
                <ArrowRightOutlined />
              </Button>
            </div>
          </Col>
          <Col className="about-us-service-col" span={8}>
            <div className="content">
              <img
                src="https://umm.edu.vn/wp-content/uploads/2023/04/Phan-cong-ro-rang-de-phat-trien-doi-ngu-nhan-su-600x400.png"
                alt=""
              />
              <Title level={4}>Office Clean</Title>
              <Text>
                We always try to give users the best experience when shopping on
                our website, ensuring that every visit is smooth, enjoyable, and
                meets their needs in the most convenient way possible.
              </Text>
              <br />
              <Button type="secondary">
                See more
                <ArrowRightOutlined />
              </Button>
            </div>
          </Col>
          <Col className="about-us-service-col" span={8}>
            <div className="content">
              <img
                src="https://umm.edu.vn/wp-content/uploads/2023/04/Phan-cong-ro-rang-de-phat-trien-doi-ngu-nhan-su-600x400.png"
                alt=""
              />
              <Title level={4}>Office Clean</Title>
              <Text>
                We always try to give users the best experience when shopping on
                our website, ensuring that every visit is smooth, enjoyable, and
                meets their needs in the most convenient way possible.
              </Text>
              <br />
              <Button type="secondary">
                See more
                <ArrowRightOutlined />
              </Button>
            </div>
          </Col>
        </Row>
      </div>
      <div className="high-quality">
        <Row className="high-quality-row" gutter={32}>
          <Col className="high-quality-col-left" span={12}>
            <Text>Affordable cleaning solutions</Text>
            <br />
            <Title level={2}>
              High Quality and Friendly <br /> Services at Fair Prices
            </Title>
            <Text className="text-content-2">
              We always try to give users the best experience when shopping on
              our website, ensuring that every visit is smooth, enjoyable, and
              meets their needs in the most convenient way possible.
            </Text>
            <br />
            <Button type="primary" className="high-quality-button">
              Shopping Now
            </Button>
          </Col>
          <Col className="high-quality-col-left" span={12}>
            <img
              src="https://umm.edu.vn/wp-content/uploads/2023/04/Phan-cong-ro-rang-de-phat-trien-doi-ngu-nhan-su-600x400.png"
              alt=""
            />
          </Col>
        </Row>
      </div>
      <div className="title-about">
        <Title level={2} className="title-left-about">
          About The Member <br />
          Of Group
        </Title>
        <div className="title-right-about">
          <Text strong>Expert Team</Text>
          <br />
          <Text>
            We always try to give users the best experience when shopping on our
            website, ensuring that every visit is smooth, enjoyable, and meets
            their needs in the most convenient way possible.
          </Text>
        </div>
      </div>
      <div style={{ padding: "0 90px" }}>
        <Divider className="divider-about" />
      </div>
      <div className="big-member-div">
        <div className="member">
          <Card className="member-card" hoverable>
            <div className="member-img-wrapper">
              <img src={avtMember} alt="Member Avatar" className="member-img" />
            </div>
            <div className="member-info">
              <Text className="name-member">Doan Ba Luc</Text>
              <Rate defaultValue={5} disabled /> <br />
              <Text className="member-text">
                We always try to give users the best experience when shopping on
                our website, ensuring that every.
              </Text>
              <br />
              <div className="social-icons2">
                <FacebookFilled />
                <TwitterOutlined />
                <InstagramFilled />
                <LinkedinFilled />
              </div>
            </div>
          </Card>
        </div>
        <div className="member">
          <Card className="member-card" hoverable>
            <div className="member-img-wrapper">
              <img src={avtMember} alt="Member Avatar" className="member-img" />
            </div>
            <div className="member-info">
              <Text className="name-member">Doan Ba Min</Text>
              <Rate defaultValue={5} disabled /> <br />
              <Text className="member-text">
                We always try to give users the best experience when shopping on
                our website, ensuring that every.
              </Text>
              <br />
              <div className="social-icons2">
                <FacebookFilled />
                <TwitterOutlined />
                <InstagramFilled />
                <LinkedinFilled />
              </div>
            </div>
          </Card>
        </div>
        <div className="member">
          <Card className="member-card" hoverable>
            <div className="member-img-wrapper">
              <img src={avtMember} alt="Member Avatar" className="member-img" />
            </div>
            <div className="member-info">
              <Text className="name-member">Doan Van Hau</Text>
              <Rate defaultValue={5} disabled /> <br />
              <Text className="member-text">
                We always try to give users the best experience when shopping on
                our website, ensuring that every.
              </Text>
              <br />
              <div className="social-icons2">
                <FacebookFilled />
                <TwitterOutlined />
                <InstagramFilled />
                <LinkedinFilled />
              </div>
            </div>
          </Card>
        </div>
      </div>
      <div className="welcome-website">
        <div className="welcome-website-img">
          <img
            src="https://umm.edu.vn/wp-content/uploads/2023/04/Phan-cong-ro-rang-de-phat-trien-doi-ngu-nhan-su-600x400.png"
            alt=""
          />
        </div>
        <div className="welcome-website-content">
          <Title level={2}> Welcome To Our Website!</Title>
          <Text className="welcome-website-text">
            We always try to give users the best experience when shopping on our
            website, ensuring that every visit is smooth, enjoyable, and meets
            their needs in the most convenient way possible.
          </Text>
          <div className="advantages-options">
            <div className="advantages-options-div">
              <CheckCircleFilled style={{color:"rgb(6, 190, 6)"}}/><Text className="advantages-options-text">Vetted profeshionnal</Text>
            </div>
            <div className="advantages-options-div">
              <CheckCircleFilled style={{color:"rgb(6, 190, 6)"}}/><Text className="advantages-options-text">Next days avalablelitys</Text>
            </div>
          </div>
          <div className="advantages-options">
            <div className="advantages-options-div">
              <CheckCircleFilled style={{color:"rgb(6, 190, 6)"}}/><Text className="advantages-options-text">Affodable prices</Text>
            </div>
            <div className="advantages-options-div">
              <CheckCircleFilled style={{color:"rgb(6, 190, 6)"}}/><Text className="advantages-options-text">Best Quality</Text>
            </div>
          </div>
          <div className="advantages-options">
            <div className="advantages-options-div">
              <CheckCircleFilled style={{color:"rgb(6, 190, 6)"}}/><Text className="advantages-options-text">Standard cleaning task</Text>
            </div>
            <div className="advantages-options-div">
              <CheckCircleFilled style={{color:"rgb(6, 190, 6)"}}/><Text className="advantages-options-text">Vetted profeshionnal</Text>
            </div>
          </div>
          <div className="button-know">
            <Button className="button-know-primary" type="primary">Buy Now</Button>
            <Button className="button-know-secondary" type="secondary">Know More</Button>
          </div>
        </div>
      </div>
    </div>

    // <Layout>
    //   <Content className="page-content about-page">
    //     <div className="contact-banner">
    //       <div className="contact-banner-content">
    //         <Title className="introduction-title" level={1}>
    //           INTRODUCTION
    //         </Title>
    //         <BreakCrum>
    //           <BreakCrum.Item href="/">
    //             <HomeOutlined />
    //             <span>Home</span>
    //           </BreakCrum.Item>
    //           <BreakCrum.Item>About Us</BreakCrum.Item>
    //         </BreakCrum>
    //       </div>
    //     </div>

    //     {/* top mini-feature blurbs */}
    //     <div className="about-mini-features">
    //       <div className="mini-feature">
    //         <div className="mini-icon">🚀</div>
    //         <div className="mini-text">
    //           Lorem Ipsum is simply dummy text of the printing and typesetting
    //           industry.
    //         </div>
    //       </div>
    //       <div className="mini-feature">
    //         <div className="mini-icon">💡</div>
    //         <div className="mini-text">
    //           Lorem Ipsum has been the industry's standard dummy text ever since
    //           the 1500s.
    //         </div>
    //       </div>
    //       <div className="mini-feature">
    //         <div className="mini-icon">🔄</div>
    //         <div className="mini-text">
    //           Lorem Ipsum is simply dummy text of the printing and typesetting
    //           industry.
    //         </div>
    //       </div>
    //     </div>

    //     <Row
    //       gutter={[32, 32]}
    //       align="middle"
    //       className="about-container"
    //       style={{ display: "flex", flexWrap: "nowrap" }}
    //     >
    //       {/* About us section */}
    //       <Col xs={24} md={14} className="about-text-col">
    //         <Title level={2} className="about-heading">
    //           About Us
    //         </Title>

    //         <Paragraph className="about-paragraph">
    //           We are a store that provides high-quality fashion products and
    //           technology devices. Our mission is to deliver an easy, safe, and
    //           reliable shopping experience for every customer.
    //         </Paragraph>

    //         <Paragraph className="about-paragraph">
    //           With a commitment to quality and service, we carefully select
    //           trusted partners, strictly control processes, and are always ready
    //           to support customers in every situation.
    //         </Paragraph>

    //         <Button
    //           type="primary"
    //           size="large"
    //           icon={<ShoppingOutlined />}
    //           onClick={() => navigate("/products")}
    //         >
    //           View Products
    //         </Button>
    //       </Col>
    //       <Col xs={24} md={10} className="about-image-col">
    //         <img src={aboutImg} alt="About us" className="about-image" />
    //       </Col>
    //     </Row>

    //     {/* Core values / Advantages */}
    //     <Row
    //       gutter={[32, 32]}
    //       align="middle"
    //       className="about-container"
    //       style={{ display: "flex", flexWrap: "nowrap" }}
    //     >
    //       <Col xs={24} md={10} className="about-image-col">
    //         <img
    //           src={core}
    //           alt="Core values"
    //           className="about-image"
    //           style={{ width: "50%", height: "auto", marginTop: "20px" }}
    //         />
    //       </Col>
    //       <Col xs={24} md={14} className="about-text-col">
    //         <Title level={2} className="about-heading">
    //           Core Values / Advantages 🤝
    //         </Title>

    //         <Paragraph className="about-paragraph">
    //           We always prioritize product quality and customer experience.
    //           Every product is carefully selected to bring customers peace of
    //           mind and maximum satisfaction.
    //         </Paragraph>

    //         <Paragraph className="about-paragraph">
    //           Our advantages lie in a strict quality control process,
    //           dedicated customer service, and a trusted partner network that
    //           ensures competitive prices and fast nationwide delivery.
    //         </Paragraph>
    //       </Col>
    //     </Row>

    //     {/* Awards */}
    //     <Row
    //       gutter={[32, 32]}
    //       align="middle"
    //       className="about-container"
    //       style={{ display: "flex", flexWrap: "nowrap" }}
    //     >
    //       <Col xs={24} md={14} className="about-text-col">
    //         <Title level={2} className="about-heading">
    //           Awards & Achievements
    //         </Title>

    //         <Paragraph className="about-paragraph">
    //           Throughout our development journey, we have continuously strived
    //           to improve product and service quality. As a result, we have
    //           received many prestigious awards in the retail and e-commerce
    //           industry, recognizing the trust of customers and partners.
    //         </Paragraph>

    //         <Paragraph className="about-paragraph">
    //           These awards are not only proof of our brand's credibility but
    //           also a motivation for us to keep innovating and deliver even
    //           better experiences to our community of consumers.
    //         </Paragraph>
    //       </Col>
    //       <Col xs={24} md={10} className="about-image-col">
    //         <img
    //           src={trophyImg}
    //           alt="Awards"
    //           className="about-image"
    //           style={{ width: "50%", height: "auto", marginTop: "20px" }}
    //         />
    //       </Col>
    //     </Row>
    //   </Content>
    // </Layout>
  );
};

export default About;
