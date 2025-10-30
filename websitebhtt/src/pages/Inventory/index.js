import {
    Avatar,
    Button,
    Form,
    Input,
    InputNumber,
    Modal,
    Rate,
    Space,
    Table,
    Tag,
    Typography,
    message,
    Select,
    Popconfirm,
} from "antd";
import { useEffect, useState } from "react";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    DatabaseOutlined,
} from "@ant-design/icons";
import {  } from "../../API";
import { useTranslation } from "react-i18next"; 



// --- Dữ liệu Mock API (Đã sửa đổi để thêm trường EN cho Inventory) ---
const getInventoryWithLang = () => {
    // Giả lập dữ liệu có trường tiếng Anh và tiếng Việt cho tiêu đề sản phẩm
    const sampleProducts = [
        { id: 1, title: "Áo GuCi", title_en: "Gucci Shirt", price: 1000000, discountedPrice: 1000000, quantity: 2, total: 100000, thumbnail: "http://khosiquanaogiare.com/wp-content/uploads/2020/05/croptop-gucci-3.jpg", rating: 4.5, stock: 120, brand: "LM", category: "clothing", },
        { id: 2, title: "Túi Xách", title_en: "Luxury Handbag", price: 10000000, discountedPrice: 1000000, quantity: 1, total: 10000000, thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWb6XbCxJaBA0wbnqk745vswBBzFtlpV2zNg&s", rating: 4.2, stock: 60, brand: "LM", category: "clothing", },
        { id: 3, title: "Giày Sneakers", title_en: "Running Sneakers", price: 2000000, discountedPrice: 200000, quantity: 1, total: 200000000, thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4XAywk2d8qwBxbcgrrMThMhPji_dKmUe9MfU7lfNXkk-WeDzvA1MOGJH94HdbCs_pmHiXDw&s", rating: 4.8, stock: 40, brand: "LM", category: "footwear", },
        { id: 4, title: "Áo Khoác", title_en: "Bomber Jacket", price: 400000, discountedPrice: 200000, quantity: 1, total: 200000000, thumbnail: "https://evara.vn/uploads/plugin/product_items/385/1.jpg", rating: 4.8, stock: 40, brand: "LM", category: "footwear", },
    ];
    return Promise.resolve({ products: sampleProducts, total: sampleProducts.length });
};

// Hàm định dạng tiền tệ dựa trên i18n
const formatInventoryPrice = (value, i18n) => {
    if (value === undefined || value === null) return '-';
    const isVietnamese = i18n.language === 'vi';
    const currency = isVietnamese ? 'VNĐ' : 'USD';
    const locale = isVietnamese ? 'vi-VN' : 'en-US';
    
    // Chia cho 1000 để mô phỏng đơn vị tiền tệ nhỏ hơn (ví dụ: nghìn VNĐ, hoặc USD)
    const displayValue = isVietnamese ? value : value / 10000; 

    return `${displayValue.toLocaleString(locale, { minimumFractionDigits: 0 })} ${currency}`;
};


function Inventory() {
    const { t, i18n } = useTranslation(); // 👈 SỬ DỤNG HOOK DỊCH

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        // Gọi API mock đã sửa đổi
        fetchData();
    }, []);
    
    // Tải lại dữ liệu khi ngôn ngữ thay đổi để cập nhật định dạng tiền tệ
    useEffect(() => {
        fetchData();
    }, [i18n.language]);

    const fetchData = () => {
        setLoading(true);
        // Thay đổi getInventory bằng mock đã thêm trường ngôn ngữ
        getInventoryWithLang().then((res) => { 
            setDataSource(res.products);
            setLoading(false);
        });
    };

    //  Mở modal thêm mới hoặc chỉnh sửa
    const openModal = (record = null) => {
        setEditingProduct(record);
        if (record) form.setFieldsValue(record);
        else form.resetFields();
        setIsModalOpen(true);
    };

    //  Đóng modal
    const closeModal = () => {
        setEditingProduct(null);
        setIsModalOpen(false);
    };

    //  Thêm hoặc cập nhật sản phẩm
    const handleSave = () => {
        form.validateFields().then((values) => {
            if (editingProduct) {
                // cập nhật
                setDataSource((prev) =>
                    prev.map((item) =>
                        item.id === editingProduct.id ? { ...item, ...values } : item
                    )
                );
                message.success(t("inventory_update_success")); //  Dịch thông báo
            } else {
                // thêm mới
                const newProduct = {
                    ...values,
                    id: Date.now(),
                    // Giả lập thêm tên tiếng Anh nếu người dùng chỉ nhập tiếng Việt
                    title_en: values.title, 
                };
                setDataSource((prev) => [newProduct, ...prev]);
                message.success(t("inventory_add_success")); //  Dịch thông báo
            }
            closeModal();
        });
    };

    //  Xóa sản phẩm
    const handleDelete = (id) => {
        setDataSource((prev) => prev.filter((item) => item.id !== id));
        message.success(t("inventory_delete_success")); //  Dịch thông báo
    };

    // Cấu hình cột với i18n
    const columns = [
        {
            title: t("inventory_col_image"), //  Dịch
            dataIndex: "thumbnail",
            render: (link) => (
                <Avatar
                    src={link}
                    shape="square"
                    size={54}
                    style={{ borderRadius: 10, objectFit: "cover" }}
                />
            ),
            width: 90,
        },
        {
            title: t("inventory_col_name"), //  Dịch
            // Hiển thị tên sản phẩm theo ngôn ngữ hiện tại
            dataIndex: i18n.language === 'en' ? "title_en" : "title", 
            width: 220,
            render: (text) => (
                <Typography.Text strong style={{ color: "#262626" }}>
                    {text}
                </Typography.Text>
            ),
        },
        {
            title: `${t("inventory_col_price")} (${i18n.language === 'vi' ? 'VNĐ' : 'USD'})`, //  Dịch & hiển thị đơn vị
            dataIndex: "price",
            render: (value) => (
                <Typography.Text style={{ color: "#000000ff", fontWeight: 500 }}>
                    {formatInventoryPrice(value, i18n)}
                </Typography.Text>
            ),
            width: 150,
        },
        {
            title: t("inventory_col_rating"), //  Dịch
            dataIndex: "rating",
            render: (rating) => (
                <Rate
                    value={rating}
                    allowHalf
                    disabled
                    style={{ fontSize: 16, color: "#faad14" }}
                />
            ),
            width: 200,
        },
        {
            title: t("inventory_col_stock"), //  Dịch
            dataIndex: "stock",
            width: 100,
            render: (stock) => (
                <Tag
                    color={stock > 50 ? "blue" : stock > 20 ? "gold" : "volcano"}
                    style={{
                        fontWeight: 500,
                        borderRadius: 6,
                        fontSize: 13,
                        padding: "2px 10px",
                    }}
                >
                    {stock}
                </Tag>
            ),
        },
        {
            title: t("inventory_col_brand"), //  Dịch
            dataIndex: "brand",
            width: 140,
        },
        {
            title: t("inventory_col_category"), //  Dịch
            dataIndex: "category",
            width: 140,
            // Dịch các giá trị Category
            render: (text) => t(text), 
        },
        {
            title: t("inventory_col_actions"), //  Dịch
            key: "actions",
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => openModal(record)}
                    />
                    <Popconfirm
                        title={t("inventory_confirm_delete")} //  Dịch
                        onConfirm={() => handleDelete(record.id)}
                        okText={t("delete")} //  Dịch
                        cancelText={t("cancel")} //  Dịch
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
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
            {/* --- TIÊU ĐỀ + NÚT THÊM --- */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography.Title
                    level={3}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        color: "#262626",
                        margin: 0,
                    }}
                >
                    <DatabaseOutlined
                        style={{
                           color: "#fff",
                           backgroundColor: "orange",
                           borderRadius: "50%",
                           padding: 10,
                           fontSize: 22,
                           boxShadow: "0 3px 6px rgba(128,0,128,0.3)",
                        }}
                    />
                    <span style={{ fontWeight: 600 }}>{t("inventory")}</span> {/*  Dịch */}
                </Typography.Title>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{
                        borderRadius: 8,
                        backgroundColor: "#0a75bbff",
                    }}
                    onClick={() => openModal()}
                >
                    {t("inventory_add_product")} {/*  Dịch */}
                </Button>
            </div>

            {/* --- BẢNG DỮ LIỆU --- */}
            <div
                style={{
                    width: "100%",
                    background: "#fff",
                    padding: "16px 20px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                }}
            >
                <Table
                    loading={loading}
                    rowKey="id"
                    columns={columns} // Sử dụng columns đã được dịch
                    dataSource={dataSource}
                    pagination={{
                        position: ["bottomCenter"],
                        pageSize: 5,
                    }}
                    style={{
                        width: "100%",
                        borderRadius: "10px",
                    }}
                    scroll={{ x: "100%" }}
                />
            </div>

            {/* --- MODAL THÊM / CẬP NHẬT --- */}
            <Modal
                title={
                    editingProduct ? `📝 ${t("inventory_modal_update")}` : `➕ ${t("inventory_modal_add")}` //  Dịch
                }
                open={isModalOpen}
                onCancel={closeModal}
                onOk={handleSave}
                okText={editingProduct ? t("update") : t("add")} //  Dịch
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ rating: 4, stock: 50 }}
                >
                    <Form.Item
                        name="title"
                        label={t("inventory_label_name")} //  Dịch
                        rules={[{ required: true, message: t("inventory_msg_name_required") }]} //  Dịch
                    >
                        <Input placeholder={t("inventory_placeholder_name")} /> {/*  Dịch */}
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label={t("inventory_label_price")} //  Dịch
                        rules={[{ required: true, message: t("inventory_msg_price_required") }]} //  Dịch
                    >
                        <InputNumber
                            style={{ width: "100%" }}
                            min={0}
                            placeholder={t("inventory_placeholder_price")} //  Dịch
                        />
                    </Form.Item>
                    <Form.Item name="rating" label={t("inventory_label_rating")}> {/*  Dịch */}
                        <Rate allowHalf />
                    </Form.Item>
                    <Form.Item name="stock" label={t("inventory_label_stock")}> {/*  Dịch */}
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="brand" label={t("inventory_label_brand")}> {/*  Dịch */}
                        <Input placeholder={t("inventory_placeholder_brand")} /> {/*  Dịch */}
                    </Form.Item>
                    <Form.Item name="category" label={t("inventory_label_category")}> {/*  Dịch */}
                        <Select
                            placeholder={t("inventory_placeholder_category")} //  Dịch
                            options={[
                                // Sử dụng key dịch cho nhãn (label)
                                { value: "electronics", label: t("electronics") },
                                { value: "clothing", label: t("clothing") }, 
                                { value: "footwear", label: t("footwear") }, 
                                { value: "furniture", label: t("furniture") },
                                { value: "accessories", label: t("accessories") },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="thumbnail" label={t("inventory_label_image_link")}> {/* Dịch */}
                        <Input placeholder={t("inventory_placeholder_image_link")} /> {/* Dịch */}
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
}

export default Inventory;