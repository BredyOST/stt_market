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
]

const Reels = () => {

    const dispatch = useAppDispatch();

    /** states */
    const [currentIndex, setCurrentIndex] = React.useState<number>(1);
    const [realsForShow, setRealsForShow] = React.useState<any[]>([]);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [searchLine, setSearchLine] = React.useState('');
    const [windowWidth, setWindowWidth] = React.useState<null | number>(null);
    const [counterSlides, setCounterSlides] = React.useState<number>(7);
    const {tabRealsOrServices} = useAppSelector(state => state.authSlice)


    /** actions*/
    const {changeTabRealsOrServices} = authActions;

    /** Функция для получения рандомных Reels */
    const getRandomReels = (count: number, excludeIndexes: number[] = []) => {
        const randomReels = [];
        const usedIndexes = new Set(excludeIndexes);

        while (randomReels.length < count) {
            const randomIndex = Math.floor(Math.random() * profiles.length);
            if (!usedIndexes.has(randomIndex)) {
                randomReels.push(profiles[randomIndex]);
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
        if (nextIndex >= profiles.length) {
            // Если все рилсы уже показаны, начинаем заново
            nextIndex = 0;
        }
        setCurrentIndex(nextIndex);
    };


    /** для смены активного таба*/
    const changeActiveTab =(id: number) => {
        console.log('Dispatching changeTabRealsOrServices with id:', id);
        dispatch(changeTabRealsOrServices(id));
    };

    /** Обновляем отображаемые Reels при изменении currentIndex */
    React.useEffect(() => {
        let nextIndex = currentIndex + counterSlides;
        if (nextIndex < profiles.length) {
            // Достаточно рилсов — берём 5 подряд
            setRealsForShow(profiles.slice(currentIndex, nextIndex));
        } else {
            // Осталось меньше 5 рилсов — добираем рандомно
            const remaining = profiles.slice(currentIndex); // Берём оставшиеся
            const neededCount = counterSlides - remaining.length;
            const randomReels = getRandomReels(neededCount, [...remaining.map(r => r.profile_data?.id)]); // Добираем случайные
            setRealsForShow([...remaining, ...randomReels]);
        }
        setTimeout(() => {
            setIsLoading(false)
            setIsAnimating(false); // Завершаем анимацию
        }, 1000)
    }, [currentIndex, counterSlides]);



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



    React.useEffect(() => {
        console.log("Redux activeTabId изменился:", tabRealsOrServices);
    }, [tabRealsOrServices]);


    return (
        <div className={cls.wrapper}>
            <div className={cls.search_block}>
                <CustomInput onChange={addSearchLineValue} classNameWrapper={cls.wrapper_input_search}
                             classNameInput={cls.input_search} type="text" placeholder="search"/>
                <SvgQr className={cls.svg_qr}/>
            </div>
            <div className={cls.wrapper_tabs}>
                <Tabs options={tabOption} activeClass={cls.active_tab} classNameWrapper={cls.cover_tabs} classNameBtn={cls.tab_item} onClickHandler={changeActiveTab} activeTabId={tabRealsOrServices} notActive={cls.not_active}/>
            </div>
            <IqPumpService/>
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
                    {profiles?.length >= 1 && (
                        profiles.map((item: any, index) => (
                            <SwiperSlide key={item.id} style={{width: "fit-content"}}>
                                <VideoCard
                                    classNameWrap={cls.video_card_tablet}
                                    classNameCover={cls.videomain_tablet}
                                    key={item.id}
                                    videoUrl={item.video_data}
                                    posterUrl={'./../../assets/video.mp4'}
                                    muted={true}
                                    controls={false}
                                    startPointerEnter={true}
                                    autoPlay={false}
                                    userId={item?.profile_data?.id}
                                />
                            </SwiperSlide>
                        ))
                    )}
                </Swiper>
            </div>
            <div className={cls.cover_reals_block}>
                <div className={cls.creator_video}>
                    <VideoCard
                        classNameWrap={cls.video_card_main}
                        classNameCover={cls.video}
                        videoUrl={profiles[0]?.video_data}
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
                                <VideoCard
                                    classNameWrap={cls.video_card}
                                    classNameCover={cls.videomain}
                                    key={item.id}
                                    videoUrl={item.video_data}
                                    posterUrl={'./../../assets/video.mp4'}
                                    muted={true}
                                    controls={false}
                                    startPointerEnter={true}
                                    autoPlay={false}
                                    userId={item?.profile_data?.id}
                                />
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
            </div>
        </div>
    );
};

export default Reels;
