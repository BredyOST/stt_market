import React from 'react';
import cls from './cartBlock.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCards, Mousewheel, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-cards';
import { CARDS_FOR_SLIDERS_NOT_AUTH_USERS } from '../../shared/const/index.const';
import { ForFunc, ICardsForSliders } from '../../entities/others';

const CartBlock = () => {
    const [activeSlide, setActiveSlide] = React.useState<number>(0);

    /** смена слайда*/
    const handleSlideChange: ForFunc<any, void> = React.useCallback((swiper: any) => {
        setActiveSlide(swiper.activeIndex);
    }, []);

    const activeDescription = CARDS_FOR_SLIDERS_NOT_AUTH_USERS[activeSlide]?.description || CARDS_FOR_SLIDERS_NOT_AUTH_USERS[0].description;

    return (
        <div className={cls.wrapper}>
            <Swiper
                effect={'cards'}
                grabCursor={true}
                modules={[EffectCards, Autoplay, Mousewheel, Navigation]}
                className={cls.swiper}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                cardsEffect={{ slideShadows: false }}
                onSlideChange={handleSlideChange}
                speed={800}
                mousewheel={{ forceToAxis: true, sensitivity: 0.5 }}
                simulateTouch={true}
                touchRatio={1}
                threshold={20}
            >
                {CARDS_FOR_SLIDERS_NOT_AUTH_USERS.map((item: ICardsForSliders, index) => (
                    <SwiperSlide className={cls.cover_block_slider} key={item.id}>
                        <div className={cls.card}>
                            <div className={cls.imgCover}>
                                <img src={item.link} alt={item.title} className={cls.image} />
                            </div>
                            <div className={cls.subTitle}>{item.title}</div>
                        </div>
                        {activeSlide === index && <div className={cls.mlm_text}>{item.description}</div>}
                    </SwiperSlide>
                ))}
            </Swiper>
            {<div className={cls.mlm_text_mobile}>{activeDescription}</div>}
        </div>
    );
};

export default CartBlock;
