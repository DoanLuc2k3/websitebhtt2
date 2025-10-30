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
    UserOutlined,
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    LockOutlined,
    UnlockOutlined,
    KeyOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next"; // 👈 IMPORT useTranslation

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
        status: "active", // active | inactive | deleted
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
    const { t } = useTranslation(); // 👈 Dùng hook dịch

    // Hàm thông báo đã được bao bọc để sử dụng i18n
    const openNotificationWithIcon = (type, messageKey, descriptionKey, options = {}) => {
        notification[type]({
            message: t(messageKey, options),
            description: t(descriptionKey, options),
            placement: "topRight",
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
            message.error("Không tìm thấy tài khoản"); // Tạm giữ tiếng Việt
            return;
        }
        list[idx].status = "deleted";
        writeStorage(list);
        openNotificationWithIcon("success", "staffs_msg_delete_title", "staffs_msg_delete_success"); // 👈 Dịch
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
            { name: list[idx].fullName, status: statusText } // 👈 Truyền options dịch
        );
        loadStaffs();
    };

    const handleResetPassword = (id) => {
        const newPwd = Math.random().toString(36).slice(2, 10);
        openNotificationWithIcon(
            "info",
            "staffs_msg_reset_pwd",
            "staffs_msg_reset_pwd_detail", 
            { password: newPwd } // 👈 Truyền options dịch
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
                openNotificationWithIcon("success", "staffs_msg_update", "staffs_msg_update_success"); // 👈 Dịch
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
                openNotificationWithIcon("success", "staffs_msg_add", "staffs_msg_add_success"); // 👈 Dịch
            }
            setModalVisible(false);
            setEditing(null);
            form.resetFields();
            loadStaffs();
        } catch (err) {
             // Xử lý lỗi form validation (Ant Design tự lo)
        }
    };

    const columns = [
        {
            title: t("staffs_col_staff"), // 👈 Dịch
            dataIndex: "fullName",
            key: "fullName",
            width: 280,
            render: (text, record) => (
                <Space>
                    <Badge
                        dot
                        color={record.status === "active" ? "green" : "gray"}
                        offset={[-6, 40]}
                    >
                        <Avatar
                            size={48}
                            src={record.avatar}
                            style={{ backgroundColor: "#fde3cf", color: "#f56a00", border: "1px solid #f0f0f0" }}
                        >
                            {!record.avatar && (record.fullName || "U").charAt(0).toUpperCase()}
                        </Avatar>
                    </Badge>
                    <div>
                        <Text strong style={{ color: "#333" }}>
                            {record.fullName}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            {record.email}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: t("staffs_col_phone"), // 👈 Dịch
            dataIndex: "phone",
            key: "phone",
            render: (phone) => (
                <Tag color="blue" style={{ borderRadius: 6 }}>
                    {phone || "-"}
                </Tag>
            ),
        },
        {
            title: t("staffs_col_role"), // 👈 Dịch
            dataIndex: "role",
            key: "role",
            render: (role) =>
                role === "admin" ? (
                    <Tag color="gold" style={{ fontWeight: 600 }}>
                        <TeamOutlined /> {t("staffs_filter_admin")} {/* 👈 Dịch */}
                    </Tag>
                ) : (
                    <Tag color="cyan" style={{ fontWeight: 600 }}>
                        {t("staffs_filter_staff")} {/* 👈 Dịch */}
                    </Tag>
                ),
            filters: [
                { text: t("staffs_filter_admin"), value: "admin" }, // 👈 Dịch
                { text: t("staffs_filter_staff"), value: "staff" }, // 👈 Dịch
            ],
            onFilter: (value, record) => record.role === value,
        },
        {
            title: t("staffs_col_status"), // 👈 Dịch
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status, record) => (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Switch
                        checkedChildren={<UnlockOutlined />}
                        unCheckedChildren={<LockOutlined />}
                        checked={status === "active"}
                        onChange={() => handleToggleStatus(record.id)}
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {status === "active" ? t("staffs_status_active") : t("staffs_status_inactive")} {/* 👈 Dịch */}
                    </Text>
                </div>
            ),
        },
        {
            title: t("staffs_col_actions"), // 👈 Dịch
            key: "action",
            fixed: "right",
            width: 170,
            render: (_, record) => (
                <Space>
                    <Tooltip title={t("staffs_tip_edit")}> {/* 👈 Dịch */}
                        <Button
                            icon={<EditOutlined />}
                            type="text"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>

                    <Tooltip title={t("staffs_tip_reset_pwd")}> {/* 👈 Dịch */}
                        <Button
                            icon={<KeyOutlined />}
                            type="text"
                            onClick={() => handleResetPassword(record.id)}
                        />
                    </Tooltip>

                    <Popconfirm
                        title={t("staffs_confirm_delete")} // 👈 Dịch
                        onConfirm={() => handleDelete(record.id)}
                        okText={t("delete")} // 👈 Dịch
                        cancelText={t("cancel")} // 👈 Dịch
                    >
                        <Tooltip title={t("staffs_tip_delete")}> {/* 👈 Dịch */}
                            <Button icon={<DeleteOutlined />} type="text" danger />
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
            <Row justify="space-between" align="middle">
                <Col>
                    <Title
                        level={3}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            marginBottom: 0,
                        }}
                    >
                        <UserOutlined
                            style={{
                                color: "#fff",
                                backgroundColor: "Teal",
                                borderRadius: "50%",
                                padding: 10,
                                fontSize: 20,
                                boxShadow: "0 4px 10px rgba(114,46,209,0.2)",
                            }}
                        />
                        <span style={{ fontWeight: 700 }}>{t("staffs_title")}</span> {/* 👈 Dịch */}
                    </Title>
                </Col>

                <Col>
                    <Space>
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder={t("staffs_search_placeholder")} // 👈 Dịch
                            style={{ width: 300, borderRadius: 8 }}
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            allowClear
                        />

                        <Select
                            value={roleFilter}
                            onChange={(val) => setRoleFilter(val)}
                            style={{ width: 140, borderRadius: 8 }}
                        >
                            {roles.map((r) => (
                                <Option key={r} value={r}>
                                    {r === "all" ? t("staffs_filter_all") : r === "admin" ? t("staffs_filter_admin") : t("staffs_filter_staff")} {/* 👈 Dịch */}
                                </Option>
                            ))}
                        </Select>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAdd}
                            style={{ borderRadius: 8, backgroundColor: "#0a75bbff",}}
                        >
                            {t("staffs_btn_add")} {/* 👈 Dịch */}
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
                    size="middle"
                    pagination={{
                        position: ["bottomCenter"],
                        pageSize: 6,
                        showSizeChanger: false,
                    }}
                    scroll={{ x: 900 }}
                />
            </Card>

            <Modal
                title={editing ? t("staffs_modal_edit") : t("staffs_modal_add")} // 👈 Dịch
                visible={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setEditing(null);
                    form.resetFields();
                }}
                onOk={handleSubmitForm}
                okText={editing ? t("update") : t("add")} // 👈 Dịch
                cancelText={t("cancel")} // 👈 Dịch
                maskClosable={false}
                destroyOnClose
            >
                <Form form={form} layout="vertical" preserve={false}>
                    <Form.Item
                        label={t("staffs_label_name")} // 👈 Dịch
                        name="fullName"
                        rules={[{ required: true, message: t("staffs_msg_name_required") }]} // 👈 Dịch
                    >
                        <Input placeholder={t("staffs_label_name")} /> {/* 👈 Dịch */}
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email" },
                            { type: "email", message: t("staffs_msg_email_invalid") }, // 👈 Dịch
                        ]}
                    >
                        <Input placeholder="email@domain.com" />
                    </Form.Item>

                    <Form.Item label={t("staffs_col_phone")} name="phone"> {/* 👈 Dịch */}
                        <Input placeholder={t("staffs_placeholder_phone")} /> {/* 👈 Dịch */}
                    </Form.Item>

                    <Form.Item
                        label={t("staffs_col_role")} // 👈 Dịch
                        name="role"
                        rules={[{ required: true, message: t("staffs_msg_role_required") }]}
                    >
                        <Select>
                            <Option value="staff">{t("staffs_filter_staff")}</Option> {/* 👈 Dịch */}
                            <Option value="admin">{t("staffs_filter_admin")}</Option> {/* 👈 Dịch */}
                        </Select>
                    </Form.Item>

                    <Form.Item label={t("staffs_col_status")} name="status" valuePropName="checked"> {/* 👈 Dịch */}
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
}