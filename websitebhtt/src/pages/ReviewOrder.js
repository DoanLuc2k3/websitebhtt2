import React, { useState, useEffect, useMemo } from "react";
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
  Tag,
  message,
} from "antd";
import { getStoredOrders } from "../API";
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
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { Option } = Select;

// ✅ Helper function: Lấy thông tin user hiện tại từ localStorage
const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      console.log('⚠️ currentUser not found in localStorage');
      return null;
    }
    const parsedUser = JSON.parse(user);
    console.log('✅ Current User:', parsedUser);
    return parsedUser;
  } catch (e) {
    console.error('Failed to parse currentUser from localStorage', e);
    return null;
  }
};

const ReviewOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const defaultDelivery = useMemo(() => ({
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
  }), []);

  const initialDelivery = location.state?.delivery || defaultDelivery;
  const initialItems = (location.state && location.state.items) || [];
  const initialTotals = (location.state && location.state.totals) || { subtotal: 0, discount: 0, shipping: 0, total: 0 };

  // State cho Delivery
  const [currentDelivery, setCurrentDelivery] = useState(initialDelivery);
  const [isShipToModalVisible, setIsShipToModalVisible] = useState(false);
  const [shipToForm] = Form.useForm();

  // Items/totals
  const [itemsState, setItemsState] = useState(initialItems);
  const [totalsState, setTotalsState] = useState(initialTotals);

  // Stored orders list
  const [storedOrders, setStoredOrders] = useState([]);
  const [selectedStoredKey, setSelectedStoredKey] = useState(null);
  const [orderStatus, setOrderStatus] = useState(location.state?.status || null);

  // ✅ State cho current user
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // ✅ Load currentUser khi component mount
  useEffect(() => {
    const user = getCurrentUser();
    console.log('Setting current user on mount:', user);
    setCurrentUser(user);
  }, []);

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
      message.success('Cập nhật thông tin giao hàng thành công');
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

  // ✅ LOAD STORED ORDERS VÀ LỌC THEO USER HIỆN TẠI
  useEffect(() => {
    const load = () => {
      try {
        setIsLoadingOrders(true);

        const user = getCurrentUser();
        const allOrders = getStoredOrders() || [];

        console.log('📦 All stored orders:', allOrders);
        console.log('👤 Current user for filtering:', user);

        let userOrders = [];

        if (user) {
          // ✅ LỌC ĐƠN HÀNG THEO USER
          userOrders = allOrders.filter((order) => {
            const orderUserId = order.userId || order.customer?.userId;
            const orderCustomerEmail = order.customer?.email;
            const userEmail = user.email;
            const userId = user.id;

            // So sánh ID trước, nếu không có thì so sánh email
            const isMatch = orderUserId === userId || orderCustomerEmail === userEmail;

            console.log(`Checking order:`, {
              orderId: order.id,
              orderUserId,
              orderCustomerEmail,
              userId,
              userEmail,
              isMatch
            });

            return isMatch;
          });

          console.log('✅ Filtered user orders:', userOrders);
        } else {
          console.log('❌ No user found - not filtering orders');
          userOrders = [];
        }

        setStoredOrders(userOrders);

        // Auto-select first order nếu có
        if (!location.state && userOrders && userOrders.length > 0) {
          const first = userOrders[0];
          setSelectedStoredKey(first.key || first.id);
          setItemsState(first.items || []);
          setTotalsState(first.totals || { subtotal: 0, discount: 0, shipping: 0, total: 0 });
          setCurrentDelivery(() => first.customer || initialDelivery);
          setOrderStatus(first.status || null);
        }

      } catch (e) {
        console.error('Failed to load stored orders', e);
        message.error('Lỗi khi tải đơn hàng');
      } finally {
        setIsLoadingOrders(false);
      }
    };

    // Load khi currentUser thay đổi
    if (currentUser) {
      load();
    }

    const handler = () => load();
    window.addEventListener('orders_updated', handler);
    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('orders_updated', handler);
      window.removeEventListener('storage', handler);
    };
  }, [location.state, initialDelivery, currentUser]);

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
    message.success('Cập nhật phương thức thanh toán thành công');
  };

  const handlePaymentCancel = () => {
    setIsPaymentModalVisible(false);
  };

  // Cấu hình cột bảng
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

  const processedData = (itemsState || []).map((item) => ({
    key: item.product?.id || item.id || Math.random(),
    image: item.product?.thumbnail || item.thumbnail || (item.product && item.product.images && item.product.images[0]) || '',
    name: item.product?.title || item.title || item.name || 'Product',
    price: item.product?.price || item.price || 0,
    stock: item.product?.stock || item.stock || 0,
    qty: item.quantity || item.qty || 1,
    subtotal: ((item.product?.price || item.price || 0) * (item.quantity || item.qty || 1)).toFixed(2),
  }));

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

      {/* ✅ HIỂN THỊ THÔNG TIN USER HIỆN TẠI */}
      {currentUser ? (
        <div style={{ marginTop: 12, marginBottom: 12, padding: "12px 16px", backgroundColor: "#e6f7ff", borderRadius: "6px", borderLeft: "4px solid #1890ff" }}>
          <Text>
            <UserOutlined style={{ marginRight: 8, color: "#1890ff", fontSize: 16 }} />
            <span style={{ fontSize: 14 }}>Đơn hàng của: </span>
            <Text strong style={{ color: "#1890ff", fontSize: 15 }}>{currentUser.name}</Text>
            <span style={{ marginLeft: "12px", color: "#666", fontSize: 12 }}>({currentUser.email})</span>
          </Text>
        </div>
      ) : (
        <div style={{ marginTop: 12, marginBottom: 12, padding: "12px 16px", backgroundColor: "#fff7e6", borderRadius: "6px", borderLeft: "4px solid #faad14" }}>
          <Text type="warning" style={{ fontSize: 14 }}>
            ⚠️ Vui lòng <a href="/login" style={{ color: '#faad14', fontWeight: 'bold' }}>đăng nhập</a> để xem đơn hàng của bạn
          </Text>
        </div>
      )}

      {/* ✅ DROPDOWN CHỌN ĐƠN HÀNG - CHỈ HIỂN THỊ NẾU CÓ ĐƠN HÀNG */}
      {!location.state && storedOrders && storedOrders.length > 0 && (
        <div style={{ marginTop: 12, marginBottom: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Text strong>Chọn đơn hàng:</Text>
          <Select
            value={selectedStoredKey}
            onChange={(val) => {
              console.log('Selected order key:', val);
              setSelectedStoredKey(val);
              const found = (storedOrders || []).find((s) => {
                const sKey = s.key || s.id;
                return String(sKey) === String(val);
              });

              console.log('Found order:', found);

              if (found) {
                setItemsState(found.items || []);
                setTotalsState(found.totals || { subtotal: 0, discount: 0, shipping: 0, total: 0 });
                setCurrentDelivery(found.customer || defaultDelivery);
                setOrderStatus(found.status || null);
                message.success('Đã chọn đơn hàng thành công');
              }
            }}
            style={{ minWidth: 350 }}
            options={(storedOrders || []).map((s) => ({
              label: `${s.id || s.key} - ${s.customer?.name || 'N/A'}`,
              value: s.key || s.id
            }))}
            placeholder="Chọn đơn hàng của bạn"
            loading={isLoadingOrders}
          />
        </div>
      )}

      {/* ✅ THÔNG BÁO KHI KHÔNG CÓ ĐƠN HÀNG */}
      {!location.state && (!storedOrders || storedOrders.length === 0) && currentUser && !isLoadingOrders && (
        <div style={{ marginTop: 12, marginBottom: 12, padding: "12px 16px", backgroundColor: "#fff7e6", borderRadius: "6px", borderLeft: "4px solid #faad14" }}>
          <Text type="warning" style={{ fontSize: 14 }}>
            📦 Bạn chưa có đơn hàng nào. Vui lòng tạo đơn hàng mới từ trang sản phẩm.
          </Text>
        </div>
      )}

      {orderStatus && (
        <div style={{ marginTop: 8, marginBottom: 8 }}>
          <Text strong>Trạng thái: </Text>
          <Tag color={orderStatus === 'delivered' ? 'green' : orderStatus === 'processing' ? 'gold' : 'volcano'} style={{ textTransform: 'capitalize' }}>
            {orderStatus}
          </Tag>
        </div>
      )}
      <br />
      <EnvironmentFilled style={{ color: "green" }} /> <br />

      {/* ===== HÀNG 1: SHIP TO, PAYMENT, SUMMARY ===== */}
      <Row className="ship-to-payment" gutter={16}>
        {/* SHIP TO */}
        <Col className="ship-to" span={8}>
          <Title level={3} className="ship-to-title">
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

        {/* PAYMENT */}
        <Col className="payment-review" span={9}>
          <Title level={3} className="ship-to-title">
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
            <div className="payment-review-parent">
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

        {/* SUMMARY */}
        <Col className="summary-review" span={7}>
          <Title level={3} className="ship-to-title">
            <span className="title-content-wrapper">
              <FileDoneOutlined
                style={{ color: "green", marginRight: "10px" }}
              />
              Summary
            </span>
          </Title>
          <div className="summary-review-div">
            <div className="subtotal">
              <Text className="subtotal-text">Subtotal</Text>
              <Text className="subtotal-value">
                ${ (totalsState.subtotal || 0).toFixed(2) }
              </Text>
            </div>
            <div className="shipping">
              <Text className="shipping-text" style={{ color: "red" }}>
                Discount(-20%)
              </Text>
              <Text className="shipping-value" style={{ color: "red" }}>
                -${ (totalsState.discount || 0).toFixed(2) }
              </Text>
            </div>
            <div className="shipping">
              <Text className="shipping-text">Shipping</Text>
              <Text className="shipping-value">
                ${ (totalsState.shipping || 0).toFixed(2) }
              </Text>
            </div>
            <Divider />
            <div className="total">
              <Text className="total-text">Total</Text>
              <Text className="total-value-review">
                ${ (totalsState.total || 0).toFixed(2) }
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

      {/* ===== HÀNG 2: ORDER DETAIL ===== */}
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

      {/* ===== MODAL CHANGE PAYMENT ===== */}
      <Modal
        title="Change Payment Method"
        open={isPaymentModalVisible}
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

      {/* ===== MODAL CHANGE SHIP TO ===== */}
      <Modal
        title="Edit Shipping Information"
        open={isShipToModalVisible}
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