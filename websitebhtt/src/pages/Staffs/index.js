import React, { useEffect, useState } from "react";
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
    Modal,
    Form,
    Button,
    Popconfirm,
    Switch,
    message,
    Tooltip,
    Row,
    Col,
    notification,
} from "antd";
import {
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    KeyOutlined,
    TeamOutlined,
    MailOutlined,
    PhoneOutlined,
    CheckCircleOutlined,
    StopOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;
const { Option } = Select;

const STORAGE_KEY = "app_staffs_v1";

const seedStaffs = [
    {
        id: "u1",
        fullName: "Doãn Bá Min",
        email: "min@example.com",
        phone: "0912345678",
        role: "admin",
        status: "active",
        avatar: null,
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
    },
    {
        id: "u2",
        fullName: "Doãn Bá Lực",
        email: "a@example.com",
        phone: "0987654321",
        role: "admin",
        status: "active",
        avatar: null,
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
    },
    {
        id: "u3",
        fullName: "Doãn Chí Bình",
        email: "a@example.com",
        phone: "0987654321",
        role: "staff",
        status: "active",
        avatar: null,
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
    },
    {
        id: "u4",
        fullName: "Doãn Chí Hiền",
        email: "a@example.com",
        phone: "0987654321",
        role: "staff",
        status: "active",
        avatar: null,
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
    },
];

function uid(prefix = "id") {
    return prefix + Math.random().toString(36).slice(2, 9);
}

function readStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedStaffs));
        return [...seedStaffs];
    }
    try {
        return JSON.parse(raw);
    } catch {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedStaffs));
        return [...seedStaffs];
    }
}

