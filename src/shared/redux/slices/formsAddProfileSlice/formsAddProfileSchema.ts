import {Feature} from "../../../../widgets/geolocation/geolocation";

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
 * @login - выполнен вход
 * */
export interface FormsAddProfileSchema {
    name: string;
    url: string;
    activity_hobbies: string;
    hashtags: string;
    logoLink: string;
    bannerLink: string;
    coordinates: Feature | null;
    language: string;
    mlm: string;
    marketingPercent: string;
    is_incognito: boolean;
    tab: number;
    wallet_number: string;
    login:boolean
    inputGeo: string;
}
