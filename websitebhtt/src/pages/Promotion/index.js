import React, { useState } from 'react';
import { 
    Tabs, Layout, Typography, Space, Button, Table, Tag, 
    Modal, Form, Input, DatePicker, Select, Switch, Card, 
    Divider, Slider, List, Descriptions, Progress, Upload, message 
} from 'antd';
import { 
    GiftOutlined, TagOutlined, CrownOutlined, 
    PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined, 
    UploadOutlined, 
    FireOutlined 
} from '@ant-design/icons';
import moment from 'moment'; 
import { useTranslation } from "react-i18next"; 

const { Content } = Layout;
const { Title } = Typography;
const { RangePicker } = DatePicker;

// Định dạng ngày tháng cho moment (tùy chọn)
const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm";

// ======================================================================
// 1. Dữ liệu mẫu (Mock Data)
// ======================================================================

const mockCampaigns = [
    // Sử dụng key trạng thái: active, scheduled/paused
    { key: '1', name: 'Sale Hè Siêu Tốc', name_en: 'Summer Super Sale', type: 'discount_percent', type_vi: 'Giảm giá %', time: ['2025-06-01', '2025-06-30'], status: 'active', performance: '150 đơn (120M VNĐ)' },
    { key: '2', name: 'Miễn Phí Vận Chuyển Toàn Quốc', name_en: 'National Free Shipping', type: 'free_shipping', type_vi: 'Miễn phí ship', time: ['2025-05-01', '2025-12-31'], status: 'scheduled', performance: 'N/A' },
];

const mockCoupons = [
    { key: 'c1', code: 'SALE10', value: '10%', limit: 500, used: 120, expireDate: '2025-11-30' },
    { key: 'c2', code: 'FREESHIP', value: 'Freeship', limit: 9999, used: 4500, expireDate: '2026-01-01' },
];

// Helper để định dạng VNĐ / USD cho Loyalty
const formatLoyaltyCurrency = (amount, i18n, t) => {
    const isVietnamese = i18n.language === 'vi';
    const unit = isVietnamese ? 'đ' : '$';
    const locale = isVietnamese ? 'vi-VN' : 'en-US';
    const factor = isVietnamese ? 1 : 23000;
    
    if (amount === Infinity) return t('promo_loyalty_unlimited');

    const displayAmount = isVietnamese ? amount : amount / factor;

    return displayAmount.toLocaleString(locale, { minimumFractionDigits: 0 }) + unit;
};


// ======================================================================
// 2. Component Con
// ======================================================================

