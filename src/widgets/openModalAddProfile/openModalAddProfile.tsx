import React from 'react';
import { modalAddProfileActions } from '../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice';
import { useAppDispatch, useAppSelector } from '../../shared/redux/hooks/hooks';
import cls from './styled/openModalAddProfile.module.scss';
import Portal from '../../shared/ui/portal/portal';
import Modal from '../../shared/ui/modal/modal';
import AddProfile from '../../pages/addProfile/addProfile';
import {useTranslation} from "react-i18next";
import CustomButton from "../../shared/ui/сustomButton/CustomButton";


const OpenModalAddProfile = (props) => {
    const {t} = useTranslation()

    const dispatch = useAppDispatch();
    const { modalAddProfileState } = useAppSelector((state) => state.modalWindow);
    const { changeModalAddProfileState } = modalAddProfileActions;
    const {wallet_number} = useAppSelector((state) => state.formsAddProfile);

    const changeStateModalWindow = () => {
        dispatch(changeModalAddProfileState(!modalAddProfileState));
    };

    return (
        <div>
            <div className={cls.wrapper}>
                <div className={cls.coverSubTitle}>
                    <h3 className={cls.title}>
                        {t("WantToAddProfile")}
                    </h3>
                </div>
                <div>
                    <CustomButton classNameBtn={cls.buttonModal} type='button'
                                  onClick={changeStateModalWindow}>{t('addProfile')}
                    </CustomButton>
                </div>
            </div>
            {modalAddProfileState && (
                <Portal whereToAdd={document.body}>
                    <Modal show={true} closing={false}>
                        <AddProfile account={props.account}/>
                    </Modal>
                </Portal>
            )}
        </div>
    );
};

export default OpenModalAddProfile;
