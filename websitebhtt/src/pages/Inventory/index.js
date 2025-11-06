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
    Row,
    Col,
    Card,
} from "antd";
import { useEffect, useState, useMemo } from "react";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    DatabaseOutlined,
    SearchOutlined,
    FilterOutlined,
    SortAscendingOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { getMergedProducts, saveLocalProduct, updateLocalProduct, removeLocalProduct } from "../../API";

// Hàm định dạng tiền tệ dựa trên i18n (giữ nguyên)
const formatInventoryPrice = (value, i18n) => {
    if (value === undefined || value === null) return '-';
    const isVietnamese = i18n.language === 'vi';
    const currency = isVietnamese ? 'VNĐ' : 'USD';
    const locale = isVietnamese ? 'vi-VN' : 'en-US';
    
    // Nếu là tiếng Anh, chia giá trị VNĐ giả định trở lại USD (khoảng)
    const displayValue = isVietnamese ? value : value / 23500; 
    
    return `${displayValue.toLocaleString(locale, { minimumFractionDigits: 0 })} ${currency}`;
};

// Local persistence key used for admin-added/overrides (kept in sync with API helpers)
const LOCAL_PRODUCTS_KEY = "local_products";

function persistLocalProductsFromState(list) {
    try {
        // Only persist items marked as local to avoid saving remote data
        const locals = (list || []).filter((p) => p && p._isLocal);
        localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(locals));
    } catch (e) {
        console.error("Failed to persist local products from state", e);
    }
}

function Inventory() {
    const { t, i18n } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form] = Form.useForm();

    // UI states for toolbar
    const [searchText, setSearchText] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [sortOption, setSortOption] = useState("none");
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [hoveredRow, setHoveredRow] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        // reload to update price format when language changes
        fetchData();
    }, [i18n.language]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const merged = await getMergedProducts();
            setDataSource(merged);
        } catch (e) {
            console.error("Error loading merged products", e);
            setDataSource([]);
        } finally {
            setLoading(false);
        }
    };

    // Toolbar handlers
    const handleSearch = (value) => {
        setSearchText(value?.trim?.() ?? "");
    };
    const handleFilterCategory = (value) => {
        setFilterCategory(value);
    };
    const handleSort = (value) => {
        setSortOption(value);
    };
    const filterLowStock = () => {
        setFilterCategory("low_stock");
    };

    // Derived filtered & sorted data (memoized)
    const processedData = useMemo(() => {
        let ds = [...dataSource];
        // search by title/title_en or brand
        if (searchText) {
            const q = searchText.toLowerCase();
            ds = ds.filter((p) => {
                const name = (i18n.language === "en" ? p.title_en : p.title) || "";
                return (
                    name.toLowerCase().includes(q) ||
                    (p.brand || "").toLowerCase().includes(q)
                );
            });
        }
        // filter category
        if (filterCategory && filterCategory !== "all") {
            if (filterCategory === "low_stock") {
                ds = ds.filter((p) => p.stock <= 20);
            } else {
                // Lọc theo category của dummyjson
                ds = ds.filter((p) => p.category === filterCategory);
            }
        }
        // sort
        if (sortOption === "price_asc") ds.sort((a, b) => a.price - b.price);
        if (sortOption === "price_desc") ds.sort((a, b) => b.price - a.price);
        if (sortOption === "stock_desc") ds.sort((a, b) => b.stock - a.stock);
        if (sortOption === "stock_asc") ds.sort((a, b) => a.stock - b.stock);
        return ds;
    }, [dataSource, searchText, filterCategory, sortOption, i18n.language]);

    // Modal open/close
    const openModal = (record = null) => {
        setEditingProduct(record);
        if (record) {
            form.setFieldsValue(record);
            setThumbnailPreview(record.thumbnail || "");
        } else {
            form.resetFields();
            setThumbnailPreview("");
        }
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setEditingProduct(null);
        setIsModalOpen(false);
        setThumbnailPreview("");
    };

    // Save (add/update)
    const handleSave = () => {
        form.validateFields().then((values) => {
            if (editingProduct) {
                // update local store (if exists) or create a local override
                const updated = { ...editingProduct, ...values };
                updateLocalProduct(updated);
                const updatedList = dataSource.map((item) => (item.id === updated.id ? { ...item, ...updated } : item));
                setDataSource(updatedList);
                // persist local-only items from the new state
                persistLocalProductsFromState(updatedList);
                message.success(t("inventory_update_success") || "Cập nhật sản phẩm thành công");
            } else {
                const newProduct = {
                    ...values,
                    id: Date.now(),
                    title_en: values.title, // giả lập
                    _isLocal: true,
                };
                saveLocalProduct(newProduct);
                const newList = [newProduct, ...dataSource];
                setDataSource(newList);
                // persist local-only items from the new state
                persistLocalProductsFromState(newList);
                message.success(t("inventory_add_success") || "Thêm sản phẩm thành công");
            }
            closeModal();
        });
    };

    // Delete
    const handleDelete = (id) => {
        // remove from local storage (or soft-delete remote)
        removeLocalProduct(id);
        const newList = dataSource.filter((item) => item.id !== id);
        setDataSource(newList);
        // persist local-only items from the new state
        persistLocalProductsFromState(newList);
        message.success(t("inventory_delete_success") || "Xóa sản phẩm thành công");
    };

    // compute discount percent helper
    const calcDiscountPercent = (record) => {
        if (!record.price || !record.discountedPrice) return 0;
        if (record.discountedPrice >= record.price) return 0;
        return Math.round(100 - (record.discountedPrice / record.price) * 100);
    };

    // Columns (ĐÃ CHỈNH SỬA WIDTH để tiêu đề nằm trên 1 hàng)
    const columns = [
        {
            title: t("inventory_col_image") || "Ảnh",
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
            title: t("inventory_col_name") || "Tên sản phẩm",
            dataIndex: i18n.language === 'en' ? "title_en" : "title",
            width: 250, // ĐÃ TĂNG WIDTH
            render: (text) => (
                <Typography.Text strong style={{ color: "#262626" }}>
                    {text}
                </Typography.Text>
            ),
        },
        {
            title: `${t("inventory_col_price") || "Giá"} (${i18n.language === 'vi' ? 'VNĐ' : 'USD'})`,
            dataIndex: "price",
            render: (value) => (
                <Typography.Text style={{ color: "#000000ff", fontWeight: 500 }}>
                    {formatInventoryPrice(value, i18n)}
                </Typography.Text>
            ),
            width: 170, // ĐÃ TĂNG WIDTH
        },
        {
            title: t("Giảm giá") || "Giảm giá",
            dataIndex: "discountedPrice",
            render: (discounted, record) => {
                const p = calcDiscountPercent(record);
                return p > 0 ? <Tag color="green">-{p}%</Tag> : <Tag>Không</Tag>;
            },
            width: 110,
        },
        {
            title: t("inventory_col_rating") || "Đánh giá",
            dataIndex: "rating",
            render: (rating) => (
                <Rate value={rating} allowHalf disabled style={{ fontSize: 16 }} />
            ),
            width: 180,
        },
        {
            title: t("inventory_col_stock") || "Tồn kho",
            dataIndex: "stock",
            width: 120, // ĐÃ TĂNG WIDTH
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
            title: t("inventory_col_brand") || "Thương hiệu",
            dataIndex: "brand",
            width: 140,
        },
        {
            title: t("inventory_col_category") || "Danh mục",
            dataIndex: "category",
            width: 140,
            render: (text) => t(text) || text,
        },
        {
            title: t("inventory_col_actions") || "Hành động",
            key: "actions",
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
                    <Popconfirm
                        title={t("inventory_confirm_delete") || "Bạn có chắc muốn xóa?"}
                        onConfirm={() => handleDelete(record.id)}
                        okText={t("delete") || "Xóa"}
                        cancelText={t("cancel") || "Hủy"}
                        icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Table row style for hover effect (use hoveredRow state)
    const onRow = (record) => {
        return {
            onMouseEnter: () => setHoveredRow(record.id),
            onMouseLeave: () => setHoveredRow(null),
            style: {
                background: hoveredRow === record.id ? "#fbfbfb" : undefined,
                transition: "background 0.15s ease",
            },
        };
    };

    // Statistics
    const totalProducts = processedData.length;
    const totalStock = processedData.reduce((s, p) => s + (p.stock || 0), 0);

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
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography.Title level={2} style={{ display: "flex", alignItems: "center", gap: 12, color: "#262626", margin: 0,style: "bold"}}>
                    <DatabaseOutlined style={{ color: "#fff", backgroundColor: "orange", borderRadius: "50%", padding: 10, fontSize: 22, boxShadow: "0 3px 6px rgba(128,0,128,0.3)" }} />
                    <span style={{ fontWeight: 600 }}>{t("inventory") || "Quản lý kho"}</span>
                </Typography.Title>

                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <Button type="primary" icon={<PlusOutlined />} style={{ borderRadius: 8,  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }} onClick={() => openModal()}>
                        {t("inventory_add_product") || "Thêm sản phẩm"}
                    </Button>
                </div>
            </div>

            {/* Toolbar + Stats */}
            <Card style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
                <Row gutter={[16, 12]} align="middle">
                    <Col xs={24} sm={12} md={10} lg={8}>
                        <Input.Search
                            placeholder={t("search_placeholder") || "🔍 Tìm kiếm sản phẩm, thương hiệu..."}
                            onSearch={handleSearch}
                            enterButton={<SearchOutlined />}
                            allowClear
                            onChange={(e) => setSearchText(e.target.value)}
                            value={searchText}
                        />
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Select
                            style={{ width: "100%" }}
                            value={filterCategory}
                            onChange={handleFilterCategory}
                            suffixIcon={<FilterOutlined />}
                            options={[
                                { value: "all", label: t("all_categories") || "Tất cả danh mục" },
                                // Các category mock cũ, nên đổi thành category thực từ dummyjson nếu muốn lọc chính xác
                                { value: "clothing", label: t("clothing") || "Quần áo" }, 
                                { value: "footwear", label: t("footwear") || "Giày dép" },
                                { value: "electronics", label: t("electronics") || "Điện tử" },
                                { value: "furniture", label: t("furniture") || "Nội thất" },
                                { value: "accessories", label: t("accessories") || "Phụ kiện" },
                                { value: "low_stock", label: t("low_stock") || "Sắp hết hàng" },
                            ]}
                        />
                    </Col>

                    <Col xs={24} sm={12} md={6} lg={4}>
                        <Select
                            style={{ width: "100%" }}
                            value={sortOption}
                            onChange={handleSort}
                            suffixIcon={<SortAscendingOutlined />}
                            options={[
                                { value: "none", label: t("sort_default") || "Mặc định" },
                                { value: "price_asc", label: t("price_asc") || "Giá tăng dần" },
                                { value: "price_desc", label: t("price_desc") || "Giá giảm dần" },
                                { value: "stock_desc", label: t("stock_desc") || "Tồn kho cao nhất" },
                            ]}
                        />
                    </Col>

                    <Col xs={24} sm={12} md={24} lg={6} style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <Button onClick={filterLowStock} icon={<DatabaseOutlined />}>
                            {t("inventory_btn_low_stock") || "Sản phẩm sắp hết"}
                        </Button>
                    </Col>

                    <Col span={24} style={{ marginTop: 6 }}>
                        <Space size="middle">
                            <Tag color="blue">Tổng SP: {totalProducts}</Tag>
                            <Tag color="green">Tổng tồn kho: {totalStock}</Tag>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Table */}
            <div style={{ width: "100%", background: "#fff", padding: "16px 20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
                <Table
                    loading={loading}
                    rowKey="id"
                    columns={columns}
                    dataSource={processedData}
                    pagination={{ position: ["bottomCenter"], pageSize: 5 }}
                    style={{ width: "100%", borderRadius: "10px" }}
                    scroll={{ x: "100%" }}
                    onRow={onRow}
                />
            </div>

            {/* Modal thêm / cập nhật */}
            <Modal
                title={editingProduct ? `📝 ${t("inventory_modal_update") || "Cập nhật sản phẩm"}` : `➕ ${t("inventory_modal_add") || "Thêm sản phẩm"}`}
                open={isModalOpen}
                onCancel={closeModal}
                onOk={handleSave}
                okText={editingProduct ? t("update") || "Cập nhật" : t("add") || "Thêm"}
                centered
                width={640}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ rating: 4, stock: 50 }}
                    onValuesChange={(changed, all) => {
                        if (changed.thumbnail !== undefined) setThumbnailPreview(changed.thumbnail || "");
                    }}
                >
                    <Form.Item name="title" label={t("inventory_label_name") || "Tên sản phẩm"} rules={[{ required: true, message: t("inventory_msg_name_required") || "Vui lòng nhập tên sản phẩm" }]}>
                        <Input placeholder={t("inventory_placeholder_name") || "Nhập tên sản phẩm"} />
                    </Form.Item>
                    <Form.Item name="price" label={t("inventory_label_price") || "Giá"} rules={[{ required: true, message: t("inventory_msg_price_required") || "Vui lòng nhập giá" }]}>
                        <InputNumber style={{ width: "100%" }} min={0} placeholder={t("inventory_placeholder_price") || "Nhập giá"} />
                    </Form.Item>
                    <Form.Item name="discountedPrice" label={t("inventory_label_discounted") || "Giá khuyến mãi"}>
                        <InputNumber style={{ width: "100%" }} min={0} placeholder={t("inventory_placeholder_discounted") || "Nhập giá khuyến mãi (nếu có)"} />
                    </Form.Item>
                    <Form.Item name="rating" label={t("inventory_label_rating") || "Đánh giá"}>
                        <Rate allowHalf />
                    </Form.Item>
                    <Form.Item name="stock" label={t("inventory_label_stock") || "Tồn kho"}>
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item name="brand" label={t("inventory_label_brand") || "Thương hiệu"}>
                        <Input placeholder={t("inventory_placeholder_brand") || "Nhập thương hiệu"} />
                    </Form.Item>
                    <Form.Item name="category" label={t("inventory_label_category") || "Danh mục"}>
                        <Select
                            placeholder={t("inventory_placeholder_category") || "Chọn danh mục"}
                            options={[
                                { value: "electronics", label: t("electronics") || "Điện tử" },
                                { value: "clothing", label: t("clothing") || "Quần áo" },
                                { value: "footwear", label: t("footwear") || "Giày dép" },
                                { value: "furniture", label: t("furniture") || "Nội thất" },
                                { value: "accessories", label: t("accessories") || "Phụ kiện" },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item name="thumbnail" label={t("inventory_label_image_link") || "Link ảnh"}>
                        <Input placeholder={t("inventory_placeholder_image_link") || "Dán link ảnh sản phẩm"} />
                    </Form.Item>

                    {/* Preview ảnh */}
                    {thumbnailPreview ? (
                        <div style={{ marginTop: 8 }}>
                            <Typography.Text strong>{t("image_preview") || "Xem trước ảnh"}</Typography.Text>
                            <div style={{ marginTop: 8 }}>
                                <img src={thumbnailPreview} alt="preview" style={{ width: "100%", borderRadius: 8, maxHeight: 220, objectFit: "cover" }} onError={(e) => (e.currentTarget.style.display = "none")} />
                            </div>
                        </div>
                    ) : null}
                </Form>
            </Modal>
        </Space>
    );
}

export default Inventory;