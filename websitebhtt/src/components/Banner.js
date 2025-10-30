import React from "react";
import { Carousel } from "antd";
import Banner1 from "../assets/images/banner-4.jpeg";
import Banner2 from "../assets/images/banner-5.jpg";

const Banner = () => {
  return (
    <Carousel autoplay>
      <div>
        <img
          src={Banner1}
          alt="Banner 1"
          style={{ width: "100%", height: "600px", objectFit: "cover", transform: 'translateY(-45px)', }}
        />
      </div>
      <div>
        <img
          src={Banner2}
          alt="Banner 2"
          style={{ width: "100%", height: "600px", objectFit: "cover", transform: 'translateY(-45px)' }}
        />
      </div>
      {/* <div>
        <img
          src={Banner3}
          alt="Banner 3"
          style={{ width: "100%", height: "400px", objectFit: "cover" }}
        />
      </div> */}
    </Carousel>
  );
};
export default Banner;