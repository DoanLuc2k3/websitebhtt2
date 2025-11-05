import React, { useState, useEffect } from "react";
import {
  Typography,
  Row,
  Col,
  Divider,
  Button,
  Table,
  Image,
  Descriptions,
  Modal,
  Radio,
  Form,
  Input,
  DatePicker,
  Select,
} from "antd";
import "../style/ReviewOrder.css";
import {
  EnvironmentFilled,
  TruckFilled,
  CreditCardOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  ProfileOutlined,
  FileDoneOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs"; // <-- Nhớ cài đặt dayjs

const { Title, Text } = Typography;
const { Option } = Select;

const ReviewOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Nhận dữ liệu BAN ĐẦU từ location.state
  const initialDelivery = location.state?.delivery || {
    name: "N/A",
    phone: "N/A",
    email: "N/A",
    address: "N/A",
    city: "N/A",
    state: "N/A",
    zip: "N/A",
    date: null,
    note: "N/A",
    payment: "Not specified",
  };
  const { items, totals } = location.state || {
    items: [],
    totals: { subtotal: 0, discount: 0, shipping: 0, total: 0 },
  };

  // State cho Delivery
  const [currentDelivery, setCurrentDelivery] = useState(initialDelivery);
  const [isShipToModalVisible, setIsShipToModalVisible] = useState(false);
  const [shipToForm] = Form.useForm();

  const showShipToModal = () => {
    shipToForm.setFieldsValue({
      ...currentDelivery,
      date: currentDelivery.date ? dayjs(currentDelivery.date) : null,
    });
    setIsShipToModalVisible(true);
  };

  const handleShipToOk = async () => {
    try {
      const values = await shipToForm.validateFields();
      const updatedDelivery = {
        ...values,
        date: values.date ? values.date.format("YYYY-MM-DD") : null,
      };
      setCurrentDelivery((prev) => ({
        ...prev,
        ...updatedDelivery,
      }));
      setIsShipToModalVisible(false);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  const handleShipToCancel = () => {
    setIsShipToModalVisible(false);
  };

  // State cho Payment
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(initialDelivery.payment);

  useEffect(() => {
    setPaymentMethod(initialDelivery.payment);
  }, [initialDelivery.payment]);

  const showPaymentModal = () => {
    setIsPaymentModalVisible(true);
  };

  const handlePaymentOk = (newMethod) => {
    setPaymentMethod(newMethod);
    setCurrentDelivery((prev) => ({
      ...prev,
      payment: newMethod,
    }));
    setIsPaymentModalVisible(false);
  };

  const handlePaymentCancel = () => {
    setIsPaymentModalVisible(false);
  };

  // Cấu hình cột bảng (giữ nguyên)
  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "product",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div className="product-image-wrapper">
            <Image src={record.image} preview={false} />
          </div>
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary">${record.price.toFixed(2)}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => (
        <Text type={stock > 0 ? "success" : "danger"}>
          {stock > 0 ? "In Stock" : "Out of Stock"}
        </Text>
      ),
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

  const processedData = items.map((item) => ({
    key: item.product.id,
    image: item.product.thumbnail,
    name: item.product.title,
    price: item.product.price,
    stock: item.product.stock,
    qty: item.quantity,
    subtotal: (item.product.price * item.quantity).toFixed(2),
  }));

  // Helper format ngày (giữ nguyên)
  const formattedDate = currentDelivery.date
    ? new Date(currentDelivery.date).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not specified";

  return (
    <div className="review-order">
      <Text className="big-title">
        ✅️ You're almost done. Simple review your information below and place
        your order.
      </Text>
      <br />
      <EnvironmentFilled style={{ color: "green" }} /> <br />

      {/* ===== HÀNG 1: SHIP TO, PAYMENT, SUMMARY ===== */}
      <Row className="ship-to-payment" gutter={16}>
        {/* "SHIP TO" (CẬP NHẬT JSX) */}
        <Col className="ship-to" span={8}>
          <Title level={3} className="ship-to-title">
            {/* BỌC ICON VÀ TEXT TRONG SPAN */}
            <span className="title-content-wrapper">
              <TruckFilled style={{ color: "green", marginRight: "10px" }} />
              Ship To
            </span>
            <Text
              strong
              className="change-info-text"
              onClick={showShipToModal}
            >
              CHANGE
              <EditOutlined style={{ marginLeft: 5, color: "#1890ff" }} />
            </Text>
          </Title>
          <br />
          <div className="ship-to-div">
            {currentDelivery ? (
              <Descriptions
                column={1}
                bordered
                size="small"
                className="delivery-descriptions"
              >
                {/* (Descriptions.Item giữ nguyên) */}
                <Descriptions.Item
                  label={
                    <>
                      <UserOutlined /> Name
                    </>
                  }
                >
                  {currentDelivery.name}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <PhoneOutlined /> Phone
                    </>
                  }
                >
                  {currentDelivery.phone}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <MailOutlined /> Email
                    </>
                  }
                >
                  {currentDelivery.email}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <HomeOutlined /> Address
                    </>
                  }
                >
                  {`${currentDelivery.address}, ${currentDelivery.city}, ${currentDelivery.state} ${
                    currentDelivery.zip || ""
                  }`}
                </Descriptions.Item>
                <Descriptions.Item label="Delivery Date">
                  {formattedDate}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <ProfileOutlined /> Note
                    </>
                  }
                >
                  {currentDelivery.note || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Text>No delivery information available.</Text>
            )}
          </div>
        </Col>

        {/* "PAYMENT" (CẬP NHẬT JSX) */}
        <Col className="payment-review" span={9}>
          <Title level={3} className="ship-to-title">
            {/* BỌC ICON VÀ TEXT TRONG SPAN */}
            <span className="title-content-wrapper">
              <CreditCardOutlined
                style={{ color: "green", marginRight: "10px" }}
              />
              Payment
            </span>
            <Text
              strong
              className="change-info-text"
              onClick={() => showPaymentModal()}
            >
              CHANGE
              <EditOutlined style={{ marginLeft: 5, color: "#1890ff" }} />
            </Text>
          </Title>
          <br />
          <div className="payment-review-div">
            {/* (Nội dung payment giữ nguyên) */}
            <div className="payment-review-parent">
              {/* (Nút change cũ đã bị xóa, vì đã đưa lên Title) */}
            </div>
            <div className="visa-title">
              <Title className="visa-name" level={3}>
                {paymentMethod}
              </Title>
            </div>
            <div className="billing-address">
              <Text className="billing-address-title" strong>
                Billing Address:{" "}
              </Text>
              <Text className="billing-address-detail">
                {currentDelivery?.address || "N/A"}
              </Text>
            </div>
            <Divider dashed />
            <div className="add-gift">
              <Text className="apply-gift">{paymentMethod}</Text>
            </div>
          </div>
        </Col>

        {/* "SUMMARY" (CẬP NHẬT JSX) */}
        <Col className="summary-review" span={7}>
          <Title level={3} className="ship-to-title">
            {/* BỌC ICON VÀ TEXT TRONG SPAN */}
            <span className="title-content-wrapper">
              <FileDoneOutlined
                style={{ color: "green", marginRight: "10px" }}
              />
              Summary
            </span>
            {/* Không có nút CHANGE ở đây */}
          </Title>
          <div className="summary-review-div">
            {/* (Nội dung summary giữ nguyên) */}
            <div className="subtotal">
              <Text className="subtotal-text">Subtotal</Text>
              <Text className="subtotal-value">
                ${totals.subtotal.toFixed(2)}
              </Text>
            </div>
            <div className="shipping">
              <Text className="shipping-text" style={{ color: "red" }}>
                Discount(-20%)
              </Text>
              <Text className="shipping-value" style={{ color: "red" }}>
                -${totals.discount.toFixed(2)}
              </Text>
            </div>
            <div className="shipping">
              <Text className="shipping-text">Shipping</Text>
              <Text className="shipping-value">
                ${totals.shipping.toFixed(2)}
              </Text>
            </div>
            <Divider />
            <div className="total">
              <Text className="total-text">Total</Text>
              <Text className="total-value-review">
                ${totals.total.toFixed(2)}
              </Text>
            </div>
            <div className="button-review-order">
              <Button
                className="save-order"
                type="primary"
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
              <Button
                className="cancel-order"
                type="secondary"
                onClick={() => navigate("/contact")}
              >
                Contact Support
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* ===== HÀNG 2: ORDER DETAIL (giữ nguyên) ===== */}
      <div className="order-detail-review">
        <EnvironmentFilled className="icon-order-detail" /> <br />
        <Title level={3}>Order Detail</Title>
      </div>

      <Row className="order-detail-and-method" gutter={16}>
        <Col className="order-detail-and-method-left" span={24}>
          <div className="order-detail-and-method-content">
            <div className="order-detail-content">
              <div className="shipping-from">
                <EnvironmentFilled className="icon-shipping-from" />
                <Text className="text-shipping-from">
                  SHIPPING FROM{" "}
                  <b>586 Nguyễn Hữu Thọ, Sơn Trà, TP Đà Nẵng</b>
                </Text>
                <br />
                <Text className="note-text">
                  Signature will be required upon delivery.
                </Text>
                <Divider dashed style={{ borderWidth: "1px" }} />

                {/* BẢNG SẢN PHẨM */}
                <Table
                  columns={columns}
                  dataSource={processedData}
                  pagination={false}
                  className="product-table"
                />
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* ===== MODAL CHANGE PAYMENT (giữ nguyên) ===== */}
      <Modal
        title="Change Payment Method"
        visible={isPaymentModalVisible}
        onOk={() => handlePaymentOk(paymentMethod)}
        onCancel={handlePaymentCancel}
        okText="Confirm"
        cancelText="Cancel"
      >
        <Radio.Group
          onChange={(e) => setPaymentMethod(e.target.value)}
          value={paymentMethod}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <Radio value="Online Payment">Online Payment</Radio>
          <Radio value="Card on Delivery">Card on Delivery</Radio>
          <Radio value="POS on Delivery">POS on Delivery</Radio>
        </Radio.Group>
      </Modal>

      {/* ===== MODAL CHANGE SHIP TO (giữ nguyên) ===== */}
      <Modal
        title="Edit Shipping Information"
        visible={isShipToModalVisible}
        onOk={handleShipToOk}
        onCancel={handleShipToCancel}
        okText="Save Changes"
        cancelText="Cancel"
        width={600}
      >
        <Form
          form={shipToForm}
          layout="vertical"
          name="ship_to_form"
          initialValues={{
            ...currentDelivery,
            date: currentDelivery.date ? dayjs(currentDelivery.date) : null,
          }}
        >
          {/* (Form inputs giữ nguyên) */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Full Name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[
                  { required: true, message: "Please input your phone number!" },
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Phone Number" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "The input is not valid E-mail!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email Address" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address Line"
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input prefix={<HomeOutlined />} placeholder="Street Address" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: "Please input your city!" }]}
              >
                <Input placeholder="City" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: "Please select your state!" }]}
              >
                <Select placeholder="Select State">
                  <Option value="Việt Nam">Việt Nam</Option>
                  <Option value="Bồ Đào Nha">Bồ Đào Nha</Option>
                  <Option value="Thái Lan">Thái Lan</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="zip"
                label="ZIP Code"
                rules={[{ required: true, message: "Please input your ZIP code!" }]}
              >
                <Input placeholder="ZIP" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="date"
            label="Delivery Date"
            rules={[{ required: true, message: "Please select delivery date!" }]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="note" label="Delivery Note">
            <Input.TextArea
              prefix={<ProfileOutlined />}
              placeholder="Add a note for delivery"
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReviewOrder;