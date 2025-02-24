import React from 'react';
import { modalAddProfileActions } from '../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice';
import { useAppDispatch } from '../../shared/redux/hooks/hooks';
import cls from './styled/closePopup.module.scss';
import { ReactComponent as SvgClose } from '../../assets/svg/close.svg';

const ClosePopup = React.memo(() => {
    const dispatch = useAppDispatch();

    /** ACTIONS*/
    const { changeModalAddProfileState, changeModalAddProfileStateIsClosing } = modalAddProfileActions;

    /** FUNCTIONS*/
    /** для закрытия модального окна*/
    const closeModal: () => void = () => {
        dispatch(changeModalAddProfileStateIsClosing(true));
        setTimeout(() => dispatch(changeModalAddProfileState(false)), 500);
    };

    return (
        <button className={cls.coverClose} onClick={closeModal}>
            <SvgClose className={cls.closeIcon} onClick={closeModal} />
        </button>
    );
});

export default ClosePopup;
