import {
    AppstoreOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    TeamOutlined,
    TagOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DARK_BACKGROUND = "#001529";

function SideMenu() {
    const { t } = useTranslation();
    const location = useLocation();
    const [selectedKeys, setSelectedKeys] = useState("/admin");
    const navigate = useNavigate();

    useEffect(() => {
        const pathName = location.pathname.startsWith('/admin/help')
            ? '/admin/help'
            : location.pathname;
        setSelectedKeys(pathName);
    }, [location.pathname]);

    return (
        <div
            className="SideMenu"
            style={{
                background: DARK_BACKGROUND,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: 220,
            }}
        >
            <style>
                {`
                .ant-menu.SideMenuVertical {
                    padding: 0 0 8px 0;
                }
                .ant-menu.SideMenuVertical .ant-menu-item:first-child {
                    margin-top: 0 !important;
                }

                /* 🔥 Loại bỏ triệt để đường line xanh dương */
                .ant-menu-dark .ant-menu-item-selected::after,
                .ant-menu-dark .ant-menu-item::after,
                .ant-menu-item-selected::after,
                .ant-menu-item::after {
                    display: none !important;
                    border: none !important;
                    box-shadow: none !important;
                    background: none !important;
                }

                /* Xóa border-bottom hoặc hiệu ứng active mặc định */
                .ant-menu-dark .ant-menu-item-selected,
                .ant-menu-item-selected {
                    border-bottom: none !important;
                    box-shadow: none !important;
                }

                /* Giữ lại nền xanh đậm cho mục được chọn */
                .ant-menu-dark .ant-menu-item-selected {
                    background-color: #1c28acff !important;
                    border-radius: 0 !important;
                }

                /* Màu chữ & icon khi được chọn */
                .ant-menu-dark .ant-menu-item-selected .ant-menu-title-content,
                .ant-menu-dark .ant-menu-item-selected .anticon {
                    color: white !important;
                }

                /* Hiệu ứng hover */
                .ant-menu-dark .ant-menu-item:not(.ant-menu-item-selected):hover {
                    background-color: rgba(255, 255, 255, 0.1) !important;
                }
                .ant-menu-dark .ant-menu-item:not(.ant-menu-item-selected):hover .ant-menu-title-content,
                .ant-menu-dark .ant-menu-item:not(.ant-menu-item-selected):hover .anticon {
                    color: #fff !important;
                }

                .ant-menu-dark .ant-menu-item .ant-menu-title-content {
                    position: relative;
                    z-index: 10;
                }
                `}
            </style>

            <Menu
                className="SideMenuVertical"
                theme="dark"
                style={{
                    background: "transparent",
                    borderRight: 0,
                    flexGrow: 1,
                }}
                mode="vertical"
                onClick={(item) => {
                    navigate(item.key);
                }}
                selectedKeys={[selectedKeys]}
                items={[
                    {
                        label: t("overview") || "Tổng quan",
                        icon: <AppstoreOutlined style={{ color: "green" }} />,
                        key: "/admin",
                    },
                    {
                        label: t("inventory") || "Quản lý kho",
                        key: "/admin/inventory",
                        icon: <ShopOutlined style={{ color: "#fa8c16" }} />,
                    },
                    {
                        label: t("orders") || "Đơn hàng",
                        key: "/admin/orders",
                        icon: <ShoppingCartOutlined style={{ color: "red" }} />,
                    },
                    {
                        label: t("staffs") || "Nhân viên",
                        key: "/admin/staffs",
                        icon: <TeamOutlined style={{ color: "Teal" }} />,
                    },
                    {
                        label: t("customers") || "Khách hàng",
                        key: "/admin/customers",
                        icon: <UserOutlined style={{ color: "#f7bc0cff" }} />,
                    },
                    {
                        label: t("marketing") || "Marketing & Khuyến mãi",
                        key: "/admin/promotion",
                        icon: <TagOutlined style={{ color: "Maroon" }} />,
                    },
                  {
    label: t("help") || "Hỗ trợ",
    key: "/admin/help",
    icon: <span style={{ fontSize: '18px' }}>🔥</span>, // Thay thế icon cũ bằng emoji
    style: { marginTop: "auto" },
},
                ]}
            />
        </div>
    );
}

export default SideMenu;
