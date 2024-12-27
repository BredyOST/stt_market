'use client';
import React from 'react';
import cls from './styled/tabs.module.scss';
import { ForFunc, IndicatorsForUi, TabsOptions } from '../../../entities/IndicatorsForUi';
import CustomButton from '../сustomButton/CustomButton';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { formsAddProfileActions } from '../../redux/slices/formsAddProfileSlice/formsAddProfileSlice';

export interface ITabsProps {
    options: TabsOptions[];
}

const Tabs = React.memo(({ options }: ITabsProps) => {
    const dispatch = useAppDispatch();
    const { tab } = useAppSelector((state) => state.formsAddProfile);
    const { addTab } = formsAddProfileActions;

    const changeActiveTab: ForFunc<number, void> = (label: number): void => {
        dispatch(addTab(label));
    };

    return (
        <div className={cls.wrapper}>
            {options.length > 0 &&
                options.map((item: TabsOptions) => (
                    <CustomButton
                        active={item.label == tab}
                        onClick={() => changeActiveTab(item.label)}
                        type='button'
                        indicator={IndicatorsForUi.tabsProfile}
                        key={item.id}
                    >
                        {item.label}
                    </CustomButton>
                ))}
        </div>
    );
}, (prevProps, nextProps) => {
    return prevProps.options === nextProps.options;
});

export default Tabs;
