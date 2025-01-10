'use client';
import React from 'react';
import cls from './styled/modal.module.scss';
import { useAppSelector } from '../../redux/hooks/hooks';
import Portal from '../portal/portal';

interface IModalProps {
    children: React.ReactNode;
}

const Modal = ({ children }: IModalProps) => {
    const { modalAddProfileState, isClosingModalAddProfileState } = useAppSelector((state) => state.modalWindow);

    return (
        <div className={`${cls.wrapper} ${modalAddProfileState && cls.active} ${isClosingModalAddProfileState && cls.isClosing}`}>
            <div className={cls.content}>{children}</div>
        </div>
    );
};

export default Modal;
