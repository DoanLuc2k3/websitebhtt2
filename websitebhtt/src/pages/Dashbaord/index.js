import React, { useEffect, useState } from "react";
import {
    Card,
    Space,
    Typography,
    Flex,
    Tag,
    Table,
    Button,
    Row,
    Col,
    Tooltip,
    List, 
    Avatar, 
    Progress, 
} from "antd";
import {
    LineChartOutlined,
    DollarOutlined,
    UserAddOutlined,
    ArrowUpOutlined,
    FireOutlined,
    TrophyOutlined,
    ShoppingCartOutlined,
    EyeOutlined,
    CrownOutlined, 
    UserOutlined, 
    ArrowDownOutlined, // Thêm ArrowDownOutlined để sử dụng trong StatCard
} from "@ant-design/icons";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next"; // IMPORT useTranslation

// Đăng ký các thành phần Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    ChartTooltip,
    Legend
);

const { Title: AntTitle, Text } = Typography;

// =========================================================
// HÀM HỖ TRỢ VÀ MOCK DATA (Áp dụng i18n cho strings)
// =========================================================

const mockRevenueData = {
    // Giá trị đã được chia để mô phỏng K USD hoặc K VNĐ (tùy thuộc vào i18n)
    monthly: [15, 22, 31, 28, 45, 52, 60, 68, 85, 75, 92, 105], 
    products: [
        { name: 'Jackets', name_vi: 'Áo Khoác', sales: 52, count: 210 },
        { name: 'Handbags', name_vi: 'Túi Xách', sales: 41, count: 180 },
        { name: 'Sneakers', name_vi: 'Giày Sneaker', sales: 35, count: 150 },
        { name: 'Accessories', name_vi: 'Phụ kiện', sales: 18, count: 90 },
    ],
    growthRate: 9,
    newCustomers: 1000,
    totalRevenue: 5000000, 
};

const getCustomers = () => Promise.resolve({
    users: [
        { id: 1, firstName: "Doãn", lastName: "Bá Lực" },
        { id: 2, firstName: "Doãn", lastName: "Bá Min" },
        { id: 3, firstName: "Lê", lastName: "Văn C" },
        { id: 4, firstName: "Phạm", lastName: "Thị D" },
        { id: 5, firstName: "Hoàng", lastName: "Văn E" },
    ],
});
const getOrders = () => Promise.resolve({
    products: [
        { id: 1, title: 'Gucci Sweater', title_vi: 'Áo Guci', quantity: 1, discountedPrice: 250 },
        { id: 2, title: 'Designer Handbag', title_vi: 'Túi xách', quantity: 2, discountedPrice: 250 },
        { id: 3, title: 'High-Top Sneaker', title_vi: 'Giày Sneaker', quantity: 1, discountedPrice: 700 },
        { id: 4, title: 'Slim Fit Jeans', title_vi: 'Quần Jean', quantity: 3, discountedPrice: 75 },
    ]
});