function writeStorage(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function Staffs() {
    const { t } = useTranslation();
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

    const openNotificationWithIcon = (type, messageKey, descriptionKey, options = {}) => {
        notification[type]({
            message: t(messageKey, options),
            description: t(descriptionKey, options),
            placement: screenSize === 'xs' ? "topCenter" : "topRight",
        });
    };

    const [loading, setLoading] = useState(false);
    const [staffs, setStaffs] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [q, setQ] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        loadStaffs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        applyFilter();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q, roleFilter, staffs]);

    const loadStaffs = () => {
        setLoading(true);
        setTimeout(() => {
            const list = readStorage().filter((u) => u.status !== "deleted");
            list.sort((a, b) => b.createdAt - a.createdAt);
            setStaffs(list);
            setLoading(false);
        }, 250);
    };

    const applyFilter = () => {
        const term = q.trim().toLowerCase();
        let list = [...staffs];
        if (term) {
            list = list.filter(
                (u) =>
                    (u.fullName || "").toLowerCase().includes(term) ||
                    (u.email || "").toLowerCase().includes(term) ||
                    (u.phone || "").includes(term)
            );
        }
        if (roleFilter !== "all") {
            list = list.filter((u) => u.role === roleFilter);
        }
        setFiltered(list);
    };

    const handleAdd = () => {
        setEditing(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditing(record);
        form.setFieldsValue({
            fullName: record.fullName,
            email: record.email,
            phone: record.phone,
            role: record.role,
            status: record.status === "active",
        });
        setModalVisible(true);
    };

    const handleDelete = (id) => {
        const list = readStorage();
        const idx = list.findIndex((u) => u.id === id);
        if (idx === -1) {
            message.error("Không tìm thấy tài khoản");
            return;
        }
        list[idx].status = "deleted";
        writeStorage(list);
        openNotificationWithIcon("success", "staffs_msg_delete_title", "staffs_msg_delete_success");
        loadStaffs();
    };

    const handleToggleStatus = (id) => {
        const list = readStorage();
        const idx = list.findIndex((u) => u.id === id);
        if (idx === -1) return;
        const newStatus = list[idx].status === "active" ? "inactive" : "active";
        list[idx].status = newStatus;
        writeStorage(list);

        const statusText = newStatus === "active" ? t("staffs_status_active") : t("staffs_status_inactive");

        openNotificationWithIcon(
            "success",
            "staffs_msg_status_update",
            "staffs_msg_status_success",
            { name: list[idx].fullName, status: statusText }
        );
        loadStaffs();
    };

    const handleResetPassword = (id) => {
        const newPwd = Math.random().toString(36).slice(2, 10);
        openNotificationWithIcon(
            "info",
            "staffs_msg_reset_pwd",
            "staffs_msg_reset_pwd_detail",
            { password: newPwd }
        );
    };

    const handleSubmitForm = async () => {
        try {
            const values = await form.validateFields();
            const list = readStorage();
            if (editing) {
                const idx = list.findIndex((u) => u.id === editing.id);
                if (idx === -1) throw new Error("Tài khoản không tồn tại");
                list[idx] = {
                    ...list[idx],
                    fullName: values.fullName,
                    email: values.email,
                    phone: values.phone,
                    role: values.role,
                    status: values.status ? "active" : "inactive",
                };
                writeStorage(list);
                openNotificationWithIcon("success", "staffs_msg_update", "staffs_msg_update_success");
            } else {
                const newUser = {
                    id: uid("u"),
                    fullName: values.fullName,
                    email: values.email,
                    phone: values.phone,
                    role: values.role,
                    avatar: null,
                    status: values.status ? "active" : "inactive",
                    createdAt: Date.now(),
                };
                list.push(newUser);
                writeStorage(list);
                openNotificationWithIcon("success", "staffs_msg_add", "staffs_msg_add_success");
            }
            setModalVisible(false);
            setEditing(null);
            form.resetFields();
            loadStaffs();
        } catch (err) {
            // Xử lý lỗi form validation
        }
    };

    const columns = [
        {
            title: t("staffs_col_staff"),
            dataIndex: "fullName",
            key: "fullName",
            width: screenSize === 'xs' ? "100%" : screenSize === 'sm' ? "50%" : "35%",
            render: (text, record) => (
                <Space direction={screenSize === 'xs' ? "vertical" : "horizontal"}>
                    <Badge
                        dot
                        color={record.status === "active" ? "#52c41a" : "#d9d9d9"}
                        offset={[-6, 40]}
                    >
                        <Avatar
                            size={screenSize === 'xs' ? 36 : 48}
                            src={record.avatar}
                            style={{
                                backgroundColor: record.role === "admin" ? "#ffc069" : "#87d068",
                                color: "#fff",
                                border: "2px solid #fff",
                                fontWeight: 600,
                                flexShrink: 0
                            }}
                        >
                            {!record.avatar && record.fullName.charAt(0).toUpperCase()}
                        </Avatar>
                    </Badge>
                    <div>
                        <Text strong style={{ color: "#262626", fontSize: screenSize === 'xs' ? 12 : 14 }}>
                            {record.fullName}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            <MailOutlined /> {record.email}
                        </Text>
                    </div>
                </Space>
            ),
        },
        ...(screenSize !== 'xs' && screenSize !== 'sm' ? [{
            title: t("staffs_col_phone"),
            dataIndex: "phone",
            key: "phone",
            width: "15%",
            render: (phone) => (
                <Tag
                    icon={<PhoneOutlined />}
                    color="processing"
                    style={{ borderRadius: 6, fontSize: 12 }}
                >
                    {phone || "-"}
                </Tag>
            ),
        }] : []),
        ...(screenSize === 'lg' || screenSize === 'md' ? [{
            title: t("staffs_col_role"),
            dataIndex: "role",
            key: "role",
            width: screenSize === 'md' ? "20%" : "15%",
            render: (role) =>
                role === "admin" ? (
                    <Tag
                        color="gold"
                        style={{ fontWeight: 600, fontSize: 12, borderRadius: 4 }}
                        icon={<TeamOutlined />}
                    >
                        {t("staffs_filter_admin")}
                    </Tag>
                ) : (
                    <Tag
                        color="cyan"
                        style={{ fontWeight: 600, fontSize: 12, borderRadius: 4 }}
                        icon={<TeamOutlined />}
                    >
                        {t("staffs_filter_staff")}
                    </Tag>
                ),
        }] : []),
        {
            title: t("staffs_col_status"),
            dataIndex: "status",
            key: "status",
            width: screenSize === 'xs' ? "auto" : screenSize === 'sm' ? "25%" : "18%",
            render: (status, record) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Switch
                        size={screenSize === 'xs' ? 'small' : 'default'}
                        checkedChildren={screenSize !== 'xs' ? <CheckCircleOutlined /> : null}
                        unCheckedChildren={screenSize !== 'xs' ? <StopOutlined /> : null}
                        checked={status === "active"}
                        onChange={() => handleToggleStatus(record.id)}
                    />
                    {screenSize !== 'xs' && (
                        <Text type={status === "active" ? "success" : "secondary"} style={{ fontSize: 12 }}>
                            {status === "active" ? t("staffs_status_active") : t("staffs_status_inactive")}
                        </Text>
                    )}
                </div>
            ),
        },
        {
            title: t("staffs_col_actions"),
            key: "action",
            width: screenSize === 'xs' ? "auto" : screenSize === 'sm' ? "25%" : "17%",
            render: (_, record) => (
                <Space size={screenSize === 'xs' ? "small" : "small"} wrap>
                    <Tooltip title={t("staffs_tip_edit")}>
                        <Button
                            icon={<EditOutlined />}
                            type="primary"
                            ghost
                            size="small"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>

                    {screenSize !== 'xs' && (
                        <Tooltip title={t("staffs_tip_reset_pwd")}>
                            <Button
                                icon={<KeyOutlined />}
                                type="default"
                                size="small"
                                onClick={() => handleResetPassword(record.id)}
                            />
                        </Tooltip>
                    )}

                    <Popconfirm
                        title={t("staffs_confirm_delete")}
                        onConfirm={() => handleDelete(record.id)}
                        okText={t("delete")}
                        cancelText={t("cancel")}
                    >
                        <Tooltip title={t("staffs_tip_delete")}>
                            <Button icon={<DeleteOutlined />} type="primary" danger size="small" />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const roles = ["all", "admin", "staff"];

    return (
        <Space
            size={20}
            direction="vertical"
            style={{
                width: "100%",
                padding: 24,
                background: "#f5f7fa",
                borderRadius: 12,
            }}
        >
            <Row 
                justify="space-between" 
                align="middle"
                gutter={[16, 16]}
            >
                <Col xs={24} sm={24} md={6}>
                    <Title
                        level={2}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            marginBottom: 0,
                            color: "#262626ff",
                            fontWeight: 800,
                            whiteSpace: "nowrap"
                        }}
                    >
                        <TeamOutlined
                            style={{
                                color: "#fff",
                                backgroundColor: "Teal",
                                borderRadius: "50%",
                                padding: 10,
                                fontSize: 20,
                                boxShadow: "0 4px 10px rgba(114,46,209,0.2)",
                                flexShrink: 0
                            }}
                        />
                        <span style={{ fontWeight: 700 }}>{t("staffs_title")}</span>
                    </Title>
                </Col>

                <Col xs={24} sm={24} md={18} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Space
                        direction={screenSize === 'xs' ? 'vertical' : 'horizontal'}
                        style={{ width: screenSize === 'xs' ? '100%' : 'auto' }}
                    >
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder={t("staffs_search_placeholder")}
                            style={{ 
                                width: screenSize === 'xs' ? '100%' : 280, 
                                borderRadius: 8 
                            }}
                            size={screenSize === 'xs' ? 'small' : 'middle'}
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            allowClear
                        />

                        <Select
                            value={roleFilter}
                            onChange={(val) => setRoleFilter(val)}
                            style={{ width: screenSize === 'xs' ? '100%' : 140, borderRadius: 8 }}
                            size={screenSize === 'xs' ? 'small' : 'middle'}
                        >
                            {roles.map((r) => (
                                <Option key={r} value={r}>
                                    {r === "all" ? t("staffs_filter_all") : r === "admin" ? t("staffs_filter_admin") : t("staffs_filter_staff")}
                                </Option>
                            ))}
                        </Select>

                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                            style={{
                                borderRadius: 8,
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                border: "none",
                                fontWeight: 600,
                                width: screenSize === 'xs' ? '100%' : 'auto'
                            }}
                            size={screenSize === 'xs' ? 'small' : 'middle'}
                        >
                            {screenSize === 'xs' ? '+' : t("staffs_btn_add")}
                        </Button>
                    </Space>
                </Col>
            </Row>

            <Card
                style={{
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    border: "1px solid #f0f0f0",
                    background: "#fff",
                }}
                bodyStyle={{ padding: 16 }}
            >
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    size={screenSize === 'xs' ? 'small' : 'middle'}
                    pagination={{
                        position: ["bottomCenter"],
                        pageSize: screenSize === 'xs' ? 3 : screenSize === 'sm' ? 4 : 6,
                        showSizeChanger: false,
                    }}
                    scroll={{ x: screenSize === 'xs' ? 360 : screenSize === 'sm' ? 600 : undefined }}
                />
            </Card>

            <Modal
                title={editing ? t("staffs_modal_edit") : t("staffs_modal_add")}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setEditing(null);
                    form.resetFields();
                }}
                onOk={handleSubmitForm}
                okText={editing ? t("update") : t("add")}
                cancelText={t("cancel")}
                maskClosable={false}
                destroyOnClose
                width={screenSize === 'xs' ? '95%' : 500}
                style={{ top: screenSize === 'xs' ? 20 : undefined }}
            >
                <Form form={form} layout="vertical" preserve={false}>
                    <Form.Item
                        label={t("staffs_label_name")}
                        name="fullName"
                        rules={[{ required: true, message: t("staffs_msg_name_required") }]}
                    >
                        <Input placeholder={t("staffs_label_name")} />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email" },
                            { type: "email", message: t("staffs_msg_email_invalid") },
                        ]}
                    >
                        <Input placeholder="email@domain.com" />
                    </Form.Item>

                    <Form.Item label={t("staffs_col_phone")} name="phone">
                        <Input placeholder={t("staffs_placeholder_phone")} />
                    </Form.Item>

                    <Form.Item
                        label={t("staffs_col_role")}
                        name="role"
                        rules={[{ required: true, message: t("staffs_msg_role_required") }]}
                    >
                        <Select>
                            <Option value="staff">{t("staffs_filter_staff")}</Option>
                            <Option value="admin">{t("staffs_filter_admin")}</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label={t("staffs_col_status")} name="status" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>

            <style>{`
                @media (max-width: 768px) {
                    .ant-table {
                        font-size: 12px;
                    }
                    .ant-table-cell {
                        padding: 8px 12px;
                    }
                }
                
                @media (max-width: 576px) {
                    .ant-table {
                        font-size: 11px;
                    }
                    .ant-table-cell {
                        padding: 6px 8px;
                    }
                    .ant-btn {
                        padding: 4px 8px;
                    }
                }
            `}</style>
        </Space>
    );
}