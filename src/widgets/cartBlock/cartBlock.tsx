import React  from 'react';
import cls from './cartBlock.module.scss';

import { Swiper, SwiperSlide } from 'swiper/react';
// import {EffectCards} from "swiper/types/modules";
import {Autoplay, EffectCards} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-cards';
import {authActions} from "../../shared/redux/slices/authSlice/authSlice";

export const arrayCart = [
    { id: 1, title: 'AI-agents', description: "настройте своего AI-агента и для динамичного продвижения аккаунта", link:`/img/id_1_card.jpg` },
    { id: 2, title: 'Airdrops', description: "получай токены в подарок, участвуйте в эйрдропах", link:`/img/id_2_card.jpg` },
    { id: 3, title: 'Art', description: "покажите свое творчество огромной аудитории", link:`/img/id_3_card.jpg` },
    { id: 4, title: 'MLM', description: "стройте свои mlm  компании с  автономными мега-структурами на блокчейне", link:`/img/id_4_card.jpg` },
    { id: 5, title: 'Donations', description: "Автоматизируйте получение донатов", link:`/img/id_5_card.jpg` },
    { id: 6, title: 'Lifestyle', description: "Играйте в  увлекательные смарт-игры и получайте токены", link:`/img/id_6_card.jpg` },
    { id: 7, title: 'Games', description: "Находи новых друзей и заводи знакомства", link:`/img/id_7_card.jpg` },
    { id: 8, title: 'Friends', description: "Находи новых друзей и заводи знакомства", link:`/img/id_8_card.jpg` },
];

const CartBlock = () => {
    const [activeSlide, setActiveSlide] = React.useState(0);

    const {} = authActions;

    return (
        <>
        <div className={cls.wrapper}>
            <Swiper
                effect={'cards'}
                grabCursor={true}
                modules={[EffectCards, Autoplay]}
                className={cls.swiper}
                autoplay={{delay: 3000, disableOnInteraction: false}}
                cardsEffect={{slideShadows: false}}
                onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
                speed={800} // Увеличьте скорость анимации (по умолчанию 300)
            >
                {arrayCart.map((item, index) => (
                        <SwiperSlide className={cls.cover_block_slider} key={item.id}>
                            <div className={cls.card}>
                                <div className={cls.imgCover}>
                                    <img
                                        src={item.link}
                                        alt="картинка"
                                        className={cls.image}
                                    />
                                </div>
                                <div className={cls.subTitle}>{item.title}</div>
                            </div>
                            {activeSlide === index && (
                                <div className={cls.mlm_text}>
                                    {item.description}
                                </div>)}
                        </SwiperSlide>
                ))}
            </Swiper>
            {arrayCart.find((item) => item.id === activeSlide + 1) &&
                <div className={cls.mlm_text_mobile}>
                    {arrayCart.find((item) => item.id === activeSlide + 1)?.description || arrayCart[0].description}
                </div>}
        </div>
        </>
    )
        ;
};

export default CartBlock;
