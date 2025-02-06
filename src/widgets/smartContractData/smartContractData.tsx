import React, {useEffect, useState} from 'react';
import cls from './smartContractData.module.scss';
import {useTranslation} from "react-i18next";
import ChartBlock from "../chart/chart";
import {ethers} from "ethers";
import {
    exchangeContractAddress, reverseUsdtSttAddress,
    tokenContractAbi,
    tokenContractAddress,
    usdtContractAbi,
    usdtContractAddress
} from "../../helpers/contracts";
import axios from "axios";
import {useAppSelector} from "../../shared/redux/hooks/hooks";
import {Link} from "react-router-dom";

const COUNTERS = [
    {id:1, label: 'transaction'},
    {id:2, label: 'holders', },
    {id:3, label: 'multiplicatons'},
    {id:4, label: 'userProfiles'},
    {id:5, label: 'insurance'},
];


const SmartContractData = () => {

    const {t} = useTranslation()

    /** states*/
    const [totalSupply, setTotalSupply] = React.useState(0.0);
    const [multiBalance, setMultiBalance] = React.useState(0.0)
    const [contractBalance, setContractBalance] = React.useState(0.0)

    const {loggedIn, account, provider} = useAppSelector(state => state.authSlice)


    /** functions*/
    async function handleBalancesOthers() {
        try {
            // Получаем общую эмиссию токена
            const totalSupplyRes = await axios.get(
                'https://api.arbiscan.io/api',
                {
                    params: {
                        module: 'stats',
                        action: 'tokensupply',
                        contractaddress: '0x1635b6413d900D85fE45C2541342658F4E982185',
                        apikey: '2U5WS2IBB4WYBA99AJZ8P69YTD4BZJMURW',
                    },
                }
            );

            const totalSupply = (+(totalSupplyRes.data.result / Math.pow(10, 9))/1000000).toFixed(1)
            setTotalSupply(+totalSupply);

            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Получаем баланс контракта USDT
            const contractBalanceRes = await axios.get(
                'https://api.arbiscan.io/api',
                {
                    params: {
                        module: 'account',
                        action: 'tokenbalance',
                        contractaddress: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
                        address: '0x88af31e521fca0ed362582aa231189849f1e3b2e',
                        apikey: '2U5WS2IBB4WYBA99AJZ8P69YTD4BZJMURW',
                    },
                }
            );

            const contractBalance = (+(contractBalanceRes.data.result / Math.pow(10, 6))/1000).toFixed(1)
            setContractBalance(+contractBalance);

            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Получаем баланс для multiBalance
            const multiBalanceRes = await axios.get(
                'https://api.arbiscan.io/api',
                {
                    params: {
                        module: 'account',
                        action: 'tokenbalance',
                        contractaddress: '0x1635b6413d900d85fe45c2541342658f4e982185',
                        address: '0x11F2754320C961f4fFbC0174C8B4587903F816Dc',
                        apikey: '2U5WS2IBB4WYBA99AJZ8P69YTD4BZJMURW',
                    },
                }
            );
            const multiBalance = +(multiBalanceRes.data.result / Math.pow(10, 9))
                .toFixed(2)
                .toString()
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
                .replace('.', ',');
            setMultiBalance(multiBalance);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    }

    async function handleBalances() {
        if (account) {
            const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider);
            const usdtContract = new ethers.Contract(usdtContractAddress, usdtContractAbi, provider);
            let totalSt = 0.0
            let totalUs = 0.0
            let fullSt = 0.0
            let fullUs = 0.0
            const res = await contract.totalSupply()
            totalSt = +(Number(res) / Math.pow(10, 9)).toFixed(2)
            fullSt = Number(res) / Math.pow(10, 9)
            const balanceOfRes = await usdtContract.balanceOf(exchangeContractAddress)
            totalUs = +(Number(balanceOfRes) / Math.pow(10, 6)).toFixed(2)
            fullUs = Number(balanceOfRes) / Math.pow(10, 6)
            setTotalSupply(+totalSt.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ').replace('.', ','))
            setContractBalance(+totalUs.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ').replace('.', ','))
            const contractBalance = await contract.balanceOf(reverseUsdtSttAddress)
            let available = (parseFloat(String(Number(contractBalance) / Math.pow(10, 9))) - 0.01).toFixed(2)
            setMultiBalance(+available.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ').replace('.', ','))
        } else {
            handleBalancesOthers()
        }
    }

    useEffect(() => {
        handleBalances()
    }, []);


    return (
        <div className={cls.wrapper}>
            <div className={cls.cover_subtitle}>
                <h3 className={cls.subTitle}>{t("justClick")}
                </h3>
            </div>
            <div className={cls.body_block}>
                <div className={cls.cycle_info}>
                    <img className={cls.image} src="/img/cycle.png" alt="image"/>
                    {COUNTERS?.length >= 1 && COUNTERS.map((item) => (
                        <div key={item.id} className={`${cls.cover_text_into} ${cls[item.label]}`}>
                            <div className={cls.text}>1234</div>
                            <h3 className={cls.title}>{t(item.label)}</h3>
                        </div>
                    ))}
                </div>
                <div className={cls.chart_block}>
                    <ChartBlock indicator = {'noAuth'} />
                    <div className={cls.cover_info_block}>
                        <Link
                            to={'https://arbiscan.io/address/0x88af31e521fca0ed362582aa231189849f1e3b2e'}
                            className={`${cls.info_block} ${cls.first}`}
                            target="_blank" rel="noopener noreferrer"
                        >
                            <h3 className={cls.info_block_title}>total supply</h3>
                            <div className={cls.info_block_count}>{totalSupply}M</div>
                            <div className={cls.info_block_label}>STT</div>
                        </Link>
                        <Link
                            to={"https://arbiscan.io/address/0x11F2754320C961f4fFbC0174C8B4587903F816Dc"}
                            className={`${cls.info_block} ${cls.second}`}
                            target="_blank" rel="noopener noreferrer"
                        >
                            <h3 className={cls.info_block_title}>Exchange Contract</h3>
                            <div className={cls.info_block_count}>{contractBalance}K</div>
                            <div className={cls.info_block_label}>USDT</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartContractData;





