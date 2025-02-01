import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import { useState } from "react";

const VehicleImageSlider = ({ selectedImgs }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.activeIndex);
        if (thumbsSwiper) {
            thumbsSwiper.slideTo(swiper.activeIndex);
        }
    };

    return (
        <div className="relative w-full max-w-full z-0">
            {selectedImgs.length === 4 ? (
                <>
                    {/* Main Image Slider */}
                    <Swiper
                        modules={[Autoplay, Thumbs]}
                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                        spaceBetween={10}
                        slidesPerView={1}
                        className="w-full h-48 sm:h-56 relative z-10"
                        thumbs={{ swiper: thumbsSwiper }}
                        onSlideChange={handleSlideChange} // Handle slide change
                    >
                        {selectedImgs.map((imgUrl, index) => (
                            <SwiperSlide key={index} className="flex items-center justify-center">
                                <img
                                    src={imgUrl}
                                    alt={`Vehicle ${index + 1}`}
                                    className="w-full h-full object-fill border-4 border-black"
                                    sizes="(max-width: 480px) 100vw, (max-width: 640px) 100vw"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Thumbnail Slider */}
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={10}
                        slidesPerView={4}
                        watchSlidesProgress
                        className="mt-2 w-full h-16 relative z-5"
                    >
                        {selectedImgs.map((imgUrl, index) => (
                            <SwiperSlide key={index} className="cursor-pointer">
                                <div
                                    className={`w-full h-full  rounded-xl ${activeIndex === index
                                        ? "border-4 border-blue-500"
                                        : "border border-gray-400"
                                        }`}
                                >
                                    <img
                                        src={imgUrl}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </>
            ) : (
                <img
                    src="/avatar.png"
                    alt="Vehicle"
                    className="w-full h-full object-fill border-4 border-black shadow-lg rounded-lg transition-all duration-500 ease-in-out"
                />
            )}
        </div>
    );
};

export default VehicleImageSlider;
