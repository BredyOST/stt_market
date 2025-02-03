import React from 'react';
import cls from './smartContractData.module.scss';
import {useTranslation} from "react-i18next";
import ChartBlock from "../chart/chart";

const COUNTERS = [
    {id:1, label: 'transaction'},
    {id:2, label: 'holders', },
    {id:3, label: 'multiplicatons'},
    {id:4, label: 'userProfiles'},
    {id:5, label: 'insurance'},
];


const SmartContractData = () => {

    const {t} = useTranslation()

    return (
        <div className={cls.wrapper}>
            <div className={cls.coverSubTitle}>
                <h3 className={cls.subTitle}>{t("justClick")}
                </h3>
            </div>
            <div className={cls.bodyBlock}>
                <div className={cls.cycleInfo}>
                    <img className={cls.image} src="/img/cycle.png" alt="image"/>
                    {COUNTERS?.length >= 1 && COUNTERS.map((item) => (
                        <div className={`${cls.coverTextInto} ${cls[item.label]}`}>
                            <div className={cls.text}>1234</div>
                            <h3 className={cls.title}>{t(item.label)}</h3>
                        </div>
                    ))}
                </div>
                <div className={cls.chartBlock}>
                    <ChartBlock indicator = {'noAuth'} />
                    <div className={cls.coverInfoBlock}>
                        <div className={`${cls.infoBlock} ${cls.first}`}>
                            <h3 className={cls.infoBlockTitle}>total supply</h3>
                            <div className={cls.infoBlockCount}>346.6M</div>
                            <div className={cls.infoBlockLabel}>STT</div>
                        </div>
                        <div className={`${cls.infoBlock} ${cls.second}`}>
                            <h3 className={cls.infoBlockTitle}>total supply</h3>
                            <div className={cls.infoBlockCount}>346.6M</div>
                            <div className={cls.infoBlockLabel}>STT</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartContractData;