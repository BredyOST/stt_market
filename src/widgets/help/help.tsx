import React from 'react';
import cls from "./help.module.scss";
import CustomButton from "../../shared/ui/сustomButton/CustomButton";
import {useTranslation} from "react-i18next";

const Help = () => {

    const {t} = useTranslation();


    return (
        <div>
            <div className={cls.wrapper}>
                <div className={cls.coverSubTitle}>
                    <h3 className={cls.title}>
                        {t("ContactUs")}
                    </h3>
                </div>
                <div className={cls.linkCover}>
                    <a className={cls.link} href="https://t.me/stt_info_bot" target="_blank" >{t('ContactUs')}</a>
                </div>
            </div>
        </div>
    );
};

export default Help;