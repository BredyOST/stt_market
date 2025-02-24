import React, { ReactElement, ReactNode } from 'react';
import cls from './styled/customButtonStyled.module.scss';
import { IndicatorsForUi } from '../../../entities/uiInterfaces/uiInterfaces';
import ReactDOM from 'react-dom/client';

interface ICustomButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    type: 'button' | 'submit' | 'reset';
    indicator?: IndicatorsForUi;
    uploadIcon?: ReactElement;
    onClick?: (args: any) => void;
    children?: ReactNode | string | number;
    active?: boolean;
    classnameWrapper?: string;
    classNameBtn?: string;
}

const CustomButton = ({ type, indicator, onClick, children, active, classnameWrapper, classNameBtn }: ICustomButtonProps) => {
    return (
        <label className={classnameWrapper}>
            <button className={classNameBtn} type={type} onClick={onClick}>
                {children}
            </button>
        </label>
    );

    if (indicator === IndicatorsForUi.addGeoToProfile) {
        return (
            <label className={cls.coverBtnGeo}>
                <button className={cls.geo} type={type} onClick={onClick}>
                    {children}
                </button>
            </label>
        );
    }

    if (indicator === IndicatorsForUi.tabsProfile) {
        return (
            <button className={active ? `${cls.tabs} ${cls.active}` : cls.tabs} type={type} onClick={onClick}>
                {children}
            </button>
        );
    }

    if (indicator === IndicatorsForUi.wallet || !indicator) {
        return (
            <div className={classnameWrapper}>
                <button className={classNameBtn} type={type} onClick={onClick}>
                    {children}
                </button>
            </div>
        );
    }

    if (indicator === IndicatorsForUi.loginIn) {
        return (
            <div className={cls.wrapper}>
                <button className={cls.btn} type={type} onClick={onClick}>
                    {children}
                </button>
            </div>
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
