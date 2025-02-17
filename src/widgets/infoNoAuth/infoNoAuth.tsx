import React from 'react';
import cls from './infoNoAuth.module.scss'
import {useTranslation} from "react-i18next";
import CartBlock, {arrayCart} from "../cartBlock/cartBlock";

const UnauthorizedUser = () => {

    const {t, i18n} = useTranslation();

    return (
        <div className={cls.wrapper}>
            <div className='just__container-big'>
                <div className={cls.content_cover}>
                    <div className={`${cls.title} ${i18n.language === 'en' ? cls.en : cls.ru}`}>{t('agents')}</div>
                    <div className={cls.cart_wrapper}>
                        <CartBlock/>
                    </div>
                </div>
            </div>
            <div className={cls.illustration_left}>
                <img src="/img/noAuth.png" alt="image"/>
            </div>
            <div className={cls.illustration_right}>
                <img src="/img/flower.png" alt="image"/>
            </div>
                <div className={cls.cart_wrapper_down}>
                    <CartBlock/>
                </div>
        </div>
    );
};

export default UnauthorizedUser;