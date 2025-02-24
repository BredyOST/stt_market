import React from 'react';
import { ForFunc, SwapOptionsFrom, SwapOptionsTo } from '../../../entities/others';
import cls from './styled/custom.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { formsAddProfileActions } from '../../redux/slices/formsAddProfileSlice/formsAddProfileSlice';
import { TITLES } from '../../../entities/pageTitiles';
import CustomButton from '../сustomButton/CustomButton';
import { ReactComponent as SvgClose } from '../../../assets/svg/close.svg';
import { ReactComponent as SvgArrow } from '../../../assets/svg/arrow.svg';
import { languageActions } from '../../redux/slices/Language/languageSlice';
import { Language } from '../../redux/slices/Language/languageShema';
import { useTranslation } from 'react-i18next';
import { ILanguageOption } from '../../../entities/languages/languages';
import { IndicatorsForUi, SelectsIndicators } from '../../../entities/uiInterfaces/uiInterfaces';
import { authActions } from '../../redux/slices/authSlice/authSlice';
import { ICONS_TOKENS, TO_OPTIONS } from '../../const/index.const';
import { useAddValuesToLocalStorage } from '../../helpers/hooks';

interface ICustomSelectProps {
    options?: ILanguageOption[] | SwapOptionsFrom[] | { id: number; value: string }[];
    // optionsSecond?: {id:number, label:string}[];
    isOpenMenu?: boolean;
    handleOpenMenu?: () => void;
    onSelect?: (value: string | number) => void;
    placeholder?: string;
    arrowIndicator?: boolean;
    indicator?: SelectsIndicators;
    classNameWrapper?: string;
    classNameChosenValue?: string;
    classNameIcon?: string;
    classNameTextWithImage?: string;
    classNameBodyList?: string;
    classNameActiveItem?: string;
    classNameShowed?: string;
    chosenValue?: any;
}

