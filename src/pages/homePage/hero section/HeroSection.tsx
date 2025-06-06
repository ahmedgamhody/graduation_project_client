import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { useState } from "react";
import { Search } from "lucide-react";

import "swiper/swiper-bundle.css";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const nav = useNavigate();
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // You can add navigation logic here later
      nav(`/search-places/${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className=" mx-auto mb-3 ">
      <Swiper
        pagination={{
          type: "fraction",
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper h-[60vh] md:h-[70vh]"
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
          <SwiperSlide key={index} className="relative h-full">
            <img
              src={`/${image}`}
              alt=""
              className="rounded-lg w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 rounded-lg">
              <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold text-center drop-shadow-lg">
                <span className="text-secondary">Travel</span>, enjoy <br /> and
                live a new <br /> and full life
              </h2>{" "}
              <div className="mt-8 w-full max-w-2xl px-4 md:px-8 lg:px-16">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex flex-row gap-2"
                >
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for places, find it here..."
                      className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 shadow-lg"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  <button
                    type="submit"
                    className=" bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-lg font-medium flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Search
                  </button>
                </form>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
