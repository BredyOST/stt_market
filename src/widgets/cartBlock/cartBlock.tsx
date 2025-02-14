import React  from 'react';
import cls from './cartBlock.module.scss';

import { Swiper, SwiperSlide } from 'swiper/react';
// import {EffectCards} from "swiper/types/modules";
import {Autoplay, EffectCards} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-cards';

const arrayCart = [
    { id: 1, title: "MLM 1" },
    { id: 2, title: "MLM 2" },
    { id: 3, title: "MLM 3" },
    { id: 4, title: "MLM 4" },
];

const CartBlock = () => {
    const [activeSlide, setActiveSlide] = React.useState(0);

    /**для смены карточке*/
    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % arrayCart.length);
        }, 3000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);


    return (
        <>
            <div className={cls.wrapper}>
                <Swiper
                    effect={'cards'}
                    grabCursor={true}
                    modules={[EffectCards, Autoplay]}
                    className={cls.swiper}
                    autoplay={{delay: 3000, disableOnInteraction: true}}
                    cardsEffect={{slideShadows: false}}
                >
                    {arrayCart.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className={cls.card}>
                                <div className={cls.imgCover}>
                                    <img
                                        src="/img/cart.jpg"
                                        alt="картинка"
                                        className={cls.image}
                                    />
                                </div>
                                <div className={cls.subTitle}>{item.title}</div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </>
    );
};

export default CartBlock;
