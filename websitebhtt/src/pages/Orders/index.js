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
    Image,
    Badge,
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
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;
const { Option } = Select;

const getOrders = async () => {
    try {
        const productsRes = await fetch("https://dummyjson.com/products");
        if (!productsRes.ok) {
            throw new Error(`HTTP error! status: ${productsRes.status}`);
        }
        const productsData = await productsRes.json();
        const products = productsData.products;

        const orders = products.slice(0, 15).map((p, i) => ({
            id: p.id,
            title: p.title,
            title_vi: p.title,
            price: p.price * 23500,
            quantity: Math.floor(Math.random() * 4) + 1,
            thumbnail: p.thumbnail,
        }));
        
        return { products: orders };
    } catch (error) {
        console.error("Error fetching products for orders:", error);
        return { products: [] };
    }
};

const fetchCustomers = async () => {
    try {
        const response = await fetch("https://dummyjson.com/users");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.users.map(user => ({
            id: user.id,
            fullName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone,
        }));
    } catch (error) {
        console.error("Error fetching customers:", error);
        return [];
    }
};

const generateRandomDate = (i18n) => {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    return date.toLocaleDateString(i18n.language); 
};

const formatCurrencyOrders = (amount, i18n) => {
    const isVietnamese = i18n.language === 'vi';
    const formatter = new Intl.NumberFormat(isVietnamese ? 'vi-VN' : 'en-US', {
        style: 'currency',
        currency: isVietnamese ? 'VND' : 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
    const displayAmount = isVietnamese ? amount : amount / 23500;
    return formatter.format(displayAmount);
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
    const [customerOptions, setCustomerOptions] = useState([]);

    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [quickViewOrder, setQuickViewOrder] = useState(null);
    const [editingKey, setEditingKey] = useState('');
    const [inlineForm] = Form.useForm();
    const [screenSize, setScreenSize] = useState('lg');

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 576) setScreenSize('xs');
            else if (window.innerWidth < 768) setScreenSize('sm');
            else if (window.innerWidth < 992) setScreenSize('md');
            else setScreenSize('lg');
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setLoading(true);
        
        Promise.all([getOrders(), fetchCustomers()]).then(([ordersRes, customers]) => {
            setCustomerOptions(customers.map(c => ({ value: c.fullName, label: c.fullName, detail: c })));

            const customerCount = customers.length;
            
            const ordersWithCustomers = ordersRes.products.map((item, index) => {
                const total = item.price * item.quantity;
                let status;
                
                if (item.id % 3 === 0) status = "delivered"; 
                else if (item.id % 3 === 1) status = "processing";
                else status = "cancelled";

                const customerIndex = customerCount > 0 ? index % customerCount : -1;
                const customerInfo = customerIndex !== -1 ? customers[customerIndex] : {
                    fullName: "Khách Lẻ",
                    email: "guest@example.com",
                    phone: "N/A"
                };
              
                return {
                    ...item,
                    total: total,
                    status: status,
                    date: generateRandomDate(i18n), 
                    customer: customerInfo.fullName, 
                    customerDetail: customerInfo,
                    key: item.id.toString(),
                };
            });
            
            setDataSource(ordersWithCustomers);
            setFilteredData(ordersWithCustomers);
            setLoading(false);
        });
    }, [i18n]);

    const getTranslatedStatus = (statusKey) => t(`orders_tag_${statusKey}`);

    useEffect(() => {
        const filtered = dataSource.filter((item) => {
            const productTitle = i18n.language === 'vi' ? item.title_vi : item.title;
            const matchName = productTitle.toLowerCase().includes(searchValue.toLowerCase()) || 
                              item.customer.toLowerCase().includes(searchValue.toLowerCase()) || 
                              item.key.includes(searchValue);

            const matchStatus = filterStatus === "all" || item.status === filterStatus;
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

    const getStatusIcon = (status) => {
        switch (status) {
            case "delivered": return <CheckCircleOutlined />;
            case "processing": return <ClockCircleOutlined />;
            case "cancelled": return <CloseCircleOutlined />;
            default: return null;
        }
    };

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };
    
    const handleAddOrder = async (values) => {
        const customerOption = customerOptions.find(c => c.value === values.customer);
        
        const customerDetail = customerOption?.detail || {
            fullName: values.customer,
            email: "manual@example.com",
            phone: "N/A"
        };
        
        const total = values.price * values.quantity;
        const newOrder = {
            id: dataSource.length + 100,
            title: values.title,
            title_vi: values.title,
            price: values.price,
            customer: customerDetail.fullName,
            customerDetail: customerDetail,
            quantity: values.quantity,
            total,
            status: values.status,
            date: new Date().toLocaleDateString(i18n.language),
            key: (dataSource.length + 100).toString(),
            thumbnail: "https://via.placeholder.com/60?text=Product",
        };
        setDataSource([newOrder, ...dataSource]);
        message.success(t("orders_msg_add_success")); 
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
                    style={{ margin: 0 }}
                    rules={[{ required: true, message: t('orders_msg_status_required') }]}
                >
                    <Select size="small" placeholder={t('orders_col_status')}>
                        <Option value="delivered">{t('orders_tag_delivered')}</Option> 
                        <Option value="cancelled">{t('orders_tag_cancelled')}</Option> 
                    </Select>
                </Form.Item>
            );
        }
        
        return (
            <Tag
                color={getStatusColor(record.status)}
                icon={getStatusIcon(record.status)}
                style={{ fontWeight: 600, borderRadius: 4, fontSize: 13, padding: "4px 10px", marginRight: 0 }}
            >
                {getTranslatedStatus(record.status)} 
            </Tag>
        );
    };

    const getColumns = () => {
        const baseColumns = [
            {
                title: "STT",
                align: "center",
                width: 55,
                render: (_, __, index) => <Text strong style={{ fontSize: 14 }}>{index + 1}</Text>,
            },
            {
                title: t("orders_col_product"), 
                dataIndex: i18n.language === 'vi' ? "title_vi" : "title", 
                width: screenSize === 'xs' ? 150 : screenSize === 'sm' ? 180 : 240,
                render: (text, record) => (
                    <Flex gap={10} align="flex-start" onClick={() => handleQuickView(record)} style={{ cursor: 'pointer' }}>
                        <Badge.Ribbon text={`#${record.id}`} color="cyan">
                            <Image
                                src={record.thumbnail}
                                alt={text}
                                width={screenSize === 'xs' ? 45 : 65}
                                height={screenSize === 'xs' ? 45 : 65}
                                style={{
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0',
                                    flexShrink: 0
                                }}
                                preview={{
                                    mask: "Xem"
                                }}
                            />
                        </Badge.Ribbon>
                        <Text 
                            style={{ 
                                fontSize: screenSize === 'xs' ? 11 : 13,
                                lineHeight: 1.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                flex: 1,
                                marginTop: '4px',
                                fontWeight: 500
                            }}
                            className="product-name-hover"
                        >
                            {text}
                        </Text>
                    </Flex>
                ),
            },
            {
                title: t("orders_col_customer"), 
                dataIndex: "customer",
                width: screenSize === 'xs' ? 100 : screenSize === 'sm' ? 120 : 140,
                render: (text) => <Text style={{ fontSize: screenSize === 'xs' ? 11 : 13 }}>{text}</Text>
            },
            {
                title: t("orders_col_date"), 
                dataIndex: "date",
                width: screenSize === 'xs' ? 90 : 120,
                render: (text) => <Text style={{ fontSize: screenSize === 'xs' ? 11 : 13 }}>{text}</Text>
            },
        ];

        if (screenSize !== 'xs') {
            baseColumns.push(
                {
                    title: t("orders_col_qty"), 
                    dataIndex: "quantity",
                    align: "center",
                    width: 75,
                    render: (qty) => (
                        <Badge count={qty} showZero style={{ backgroundColor: qty > 2 ? '#1677ff' : '#722ed1', fontSize: 13 }} />
                    ),
                },
                {
                    title: t("orders_col_total"), 
                    dataIndex: "total",
                    align: "right",
                    width: 120,
                    render: (value) => (
                        <Text strong style={{ color: "#1677ff", fontSize: 13 }}>
                            {formatCurrencyOrders(value, i18n)} 
                        </Text>
                    ),
                }
            );
        }

        baseColumns.push(
            {
                title: t("orders_col_status"), 
                dataIndex: "status",
                align: "center",
                width: screenSize === 'xs' ? 90 : 140,
                render: (_, record) => (
                    <EditableStatusColumn record={record} />
                )
            },
            {
                title: t("orders_col_actions"), 
                dataIndex: "operation",
                align: "center",
                width: screenSize === 'xs' ? 60 : 80,
                render: (_, record) => {
                    const editable = isEditing(record);
                    return editable ? (
                        <Tooltip title={t("orders_tip_save_changes")}> 
                            <Button
                                onClick={() => save(record.key)}
                                icon={<SaveOutlined />}
                                type="text"
                                size="small"
                                style={{ color: '#27ae60', padding: 4 }}
                            />
                        </Tooltip>
                    ) : (
                        <Space size={screenSize === 'xs' ? 0 : 2}>
                            <Tooltip title={t("orders_tip_view_detail")}> 
                                <Button 
                                    onClick={() => handleQuickView(record)}
                                    icon={<EyeOutlined />}
                                    type="text"
                                    size={screenSize === 'xs' ? 'small' : 'small'}
                                    style={{ color: '#3498db', padding: 4 }}
                                />
                            </Tooltip>
                            {screenSize !== 'xs' && (
                                <Tooltip title={t("orders_tip_edit_status")}> 
                                    <Button
                                        disabled={editingKey !== ''}
                                        onClick={() => edit(record)}
                                        icon={<EditOutlined />}
                                        type="text"
                                        size="small"
                                        style={{ color: '#f39c12', padding: 4 }}
                                    />
                                </Tooltip>
                            )}
                        </Space>
                    );
                },
            }
        );

        return baseColumns;
    };

    const columns = getColumns();

    return (
        <Space
            size={16}
            direction="vertical"
            style={{
                width: "100%",
                padding: screenSize === 'xs' ? "12px" : "20px",
                background: "#f5f7fa",
                borderRadius: "12px",
            }}
        >
           <Flex 
               justify="space-between" 
               align={screenSize === 'xs' ? 'flex-start' : 'center'} 
               gap={16} 
               style={{ width: "100%" }}
               wrap={screenSize === 'xs' ? 'wrap' : 'nowrap'}
           >
                <Title
                    level={3}
                    style={{
                        display: "flex", 
                        alignItems: "center", 
                        gap: "10px", 
                        color: "#262626",
                        marginBottom: 0, 
                        fontWeight: 600, 
                        fontSize: screenSize === 'xs' ? 18 : 25, 
                        flexShrink: 0
                    }}
                >
                    <ShoppingCartOutlined
                        style={{
                            color: "#fff", 
                            backgroundColor: "#e74c3c", 
                            borderRadius: "50%", 
                            padding: screenSize === 'xs' ? 6 : 8,
                            fontSize: screenSize === 'xs' ? 16 : 20, 
                            boxShadow: "0 2px 4px rgba(231, 76, 60, 0.3)",
                        }}
                    />
                    <span>{t("orders_title")}</span> 
                </Title>

                <Flex 
                    gap={10} 
                    align="center"
                    style={{ width: screenSize === 'xs' ? '100%' : 'auto' }}
                    wrap={screenSize === 'xs' ? 'wrap' : 'nowrap'}
                >
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder={t("orders_search_placeholder")} 
                        style={{ borderRadius: 6, width: screenSize === 'xs' ? '100%' : 280 }}
                        size={screenSize === 'xs' ? 'small' : 'middle'}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <Select
                        value={filterStatus}
                        style={{ width: screenSize === 'xs' ? '48%' : 120, borderRadius: 6 }}
                        size={screenSize === 'xs' ? 'small' : 'middle'}
                        onChange={(value) => setFilterStatus(value)}
                    >
                        <Option value="all">{t("orders_filter_all")}</Option> 
                        <Option value="delivered">{t("orders_filter_delivered")}</Option> 
                        <Option value="processing">{t("orders_filter_processing")}</Option> 
                        <Option value="cancelled">{t("orders_filter_cancelled")}</Option> 
                    </Select>
                    
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showModal}
                        size={screenSize === 'xs' ? 'small' : 'middle'}
                        style={{
                            borderRadius: 6,
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            fontWeight: 500,
                            flexShrink: 0,
                            width: screenSize === 'xs' ? '48%' : 'auto'
                        }}
                    >
                        {screenSize === 'xs' ? '+' : t("orders_btn_create")} 
                    </Button>
                </Flex>
            </Flex>

            <Card
                variant="borderless"
                style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", background: "#fff", overflow: 'hidden' }}
                bodyStyle={{ padding: "0" }}
            >
                <Form form={inlineForm} component={false}>
                    <Table
                        loading={loading}
                        size={screenSize === 'xs' ? 'small' : 'middle'}
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="id"
                        pagination={{ 
                            position: ["bottomCenter"], 
                            pageSize: screenSize === 'xs' ? 3 : 5, 
                            showSizeChanger: false, 
                            size: "default" 
                        }}
                        style={{ width: "100%", marginBottom: 0 }}
                        rowClassName="order-row"
                        scroll={{ x: screenSize === 'xs' ? 600 : undefined }}
                    />
                </Form>
            </Card>

            <Modal
                title={t("orders_modal_title")} 
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={screenSize === 'xs' ? '95%' : 500}
                style={{ top: screenSize === 'xs' ? 20 : undefined }}
            >
                <Form layout="vertical" onFinish={handleAddOrder} form={form}>
                    <Form.Item name="title" label={t("product_name")} rules={[{ required: true }]}><Input placeholder={t("orders_placeholder_product_name")} /></Form.Item>
                    <Form.Item name="customer" label={t("orders_col_customer")} rules={[{ required: true }]}>
                        <Select 
                            placeholder={t("orders_placeholder_select_customer")}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label?.toLowerCase() ?? '').includes(input.toLowerCase())
                            }
                            options={customerOptions}
                        >
                        </Select>
                    </Form.Item>
                    <Form.Item name="price" label={t("orders_label_price")} rules={[{ required: true }]}>
                        <InputNumber 
                            min={1} 
                            style={{ width: "100%" }} 
                            formatter={value => formatCurrencyOrders(value, i18n)} 
                            parser={value => value.toString().replace(/(\$\s?|(\s?VNĐ)?|(,*))/g, '')}
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
                width={screenSize === 'xs' ? '100%' : 380}
            >
                {quickViewOrder && (
                    <Space direction="vertical" size={14} style={{ width: '100%' }}>
                        <Image
                            src={quickViewOrder.thumbnail}
                            alt={quickViewOrder.title}
                            style={{
                                width: '100%',
                                borderRadius: '8px',
                                objectFit: 'cover',
                                maxHeight: '250px'
                            }}
                        />
                        
                        <Card size="small" bordered={false} style={{ background: '#f8f8f8' }}>
                            <Text strong>{t("orders_col_customer")}:</Text> <Text>{quickViewOrder.customer}</Text><br/>
                            <Text strong>Email:</Text> <Text>{quickViewOrder.customerDetail?.email || 'N/A'}</Text><br/>
                            <Text strong>Phone:</Text> <Text>{quickViewOrder.customerDetail?.phone || 'N/A'}</Text><br/>
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
                            size={screenSize === 'xs' ? 'small' : 'middle'}
                        />

                        <Card bordered={true} style={{ borderLeft: '5px solid #1677ff' }}>
                            <Title level={4} style={{ margin: 0, fontSize: screenSize === 'xs' ? 16 : 18 }}>
                                {t("orders_payment_total")}: {formatCurrencyOrders(quickViewOrder.total, i18n)}
                            </Title>
                        </Card>
                    </Space>
                )}
            </Drawer>

            <style>{`
                .product-name-hover:hover {
                    color: #1677ff;
                }
                .order-row:hover {
                    background-color: #fafafa;
                }
                
                @media (max-width: 768px) {
                    .ant-table {
                        font-size: 12px;
                    }
                }
                
                @media (max-width: 576px) {
                    .ant-table {
                        font-size: 11px;
                    }
                    .ant-btn {
                        padding: 4px 8px;
                    }
                }
            `}</style>
        </Space>
    );
}

export default Orders;