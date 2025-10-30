import {
  Typography,
  Row,
  Col,
  Divider,
  Button,
  Table,
  Image,
  Checkbox,
} from "antd";
import "../style/ReviewOrder.css";
import {
  CommentOutlined,
  EnvironmentFilled,
  TruckFilled,
  CreditCardOutlined,
  PlusOutlined,
  DownOutlined,
  GiftOutlined,
} from "@ant-design/icons";
const { Title, Text } = Typography;

const ReviewOrder = () => {
  const columns = [
    {
      title: "",
      dataIndex: "image",
      key: "image",
      render: (src) => <Image width={70} src={src} preview={false} />,
    },
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary">${record.price}</Text>
        </>
      ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (val) => <Text strong>${val}</Text>,
    },
  ];

  const data = [
    {
      key: "1",
      image:
        "https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg",
      name: "Canon EOS R5 Mirrorless Camera",
      price: "3,699.00",
      stock: "In Stock",
      qty: 1,
      subtotal: "3,699.00",
    },
    {
      key: "2",
      image:
        "https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg",
      name: "Canon BG-R10 Battery Grip",
      price: "0.00",
      stock: "In Stock",
      qty: 1,
      subtotal: "0.00",
    },
  ];

  return (
    <div className="review-order">
      <Text className="big-title">
        ✅️ You're almost done. Simple review your information below and place
        your order.
      </Text>
      <br />
      <EnvironmentFilled style={{ color: "green" }} /> <br />
      <Row className="ship-to-payment" gutter={16}>
        <Col className="ship-to" span={8}>
          <Title level={3} className="ship-to-title">
            <TruckFilled style={{ color: "green", marginRight: "10px" }} />
            Ship To
          </Title>
          <br />
          <div className="ship-to-div">
            <div className="location-ship-div">
              <Text className="location-ship" strong>
                Da Nang City
              </Text>
              <div className="change-location">
                <EnvironmentFilled className="icon-location-ship" />
                <Text strong className="change-location-text">
                  CHANGE
                </Text>
              </div>
            </div>
            <Text className="detail-location">
              666 Ton Dan, Ngu Hanh Son <br /> TP Da Nang
            </Text>
            <Text className="detail-location">
              I can receive the goods from 6Am to 10Am
            </Text>
          </div>
        </Col>

        <Col className="payment-review" span={9}>
          <Title level={3} className="ship-to-title">
            <CreditCardOutlined
              style={{ color: "green", marginRight: "10px" }}
            />
            Payment
          </Title>
          <br />
          <div className="payment-review-div">
            <div className="payment-review-parent">
              <div className="payment-review">
                <EnvironmentFilled className="icon-payment-review" />
                <Text strong className="payment-review-text">
                  CHANGE
                </Text>
              </div>
            </div>
            <div className="visa-title">
              <Title className="visa-name" level={3}>
                VIETCOMBANK
              </Title>
              <Text className="number-visa">****16072003</Text>
            </div>
            <div className="billing-address">
              <Text className="billing-address-title" strong>
                Billing Address:{" "}
              </Text>
              <Text className="billing-address-detail">
                666 Ton Dan, Ngu Hanh Son, TP Da Nang
              </Text>
            </div>
            <Divider dashed />
            <div className="add-gift">
              <PlusOutlined className="icon-plus" />
              <Text className="apply-gift">ADD BANK CARD LINK</Text>
            </div>
          </div>
        </Col>

        <Col className="summary-review" span={7}>
          <div className="summary-review-div">
            <div className="subtotal">
              <Text className="subtotal-text">Subtotal</Text>
              <Text className="subtotal-value">$500</Text>
            </div>
            <div className="shipping">
              <Text className="shipping-text">Shipping</Text>
              <Text className="shipping-value">Free</Text>
            </div>
            <div className="sales-tax">
              <Text className="sales-tax-text">Sales-tax</Text>
              <Text className="sales-text-value">$5</Text>
            </div>
            <Divider />
            <div className="total">
              <Text className="total-text">Total</Text>
              <Text className="total-value-review">$495</Text>
            </div>
            <div className="button-review-order">
              <Button className="save-order" type="primary">
                Save Order
              </Button>
              <Button className="cancel-order" type="secondary">
                Cancel Order
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <div className="order-detail-review">
        <EnvironmentFilled className="icon-order-detail" /> <br />
        <Title level={3}>Order Detail & Shipping Method</Title>
      </div>
      <Row className="order-detail-and-method" gutter={16}>
        <Col className="order-detail-and-method-left" span={17}>
          <div className="order-detail-and-method-content">
            <div className="order-detail-content">
              <div className="shipping-from">
                <EnvironmentFilled className="icon-shipping-from" />
                <Text className="text-shipping-from">
                  SHIPPING FROM <b>DA NANG CITY</b>
                </Text>
                <br />
                <Text className="note-text">
                  Signature will be required upon delivery.
                </Text>
                <Divider dashed style={{ borderWidth: "1px" }} />

                {/* ✅ Bảng sản phẩm */}
                <Table
                  columns={columns}
                  dataSource={data}
                  pagination={false}
                  className="product-table"
                />
              </div>
            </div>
            <div className="detail-method">
              <Title level={4}>Estimate Delivery</Title>
              <br />
              <Title className="tue-aug-15" level={4}>
                Tue Aug 15
              </Title>
              <Divider dashed />
              <div className="expe">
                <Checkbox className="checkbox-expe">
                  Expedited Delivery <br />
                  <Text className="checkbox-expe-text">Tue Aug 15</Text>
                </Checkbox>
                <Text className="free-expe">FREE</Text>
                <Divider dashed />
              </div>
              <div className="expe">
                <Checkbox className="checkbox-expe">
                  1 Day Saver
                  <br />
                  <Text className="checkbox-expe-text">
                    Mon Aug 14 by end of day
                  </Text>
                </Checkbox>
                <Text className="free-expe2">$20</Text>
                <Divider dashed />
              </div>
              <div className="more-div">
                <Text className="more-shipping-option">
                  Show More Shipping Options
                </Text>
                <br />
                <DownOutlined className="icon-more" />
              </div>
            </div>
          </div>
        </Col>

        <Col className="order-detail-and-method-right" span={7}>
          <div className="select-gift">
            <Button className="select-gift-button" type="secondary">
              <GiftOutlined />
              Select Gift Options
            </Button>
          </div>
          <div className="cart-id-div">
            <Text className="cart-id-text"> Cart ID #DM205405666</Text>
            <Divider/>
            <Text className="having-trouble">Having Trouble? Contact Us!</Text><br />
          <Text className="live-chat"><CommentOutlined/>Live chat</Text>
          <Text className="live-chat-phone">000 111 222</Text>
          </div>
          <div className="more-help">
            <Text className="more-help-content">Return Policy</Text><br />
            <Text className="more-help-content">Shipping Information</Text><br />
            <Text className="more-help-content">Payment Options</Text><br />
            <Text className="more-help-content">Your Privacy & Security</Text><br />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ReviewOrder;
