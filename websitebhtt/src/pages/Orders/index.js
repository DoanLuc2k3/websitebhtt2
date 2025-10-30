import {
    Space,
    Table,
    Typography,
    Tag,
    Input,
    Select,
    Card,
    Flex,
    Button,
    Modal,
    Form,
    InputNumber,
    message,
    Drawer,
    Tooltip,
} from "antd";
import { useEffect, useState } from "react";
import {
    ShoppingCartOutlined,
    SearchOutlined,
    PlusOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    EditOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next"; //  IMPORT i18n

const { Title, Text } = Typography;
const { Option } = Select;

// Hàm Mock API (Đã thêm trường EN và sử dụng key trạng thái)
const getOrders = () => Promise.resolve({
    products: Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        title: ["Gucci Sweater", "Designer Handbag", "High-Top Sneaker", "Leather Jacket", "Basic Jeans"][i % 5],
        title_vi: ["Áo Gucci", "Túi Xách LV", "Giày Sneakers", "Áo Khoác Da", "Quần Jeans Basic"][i % 5],
        price: (Math.floor(Math.random() * 200) + 10) * 100000,
        quantity: Math.floor(Math.random() * 4) + 1,
        thumbnail: "url_hinh_anh",
    }))
});

// Hàm định dạng ngày tháng theo ngôn ngữ
const generateRandomDate = (i18n) => {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    return date.toLocaleDateString(i18n.language); 
};

