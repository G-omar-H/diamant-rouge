import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import Image from "next/image";

/* ✅ Import Swiper CSS */
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";

type HeroSlide = {
    imageSrc: string;
    heading: string;
    subheading?: string;
};

type HeroCarouselProps = {
    slides: HeroSlide[];
};

export default function HeroCarousel({ slides }: HeroCarouselProps) {
    return (
        <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="relative w-full h-screen"
        >
            {slides.map((slide, i) => (
                <SwiperSlide key={i}>
                    <div className="relative w-full h-full">
                        {/* ✅ Burgundy Tint Overlay instead of black */}
                        <div className="absolute inset-0 bg-burgundy/40"></div>

                        <Image
                            src={slide.imageSrc}
                            alt={slide.heading}
                            layout="fill"
                            objectFit="cover"
                            className="z-0"
                        />

                        {/* ✅ Luxury Text Centered */}
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-10 px-6">
                            <h2 className="text-6xl font-serif text-brandGold drop-shadow-lg">
                                {slide.heading}
                            </h2>

                            {slide.subheading && (
                                <p className="text-2xl text-platinumGray mt-4 max-w-3xl drop-shadow-lg">
                                    {slide.subheading}
                                </p>
                            )}
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}