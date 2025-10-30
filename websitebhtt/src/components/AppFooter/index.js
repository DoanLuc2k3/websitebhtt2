import { Typography, Space } from "antd";
import {
    ShopOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import React from "react";
import { useTranslation } from "react-i18next"; 

function AppFooter() {
    const { t } = useTranslation(); // Dùng hook dịch

    const FooterItem = ({ href, icon, text, color, bgColor, isBrand }) => (
        <Typography.Link
            href={href}
            target="_blank"
            style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 12px", 
                borderRadius: 10,
                backgroundColor: bgColor,
                transition: "all 0.3s ease",
                textDecoration: "none",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)", 
                flexShrink: 0,
                // Hiệu ứng hover nhẹ nhàng
                '&:hover': {
                    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    transform: 'translateY(-1px)',
                }
            }}
        >
            <span
                style={{
                    color: color,
                    fontSize: "16px",
                    marginRight: "6px",
                    fontWeight: 600,
                }}
            >
                {icon}
            </span>
            <Typography.Text
                style={{
                    color: isBrand ? color : "#333",
                    fontWeight: isBrand ? 700 : 500,
                    fontSize: "14px",
                }}
            >
                {text}
            </Typography.Text>
        </Typography.Link>
    );

    return (
        <div
            className="AppFooter"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Inter, sans-serif",
                
                // ---  GLASSMORPHISM & SHADOW CHO TOÀN BỘ FOOTER ---
                background: "rgba(255, 255, 255, 0.75)", 
                backdropFilter: 'blur(10px)', 
                boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.05)", 
                
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000, 
                padding: "2px 24px", 
            }}
        >
            
            <Space size="large"> {/* Tăng khoảng cách giữa các item */}
                <FooterItem
                    href="https://www.google.com"
                    icon={<ShopOutlined />}
                    text={t("footer_brand_name")} // 
                    bgColor="#e6f4ff"
                    isBrand={true}
                />
                <FooterItem
                    href="tel:+123456789"
                    icon={<PhoneOutlined />}
                    text={t("footer_phone_number")} // 
                    color="#00b96b"
                    bgColor="#e6fffb"
                />
                <FooterItem
                    href="https://www.google.com/maps"
                    icon={<EnvironmentOutlined />}
                    text={t("footer_address")} // 👈Dịch
                    color="#fa8c16"
                    bgColor="#fff7e6"
                />
            </Space>

            <div
                style={{
                    position: "absolute",
                    left: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    zIndex: 1001,
                }}
            >
                <Typography.Text strong style={{ color: "#52c41a" }}>
                    <CheckCircleOutlined />
                </Typography.Text>
                <Typography.Text strong style={{ color: "#555" }}>
                    {t("footer_system_status")} {/* 👈 Dịch */}
                </Typography.Text>
            </div>
        </div>
    );
}

export default AppFooter;