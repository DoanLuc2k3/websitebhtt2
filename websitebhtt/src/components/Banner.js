import React from "react";
import { Carousel } from "antd";
import Banner1 from "../assets/images/banner-4.jpeg";
import Banner2 from "../assets/images/banner-5.jpg";
import "../style/Banner.css"; // <--- 1. IMPORT FILE CSS MỚI

const Banner = () => {
  return (
    <Carousel autoplay>
      <div>
        {/* 2. Thay thế style bằng className */}
        <img
          src={Banner1}
          alt="Banner 1"
          className="banner-slide-img" 
        />
      </div>
      <div>
        {/* 2. Thay thế style bằng className */}
        <img
          src={Banner2}
          alt="Banner 2"
          className="banner-slide-img"
        />
      </div>
      {/* <div>
        <img
          src={Banner3}
          alt="Banner 3"
          className="banner-slide-img" // Nếu bạn dùng ảnh này, cũng đổi sang className
        />
      </div> */}
    </Carousel>
  );
};
export default Banner;