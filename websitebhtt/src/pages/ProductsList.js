import React, { useState, useEffect } from "react";
import { Row, Col, Card, Typography, Spin, Carousel, Button, Rate } from "antd";
import "../style/ProductList.css";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Title } = Typography;
const { Meta } = Card;

function ProductList() {
  const navigate = useNavigate();

  const goToDetail = (product) => {
    navigate(`/product/${product.id}`, { state: product });
  };
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Thời gian flash sale
  const [timeLeft, setTimeLeft] = useState(3600); // 1 giờ = 3600s

  useEffect(() => {
    // Fetch sản phẩm
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });

    // Countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Chuyển giây -> hh:mm:ss
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  if (loading)
    return (
      <Spin
        tip="Loading..."
        style={{ display: "block", margin: "50px auto" }}
      />
    );

  return (
    <div className="product-list-container">
      <div className="flash-sale-banner">
        <Title className="flash-sale-title" level={2}>
          Flash Sale
        </Title>
        <div className="flash-sale-timer">
          {formatTime(timeLeft)
            .split(":")
            .map((t, i) => (
              <div key={i}>{t}</div>
            ))}
        </div>

        <Row gutter={10} justify="center" className="flash-sale-row">
          <Col flex="1" span={8}>
            <img
              src="https://cdn.hstatic.net/files/1000003969/file/img_2197_c22e8ec7f8624198b610bfdd4c36654c.jpeg"
              alt="Deal Sốc"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Col>
          <Col flex="1" span={8}>
            <img
              src="https://cdn.hstatic.net/files/1000003969/file/img_2198_9bed97b1dffd4949b7c6803fcf6e5e99.jpeg"
              alt="Deal Sốc"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Col>
          <Col flex="1" span={8}>
            <img
              src="https://cdn.hstatic.net/files/1000003969/file/img_2199_aeb9ad30d0cf4d2c8cf765cca6798035.jpeg"
              alt="Deal Sốc"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Col>
        </Row>
      </div>
      <div className="flash-sale-products" style={{ marginTop: 20 }}>
        <Carousel
          dots={false}
          slidesToShow={5}
          slidesToScroll={1}
          autoplay
          autoplaySpeed={1500}
        >
          {products
            .filter((p) => p.price < 50)
            .map((product) => {
              const shortDesc =
                product.description.length > 50
                  ? product.description.slice(0, 50) + "..."
                  : product.description;

              return (
                <div key={product.id} className="flash-sale-card-wrapper">
                  {/* Nhãn Flash Sale */}
                  <div className="flash-sale-label">FLASH SALE</div>

                  <Card
                    hoverable
                    cover={<img src={product.thumbnail} alt={product.title} />}
                    className="product-card"
                    onClick={() => goToDetail(product)} // <-- thêm onClick
                  >
                    <Meta title={product.title} />

                    <div style={{ marginTop: 4, textAlign: "left" }}>
                      <div
                        style={{ fontSize: 14, color: "#555", marginBottom: 4 }}
                      >
                        {shortDesc}
                      </div>
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "#1677ff",
                          marginBottom: 4,
                        }}
                      >
                        ${product.price}
                      </div>
                      <div>
                        <Rate
                          disabled
                          defaultValue={Math.round(product.rating)}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: 10,
                        display: "flex",
                        justifyContent: "center",
                        gap: 10,
                      }}
                    >
                      <Button type="primary">Mua ngay</Button>
                      <Button
                        type="default"
                        icon={<ShoppingCartOutlined />}
                      ></Button>
                    </div>
                  </Card>
                </div>
              );
            })}
        </Carousel>
      </div>
      <div
        className="all-product-title"
        onClick={() => setShowAll(true)}
        style={{ cursor: "pointer" }}
      >
        XEM TẤT CẢ
      </div>

      {/* Danh sách sản phẩm */}
      {showAll && (
        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
          {products.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                cover={<img src={product.thumbnail} alt={product.title} />}
                className="product-card"
                onClick={() => goToDetail(product)}
              >
                <Meta
                  title={product.title}
                  description={
                    <div className="product-card-meta">
                      <div className="product-price">${product.price}</div>
                      <div
                        className="product-description"
                        title={product.description}
                      >
                        {product.description.length > 30
                          ? product.description.slice(0, 30) + "..."
                          : product.description}
                      </div>
                      <div className="product-rating">
                        <Rate
                          disabled
                          defaultValue={Math.round(product.rating)}
                        />
                      </div>
                    </div>
                  }
                />

                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <Button type="primary">Mua ngay</Button>
                  <Button
                    type="default"
                    icon={<ShoppingCartOutlined />}
                  ></Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default ProductList;

// import React, { useState, useEffect, useRef } from "react";

// import {
//   Row,
//   Col,
//   Typography,
//   Card,
//   Button,
//   Empty,
//   Pagination,
//   Input,
//   Select,
//   Rate,
//   Carousel,
//   Dropdown,
// } from "antd";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   LeftOutlined,
//   RightOutlined,
//   DownOutlined,
//   FilterOutlined,
//   HeartOutlined,
// } from "@ant-design/icons";

// const { Title, Text } = Typography;
// const { Option } = Select;

// const products = [
//   {
//     id: 1,
//     name: "iPhone 15",
//     description: "Premium smartphone",
//     price: "25,000,000₫",
//     rating: 5,
//     image:
//       "https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg",
//   },
//   {
//     id: 2,
//     name: "Dell XPS 13 Laptop",
//     description: "Slim and lightweight laptop",
//     price: "30,000,000₫",
//     rating: 4,
//     image:
//       "https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg",
//   },
//   {
//     id: 3,
//     name: "AirPods Pro",
//     description: "Wireless earphones",
//     price: "6,000,000₫",
//     rating: 3,
//     image:
//       "https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg",
//   },
//   {
//     id: 4,
//     name: "Jeans Jacket",
//     description: "Trendy outerwear",
//     price: "850,000₫",
//     rating: 4,
//     image:
//       "https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg",
//   },
//   {
//     id: 5,
//     name: "Wireless Mouse",
//     description: "Versatile mouse",
//     price: "350,000₫",
//     rating: 2,
//     image:
//       "https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg",
//   },
//   {
//     id: 6,
//     name: "Bluetooth Speaker",
//     description: "Vivid sound experience",
//     price: "1,200,000₫",
//     rating: 4,
//     image:
//       "https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg",
//   },
//   {
//     id: 7,
//     name: "RGB Mechanical Keyboard",
//     description: "Perfect typing experience",
//     price: "2,000,000₫",
//     rating: 5,
//     image:
//       "https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg",
//   },
//   {
//     id: 8,
//     name: "RGB Mechanical Keyboard",
//     description: "Perfect typing experience",
//     price: "2,000,000₫",
//     rating: 5,
//     image:
//       "https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg",
//   },
//   {
//     id: 9,
//     name: "RGB Mechanical Keyboard",
//     description: "Perfect typing experience",
//     price: "2,000,000₫",
//     rating: 5,
//     image:
//       "https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg",
//   },
//   {
//     id: 10,
//     name: "RGB Mechanical Keyboard",
//     description: "Perfect typing experience",
//     price: "2,000,000₫",
//     rating: 5,
//     image:
//       "https://lados.vn/wp-content/uploads/2024/09/z4963812344350_f8f0f67dff98e701aa1ccefb3fa339f1.jpg",
//   },
// ];

// const categoryItems = [
//   { key: "1", label: "Phones" },
//   { key: "2", label: "Laptops" },
//   { key: "3", label: "Tablets" },
//   { key: "4", label: "Accessories" },
//   { key: "5", label: "Watches" },
// ];

// const hotDeals = products.slice(0, 6);

// const ProductsList = () => {

//   const navigate = useNavigate();

//   const goToDetail = (product) => {
//     navigate(`/product/${product.id}`, { state: product });
//   };
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const q = params.get("q") ? params.get("q").toLowerCase() : "";

//   const [search, setSearch] = useState("");
//   const [priceFilter, setPriceFilter] = useState(null);
//   const [starFilter, setStarFilter] = useState(0);

//   const [page, setPage] = useState(1);
//   const pageSize = 8;

//   useEffect(() => {
//     setPage(1);
//   }, [q, search, priceFilter, starFilter]);

//   const parsePrice = (priceStr) =>
//     parseInt(priceStr.replace(/[₫,.]/g, ""), 10) || 0;

//   const filtered = products.filter((p) => {
//     const matchSearch =
//       p.name.toLowerCase().includes(search.toLowerCase()) ||
//       p.description.toLowerCase().includes(search.toLowerCase());

//     const priceValue = parsePrice(p.price);
//     const matchPrice =
//       !priceFilter ||
//       (priceFilter === "1" && priceValue < 1000000) ||
//       (priceFilter === "2" &&
//         priceValue >= 1000000 &&
//         priceValue <= 10000000) ||
//       (priceFilter === "3" && priceValue > 10000000);

//     const matchStar = starFilter === 0 || p.rating === starFilter;

//     return matchSearch && matchPrice && matchStar;
//   });

//   const start = (page - 1) * pageSize;
//   const paged = filtered.slice(start, start + pageSize);

//   const carouselRef = useRef(null);
//   const next = () => carouselRef.current.next();
//   const prev = () => carouselRef.current.prev();

//   // ✅ Filter Dropdown Content
//   const filterContent = (
//     <Card className="filter-card">
//       <div style={{ padding: 12, width: 250 }}>
//         <Input.Search
//           placeholder="Search by name..."
//           allowClear
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           style={{ marginBottom: 8 }}
//         />
//         <Select
//           placeholder="Filter by price"
//           style={{ width: "100%", marginBottom: 8 }}
//           value={priceFilter}
//           onChange={(val) => setPriceFilter(val)}
//           allowClear
//         >
//           <Option value="1">Under 1 million</Option>
//           <Option value="2">1 - 10 million</Option>
//           <Option value="3">Over 10 million</Option>
//         </Select>
//         <div style={{ textAlign: "center" }}>
//           <Rate value={starFilter} onChange={setStarFilter} />
//           <div>Select rating</div>
//         </div>
//       </div>
//     </Card>
//   );

//   return (
//     <div className="page-content">
//       <div className="products-container">
//         <Title className="product-list-title" level={1}>
//           PRODUCT LIST
//         </Title>

//         {/* 👉 Category + Filter Buttons */}
//         <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
//           <Dropdown
//             menu={{ items: categoryItems }}
//             trigger={["click"]}
//             placement="bottom"
//             arrow
//           >
//             <Button>
//               Categories <DownOutlined />
//             </Button>
//           </Dropdown>

//           <Dropdown
//             dropdownRender={() => filterContent}
//             trigger={["click"]}
//             placement="bottom"
//             arrow
//           >
//             <Button icon={<FilterOutlined />}>Filter</Button>
//           </Dropdown>
//         </div>

//         {filtered.length === 0 ? (
//           <Empty description="No products found" />
//         ) : (
//           <>
//             <Row gutter={[16, 16]} justify="center">
//               {paged.map((product) => (
//                 <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
//                   <Card
//                     hoverable
//                     onClick={() => goToDetail(product)}
//                     cover={
//                       <div style={{ position: "relative" }}>
//                         <img alt={product.name} src={product.image} />
//                         <HeartOutlined
//                           style={{
//                             position: "absolute",
//                             top: 8,
//                             right: 8,
//                             fontSize: 20,
//                             color: "#ff4d4f",
//                             background: "#fff",
//                             borderRadius: "50%",
//                             padding: 6,
//                             cursor: "pointer",
//                           }}
//                         />
//                       </div>
//                     }
//                     actions={[
//                       <Button
//                         type="primary"
//                         size="small"
//                         style={{
//                           width: "90%",
//                           margin: "0 auto",
//                           borderRadius: 6,
//                         }}
//                       >
//                         Add to Cart
//                       </Button>,
//                     ]}
//                     bodyStyle={{ padding: "12px 16px" }} // giảm padding để khoảng cách gọn hơn
//                   >
//                     <Card.Meta
//                       title={
//                         <div style={{ fontSize: 16, fontWeight: 600 }}>
//                           {product.name}
//                         </div>
//                       }
//                       description={
//                         <>
//                           <Text style={{ display: "block", marginBottom: 4 }}>
//                             {product.description}
//                           </Text>
//                           <Text
//                             strong
//                             style={{ color: "#1677ff", marginBottom: 4 }}
//                           >
//                             {product.price}
//                           </Text>
//                           <div>
//                             <Rate disabled defaultValue={product.rating} />
//                           </div>
//                         </>
//                       }
//                     />
//                   </Card>
//                 </Col>
//               ))}
//             </Row>

//             <div className="products-pagination" style={{ marginTop: 24 }}>
//               <Pagination
//                 current={page}
//                 pageSize={pageSize}
//                 total={filtered.length}
//                 onChange={(p) => setPage(p)}
//                 showSizeChanger={false}
//               />
//             </div>

//             {/* 🔥 HOT DEAL Carousel */}
//             <div
//               className="hot-deal-section"
//               style={{ marginTop: 50, position: "relative" }}
//             >
//               <Title
//                 className="hot-deal-title"
//                 level={1}
//                 style={{ textAlign: "center", marginBottom: 30 }}
//               >
//                 🔥 HOT DEALS !!
//               </Title>

//               <Button
//                 type="text"
//                 shape="circle"
//                 icon={<LeftOutlined />}
//                 onClick={prev}
//                 style={{
//                   position: "absolute",
//                   left: 0,
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   zIndex: 1,
//                   fontSize: 20,
//                 }}
//               />

//               <Carousel
//                 ref={carouselRef}
//                 dots={false}
//                 slidesToShow={4}
//                 slidesToScroll={1}
//                 autoplay
//                 autoplaySpeed={3000}
//               >
//                 {hotDeals.map((product) => (
//                   <div key={product.id} style={{ padding: "0 24px" }}>
//                     <Card
//                       hoverable
//                       cover={<img alt={product.name} src={product.image} />}
//                       actions={[
//                         <Button type="primary" block danger>
//                           Buy Now
//                         </Button>,
//                       ]}
//                       style={{
//                         textAlign: "center",
//                         border: "1px solid #f00",
//                         margin: "0 12px",
//                       }}
//                     >
//                       <Card.Meta
//                         title={product.name}
//                         description={
//                           <>
//                             <Text style={{ display: "block", marginBottom: 8 }}>
//                               {product.description}
//                             </Text>
//                             <Text strong>{product.price}</Text>
//                           </>
//                         }
//                       />
//                     </Card>
//                   </div>
//                 ))}
//               </Carousel>

//               <Button
//                 type="text"
//                 shape="circle"
//                 icon={<RightOutlined />}
//                 onClick={next}
//                 style={{
//                   position: "absolute",
//                   right: 0,
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                   zIndex: 1,
//                   fontSize: 20,
//                 }}
//               />
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductsList;
