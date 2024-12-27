'use client';
import React from 'react';
import { modalAddProfileActions } from '../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice';
import { useAppDispatch, useAppSelector } from '../../shared/redux/hooks/hooks';
import cls from './styled/openModalAddProfile.module.scss';
import Portal from '../../shared/ui/portal/portal';
import Modal from '../../shared/ui/modal/modal';
import AddProfile from '../../features/addProfile/addProfile';

const OpenModalAddProfile = () => {
    const dispatch = useAppDispatch();
    const { modalAddProfileState } = useAppSelector((state) => state.modalWindow);
    const { changeModalAddProfileState } = modalAddProfileActions;

    const changeStateModalWindow = () => {
        dispatch(changeModalAddProfileState(!modalAddProfileState));
    };

    return (
        <div>
            <div className={cls.wrapper}>
                <h3 className={cls.title}>Want to add your profile?</h3>
                <div>
                    <button className={cls.buttonModal} onClick={changeStateModalWindow}>
                        Add
                    </button>
                </div>
            </div>
            {modalAddProfileState && (
                <Portal whereToAdd={document.body}>
                <Modal>
                        <AddProfile />
                    </Modal>
                </Portal>
            )}
        </div>
    );
};

export default OpenModalAddProfile;
