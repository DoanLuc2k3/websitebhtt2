import {
    BellOutlined,
    MailOutlined,
    UserOutlined,
    EditOutlined,
    LogoutOutlined,
    SearchOutlined,
    BulbOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import {
    Badge,
    Drawer,
    List,
    Space,
    Typography,
    Input,
    Button,
    Avatar,
    Form,
    Modal,
    message,
    Popover,
    Flex,
    AutoComplete,
    Switch,
    Divider,
    Select,
} from "antd";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; 

// =================================================================
// --- MOCK API DATA (KEEP) ---
// =================================================================
const getComments = () =>
    Promise.resolve({
        comments: [
            { body: "Sản phẩm A rất tốt!" },
            { body: "Tôi cần hỗ trợ về đơn hàng B." },
            { body: "Đơn hàng rất chi là đẹp." },
        ],
    });

const getOrders = () =>
    Promise.resolve({
        products: [{ title: "Tai nghe X" }, { title: "Chuột không dây Y" }],
    });

const mockSearchData = [
    // Thêm trường dịch cho dữ liệu mock
    { type: "keyword", label_vi: "Áo", label_en: "Shirt", value: "Áo", count: 120 },
    {
        type: "product",
        label_vi: "Áo Guci",
        label_en: "Gucci Shirt",
        value: "Áo Guci",
        price: "1.200.000 VNĐ",
        price_en: "$52.00",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTGDgEMu7ST1RvBPSE4njZHX_ikMLy34RWNg&s",
    },
    {
        type: "keyword",
        label_vi: "Túi xách nữ cao cấp",
        label_en: "Premium Handbag",
        value: "Túi xách nữ cao cấp",
        count: 45,
    },
    {
        type: "product",
        label_vi: "Túi xách rách",
        label_en: "Distressed Bag",
        value: "Túi xách rách",
        price: "450.000 VNĐ",
        price_en: "$20.00",
        img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTL5ZhH3_MIKtBqKLxMkXYyIrq5USZR5JO--tMllPP3FPIqkBazD7VYRS_zFr55d2koMQ2Ksjn_Qb2OB4WweThTgPrM0wPJrPJBFY5irjcXsOwQqLuhg3-xn7m0gK3ka4PhzopKisiONCgZ&usqp=CAc",
    },
];

// =================================================================
// --- MAIN COMPONENT: APPHEADER ---
// =================================================================

function AppHeader({ toggleSideMenu, isDarkMode, onToggleDarkMode }) { 
    
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const [comments, setComments] = useState([]);
    const [orders, setOrders] = useState([]);
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [notificationsOpen, setNotifications] = useState(false); // Đổi tên để tránh conflict
    const [adminOpen, setAdminOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [systemSettings, setSystemSettings] = useState({
        notifications: true,
        autoUpdate: false,
    });

    const PRIMARY_COLOR = "#1677ff";

    useEffect(() => {
        getComments().then((res) => setComments(res.comments || []));
        getOrders().then((res) => setOrders(res.products || []));
    }, [i18n.language]);

    const handleChangeLanguage = useCallback(
        (newLang) => {
            localStorage.setItem("appLanguage", newLang);
            i18n.changeLanguage(newLang);
        },
        [i18n]
    );

    const handleSaveSettings = useCallback(() => {
        message.success(t("setting_saved_success"));
        setSettingsOpen(false);
    }, [t]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem("adminLogin");
        message.success(t("logout_success")); 
        setAdminOpen(false);
        navigate("/");
    }, [t, navigate]);

    const onSearch = useCallback(
        (value) => {
            if (value) {
                message.info(t("searching_for", { term: value }));
            }
        },
        [t]
    );

    const handleToggleDarkMode = useCallback(() => {
        const newDarkMode = !isDarkMode; 
        onToggleDarkMode(newDarkMode); 
        message.info(
            t("dark_mode_status", {
                status: newDarkMode ? t("switch_to_dark") : t("switch_to_light"),
            })
        );
    }, [isDarkMode, onToggleDarkMode, t]); 

    // =================================================================
    // 🔍 LOGIC RENDER ITEM & SEARCH OPTIONS (Sửa lỗi dependency)
    // =================================================================

    // ✅ Đặt renderItem vào useCallback để tạo dependency ổn định
    const renderItem = useCallback((item) => {
        const label =
            i18n.language === "en" ? item.label_en || item.label : item.label_vi || item.label;
        const price =
            i18n.language === "en" ? item.price_en || item.price : item.price;

        if (item.type === "product") {
            return {
                value: item.value,
                label: (
                    <Flex justify="space-between" align="center" style={{ padding: "4px 0" }}>
                        <Flex gap={10} align="center">
                            <Avatar size={40} src={item.img} />
                            <div>
                                <Typography.Text strong>{label}</Typography.Text>
                                <Typography.Paragraph
                                    style={{ margin: 0, fontSize: 12, color: "#f00" }}
                                >
                                    {price}
                                </Typography.Paragraph>
                            </div>
                        </Flex>
                        <SearchOutlined style={{ color: "#ccc" }} />
                    </Flex>
                ),
            };
        }
        return {
            value: item.value,
            label: (
                <Flex justify="space-between" align="center" style={{ padding: "4px 0" }}>
                    <Typography.Text>
                        <SearchOutlined style={{ marginRight: 8, color: "#999" }} />
                        {label}
                    </Typography.Text>
                    {item.count && (
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            ({item.count} {t("search_results")})
                        </Typography.Text>
                    )}
                </Flex>
            ),
        };
    }, [i18n.language, t]); // ✅ Thêm i18n.language và t vào dependency

    // ✅ useMemo dùng renderItem làm dependency
    const currentSearchOptions = useMemo(() => mockSearchData.map(renderItem), [renderItem]); 
    
    // ✅ handleIconHover cũng cần isDarkMode và PRIMARY_COLOR
    const handleIconHover = useCallback((e, isEntering, iconColor = "#555") => {
        const target = e.currentTarget;
        const icon = target.querySelector(".anticon");
        if (isEntering) {
            target.style.backgroundColor = PRIMARY_COLOR;
            if (icon) icon.style.color = "white";
        } else {
            target.style.backgroundColor = isDarkMode ? '#1e1e1e' : "#f5f5f5"; 
            if (icon) icon.style.color = iconColor;
        }
    }, [isDarkMode, PRIMARY_COLOR]); // ✅ Thêm isDarkMode vào dependency

    // =================================================================
    // 🧑‍💼 ADMIN POPOVER CONTENT (Không thay đổi)
    // =================================================================
    const adminPopoverContent = useMemo(
        () => (
            <div style={{ width: 250 }}>
                <Flex
                    gap={10}
                    align="center"
                    style={{
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                        marginBottom: 10,
                    }}
                >
                    <Avatar
                        size={48}
                        src="https://api.dicebear.com/7.x/adventurer/svg?seed=Admin"
                    />
                    <div>
                        <Typography.Text strong>Doãn Bá Min</Typography.Text>
                        <Typography.Paragraph
                            type="secondary"
                            style={{ margin: 0, fontSize: 12 }}
                        >
                            admin@lmcompany.com
                        </Typography.Paragraph>
                    </div>
                </Flex>

                <List size="small" style={{ cursor: "pointer" }}>
                    <List.Item onClick={() => setAdminOpen(true)}>
                        <UserOutlined style={{ marginRight: 8 }} /> {t("personal_info")}
                    </List.Item>
                    <List.Item onClick={() => setSettingsOpen(true)}>
                        <SettingOutlined style={{ marginRight: 8 }} /> {t("system_settings")}
                    </List.Item>
                    <List.Item onClick={handleLogout} style={{ color: "red" }}>
                        <LogoutOutlined style={{ marginRight: 8 }} /> {t("logout")}
                    </List.Item>
                </List>
            </div>
        ),
        [t, handleLogout]
    );

    // =================================================================
    // 🧱 RENDER UI (Đã sửa lỗi cân chỉnh tìm kiếm)
    // =================================================================
    return (
        <div
            className="AppHeader header-visible"
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: isDarkMode ? '#1e1e1e' : "#fff", // 👈 Áp dụng Dark Mode
                padding: "10px 25px",
            }}
        >
            {/* LOGO */}
            <Flex
                align="center"
                gap={10}
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/dashboard")}
            >
                <Typography.Title level={3} style={{ margin: 0 }}>
                    <img
                        src="https://i.imgur.com/WadTB6X.png" 
                        alt="Logo"
                        style={{ height: 48, objectFit: "contain" }}
                    />
                </Typography.Title>
            </Flex>

            {/* SEARCH - SỬ DỤNG MARGIN LEFT AUTO ĐỂ CĂN SÁT CỤM ICON PHẢI */}
            <AutoComplete
                dropdownMatchSelectWidth={500}
                options={currentSearchOptions}
                style={{ 
                    width: 450, 
                    marginRight: 100, /* Khoảng cách với cụm icon */
                    marginLeft: 'auto' /* 👈 ĐIỀU CHỈNH CHÍNH */
                }} 
                onSelect={onSearch}
            >
                <Input
                    prefix={<SearchOutlined style={{ color: isDarkMode ? '#888' : "#aaa" }} />}
                    placeholder={t("search_placeholder")}
                    allowClear
                    onPressEnter={(e) => onSearch(e.target.value)}
                    style={{ 
                        borderRadius: 8, 
                        height: 40,
                        backgroundColor: isDarkMode ? '#333' : '#fff', // 👈 Dark Mode
                        color: isDarkMode ? '#fff' : '#000', // 👈 Dark Mode
                        borderColor: isDarkMode ? '#444' : '#d9d9d9', // 👈 Dark Mode
                    }}
                />
            </AutoComplete>

            {/* ICONS & LANGUAGE SELECTOR */}
            <Space size={16} align="center"> 
                {/* 👈 NÚT CHỌN NGÔN NGỮ ĐÃ ĐƯỢC CÂN ĐỐI */}
                <Select
                    value={i18n.language}
                    onChange={handleChangeLanguage}
                    // Đảm bảo chiều cao 40px, style cho căn chỉnh
                    style={{ 
                        width: 140, 
                        height: 40, 
                        lineHeight: '40px', 
                        verticalAlign: 'middle', 
                        backgroundColor: isDarkMode ? '#333' : 'transparent', // 👈 Dark Mode
                        color: isDarkMode ? '#fff' : '#000', // 👈 Dark Mode
                    }} 
                    bordered={false}
                    dropdownStyle={{ minWidth: 150 }}
                    optionLabelProp="label"
                    options={[
                        {
                            value: "vi",
                            label: (
                                <Flex align="center" gap={8}> 
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg"
                                        alt="Vietnamese Flag"
                                        style={{ width: 20, height: 15, borderRadius: 2 }}
                                    />
                                    {t("vietnamese_language")}
                                </Flex>
                            ),
                        },
                        {
                            value: "en",
                            label: (
                                <Flex align="center" gap={8}> 
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg"
                                        alt="English Flag"
                                        style={{ width: 20, height: 15, borderRadius: 2 }}
                                    />
                                    {t("english_language")}
                                </Flex>
                            ),
                        },
                    ]}
                />

                <Button
                    type="default"
                    shape="circle"
                    icon={
                        <BulbOutlined
                            style={{
                                fontSize: 22,
                                color: isDarkMode ? "#ffc53d" : "#FFD700", // 👈 Màu icon cho Dark Mode
                                filter: isDarkMode ? "drop-shadow(0 0 4px #ffc53d)" : "drop-shadow(0 0 4px #FFD700)",
                            }}
                        />
                    }
                    onClick={handleToggleDarkMode} // 👈 SỬ DỤNG HÀM MỚI
                    style={{
                        backgroundColor: isDarkMode ? "#3e3e1e" : "#fff7e6", // 👈 Màu nền cho Dark Mode
                        borderColor: "transparent",
                        boxShadow: isDarkMode ? "0 0 6px rgba(255, 197, 61, 0.4)" : "0 0 6px rgba(255, 215, 0, 0.4)",
                        width: 40, 
                        height: 40,
                    }}
                    onMouseEnter={(e) => handleIconHover(e, true, isDarkMode ? "#ffc53d" : "#FFD700")}
                    onMouseLeave={(e) => handleIconHover(e, false, isDarkMode ? "#ffc53d" : "#FFD700")}
                />

                <Badge count={comments.length}>
                    <Button
                        type="default"
                        shape="circle"
                        icon={<MailOutlined style={{ fontSize: 20, color: isDarkMode ? '#ccc' : "#555" }} />}
                        onClick={() => setCommentsOpen(true)}
                        style={{ 
                            backgroundColor: isDarkMode ? '#333' : "#f5f5f5", // 👈 Dark Mode
                            borderColor: "transparent",
                            width: 40, 
                            height: 40,
                        }}
                        onMouseEnter={(e) => handleIconHover(e, true)}
                        onMouseLeave={(e) => handleIconHover(e, false)}
                    />
                </Badge>

                <Badge count={orders.length}>
                    <Button
                        type="default"
                        shape="circle"
                        icon={<BellOutlined style={{ fontSize: 20, color: isDarkMode ? '#ccc' : "#555" }} />}
                        onClick={() => setNotifications(true)}
                        style={{ 
                            backgroundColor: isDarkMode ? '#333' : "#f5f5f5", // 👈 Dark Mode
                            borderColor: "transparent",
                            width: 40, 
                            height: 40,
                        }}
                        onMouseEnter={(e) => handleIconHover(e, true)}
                        onMouseLeave={(e) => handleIconHover(e, false)}
                    />
                </Badge>

                <Popover placement="bottomRight" content={adminPopoverContent} trigger="click">
                    <Space
                        style={{
                            cursor: "pointer",
                            padding: "4px 4px",
                            background: isDarkMode ? '#333' : "#f5f7fa", // 👈 Dark Mode
                            borderRadius: 25,
                            transition: "all 0.2s ease",
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 40, 
                            width: 40,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? "#444" : "#e6f4ff")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = isDarkMode ? "#333" : "#f5f7fa")}
                    >
                        <Avatar
                            src="https://api.dicebear.com/7.x/adventurer/svg?seed=Admin"
                            size="default" 
                            icon={<UserOutlined />}
                        />
                    </Space>
                </Popover>
            </Space>

            {/* DRAWER & MODAL (Không thay đổi) */}
            <Drawer
                title={t("new_comment")}
                open={commentsOpen}
                onClose={() => setCommentsOpen(false)}
                maskClosable
                style={{ backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }} // 👈 Dark Mode
            >
                <List dataSource={comments} renderItem={(item) => <List.Item style={{ color: isDarkMode ? '#ccc' : '#000' }}>{item.body}</List.Item>} />
            </Drawer>
            <Drawer
                title={t("order_notification")}
                open={notificationsOpen}
                onClose={() => setNotifications(false)}
                maskClosable
                style={{ backgroundColor: isDarkMode ? '#1e1e1e' : '#fff' }} // 👈 Dark Mode
            >
                <List
                    dataSource={orders}
                    renderItem={(item) => (
                        <List.Item>
                            <Typography.Text strong style={{ color: isDarkMode ? '#fff' : '#000' }}>{item.title}</Typography.Text>{" "}
                            <Typography.Text style={{ color: isDarkMode ? '#ccc' : '#000' }}>{t("order_placed")}</Typography.Text>
                        </List.Item>
                    )}
                />
            </Drawer>
            {/* MODAL ADMIN PROFILE */}
            <Modal
                title={`👨‍💼 ${t("admin_profile")}`}
                open={adminOpen}
                onCancel={() => setAdminOpen(false)}
                footer={null}
                centered
                bodyStyle={{ backgroundColor: isDarkMode ? '#2c2c2c' : '#fff' }} // 👈 Dark Mode
            >
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <Avatar
                        size={90}
                        src="https://api.dicebear.com/7.x/adventurer/svg?seed=Admin"
                    />
                    <Typography.Title level={4} style={{ marginTop: 10, color: isDarkMode ? '#fff' : '#000' }}>
                        Doãn Bá Min
                    </Typography.Title>
                    <Typography.Text type="secondary">{t("system_admin")}</Typography.Text>
                </div>
                <Form layout="vertical">
                    <Form.Item label={t("username")}>
                        <Input value="admin_lm" disabled style={{ backgroundColor: isDarkMode ? '#444' : '#f5f5f5', color: isDarkMode ? '#ccc' : '#000' }} />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input value="admin@lmcompany.com" style={{ backgroundColor: isDarkMode ? '#444' : '#fff', color: isDarkMode ? '#fff' : '#000' }} />
                    </Form.Item>
                    <Form.Item label={t("phone_number")}>
                        <Input value="0909 999 999" style={{ backgroundColor: isDarkMode ? '#444' : '#fff', color: isDarkMode ? '#fff' : '#000' }} />
                    </Form.Item>
                    <Form.Item label={t("role")}>
                        <Input value={t("system_admin")} disabled style={{ backgroundColor: isDarkMode ? '#444' : '#f5f5f5', color: isDarkMode ? '#ccc' : '#000' }} />
                    </Form.Item>
                    <Space style={{ display: "flex", justifyContent: "space-between" }}>
                        <Button type="primary" icon={<EditOutlined />}>
                            {t("update_info")}
                        </Button>
                        <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
                            {t("back")}
                        </Button>
                    </Space>
                </Form>
            </Modal>
            {/* SYSTEM SETTINGS MODAL (Đã xóa phần ngôn ngữ) */}
            <Modal
                title={`⚙️ ${t("system_settings")}`}
                open={settingsOpen}
                onCancel={() => setSettingsOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setSettingsOpen(false)}>
                        {t("cancel")}
                    </Button>,
                    <Button key="save" type="primary" onClick={handleSaveSettings}>
                        {t("save_changes")}
                    </Button>,
                ]}
                centered
                bodyStyle={{ backgroundColor: isDarkMode ? '#2c2c2c' : '#fff' }} // 👈 Dark Mode
            >
                <Form layout="vertical">
                    <Form.Item label={t("notifications_mode")} style={{ color: isDarkMode ? '#fff' : '#000' }}>
                        <Switch
                            checked={systemSettings.notifications}
                            onChange={(checked) =>
                                setSystemSettings({ ...systemSettings, notifications: checked })
                            }
                            checkedChildren={t("on")}
                            unCheckedChildren={t("off")}
                        />
                    </Form.Item>
                    <Form.Item label={t("auto_update")} style={{ color: isDarkMode ? '#fff' : '#000' }}>
                        <Switch
                            checked={systemSettings.autoUpdate}
                            onChange={(checked) =>
                                setSystemSettings({ ...systemSettings, autoUpdate: checked })
                            }
                            checkedChildren={t("on")}
                            unCheckedChildren={t("off")}
                        />
                    </Form.Item>

                    <Divider />

                    <Form.Item label={t("interface")} style={{ color: isDarkMode ? '#fff' : '#000' }}>
                        <Button
                            type={isDarkMode ? "default" : "primary"}
                            icon={<BulbOutlined />}
                            onClick={handleToggleDarkMode} // 👈 SỬ DỤNG HÀM MỚI
                            style={{
                                width: "100%",
                                background: isDarkMode ? "#333" : "#fff",
                                color: isDarkMode ? "#fff" : "#000",
                                borderColor: isDarkMode ? '#555' : '#1677ff',
                            }}
                        >
                            {isDarkMode ? t("switch_to_light") : t("switch_to_dark")}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default AppHeader;