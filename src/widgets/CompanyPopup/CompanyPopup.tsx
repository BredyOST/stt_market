import React from 'react';
import cls from './CompanyPopup.module.scss';
import { ReactComponent as SvgFavourite } from '../../assets/svg/favorites.svg';
import CustomButton from '../../shared/ui/сustomButton/CustomButton';
import { ForFunc } from '../../entities/others';
import { useModal, useProfile } from '../../shared/helpers/hooks';

interface CompanyPopupProps {
    profile?: any;
}

const CompanyPopup: React.FC<CompanyPopupProps> = ({ profile }) => {
    /** управление модальными окнами*/
    const { openModal, closeModal } = useModal();
    /** изменение состояний profileServiceSlice*/
    const updateProfileServiceState = useProfile();

    /** для отображения попапа донатов*/
    const openVideo: ForFunc<number, void> = (id: number) => {
        updateProfileServiceState('isOpen', 'reals');
        updateProfileServiceState('chosenFavouritesIdReals', id);
        openModal('modalReals');
    };

    return (
        <CustomButton type='button' classNameBtn={cls.custom_popup} onClick={() => openVideo(profile.id)}>
            <div className={cls.info_profile}>
                <div className={cls.logo}></div>
                <div className={cls.info}>
                    <h3>{profile?.name}</h3>
                    {profile?.description && <div>{profile.description}</div>}
                </div>
            </div>
            <div className={cls.fallovers}>
                <SvgFavourite className={cls.svg_icon} />
                <div>158</div>
            </div>
        </CustomButton>
    );
};

export default CompanyPopup;