// --- 2.1. Quản lý Chiến dịch Khuyến mãi (Tab 1) ---
const CampaignsManagement = () => {
    const { t, i18n } = useTranslation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const [data, setData] = useState(mockCampaigns); 

    const handleCreate = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            ...record,
            time: [moment(record.time[0]), moment(record.time[1])],
            type: record.type === 'discount_percent' ? 'discount_percent' : 
                  record.type === 'discount_fixed' ? 'discount_fixed' : 
                  'free_shipping',
        });
        setIsModalVisible(true);
    };

    const handleSave = (values) => {
        const typeValue = values.type; 
        const typeVi = t(`promo_type_${values.type}`, { lng: 'vi' }); 
        
        const newRecord = {
            ...values,
            key: editingRecord ? editingRecord.key : Date.now().toString(),
            name_en: values.name,
            name: values.name,
            time: values.time.map(date => date.format('YYYY-MM-DD')), 
            performance: editingRecord ? editingRecord.performance : '0 đơn (0 VNĐ)',
            status: editingRecord ? editingRecord.status : 'active',
            type: typeValue, 
            type_vi: typeVi, 
        };
        
        if (editingRecord) {
            setData(data.map(item => item.key === editingRecord.key ? newRecord : item));
        } else {
            setData([...data, newRecord]);
        }
        
        message.success(t('promo_msg_campaign_saved'));
        setIsModalVisible(false);
    };

    const columns = [
        { 
            title: t('promo_col_name'), 
            dataIndex: i18n.language === 'en' ? 'name_en' : 'name', 
            key: 'name', 
            width: 200 
        },
        { 
            title: t('promo_col_type'), 
            dataIndex: i18n.language === 'en' ? 'type' : 'type_vi', 
            key: 'type', 
            render: (type) => <Tag color={type.includes('Giảm giá') || type.includes('discount') ? 'geekblue' : 'green'}>{type}</Tag> 
        },
        { 
            title: t('promo_col_time'), 
            dataIndex: 'time', 
            key: 'time', 
            render: (time) => `${time[0]} ${t('promo_text_to')} ${time[1]}` 
        },
        { 
            title: t('promo_col_status'), 
            dataIndex: 'status', 
            key: 'status', 
            render: (status, record) => (
                <Switch 
                    checked={status === 'active'} 
                    checkedChildren={t('promo_status_running')} 
                    unCheckedChildren={t('promo_status_paused')} 
                    onChange={(checked) => {
                        const newStatus = checked ? 'active' : 'paused';
                        setData(data.map(item => item.key === record.key ? { ...item, status: newStatus } : item));
                    }}
                />
            )
        },
        { title: t('promo_col_performance'), dataIndex: 'performance', key: 'performance' }, 
        { 
            title: t('promo_col_actions'), 
            key: 'action', 
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>{t('promo_btn_edit')}</Button> 
                    <Button type="link" danger icon={<DeleteOutlined />}>{t('delete')}</Button> 
                </Space>
            )
        },
    ];

    return (
        <Card 
            title={t('promo_campaigns_title')} 
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>{t('promo_btn_create_campaign')}</Button>} 
        >
            <Table columns={columns} dataSource={data} rowKey="key" pagination={{ pageSize: 5 }} />
            
            <Modal
                title={editingRecord ? t('promo_modal_edit') : t('promo_modal_create')} 
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={700}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item label={t('promo_label_campaign_name')} name="name" rules={[{ required: true, message: t('promo_msg_name_required') }]}>
                        <Input placeholder={t('promo_placeholder_campaign_name')} />
                    </Form.Item>
                    <Form.Item label={t('promo_label_time')} name="time" rules={[{ required: true, message: t('promo_msg_time_required') }]}>
                        <RangePicker showTime format={DATE_TIME_FORMAT} style={{ width: '100%' }} />
                    </Form.Item>
                    <Space size="large">
                        <Form.Item label={t('promo_label_type')} name="type" rules={[{ required: true, message: t('promo_msg_type_required') }]}>
                            <Select placeholder={t('promo_placeholder_type')} style={{ width: 250 }}>
                                <Select.Option value="discount_percent">{t('promo_type_discount_percent')}</Select.Option>
                                <Select.Option value="discount_fixed">{t('promo_type_discount_fixed')}</Select.Option>
                                <Select.Option value="free_shipping">{t('promo_type_free_shipping')}</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label={t('promo_label_value')} name="value" rules={[{ required: true }]}>
                             <Input placeholder={t('promo_placeholder_value')} type="number" style={{ width: 250 }} />
                        </Form.Item>
                    </Space>
                    <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsModalVisible(false)}>{t('cancel')}</Button>
                            <Button type="primary" htmlType="submit">
                                {editingRecord ? t('promo_btn_save_changes') : t('promo_btn_create_campaign_short')}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

