// src/pages/CartProducts.js
import "../style/CartProducts.css";
// src/pages/CartProducts.js
import "../style/CartProducts.css";
import React, { useState, useEffect, useCallback } from "react";
import cartImg from "../assets/images/cart-icon.png";
import cartGif from "../assets/images/cart.gif";
import { useNavigate } from "react-router-dom";
import {
    Row,
    Col,
    Typography,
    Button,
    Image,
    Badge,
    Checkbox,
    Space,
    Divider,
    Input,
    Empty,
    Rate,
    Modal,
    List,
    Avatar,
    Tag,
    message,
} from "antd";
import {
    TagsOutlined,
    CheckCircleOutlined,
    ShoppingCartOutlined,
    SmileOutlined,
    StarOutlined,
    Loading3QuartersOutlined,
    DeleteOutlined,
    CloseCircleOutlined,
    CarOutlined,
} from "@ant-design/icons";
import { useCart } from "../context/CartContext";
import { useOrderHistory } from "../context/OrderHistoryContext";

import { getAllCoupons } from "../data/discountServiceUser.js";
import { getAllShippingDiscounts } from "../data/shippingServiceUser.js";

const { Title, Text } = Typography;

// --- HELPER FUNCTIONS ---
const formatCurrency = (amount) => `$${Number(amount).toFixed(2)}`;

const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    try {
        return new Date(isoString).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch (error) {
        return "Invalid Date";
    }
};

const parseCurrency = (value) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
        const cleaned = value.replace("$", "").replace(/,/g, ".").trim();
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
};

