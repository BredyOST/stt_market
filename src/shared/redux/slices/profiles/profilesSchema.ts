export type CoordinatesType = {
    id: number;
    value: [number, number];
};

export type ProfileInfoType = {
    profile_data: {
        id: number;
        activity_hobbies: string;
        adress: string;
        coordinates: CoordinatesType[];
        hashtags: string;
        is_incognito: boolean;
        name: string;
        url: string;
        wallet_number: string;
    };
    image_data: string;
    video_data: string;
};

export type ServicesType = {
    profile_data: {
        id: number;
        userId: number;
        title: string;
        wallet_number: string;
    };
    link: string;
    type: string;
};

/**
 * @erc20FromQrForSearch - сохраняем qr для поиска
 * @coordinatesProfileForShowing - сохраняем координаты с рилса для показа на карте
 * @saveClosedRealsBeforeShowingOnTheMap - сохраняем закрыты рилс перед переходом на карте
 * */

export interface IProfilesSchema {
    profilesForShowing: ProfileInfoType[] | null;
    favouritesProfiles: ProfileInfoType[] | null;
    services: ServicesType[] | null;
    chosenFavouritesIdReals: number | null;
    chosenServiceId: number | null;
    isOpen: 'reals' | 'service';
    finishedQrScannerReals: boolean;
    finishedQrScannerSendTokens: boolean;
    erc20FromQrForSearch: string | null;
    erc20FromQrForSendFrom: string | null;
    coordinatesProfileForShowing: ProfileInfoType | null;
    saveClosedRealsBeforeShowingOnTheMap: number | null;
}

interface ProfileData {
    activity_hobbies: string | null;
    adress: string[] | null;
    city: string | null;
    coordinates: [[number, number][]] | null;
    hashtags: string[] | null;
    is_in_mlm: number;
    is_incognito: boolean;
    name: string;
    wallet_number: string;
    website_or_social: string | null;
}

export interface FormDataUser {
    profile_data: ProfileData;
    image_data: { image_path: string } | null;
    video_data: { video_path: string } | null;
}

export interface FormDataUserWithoutVideo {
    form_data: any;
    image_data: { image_path: string } | null;
}

export interface CheckUser {
    activity_hobbies: string | null;
    adress: string[] | null;
    city: string | null;
    coordinates: [[number, number][]] | null;
    hashtags: string[] | null;
    is_in_mlm: number;
    is_incognito: boolean;
    name: string;
    wallet_number: string;
    website_or_social: string | null;
}
