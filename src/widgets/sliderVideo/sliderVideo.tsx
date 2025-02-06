import React from 'react';
import cls from './sliderVideo.module.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const videos = [
    { id: 1, src: 'video1.mp4', poster: 'poster1.jpg' },
    { id: 2, src: 'video2.mp4', poster: 'poster2.jpg' },
    { id: 3, src: 'video3.mp4', poster: 'poster3.jpg' },
    // Добавьте другие видео по необходимости
];

const SliderVideo = () => {
    return (
        <div className={cls.overlay}>
            <Swiper
                modules={[Navigation]}
                direction={'vertical'}
                slidesPerView={1}
                spaceBetween={5}
                mousewheel={true}
                pagination={{ clickable: true }}
                style={{ height: '100vh' }}
                autoplay={{delay: 3000, disableOnInteraction: false}} // Автопрокрутка каждые 3 секунды
                className={cls.swiper}
            >
                    {videos.map((video) => (
                        <SwiperSlide key={video.id}>
                            <div className={cls.body}>
                                    <div className={cls.item_video}>
                                        <video
                                            src="/video.mp4"
                                            controls
                                            loop
                                            muted
                                            autoPlay
                                        />
                                    </div>
                            </div>
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div>
    );
};

export default SliderVideo;