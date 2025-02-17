import React from 'react';
import cls from './CompanyPopup.module.scss'
import {ReactComponent as SvgFavourite} from "../../assets/svg/favorites.svg";

interface CompanyPopupProps {
    name: string;
    description?: string;
    address?: string;
}


const CompanyPopup: React.FC<CompanyPopupProps> = ({ name, description, address }) => {
    return (
        <div className={cls.custom_popup}>
            <div className={cls.info_profile}>
                <div className={cls.logo}></div>
                <div className={cls.info}>
                    <h3>{name}</h3>
                    {description && <div>{description}</div>}
                </div>
            </div>
            <div className={cls.fallovers}>
                <SvgFavourite className={cls.svg_icon}/>
                <div>158</div>
            </div>
        </div>
    );
};

export default CompanyPopup;