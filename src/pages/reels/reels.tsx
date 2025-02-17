import React from 'react';
import CustomInput from "../../shared/ui/customInput/customInput";
import {ReactComponent as SvgQr} from '../../assets/svg/qr.svg'
import cls from './reels.module.scss'
import {ReactComponent as SvgLoadMore} from "./../../assets/svg/loading.svg";
import CustomButton from "../../shared/ui/сustomButton/CustomButton";
import VideoCard from "../../feautures/videoCard/videoCard";
import {ForFunc} from "../../entities/others";
import {useAppDispatch, useAppSelector} from "../../shared/redux/hooks/hooks";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Tabs from "../../shared/ui/tabs/tabs";
import {tabOption} from "../../shared/const/index.const";
import { authActions } from '../../shared/redux/slices/authSlice/authSlice';
import IqPumpService from "../../widgets/iqPumpService/iqPumpService";
import IqPumpMainWindow from "../../widgets/iqPumpService/iqPumpMainWindow";
import {web3ProvidersMapUpdated} from "web3";
import {useDispatch} from "react-redux";

export const profiles = [
    {
        profile_data: {
            id: 1,
            activity_hobbies: "Playing competitive games, exploring new cultures through travel",
            adress: "123 Example Street, Example City",
            coordinates: [37.7749, -122.4194],
            hashtags: "#gaming #traveling #esports #wanderlust",
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
            id: 2,
            activity_hobbies: "Streaming games, backpacking across Europe",
            adress: "123 Example Street, Example City",
            coordinates: [37.7749, -122.4194],
            hashtags: "#gaming #traveling #streamer #adventure",
            is_incognito: false,
            name: "John Doe",
            url: "https://example.com",
            wallet_number: "0x123456789ABCDEF"
        },
        image_data: '/test2.svg',
        video_data: '2.mp4',
    },
    {
        profile_data: {
            id: 3,
            activity_hobbies: "Competitive gaming, hiking in the mountains",
            adress: "123 Example Street, Example City",
            coordinates: [37.7749, -122.4194],
            hashtags: "#gaming #traveling #hiking #naturelover",
            is_incognito: false,
            name: "John Doe",
            url: "https://example.com",
            wallet_number: "0x123456789ABCDEF"
        },
        image_data: '/test3.svg',
        video_data: '3.mp4',
    },
    {
        profile_data: {
            id: 4,
            activity_hobbies: "Exploring indie games, traveling to historical sites",
            adress: "123 Example Street, Example City",
            coordinates: [37.7749, -122.4194],
            hashtags: "#gaming #traveling #indiegames #history",
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
            id: 5,
            activity_hobbies: "Speedrunning games, road tripping across the USA",
            adress: "123 Example Street, Example City",
            coordinates: [37.7749, -122.4194],
            hashtags: "#gaming #traveling #speedrun #roadtrip",
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
            id: 6,
            activity_hobbies: "Speedrunning games, road tripping across the USA",
            adress: "123 Example Street, Example City",
            coordinates: [37.7749, -122.4194],
            hashtags: "#gaming #traveling #speedrun #roadtrip",
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
            id: 7,
            activity_hobbies: "Competitive FPS gaming, traveling to music festivals",
            adress: "123 Example Street, Example City",
            coordinates: [37.7749, -122.4194],
            hashtags: "#gaming #traveling #fps #musicfestival",
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
            id: 8,
            activity_hobbies: "Building gaming PCs, traveling to tech conferences",
            adress: "123 Example Street, Example City",
            coordinates: [37.7749, -122.4194],
            hashtags: "#gaming #traveling #pcbuild #techlife",
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
            id: 9,
            activity_hobbies: "Playing strategy games, exploring ancient ruins",
            adress: "123 Example Street, Example City",
            coordinates: [37.7749, -122.4194],
            hashtags: "#gaming #traveling #strategygames #history",
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
            id: 10,
            activity_hobbies: "Streaming retro games, traveling to vintage car shows",
            adress: "123 Example Street, Example City",
            coordinates: [37.7749, -122.4194],
            hashtags: "#gaming #traveling #retrogaming #vintagecars",
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
            id: 11,
            activity_hobbies: "Exploring culinary games, traveling for food tours",
            adress: "123 Example Street, Example City",
            coordinates: [37.7749, -122.4194],
            hashtags: "#gaming #traveling #еда #foodie",
            is_incognito: false,
            name: "John Doe",
            url: "https://example.com",
            wallet_number: "0x123456789ABCDEF"
        },
        image_data: '/test.jpg',
        video_data: '33.mp4',
    },
    {
        profile_data: {
            id: 12,
            activity_hobbies: "Exploring culinary games, traveling for food tours",
            adress: "123 Example Street, Example City",
            coordinates: [37.7749, -122.4194],
            hashtags: "#gaming #traveling #еда #foodie",
            is_incognito: false,
            name: "John Doe",
            url: "https://example.com",
            wallet_number: "0x123456789ABCDEF"
        },
        image_data: '/test.jpg',
        video_data: '33.mp4',
    },
]

const services = [
    {
        profile_data: {
            id: 13,
            userId: 1,
            title: 'iq Pump'
        },
        link: 'https://example.com',
        type: 'service'
    }
]