// --- 2.2. Quản lý Mã giảm giá (Coupons Management) (Tab 2) ---
const CouponsManagement = () => {
    const { t } = useTranslation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const handleCreateBatch = (values) => {
        message.success(t('promo_msg_coupon_batch_success', { count: values.count }));
        setIsModalVisible(false);
    };

    const columns = [
        { title: t('promo_col_coupon_code'), dataIndex: 'code', key: 'code', render: (code) => <Tag color="volcano">{code}</Tag> },
        { title: t('promo_col_coupon_value'), dataIndex: 'value', key: 'value' },
        { 
            title: t('promo_col_expiry_date'), 
            dataIndex: 'expireDate', 
            key: 'expireDate', 
            render: (date) => <Tag color={moment(date).isBefore(moment().add(30, 'days')) ? 'red' : 'blue'}>{date}</Tag> 
        },
        { 
            title: t('promo_col_usage_count'), 
            dataIndex: 'used', 
            key: 'used', 
            render: (used, record) => (
                <Progress 
                    percent={Math.floor((used / record.limit) * 100)} 
                    size="small" 
                    format={() => `${used}/${record.limit}`} 
                />
            )
        },
        { title: t('promo_col_actions'), key: 'action', render: () => (
            <Space size="middle">
                <Button type="link" icon={<EditOutlined />}>{t('promo_btn_edit')}</Button>
                <Button type="link" danger icon={<DeleteOutlined />}>{t('delete')}</Button>
            </Space>
        )},
    ];

    return (
        <Card 
            title={t('promo_coupons_title')} 
            extra={
                <Space>
                    <Upload showUploadList={false} beforeUpload={() => { message.info(t('promo_msg_import_start')); return false; }}>
                        <Button icon={<UploadOutlined />}>Import (CSV)</Button>
                    </Upload>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>{t('promo_btn_create_batch')}</Button>
                </Space>
            }
        >
            <Table columns={columns} dataSource={mockCoupons} rowKey="key" pagination={{ pageSize: 5 }} />

            <Modal 
                title={t('promo_modal_create_batch')} 
                open={isModalVisible} 
                onCancel={() => setIsModalVisible(false)} 
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleCreateBatch}>
                    <Form.Item label={t('promo_label_batch_count')} name="count" rules={[{ required: true }]} initialValue={100}>
                        <Input type="number" min={1} />
                    </Form.Item>
                    <Form.Item label={t('promo_label_value')} name="value" rules={[{ required: true }]}>
                        <Input placeholder={t('promo_placeholder_value_coupon')} />
                    </Form.Item>
                    <Form.Item label={t('promo_label_expiry')} name="expiry" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD"/>
                    </Form.Item>
                    <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
                        <Button onClick={() => setIsModalVisible(false)}>{t('cancel')}</Button>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>{t('promo_btn_create_coupon')}</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

// --- 2.3. Khách hàng Thân thiết (Loyalty Program) (Tab 3) ---
const LoyaltyManagement = () => {
    const { t, i18n } = useTranslation();

    const loyaltyTiers = [
        // level: dùng key cho dịch
        { name: t('promo_loyalty_tier_silver'), color: 'silver', level: 'silver', level_vi: 'Bạc', minSpent: 0, maxSpent: 10000000, benefit: t('promo_loyalty_silver_benefit') },
        { name: t('promo_loyalty_tier_gold'), color: 'gold', level: 'gold', level_vi: 'Vàng', minSpent: 10000001, maxSpent: 50000000, benefit: t('promo_loyalty_gold_benefit') },
        { name: t('promo_loyalty_tier_diamond'), color: 'blue', level: 'diamond', level_vi: 'Kim Cương', minSpent: 50000001, maxSpent: Infinity, benefit: t('promo_loyalty_diamond_benefit') },
    ];
    
    // Giả lập dữ liệu khách hàng có trường level_vi/level_en
    const mockCustomersWithLang = [
        { key: 'cus1', name: 'Nguyễn Văn A', level_vi: 'Vàng', level: 'gold', totalSpent: 25000000, points: 1250 },
        { key: 'cus2', name: 'Trần Thị B', level_vi: 'Bạc', level: 'silver', totalSpent: 8000000, points: 300 },
    ];


    const columns = [
        // 
        { title: t('promo_col_customer'), dataIndex: 'name', key: 'name' }, // Đã fix. Title dùng t()

        { 
            title: t('promo_col_level'), // 👈 Dịch tiêu đề cột
            // Lấy cấp độ theo ngôn ngữ
            dataIndex: i18n.language === 'en' ? 'level' : 'level_vi', 
            key: 'level', 
            render: (levelKey) => {
                // SỬA LỖI HIỂN THỊ KEY DỊCH (promo_loyalty_tier_vàng)
                const key = (levelKey || '').toLowerCase().replace(' ', '_');
                const color = key === 'vàng' || key === 'gold' ? 'gold' : key === 'bạc' || key === 'silver' ? 'default' : 'blue';
                
                // Trực tiếp dịch key cấp độ (gold, silver, diamond)
                const levelDisplay = t(`promo_loyalty_tier_${key}`); 

                return <Tag color={color}>{levelDisplay}</Tag>
            }
        },
        { 
            title: t('promo_col_total_spent'), // 👈 Dịch
            dataIndex: 'totalSpent', 
            key: 'totalSpent',
            render: (amount) => formatLoyaltyCurrency(amount, i18n, t) // 👈 Dùng hàm i18n
        }, 
        { title: t('promo_col_current_points'), dataIndex: 'points', key: 'points', sorter: (a, b) => a.points - b.points }, // 👈 Dịch
        { title: t('promo_col_actions'), key: 'action', render: () => ( // 👈 Dịch
            <Button type="link" icon={<SettingOutlined />}>{t('promo_btn_manage_points')}</Button> // 👈 Dịch
        )},
    ];

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card title={t('promo_card_loyalty_config')}> {/* 👈 Dịch */}
                <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={loyaltyTiers}
                    renderItem={(item) => (
                        <List.Item>
                            <Card 
                                title={t(`promo_loyalty_tier_${item.level}`)} 
                                headStyle={{ color: item.color === 'gold' ? 'orange' : item.color, fontWeight: 'bold' }}
                            >
                                <Descriptions column={1} size="small">
                                    <Descriptions.Item label={t('promo_label_spending_threshold')}>
                                        {`${formatLoyaltyCurrency(item.minSpent, i18n, t)} - ${item.maxSpent === Infinity ? t('promo_loyalty_unlimited') : formatLoyaltyCurrency(item.maxSpent, i18n, t)}`}
                                    </Descriptions.Item>
                                    <Descriptions.Item label={t('promo_label_benefits')}>{item.benefit}</Descriptions.Item>
                                </Descriptions>
                                <Divider style={{ margin: '12px 0' }} />
                                <Slider 
                                    range 
                                    step={1000000} 
                                    defaultValue={[item.minSpent / 1000000, item.maxSpent === Infinity ? 100 : item.maxSpent / 1000000]} 
                                    max={100} 
                                    disabled
                                    tooltip={{ formatter: (value) => `${formatLoyaltyCurrency(value * 1000000, i18n, t)}` }}
                                />
                            </Card>
                        </List.Item>
                    )}
                />
            </Card>
            <Card title={t('promo_card_member_list')}> {/* Dịch */}
                <Table columns={columns} dataSource={mockCustomersWithLang} rowKey="key" pagination={{ pageSize: 5 }} />
            </Card>
        </Space>
    );
};


