import React from 'react';
import cls from './favotites.module.scss';
import CustomButton from "../../shared/ui/сustomButton/CustomButton";
import {useTranslation} from "react-i18next";
import {useAppDispatch, useAppSelector} from "../../shared/redux/hooks/hooks";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

import {IModalWindowStatesSchema} from "../../shared/redux/slices/modalWindowStatesSlice/modalWindowStatesSchema";
import {modalAddProfileActions} from "../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice";
import {ForFunc} from "../../entities/others";
import {authActions} from "../../shared/redux/slices/authSlice/authSlice";
import { Autoplay, Mousewheel, Navigation} from 'swiper/modules';

export const profilesFavourite = [
    {
        profile_data: {
            id:1,
            activity_hobbies: "Gaming, Traveling",
            adress: "123 Example Street, Example City",
            coordinates: [
                37.7749,
                -122.4194
            ],
            hashtags: `#gaming #traveling`,
            is_incognito: false,
            name: "John Doe",
            url: "https://example.com",
            wallet_number: "0x123456789ABCDEF"
        },
        image_data: '/test.jpg',
        video_data: '1.mp4',
    },
    {
        profile_data: {
            id:2,
            activity_hobbies: "Gaming, Traveling",
            adress: "123 Example Street, Example City",
            coordinates: [
                37.7749,
                -122.4194
            ],
            hashtags: `#gaming #traveling`,
            is_incognito: false,
            name: "John Doe",
            url: "https://example.com",
            wallet_number: "0x123456789ABCDEF"
        },
        image_data: '/test.jpg',
        video_data: '2.mp4',
    },
    {
        profile_data: {
            id:3,
            activity_hobbies: "Gaming, Traveling",
            adress: "123 Example Street, Example City",
            coordinates: [
                37.7749,
                -122.4194
            ],
            hashtags: `#gaming #traveling`,
            is_incognito: false,
            name: "John Doe",
            url: "https://example.com",
            wallet_number: "0x123456789ABCDEF"
        },
        image_data: '/test.jpg',
        video_data: '3.mp4',
    },
    {
        profile_data: {
            id:4,
            activity_hobbies: "Gaming, Traveling",
            adress: "123 Example Street, Example City",
            coordinates: [
                37.7749,
                -122.4194
            ],
            hashtags: `#gaming #traveling`,
            is_incognito: false,
            name: "John Doe",
            url: "https://example.com",
            wallet_number: "0x123456789ABCDEF"
        },
        image_data: '/test.jpg',
        video_data: '4.mp4',
    },
    {
        profile_data: {
            id:5,
            activity_hobbies: "Gaming, Traveling",
            adress: "123 Example Street, Example City",
            coordinates: [
                37.7749,
                -122.4194
            ],
            hashtags: `#gaming #traveling`,
            is_incognito: false,
            name: "John Doe",
            url: "https://example.com",
            wallet_number: "0x123456789ABCDEF"
        },
        image_data: '/test.jpg',
        video_data: '5.mp4',
    },
    {
        profile_data: {
            id:6,
            activity_hobbies: "Gaming, Traveling",
            adress: "123 Example Street, Example City",
            coordinates: [
                37.7749,
                -122.4194
            ],
            hashtags: `#gaming #traveling`,
            is_incognito: false,
            name: "John Doe",
            url: "https://example.com",
            wallet_number: "0x123456789ABCDEF"
        },
        image_data: '/test.jpg',
        video_data: '6.mp4',
    },
    {
        profile_data: {
            id:7,
            activity_hobbies: "Gaming, Traveling",
            adress: "123 Example Street, Example City",
            coordinates: [
                37.7749,
                -122.4194
            ],
            hashtags: `#gaming #traveling`,
            is_incognito: false,
            name: "John Doe",
            url: "https://example.com",
            wallet_number: "0x123456789ABCDEF"
        },
        image_data: '/test.jpg',
        video_data: '7.mp4',
    },
    {
        profile_data: {
            id:8,
            activity_hobbies: "Gaming, Traveling",
            adress: "123 Example Street, Example City",
            coordinates: [
                37.7749,
                -122.4194
            ],
            hashtags: `#gaming #traveling`,
            is_incognito: false,
            name: "John Doe",
            url: "https://example.com",
            wallet_number: "0x123456789ABCDEF"
        },
        image_data: '/test.jpg',
        video_data: '8.mp4',
    },
    {
        profile_data: {
            id:9,
            activity_hobbies: "Gaming, Traveling",
            adress: "123 Example Street, Example City",
            coordinates: [
                37.7749,
                -122.4194
            ],
            hashtags: `#gaming #traveling`,
            is_incognito: false,
            name: "John Doe",
            url: "https://example.com",
            wallet_number: "0x123456789ABCDEF"
        },
        image_data: '/test.jpg',
        video_data: '11.mp4',
    },
    {
        profile_data: {
            id:10,
            activity_hobbies: "Gaming, Traveling",
            adress: "123 Example Street, Example City",
            coordinates: [
                37.7749,
                -122.4194
            ],
            hashtags: `#gaming #traveling`,
            is_incognito: false,
            name: "John Doe",
            url: "https://example.com",
            wallet_number: "0x123456789ABCDEF"
        },
        image_data: '/test.jpg',
        video_data: '22.mp4',
    },
    {
        profile_data: {
            id:11,
            activity_hobbies: "Gaming, Traveling",
            adress: "123 Example Street, Example City",
            coordinates: [
                37.7749,
                -122.4194
            ],
            hashtags: `#gaming #traveling`,
            is_incognito: false,
            name: "John Doe",
            url: "https://example.com",
            wallet_number: "0x123456789ABCDEF"
        },
        image_data: '/test.jpg',
        video_data: '33.mp4',
    },
]


