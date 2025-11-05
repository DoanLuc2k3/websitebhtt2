import { Layout, Divider } from "antd";
import {} from "@ant-design/icons";

import ProductsList from "./ProductsList";

import QaA from "./QaA/QaA";

const { Content } = Layout;


const Home = () => {
  
  return (
    <Layout>
      <Content className="page-content" style={{ padding: "24px 0px" }}>
        {/* Danh sách sản phẩm */}
        <ProductsList />
        <Divider />

        <QaA />
      </Content>
    </Layout>
  );
};

export default Home;