const CartProducts = () => {
    const navigate = useNavigate();
    const [selectAll, setSelectAll] = useState(false);
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const { orderHistory, cancelOrder } = useOrderHistory();

    // (replaced by generic status modal below)

    const [isCouponModalVisible, setIsCouponModalVisible] = useState(false);
    const [activeProductCoupons, setActiveProductCoupons] = useState([]);
    const [loadingProductCoupons, setLoadingProductCoupons] = useState(false);
    const [activeShippingCoupons, setActiveShippingCoupons] = useState([]);
    const [loadingShippingCoupons, setLoadingShippingCoupons] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [appliedShippingRule, setAppliedShippingRule] = useState(null);
    const [shippingDiscountValue, setShippingDiscountValue] = useState(0);

    const subtotal = cartItems.reduce(
        (acc, item) => acc + (item.product?.price || 0) * (item.quantity || 0),
        0
    );

    const baseDeliveryFee = subtotal > 0 ? 20 : 0;
    const finalDeliveryFee = Math.max(0, baseDeliveryFee - shippingDiscountValue);
    const total = subtotal - discountAmount + finalDeliveryFee;

    const calculateProductDiscount = useCallback((coupon, currentSubtotal) => {
        if (!coupon || !coupon.discount) return 0;
        const discountString = String(coupon.discount);
        try {
            if (discountString.includes("%")) {
                const value = parseFloat(discountString.replace("%", ""));
                if (isNaN(value)) return 0;
                return Math.min((currentSubtotal * value) / 100, currentSubtotal);
            } else if (discountString.includes("$")) {
                const value = parseFloat(discountString.replace("$", ""));
                if (isNaN(value)) return 0;
                return Math.min(value, currentSubtotal);
            } else {
                const value = parseFloat(discountString);
                if (isNaN(value)) return 0;
                return Math.min(value, currentSubtotal);
            }
        } catch (error) {
            console.error("Lỗi khi phân tích chuỗi discount:", error);
            return 0;
        }
    }, []);

    const calculateShippingDiscount = useCallback((rule, currentSubtotal, currentBaseDeliveryFee) => {
        if (!rule || !rule.isActive) return 0;
        const minOrder = parseCurrency(rule.minOrderValue);
        if (currentSubtotal < minOrder) return 0;
        if (rule.discountType === "FREE") return currentBaseDeliveryFee;
        if (rule.discountType === "FIXED") {
            const discountVal = parseCurrency(rule.discountValue);
            return Math.min(discountVal, currentBaseDeliveryFee);
        }
        return 0;
    }, []);

    useEffect(() => {
        if (appliedCoupon) {
            const newDiscount = calculateProductDiscount(appliedCoupon, subtotal);
            setDiscountAmount(newDiscount);
        } else {
            setDiscountAmount(0);
        }
    }, [subtotal, appliedCoupon, calculateProductDiscount]);

    useEffect(() => {
        if (appliedShippingRule) {
            const newShippingDiscount = calculateShippingDiscount(appliedShippingRule, subtotal, baseDeliveryFee);
            setShippingDiscountValue(newShippingDiscount);
        } else {
            setShippingDiscountValue(0);
        }
    }, [subtotal, appliedShippingRule, baseDeliveryFee, calculateShippingDiscount]);

    const handleDeleteClick = () => {
        if (selectAll && cartItems.length > 0) {
            Modal.confirm({
                title: "Xác nhận xóa sản phẩm",
                content: "Bạn có chắc chắn muốn xóa tất cả sản phẩm?",
                okText: "Xác nhận",
                cancelText: "Hủy",
                onOk: () => {
                    clearCart();
                    setSelectAll(false);
                    setAppliedCoupon(null);
                    setAppliedShippingRule(null);
                },
            });
        }
    };

    const handleShowCouponModal = async () => {
        setIsCouponModalVisible(true);

        const fetchProductCoupons = async () => {
            setLoadingProductCoupons(true);
            try {
                const allCoupons = await getAllCoupons();
                return allCoupons.filter((c) => c.status === "active");
            } catch (error) {
                console.error("Lỗi khi tải mã giảm giá sản phẩm:", error);
                message.error("Không thể tải mã giảm giá sản phẩm!");
                return [];
            } finally {
                setLoadingProductCoupons(false);
            }
        };

        const fetchShippingCoupons = async () => {
            setLoadingShippingCoupons(true);
            try {
                const allShipping = await getAllShippingDiscounts();
                return allShipping.filter((s) => s.isActive === true);
            } catch (error) {
                console.error("Lỗi khi tải chiết khấu vận chuyển:", error);
                message.error("Không thể tải mã giảm giá vận chuyển!");
                return [];
            } finally {
                setLoadingShippingCoupons(false);
            }
        };

        const [productResults, shippingResults] = await Promise.all([
            fetchProductCoupons(),
            fetchShippingCoupons(),
        ]);

        setActiveProductCoupons(productResults);
        setActiveShippingCoupons(shippingResults);
    };

    const handleCloseCouponModal = () => setIsCouponModalVisible(false);

    const handleApplyCouponFromModal = (item, type) => {
        if (type === "product") {
            setCouponCode(item.code);
            setAppliedCoupon(item);
            setDiscountAmount(calculateProductDiscount(item, subtotal));
            message.success(`Đã áp dụng mã sản phẩm: ${item.name}`);
        } else if (type === "shipping") {
            setAppliedShippingRule(item);
            const newShippingDiscount = calculateShippingDiscount(item, subtotal, baseDeliveryFee);
            if (newShippingDiscount === 0 && subtotal < parseCurrency(item.minOrderValue)) {
                message.warning(
                    `Cần mua thêm ${(parseCurrency(item.minOrderValue) - subtotal).toFixed(2)}$ để áp dụng mã này.`
                );
            } else {
                message.success(`Đã áp dụng mã vận chuyển: ${item.ruleName}`);
            }
            setShippingDiscountValue(newShippingDiscount);
        }
        handleCloseCouponModal();
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            message.warning("Vui lòng nhập mã giảm giá sản phẩm.");
            return;
        }
        setIsApplyingCoupon(true);
        try {
            let couponsToSearch = activeProductCoupons;
            if (couponsToSearch.length === 0) {
                const allCoupons = await getAllCoupons();
                couponsToSearch = allCoupons.filter((c) => c.status === "active");
                setActiveProductCoupons(couponsToSearch);
            }
            const foundCoupon = couponsToSearch.find(
                (c) => c.code.toLowerCase() === couponCode.toLowerCase().trim()
            );
            if (foundCoupon) {
                setAppliedCoupon(foundCoupon);
                setDiscountAmount(calculateProductDiscount(foundCoupon, subtotal));
                message.success(`Đã áp dụng mã: ${foundCoupon.name}`);
            } else {
                setAppliedCoupon(null);
                setDiscountAmount(0);
                message.error("Mã giảm giá sản phẩm không hợp lệ hoặc đã hết hạn.");
            }
        } catch (error) {
            console.error("Lỗi khi áp dụng coupon:", error);
            message.error("Đã xảy ra lỗi khi áp dụng mã.");
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleGoToCheckout = () => {
        if (cartItems.length === 0) {
            message.warning("Giỏ hàng của bạn đang trống!");
            return;
        }
        navigate("/checkout", {
            state: {
                subtotal,
                discountAmount,
                shippingDiscountValue,
                finalDeliveryFee,
                total,
                appliedCouponName: appliedCoupon ? appliedCoupon.name : null,
                appliedShippingRuleName: appliedShippingRule ? appliedShippingRule.ruleName : null,
            },
        });
    };

    // Generic modal for showing orders by status
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [statusModalTitle, setStatusModalTitle] = useState("");
    const [statusModalOrders, setStatusModalOrders] = useState([]);

    // Close helper
    const closeStatusModal = () => {
        setStatusModalVisible(false);
        setStatusModalTitle("");
        setStatusModalOrders([]);
    };

    // Mapping of UI keys to status matchers and titles. Add common synonyms to be resilient.
    const STATUS_MAP = {
        confirming: { title: "Đang Xác nhận", match: (s) => s === "Processing" || s === "Pending" },
        confirmed: { title: "Đã Xác nhận", match: (s) => s === "Confirmed" || s === "Processed" },
        delivering: { title: "Đang Giao hàng", match: (s) => s === "Shipping" || s === "Delivering" || s === "Shipped" },
        delivered: { title: "Đã Giao", match: (s) => s === "Delivered" || s === "Completed" },
        review: { title: "Chờ Đánh giá", match: (s) => s === "AwaitingReview" || s === "PendingReview" || s === "Review" },
            cancelled: { title: "Đã Hủy", match: (s) => s === "Cancelled" || s === "Canceled" },
    };

    // Open modal for a given status key
    const [statusModalKey, setStatusModalKey] = useState(null);
    const openStatusModal = (key) => {
        const def = STATUS_MAP[key];
        if (!def) return;
        const filtered = Array.isArray(orderHistory) ? orderHistory.filter((order) => def.match(order.status)) : [];
        setStatusModalKey(key);
        setStatusModalTitle(def.title);
        setStatusModalOrders(filtered);
        setStatusModalVisible(true);
    };

    // Handler to cancel a confirming order (asks for confirmation then calls context)
    const handleCancelOrder = (orderId) => {
        Modal.confirm({
            title: 'Hủy đơn hàng',
            content: 'Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.',
            okText: 'Hủy đơn',
            okType: 'danger',
            cancelText: 'Đóng',
            onOk: async () => {
                const ok = cancelOrder ? cancelOrder(orderId) : false;
                if (ok) {
                    message.success('Đã hủy đơn hàng.');
                    // refresh modal list from updated orderHistory (orderHistory state from context should update)
                    const def = STATUS_MAP[statusModalKey];
                    const filtered = Array.isArray(orderHistory) ? orderHistory.filter((order) => def.match(order.status)) : [];
                    setStatusModalOrders(filtered);
                } else {
                    message.error('Không thể hủy đơn hàng. Vui lòng thử lại.');
                }
            }
        });
    };

    return (
        <div className="shopping-card-page">
            <div className="cart-gif-container">
                <Image className="cart-gif" src={cartGif} preview={false} />
                <Title className="shopping-cart-title" level={2}>
                    GIỎ HÀNG CỦA BẠN
                </Title>
            </div>

            {/* Trạng thái Đơn hàng (giả định) */}
            <Row gutter={16} className="order-status-shopping">
                <Col className="order-confirm" span={3}>
                    <Text className="order-status-title">Trạng thái Đơn hàng: </Text>
                </Col>
                <Col className="order-confirm" span={3}>
                    <div
                        className="checkpoint-col"
                        onClick={() => openStatusModal('confirming')}
                        style={{ cursor: "pointer" }}
                    >
                        <Badge count={Array.isArray(orderHistory) ? orderHistory.filter(o => STATUS_MAP.confirming.match(o.status)).length : 0} color="red" offset={[-2, 5]} showZero>
                            <Loading3QuartersOutlined style={{ fontSize: 24 }} />
                        </Badge>
                        <Text>Đang Xác nhận</Text>
                        <span className="checkpoint" />
                    </div>
                </Col>
                        <Col className="order-confirm" span={3}>
                            <div className="checkpoint-col" onClick={() => openStatusModal('confirmed')} style={{ cursor: 'pointer' }}>
                                <CheckCircleOutlined style={{ fontSize: 24 }} />
                                <Text>Đã Xác nhận</Text>
                                <span className="checkpoint" />
                            </div>
                        </Col>
                        <Col className="order-confirm" span={3}>
                            <div className="checkpoint-col" onClick={() => openStatusModal('delivering')} style={{ cursor: 'pointer' }}>
                                
                                    <ShoppingCartOutlined style={{ fontSize: 24 }} />
                                
                                <Text>Đang Giao hàng</Text>
                                <span className="checkpoint" />
                            </div>
                        </Col>
                        <Col className="order-confirm" span={3}>
                            <div className="checkpoint-col" onClick={() => openStatusModal('delivered')} style={{ cursor: 'pointer' }}>
                                <SmileOutlined style={{ fontSize: 24 }} />
                                <Text>Đã Giao</Text>
                                <span className="checkpoint" />
                            </div>
                        </Col>
                        <Col className="order-confirm" span={3}>
                            <div className="checkpoint-col" onClick={() => openStatusModal('review')} style={{ cursor: 'pointer' }}>
                                
                                    <StarOutlined style={{ fontSize: 24 }} />
                                
                                <Text>Chờ Đánh giá</Text>
                                <span className="checkpoint" />
                            </div>
                        </Col>
                        <Col className="order-confirm" span={3}>
                            <div className="checkpoint-col" onClick={() => openStatusModal('cancelled')} style={{ cursor: 'pointer' }}>
                                <Badge count={Array.isArray(orderHistory) ? orderHistory.filter(o => STATUS_MAP.cancelled.match(o.status)).length : 0} color="gray" offset={[-2, 5]} showZero>
                                    <CloseCircleOutlined style={{ fontSize: 24, color: '#888' }} />
                                </Badge>
                                <Text>Đã Hủy</Text>
                                <span className="checkpoint" />
                            </div>
                        </Col>
            </Row>

            <div>
                <img className="cart-img" src={cartImg} alt="Giỏ hàng" style={{ width: "35px", height: "35px" }} />
                <Title className="cart-title-shopping" level={3}>
                    Giỏ Hàng
                </Title>
            </div>

            <div className="shopping-cart-content">
                <Row className="shopping-cart-content" gutter={32}>
                    <Col span={15} className="shopping-col-left">
                        <div className="select-card">
                            <div className="select-card-item">
                                <Checkbox className="select-checkbox" checked={selectAll} onChange={(e) => setSelectAll(e.target.checked)}>
                                    Chọn Tất cả
                                </Checkbox>
                                <Button type="primary" className="delete-cart-button" onClick={handleDeleteClick} disabled={!selectAll || cartItems.length === 0}>
                                    Xóa
                                </Button>
                            </div>
                        </div>

                        <div className="product-card-shopping">
                            <div className="product-card-shopping-item">
                                {cartItems.length === 0 ? (
                                    <Empty description="Giỏ hàng của bạn trống" />
                                ) : (
                                    cartItems.map((item) => (
                                        <React.Fragment key={item.product.id}>
                                            <Row className="item-cart">
                                                <Col span={5} className="item-cart-col">
                                                    <img src={item.product.thumbnail} alt={item.product.title} />
                                                </Col>
                                                <Col span={10} className="item-cart-col">
                                                    <Text className="item-text">{item.product.title}</Text>
                                                    <br />
                                                    <Text className="item-attribute" ellipsis={{ tooltip: item.product.description }}>
                                                        {item.product.description}
                                                    </Text>
                                                    <br />
                                                    <Rate disabled defaultValue={Math.round(item.product.rating)} style={{ fontSize: 14 }} />
                                                    <br />
                                                    <Text className="item-price">${item.product.price}</Text>
                                                </Col>
                                                <Col span={9} className="action-cart">
                                                    <DeleteOutlined className="delete-icon" style={{ fontSize: "24px" }} onClick={() => removeFromCart(item.product.id)} />
                                                    <Space className="quantity-product-cart">
                                                        <Button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</Button>
                                                        <Text>{item.quantity}</Text>
                                                        <Button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</Button>
                                                    </Space>
                                                </Col>
                                            </Row>
                                            <Divider />
                                        </React.Fragment>
                                    ))
                                )}
                            </div>
                        </div>
                    </Col>

                    <Col span={9} className="shopping-col-right">
                        <div className="sumary-card">
                            <div className="sumary-item">
                                <Title level={5} className="order-sumary">
                                    Tóm Tắt Đơn Hàng
                                </Title>

                                <div className="coupon-apply">
                                    <div className="coupon-left">
                                        <TagsOutlined style={{ fontSize: "20px" }} />
                                        <Input className="coupoint-text" placeholder="Mã Giảm giá Sản phẩm" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
                                    </div>
                                    <Button className="apply-button" type="primary" onClick={handleApplyCoupon} loading={isApplyingCoupon}>
                                        Áp dụng
                                    </Button>
                                </div>

                                <div style={{ width: "100%", textAlign: "right",  }}>
                                    <Button type="link" onClick={handleShowCouponModal} icon={<TagsOutlined />} style={{ paddingRight: "0" }}>
                                        Xem tất cả mã giảm giá
                                    </Button>
                                </div>

                                <Row className="price-summary">
                                    <Col span={12} className="price-summary-col">
                                        <Text className="title-price-summary">Tổng phụ</Text>
                                        <br />
                                        <Text className="title-price-summary">{appliedCoupon ? `Giảm giá (${appliedCoupon.name})` : "Giảm giá"}</Text>
                                        <br />
                                        <Text className="title-price-summary">{appliedShippingRule ? `Phí Giao hàng (${appliedShippingRule.ruleName})` : "Phí Giao hàng"}</Text>
                                    </Col>
                                    <Col span={12} className="value-price-summary">
                                        <Text className="text-price-summary">${subtotal.toFixed(2)}</Text>
                                        <br />
                                        <Text className="text-discount">-${discountAmount.toFixed(2)}</Text>
                                        <br />
                                        <Text className="text-price-summary">
                                            {shippingDiscountValue > 0 && baseDeliveryFee > 0 ? (
                                                <>
                                                    <Text delete style={{ color: "#8c8c8c", marginRight: "5px" }}>${baseDeliveryFee.toFixed(2)}</Text>
                                                    <Text style={{ color: "#52c41a" }}>${finalDeliveryFee.toFixed(2)}</Text>
                                                </>
                                            ) : (
                                                `$${finalDeliveryFee.toFixed(2)}`
                                            )}
                                        </Text>
                                        <br />
                                    </Col>
                                </Row>

                                <Divider style={{ marginTop: "8px" }} />

                                <Row className="price-summary">
                                    <Col className="total-title" span={12}>
                                        Tổng cộng
                                    </Col>
                                    <Col className="total-value" span={12}>
                                        ${total.toFixed(2)}
                                    </Col>
                                </Row>

                                <Button className="go-to-checkout" type="primary" onClick={handleGoToCheckout}>
                                    Tiến hành Thanh toán →
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

            <Modal title="Mã giảm giá có sẵn" open={isCouponModalVisible} onCancel={handleCloseCouponModal} footer={[<Button key="close" onClick={handleCloseCouponModal}>Đóng</Button>]} width={700}>
                <Title level={5}>
                    <TagsOutlined /> Mã giảm giá sản phẩm
                </Title>
                <List loading={loadingProductCoupons} itemLayout="horizontal" dataSource={activeProductCoupons} renderItem={(item) => (
                    <List.Item className="coupon-list-item" actions={[<Button type="primary" className="coupon-item-apply-btn" onClick={() => handleApplyCouponFromModal(item, "product")} disabled={appliedCoupon && appliedCoupon.code === item.code}>{appliedCoupon && appliedCoupon.code === item.code ? "Đã áp dụng" : "Áp dụng"}</Button>] }>
                        <List.Item.Meta avatar={<Avatar src={item.avatar} icon={<TagsOutlined />} />} title={<span className="coupon-item-name">{item.name}</span>} description={<span className="coupon-item-desc">{item.description}</span>} />
                        <div className="coupon-item-action"><Text className="coupon-item-discount">{item.discount}</Text><Tag className="coupon-item-code">{item.code}</Tag></div>
                    </List.Item>
                )} />

                <Divider />

                <Title level={5}><CarOutlined /> Hỗ trợ vận chuyển</Title>
                <List loading={loadingShippingCoupons} itemLayout="horizontal" dataSource={activeShippingCoupons} renderItem={(item) => (
                    <List.Item className="coupon-list-item" actions={[<Button type="primary" className="coupon-item-apply-btn" onClick={() => handleApplyCouponFromModal(item, "shipping")} disabled={appliedShippingRule && appliedShippingRule.id === item.id}>{appliedShippingRule && appliedShippingRule.id === item.id ? "Đã áp dụng" : "Áp dụng"}</Button>] }>
                        <List.Item.Meta avatar={<Avatar style={{ backgroundColor: "#1890ff" }} icon={<CarOutlined />} />} title={<span className="coupon-item-name">{item.ruleName}</span>} description={<span className="coupon-item-desc">{item.description}</span>} />
                        <div className="coupon-item-action"><Text className="coupon-item-discount">{item.discountType === "FREE" ? "MIỄN PHÍ SHIP" : item.discountValue}</Text><Tag className="coupon-item-code" color="green">{`Đơn hàng từ ${item.minOrderValue}`}</Tag></div>
                    </List.Item>
                )} />
            </Modal>

            <Modal title={`${statusModalTitle} (${statusModalOrders.length})`} open={statusModalVisible} onCancel={closeStatusModal} footer={[<Button key="close" onClick={closeStatusModal}>Đóng</Button>]} width={800}>
                <List itemLayout="horizontal" dataSource={statusModalOrders} locale={{ emptyText: "Không có đơn hàng." }} renderItem={(order) => (
                    <List.Item
                        key={order.id}
                        extra={<div style={{ textAlign: "right", minWidth: "100px" }}><Text strong>{formatCurrency(order.totals?.total || order.totals)}</Text><br/><Tag color="blue">{order.status}</Tag></div>}
                        actions={statusModalKey === 'confirming' ? [<Button danger onClick={() => handleCancelOrder(order.id)} key="cancel" className="cart-order-cancel-button">Hủy đơn hàng</Button>] : []}
                    >
                        <List.Item.Meta avatar={<Avatar src={order.items?.[0]?.product?.thumbnail} icon={<ShoppingCartOutlined />} />} title={<Text strong>{order.id}</Text>} description={`Đặt lúc: ${formatDate(order.orderDate)} - Giao tới: ${order.delivery?.name || "-"}`} />
                    </List.Item>
                )} />
            </Modal>
        </div>
    );
};

export default CartProducts;