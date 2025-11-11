import React, { useState, useEffect, useCallback} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Tabs, Layout, Typography, Table, Tag, Space, Card, Row, Col, Input, 
  Button, Modal, Form,  message, Switch, Alert, Select
} from 'antd';
import { getStoredSupportTickets, updateSupportTicket, getStoredStaffs } from '../../API';
import { 
  ReloadOutlined, PlusOutlined, ClockCircleOutlined, SolutionOutlined, 
  AlertOutlined, EditOutlined, BookOutlined, SettingOutlined, UserOutlined,
  DeleteOutlined, SaveOutlined
} from '@ant-design/icons';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title as ChartTitle, Tooltip as ChartTooltip, Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, ChartTooltip, Legend);
const { Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const GRADIENT_BUTTON_STYLE = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  border: 'none',
  color: '#fff'
};
const MOCK_CURRENT_USER = 'Doãn Bá Min';
const currentTimestamp = Date.now();
const mockTickets = [
  { key: '1001', id: '#1001', title: 'Lỗi không áp dụng mã giảm giá', status: 'Đang Xử lý', priority: 'TRUNG BÌNH', customer: 'Nguyễn Văn A', assigned: 'Chưa gán', updated: currentTimestamp - 30 * 60 * 1000, source: 'Form Web', SLA_due: currentTimestamp + 60 * 60 * 1000 },
  { key: '1002', id: '#1002', title: 'Thắc mắc về chính sách đổi hàng', status: 'Mới', priority: 'TRUNG BÌNH', customer: 'Lê Thị C', assigned: 'Chưa gán', updated: currentTimestamp - 7200000, source: 'Email', SLA_due: currentTimestamp + 3600000 },
  { key: '1003', id: '#1003', title: 'Không nhận được email xác nhận đơn hàng', status: 'Chờ Phản hồi', priority: 'CAO', customer: 'Phạm Văn D', assigned: 'Nguyễn K', updated: currentTimestamp - 24 * 3600 * 1000, source: 'Email', SLA_due: currentTimestamp - 1000 },
  { key: '1004', id: '#1004', title: 'Yêu cầu xuất hóa đơn VAT', status: 'Đã Đóng', priority: 'THẤP', customer: 'Hoàng Thị E', assigned: 'Trần B', updated: currentTimestamp - 3 * 24 * 3600 * 1000, source: 'Form Web', SLA_due: currentTimestamp + 7 * 24 * 3600 * 1000 },
  { key: '1005', id: '#1005', title: 'Đơn hàng bị giao thiếu sản phẩm', status: 'Mới', priority: 'CAO', customer: 'Trần Q', assigned: 'Chưa gán', updated: currentTimestamp - 10000, source: 'Form Web', SLA_due: currentTimestamp + 30 * 60 * 1000 },
];
const mockKB = [
  { key: 'KB-005', title: 'Quy trình Hoàn tiền (Refund) chi tiết', category: 'Chính sách', views: 450, status: 'Công khai', updated: '1 tuần trước' },
  { key: 'KB-006', title: 'Thiết lập Mã giảm giá theo ngành hàng', category: 'Vận hành', views: 210, status: 'Chỉ nội bộ', updated: '2 ngày trước' },
];
const mockCannedResponses = [
    { key: 'CR001', title: 'Chào mừng khách hàng', content: 'Cảm ơn quý khách đã liên hệ L-M Shop. Chúng tôi sẽ phản hồi trong 1-2 giờ làm việc.', updated: 'Hôm qua' },
    { key: 'CR002', title: 'Hướng dẫn đổi trả', content: 'Quý khách vui lòng tham khảo chính sách đổi trả tại [link].', updated: '1 tuần trước' },
];
const mockAutomationRules = [
    { key: 1, name: 'Tự động gán Ticket Thanh toán', condition: 'Tiêu đề chứa "Thanh toán"', action: 'Gán cho Trần B', enabled: true },
    { key: 2, name: 'Phân loại Khẩn cấp', condition: 'Nguồn là "Form Khẩn cấp"', action: 'Đặt Ưu tiên CAO', enabled: true },
];
const getStatusTag = (status, t) => {
  switch (status) {
    case 'Mới': return <Tag color="blue">{t('help_status_new')}</Tag>;
    case 'Đang Xử lý': return <Tag color="gold">{t('help_status_in_progress')}</Tag>;
    case 'Chờ Phản hồi': return <Tag color="processing">{t('help_status_pending')}</Tag>;
    case 'Đã Đóng': return <Tag color="green">{t('help_status_closed')}</Tag>;
    default: return <Tag>{status}</Tag>;
  }
};
const getPriorityTag = (priority, t) => {
  switch (priority) {
    case 'CAO': return <Tag color="red" icon={<AlertOutlined />}>{t('help_priority_high')}</Tag>;
    case 'TRUNG BÌNH': return <Tag color="orange">{t('help_priority_medium')}</Tag>;
    default: return <Tag color="default">{t('help_priority_low')}</Tag>;
  }
};
const isSlaBreached = (slaDueTimestamp) => {
    return slaDueTimestamp < Date.now();
}
const applyAutomationRules = (rawTickets) => {
    return rawTickets.map(ticket => {
        let updatedTicket = { ...ticket };
        if (updatedTicket.assigned === 'Chưa gán' && updatedTicket.title.toLowerCase().includes('thanh toán')) {
            updatedTicket.assigned = 'Trần B';
            updatedTicket.status = 'Đang Xử lý';
        }
        if (updatedTicket.status === 'Mới' && updatedTicket.source === 'Form Web' && updatedTicket.priority === 'TRUNG BÌNH') {
            updatedTicket.priority = 'CAO';
        }
        return updatedTicket;
    });
};
const TicketManagementTab = () => {
  const { t } = useTranslation();
    const [tickets, setTickets] = useState(mockTickets);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [createTicketForm] = Form.useForm();
    const [processedAllTickets, setProcessedAllTickets] = useState([]);
        const [tableFilters, setTableFilters] = useState({});
            // helper to apply column filters and search keyword to a ticket list
            const applyFiltersAndSearch = useCallback((data, filtersObj, keyword) => {
                let out = (data || []).filter(t => 
                    t.title.toLowerCase().includes((keyword || '').toLowerCase()) ||
                    t.customer.toLowerCase().includes((keyword || '').toLowerCase())
                );
                if (filtersObj && filtersObj.status && filtersObj.status.length) {
                    out = out.filter(x => filtersObj.status.includes(x.status));
                }
                if (filtersObj && filtersObj.priority && filtersObj.priority.length) {
                    out = out.filter(x => filtersObj.priority.includes(x.priority));
                }
                return out;
            }, []);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [detailForm] = Form.useForm();
    const [staffOptions, setStaffOptions] = useState([]);
  const fetchTickets = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
            // Merge stored support tickets (from Contact form) with mock tickets
            let stored = [];
            try { stored = getStoredSupportTickets() || []; } catch (e) { stored = []; }

            // normalize stored items to expected shape if needed
            const storedNormalized = (stored || []).map(s => ({
                key: s.key || `${s.id}`,
                id: s.id,
                title: s.title || s.description || 'Contact',
                status: s.status || 'Mới',
                priority: s.priority || 'TRUNG BÌNH',
                customer: s.customer || 'Guest',
                assigned: s.assigned || 'Chưa gán',
                updated: s.updated || Date.now(),
                source: s.source || 'Contact Form',
                SLA_due: s.SLA_due || (Date.now() + 6 * 3600000),
                description: s.description || '',
            }));

                    let processedData = applyAutomationRules([...storedNormalized, ...mockTickets]); 

                    // keep full processed list (for KPIs and re-filtering)
                    setProcessedAllTickets(processedData);

                    // derive the table-visible tickets using the shared helper
                    const filtered = applyFiltersAndSearch(processedData, tableFilters, searchKeyword);
                    setTickets(filtered);
      setLoading(false);
      message.success(`${t('help_btn_reload_rules')}: ${filtered.length} Tickets`);
    }, 500);
    }, [searchKeyword, t, tableFilters, applyFiltersAndSearch]);

  useEffect(() => {
        fetchTickets();

        // Listen for tickets created via Contact form
        const onSupportUpdated = () => fetchTickets();
        window.addEventListener('support_tickets_updated', onSupportUpdated);
        const onStorage = (ev) => { if (ev.key === 'support_tickets') fetchTickets(); };
                window.addEventListener('storage', onStorage);

                // load staff options
                const loadStaffs = () => {
                    try {
                        const staffList = getStoredStaffs() || [];
                        const active = (staffList || []).filter(s => s.status !== 'deleted' && s.status !== 'inactive');
                        setStaffOptions(active.map(s => ({ id: s.id, name: s.fullName })));
                    } catch (e) { setStaffOptions([]); }
                };
                loadStaffs();
                const onStaffStorage = (ev) => { if (ev.key === 'app_staffs_v1') loadStaffs(); };
                window.addEventListener('storage', onStaffStorage);

                return () => {
                        window.removeEventListener('support_tickets_updated', onSupportUpdated);
                        window.removeEventListener('storage', onStorage);
                        window.removeEventListener('storage', onStaffStorage);
                };
  }, [fetchTickets]);
  const handleCreateTicket = () => {
    createTicketForm.validateFields().then(values => {
      const newTicket = {
        key: `${Date.now()}`,
        id: `#${1000 + tickets.length + 1}`,
        title: values.title,
        status: 'Mới',
        priority: values.priority,
        customer: values.customer,
        assigned: values.assigned || 'Chưa gán',
        updated: Date.now(),
        source: values.source,
        SLA_due: Date.now() + (values.priority === 'CAO' ? 2 * 3600000 : values.priority === 'TRUNG BÌNH' ? 6 * 3600000 : 24 * 3600000),
      };

      setTickets([newTicket, ...tickets]);
      message.success(t('help_msg_ticket_created', { id: newTicket.id }));
      setIsCreateModalVisible(false);
      createTicketForm.resetFields();
    }).catch(err => {
      console.error('Validation failed:', err);
    });
  };
  const columns = [
    { title: t('help_col_id'), dataIndex: 'id', key: 'id' },
    { 
        title: t('help_col_title'), 
        dataIndex: 'title', 
        key: 'title',
        render: (text, record) => {
            const slaBreached = isSlaBreached(record.SLA_due);
            return (
                <Space direction="vertical" size={0}>
                    <Text>{text}</Text>
                    {slaBreached && (
                        <Tag color="error" icon={<ClockCircleOutlined />} style={{ marginTop: 4 }}>
                            {t('help_tag_sla_breached')}
                        </Tag>
                    )}
                </Space>
            );
        }
    },
    { 
        title: t('help_col_status'), 
        dataIndex: 'status', 
        key: 'status', 
        render: (status) => getStatusTag(status, t),
        filters: [
            { text: 'Mới', value: 'Mới' },
            { text: 'Đang Xử lý', value: 'Đang Xử lý' },
            { text: 'Chờ Phản hồi', value: 'Chờ Phản hồi' },
            { text: 'Đã Đóng', value: 'Đã Đóng' },
        ],
    },
    { 
        title: t('help_col_priority'), 
        dataIndex: 'priority', 
        key: 'priority', 
        render: (priority) => getPriorityTag(priority, t), 
        sorter: (a, b) => a.priority.localeCompare(b.priority),
        filters: [
            { text: 'CAO', value: 'CAO' },
            { text: 'TRUNG BÌNH', value: 'TRUNG BÌNH' },
            { text: 'THẤP', value: 'THẤP' },
        ],
    },
    { title: t('help_col_customer'), dataIndex: 'customer', key: 'customer' },
    { 
        title: t('help_col_assigned'), 
        dataIndex: 'assigned', 
        key: 'assigned',
        render: (assigned) => assigned === MOCK_CURRENT_USER ? <Tag color="volcano"><UserOutlined /> {t('help_tag_assigned_mine')}</Tag> : assigned
    },
    { title: t('help_col_updated'), dataIndex: 'updated', key: 'updated', render: (timestamp) => `${Math.floor((Date.now() - timestamp) / 60000)} phút trước` },
    {
      title: t('help_col_actions'),
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
                    <Button size="small" type="link" onClick={() => showDetailModal(record)}>{t('help_action_details')}</Button>
                                <Button size="small" type="link" danger onClick={async () => {
                                    try {
                                        await updateSupportTicket(record.key || record.id, { status: 'Đã Đóng' });
                                        message.success(t('help_msg_ticket_closed', { id: record.id }));
                                        fetchTickets();
                                    } catch (e) {
                                        console.error('Close ticket failed', e);
                                        message.error(t('help_msg_ticket_close_failed'));
                                    }
                                }}>{t('help_action_close')}</Button>
        </Space>
      ),
    },
  ];

    // handle table filters / sorter changes
    const handleTableChange = (pagination, filters, sorter) => {
        // store filters in state so fetchTickets (and other logic) can react
        setTableFilters(filters || {});
        // compute visible tickets immediately from the processed all tickets if available
        try {
            const visible = applyFiltersAndSearch(processedAllTickets, filters || {}, searchKeyword);
            setTickets(visible);
        } catch (e) {
            // fallback: just set the filters and let fetchTickets run
            setTableFilters(filters || {});
        }
    };

    // Show detail modal for a ticket
    const showDetailModal = (record) => {
        setSelectedTicket(record);
        detailForm.setFieldsValue({
            assigned: record.assigned === 'Chưa gán' ? '' : record.assigned,
            status: record.status,
        });
        setIsDetailModalVisible(true);
    };

    // ✅ KPI HIỂN THỊ TOÀN BỘ TICKETS (KHÔNG PHẢI CHỈ CỦA TÔI)
    const allProcessedTickets = processedAllTickets || [];
    
    // Tính toán KPI từ toàn bộ tickets
    const newTicketsCount = allProcessedTickets.filter(t => t.status === 'Mới').length;
    const inProgressTicketsCount = allProcessedTickets.filter(t => t.status === 'Đang Xử lý').length;
    const pendingTicketsCount = allProcessedTickets.filter(t => t.status === 'Chờ Phản hồi').length;
    const totalHighPriority = allProcessedTickets.filter(t => t.priority === 'CAO').length;

  return (
    <>
        <Alert
            message={<Text strong>{t('help_dashboard_welcome', { user: MOCK_CURRENT_USER, count: allProcessedTickets.length })}</Text>}
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
        />
      
        <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
            <Card title="Ticket Mới" bordered={false} hoverable style={{ borderLeft: '5px solid #1890ff' }}>
                <AlertOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                <span style={{ fontSize: 28, fontWeight: 'bold', marginLeft: 16 }}>{newTicketsCount}</span>
            </Card>
            </Col>
            <Col span={6}>
            <Card title="Đang Xử lý" bordered={false} hoverable style={{ borderLeft: '5px solid #faad14' }}>
                <SolutionOutlined style={{ fontSize: 24, color: '#faad14' }} />
                <span style={{ fontSize: 28, fontWeight: 'bold', marginLeft: 16 }}>{inProgressTicketsCount}</span>
            </Card>
            </Col>
            <Col span={6}>
            <Card title="TB Phản hồi" bordered={false} hoverable style={{ borderLeft: '5px solid #52c41a' }}>
                <ClockCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                <span style={{ fontSize: 28, fontWeight: 'bold', marginLeft: 16 }}>{pendingTicketsCount}</span>
            </Card>
            </Col>
            <Col span={6}>
            <Card title="Khẩn cấp (Tổng)" bordered={false} hoverable style={{ borderLeft: '5px solid #f5222d' }}>
                <AlertOutlined style={{ fontSize: 24, color: '#f5222d' }} />
                <span style={{ fontSize: 28, fontWeight: 'bold', marginLeft: 16 }}>{totalHighPriority}</span>
            </Card>
            </Col>
        </Row>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalVisible(true)} style={GRADIENT_BUTTON_STYLE}>{t('help_btn_create_manual')}</Button>
            <Button icon={<ReloadOutlined />} onClick={fetchTickets} loading={loading}>{t('help_btn_reload_rules')}</Button>
            </Space>
            <Search 
            placeholder={t('help_search_ticket_placeholder')}
            onSearch={setSearchKeyword} 
            style={{ width: 300 }} 
            enterButton 
            />
        </div>
        <Table 
            columns={columns} 
            dataSource={tickets} 
            loading={loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }} 
            onChange={handleTableChange}
        />

        <Modal
            title={
                <Space>
                    <PlusOutlined style={{ color: '#1890ff' }} />
                    <span style={{ fontSize: 18, fontWeight: 600 }}>
                        {t('help_modal_create_ticket_title')}
                    </span>
                </Space>
            }
            open={isCreateModalVisible}
            onOk={handleCreateTicket}
            onCancel={() => {
                setIsCreateModalVisible(false);
                createTicketForm.resetFields();
            }}
            width={700}
            okText={t('help_modal_create_ticket_ok')}
            cancelText={t('help_modal_create_ticket_cancel')}
            okButtonProps={{ icon: <PlusOutlined /> }}
        >
            <Alert
                message={t('help_modal_alert_automation')}
                type="info"
                showIcon
                style={{ marginBottom: 20 }}
            />
        
            <Form 
                form={createTicketForm} 
                layout="vertical" 
                name="create_ticket_form"
                initialValues={{
                    priority: 'TRUNG BÌNH',
                    source: 'Form Web',
                }}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item 
                            name="title" 
                            label={<Text strong>{t('help_form_ticket_title')}</Text>}
                            rules={[
                                { required: true, message: t('help_form_ticket_title_required') },
                                { min: 10, message: t('help_form_ticket_title_min') }
                            ]}
                        >
                            <Input 
                                placeholder={t('help_form_ticket_title_placeholder')}
                                size="large"
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item 
                            name="customer" 
                            label={<Text strong>{t('help_form_customer_name')}</Text>}
                            rules={[{ required: true, message: t('help_form_customer_required') }]}
                        >
                            <Input 
                                placeholder={t('help_form_customer_placeholder')}
                                size="large"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item 
                            name="priority" 
                            label={<Text strong>{t('help_form_priority_label')}</Text>}
                            rules={[{ required: true, message: t('help_form_priority_required') }]}
                        >
                            <Input.Group compact>
                                <Form.Item name="priority" noStyle>
                                    <Button.Group size="large" style={{ width: '100%', display: 'flex' }}>
                                        <Button 
                                            style={{ flex: 1 }}
                                            type={createTicketForm.getFieldValue('priority') === 'THẤP' ? 'primary' : 'default'}
                                            onClick={() => createTicketForm.setFieldsValue({ priority: 'THẤP' })}
                                        >
                                            {t('help_form_priority_low')}
                                        </Button>
                                        <Button 
                                            style={{ flex: 1 }}
                                            type={createTicketForm.getFieldValue('priority') === 'TRUNG BÌNH' ? 'primary' : 'default'}
                                            onClick={() => createTicketForm.setFieldsValue({ priority: 'TRUNG BÌNH' })}
                                        >
                                            {t('help_form_priority_medium')}
                                        </Button>
                                        <Button 
                                            style={{ flex: 1 }}
                                            danger
                                            type={createTicketForm.getFieldValue('priority') === 'CAO' ? 'primary' : 'default'}
                                            onClick={() => createTicketForm.setFieldsValue({ priority: 'CAO' })}
                                            icon={<AlertOutlined />}
                                        >
                                            {t('help_form_priority_high')}
                                        </Button>
                                    </Button.Group>
                                </Form.Item>
                            </Input.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item 
                            name="source" 
                            label={<Text strong>{t('help_form_source_label')}</Text>}
                            rules={[{ required: true, message: t('help_form_source_required') }]}
                        >
                            <Input.Group compact>
                                <Form.Item name="source" noStyle>
                                    <Button.Group size="large" style={{ width: '100%', display: 'flex' }}>
                                        <Button 
                                            style={{ flex: 1 }}
                                            type={createTicketForm.getFieldValue('source') === 'Form Web' ? 'primary' : 'default'}
                                            onClick={() => createTicketForm.setFieldsValue({ source: 'Form Web' })}
                                        >
                                            {t('help_form_source_web')}
                                        </Button>
                                        <Button 
                                            style={{ flex: 1 }}
                                            type={createTicketForm.getFieldValue('source') === 'Email' ? 'primary' : 'default'}
                                            onClick={() => createTicketForm.setFieldsValue({ source: 'Email' })}
                                        >
                                            {t('help_form_source_email')}
                                        </Button>
                                        <Button 
                                            style={{ flex: 1 }}
                                            type={createTicketForm.getFieldValue('source') === 'Điện thoại' ? 'primary' : 'default'}
                                            onClick={() => createTicketForm.setFieldsValue({ source: 'Điện thoại' })}
                                        >
                                            {t('help_form_source_phone')}
                                        </Button>
                                    </Button.Group>
                                </Form.Item>
                            </Input.Group>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item 
                            name="assigned" 
                            label={<Text strong>{t('help_form_assigned_label')}</Text>}
                        >
                            <Input.Group compact>
                                <Form.Item name="assigned" noStyle>
                                    <Button.Group size="large" style={{ width: '100%', display: 'flex' }}>
                                        <Button 
                                            style={{ flex: 1 }}
                                            type={!createTicketForm.getFieldValue('assigned') ? 'primary' : 'default'}
                                            onClick={() => createTicketForm.setFieldsValue({ assigned: '' })}
                                        >
                                            {t('help_form_assigned_auto')}
                                        </Button>
                                        <Button 
                                            style={{ flex: 1 }}
                                            type={createTicketForm.getFieldValue('assigned') === 'Trần B' ? 'primary' : 'default'}
                                            onClick={() => createTicketForm.setFieldsValue({ assigned: 'Trần B' })}
                                        >
                                            Trần B
                                        </Button>
                                        <Button 
                                            style={{ flex: 1 }}
                                            type={createTicketForm.getFieldValue('assigned') === 'Nguyễn K' ? 'primary' : 'default'}
                                            onClick={() => createTicketForm.setFieldsValue({ assigned: 'Nguyễn K' })}
                                        >
                                            Nguyễn K
                                        </Button>
                                    </Button.Group>
                                </Form.Item>
                            </Input.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item 
                    name="description" 
                    label={<Text strong>{t('help_form_description_label')}</Text>}
                >
                    <Input.TextArea 
                        rows={4} 
                        placeholder={t('help_form_description_placeholder')}
                        showCount
                        maxLength={500}
                    />
                </Form.Item>
            </Form>
        </Modal>
        <Modal
            title={<Space><UserOutlined style={{ color: '#1890ff' }}/> {t('help_modal_ticket_detail')}</Space>}
            open={isDetailModalVisible}
            onCancel={() => { setIsDetailModalVisible(false); setSelectedTicket(null); detailForm.resetFields(); }}
            onOk={async () => {
                try {
                    const values = await detailForm.validateFields();
                    const changes = {
                        assigned: values.assigned || 'Chưa gán',
                        status: values.status || selectedTicket?.status || 'Mới',
                    };
                    await updateSupportTicket(selectedTicket.key || selectedTicket.id, changes);
                    message.success(t('help_msg_ticket_updated'));
                    setIsDetailModalVisible(false);
                    setSelectedTicket(null);
                    detailForm.resetFields();
                    fetchTickets();
                } catch (e) {
                    console.error('Save ticket detail failed', e);
                    message.error(t('help_msg_ticket_update_failed'));
                }
            }}
            width={720}
        >
            {selectedTicket ? (
                <Form form={detailForm} layout="vertical" initialValues={{
                    assigned: selectedTicket.assigned === 'Chưa gán' ? '' : selectedTicket.assigned,
                    status: selectedTicket.status,
                }}>
                    <Form.Item label={t('help_col_id')}>
                        <Text strong>{selectedTicket.id}</Text>
                    </Form.Item>
                    <Form.Item label={t('help_col_title')}>
                        <Text>{selectedTicket.title}</Text>
                    </Form.Item>
                    <Form.Item label={t('help_col_customer')}>
                        <Text>{selectedTicket.customer}</Text>
                    </Form.Item>
                    <Form.Item label="Email liên hệ">
                        <Text>{selectedTicket.contactEmail || ''}</Text>
                    </Form.Item>
                    <Form.Item label={t('help_form_description_label')}>
                        <Text>{selectedTicket.description}</Text>
                    </Form.Item>
                    <Form.Item name="assigned" label={t('help_form_assigned_label')}>
                        <Select allowClear placeholder={t('help_form_assigned_auto')}>
                            {staffOptions.map(s => <Select.Option key={s.id} value={s.name}>{s.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="status" label={t('help_col_status')}>
                        <Select>
                            <Select.Option value="Mới">Mới</Select.Option>
                            <Select.Option value="Đang Xử lý">Đang Xử lý</Select.Option>
                            <Select.Option value="Chờ Phản hồi">Chờ Phản hồi</Select.Option>
                            <Select.Option value="Đã Đóng">Đã Đóng</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            ) : null}
        </Modal>
    </>
  );
};
const KnowledgeBaseTab = () => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  // eslint-disable-next-line no-unused-vars
  const [activeSubTab, setActiveSubTab] = useState('kb');
  const kbColumns = [
    { title: t('help_kb_col_title'), dataIndex: 'title', key: 'title', render: text => <Space><BookOutlined />{text}</Space> },
    { title: t('help_kb_col_category'), dataIndex: 'category', key: 'category' },
    { title: t('help_kb_col_status'), dataIndex: 'status', key: 'status', render: status => <Tag color={status === 'Công khai' ? 'success' : 'processing'}>{status}</Tag> },
    { title: t('help_col_actions'), key: 'action', render: () => (<Space><Button size="small" icon={<EditOutlined />} type="link" /></Space>) },
  ];
  const crColumns = [
    { title: 'Mã', dataIndex: 'key', key: 'key', width: 100 },
    { title: t('help_kb_col_cr_title'), dataIndex: 'title', key: 'title', width: 250 },
    { title: t('help_kb_col_cr_content'), dataIndex: 'content', key: 'content', render: text => <Text ellipsis>{text}</Text> },
    { title: t('help_col_actions'), key: 'action', width: 100, render: () => (<Space><Button size="small" icon={<EditOutlined />} type="link" /></Space>) },
  ];
  return (
    <>
        <Tabs 
            defaultActiveKey="kb" 
            onChange={setActiveSubTab} 
            style={{ marginBottom: 16 }}
            items={[
                { key: 'kb', label: t('help_kb_tab_kb'), children: (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setIsModalVisible(true); }} style={GRADIENT_BUTTON_STYLE}>
                                {t('help_kb_btn_create_article')}
                            </Button>
                        </div>
                        <Table columns={kbColumns} dataSource={mockKB} pagination={{ pageSize: 5 }} />
                    </>
                )},
                { key: 'cr', label: t('help_kb_tab_canned_responses'), children: (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                            <Button type="primary" icon={<PlusOutlined />}>
                                {t('help_kb_btn_create_canned')}
                            </Button>
                        </div>
                        <Table columns={crColumns} dataSource={mockCannedResponses} pagination={{ pageSize: 5 }} />
                    </>
                )},
            ]}
        />
      <Modal
        title={t('help_kb_btn_create_article')}
        open={isModalVisible}
        onOk={() => { setIsModalVisible(false); message.success(t('help_kb_btn_create_article') + ' success!'); }}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical" name="kb_article_form">
          <Form.Item name="title" label={t('help_kb_col_title')} rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item name="content" label={t('help_kb_col_cr_content')} rules={[{ required: true }]}> <Input.TextArea rows={8} /> </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
