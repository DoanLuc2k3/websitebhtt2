// src/components/Categories.js
import React from "react";
import "../style/Categories.css";

const Categories = () => {
  const categories = [
    {
      name: "Điện thoại",
      items: ["iPhone 15", "Samsung S24", "Xiaomi 14", "OPPO Reno 11"],
    },
    {
      name: "Laptop",
      items: ["MacBook Air", "Dell XPS 13", "Asus ROG", "HP Spectre"],
    },
    {
      name: "Máy tính bảng",
      items: ["iPad Pro", "Samsung Tab S9", "Lenovo Tab M10"],
    },
    {
      name: "Phụ kiện",
      items: ["Tai nghe", "Sạc dự phòng", "Cáp sạc", "Ốp lưng"],
    },
    {
      name: "Đồng hồ",
      items: ["Apple Watch", "Samsung Watch 6", "Xiaomi Band 8"],
    },
    {
      name: "Thiết bị âm thanh",
      items: ["Loa Bluetooth", "Tai nghe AirPods", "Soundbar"],
    },
  ];

  return (
    <div className="categories-dropdown">
      {categories.map((cat, index) => (
        <div key={index} className="category-item">
          <div className="category-title">{cat.name}</div>
          <ul className="category-products">
            {cat.items.map((item, i) => (
              <li key={i} className="category-product">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Categories;