// ======================================================================
// 3. Component Chính: PromotionPage (Component Export)
// ======================================================================

const PromotionPage = () => {
    const { t } = useTranslation();
    
    const promotionItems = [
        {
            key: 'campaigns',
            label: <Space><GiftOutlined /> {t('promo_tab_campaigns')}</Space>, 
            children: <CampaignsManagement />,
        },
        {
            key: 'coupons',
            label: <Space><TagOutlined /> {t('promo_tab_coupons')}</Space>, 
            children: <CouponsManagement />,
        },
        {
            key: 'loyalty',
            label: <Space><CrownOutlined /> {t('promo_tab_loyalty')}</Space>, 
            children: <LoyaltyManagement />,
        },
    ];

    return (
        <Layout style={{ padding: 24 }}>
            {/* -------------------- Thêm Style Block cho Animation -------------------- */}
            <style>
                {`
                /* Hiệu ứng nhấp nháy/rung nhẹ */
                @keyframes promotion-blink {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(1.05); }
                }
                /* Hiệu ứng lên xuống giật giật (Bounce) */
                @keyframes title-bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }

                .promotion-alert-icon {
                    color: #ff4d4f; 
                    font-size: 28px;
                    margin-left: 8px;
                    animation: promotion-blink 1.5s infinite alternate; 
                    vertical-align: middle;
                }
                /* Áp dụng hiệu ứng giật giật cho tiêu đề */
                .promotion-title {
                    animation: title-bounce 1s infinite alternate; 
                    display: inline-block; 
                    margin-bottom: 0 !important;
                }
                `}
            </style>
            {/* -------------------------------------------------------------------------- */}

            <Space align="center" style={{ marginBottom: 16 }}> 
                <Title level={3} className="promotion-title" style={{color:"#e12828"}}>{t("promo_title")}</Title> 
                <FireOutlined className="promotion-alert-icon" /> 
            </Space>

            <Content
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                    background: '#fff',
                    borderRadius: 8,
                }}
            >
                <Tabs
                    defaultActiveKey="campaigns"
                    size="large"
                    items={promotionItems}
                />
            </Content>
        </Layout>
    );
};

export default PromotionPage;