const Reels = () => {

    const dispatch = useDispatch();

    /** states */
    const [currentIndex, setCurrentIndex] = React.useState<number>(1);
    const [realsForShow, setRealsForShow] = React.useState<any[]>([]);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [searchLine, setSearchLine] = React.useState('');
    const [windowWidth, setWindowWidth] = React.useState<null | number>(null);
    const [counterSlides, setCounterSlides] = React.useState<number>(7);
    const {profilesWithServices} = useAppSelector(state => state.authSlice)

    /** actions*/
    const {addProfilesWithServices} = authActions;

    /** Функция для получения рандомных Reels */
    const getRandomReels = (count: number, excludeIndexes: number[] = []) => {
        const randomReels = [];
        const usedIndexes = new Set(excludeIndexes);

        while (randomReels.length < count) {
            const randomIndex = Math.floor(Math.random() * profilesWithServices.length);
            if (!usedIndexes.has(randomIndex)) {
                randomReels.push(profilesWithServices[randomIndex]);
                usedIndexes.add(randomIndex);
            }
        }

        return randomReels;
    };

    /** поисковый запрос*/
    const addSearchLineValue = (e:React.ChangeEvent<HTMLInputElement>) => {
        setSearchLine(e.target.value)
    }

    /** Функция для загрузки новых 5 рилсов */
    const showMoreReals: ForFunc<void, void> = () => {
        setIsLoading(true)
        setIsAnimating(true);

        let nextIndex = currentIndex + counterSlides;
        if (nextIndex >= profilesWithServices.length) {
            // Если все рилсы уже показаны, начинаем заново
            nextIndex = 0;
        }
        setCurrentIndex(nextIndex);
    };

    /** Обновляем отображаемые Reels при изменении currentIndex */
    React.useEffect(() => {

        if(profilesWithServices?.length >= 1) {
            let nextIndex = currentIndex + counterSlides;
            if (nextIndex < profilesWithServices.length) {
                // Достаточно рилсов — берём 5 подряд
                setRealsForShow(profilesWithServices?.slice(currentIndex, nextIndex));
            } else {
                // Осталось меньше 5 рилсов — добираем рандомно
                const remaining = profilesWithServices?.slice(currentIndex); // Берём оставшиеся
                const neededCount = counterSlides - remaining.length;
                const randomReels = getRandomReels(neededCount, [...remaining.map(r => r.profile_data?.id)]); // Добираем случайные
                setRealsForShow([...remaining, ...randomReels]);
            }
            setTimeout(() => {
                setIsLoading(false)
                setIsAnimating(false);
            }, 1000)
        }


    }, [currentIndex, counterSlides, profilesWithServices]);

    React.useEffect(() => {
        const getCurrentWidth = () => {
            const width = window.innerWidth;
            if(width >= 1079) {
                setCounterSlides(7);
            } else if (width < 1079) {
                // console.log('ставим 5')
                setCounterSlides(5);
            }
            if (width > 900) {
                setWindowWidth(width)
            }
        }

        window.addEventListener('resize',() => {
           getCurrentWidth()
        })

        getCurrentWidth()

        return () => {
            window.removeEventListener('resize', getCurrentWidth);
        }
    },[])

    /** искуственная задержка запроса*/
    React.useEffect(() => {
        setTimeout(() => {
            dispatch(addProfilesWithServices([...profiles, ...services]))
        },1000)
    },[])

    return (
        <div className={cls.wrapper}>
            <div className={cls.search_block}>
                <CustomInput onChange={addSearchLineValue} classNameWrapper={cls.wrapper_input_search}
                             classNameInput={cls.input_search} type="text" placeholder="search"/>
                <SvgQr className={cls.svg_qr}/>
            </div>
            <div className={cls.cover_list_slides}>
                <Swiper
                    slidesPerView={"auto"}
                    centeredSlides={true}
                    pagination={{
                        clickable: true,
                    }}
                    spaceBetween={20}
                    className="mySwiper"
                    loop={true}
                >
                    {realsForShow?.length >= 1 &&
                        realsForShow?.map((item: any) => (
                            <SwiperSlide key={item?.profile_data.id} style={{ width: "fit-content" }}>
                                {item?.type === 'service' ? (
                                    <div>
                                       <IqPumpMainWindow key={item?.profile_data?.id + profilesWithServices?.length}/>
                                    </div>
                                ) : (
                                    <VideoCard
                                        classNameWrap={cls.video_card_tablet}
                                        classNameCover={cls.videomain_tablet}
                                        videoUrl={item?.video_data}
                                        posterUrl={'./../../assets/default-poster.jpg'} // Постер для остальных профилей
                                        muted={true}
                                        controls={false}
                                        startPointerEnter={true}
                                        autoPlay={false}
                                        userId={item?.profile_data?.id}
                                    />
                                )}
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
            {realsForShow.length >= 1 && <div className={cls.cover_reals_block}>
                    <div className={cls.creator_video}>
                        <VideoCard
                            classNameWrap={cls.video_card_main}
                            classNameCover={cls.video}
                            videoUrl={profilesWithServices[0]?.video_data}
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
                            {realsForShow?.length >= 1 &&
                                realsForShow.map((item: any, index) => (
                                    item?.type !== 'service' ? (
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
                                    ) : (
                                            <IqPumpMainWindow key={item?.profile_data?.id + profilesWithServices + index}/>
                                    )
                                ))
                            }
                            {profiles.length > 5 &&
                                <CustomButton
                                    classnameWrapper={cls.btn_load_wrap}
                                    classNameBtn={cls.btn_load_more}
                                    type="button"
                                    onClick={showMoreReals}
                                >
                                    <SvgLoadMore className={`${cls.svg_load_more} ${isLoading && cls.load}`}/>
                                </CustomButton>
                            }
                        </div>
                    </div>
                </div>}

        </div>
    );
};

export default Reels;
