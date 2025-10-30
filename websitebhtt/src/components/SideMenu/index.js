import {
    AppstoreOutlined,
    QuestionCircleOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    UserOutlined,
    TeamOutlined,
    TagOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; //  IMPORT useTranslation


const DARK_BACKGROUND = "#001529";

function SideMenu() {
    //  SỬ DỤNG HOOK DỊCH
    const { t } = useTranslation();
    
    const location = useLocation();
    const [selectedKeys, setSelectedKeys] = useState("/");
    
    useEffect(() => {
        const pathName = location.pathname;
        setSelectedKeys(pathName);
    }, [location.pathname]);

    const navigate = useNavigate();

    return (
        <div
            className="SideMenu" 
            style={{
                background: DARK_BACKGROUND,
                
                display: "flex",
                flexDirection: "column",
          
            }}
        >
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
                //  DỊCH CÁC NHÃN MENU
                items={[
                    {
                        label: t("overview"),
                        icon: <AppstoreOutlined style={{color: "green"}}/>,
                        key: "/",
                    },
                    {
                        label: t("inventory"),
                        key: "/inventory",
                        icon: <ShopOutlined style={{ color: "#fa8c16" }} />, 
                    },
                    {
                        label: t("orders"),
                        key: "/orders",
                        icon: <ShoppingCartOutlined style={{color: "red"}}/>,
                    },
                    {
                        label: t("staffs"),
                        key: "/staffs",
                        icon: <TeamOutlined style={{ color: "Teal" }} />,
                    },
                    {
                        label: t("customers"),
                        key: "/customers",
                        icon: <UserOutlined style={{color : "#f7bc0cff"}}/>,
                    },
                    {
                        label: t("marketing"),
                        key: "/promotion",
                        icon: <TagOutlined style={{color : "Maroon"}}/>,
                    },
                    {
                        label: t("help"),
                        key: "/help",
                        icon: <QuestionCircleOutlined style={{color: "blue"}}/>,
                        style: { marginTop: 'auto' } 
                    },
                ]}
            />
        </div>
    );
}
export default SideMenu;