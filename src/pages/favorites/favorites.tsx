import React from 'react';
import cls from './favotites.module.scss';
import CustomButton from "../../shared/ui/сustomButton/CustomButton";
import {useTranslation} from "react-i18next";
import {useAppSelector} from "../../shared/redux/hooks/hooks";

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
]

interface IFavorites {
    profiles?: any
}

const Favorites = () => {

    /** states */
    const {loggedIn, account } = useAppSelector(state => state.authSlice)


    const {t} = useTranslation()

    return (
        <div className={cls.wrapper}>
            <div className={cls.coverSubTitle}>
                <h3 className={cls.title}>
                    {loggedIn
                        ? t('favorites')
                        : t('GetSttToken')
                    }
                </h3>
            </div>
            <div className={cls.cover}>
                {profiles?.length > 0 &&
                    profiles?.slice(0, 4).map((item: any) => (
                        <CustomButton key={item?.id} classNameBtn={cls.profile_logo} type='button'>
                                <img src={item?.image_data} alt="логотип"/>
                            </CustomButton>
                        ))
                    }
                </div>
            </div>
            );
            };

            export default Favorites;