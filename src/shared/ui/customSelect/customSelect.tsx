'use client';
import React from 'react';
import { ForFunc, IndicatorsForUi } from '../../../entities/IndicatorsForUi';
import cls from './styled/custom.module.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { formsAddProfileActions } from '../../redux/slices/formsAddProfileSlice/formsAddProfileSlice';
import { TITLES } from '../../../entities/pageTitiles';
import CustomButton from '../сustomButton/CustomButton';
import SvgClose from '../../../../public/svg/close.svg';
import SvgArrow from '../../../../public/svg/arrow.svg';

interface ICustomSelectProps {
    options: { label: string; value: string | number }[];
    onSelect?: (value: string | number) => void;
    placeholder: string;
    arrowIndicator?: boolean;
}

const CustomSelect = ({ options, onSelect, placeholder, arrowIndicator }: ICustomSelectProps) => {
    const dispatch = useAppDispatch();

    /** STATES*/
    const { language } = useAppSelector((state) => state.formsAddProfile);
    /** для показа выпадающего меню*/
    const [isOpen, setIsOpen] = React.useState<boolean>(false);

    /** ACTIONS*/
    const { addLanguage } = formsAddProfileActions;

    /** изменение состояния для показа выпадающего меню и его скрытия*/
    const openMenu = () => {
        setIsOpen((prev) => !prev);
    };

    /** выбор языка из выпадающего меню*/
    const handleChooseOption: ForFunc<number | string, void> = (option: string) => {
        dispatch(addLanguage(option));
        setIsOpen(false);
    };

    return (
        <div className={cls.wrapper}>
            <div className={cls.CustomSelect} onClick={openMenu}>
                {language ? ` Language ${language}` : placeholder}
                <SvgArrow className={isOpen ? `${cls.svgArrow} ${cls.active}` : `${cls.svgArrow}`} />
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
                                    {option.label}
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
