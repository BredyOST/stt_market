import React from 'react';
import cls from './infoNoAuth.module.scss';
import { useTranslation } from 'react-i18next';
import CartBlock from '../cartBlock/cartBlock';
import { PICTURES_WHEN_USER_NOT_AUTH } from '../../shared/const/index.const';
import { IPicturesNotAuth } from '../../entities/others';

const UnauthorizedUser = () => {
    const { t, i18n } = useTranslation();

    return (
        <div className={cls.wrapper}>
            <div className='just__container-big'>
                <div className={cls.content_cover}>
                    <div className={`${cls.title} ${cls[i18n.language]}`}>{t('agents')}</div>
                    <div className={cls.cart_wrapper}>
                        <CartBlock />
                    </div>
                </div>
            </div>
            {PICTURES_WHEN_USER_NOT_AUTH?.map((item: IPicturesNotAuth) => (
                <div key={item.id} className={item.id == 1 ? cls.illustration_left : cls.illustration_right}>
                    <img src={item.link} alt={item.description} />
                </div>
            ))}
            <div className={cls.cart_wrapper_down}>
                <CartBlock />
            </div>
        </div>
    );
};

export default UnauthorizedUser;
