import { ReactComponent as  SvgLogo } from '../../assets/svg/uploadLogo.svg';
import { ReactComponent as  SvgBanner } from '../../assets/svg/uploadBanner.svg';
import cls from '../../pages/addProfile/addProfile.module.scss';
import {ILanguageOption} from "../../entities/languages/languages";
import {
    CheckBoxIncognito,
    IButtonsForFormAddProfile,
    IInputsForFormAddProfile, IndicatorsForUi,
    InputsIndicators, TabsOptions
} from "../../entities/uiInterfaces/uiInterfaces";

/**
 * для отрисовки инпутов в окне добавления профиля
 * ввод имени
 * ввод url
 * */
export const INPUTS_FOR_ADD_PROFILE: IInputsForFormAddProfile[] = [
    { id: 1, label: 'Name', indicator: InputsIndicators.addProfileName, name: 'name' },
    { id: 2, label: 'URL site oe social network', indicator: InputsIndicators.addProfileSiteUrl, name: 'url' },
];

/**
 * для отрисовки текстовых полей в окне добавления профиля
 * ввод хобби
 * ввод хешей
 * */
export const TEXT_AREA_FOR_ADD_PROFILE: IInputsForFormAddProfile[] = [
    { id: 1, label: 'Field of activity and hobbies', indicator: InputsIndicators.addProfileHobbies, name: 'activity_hobbies' },
    { id: 2, label: '#hashtags', indicator: InputsIndicators.addProfileHash, name: 'hashtags' },
];

/**
 * для отрисовки кнопок добавлеия логотипа и баннера в окне добавления профиля
 * добавления лого
 * добавления видео
 * */
export const BUTTONS_FOR_ADD_PROFILE: IButtonsForFormAddProfile[] = [
    { id: 1, indicator: IndicatorsForUi.addLogoToProfile, urlSvg: <SvgLogo className={cls.svgLogo} />, alt: 'logoSvg', name: 'logo' },
    {
        id: 2,
        indicator: IndicatorsForUi.addBannerToProfile,
        urlSvg: <SvgBanner className={cls.svgBanner} />,
        alt: 'bannerSvg',
        name: 'banner',
    },
];

/** список языков мира*/
export const LANGUAGE_OPTION: ILanguageOption[] = [
    {id:1, label: 'English', value: 'EN' },
    {id:2, label: 'Русский', value: 'RU' },
    {id:3, label: 'Español', value: 'ES' },
    {id:4, label: 'Français', value: 'FR' },
    {id:5, label: 'Deutsch', value: 'DE' },
    {id:6, label: '中文 (Chinese)', value: 'ZH' },
    {id:7, label: 'हिन्दी (Hindi)', value: 'HI' },
    {id:8, label: 'العربية (Arabic)', value: 'AR' },
    {id:9, label: 'Português', value: 'PT' },
    {id:10, label: '日本語 (Japanese)', value: 'JA' },
    {id:11, label: '한국어 (Korean)', value: 'KO' },
    {id:12, label: 'Italiano', value: 'IT' },
    {id:13, label: 'Türkçe', value: 'TR' },
    {id:14, label: 'Polski', value: 'PL' },
    {id:15, label: 'Українська', value: 'UK' },
    {id:16, label: 'Čeština', value: 'CS' },
    {id:17, label: 'فارسی (Persian)', value: 'FA' },
];

/** для тестового периода, далее будет расчитываться автоматически */
export const TABS_OPTIONS: TabsOptions[] = [
    { id: 1, label: 2.1 },
    { id: 2, label: 14.3 },
    { id: 3, label: 8.7 },
    { id: 4, label: 2.6 },
    { id: 5, label: 2.4 },
    { id: 6, label: 1.2 },
];

/**
 * для чексбокса
 * */
export const CHECKBOX_INCOGNITO: CheckBoxIncognito[] = [{ id: 1, label: 'incognito' }];


/** массив для пузырей*/
const array = Array.from({ length: 45 }, (_, index) => index + 1);
export const BUBBLE_COUNT = [...array]


/** Для работы с контрактами*/

