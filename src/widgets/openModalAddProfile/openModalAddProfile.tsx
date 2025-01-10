import React from 'react';
import { modalAddProfileActions } from '../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice';
import { useAppDispatch, useAppSelector } from '../../shared/redux/hooks/hooks';
import cls from './styled/openModalAddProfile.module.scss';
import Portal from '../../shared/ui/portal/portal';
import Modal from '../../shared/ui/modal/modal';
import AddProfile from '../../pages/addProfile/addProfile';
import {arbitrumCurrent} from "../../helpers/contracts";
import { getAddress, formatEther } from "ethers";
import { BrowserProvider,  } from "ethers";


const OpenModalAddProfile = (props) => {
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
                <h3 className={cls.title}>Want to add your profile?</h3>
                <div>
                    <button className={cls.buttonModal} onClick={changeStateModalWindow}>
                        add
                    </button>
                </div>
            </div>
            {modalAddProfileState && (
                <Portal whereToAdd={document.body}>
                    <Modal>
                        <AddProfile account={props.account}  />
                    </Modal>
                </Portal>
            )}
        </div>
    );
};

export default OpenModalAddProfile;
