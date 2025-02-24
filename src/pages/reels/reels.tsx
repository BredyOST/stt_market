import React from 'react';
import CustomInput from '../../shared/ui/customInput/customInput';
import { ReactComponent as SvgQr } from '../../assets/svg/qr.svg';
import cls from './reels.module.scss';
import { ReactComponent as SvgLoadMore } from './../../assets/svg/loading.svg';
import CustomButton from '../../shared/ui/сustomButton/CustomButton';
import VideoCard from '../../feautures/videoCard/videoCard';
import { ForFunc } from '../../entities/others';
import { useAppSelector } from '../../shared/redux/hooks/hooks';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useModal, useProfile } from '../../shared/helpers/hooks';
import { ProfileInfoType } from '../../shared/redux/slices/profiles/profilesSchema';
import Portal from '../../shared/ui/portal/portal';
import QRScanner from '../../widgets/QRScanner/QRScanner';
import Modal from '../../shared/ui/modal/modal';
import { Autoplay, Mousewheel, Navigation } from 'swiper/modules';
import { useQuery } from '@tanstack/react-query';
import { ProfilesApi } from '../../shared/api/api/queryClient';
import { ethers } from 'ethers';

export const profilesFavourite: ProfileInfoType[] = [
    {
        profile_data: {
            id: 1,
            activity_hobbies: 'Playing competitive games, exploring new cultures through travel',
            adress: '123 Example Street, Example City',
            coordinates: [{ id: 1, value: [37.7749, -122.4194] }],
            hashtags: '#gaming #traveling #esports #wanderlust',
            is_incognito: false,
            name: 'John Doe',
            url: 'https://example.com',
            wallet_number: '0x123456789ABCDEF',
        },
        image_data: '/test.jpg',
        video_data: '1.mp4',
    },
    {
        profile_data: {
            id: 2,
            activity_hobbies: 'Streaming games, backpacking across Europe',
            adress: '123 Example Street, Example City',
            coordinates: [{ id: 1, value: [37.7749, -122.4194] }],
            hashtags: '#gaming #traveling #streamer #adventure',
            is_incognito: false,
            name: 'John Doe',
            url: 'https://example.com',
            wallet_number: '0x123456789ABCDEF',
        },
        image_data: '/test2.svg',
        video_data: '2.mp4',
    },
    {
        profile_data: {
            id: 3,
            activity_hobbies: 'Competitive gaming, hiking in the mountains',
            adress: '123 Example Street, Example City',
            coordinates: [{ id: 1, value: [37.7749, -122.4194] }],
            hashtags: '#gaming #traveling #hiking #naturelover',
            is_incognito: false,
            name: 'John Doe',
            url: 'https://example.com',
            wallet_number: '0x123456789ABCDEF',
        },
        image_data: '/test3.svg',
        video_data: '3.mp4',
    },
    {
        profile_data: {
            id: 4,
            activity_hobbies: 'Exploring indie games, traveling to historical sites',
            adress: '123 Example Street, Example City',
            coordinates: [{ id: 1, value: [37.7749, -122.4194] }],
            hashtags: '#gaming #traveling #indiegames #history',
            is_incognito: false,
            name: 'John Doe',
            url: 'https://example.com',
            wallet_number: '0x123456789ABCDEF',
        },
        image_data: '/test.jpg',
        video_data: '4.mp4',
    },
    {
        profile_data: {
            id: 5,
            activity_hobbies: 'Speedrunning games, road tripping across the USA',
            adress: '123 Example Street, Example City',
            coordinates: [{ id: 1, value: [37.7749, -122.4194] }],
            hashtags: '#gaming #traveling #speedrun #roadtrip',
            is_incognito: false,
            name: 'John Doe',
            url: 'https://example.com',
            wallet_number: '0x123456789ABCDEF',
        },
        image_data: '/test.jpg',
        video_data: '5.mp4',
    },
    {
        profile_data: {
            id: 6,
            activity_hobbies: 'Speedrunning games, road tripping across the USA',
            adress: '123 Example Street, Example City',
            coordinates: [{ id: 1, value: [37.7749, -122.4194] }],
            hashtags: '#gaming #traveling #speedrun #roadtrip',
            is_incognito: false,
            name: 'John Doe',
            url: 'https://example.com',
            wallet_number: '0x123456789ABCDEF',
        },
        image_data: '/test.jpg',
        video_data: '6.mp4',
    },
    {
        profile_data: {
            id: 7,
            activity_hobbies: 'Competitive FPS gaming, traveling to music festivals',
            adress: '123 Example Street, Example City',
            coordinates: [{ id: 1, value: [37.7749, -122.4194] }],
            hashtags: '#gaming #traveling #fps #musicfestival',
            is_incognito: false,
            name: 'John Doe',
            url: 'https://example.com',
            wallet_number: '0x123456789ABCDEF',
        },
        image_data: '/test.jpg',
        video_data: '7.mp4',
    },
    {
        profile_data: {
            id: 8,
            activity_hobbies: 'Building gaming PCs, traveling to tech conferences',
            adress: '123 Example Street, Example City',
            coordinates: [{ id: 1, value: [37.7749, -122.4194] }],
            hashtags: '#gaming #traveling #pcbuild #techlife',
            is_incognito: false,
            name: 'John Doe',
            url: 'https://example.com',
            wallet_number: '0x123456789ABCDEF',
        },
        image_data: '/test.jpg',
        video_data: '8.mp4',
    },
];
const templates = [1, 2, 3, 4, 5, 6, 7, 8];

