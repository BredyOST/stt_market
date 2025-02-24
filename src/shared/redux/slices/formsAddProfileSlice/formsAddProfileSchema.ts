/**
 * @name - имя пользователя
 * @url - ссылка на сайт
 * @activity_hobbies - хобби
 * @hashtags - хеши
 * @logo - ссылка на логотип
 * @banner - ссылка на видео
 * @coordinates - координаты
 * @language - язык
 * @mlm
 * @marketingPercent
 * @is_incognito
 * @inputGeo
 * @tab
 * @wallet_number - номер кошелька
 * @loginThunk - выполнен вход
 * */
export interface FormsAddProfileSchema {
    name: string;
    url: string;
    activity_hobbies: string;
    hashtags: string;
    logoLink: string;
    bannerLink: string;
    language: string;
    is_in_mlm: string;
    marketingPercent: string;
    is_incognito: boolean;
    tab: number;
    wallet_number: string;
    login: boolean;
    inputGeo: string;
    coordinates: coordinates[] | null;
    showImageInModalWindow: boolean;
    showVideoInModalWindowButton: boolean;
}

export type coordinates = {
    id: number;
    coordinates: any;
    country: string;
    city: string;
    street: string;
    housenumber: string;
    postcode: string;
};

export interface Feature {
    geometry: {
        coordinates: [[number, number][]];
        type: string;
    };
    type: string;
    properties: {
        osm_type: string;
        extent: number[];
        osm_id: number;
        country: string;
        osm_key: string;
        city: string;
        street: string;
        countrycode: string;
        osm_value: string;
        district: string;
        postcode: string;
        name: string;
        state: string;
        type: string;
        housenumber: string;
    };
}
