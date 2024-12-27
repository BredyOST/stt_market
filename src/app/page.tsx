import cls from './page.module.scss';
import React from 'react';
import OpenModalAddProfile from '../widgets/openModalAddProfile/openModalAddProfile';
import { ToastContainer } from 'react-toastify';

function Home() {
    return (
        <div className={cls.page}>
            <div className='page__container'>
                <OpenModalAddProfile />
            </div>
            <ToastContainer position='top-right' />
        </div>
    );
}

export default Home;
