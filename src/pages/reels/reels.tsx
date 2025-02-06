import React from 'react';
import CustomInput from "../../shared/ui/customInput/customInput";
import {ReactComponent as SvgQr} from '../../assets/svg/qr.svg'
import cls from './reels.module.scss'
import {ReactComponent as SvgLoadMore} from "./../../assets/svg/loading.svg";
import CustomButton from "../../shared/ui/сustomButton/CustomButton";
import VideoCard from "../../feautures/videoCard/videoCard";
import {ForFunc} from "../../entities/others";

export const profiles = [
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
        video_data: 'http://127.0.0.1:8000/video_temp/3cec27a2-4ab7-44f6-8876-b62cc7f01d4b_v2.mp4',
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
        video_data: 'http://127.0.0.1:8000/video_temp/3cec27a2-4ab7-44f6-8876-b62cc7f01d4b_v2.mp4',
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
        video_data: 'http://127.0.0.1:8000/video_temp/3cec27a2-4ab7-44f6-8876-b62cc7f01d4b_v2.mp4',
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
        video_data: 'http://127.0.0.1:8000/video_temp/3cec27a2-4ab7-44f6-8876-b62cc7f01d4b_v2.mp4',
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
        video_data: 'http://127.0.0.1:8000/video_temp/3cec27a2-4ab7-44f6-8876-b62cc7f01d4b_v2.mp4',
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
        video_data: 'http://127.0.0.1:8000/video_temp/3cec27a2-4ab7-44f6-8876-b62cc7f01d4b_v2.mp4',
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
        video_data: 'http://127.0.0.1:8000/video_temp/3cec27a2-4ab7-44f6-8876-b62cc7f01d4b_v2.mp4',
    },
]

const Reels = () => {
    /** states */
    const [currentIndex, setCurrentIndex] = React.useState<number>(0);
    const [realsForShow, setRealsForShow] = React.useState<any[]>([]);

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

    /** Функция для обновления отображаемых Reels */
    const showMoreReals: ForFunc<void, void> = () => {
        const nextIndex = currentIndex + 5;
        const remainingReels = profiles.length - nextIndex;

        if (remainingReels >= 5) {
            // Если осталось больше или равно 5 Reels, просто обновляем индекс
            setCurrentIndex(nextIndex);
        } else if (remainingReels > 0) {
            // Если осталось меньше 5 Reels, добираем случайные
            const remaining = profiles.slice(nextIndex);
            // const randomReels = getRandomReels(5 - remaining.length, [...Array(nextIndex).keys()]);
            const randomReels = getRandomReels(5 - remaining.length, Array.from({ length: currentIndex }, (_, i) => i));
            setRealsForShow([...remaining, ...randomReels]);
            setCurrentIndex(nextIndex);
        } else {
            // Если Reels закончились, начинаем сначала
            setCurrentIndex(0);
        }
    };

    /** Обновляем отображаемые Reels при изменении currentIndex */
    React.useEffect(() => {
        const nextIndex = currentIndex + 5;
        const remainingReels = profiles.length - currentIndex;

        if (remainingReels >= 5) {
            setRealsForShow(profiles.slice(currentIndex, nextIndex));
        } else if (remainingReels > 0) {
            const remaining = profiles.slice(currentIndex);
            // const randomReels = getRandomReels(5 - remaining.length, [...Array(currentIndex).keys()]);
            const randomReels = getRandomReels(5 - remaining.length, Array.from({ length: currentIndex }, (_, i) => i));
            setRealsForShow([...remaining, ...randomReels]);
        } else {
            setRealsForShow(getRandomReels(5));
        }
    }, [currentIndex]);

    React.useEffect(() => {
        console.log(realsForShow)
    },[currentIndex])

    return (
        <div className={cls.wrapper}>
            <div className={cls.search_block}>
                <CustomInput classNameWrapper={cls.wrapper_input_search} classNameInput={cls.input_search} type="text" placeholder="search"/>
                <SvgQr className={cls.svg_qr}/>
            </div>
            <div className={cls.cover_reals_block}>
                <div className={cls.creator_video}>
                    <VideoCard
                        classNameWrap={cls.video_card_main}
                        classNameCover={cls.video}
                        videoUrl="/video.mp4"
                        posterUrl={'./../../assets/video.mp4'}
                    />
                </div>
                <div className={cls.reals_block}>
                    <div className={cls.video_container}>
                        {realsForShow?.length >= 1 &&
                            realsForShow.map((item: any) => (
                                <VideoCard
                                    classNameWrap={cls.video_card}
                                    classNameCover={cls.videomain}
                                    key={item.id}
                                    videoUrl="/video.mp4"
                                    posterUrl={'./../../assets/video.mp4'}
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
                                <SvgLoadMore className={cls.svg_load_more}/>
                            </CustomButton>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reels;
