import React, { useEffect, useState } from "react";
import {
    UserOutlined,
    SearchOutlined,
    EnvironmentOutlined,
    CloudDownloadOutlined, 
    PhoneOutlined,
    EditOutlined, 
    HistoryOutlined, 
    DollarCircleOutlined, 
    CommentOutlined,
    MailOutlined,
    UserSwitchOutlined, 
    CheckCircleOutlined,
    ShoppingCartOutlined
} from "@ant-design/icons";
import {
    Avatar,
    Space,
    Table,
    Typography,
    Card,
    Tag,
    Input,
    Select,
    Badge,
    Flex,
    Button,
    Tooltip,
    message,
    Modal,
    Form,
    Drawer, 
    Timeline 
} from "antd";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

// --- 1. HÀM FETCH DỮ LIỆU THỰC TẾ TỪ DUMMYJSON ---
/**
 * Lấy danh sách người dùng từ DummyJSON API.
 * @returns {Promise<object>} Dữ liệu JSON từ API.
 */
const getCustomers = async () => {
    try {
        // Sử dụng API thật
        const response = await fetch("https://dummyjson.com/users");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("Error fetching customers:", error);
        // Trả về cấu trúc rỗng nếu lỗi
        return { users: [] };
    }
};

// --- ÁNH XẠ THÀNH PHỐ (Mô phỏng VN city từ US/Global city) ---
const cityMap = {
    "New York": { vi: "Hà Nội", en: "Hanoi" },
    "Los Angeles": { vi: "Hồ Chí Minh", en: "Ho Chi Minh" },
    "Chicago": { vi: "Đà Nẵng", en: "Da Nang" },
    "Houston": { vi: "Hải Phòng", en: "Hai Phong" },
};


const getAvgOrderValue = () => {
    // Giá trị ngẫu nhiên (VND)
    const value = Math.floor(Math.random() * (1500000 - 50000) + 50000);
    return value;
};

const getStatus = () => (Math.random() > 0.65 ? "online" : "offline");


const generateTimelineData = (customer, t, i18n) => {
    const ordersCount = customer.totalOrders || 0;
    let events = [];

    const isVietnamese = i18n.language === 'vi';

    // Hàm định dạng tiền tệ đơn giản cho timeline
    const formatPrice = (amount) => {
        const locale = isVietnamese ? 'vi-VN' : 'en-US';
        const currencySymbol = isVietnamese ? 'đ' : '$';
        // Giả lập tỉ giá 23000 VND/USD
        const displayAmount = isVietnamese ? amount : amount / 23000; 

        return `${displayAmount.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${currencySymbol}`;
    };

    // Kiểm tra và xử lý joinDate có thể ở định dạng string hoặc Date object
    let joinDateObj;
    try {
         // Thử phân tích cú pháp joinDate theo định dạng từ useEffect (locale string)
         const dateParts = customer.joinDate.split('/');
         if (dateParts.length === 3) {
            const [day, month, year] = dateParts.map(Number);
            joinDateObj = new Date(year, month - 1, day);
         } else {
             // Thử parse như Date string (phòng trường hợp format locale khác)
             joinDateObj = new Date(customer.joinDate);
         }
    } catch (e) {
        // Fallback nếu parse lỗi
        joinDateObj = new Date();
    }
    
    // Đảm bảo joinDateObj là một Date hợp lệ
    if (isNaN(joinDateObj.getTime())) {
        joinDateObj = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000); // Ngày ngẫu nhiên nếu lỗi
    }


    // 1. Sự kiện Đăng ký
    events.push({
        date: joinDateObj,
        label: `${customer.joinDate}`,
        children: <Text strong>{t("cus_timeline_account_registered")}</Text>, 
        color: "green",
        dot: <CheckCircleOutlined style={{ fontSize: '16px' }} />,
    });

    // 2. Sự kiện Đặt hàng
    for (let i = 1; i <= ordersCount; i++) {
        // Tạo ngày đặt hàng ngẫu nhiên giữa ngày đăng ký và hiện tại
        const timeDiff = Date.now() - joinDateObj.getTime();
        const randomTime = Math.random() * timeDiff;
        const orderDateObj = new Date(joinDateObj.getTime() + randomTime);

        const orderDateStr = orderDateObj.toLocaleDateString(i18n.language);
        const orderAmount = (Math.random() * 500000 + 100000);
        
        events.push({
            date: orderDateObj,
            label: `${orderDateStr}`,
            children: (
                <div>
                    <Text strong>{t("cus_timeline_order_success")}</Text> <Tag color="blue">#ORD{customer.id * 100 + i}</Tag> 
                    <Text type="secondary" style={{ display: 'block', fontSize: 13 }}>{t("cus_timeline_value")}: {formatPrice(orderAmount)}</Text> 
                </div>
            ),
            color: "blue",
            dot: <ShoppingCartOutlined style={{ fontSize: '16px' }} />,
        });
    }

    // 3. Sự kiện Live Chat
    if (Math.random() > 0.5) {
        // Sử dụng một ngày giả lập gần hiện tại
        events.push({
            date: new Date(Date.now() + 1000), 
            label: t("today"), 
            children: <Text type="warning">{t("cus_timeline_live_chat_request")}</Text>, 
            color: "red",
            dot: <CommentOutlined style={{ fontSize: '16px' }} />,
        });
    }

    // Sắp xếp các sự kiện theo thứ tự thời gian giảm dần
    events.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    return events.map(({ date, ...rest }) => rest);
};