const Favorites = () => {

    const dispatch = useAppDispatch()

    /** states */
    const { loggedIn } = useAppSelector(state => state.authSlice)

    /** actions*/
    const {openModal } = modalAddProfileActions
    const {addChosenFavouritesIdReals} = authActions

    /** functions*/
    /** для отображения попапа донатов*/
    const openVideo:ForFunc<number, void> = (id:number) => {
        dispatch(addChosenFavouritesIdReals(id))
        const modalReals:string = 'modalReals'
        dispatch(openModal({modalName: modalReals as keyof IModalWindowStatesSchema}))
    }

    const {t} = useTranslation()


    const swiperRef = React.useRef<any | null>(null);

    return (
        <div className={`${cls.wrapper} ${loggedIn ? cls.loggedIn : cls.without_logged_in}`}>
            <div className={cls.cover_sub_title}>
                <h3 className={cls.title}>
                    {loggedIn
                        ? t('favorites')
                        : t('GetSttToken')
                    }
                </h3>
            </div>
            <div className={cls.cover}>
                {profilesFavourite?.length > 0 && profilesFavourite?.length <= 5
                    ? profilesFavourite?.map((item: any) => (
                            <CustomButton key={item?.id} classNameBtn={cls.profile_logo} type='button' onClick={() => openVideo(item?.profile_data?.id)}>
                                <img src={item?.image_data} alt="логотип"/>
                            </CustomButton>
                    ))

                    : <Swiper
                    slidesPerView= {'auto'}
                    spaceBetween={20}
                    loop={true}
                    centeredSlides={true}
                    freeMode={false}
                    mousewheel={{ forceToAxis: true, sensitivity: 0.5 }}
                    touchRatio={1}
                    simulateTouch={true}
                    threshold={20}
                    className={cls.wrapper_slider}
                    // autoplay={{delay: 3000, disableOnInteraction: false}}
                    watchSlidesProgress={true} // Следим за прогрессом
                    modules={[Autoplay, Navigation, Mousewheel]}
                    initialSlide={Math.floor((profilesFavourite?.length || 1) / 2)} // Устанавливаем активный слайд в центр
                    // loopAdditionalSlides={profilesFavourite?.length || 5} // Создаём доп. копии слайдов
                    onSlideChange={(swiper) => {
                        // Логика для изменения масштаба слайдов
                        swiper.slides.forEach((slide, index) => {
                            const distance = Math.abs(index - swiper.activeIndex);
                            const scale = 1 - (distance * 0.2); // Уменьшение масштаба на 20% для каждого следующего слайда
                            (slide as HTMLElement).style.transform = `scale(${scale})`;
                        });
                    }}
                    onSwiper={(swiper) => {
                        // Инициализация масштаба слайдов при загрузке
                        swiper.slides.forEach((slide, index) => {
                            const distance = Math.abs(index - swiper.activeIndex);
                            const scale = 1 - (distance * 0.2);
                            (slide as HTMLElement).style.transform = `scale(${scale})`;
                        });
                    }}
                >
                    <div className={cls.cover}>
                        {profilesFavourite?.length > 0 &&
                            profilesFavourite?.map((item: any) => (
                                <SwiperSlide className={cls.slide} key={item.profile_data.id}>
                                    <CustomButton  classNameBtn={cls.profile_logo} type='button' onClick={() => openVideo(item?.profile_data?.id)}>
                                        <img src={item?.image_data} alt="логотип"/>
                                    </CustomButton>
                                </SwiperSlide>
                            ))
                        }
                    </div>
                </Swiper>
                }
            </div>

        </div>
    );
};

export default Favorites;