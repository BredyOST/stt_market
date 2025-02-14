import React from 'react';
import cls from './styled/tabs.module.scss';
import { ForFunc  } from '../../../entities/others';
import CustomButton from '../сustomButton/CustomButton';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hooks';
import { formsAddProfileActions } from '../../redux/slices/formsAddProfileSlice/formsAddProfileSlice';
import {IndicatorsForUi, TabsOptions} from "../../../entities/uiInterfaces/uiInterfaces";
import {authActions} from "../../redux/slices/authSlice/authSlice";

export interface ITabsProps {
    options: TabsOptions[];
    classNameWrapper: string;
    classNameBtn:string
    onClickHandler: (id:number) => void;
    activeTabId:number;
    activeClass:string;
    notActive:string;
}

const Tabs = ({options,
         classNameWrapper,
         onClickHandler,
         classNameBtn,
         activeTabId,
         activeClass,
         notActive
    }: ITabsProps) => {

        const dispatch = useAppDispatch();
        // const { tab } = useAppSelector((state) => state.formsAddProfile);
        // const { addTab } = formsAddProfileActions;
        //
        // const changeActiveTab: ForFunc<number, void> = (label: number): void => {
        //     dispatch(addTab(label));
        // };


        return (
            <div className={classNameWrapper}>
                {options.length > 0 &&
                    options.map((item: TabsOptions) => (
                        <button
                            onClick={() => onClickHandler(item.id)}
                            className={`${classNameBtn} ${+activeTabId == +item?.id ? activeClass : notActive}`}
                            type='button'
                            key={item.id}
                        >
                            {item.label}
                        </button>
                    ))}
            </div>
        );
    }

export default Tabs;
