import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/swiper-bundle.css";

export default function HeroSection() {
  return (
    <div className="container mx-auto my-5 ">
      <Swiper
        pagination={{
          dynamicBullets: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {[
          "hero3.jpg",
          "hero2.jpg",
          "hero4.jpg",
          "hero5.jpg",
          "hero6.jpg",
          "hero7.jpg",
          "hero8.jpg",
        ].map((image, index) => (
          <SwiperSlide key={index} className="relative">
            <img src={`/${image}`} alt="" className="rounded-lg w-full" />

            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 rounded-lg">
              <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold text-center drop-shadow-lg">
                <span className="text-secondary">Travel</span>, enjoy <br /> and
                live a new <br /> and full life
              </h2>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
