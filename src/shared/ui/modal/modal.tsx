'use client';
import React from 'react';
import cls from './styled/modal.module.scss';
import { useAppSelector } from '../../redux/hooks/hooks';
import Portal from '../portal/portal';

interface IModalProps {
    show: boolean;
    closing: boolean;
    children: React.ReactNode;
}

const Modal = ({ children, show, closing }: IModalProps) => {

    return (
        <div className={`${cls.wrapper} ${show && cls.active} ${closing && cls.isClosing}`}>
            <div className={cls.content}>{children}</div>
        </div>
    );
};

export default Modal;