// Hàm hỗ trợ định dạng tiền tệ dựa trên ngôn ngữ hiện tại
const formatCurrencyDisplay = (amount, i18n) => {
    const isVietnamese = i18n.language === 'vi';
    const formatter = new Intl.NumberFormat(isVietnamese ? 'vi-VN' : 'en-US', {
        style: 'currency',
        currency: isVietnamese ? 'VND' : 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
    return formatter.format(amount);
};

// Hàm hỗ trợ định dạng chi tiêu lớn (Tr/Tỷ hoặc K/M)
const formatSpending = (amount, i18n) => {
    const isVietnamese = i18n.language === 'vi';
    
    if (isVietnamese) {
        if (amount >= 1000000000) return (amount / 1000000000).toFixed(2) + ' Tỷ VNĐ';
        if (amount >= 1000000) return (amount / 1000000).toFixed(2) + ' Tr VNĐ';
        return amount.toLocaleString('vi-VN') + ' VNĐ';
    } else {
        if (amount >= 1000000) return (amount / 1000000).toFixed(1) + ' M USD';
        if (amount >= 1000) return (amount / 1000).toFixed(1) + ' K USD';
        return formatCurrencyDisplay(amount, i18n);
    }
};

// =========================================================
// 1. Component Card Thống kê Chính (StatCard)
// =========================================================

function StatCard({ title, value, icon, color, bg, growth = null, animationDelay = '0s' }) { 
    const floatDelay = `calc(0.5s + ${animationDelay})`; 
    
    const renderValue = () => {
        if (growth !== null) {
            const isPositive = growth >= 0;
            return (
                <Flex align="center" gap={10}>
                    <AntTitle level={3} style={{ margin: 0, color: '#333', fontWeight: 800 }}>
                        {value}
                    </AntTitle>
                    <Tag 
                        color={isPositive ? 'green' : 'red'} 
                        // Sử dụng ArrowDownOutlined khi giảm trưởng
                        icon={isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />} 
                        style={{ fontWeight: 600, padding: '4px 8px', fontSize: 13 }}
                    >
                        {Math.abs(growth)}%
                    </Tag>
                </Flex>
            );
        }
        
        return (
            <AntTitle level={3} style={{ margin: 0, color: '#333', fontWeight: 800 }}>
                {value}
            </AntTitle>
        );
    };

    const cardStyle = {
        borderRadius: 16,
        background: bg,
        overflow: 'hidden',
        transition: 'all 0.3s ease-out',
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)", 
        minHeight: '120px', 
        opacity: 0,
        
        willChange: 'transform, opacity',
        
        animation: 
            `revealAnimation 0.5s ease-out ${animationDelay} forwards, ` + 
            `floatAnimation 4s ease-in-out ${floatDelay} infinite`, 
    };

    return (
        <Card
            bordered={false}
            style={cardStyle}
        >
            <Flex justify="space-between" align="flex-start">
                <Space direction="vertical" size={4}>
                    <Text style={{ color: color, fontWeight: 700, textTransform: 'uppercase', fontSize: 13 }}>
                        {title}
                    </Text>
                    
                    {renderValue()}
                </Space>

                <div style={{ fontSize: 40, color: color + 'AA', opacity: 0.5 }}>
                    {icon}
                </div>
            </Flex>
        </Card>
    );
}

// =========================================================
// 2. Biểu đồ Đường (MonthlyRevenueChart) 
// =========================================================

function MonthlyRevenueChart({ data }) {
    const { t, i18n } = useTranslation(); // 👈 Dùng hook dịch

    const labels = i18n.language === 'vi' 
        ? ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"]
        : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const unit = i18n.language === 'vi' ? '(K VNĐ)' : '(K USD)';
    
    const chartData = {
        labels,
        datasets: [
            {
                label: `${t('revenue')} ${unit}`, // 👈 Dịch
                data: data.monthly,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgb(255, 99, 132)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: `📈 ${t('monthly_revenue_trend')} ${unit}`, font: { size: 16, weight: 'bold' } }, 
        },
        scales: {
            y: { beginAtZero: true, title: { display: true, text: unit.replace(/[()]/g, '') } },
        },
    };

    return (
        <Card title={t("revenue_analysis")} bordered={false} style={{ borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}> 
            <div style={{ height: '300px' }}>
                <Line options={options} data={chartData} />
            </div>
        </Card>
    );
}

// =========================================================
// 3. Biểu đồ Cột (BestSellingProductsChart) 
// =========================================================

function BestSellingProductsChart({ data }) {
    const { t, i18n } = useTranslation(); //  Dùng hook dịch
    
    const labels = data.products.map(p => i18n.language === 'vi' ? p.name_vi : p.name); //  Dịch tên sản phẩm
    const salesData = data.products.map(p => p.sales);
    const unit = i18n.language === 'vi' ? '(K VNĐ)' : '(K USD)';

    const chartData = {
        labels,
        datasets: [
            {
                label: t('revenue'), //  Dịch
                data: salesData,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        indexAxis: 'y',
        plugins: {
            legend: { display: false },
            title: { display: true, text: `🔥 ${t('top_selling_products')}`, font: { size: 16, weight: 'bold' } }, //  Dịch
        },
        scales: {
            x: { beginAtZero: true, title: { display: true, text: `${t('revenue')} ${unit}` } }, // Dịch
        },
    };

    return (
        <Card title={t("product_performance")} bordered={false} style={{ borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}> 
            <div style={{ height: '300px' }}>
                <Bar options={options} data={chartData} />
            </div>
        </Card>
    );
}

// =========================================================
// 4. Khách hàng Chi tiêu Cao nhất
// =========================================================

function TopCustomersRanking() {
    const { t, i18n } = useTranslation(); // Dùng hook dịch
    
    const [topCustomers, setTopCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [maxSpending, setMaxSpending] = useState(0); 

    useEffect(() => {
        getCustomers().then(res => {
            const customersWithSpending = res.users.slice(0, 5).map(user => ({
                ...user,
                // Dữ liệu chi tiêu ngẫu nhiên
                totalSpending: Math.floor(Math.random() * 50000000) + 10000000, 
            })).sort((a, b) => b.totalSpending - a.totalSpending);

            setMaxSpending(customersWithSpending[0]?.totalSpending || 1);
            setTopCustomers(customersWithSpending);
            setLoading(false);
        });
    }, []);

    // Danh sách huy chương cho Top 3
    const rankIcons = [
        <CrownOutlined style={{ color: '#ffc53d', fontSize: 22 }} />,
        <CrownOutlined style={{ color: '#d9d9d9', fontSize: 18 }} />,
        <CrownOutlined style={{ color: '#ff7875', fontSize: 16 }} />,
    ];

    return (
        <Card 
            title={<Space><TrophyOutlined style={{ color: '#ffc53d' }} /> {t('top_spending_customers')}</Space>} // 👈 Dịch
            bordered={false} 
            style={{ 
                borderRadius: 16, 
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)", 
                height: '100%',
            }}
            loading={loading}
        >
            <List
                itemLayout="horizontal"
                dataSource={topCustomers}
                renderItem={(item, index) => {
                    const progressPercent = Math.round((item.totalSpending / maxSpending) * 100);
                    return (
                        <List.Item style={{ padding: '12px 0' }}>
                            {/* ✅ Điều chỉnh Flex để kiểm soát tốt hơn chiều rộng */}
                            <Flex align="center" style={{ width: '100%' }}>
                                {/* 1. RANKING ICON (Width: 30px) */}
                                <div style={{ minWidth: 30, textAlign: 'center' }}>
                                    {index < 3 ? rankIcons[index] : <Typography.Text type="secondary">{index + 1}</Typography.Text>}
                                </div>
                                
                                {/* 2. AVATAR và TÊN (Width: Cố định 160px để tránh bị kéo dãn) */}
                                <List.Item.Meta
                                    avatar={
                                        <Avatar 
                                            src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${item.firstName}`} 
                                            icon={<UserOutlined />}
                                            style={{ backgroundColor: index < 3 ? '#ffc53d33' : '#f5f5f5' }}
                                        />
                                    }
                                    title={<Typography.Text strong ellipsis>{item.firstName} {item.lastName}</Typography.Text>}
                                    description={<Typography.Text type="secondary" style={{ fontSize: 12 }}>{t('total_spent')}</Typography.Text>}
                                  
                                    style={{ width: '160px', minWidth: '160px', paddingRight: '10px' }}
                                />
                                
                        
                                <Flex direction="column" align="flex-end" style={{ flexGrow: 1, minWidth: '100px' }}>
                                    <Typography.Text strong style={{ color: index === 0 ? '#fa8c16' : '#850a0aff', fontSize: 13 }}>
                                        {formatSpending(item.totalSpending, i18n)} {/* 👈 Dùng hàm định dạng i18n */}
                                    </Typography.Text>
                                    <Tooltip title={t('progress_tooltip', { percent: progressPercent })}> {/* 👈 Dịch */}
                                        <Progress 
                                            percent={progressPercent} 
                                            showInfo={false} 
                                            strokeColor={index === 0 ? '#ffc53d' : '#850a0aff'}
                                            size="small"
                                            style={{ width: '100%', marginTop: 2 }}
                                        />
                                    </Tooltip>
                                </Flex>
                            </Flex>
                        </List.Item>
                    );
                }}
            />
        </Card>
    );
}

// =========================================================
// 5. Component Đơn hàng Gần đây (RecentOrdersTable)
// =========================================================
function RecentOrdersTable() {
    const { t, i18n } = useTranslation(); //  Dùng hook dịch
    
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getOrders().then((res) => {
            const items = (res.products || [])
                .slice(0, 4)
                .map((p) => ({ ...p, key: p.id ?? p.title }));
            setDataSource(items);
            setLoading(false);
        });
    }, []);

    const columns = [
        { 
            // 1. Tên sản phẩm: Chiếm 45% (Tăng thêm 5% để chắc chắn)
            title: t("product_name"), // 👈 Dịch
            dataIndex: i18n.language === 'vi' ? "title_vi" : "title", //  Dùng field title_vi nếu là tiếng Việt
            width: '45%', 
            align: 'left',
            render: (text) => <Typography.Text strong>{text}</Typography.Text>,
            // Tối ưu tiêu đề cột (Header)
            onHeaderCell: () => ({ style: { fontSize: 13, padding: '10px 6px' } }), 
        },
        { 
            // 2. Số lượng: Chiếm 15%
            title: t("quantity"), //  Dịch
            dataIndex: "quantity", 
            width: '15%', 
            align: 'center', 
            onHeaderCell: () => ({ style: { fontSize: 13, padding: '10px 6px' } }), 
        },
        {
            // 3. Đơn giá (VNĐ): Chiếm 25%
            title: t("unit_price"), //  Dịch
            dataIndex: "discountedPrice",
            width: '25%', 
            align: 'right', 
            render: (v) => formatCurrencyDisplay(v, i18n), //  Dùng hàm định dạng i18n
            onHeaderCell: () => ({ style: { fontSize: 13, padding: '10px 6px' } }), 
        },
        {
            // 4. Hành động: Chiếm 15% (Đủ cho nút 'Chi tiết')
            title: t("action"), //  Dịch
            width: '15%', 
            align: 'right', 
            render: () => (
                <Tooltip title={t("view_order_details")}> {/*  Dịch */}
                    <Button
                        size="small"
                        type="link"
                        icon={<EyeOutlined />}
                    >
                        {t("details")} {/*  Dịch */}
                    </Button>
                </Tooltip>
            ),
            onHeaderCell: () => ({ style: { fontSize: 13, padding: '10px 6px' } }), 
        },
    ];

    return (
        <Card 
            title={<Space><ShoppingCartOutlined /> {t('recent_orders')}</Space>} //  Dịch
            bordered={false} 
            style={{ 
                borderRadius: 16, 
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)", 
                height: '100%',
               
                overflow: 'hidden' 
            }}
            bodyStyle={{ padding: '0 5px 10px 5px' }} // 
        >
         
            <style>
                {`
                /* Quan trọng: Ngăn tiêu đề cột bị xuống dòng */
                .ant-table-thead > tr > th {
                    white-space: nowrap; 
                    padding: 10px 5px !important; /* Giảm padding tiêu đề */
                }
                /* Giảm padding cho nội dung bảng để tiết kiệm không gian */
                .ant-table-tbody > tr > td {
                    padding: 8px 5px !important; 
                }
                `}
            </style>
            
            <Table
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                size="middle"
                // Tùy chỉnh header cell (Không cần dùng components nếu dùng style tag)
            />
        </Card>
    );
}
// =========================================================
// 6. Component Chính: RevenueReports
// =========================================================

function RevenueReports() {
    const { t, i18n } = useTranslation(); //
    // Định dạng tổng doanh thu với i18n
    const totalRevenueFormatted = formatCurrencyDisplay(mockRevenueData.totalRevenue, i18n);

    // Chuỗi tiêu đề Stat Card (chỉ cần là key)
    const cardTitles = {
        totalRevenue: t("total_revenue"),
        growthRate: t("growth_rate"),
        newCustomers: t("new_customers"),
        topProduct: t("top_product"),
    };
    
    // Lấy tên sản phẩm bán chạy nhất theo ngôn ngữ hiện tại
    const topProductName = i18n.language === 'vi' 
        ? mockRevenueData.products[0].name_vi 
        : mockRevenueData.products[0].name;

    return (
        <Space
            direction="vertical"
            size={24}
            style={{
                width: "100%",
                padding: "24px",
                background: "#f5f7fa",
                borderRadius: "12px",
            }}
        >
            {/* --- HEADER --- */}
            <AntTitle level={3} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <LineChartOutlined style={{ color: '#fff', backgroundColor: 'Green', borderRadius: '50%', padding: 10, fontSize: 24, boxShadow: '0 4px 10px rgba(235, 47, 150, 0.4)' }} />
                <span style={{ fontWeight: 700 }}>{t("total_overview")}</span> {/*  Dịch */}
            </AntTitle>

            {/* --- STATISTIC CARDS--- */}
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title={cardTitles.totalRevenue} //  Dịch
                        value={totalRevenueFormatted} //  Dùng hàm định dạng i18n
                        icon={<DollarOutlined />}
                        color="#00b96b"
                        bg="linear-gradient(135deg, #e6fffb, #b5f5ec)"
                        animationDelay="0.1s" 
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title={cardTitles.growthRate} //  Dịch
                        value={`+${mockRevenueData.growthRate}%`}
                        icon={<LineChartOutlined />}
                        color="#1677ff"
                        bg="linear-gradient(135deg, #f0f5ff, #adc6ff)"
                        growth={mockRevenueData.growthRate}
                        animationDelay="0.2s" 
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title={cardTitles.newCustomers} //  Dịch
                        value={mockRevenueData.newCustomers.toLocaleString(i18n.language)} // Dùng i18n.language
                        icon={<UserAddOutlined />}
                        color="#722ed1"
                        bg="linear-gradient(135deg, #f9f0ff, #d3adf7)"
                        animationDelay="0.3s" 
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title={cardTitles.topProduct} //  Dịch
                        value={topProductName} //  Dùng tên sản phẩm theo ngôn ngữ
                        icon={<FireOutlined />}
                        color="#ff4d4f"
                        bg="linear-gradient(135deg, #fff1f0, #ffa39e)"
                        animationDelay="0.4s" 
                    />
                </Col>
            </Row>

            {/* --- CHARTS & RANKING LIST --- */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Space direction="vertical" size={24} style={{ width: '100%' }}>
                        <MonthlyRevenueChart data={mockRevenueData} />
                        <BestSellingProductsChart data={mockRevenueData} />
                    </Space>
                </Col>
                
                <Col xs={24} lg={8}>
                    <Space direction="vertical" size={24} style={{ width: '100%' }}>
                        <TopCustomersRanking /> 
                        <RecentOrdersTable /> 
                    </Space>
                </Col>
            </Row>
            
        </Space>
    );
}

export default RevenueReports;