const ReportsAnalyticsTab = () => {
    const { t } = useTranslation();
    const chartData = {
        labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5', 'Tuần 6'],
        datasets: [
            { label: t('help_report_chart_open'), data: [12, 19, 3, 5, 2, 8], borderColor: 'rgb(53, 162, 235)', backgroundColor: 'rgba(53, 162, 235, 0.5)', tension: 0.4 },
            { label: t('help_report_chart_closed'), data: [8, 15, 6, 2, 5, 10], borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.5)', tension: 0.4 },
        ],
    };
    const chartOptions = { 
        responsive: true, 
        plugins: { legend: { position: 'top' } }, 
        scales: { 
            y: { beginAtZero: true, title: { display: true, text: t('help_report_chart_y_axis') } }, 
            x: { title: { display: true, text: t('help_report_chart_x_axis') } } 
        } 
    };
    const mockPerformance = [
        { key: 1, agent: 'Trần B', closed: 85, avgTime: '2h 15m' },
        { key: 2, agent: 'Nguyễn K', closed: 70, avgTime: '3h 05m' },
    ];
    const performanceColumns = [
        { title: t('help_col_assigned'), dataIndex: 'agent', key: 'agent' },
        { title: t('help_report_col_closed'), dataIndex: 'closed', key: 'closed', sorter: (a, b) => a.closed - b.closed },
        { title: t('help_report_col_avg_time'), dataIndex: 'avgTime', key: 'avgTime' },
    ];
    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Title level={4}>{t('help_report_title_trend')}</Title>
            <Card>
                <Line options={chartOptions} data={chartData} />
            </Card>
            <Title level={4}>{t('help_report_title_performance')}</Title>
            <Table columns={performanceColumns} dataSource={mockPerformance} pagination={false} />
        </Space>
    );
};
const AutomationSettingsTab = () => {
    const { t } = useTranslation();
    const [automationRules, setAutomationRules] = useState(mockAutomationRules);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [editForm] = Form.useForm();
    const [createForm] = Form.useForm();
    const handleCreateRule = () => {
        createForm.validateFields().then(values => {
            const newRule = {
                key: automationRules.length + 1,
                name: values.ruleName,
                condition: values.condition,
                action: values.action,
                enabled: true
            };
            setAutomationRules([...automationRules, newRule]);
            message.success(t('help_automation_msg_created') || 'Quy tắc tự động được tạo thành công!');
            setIsCreateModalVisible(false);
            createForm.resetFields();
        }).catch(err => {
            console.error('Validation failed:', err);
        });
    };
    const handleEditRule = (rule) => {
        setEditingRule(rule);
        editForm.setFieldsValue({
            ruleName: rule.name,
            condition: rule.condition,
            action: rule.action,
            enabled: rule.enabled
        });
        setIsEditModalVisible(true);
    };
    const handleSaveEdit = () => {
        editForm.validateFields().then(values => {
            const updatedRules = automationRules.map(rule =>
                rule.key === editingRule.key
                    ? {
                        ...rule,
                        name: values.ruleName,
                        condition: values.condition,
                        action: values.action,
                        enabled: values.enabled
                    }
                    : rule
            );
            setAutomationRules(updatedRules);
            message.success(t('help_automation_msg_updated') || 'Quy tắc tự động được cập nhật thành công!');
            setIsEditModalVisible(false);
            setEditingRule(null);
            editForm.resetFields();
        }).catch(err => {
            console.error('Validation failed:', err);
        });
    };
    const handleDeleteRule = (key) => {
        Modal.confirm({
            title: 'Xóa Quy tắc?',
            content: 'Bạn có chắc chắn muốn xóa quy tắc tự động này không?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                setAutomationRules(automationRules.filter(rule => rule.key !== key));
                message.success('Quy tắc tự động đã được xóa!');
            },
        });
    };
    const handleToggleStatus = (key) => {
        const updatedRules = automationRules.map(rule =>
            rule.key === key ? { ...rule, enabled: !rule.enabled } : rule
        );
        setAutomationRules(updatedRules);
        message.success('Trạng thái quy tắc đã được cập nhật!');
    };
    const rulesColumns = [
        { 
            title: t('help_automation_col_name'), 
            dataIndex: 'name', 
            key: 'name', 
            width: 200,
            render: (text) => <Text strong>{text}</Text>
        },
        { 
            title: t('help_automation_col_condition'), 
            dataIndex: 'condition', 
            key: 'condition',
            render: (text) => <Tag color="blue">{text}</Tag>
        },
        { 
            title: t('help_automation_col_action'), 
            dataIndex: 'action', 
            key: 'action', 
            render: (text) => <Tag color="green">{text}</Tag>
        },
        { 
            title: t('help_automation_col_status'), 
            dataIndex: 'enabled', 
            key: 'enabled', 
            render: (enabled, record) => (
                <Switch 
                    checked={enabled}
                    onChange={() => handleToggleStatus(record.key)}
                />
            )
        },
        { 
            title: t('help_col_actions'), 
            key: 'action',
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button 
                        size="small" 
                        icon={<EditOutlined />} 
                        type="link"
                        onClick={() => handleEditRule(record)}
                        title="Chỉnh sửa quy tắc"
                    />
                    <Button 
                        size="small" 
                        icon={<DeleteOutlined />} 
                        type="link"
                        danger
                        onClick={() => handleDeleteRule(record.key)}
                        title="Xóa quy tắc"
                    />
                </Space>
            )
        },
    ];
    return (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Alert
                message={t('help_automation_rules_title')}
                description="Tự động gán Ticket, đặt Ưu tiên, hoặc gửi phản hồi mẫu dựa trên điều kiện. Việc này giúp tiết kiệm thời gian đáng kể."
                type="warning"
                showIcon
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={() => {
                        createForm.resetFields();
                        setIsCreateModalVisible(true);
                    }}
                    style={GRADIENT_BUTTON_STYLE}
                >
                    {t('help_automation_btn_create_new')}
                </Button>
            </div>
            <Table
                columns={rulesColumns}
                dataSource={automationRules}
                pagination={false}
            />
            <Modal
                title={
                    <Space>
                        <PlusOutlined style={{ color: '#667eea' }} />
                        <span style={{ fontSize: 16, fontWeight: 600 }}>Tạo Quy tắc Tự động Mới</span>
                    </Space>
                }
                open={isCreateModalVisible}
                onOk={handleCreateRule}
                onCancel={() => {
                    setIsCreateModalVisible(false);
                    createForm.resetFields();
                }}
                width={700}
                okText="Tạo"
                cancelText="Hủy"
                okButtonProps={{ icon: <PlusOutlined /> }}
            >
                <Alert
                    message="Thiết lập một quy tắc mới"
                    description="Xác định điều kiện kích hoạt và hành động tương ứng để tự động hóa công việc xử lý Ticket."
                    type="info"
                    showIcon
                    style={{ marginBottom: 20 }}
                />
                <Form 
                    form={createForm} 
                    layout="vertical" 
                    name="create_rule_form"
                >
                    <Form.Item 
                        name="ruleName" 
                        label={<Text strong>Tên Quy tắc</Text>}
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên quy tắc' },
                            { min: 5, message: 'Tên quy tắc phải có ít nhất 5 ký tự' }
                        ]}
                    >
                        <Input 
                            placeholder="VD: Tự động gán Ticket từ Email"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item 
                        name="condition" 
                        label={<Text strong>Điều kiện (Kích hoạt khi)</Text>}
                        rules={[{ required: true, message: 'Vui lòng chọn điều kiện' }]}
                    >
                        <Select
                            placeholder="Chọn điều kiện kích hoạt"
                            size="large"
                            options={[
                                { label: 'Tiêu đề chứa từ khóa', value: 'Tiêu đề chứa từ khóa' },
                                { label: 'Nguồn là Email', value: 'Nguồn là Email' },
                                { label: 'Nguồn là Form Web', value: 'Nguồn là Form Web' },
                                { label: 'Độ ưu tiên là CAO', value: 'Độ ưu tiên là CAO' },
                                { label: 'Khách hàng mới', value: 'Khách hàng mới' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item 
                        name="action" 
                        label={<Text strong>Hành động (Thực hiện)</Text>}
                        rules={[{ required: true, message: 'Vui lòng chọn hành động' }]}
                    >
                        <Select
                            placeholder="Chọn hành động tự động"
                            size="large"
                            options={[
                                { label: 'Gán cho Trần B', value: 'Gán cho Trần B' },
                                { label: 'Gán cho Nguyễn K', value: 'Gán cho Nguyễn K' },
                                { label: 'Đặt Ưu tiên CAO', value: 'Đặt Ưu tiên CAO' },
                                { label: 'Đặt Ưu tiên TRUNG BÌNH', value: 'Đặt Ưu tiên TRUNG BÌNH' },
                                { label: 'Đặt Ưu tiên THẤP', value: 'Đặt Ưu tiên THẤP' },
                                { label: 'Gửi phản hồi tự động', value: 'Gửi phản hồi tự động' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item 
                        name="enabled" 
                        label={<Text strong>Trạng thái</Text>}
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title={
                    <Space>
                        <EditOutlined style={{ color: '#faad14' }} />
                        <span style={{ fontSize: 16, fontWeight: 600 }}>Chỉnh sửa Quy tắc Tự động</span>
                    </Space>
                }
                open={isEditModalVisible}
                onOk={handleSaveEdit}
                onCancel={() => {
                    setIsEditModalVisible(false);
                    setEditingRule(null);
                    editForm.resetFields();
                }}
                width={700}
                okText="Lưu"
                cancelText="Hủy"
                okButtonProps={{ icon: <SaveOutlined /> }}
            >
                <Alert
                    message="Cập nhật quy tắc tự động"
                    description="Chỉnh sửa các thông tin của quy tắc để phù hợp với nhu cầu của bạn."
                    type="info"
                    showIcon
                    style={{ marginBottom: 20 }}
                />
                <Form 
                    form={editForm} 
                    layout="vertical" 
                    name="edit_rule_form"
                >
                    <Form.Item 
                        name="ruleName" 
                        label={<Text strong>Tên Quy tắc</Text>}
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên quy tắc' },
                            { min: 5, message: 'Tên quy tắc phải có ít nhất 5 ký tự' }
                        ]}
                    >
                        <Input 
                            placeholder="VD: Tự động gán Ticket từ Email"
                            size="large"
                        />
                    </Form.Item>
                    <Form.Item 
                        name="condition" 
                        label={<Text strong>Điều kiện (Kích hoạt khi)</Text>}
                        rules={[{ required: true, message: 'Vui lòng chọn điều kiện' }]}
                    >
                        <Select
                            placeholder="Chọn điều kiện kích hoạt"
                            size="large"
                            options={[
                                { label: 'Tiêu đề chứa từ khóa', value: 'Tiêu đề chứa từ khóa' },
                                { label: 'Nguồn là Email', value: 'Nguồn là Email' },
                                { label: 'Nguồn là Form Web', value: 'Nguồn là Form Web' },
                                { label: 'Độ ưu tiên là CAO', value: 'Độ ưu tiên là CAO' },
                                { label: 'Khách hàng mới', value: 'Khách hàng mới' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item 
                        name="action" 
                        label={<Text strong>Hành động (Thực hiện)</Text>}
                        rules={[{ required: true, message: 'Vui lòng chọn hành động' }]}
                    >
                        <Select
                            placeholder="Chọn hành động tự động"
                            size="large"
                            options={[
                                { label: 'Gán cho Trần B', value: 'Gán cho Trần B' },
                                { label: 'Gán cho Nguyễn K', value: 'Gán cho Nguyễn K' },
                                { label: 'Đặt Ưu tiên CAO', value: 'Đặt Ưu tiên CAO' },
                                { label: 'Đặt Ưu tiên TRUNG BÌNH', value: 'Đặt Ưu tiên TRUNG BÌNH' },
                                { label: 'Đặt Ưu tiên THẤP', value: 'Đặt Ưu tiên THẤP' },
                                { label: 'Gửi phản hồi tự động', value: 'Gửi phản hồi tự động' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item 
                        name="enabled" 
                        label={<Text strong>Trạng thái</Text>}
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
};
const SupportPage = () => {
  const { t } = useTranslation();
  const items = [
    {
      key: '1',
      label: t('help_tab_ticket_management'),
      children: <TicketManagementTab />,
    },
    {
      key: '2',
      label: t('help_tab_knowledge_base'),
      children: <KnowledgeBaseTab />,
    },
    {
      key: '3',
      label: t('help_tab_reports_analytics'),
      children: <ReportsAnalyticsTab />,
    },
    {
      key: '4',
      label: <Space><SettingOutlined /> {t('help_tab_automation_settings')}</Space>,
      children: <AutomationSettingsTab />,
    },
  ];
  return (
    <Layout style={{ padding: '0 24px 24px' }}>
      <Title level={2} style={{ margin: '16px 0' }}>
        🔥 {t('help_title')}
      </Title>
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
          defaultActiveKey="1" 
          items={items} 
          size="large" 
        />
      </Content>
    </Layout>
  );
};
export default SupportPage;