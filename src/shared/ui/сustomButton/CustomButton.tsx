import React, { ReactElement } from 'react';
import cls from './styled/customButtonStyled.module.scss';
import {IndicatorsForUi} from "../../../entities/uiInterfaces/uiInterfaces";

interface ICustomButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    type: 'button' | 'submit' | 'reset';
    indicator: IndicatorsForUi;
    uploadIcon?: ReactElement;
    onClick?: (args: any) => void;
    children?: ReactElement | string | number;
    active?: boolean;
}

const CustomButton = ({ type, indicator, onClick, children, active }: ICustomButtonProps) => {
    if (indicator === IndicatorsForUi.addGeoToProfile) {
        return (
            <label className={cls.coverBtnGeo}>
                <button className={cls.geo} type={type} onClick={onClick}>
                    {children}
                </button>
            </label>
        );
    }
    if (indicator === IndicatorsForUi.trashAddProfile) {
        return (
            <label className={cls.coverBtnTrash}>
                <button className={cls.trash} type={type} onClick={onClick}>
                    {children}
                </button>
            </label>
        );
    }
    if (indicator === IndicatorsForUi.addCurrentGeoToProfile) {
        return (
            <button className={cls.okey} type={type} onClick={onClick}>
                {children}
            </button>
        );
    }
    if (indicator === IndicatorsForUi.tabsProfile) {
        return (
            <button className={active ? `${cls.tabs} ${cls.active}` : cls.tabs} type={type} onClick={onClick}>
                {children}
            </button>
        );
    }

    if (indicator === IndicatorsForUi.simpleButton) {
        return (
            <button className={cls.simple} type={type} onClick={onClick}>
                {children}
            </button>
        );
    }
    if (indicator === IndicatorsForUi.withoutStyle) {
        return (
            <button className={cls.withoutStyle} type={type} onClick={onClick}>
                {children}
            </button>
        );
    }

    if (indicator === IndicatorsForUi.sttBonus) {
        return (
            <button className={cls.greenBtn} type={type} onClick={onClick}>
                {children}
            </button>
        );
    }

    return null;
};

export default CustomButton;
