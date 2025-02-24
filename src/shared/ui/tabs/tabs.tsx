import React from 'react';
import { useAppDispatch } from '../../redux/hooks/hooks';
import { TabsOptions } from '../../../entities/uiInterfaces/uiInterfaces';

export interface ITabsProps {
    options: TabsOptions[];
    classNameWrapper: string;
    classNameBtn: string;
    onClickHandler: (id: number) => void;
    activeTabId: number;
    activeClass: string;
    notActive: string;
}

const Tabs = ({ options, classNameWrapper, onClickHandler, classNameBtn, activeTabId, activeClass, notActive }: ITabsProps) => {
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
};

export default Tabs;
