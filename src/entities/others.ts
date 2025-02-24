import { ReactElement } from 'react';

/** тип для слайдов на главной странице без авторизации*/
export interface ICardsForSliders {
    id: number;
    title: string;
    description: string;
    link: string;
}

/** тип для картинок на главной странице без авторизации*/
export interface IPicturesNotAuth extends Omit<ICardsForSliders, 'title'> {}

/** перечисление полей в IInfoUserInHeader*/
export enum labelProfileInfo {
    'donations' = 'donations',
    'subscribers' = 'subscribers',
    'favourites' = 'favourites',
}

/** тип для отображения полей в профиле шапки магазина*/
export interface IInfoUserInHeader {
    id: number;
    label: labelProfileInfo;
    svg: ReactElement;
}

/** тип для блоков маркетинга при добавлении профиля*/
export interface IBlockMlm {
    id: number;
    percent: number;
}

export type ForFunc<T, U> = (arg: T) => U;

export interface SwapOptionsFrom {
    value: string;
    label: string;
    icon: string;
}
export interface SwapOptionsTo {
    stt: SwapOptionsFrom[];
    usdt: SwapOptionsFrom[];
}