// Hàm định dạng tiền tệ (USD/VND)
const formatCurrencyOrders = (amount, i18n) => {
    const isVietnamese = i18n.language === 'vi';
    const formatter = new Intl.NumberFormat(isVietnamese ? 'vi-VN' : 'en-US', {
        style: 'currency',
        currency: isVietnamese ? 'VND' : 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
    return formatter.format(amount);
};


function Orders() {
    const { t, i18n } = useTranslation(); 

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [filterStatus, setFilterStatus] = useState("all"); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [quickViewOrder, setQuickViewOrder] = useState(null);
    const [editingKey, setEditingKey] = useState('');
    const [inlineForm] = Form.useForm();

    useEffect(() => {
        setLoading(true);
        getOrders().then((res) => {
            const withStatus = res.products.map((item) => {
                const total = item.price * item.quantity;
                let status;
                // Sử dụng key trạng thái thay vì tên tiếng Việt
                if (item.id % 3 === 0) status = "delivered"; 
                else if (item.id % 3 === 1) status = "processing";
                else status = "cancelled";
                
                return {
                    ...item,
                    total: total,
                    status: status,
                    date: generateRandomDate(i18n), 
                    customer: item.id % 2 === 0 ? "Nguyễn Văn A" : "Trần Thị B",
                    key: item.id.toString(),
                };
            });
            setDataSource(withStatus);
            setFilteredData(withStatus);
            setLoading(false);
        });
    }, [i18n]); // Chạy lại khi ngôn ngữ thay đổi

    // Hàm trả về chuỗi trạng thái đã dịch
    const getTranslatedStatus = (statusKey) => t(`orders_tag_${statusKey}`);

    useEffect(() => {
        const filtered = dataSource.filter((item) => {
            // Lấy tiêu đề theo ngôn ngữ
            const productTitle = i18n.language === 'vi' ? item.title_vi : item.title;
            const matchName = productTitle
                .toLowerCase()
                .includes(searchValue.toLowerCase());
            const matchStatus =
                filterStatus === "all" || item.status === filterStatus;
            return matchName && matchStatus;
        });
        setFilteredData(filtered);
    }, [searchValue, filterStatus, dataSource, i18n.language]);

    const getStatusColor = (status) => {
        switch (status) {
            case "delivered": return "green";
            case "processing": return "gold";
            case "cancelled": return "volcano";
            default: return "blue";
        }
    };

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };
    
    const handleAddOrder = (values) => {
        const total = values.price * values.quantity;
        const newOrder = {
            id: dataSource.length + 100,
            title: values.title,
            customer: values.customer,
            quantity: values.quantity,
            total,
            status: values.status,
            date: new Date().toLocaleDateString(i18n.language),
            key: (dataSource.length + 100).toString(),
        };
        setDataSource([newOrder, ...dataSource]);
        message.success(t("orders_msg_add_success")); // Giữ tiếng Việt cho thông báo tạm thời
        handleCancel();
    };

    const handleQuickView = (record) => {
        setQuickViewOrder(record);
        setIsDrawerVisible(true);
    };

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        if (record.status !== "processing") { 
            message.warning(t('orders_msg_edit_warning')); 
            return;
        }
        inlineForm.setFieldsValue({ status: record.status, ...record });
        setEditingKey(record.key);
    };

    const save = async (key) => {
        try {
            const row = await inlineForm.validateFields();
            const newData = [...dataSource];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setDataSource(newData);
                setEditingKey('');
                message.success(t('orders_msg_update_success', { key: key })); 
            } else {
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    
    const EditableStatusColumn = ({ record }) => {
        const editable = isEditing(record);
        
        if (editable) {
            return (
                <Form.Item
                    name="status"
                    style={{ margin: 0, width: 120 }}
                    rules={[{ required: true, message: t('orders_msg_status_required') }]}
                >
                    <Select placeholder={t('orders_col_status')}>
                        <Option value="delivered">{t('orders_tag_delivered')}</Option> 
                        <Option value="cancelled">{t('orders_tag_cancelled')}</Option> 
                    </Select>
                </Form.Item>
            );
        }
        
        return (
            <Tag
                color={getStatusColor(record.status)}
                icon={
                    record.status === "delivered" ? (<CheckCircleOutlined />) : 
                    record.status === "processing" ? (<ClockCircleOutlined />) : 
                    (<CloseCircleOutlined />)
                }
                style={{ fontWeight: 500, borderRadius: 6, fontSize: 13, padding: "4px 10px" }}
            >
                {getTranslatedStatus(record.status)} 
            </Tag>
        );
    };

    const columns = [
        {
            title: "STT",
            align: "center",
            width: 70,
            render: (_, __, index) => index + 1,
        },
        {
            title: t("orders_col_product"), 
            dataIndex: i18n.language === 'vi' ? "title_vi" : "title", 
            width: 250,
            render: (text, record) => (
                <Space direction="vertical" size={2}>
                    <Text strong style={{ color: "#262626", cursor: 'pointer' }} onClick={() => handleQuickView(record)}>
                        {text}
                    </Text>
                    <Tag color="cyan" size="small">#ORD-{record.id}</Tag>
                </Space>
            ),
        },
        {
            title: t("orders_col_customer"), 
            dataIndex: "customer",
            width: 160,
        },
        {
            title: t("orders_col_date"), 
            dataIndex: "date",
            width: 140,
        },
        {
            title: t("orders_col_qty"), 
            dataIndex: "quantity",
            align: "center",
            width: 100,
            render: (qty) => (
                <Tag color={qty > 2 ? "blue" : "purple"} style={{ fontWeight: 500, borderRadius: 6, fontSize: 13, padding: "2px 10px" }}>
                    {qty}
                </Tag>
            ),
        },
        {
            title: t("orders_col_total"), 
            dataIndex: "total",
            width: 160,
            render: (value) => (
                <Text strong style={{ color: "#1677ff", fontWeight: 600 }}>
                    {formatCurrencyOrders(value, i18n)} 
                </Text>
            ),
        },
        {
            title: t("orders_col_status"), 
            dataIndex: "status",
            width: 170,
            render: (_, record) => (
                <EditableStatusColumn record={record} />
            )
        },
        {
            title: t("orders_col_actions"), 
            dataIndex: "operation",
            align: "center",
            width: 100,
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Tooltip title={t("orders_tip_save_changes")}> 
                        <Button
                            onClick={() => save(record.key)}
                            icon={<SaveOutlined />}
                            type="text"
                            size="small"
                            style={{ color: '#27ae60' }}
                        />
                    </Tooltip>
                ) : (
                    <Space size="small">
                        <Tooltip title={t("orders_tip_view_detail")}> 
                            <Button 
                                onClick={() => handleQuickView(record)}
                                icon={<EyeOutlined />}
                                type="text"
                                size="small"
                                style={{ color: '#3498db' }}
                            />
                        </Tooltip>
                        <Tooltip title={t("orders_tip_edit_status")}> 
                            <Button
                                disabled={editingKey !== ''}
                                onClick={() => edit(record)}
                                icon={<EditOutlined />}
                                type="text"
                                size="small"
                                style={{ color: '#f39c12' }}
                            />
                        </Tooltip>
                    </Space>
                );
            },
        },
    ];

    return (
        <Space
            size={20}
            direction="vertical"
            style={{
                width: "100%",
                padding: "24px",
                background: "#f5f7fa",
                borderRadius: "12px",
            }}
        >
            <Flex justify="flex-start" align="center">
                <Title
                    level={3}
                    style={{
                        display: "flex", alignItems: "center", gap: "12px", color: "#262626",
                        marginBottom: 0, fontWeight: 600,
                    }}
                >
                    <ShoppingCartOutlined
                        style={{
                            color: "#fff", backgroundColor: "#e74c3c", borderRadius: "50%", padding: 10,
                            fontSize: 22, boxShadow: "0 3px 6px rgba(231, 76, 60, 0.4)",
                        }}
                    />
                    <span>{t("orders_title")}</span> 
                    
                </Title>
            </Flex>

            <Flex justify="space-between" align="center" style={{ width: '100%' }}>
                <Flex gap={12} align="center">
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder={t("orders_search_placeholder")} 
                        style={{ width: 260, borderRadius: 8 }}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <Select
                        value={filterStatus}
                        style={{ width: 180 }}
                        onChange={(value) => setFilterStatus(value)}
                    >
                        <Option value="all">{t("orders_filter_all")}</Option> 
                        <Option value="delivered">{t("orders_filter_delivered")}</Option> 
                        <Option value="processing">{t("orders_filter_processing")}</Option> 
                        <Option value="cancelled">{t("orders_filter_cancelled")}</Option> 
                    </Select>
                </Flex>
                
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                    style={{
                        borderRadius: 8,
                        backgroundColor: "#0a75bbff",
                        height: 32, 
                        fontWeight: 500,
                    }}
                >
                    {t("orders_btn_create")} 
                </Button>
            </Flex>

            <Card
                variant="borderless"
                style={{ borderRadius: 12, boxShadow: "0 4px 10px rgba(0,0,0,0.06)", background: "#fff" }}
                bodyStyle={{ padding: "16px 20px" }}
            >
                <Form form={inlineForm} component={false}>
                    <Table
                        loading={loading}
                        size="middle"
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="id"
                        pagination={{ position: ["bottomCenter"], pageSize: 5, showSizeChanger: false }}
                        style={{ width: "100%", borderRadius: "10px" }}
                    />
                </Form>
            </Card>

            <Modal
                title={t("orders_modal_title")} 
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form layout="vertical" onFinish={handleAddOrder} form={form}>
                    <Form.Item name="title" label={t("product_name")} rules={[{ required: true }]}><Input placeholder={t("orders_placeholder_product_name")} /></Form.Item>
                    <Form.Item name="customer" label={t("orders_col_customer")} rules={[{ required: true }]}><Input placeholder={t("orders_placeholder_customer_name")} /></Form.Item>
                    <Form.Item name="price" label={t("orders_label_price")} rules={[{ required: true }]}>
                        <InputNumber 
                            min={1} 
                            style={{ width: "100%" }} 
                            formatter={value => formatCurrencyOrders(value, i18n)} 
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                    <Form.Item name="quantity" label={t("orders_col_qty")} rules={[{ required: true }]}>
                        <InputNumber min={1} style={{ width: "100%" }} placeholder={t("orders_placeholder_qty")} />
                    </Form.Item>
                    <Form.Item name="status" label={t("orders_col_status")} rules={[{ required: true, message: t('orders_msg_status_required') }]}>
                        <Select placeholder={t("orders_placeholder_select_status")}>
                            <Option value="delivered">{t("orders_filter_delivered")}</Option>
                            <Option value="processing">{t("orders_filter_processing")}</Option>
                            <Option value="cancelled">{t("orders_filter_cancelled")}</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            style={{ backgroundColor: "#8e44ad", borderRadius: 6, fontWeight: 500 }}
                        >
                            {t("orders_modal_btn_confirm")} 
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            
            <Drawer
                title={<Space><EyeOutlined /> {t("orders_tip_view_detail")} #{quickViewOrder?.id}</Space>}
                placement="right"
                onClose={() => setIsDrawerVisible(false)}
                open={isDrawerVisible}
                width={400}
            >
                {quickViewOrder && (
                    <Space direction="vertical" size={16} style={{ width: '100%' }}>
                        <Card size="small" bordered={false} style={{ background: '#f8f8f8' }}>
                            <Text strong>{t("orders_col_customer")}:</Text> <Text>{quickViewOrder.customer}</Text><br/>
                            <Text strong>{t("orders_col_date")}:</Text> <Text>{quickViewOrder.date}</Text><br/>
                            <Text strong>{t("orders_col_status")}:</Text> <Tag color={getStatusColor(quickViewOrder.status)}>{getTranslatedStatus(quickViewOrder.status)}</Tag>
                        </Card>

                        <Title level={5}>{t("orders_product_info")}:</Title>
                        <Table
                            dataSource={[{ ...quickViewOrder, key: 'detail' }]}
                            columns={[
                                { title: t("product_name"), dataIndex: i18n.language === 'vi' ? 'title_vi' : 'title' },
                                { 
                                    title: t("unit_price"), 
                                    dataIndex: 'price',
                                    render: (price) => formatCurrencyOrders(price, i18n)
                                },
                                { title: t("orders_col_qty"), dataIndex: 'quantity', align: 'center' },
                            ]}
                            pagination={false}
                            size="small"
                        />

                        <Card bordered={true} style={{ borderLeft: '5px solid #1677ff' }}>
                            <Title level={4} style={{ margin: 0 }}>
                                {t("orders_payment_total")}: {formatCurrencyOrders(quickViewOrder.total, i18n)}
                            </Title>
                        </Card>
                        
                    </Space>
                )}
            </Drawer>

        </Space>
    );
}

export default Orders;