const Reels = () => {
    /** states */
    const [currentIndex, setCurrentIndex] = React.useState<number>(1);
    const [visibleReels, setVisibleReels] = React.useState<any[]>([]);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isLoadingSearch, setIsLoadingSearch] = React.useState<boolean>(false);
    const [searchLine, setSearchLine] = React.useState('');
    const [windowWidth, setWindowWidth] = React.useState<null | number>(null);
    const [counterSlides, setCounterSlides] = React.useState<number>(7);
    const { modalQrScan, isClosingModalQrScan } = useAppSelector((state) => state.modalWindow);
    const { profilesForShowing, services } = useAppSelector((state) => state.userProfiles);
    const [filteredReals, setFilteredReals] = React.useState<ProfileInfoType[] | null>(null);
    const { finishedQrScannerSendTokens, erc20FromQrForSearch } = useAppSelector((state) => state.userProfiles);

    const {
        data: dataProfiles,
        error: errorProfiles,
        isPending: isPendingProfiles,
        isFetching: isFetchingProfiles,
    } = useQuery({
        queryKey: ['profiles'],
        queryFn: (meta) => ProfilesApi.getProfiles(meta),
    });

    /** управление модальными окнами*/
    const { openModal } = useModal();
    /** изменение состояний profileServiceSlice*/
    const updateProfileServiceState = useProfile();

    /** FUNCTIONS*/
    const openQrScanner: ForFunc<void, void> = () => {
        if (finishedQrScannerSendTokens) {
            updateProfileServiceState('finishedQrScannerSendTokens', false);
        }
        updateProfileServiceState('finishedQrScannerReals', true);
        openModal('modalQrScan');
    };

    /** Функция для получения рандомных Reels */
    const getRandomReels = (count: number, excludeIds: number[] = []) => {
        const usedIds = new Set(excludeIds);
        return profilesForShowing
            .filter((profile) => !usedIds.has(profile.profile_data.id)) // Проверяем ID профиля
            .sort(() => Math.random() - 0.5)
            .slice(0, count);
    };

    /** поисковый запрос*/
    const addSearchLineValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchLine(e.target.value);
    };

    /** Функция для загрузки новых 5 рилсов */
    const showMoreReals: ForFunc<void, void> = () => {
        setIsLoading(true);
        setIsAnimating(true);

        let nextIndex = currentIndex + counterSlides;
        if (nextIndex >= profilesForShowing.length) {
            // Если все рилсы уже показаны, начинаем заново
            nextIndex = 0;
        }
        setCurrentIndex(nextIndex);
    };

    const updateSlidesCount = () => {
        const width = window.innerWidth;

        setCounterSlides(width >= 1079 ? 7 : 5);
        if (width > 900) setWindowWidth(width);
    };

    /** Обновляем отображаемые Reels при изменении currentIndex */
    /** убрать profilesAndServices когда разелим сервисы от рислсов и заменить на profilesForShowing*/
    const updateProfiles = () => {
        if (profilesForShowing?.length >= 1) {
            let nextIndex = currentIndex + counterSlides;
            let newReels = [];

            if (nextIndex < profilesForShowing.length) {
                // Достаточно рилсов — берём подряд
                newReels = profilesForShowing.slice(currentIndex, nextIndex);
            } else {
                // Осталось меньше рилсов — добираем рандомно, но строго до counterSlides
                const remaining = profilesForShowing.slice(currentIndex);
                const neededCount = Math.max(0, counterSlides - remaining.length);
                const alreadyAddedIds = newReels.map((r) => r.profile_data.id); // Получаем ID уже добавленных профилей
                const randomReels = getRandomReels(neededCount, [...remaining.map((r) => r.profile_data.id), ...alreadyAddedIds]);

                newReels = [...remaining, ...randomReels].slice(0, counterSlides);
            }

            setVisibleReels(newReels);

            setTimeout(() => {
                setIsLoading(false);
                setIsAnimating(false);
            }, 1000);
        }
    };

    React.useEffect(() => {
        updateProfiles();
    }, [currentIndex, counterSlides, profilesForShowing, services]);

    React.useEffect(() => {
        window.addEventListener('resize', updateSlidesCount);
        updateSlidesCount();
        return () => window.removeEventListener('resize', updateSlidesCount);
    }, []);

    const checkERC20 = async (searchParam) => {
        setIsLoadingSearch(true);

        let result = null;

        if (searchLine.trim()) {
            setIsLoadingSearch(true);
        }

        if (searchLine.length > 10 && profilesForShowing?.length >= 1) {
            const res = await ethers.isAddress(searchParam);

            if (res) {
                result = profilesForShowing.filter((item) => item.profile_data.wallet_number == searchLine);
                setFilteredReals(result);
            } else {
                result = profilesForShowing.filter((item) => item.profile_data.hashtags.toLowerCase().includes(searchLine));
                setFilteredReals(result);
            }
        } else {
            result = profilesForShowing?.filter((item) => item.profile_data.hashtags.toLowerCase().includes(searchLine));
            setFilteredReals(result);
        }
    };

    React.useEffect(() => {
        if (profilesForShowing?.length >= 1) {
            checkERC20(searchLine);
        }
    }, [searchLine]);

    /** обновляем состояние поиска после того как нашли рилсы или поиск не дал результата*/
    React.useEffect(() => {
        setTimeout(() => {
            setIsLoadingSearch(false);
        }, 1000);
    }, [filteredReals]);

    React.useEffect(() => {
        if (dataProfiles?.data?.length >= 1) {
            updateProfileServiceState('profilesForShowing', dataProfiles?.data);
        }
    }, [dataProfiles]);

    React.useEffect(() => {
        if (erc20FromQrForSearch?.length) {
            setSearchLine(erc20FromQrForSearch);
        }
    }, [erc20FromQrForSearch]);

    return (
        <div className={cls.wrapper}>
            <div className={cls.search_block}>
                <CustomInput
                    onChange={addSearchLineValue}
                    classNameWrapper={cls.wrapper_input_search}
                    classNameInput={cls.input_search}
                    type='text'
                    placeholder='search'
                    value={searchLine}
                />
                <CustomButton classNameBtn={cls.btn_qr} type='button' onClick={openQrScanner}>
                    <SvgQr className={cls.svg_qr} />
                </CustomButton>
            </div>

            <div className={cls.cover_list_slides}>
                <Swiper
                    slidesPerView={'auto'}
                    centeredSlides={true}
                    mousewheel={{ forceToAxis: true, sensitivity: 0.5 }} // Прокрутка колесом мыши
                    touchRatio={1}
                    simulateTouch={true}
                    threshold={20}
                    spaceBetween={20}
                    className='mySwiper'
                    loop={true}
                    modules={[Navigation, Mousewheel]}
                >
                    {visibleReels?.length >= 1 &&
                        visibleReels?.map((item: any) => (
                            <SwiperSlide key={item?.profile_data?.id} style={{ width: 'fit-content' }}>
                                <VideoCard
                                    classNameWrap={cls.video_card_tablet}
                                    classNameCover={cls.videomain_tablet}
                                    videoUrl={item?.video_data}
                                    posterUrl={'./../../assets/default-poster.jpg'}
                                    muted={true}
                                    controls={false}
                                    startPointerEnter={true}
                                    autoPlay={false}
                                    userId={item?.profile_data?.id}
                                />
                            </SwiperSlide>
                        ))}
                </Swiper>
            </div>

            {visibleReels?.length >= 1 && !isPendingProfiles && !filteredReals && searchLine?.length == 0 && (
                <div className={cls.cover_reals_block}>
                    <div className={cls.creator_video}>
                        <VideoCard
                            classNameWrap={cls.video_card_main}
                            classNameCover={cls.video}
                            videoUrl={profilesForShowing[0]?.video_data}
                            posterUrl={''}
                            muted={true}
                            controls={false}
                            startPointerEnter={true}
                            autoPlay={false}
                            userId={0}
                        />
                    </div>
                    <div className={cls.reals_block}>
                        <div className={`${windowWidth >= 1079 ? cls.video_container_big : cls.video_container}`}>
                            {visibleReels?.length >= 1 &&
                                visibleReels?.map((item: any, index) => (
                                    <VideoCard
                                        classNameWrap={cls.video_card}
                                        classNameCover={cls.videomain}
                                        key={item?.profile_data?.id}
                                        videoUrl={item?.video_data}
                                        posterUrl={'./../../assets/video.mp4'}
                                        muted={true}
                                        controls={false}
                                        startPointerEnter={true}
                                        autoPlay={false}
                                        userId={item?.profile_data?.id}
                                    />
                                ))}
                            {visibleReels.length > 5 && (
                                <CustomButton
                                    classnameWrapper={cls.btn_load_wrap}
                                    classNameBtn={cls.btn_load_more}
                                    type='button'
                                    onClick={showMoreReals}
                                >
                                    <SvgLoadMore className={`${cls.svg_load_more} ${isLoading && cls.load}`} />
                                </CustomButton>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isPendingProfiles && visibleReels?.length < 1 && (
                <div className={cls.cover_reals_block}>
                    <div className={cls.creator_video}>
                        <div className={cls.main_block}></div>
                    </div>
                    <div className={cls.reals_block}>
                        <div className={`${windowWidth >= 1079 ? cls.video_container_big : cls.video_container}`}>
                            {templates
                                ?.slice(0, counterSlides)
                                .map((item: number) => <div key={item} className={cls.main_block_min}></div>)}
                            {templates?.length > 5 && (
                                <CustomButton
                                    classnameWrapper={cls.btn_load_wrap}
                                    classNameBtn={cls.btn_load_more}
                                    type='button'
                                    onClick={showMoreReals}
                                >
                                    <SvgLoadMore className={`${cls.svg_load_more} ${isLoading && cls.load}`} />
                                </CustomButton>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isPendingProfiles && visibleReels?.length < 1 && (
                <div className={cls.cover_list_slides}>
                    <Swiper
                        slidesPerView={'auto'}
                        centeredSlides={true}
                        mousewheel={{ forceToAxis: true, sensitivity: 0.5 }} // Прокрутка колесом мыши
                        touchRatio={1} // Чувствительность касания
                        simulateTouch={true} // Симуляция касания на десктопе
                        threshold={20} // Порог для срабатывания свайпа
                        spaceBetween={20}
                        className='mySwiper'
                        loop={true}
                        modules={[Autoplay, Navigation, Mousewheel]} // Модули
                    >
                        {templates?.length >= 1 &&
                            templates?.map((item: any) => (
                                <SwiperSlide key={item} style={{ width: 'fit-content' }}>
                                    <div className={cls.skeleton_slider}></div>
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </div>
            )}

            {isLoadingSearch && (filteredReals === null || filteredReals.length === 0) && (
                <div className={cls.cover_list_slides_filtered}>
                    <Swiper
                        slidesPerView={'auto'}
                        centeredSlides={true}
                        freeMode={false}
                        mousewheel={{ forceToAxis: true, sensitivity: 0.5 }}
                        touchRatio={1}
                        simulateTouch={true}
                        threshold={20}
                        spaceBetween={20}
                        className='mySwiper'
                        loop={true}
                        modules={[Autoplay, Navigation, Mousewheel]}
                    >
                        {templates?.length >= 1 &&
                            templates?.map((item: any) => (
                                <SwiperSlide key={item} style={{ width: 'fit-content' }}>
                                    <div className={cls.skeleton_slider}></div>
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </div>
            )}

            {filteredReals?.length > 0 && (
                <div className={cls.cover_list_slides_filtered}>
                    <Swiper
                        slidesPerView={'auto'}
                        centeredSlides={false}
                        mousewheel={{ forceToAxis: true, sensitivity: 0.5 }}
                        touchRatio={1}
                        simulateTouch={true}
                        threshold={20}
                        spaceBetween={20}
                        className='mySwiper'
                        loop={true}
                        modules={[Autoplay, Navigation, Mousewheel]} // Модули
                    >
                        {filteredReals?.length >= 1 &&
                            filteredReals?.map((item: any) => (
                                <SwiperSlide key={item?.profile_data?.id} style={{ width: 'fit-content' }}>
                                    <VideoCard
                                        classNameWrap={cls.video_card_tablet}
                                        classNameCover={cls.videomain_tablet}
                                        videoUrl={item?.video_data}
                                        posterUrl={'./../../assets/default-poster.jpg'}
                                        muted={true}
                                        controls={false}
                                        startPointerEnter={true}
                                        autoPlay={false}
                                        userId={item?.profile_data?.id}
                                    />
                                </SwiperSlide>
                            ))}
                    </Swiper>
                </div>
            )}

            {searchLine?.length > 0 && filteredReals?.length === 0 && !isLoadingSearch && (
                <div className={cls.cover_no_results}>
                    <div className={cls.no_results}>Поиск не дал результатов</div>
                </div>
            )}

            <Portal whereToAdd={document.body}>
                <Modal show={modalQrScan} closing={isClosingModalQrScan}>
                    <QRScanner />
                </Modal>
            </Portal>
        </div>
    );
};

export default Reels;