function Customers() {
    const { t, i18n } = useTranslation();
    
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [selectedCity, setSelectedCity] = useState("all"); 

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isActivityDrawerVisible, setIsActivityDrawerVisible] = useState(false);
    const [isContactModalVisible, setIsContactModalVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [editForm] = Form.useForm();
    const [contactForm] = Form.useForm();
    
    // --- 2. LOGIC FETCH VÀ ÁNH XẠ DỮ LIỆU TRONG useEffect ---
    useEffect(() => {
        setLoading(true);
        // Gọi hàm fetch API thực
        getCustomers().then((res) => {
            const usersData = (res.users || []).map((user) => {
                
                // --- Bổ sung logic ánh xạ từ API city sang city_en/city (mock) ---
                const apiCity = user.address?.city || "Unknown";
                const mappedCity = cityMap[apiCity] || { vi: apiCity, en: apiCity };

                return {
                    ...user,
                    // Giữ lại logic tạo dữ liệu ngẫu nhiên
                    totalOrders: Math.floor(Math.random() * 8) + 1, 
                    joinDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(i18n.language), 
                    key: user.id,

                    // Cập nhật cấu trúc address theo yêu cầu của component
                    address: {
                        city: mappedCity.vi, 
                        city_en: mappedCity.en, 
                        ...user.address 
                    }
                };
            });
            setDataSource(usersData);
            setFilteredData(usersData);
            setLoading(false);
        });
    }, [i18n.language]); 

    useEffect(() => {
        let filtered = dataSource.filter((item) => {
            // Lọc theo tên/email/phone
            const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
            const contactInfo = `${item.email} ${item.phone}`.toLowerCase();
            // Lọc theo thành phố dựa trên ngôn ngữ
            const cityToCheck = i18n.language === 'en' ? item.address.city_en : item.address.city;

            const matchesSearch = fullName.includes(searchValue.toLowerCase()) || contactInfo.includes(searchValue.toLowerCase());
            // Lọc theo thành phố
            const matchesCity = selectedCity === "all" || cityToCheck === selectedCity; 
            return matchesSearch && matchesCity;
        });
        setFilteredData(filtered);
    }, [searchValue, selectedCity, dataSource, i18n.language]);

    // Danh sách thành phố
    const cities = [
        "all", 
        ...new Set(dataSource.map((item) => i18n.language === 'en' ? item.address.city_en : item.address.city)),
    ].filter(city => city !== undefined); 

    const showEditModal = (record) => {
        setSelectedCustomer(record);
        setIsEditModalVisible(true);
        // Thiết lập giá trị cho Form Edit
        editForm.setFieldsValue({
            firstName: record.firstName,
            lastName: record.lastName,
            email: record.email,
            phone: record.phone,
            city: record.address.city, // Giả sử select box dùng tên tiếng Việt (tên city)
        });
    };

    const handleEditCustomer = (values) => {
        // Cần tìm lại city_en từ city khi update (logic đơn giản)
        const cityKey = Object.keys(cityMap).find(key => cityMap[key].vi === values.city);
        const updatedCityEn = cityKey ? cityMap[cityKey].en : values.city; // Fallback nếu không tìm thấy

        const updatedData = dataSource.map(item => {
            if (item.id === selectedCustomer.id) {
                return {
                    ...item,
                    ...values,
                    address: { 
                        city: values.city,
                        city_en: updatedCityEn 
                    } 
                };
            }
            return item;
        });

        setDataSource(updatedData);
        setIsEditModalVisible(false);
        message.success(`✅ ${t("cus_msg_update_success", { name: values.firstName })}`); 
    };

    const showActivityDrawer = (record) => {
        setSelectedCustomer(record);
        setIsActivityDrawerVisible(true);
    };

    const onCloseActivityDrawer = () => {
        setIsActivityDrawerVisible(false);
        setSelectedCustomer(null);
    };

    const showContactModal = (record) => {
        setSelectedCustomer(record);
        setIsContactModalVisible(true);
        contactForm.resetFields();
    };

    const handleContactAction = (values) => {
        setIsContactModalVisible(false);
        message.success(`✅ ${t("cus_msg_contact_logged", { method: t(values.method), name: selectedCustomer.firstName })}`);
    };


    const handleExportCSV = () => {
        if (filteredData.length === 0) {
            message.warning(t('cus_msg_no_data_export')); 
            return;
        }
        const headers = ["ID", t("cus_col_name"), "Email", t("cus_col_phone"), t("cus_col_city"), t("cus_col_total_orders"), t("cus_col_join_date")]; 
        const csvContent = filteredData.map(row => 
            `"${row.id}"` +
            `,"${row.firstName} ${row.lastName.replace(/"/g, '""')}"` + 
            `,"${row.email}"` +
            `,"${row.phone}"` + 
            `,"${i18n.language === 'en' ? row.address.city_en : row.address.city}"` + // Xuất theo ngôn ngữ hiển thị
            `,"${row.totalOrders}"` +
            `,"${row.joinDate}"`
        );
        const csvString = [
            headers.join(","),
            ...csvContent
        ].join("\n");
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${t('cus_report_filename')}_${new Date().toLocaleDateString(i18n.language).replace(/\//g, '-')}.csv`); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        message.success(`✅ ${t('cus_msg_export_success', { count: filteredData.length })}`); 
    };

    // Hàm định dạng tiền tệ cho cột AVG Order Value
    const formatAvgOrderPrice = (value, i18n) => {
        const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
        const currency = i18n.language === 'vi' ? 'VND' : 'USD';
        // Giả lập tỉ giá
        const displayValue = i18n.language === 'vi' ? value : value / 23000; 

        return new Intl.NumberFormat(locale, { 
            style: 'currency', 
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(displayValue);
    }


    const columns = [
        {
            title: t("cus_col_customer"), 
            dataIndex: "firstName",
            key: "name",
            // Giảm chiều rộng từ 28% xuống 24%
            width: '24%', 
            render: (text, record) => (
                <Space size={12}>
                    <Badge
                        dot
                        color={getStatus() === "online" ? "#2ecc71" : "#bdc3c7"}
                        offset={[-4, 48]}
                    >
                        <Avatar
                            src={record.image}
                            size={52}
                            icon={<UserOutlined />}
                            style={{ border: "1px solid #ddd" }}
                        />
                    </Badge>
                    <Space direction="vertical" size={0}>
                        <Text strong style={{ color: "#2c3e50" }}>
                            {record.firstName} {record.lastName}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            {record.email}
                        </Text>
                        <Tag 
                            size="small"
                            color={getStatus() === "online" ? "processing" : "default"}
                            style={{ marginTop: 4, width: 'fit-content', fontWeight: 500 }}
                        >
                            {getStatus() === "online" ? t("cus_status_online") : t("cus_status_offline")} 
                        </Tag>
                    </Space>
                </Space>
            ),
        },
        {
            title: t("cus_col_contact_info"), 
            dataIndex: "phone",
            key: "contact",
            // Giảm chiều rộng từ 18% xuống 16%
            width: '16%', 
            render: (phone, record) => (
                <Space direction="vertical" size={4}>
                    <Tag
                        color="geekblue"
                        icon={<PhoneOutlined />}
                        style={{ fontWeight: 600, borderRadius: 6, fontSize: 13, padding: "2px 8px" }}
                    >
                        {phone}
                    </Tag>
                    <Space size={4}>
                        <EnvironmentOutlined style={{ color: "#1677ff" }} />
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            {i18n.language === 'en' ? record.address.city_en : record.address.city} 
                        </Text>
                    </Space>
                </Space>
            ),
        },
        {
            title: t("cus_col_avg_order_value"), 
            dataIndex: "avgOrderValue", 
            key: "avgOrderValue",
            align: 'center',
            // Giảm chiều rộng từ 15% xuống 12%
            width: '12%', 
            render: () => {
                const value = getAvgOrderValue();
                
                return (
                    <Space direction="vertical" size={4}>
                        <Text strong style={{ color: '#e67e22', fontSize: 15 }}>
                            {formatAvgOrderPrice(value, i18n)}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            <DollarCircleOutlined /> {t("cus_text_avg_value")} 
                        </Text>
                    </Space>
                );
            }
        },
        {
            title: t("cus_col_total_orders"), 
            dataIndex: "totalOrders",
            key: "orders",
            align: 'center',
            // Giảm chiều rộng từ 12% xuống 10%
            width: '10%', 
            render: (orders) => (
                <Text strong style={{ color: orders > 15 ? '#27ae60' : '#333', fontSize: 16 }}>{orders}</Text>
            )
        },
        {
            title: t("cus_col_join_date"), 
            dataIndex: "joinDate",
            key: "joinDate",
            // Giảm chiều rộng từ 15% xuống 14%
            width: '14%', 
            render: (date) => (
                <Text type="secondary" style={{ fontSize: 13 }}>{date}</Text>
            )
        },
        {
            title: t("cus_col_actions"), 
            key: "action",
            align: 'center',
            // Giảm chiều rộng từ 12% xuống 8%
            width: '8%', 
            // Cần tổng chiều rộng các cột là 24 + 16 + 12 + 10 + 14 + 8 = 84%. 
            // Phần còn lại sẽ được phân bổ tự động, đảm bảo cột action không bị khuất.
            render: (record) => (
                <Space size="small">
                    <Tooltip title={t("cus_tip_edit_profile")}> 
                        <Button 
                            icon={<EditOutlined />} 
                            type="text" 
                            size="middle" 
                            style={{ color: '#2980b9' }}
                            onClick={() => showEditModal(record)} 
                        />
                    </Tooltip>
                    <Tooltip title={t("cus_tip_view_activity")}> 
                        <Button 
                            icon={<HistoryOutlined />} 
                            type="text" 
                            size="middle" 
                            style={{ color: '#8e44ad' }}
                            onClick={() => showActivityDrawer(record)}
                        />
                    </Tooltip>
                    <Tooltip title={t("cus_tip_log_interaction")}> 
                        <Button 
                            icon={<PhoneOutlined />} 
                            type="text" 
                            size="middle" 
                            style={{ color: '#2ecc71' }} 
                            onClick={() => showContactModal(record)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <>
            <Space
                size={24}
                direction="vertical"
                style={{
                    width: "100%",
                    padding: "24px",
                    background: "#f5f7fa",
                    borderRadius: "12px",
                }}
            >
                
                <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
                    <Flex justify="space-between" align="center">
                        <Title
                            level={3}
                            // Đã thay đổi: Giảm gap từ 12px xuống 8px và font-size từ 19 xuống 18
                            style={{ display: "flex", alignItems: "center", gap: "8px", color: "#262626", margin: 0 }}
                        >
                            <UserOutlined style={{ color: "#fff", backgroundColor: "#f7bc0cff", borderRadius: "50%", padding: 8, fontSize: 20, boxShadow: "0 3px 6px rgba(52, 152, 219, 0.4)" }} />
                            <span style={{ fontWeight: 700, fontSize: 23, whiteSpace: 'nowrap' }}>
                                {t("cus_title_customer_management")} 
                            </span>
                        </Title>
                        
                        <Space size="small"> {/* Đã thay đổi: Giảm size Space từ "middle" xuống "small" */}
                            <Search
                                placeholder={t("cus_placeholder_search")} 
                                style={{ width: 220 }} // Đã thay đổi: Giảm width từ 250 xuống 220
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                enterButton={<SearchOutlined />}
                            />
                            
                            <Select
                                value={selectedCity}
                                onChange={(value) => setSelectedCity(value)}
                                style={{ width: 120 }} // Đã thay đổi: Giảm width từ 140 xuống 120
                                placeholder={t("cus_placeholder_filter_city")} 
                            >
                                {cities.map((city) => (
                                    <Option key={city} value={city}>
                                        {city === 'all' ? t("cus_filter_all") : city} 
                                    </Option>
                                ))}
                            </Select>
                            
                            <Button 
                                type="default" 
                                icon={<HistoryOutlined />} 
                                style={{ fontWeight: 600 }}
                                onClick={() => message.info(t('cus_msg_open_activity_page'))} 
                            >
                                {t("cus_button_activity")} 
                            </Button>
                            <Button 
                                type="primary" 
                                icon={<CloudDownloadOutlined />} 
                                style={{ fontWeight: 600, backgroundColor: '#2ecc71' }} 
                                onClick={handleExportCSV}
                            >
                                {t("cus_button_export_report")} 
                            </Button>
                        </Space>
                    </Flex>
                </Card>
                
                <Card
                    bordered={false}
                    style={{
                        borderRadius: 12,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    }}
                    bodyStyle={{ padding: "0" }}
                >
                    <Table
                        loading={loading}
                        size="large"
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="id"
                        pagination={{
                            position: ["bottomCenter"],
                            pageSize: 8,
                            showSizeChanger: false, 
                        }}
                        // Đã bỏ thuộc tính scroll={{ x: 'max-content' }}
                        // để Ant Design tự tính toán cho vừa màn hình
                    />
                </Card>
            </Space>

            <Modal
                title={<Space><UserSwitchOutlined style={{color: '#2980b9'}} /> {t("cus_modal_edit_profile_title")}</Space>} 
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={handleEditCustomer} form={editForm} initialValues={selectedCustomer}>
                    <Form.Item name="lastName" label={t("cus_label_last_name")} rules={[{ required: true, message: t("cus_msg_last_name_required") }]}><Input /></Form.Item> 
                    <Form.Item name="firstName" label={t("cus_label_first_name")} rules={[{ required: true, message: t("cus_msg_first_name_required") }]}><Input /></Form.Item> 
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
                    <Form.Item name="phone" label={t("cus_label_phone")} rules={[{ required: true }]}><Input /></Form.Item> 
                    <Form.Item name="city" label={t("cus_label_city")} rules={[{ required: true }]}> 
                        <Select>
                             {/* Lấy danh sách thành phố từ map để đảm bảo tính nhất quán khi edit */}
                            {Object.values(cityMap).map(city => (
                                <Option key={city.vi} value={city.vi}>{city.vi}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block style={{ marginTop: 10, fontWeight: 600, backgroundColor: '#2980b9' }}>
                            {t("cus_button_save_changes")} 
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>


            <Drawer
                title={
                    <Space size={12}>
                        <HistoryOutlined style={{ color: '#8e44ad' }} />
                        <span style={{ fontWeight: 700 }}>{t("cus_drawer_activity_title", { name: selectedCustomer?.firstName })}</span> 
                    </Space>
                }
                placement="right"
                onClose={onCloseActivityDrawer}
                open={isActivityDrawerVisible} 
                width={500} 
                maskClosable={true}
            >
                {selectedCustomer && (
                    <Space direction="vertical" size={20} style={{ width: '100%' }}>
                        <Card size="small" bordered={false} style={{ background: '#f8f8f8', borderLeft: '3px solid #8e44ad' }}>
                            <Text strong>{t("cus_text_total_orders")}:</Text> <Tag color="purple">{selectedCustomer.totalOrders}</Tag> 
                            <Text strong style={{ marginLeft: 15 }}>{t("cus_text_joined")}:</Text> <Text type="secondary">{selectedCustomer.joinDate}</Text> 
                        </Card>

                        <Title level={5} style={{ marginTop: 10, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
                            {t("cus_text_interaction_timeline")}: 
                        </Title>
                        
                        <Timeline
                            mode="left"
                            items={generateTimelineData(selectedCustomer, t, i18n)} 
                        />
                    </Space>
                )}
            </Drawer>


            <Modal
                title={<Space><PhoneOutlined style={{color: '#2ecc71'}} /> {t("cus_modal_log_interaction_title", { name: selectedCustomer?.firstName })}</Space>} 
                open={isContactModalVisible}
                onCancel={() => setIsContactModalVisible(false)}
                footer={null}
            >
                <Form layout="vertical" onFinish={handleContactAction} form={contactForm}>
                    <Form.Item
                        name="method"
                        label={t("cus_label_contact_method")} 
                        rules={[{ required: true, message: t("cus_msg_contact_method_required") }]} 
                    >
                        <Select placeholder={t("cus_placeholder_select_action")}> 
                            <Option value="cus_method_phone"> 
                                <Space><PhoneOutlined style={{color: '#2ecc71'}}/> {t("cus_method_phone")}</Space>
                            </Option>
                            <Option value="cus_method_email"> 
                                <Space><MailOutlined style={{color: '#3498db'}}/> {t("cus_method_email")}</Space>
                            </Option>
                            <Option value="cus_method_chat"> 
                                <Space><CommentOutlined style={{color: '#f39c12'}}/> {t("cus_method_chat")}</Space>
                            </Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="note" label={t("cus_label_interaction_note")}> 
                        <Input.TextArea rows={3} placeholder={t("cus_placeholder_interaction_note")} /> 
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block style={{ marginTop: 10, fontWeight: 600, backgroundColor: '#2ecc71' }}>
                            {t("cus_button_log_action")} 
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default Customers;
