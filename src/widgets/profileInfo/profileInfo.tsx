import React from 'react';
import cls from './profile.module.scss';
import CustomButton from '../../shared/ui/сustomButton/CustomButton';
import { useTranslation } from 'react-i18next';
import { useAppKit } from '@reown/appkit/react';
import { useModal } from '../../shared/helpers/hooks';
import { INFO_USER_HEADER } from '../../shared/const/index.const';
import { IInfoUserInHeader, labelProfileInfo } from '../../entities/others';
import { useAppSelector } from '../../shared/redux/hooks/hooks';
import {ReactComponent as SvgProfile} from "./../../assets/svg/profile.svg";

interface IProfileInfoProps {
    showInTheHeader: boolean;
    className: string;
}

const ProfileInfo = ({ className }: IProfileInfoProps) => {
    /** STATES */
    const { userInfo } = useAppSelector((state) => state.usersInfo);

    /** HOOKS*/
    const { t } = useTranslation();
    /** управление модальными окнами*/
    const { openModal } = useModal();
    /** appkit*/
    const { open } = useAppKit();

    /** FUNCTIONS*/
    /** открыть попап добавления профиля*/
    const openModalAddProfile = () => {
        openModal('modalAddProfileState');
    };

    return (
        <div className={`${cls.wrapper} ${className}`}>
            <div className={cls.logo}>
                {userInfo?.profile?.user_logo_url &&
                    <img className={cls.svgLogo} src={userInfo?.profile?.user_logo_url} alt='pictures'/>
            }
            {!userInfo?.profile?.user_logo_url &&
                <SvgProfile className={cls.svgProfile}/>
            }
            </div>
            <div className={cls.info_user}>
                {!userInfo?.profile?.id && (
                    <div className={cls.name_user}>
                        <div className={cls.name}>No name</div>
                    </div>
                )}
                {userInfo?.profile?.id && (
                    <div className={cls.name_user}>
                        <div className={cls.name}>{userInfo?.profile?.name}</div>
                        <div className={cls.status}>creator</div>
                    </div>
                )}
                {!userInfo?.profile?.id && (
                    <CustomButton classNameBtn={cls.btn_add_profile} type='button' onClick={openModalAddProfile}>
                        <div className={cls.btn_add_profile_text}>{t('addProfile')}</div>
                    </CustomButton>
                )}
                {userInfo?.profile?.id && (
                    <div className={cls.interaction_block}>
                        {INFO_USER_HEADER?.length > 0 &&
                            INFO_USER_HEADER.map((item: IInfoUserInHeader) => (
                                <div key={item.id} className={cls.info_block}>
                                    {item.svg}
                                    <div>
                                        {item.label === labelProfileInfo.donations && <div>18</div>}
                                        {item.label === labelProfileInfo.favourites && <div>1.8M</div>}
                                        {item.label === labelProfileInfo.subscribers && (
                                            <div>{userInfo?.profile?.followers_count >= 1 ? userInfo?.profile?.followers_count : '0'}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileInfo;
