import { ReactElement } from 'react';

/**
 * @addBannerToProfile - кнопка добавления банера в профиле
 * @addLogoToBanner - кнопка добавления баннера в профиле пользователя
 * @addGeoToProfile - кнопка добавления
 * @trashAddProfile - кнопка кдаления добавленной геопозиции
 * @addCurrentGeoToProfile - кнопка добавления текущей записи гео из инпута
 * @tabsProfile - кнопка табов в рофиле
 * @simpleButton простая кнопка
 * */
export enum IndicatorsForUi {
    'addBannerToProfile' = 'addBannerToProfile',
    'addLogoToBanner' = 'addLogoToBanner',
    'addGeoToProfile' = 'addGeoToProfile',
    'trashAddProfile' = 'trashAddProfile',
    'addCurrentGeoToProfile' = 'addCurrentGeoToProfile',
    'tabsProfile' = 'tabsProfile',
    'simpleButton' = 'simpleButton',
    'withoutStyle' = 'withoutStyle',
}

/**
 * @addProfileName - ввод имени
 * @addProfileSiteUrl - ссылка на свой сайт
 * @addProfileHobbies - ввод хобби
 * @addProfileHash - хеши
 * @addGeoLocation - добавить геолокацию
 * */
export enum InputsIndicators {
    'addProfileName' = 'addProfileName',
    'addProfileSiteUrl' = 'addProfileSiteUrl',
    'addProfileHobbies' = 'addProfileHobbies',
    'addProfileHash' = 'addProfileHash',
    'addGeoLocation' = 'addGeoLocation',
}

/**
 * для отрисовки инпутов в форме добвления профиля
 * */
export interface IInputsForFormAddProfile {
    id: number;
    label: string;
    indicator: InputsIndicators;
    name: string;
}

/**
 * для отрисовки кнопок добавления логотипа и баннера в форме добвления профиля
 * */
export interface IButtonsForFormAddProfile {
    id: number;
    indicator: IndicatorsForUi;
    urlSvg: ReactElement;
    alt: string;
    name: string;
}

export interface ILanguageOption {
    label: string;
    value: string;
}

export interface TabsOptions {
    id: number;
    label: number;
}

/**
 * для чекбокса инкогнито
 * */
export interface CheckBoxIncognito {
    id: 1;
    label: 'incognito';
}

/**
 * объекты ошибок для формы
 * */
export enum ERROR_ATTENTION_FOR_FORM {
    'name' = 'Please enter a valid name!',
    'siteUrl' = 'Please enter a valid site URL!',
    'activity' = 'Please enter the activity!',
    'hash' = 'Please enter the valid hash!',
    'logo' = 'please upload a logo!',
    'banner' = 'Please upload a video!',
    'geolocation' = 'Please enter geolocation!',
    'language' = 'Please select a language!',
    'mlm' = 'Please choose MLM!',
    'maxSizeLogo' = 'Image must be less then 3 MB!',
    'maxSizeBanner' = 'Video must be less then 15 MB!',
    'muchFiles' = 'Can add only 1 file!',
    'noHTTP'= 'Please enter a site URL with http:// or https://.'
}


export interface  ObjForLocaleStorage{
    'name': string,
    'url': string,
    'activity_hobbies': string,
    'hashtags': string
    'is_incognito': boolean
    'logo': string,
    'banner': string,
    'geolocation': string[]
    'marketingPercent': number,
    'mlm': string,
    'language': string,
}


export type ForFunc<T, U> = (arg: T) => U;
