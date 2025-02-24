import React from 'react';
import cls from './services.module.scss';
import CustomButton from '../../shared/ui/сustomButton/CustomButton';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../shared/redux/hooks/hooks';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ForFunc } from '../../entities/others';
import { Autoplay, Mousewheel, Navigation } from 'swiper/modules';
import { useModal, useProfile } from '../../shared/helpers/hooks';
import { useQuery } from '@tanstack/react-query';
import { ProfilesApi } from '../../shared/api/api/queryClient';

const templates = [1, 2, 3, 4, 5, 6, 7, 8];

const Services = () => {
    /** STATES */
    const { loggedIn } = useAppSelector((state) => state.authSlice);
    const { services } = useAppSelector((state) => state.userProfiles);
    const initialSlideIndex = Math.floor((services?.length || 1) / 2);

    const {
        data: dataServices,
        error: errorServices,
        isPending: isPendingServices,
    } = useQuery({
        queryKey: ['services'],
        queryFn: ProfilesApi.getServices,
    });

    /** изменение состояний profileServiceSlice*/
    const updateProfileServiceState = useProfile();

    /** HOOKS */
    const { openModal } = useModal();
    const { t } = useTranslation();

    /** functions*/
    /** для отображения попапа донатов*/
    const openService: ForFunc<number, void> = (id: number) => {
        updateProfileServiceState('isOpen', 'service');
        updateProfileServiceState('chosenFavouritesIdReals', id);
        openModal('modalReals');
    };

    const updateSlideScale = (swiper: any) => {
        swiper.slides.forEach((slide: HTMLElement, index: number) => {
            const distance = Math.abs(index - swiper.activeIndex);
            slide.style.transform = `scale(${1 - distance * 0.2})`;
        });
    };

    React.useEffect(() => {
        if (dataServices?.data.length >= 1) {
            updateProfileServiceState('services', dataServices.data);
        }
    }, [dataServices]);

    return (
        <div className={`${cls.wrapper} ${loggedIn ? cls.loggedIn : cls.without_logged_in}`}>
            <div className={cls.cover_sub_title}>
                <h3 className={cls.title}>{t('Services')}</h3>
            </div>
            <div className={cls.cover}>
                {!isPendingServices && services?.length > 0 && services?.length <= 5 ? (
                    services?.map((item: any) => (
                        <CustomButton
                            key={item.profile_data.id}
                            classNameBtn={cls.block_services}
                            type='button'
                            onClick={() => openService(item?.profile_data?.id)}
                        >
                            <img src='/img/iq_pump.png' alt='logotype' />
                            <h3>{item.profile_data.title}</h3>
                        </CustomButton>
                    ))
                ) : (
                    <Swiper
                        spaceBetween={20}
                        loop={true}
                        centeredSlides={true}
                        freeMode={false} // Отключаем свободное перемещение
                        mousewheel={{ forceToAxis: true, sensitivity: 0.5 }} // Прокрутка колесом мыши
                        touchRatio={1} // Чувствительность касания
                        simulateTouch={true} // Симуляция касания на десктопе
                        threshold={20} // Порог для срабатывания свайпа
                        className={cls.wrapper_slider}
                        watchSlidesProgress={true} // Отслеживание прогресса слайдов
                        modules={[Autoplay, Navigation, Mousewheel]}
                        initialSlide={initialSlideIndex}
                        onSlideChange={updateSlideScale} // Обновление масштаба при смене слайда
                        onSwiper={updateSlideScale} // Обновление масштаба при инициализации
                        breakpoints={{
                            320: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                            },
                            350: {
                                slidesPerView: 3,
                                spaceBetween: 30,
                            },
                            420: {
                                slidesPerView: 5,
                                spaceBetween: 20,
                            },
                        }}
                    >
                        <div className={cls.cover}>
                            {services?.length > 0 &&
                                services?.map((item: any) => (
                                    <SwiperSlide className={cls.slide} key={item.profile_data.id}>
                                        <CustomButton
                                            classNameBtn={cls.block_services}
                                            type='button'
                                            onClick={() => openService(item?.profile_data?.id)}
                                        >
                                            <img src='/img/iq_pump.png' alt='logotype' />
                                            <h3>{item.profile_data.title}</h3>
                                        </CustomButton>
                                    </SwiperSlide>
                                ))}
                        </div>
                    </Swiper>
                )}

                {isPendingServices && (services?.length == 0 || services == null) && (
                    <Swiper
                        spaceBetween={20} // Расстояние между слайдами
                        loop={true} // Бесконечная прокрутка
                        centeredSlides={true} // Центрирование активного слайда
                        freeMode={false} // Отключаем свободное перемещение
                        mousewheel={{ forceToAxis: true, sensitivity: 0.5 }} // Прокрутка колесом мыши
                        touchRatio={1} // Чувствительность касания
                        simulateTouch={true} // Симуляция касания на десктопе
                        threshold={20} // Порог для срабатывания свайпа
                        className={cls.wrapper_slider} // Класс для стилей
                        watchSlidesProgress={true} // Отслеживание прогресса слайдов
                        modules={[Autoplay, Navigation, Mousewheel]} // Модули
                        initialSlide={initialSlideIndex} // Начальный активный слайд
                        onSlideChange={updateSlideScale} // Обновление масштаба при смене слайда
                        onSwiper={updateSlideScale} // Обновление масштаба при инициализации
                        breakpoints={{
                            // Настройки для разных размеров экрана
                            320: {
                                slidesPerView: 3, // На мобильных устройствах показываем 1.2 слайда
                                spaceBetween: 30,
                            },
                            350: {
                                slidesPerView: 3, // На мобильных устройствах показываем 1.2 слайда
                                spaceBetween: 30,
                            },
                            420: {
                                slidesPerView: 5, // На планшетах показываем 3 слайда
                                spaceBetween: 20,
                            },
                        }}
                    >
                        <div className={cls.cover}>
                            {templates?.length > 0 &&
                                templates?.map((item: any) => (
                                    <SwiperSlide className={cls.slide} key={item}>
                                        <div className={cls.skeleton}></div>
                                    </SwiperSlide>
                                ))}
                        </div>
                    </Swiper>
                )}
            </div>
        </div>
    );
};

export default Services;
