/** Перечисление языков для селекта */
export enum Language {
    'EN' = 'en',
    'RU' = 'ru',
}

export interface ILanguageOption {
    id: number;
    label: string;
    value: string;
}

/** Языки на сайте*/
export const LANGUAGES = [
    { id: 1, label: 'English', value: Language.RU },
    { id: 2, label: 'Русский', value: Language.EN },
];
