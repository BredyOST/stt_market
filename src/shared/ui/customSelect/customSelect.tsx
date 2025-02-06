import React from 'react';
import {ForFunc, SwapOptionsFrom, SwapOptionsTo} from '../../../entities/others';
import cls from './styled/custom.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { formsAddProfileActions } from '../../redux/slices/formsAddProfileSlice/formsAddProfileSlice';
import { TITLES } from '../../../entities/pageTitiles';
import CustomButton from '../сustomButton/CustomButton';
import { ReactComponent as SvgClose} from '../../../assets/svg/close.svg';
import { ReactComponent as SvgArrow} from '../../../assets/svg/arrow.svg';
import {languageActions} from "../../redux/slices/Language/languageSlice";
import {Language} from "../../redux/slices/Language/languageShema";
import { useTranslation } from "react-i18next";
import {ILanguageOption} from "../../../entities/languages/languages";
import {IndicatorsForUi, SelectsIndicators} from "../../../entities/uiInterfaces/uiInterfaces";
import {authActions} from "../../redux/slices/authSlice/authSlice";
import {ICONS_TOKENS, TO_OPTIONS} from "../../const/index.const";

interface ICustomSelectProps {
    options: ILanguageOption[] | SwapOptionsFrom[];
    onSelect?: (value: string | number) => void;
    placeholder?: string;
    arrowIndicator?: boolean;
    indicator:SelectsIndicators
}

const CustomSelect = ({ options, onSelect, placeholder, arrowIndicator, indicator }: ICustomSelectProps) => {
    const dispatch = useAppDispatch();
    const { t, i18n } = useTranslation()

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
    const { changeLanguage }  = languageActions;
    const {addTargetToken, addSourceToken} = authActions;

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
        dispatch(addLanguage(option));
        setIsOpen(false);
    };

    /** выбор языка из выпадающего меню*/
    const handleChooseLanguage: ForFunc<Language, void> = (option: Language) => {
        i18n.changeLanguage(option);
        dispatch(changeLanguage(option));
    };

    /** выбор токенов при swap*/
    /** выбор токенов при swap*/
    const handleChooseSwapToken = (value: SwapOptionsFrom) => {
        if (indicator === SelectsIndicators.swapFrom) {
            dispatch(addSourceToken(value.label)); // Обновляем sourceToken
        } else if (indicator === SelectsIndicators.swapTo) {
            console.log(value);
            dispatch(addTargetToken(value.label)); // Обновляем targetToken
        }
    };


    if(indicator === SelectsIndicators.address) {
        return (
            <div className={cls.wrapper_language}>
                <div className={cls.CustomSelect} onClick={openMenu}>
                    {language ? ` Language ${language}` : placeholder}
                    {arrowIndicator &&
                        <SvgArrow className={isOpen ? `${cls.svgArrow} ${cls.active}` : `${cls.svgArrow}`} />
                    }
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

    if(indicator === SelectsIndicators.language) {
        return (
            <div className={cls.wrapper} onClick={openMenuLanguage}>
                <div className={cls.CustomSelectLanguage} >
                    {i18n.language}
                </div>
                {isOpenLanguage && (
                    <ul className={`${cls.bodySelectLanguage} ${isOpenLanguage && cls.show}` }>
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

    if(indicator === SelectsIndicators.swapFrom || indicator === SelectsIndicators.swapTo) {
        return (
            <div className={cls.wrapperSTT} onClick={openMenuSwap}>
                <div className={cls.CustomSelectStt}>
                    <img
                        src={indicator === SelectsIndicators.swapFrom ? ICONS_TOKENS[sourceToken.toLowerCase()] : ICONS_TOKENS[targetToken.toLowerCase()] }
                        alt={`${sourceToken} icon`}
                        className={cls.icon}
                    />
                    {indicator === SelectsIndicators.swapFrom ? sourceToken : targetToken}
                </div>
                {isOpenSwapMenu && (
                    <ul className={`${cls.bodySelectLanguage} ${isOpenSwapMenu && cls.show}`}>
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
