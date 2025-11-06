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
                    background-color: transparent !important;
                    border-radius: 0 !important;
                }

                /* Màu chữ & icon khi được chọn */
                .ant-menu-dark .ant-menu-item-selected .ant-menu-title-content,
                .ant-menu-dark .ant-menu-item-selected .anticon {
                    color: white !important;
                }

                /* Hiệu ứng hover */
                .ant-menu-dark .ant-menu-item:not(.ant-menu-item-selected):hover {
                    background: linear-gradient(135deg, #f51010ff 0%, #764ba2 100%) !important;
                }
                .ant-menu-dark .ant-menu-item:not(.ant-menu-item-selected):hover .ant-menu-title-content,
                .ant-menu-dark .ant-menu-item:not(.ant-menu-item-selected):hover .anticon {
                    color: #fff !important;
                }

                .ant-menu-dark .ant-menu-item .ant-menu-title-content {
                    position: relative;
                    z-index: 10;
                }

                /* Reset background when hovering */
                .ant-menu-dark .ant-menu-item {
                    background-color: transparent !important;
                    transition: background 0.3s ease;
                }

                /* ===== HOVER EFFECT: ICON ZOOM & CENTER & TEXT HIDDEN ===== */
                .menu-item-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                    position: relative;
                }

                .menu-icon-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 24px;
                    transition: transform 0.3s ease, margin-left 0.3s ease;
                }

                .menu-text {
                    flex: 1;
                    transition: opacity 0.3s ease, max-width 0.3s ease;
                    white-space: nowrap;
                    max-width: 100%;
                }

                .menu-item-wrapper:hover .menu-icon-wrapper {
                    transform: scale(1.6);
                    margin-left: calc(50% - 12px);
                    transition: transform 0.3s ease, margin-left 0.3s ease;
                }

                .menu-item-wrapper:hover .menu-text {
                    opacity: 0;
                    max-width: 0;
                    transition: opacity 0.3s ease, max-width 0.3s ease;
                }
                /* ===== END HOVER EFFECT ===== */
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
                        label: (
                            <div className="menu-item-wrapper">
                                <div className="menu-icon-wrapper">
                                    <AppstoreOutlined style={{ color: "green" }} />
                                </div>
                                <span className="menu-text">{t("overview") || "Tổng quan"}</span>
                            </div>
                        ),
                        icon: null,
                        key: "/admin",
                    },
                    {
                        label: (
                            <div className="menu-item-wrapper">
                                <div className="menu-icon-wrapper">
                                    <ShopOutlined style={{ color: "#fa8c16" }} />
                                </div>
                                <span className="menu-text">{t("inventory") || "Quản lý kho"}</span>
                            </div>
                        ),
                        icon: null,
                        key: "/admin/inventory",
                    },
                    {
                        label: (
                            <div className="menu-item-wrapper">
                                <div className="menu-icon-wrapper">
                                    <ShoppingCartOutlined style={{ color: "red" }} />
                                </div>
                                <span className="menu-text">{t("orders") || "Đơn hàng"}</span>
                            </div>
                        ),
                        icon: null,
                        key: "/admin/orders",
                    },
                    {
                        label: (
                            <div className="menu-item-wrapper">
                                <div className="menu-icon-wrapper">
                                    <TeamOutlined style={{ color: "Teal" }} />
                                </div>
                                <span className="menu-text">{t("staffs") || "Nhân viên"}</span>
                            </div>
                        ),
                        icon: null,
                        key: "/admin/staffs",
                    },
                    {
                        label: (
                            <div className="menu-item-wrapper">
                                <div className="menu-icon-wrapper">
                                    <UserOutlined style={{ color: "#f7bc0cff" }} />
                                </div>
                                <span className="menu-text">{t("customers") || "Khách hàng"}</span>
                            </div>
                        ),
                        icon: null,
                        key: "/admin/customers",
                    },
                    {
                        label: (
                            <div className="menu-item-wrapper">
                                <div className="menu-icon-wrapper">
                                    <TagOutlined style={{ color: "Maroon" }} />
                                </div>
                                <span className="menu-text">{t("marketing") || "Marketing & Khuyến mãi"}</span>
                            </div>
                        ),
                        icon: null,
                        key: "/admin/promotion",
                    },
                    {
                        label: (
                            <div className="menu-item-wrapper">
                                <div className="menu-icon-wrapper">
                                    <span style={{ fontSize: '18px' }}>🔥</span>
                                </div>
                                <span className="menu-text">{t("help") || "Hỗ trợ"}</span>
                            </div>
                        ),
                        icon: null,
                        key: "/admin/help",
                        style: { marginTop: "auto" },
                    },
                ]}
            />
        </div>
    );
}

export default SideMenu;