import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import 'swiper/css/navigation'; // Import navigation styles
import { FreeMode, Thumbs, Autoplay, Navigation } from 'swiper/modules'; // Import Navigation
import { useVehicleStore } from '../../store/useVehicleStore';

export default function CustomerGallery({ vehicleId, isThumb = true }) { // Added isThumb prop with default value true
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [selectedImgs, setSelectedImgs] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const { fetchOneVehicleData } = useVehicleStore();

    useEffect(() => {
        const fetchVehicleImages = async () => {
            try {
                const vehicleData = await fetchOneVehicleData(vehicleId);
                if (vehicleData && vehicleData.vehicleImagesId) {
                    const images = [
                        vehicleData.vehicleImagesId.VehicleFrontPic,
                        vehicleData.vehicleImagesId.VehicleBackPic,
                        vehicleData.vehicleImagesId.VehicleSide1Pic,
                        vehicleData.vehicleImagesId.VehicleSide2Pic,
                    ];
                    setSelectedImgs(images);
                }
            } catch (error) {
                console.error('Error fetching vehicle images:', error);
            }
        };

        if (vehicleId) {
            fetchVehicleImages();
        }
    }, [vehicleId, fetchOneVehicleData]);

    return (
        <>
            <Swiper
                style={{ '--swiper-pagination-color': '#fff' }}
                loop={true}
                spaceBetween={10}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                thumbs={{ swiper: thumbsSwiper }} // Use the thumbs swiper here
                modules={[FreeMode, Thumbs, Autoplay, Navigation]} // Include Navigation here
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                className="mySwiper2 w-full h-[300px] sm:h-[400px] md:h-[500px] border-4 border-black"
            >
                {selectedImgs.length > 0 ? (
                    selectedImgs.map((imgUrl, index) => (
                        <SwiperSlide key={index}>
                            <img src={imgUrl} alt={`Vehicle ${index + 1}`} className="w-full h-full object-cover" />
                        </SwiperSlide>
                    ))
                ) : (
                    <SwiperSlide>
                        <img src="/avatar.png" alt="Placeholder Vehicle" className="w-full h-full object-cover" />
                    </SwiperSlide>
                )}
            </Swiper>

            {/* Only render the thumbnails swiper if isThumb is true */}
            {isThumb && (
                <Swiper
                    onSwiper={setThumbsSwiper}
                    loop={true}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]} // Navigation still needed here
                    className="mySwiper w-full h-[80px] sm:h-[100px] md:h-[120px]"
                >
                    {selectedImgs.length > 0 ? (
                        selectedImgs.map((imgUrl, index) => (
                            <SwiperSlide key={index}>
                                <div className={`rounded-lg transition-all duration-300 ${activeIndex === index ? 'outline outline-4 outline-blue-500' : 'outline outline-4 outline-gray-400'}`}></div>
                                <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                            </SwiperSlide>
                        ))
                    ) : (
                        <SwiperSlide>
                            <img src="/avatar.png" alt="Placeholder Thumbnail" className="w-full h-full object-cover rounded-md" />
                        </SwiperSlide>
                    )}
                </Swiper>
            )}
        </>
    );
}