const CustomSelect = ({
    options,
    chosenValue,
    onSelect,
    placeholder,
    arrowIndicator,
    indicator,
    classNameWrapper,
    classNameChosenValue,
    classNameIcon,
    classNameTextWithImage,
    classNameBodyList,
    classNameActiveItem,
    classNameShowed,
    handleOpenMenu,
    isOpenMenu,
}: ICustomSelectProps) => {
    const dispatch = useAppDispatch();
    const { t, i18n } = useTranslation();

    /** STATES*/
    const { language } = useAppSelector((state) => state.formsAddProfile);
    const { targetToken, sourceToken } = useAppSelector((state) => state.authSlice);

    /** для показа выпадающего меню профилей*/
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    /** для показа выпадающего меню языков*/
    const [isOpenLanguage, setIsOpenLanguage] = React.useState<boolean>(false);
    /** для показа выпадающего меню swap блока*/
    const [isOpenSwapMenu, setIsOpenSwapMenu] = React.useState<boolean>(false);

    /** ACTIONS*/
    const { addLanguage } = formsAddProfileActions;
    const { changeLanguage } = languageActions;
    const { addTargetToken, addSourceToken } = authActions;

    /** сохранение данных с формы в локалсторедже*/
    const { addValueToLocalStorage } = useAddValuesToLocalStorage();

    /** изменение состояния для показа выпадающего меню и его скрытия*/
    const openMenu = () => {
        setIsOpen((prev) => !prev);
    };
    /** изменение состояния для показа выпадающего меню и его скрытия*/
    const openMenuLanguage = () => {
        setIsOpenLanguage((prev) => !prev);
    };
    /** изменение состояния для показа выпадающего меню и его скрытия*/
    const openMenuSwap = () => {
        setIsOpenSwapMenu((prev) => !prev);
    };

    /** выбор языка из выпадающего меню*/
    const handleChooseOption: ForFunc<number | string, void> = (option: string) => {
        addValueToLocalStorage('language', option);
        dispatch(addLanguage(option));
        setIsOpen(false);
    };

    /** выбор языка из выпадающего меню*/
    const handleChooseLanguage: ForFunc<Language, void> = (option: Language) => {
        i18n.changeLanguage(option);
        dispatch(changeLanguage(option));
    };

    /** выбор токенов при swap*/
    const handleChooseSwapToken = (value: SwapOptionsFrom) => {
        if (indicator === SelectsIndicators.swapFrom) {
            /** обновляем свап токен*/
            dispatch(addSourceToken(value.label));
            if (value?.label?.toLowerCase() === 'stt') {
                dispatch(addTargetToken(TO_OPTIONS.stt[0].label));
            } else if (value?.label?.toLowerCase() === 'usdt') {
                dispatch(addTargetToken(TO_OPTIONS.usdt[0].label));
            }
        } else if (indicator === SelectsIndicators.swapTo) {
            /** обновляем таргет токен*/
            dispatch(addTargetToken(value.label));
        }
    };

    if (!indicator) {
        return (
            <div className={classNameWrapper} onClick={handleOpenMenu}>
                <div className={classNameChosenValue}>
                    <img src={ICONS_TOKENS[chosenValue]} alt={`${sourceToken} icon`} className={classNameIcon} />
                    <div className={classNameTextWithImage}>{chosenValue.toUpperCase()}</div>
                </div>
                {isOpenMenu && (
                    <ul className={`${classNameBodyList} ${isOpenMenu && classNameShowed}`}>
                        {options &&
                            options?.length > 0 &&
                            options?.map((option) => (
                                <li
                                    className={option.value === i18n?.language ? classNameActiveItem : undefined}
                                    key={option.value}
                                    onClick={() => onSelect(option.value)}
                                >
                                    {option?.value?.toUpperCase()}
                                </li>
                            ))}
                    </ul>
                )}
            </div>
        );
    }

    if (indicator === SelectsIndicators.address) {
        return (
            <div className={cls.wrapper_language}>
                <div className={cls.CustomSelect} onClick={openMenu}>
                    {language ? ` Language ${language}` : placeholder}
                    {arrowIndicator && <SvgArrow className={isOpen ? `${cls.svgArrow} ${cls.active}` : `${cls.svgArrow}`} />}
                </div>
                {isOpen && (
                    <div className={cls.listCover}>
                        <div className={cls.coverTitle}>
                            <h3 className={cls.title}>{TITLES.language}</h3>
                            <CustomButton indicator={IndicatorsForUi.withoutStyle} type='button' onClick={openMenu}>
                                <SvgClose className={cls.close} />
                            </CustomButton>
                        </div>
                        <ul className={cls.bodySelect}>
                            {isOpen &&
                                options?.length > 0 &&
                                options?.map((option) => (
                                    <li
                                        className={option.value.toUpperCase() === language ? cls.active : undefined}
                                        key={option.value}
                                        onClick={() => handleChooseOption(option.value)}
                                    >
                                        {option.value}
                                    </li>
                                ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    }

    if (indicator === SelectsIndicators.language) {
        return (
            <div className={cls.wrapper} onClick={openMenuLanguage}>
                <div className={cls.CustomSelectLanguage}>{i18n.language}</div>
                {isOpenLanguage && (
                    <ul className={`${cls.bodySelectLanguage} ${isOpenLanguage && cls.show}`}>
                        {isOpenLanguage &&
                            options?.length > 0 &&
                            options?.map((option) => (
                                <li
                                    className={option.value === i18n?.language ? cls.active : undefined}
                                    key={option.value}
                                    onClick={() => handleChooseLanguage(option.value as Language)}
                                >
                                    {option.value}
                                </li>
                            ))}
                    </ul>
                )}
            </div>
        );
    }

    if (indicator === SelectsIndicators.swapFrom || indicator === SelectsIndicators.swapTo) {
        return (
            <div className={cls.wrapperSTT} onClick={openMenuSwap}>
                <div className={cls.CustomSelectStt}>
                    <img
                        src={
                            indicator === SelectsIndicators.swapFrom
                                ? ICONS_TOKENS[sourceToken.toLowerCase()]
                                : ICONS_TOKENS[targetToken.toLowerCase()]
                        }
                        alt={`${sourceToken} icon`}
                        className={cls.icon}
                    />
                    <div className={cls.token}>{indicator === SelectsIndicators.swapFrom ? sourceToken : targetToken}</div>
                </div>
                {isOpenSwapMenu && (
                    <ul className={`${cls.bodySelectSwap} ${isOpenSwapMenu && cls.show}`}>
                        {isOpenSwapMenu &&
                            options?.length > 0 &&
                            options?.map((option) => (
                                <li
                                    className={option.value === i18n?.language ? cls.active : undefined}
                                    key={option.value}
                                    onClick={() => handleChooseSwapToken(option)}
                                >
                                    {option.value}
                                </li>
                            ))}
                    </ul>
                )}
            </div>
        );
    }

    return null;
};

export default CustomSelect;
