import {
    CheckBoxIncognito,
    IButtonsForFormAddProfile,
    IInputsForFormAddProfile,
    ILanguageOption,
    IndicatorsForUi,
    InputsIndicators,
    TabsOptions,
} from '../../entities/IndicatorsForUi';
import SvgLogo from '../../../public/svg/uploadLogo.svg';
import SvgBanner from '../../../public/svg/uploadBanner.svg';
import cls from './../../features/addProfile/styled/addProfile.module.scss';

/**
 * для отрисовки инпутов в окне добавления профиля
 * */
export const INPUTS_FOR_ADD_PROFILE: IInputsForFormAddProfile[] = [
    { id: 1, label: 'Name', indicator: InputsIndicators.addProfileName, name: 'name' },
    { id: 2, label: 'URL site oe social network', indicator: InputsIndicators.addProfileSiteUrl, name: 'url' },
];

/**
 * для отрисовки текстовых полей в окне добавления профиля
 * */
export const TEXT_AREA_FOR_ADD_PROFILE: IInputsForFormAddProfile[] = [
    { id: 1, label: 'Field of activity and hobbies', indicator: InputsIndicators.addProfileHobbies, name: 'activity_hobbies' },
    { id: 2, label: '#hashtags', indicator: InputsIndicators.addProfileHash, name: 'hashtags' },
];

/**
 * для отрисовки кнопок добавлеия логотипа и баннера в окне добавления профиля
 * */
export const BUTTONS_FOR_ADD_PROFILE: IButtonsForFormAddProfile[] = [
    { id: 1, indicator: IndicatorsForUi.addBannerToProfile, urlSvg: <SvgLogo className={cls.svgLogo} />, alt: 'logoSvg', name: 'logo' },
    {
        id: 2,
        indicator: IndicatorsForUi.addLogoToBanner,
        urlSvg: <SvgBanner className={cls.svgBanner} />,
        alt: 'bannerSvg',
        name: 'banner',
    },
];

/** список языков мира*/
export const LANGUAGE_OPTION: ILanguageOption[] = [
    { label: 'English', value: 'EN' },
    { label: 'Русский', value: 'RU' },
    { label: 'Español', value: 'ES' },
    { label: 'Français', value: 'FR' },
    { label: 'Deutsch', value: 'DE' },
    { label: '中文 (Chinese)', value: 'ZH' },
    { label: 'हिन्दी (Hindi)', value: 'HI' },
    { label: 'العربية (Arabic)', value: 'AR' },
    { label: 'Português', value: 'PT' },
    { label: '日本語 (Japanese)', value: 'JA' },
    { label: '한국어 (Korean)', value: 'KO' },
    { label: 'Italiano', value: 'IT' },
    { label: 'Türkçe', value: 'TR' },
    { label: 'Polski', value: 'PL' },
    { label: 'Українська', value: 'UK' },
    { label: 'Čeština', value: 'CS' },
    { label: 'فارسی (Persian)', value: 'FA' },
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
