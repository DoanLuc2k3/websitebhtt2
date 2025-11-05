import React, { useState } from "react";
import {
    Card,
    Row,
    Col,
    Typography,
    Tag,
    List,
    Form,
    Input,
    Button,
    message,
    Timeline,
    Space,
    Select, 
    Divider, 
} from "antd";
import {
    ApiOutlined,
    DatabaseOutlined,
    CloudOutlined,
    InfoCircleOutlined,
    SyncOutlined,
    QuestionCircleOutlined,
    MessageOutlined,
   
    PhoneOutlined,
    SearchOutlined, 
    ToolOutlined, 
} from "@ant-design/icons";
// import { useTranslation } from "react-i18next"; // Giữ code gốc

const { Title, Paragraph, Text } = Typography;
const { TextArea, Search } = Input;
const { Option } = Select;

const SupportDashboard = () => {
    // const { t } = useTranslation(); // Giữ code gốc

    const [diagnosisId, setDiagnosisId] = useState("");
    const [form] = Form.useForm();
    
    // Màu sắc thống nhất
    const PRIMARY_BLUE = '#1677ff';
    const PRIMARY_PURPLE = '#722ed1';

    // Dữ liệu trạng thái hệ thống (Sử dụng key trạng thái: active, maintenance)
    const [services] = useState([
        { id: 'api', name: "Service API", status: 'active', icon: <ApiOutlined /> },
        { id: 'db', name: "Database", status: 'active', icon: <DatabaseOutlined /> },
        { id: 'cdn', name: "CDN & Assets", status: 'maintenance', icon: <CloudOutlined /> },
        { id: 'auth', name: "Authentication", status: 'active', icon: <InfoCircleOutlined /> },
    ]);

    // Dữ liệu câu hỏi thường gặp
    const faqData = [
        {
            title: "How do I reset my password?",
            content: "You can reset your password by clicking 'Forgot Password' on the login page. An email will be sent with instructions.",
        },
        {
            title: "Where can I find my order history?",
            content: "Your complete order history is available in the 'Orders' section of your account profile.",
        },
        {
            title: "What is the return policy?",
            content: "We accept returns within 30 days of purchase, provided the items are in their original condition.",
        },
    ];

    // Xử lý gửi ticket
    const onFinish = (values) => {
        message.loading({ content: "Submitting ticket...", key: 'ticket' });
        setTimeout(() => {
            console.log("Ticket submitted:", values);
            message.success({ content: "Support ticket submitted successfully!", key: 'ticket', duration: 2 });
            form.resetFields();
        }, 1500);
    };

    // Xử lý chẩn đoán
    const handleDiagnosis = (value) => {
        if (!value) {
            message.error("Please enter an Order ID or Tracking ID.");
            return;
        }
        setDiagnosisId(value);
        message.loading({ content: `Running diagnostics for ${value}...`, key: 'diag' });
        setTimeout(() => {
            message.success({ content: "Diagnostics complete. No issues found.", key: 'diag', duration: 2 });
        }, 2000);
    };

    // Render tag trạng thái
    const renderStatusTag = (status) => {
        if (status === 'active') {
            return <Tag color="green" icon={<SyncOutlined spin />}>Active</Tag>;
        }
        if (status === 'maintenance') {
            return <Tag color="orange" icon={<ToolOutlined />}>Maintenance</Tag>;
        }
        return <Tag color="red">Down</Tag>;
    };

    return (
        /* * ĐÃ XÓA DIV BỌC NGOÀI CÓ PADDING
         * .PageContent (từ App.css) sẽ tự động thêm padding: 24px
         */
        <>
            <Title level={3} style={{ margin: 0, paddingBottom: 16 }}>
                Help & Support Center
            </Title>

            {/* BỐ CỤC MẪU MỚI: 1 HÀNG, 2 CỘT */}
            <Row gutter={[24, 24]}>
                
                {/* === CỘT BÊN TRÁI (Ticket & FAQ) === */}
                <Col xs={24} lg={14}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        
                        {/* CARD 1: Gửi ticket */}
                        <Card 
                            title="Submit a Support Ticket" 
                            bordered={false} 
                            /* * KHÔNG CÓ height: 100% */
                            style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", width: '100%' }}
                            headStyle={{ borderBottom: 0, fontWeight: 600 }}
                            extra={<MessageOutlined style={{ color: PRIMARY_BLUE }} />}
                        >
                            <Form form={form} layout="vertical" onFinish={onFinish}>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="category"
                                            label="Category"
                                            rules={[{ required: true, message: "Please select a category." }]}
                                        >
                                            <Select placeholder="Select a category">
                                                <Option value="tech">Technical Issue</Option>
                                                <Option value="billing">Billing & Payments</Option>
                                                <Option value="general">General Inquiry</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                         <Form.Item
                                            name="priority"
                                            label="Priority"
                                            initialValue="medium"
                                        >
                                            <Select>
                                                <Option value="low">Low</Option>
                                                <Option value="medium">Medium</Option>
                                                <Option value="high">High</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item
                                    name="subject"
                                    label="Subject"
                                    rules={[{ required: true, message: "Please enter a subject." }]}
                                >
                                    <Input placeholder="Briefly describe your issue" />
                                </Form.Item>
                                <Form.Item
                                    name="description"
                                    label="Description"
                                    rules={[{ required: true, message: "Please describe your issue." }]}
                                >
                                    <TextArea rows={4} placeholder="Please provide as much detail as possible..." />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" style={{ background: PRIMARY_BLUE }}>
                                        Submit Ticket
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>

                        {/* CARD 2: FAQ */}
                        <Card 
                            title="Frequently Asked Questions (FAQ)" 
                            bordered={false} 
                            style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", width: '100%' }}
                            headStyle={{ borderBottom: 0, fontWeight: 600 }}
                            extra={<QuestionCircleOutlined style={{ color: PRIMARY_PURPLE }} />}
                        >
                            <List
                                itemLayout="vertical"
                                dataSource={faqData}
                                renderItem={item => (
                                    <List.Item style={{ borderBottom: '1px solid #f0f0f0', padding: '12px 0' }}>
                                        <Text strong>{item.title}</Text>
                                        <Paragraph type="secondary" style={{ margin: 0 }}>
                                            {item.content}
                                        </Paragraph>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Space>
                </Col>

                {/* === CỘT BÊN PHẢI (Status, Diag, Contact) === */}
                <Col xs={24} lg={10}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>

                        {/* CARD 1: Trạng thái hệ thống */}
                        <Card 
                            title="System Status" 
                            bordered={false} 
                            /* * KHÔNG CÓ height: 100% */
                            style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", width: '100%' }}
                            headStyle={{ borderBottom: 0, fontWeight: 600, color: PRIMARY_BLUE }}
                        >
                            <List
                                dataSource={services}
                                renderItem={(item) => (
                                    <List.Item style={{ borderBottom: '1px solid #f0f0f0', padding: '12px 0' }}>
                                        <List.Item.Meta
                                            avatar={<span style={{ fontSize: 20, color: item.status === 'active' ? PRIMARY_BLUE : '#faad14' }}>{item.icon}</span>}
                                            title={<Text strong>{item.name}</Text>}
                                        />
                                        {renderStatusTag(item.status)}
                                    </List.Item>
                                )}
                                footer={
                                    <div style={{ textAlign: 'center', paddingTop: 12 }}>
                                        <Text type="secondary">All systems operational.</Text>
                                    </div>
                                }
                            />
                        </Card>
                    
                        {/* CARD 2: Chẩn đoán nhanh */}
                        <Card 
                            title="Quick Diagnostics" 
                            bordered={false} 
                            style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", width: '100%' }}
                            headStyle={{ borderBottom: 0, fontWeight: 600, color: PRIMARY_PURPLE }}
                        >
                            <Paragraph type="secondary">
                                Enter an Order ID or Tracking ID to check its status.
                            </Paragraph>
                            <Search
                                placeholder="e.g., #12345 or T-98765"
                                enterButton={<Button type="primary" icon={<SearchOutlined />} style={{ background: PRIMARY_PURPLE, borderColor: PRIMARY_PURPLE }}>Run Test</Button>}
                                onSearch={handleDiagnosis}
                                style={{ marginTop: 8 }}
                            />
                            {diagnosisId && (
                                <Timeline style={{ marginTop: 24, paddingLeft: 8 }}>
                                    <Timeline.Item color="green">{`Started diagnostics for ${diagnosisId}`}</Timeline.Item>
                                    <Timeline.Item color="blue" dot={<SyncOutlined spin />}>Checking payment & inventory...</Timeline.Item>
                                </Timeline>
                            )}
                        </Card>
                        
                        {/* CARD 3: Liên hệ */}
                        <Card 
                            title="Direct Contact" 
                            bordered={false} 
                            style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", width: '100%' }}
                            headStyle={{ borderBottom: 0, fontWeight: 600 }}
                        >
                            <Paragraph type="secondary" style={{ marginBottom: 16 }}>
                                If you need immediate assistance, please use:
                            </Paragraph>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Card 
                                        hoverable 
                                        style={{ 
                                            textAlign: 'center', 
                                            borderRadius: 8, 
                                            backgroundColor: '#f6ffed', 
                                            borderLeft: '4px solid #52c41a', 
                                        }}
                                        bordered={false}
                                    >
                                        <Paragraph style={{ margin: 0 }}>
                                            <Text type="secondary" style={{ display: 'block' }}>Chat</Text> 
                                            <Text strong style={{ color: '#52c41a' }}><MessageOutlined style={{ marginRight: 6 }} /> Live Chat</Text>
                                        </Paragraph>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                     <Card 
                                        hoverable 
                                        style={{ 
                                            textAlign: 'center', 
                                            borderRadius: 8, 
                                            backgroundColor: '#e6f4ff', 
                                            borderLeft: '4px solid #1677ff', 
                                        }}
                                        bordered={false}
                                    >
                                        <Paragraph style={{ margin: 0 }}>
                                            <Text type="secondary" style={{ display: 'block' }}>Hotline</Text>
                                            <Text strong style={{ color: '#1677ff' }}><PhoneOutlined style={{ marginRight: 6 }} /> 8888 9999</Text>
                                        </Paragraph>
                                    </Card>
                                </Col>
                            </Row>
                            
                            <Divider style={{ margin: '16px 0 8px 0' }} />

                            {/* Thời gian hỗ trợ */}
                            <Paragraph style={{ margin: 0 }}>
                                <Text type="secondary">Support hours: 8:00 AM - 10:00 PM (GMT+7)</Text>
                            </Paragraph>
                        </Card>
                    </Space>
                </Col>
            </Row>

            {/* Footer Card (Giữ nguyên như cũ) */}
            <Card style={{ marginTop: 24, textAlign: "center", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }} bordered={false}>
                <Text type="secondary">
                    LMSHOP ADMIN BY MIN
                </Text>
            </Card>
        </>
    );
};

export default SupportDashboard;

