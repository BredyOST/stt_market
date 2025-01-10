'use client';
import React from 'react';
import {ForFunc } from '../../../entities/IndicatorsForUi';
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

interface ICustomSelectProps {
    options: ILanguageOption[];
    onSelect?: (value: string | number) => void;
    placeholder?: string;
    arrowIndicator?: boolean;
    indicator:SelectsIndicators
}

const CustomSelect = ({ options, onSelect, placeholder, arrowIndicator, indicator }: ICustomSelectProps) => {
    const dispatch = useAppDispatch();

    /** STATES*/
    const { language } = useAppSelector((state) => state.formsAddProfile);
    const { currentLanguage } = useAppSelector((state) => state.Language);
    /** для показа выпадающего меню профилей*/
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    /** для показа выпадающего меню языков*/
    const [isOpenLanguage, setIsOpenLanguage] = React.useState<boolean>(false);
    /** ACTIONS*/
    const { addLanguage } = formsAddProfileActions;
    const { changeLanguage }  = languageActions;
    /** изменение состояния для показа выпадающего меню и его скрытия*/
    const openMenu = () => {
        setIsOpen((prev) => !prev);
    };
    /** изменение состояния для показа выпадающего меню и его скрытия*/
    const openMenuLanguage = () => {
        setIsOpenLanguage((prev) => !prev);
    };
    /** выбор языка из выпадающего меню*/
    const handleChooseOption: ForFunc<number | string, void> = (option: string) => {
        dispatch(addLanguage(option));
        setIsOpen(false);
    };

    const { t, i18n } = useTranslation()

    /** выбор языка из выпадающего меню*/
    const handleChooseLanguage: ForFunc<Language, void> = (option: Language) => {
        i18n.changeLanguage(option);

        dispatch(changeLanguage(option));
        setIsOpenLanguage(false);
    };


    if(indicator === SelectsIndicators.address) {
        return (
            <div className={cls.wrapper}>
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
                                        className={option.value === language ? cls.active : undefined}
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
            <div className={cls.wrapper}>
                <div className={cls.CustomSelectLanguage} onClick={openMenuLanguage}>
                    {i18n.language}
                </div>
                {isOpenLanguage && (
                    <ul className={`${cls.bodySelectLanguage} ${isOpenLanguage && cls.show}` }>
                        {isOpenLanguage &&
                            options?.length > 0 &&
                            options?.map((option) => (
                                <li
                                    className={option.value === language ? cls.active : undefined}
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

    return null;

};

export default CustomSelect;
