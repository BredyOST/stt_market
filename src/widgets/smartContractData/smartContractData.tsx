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
import {Link} from "react-router-dom"
import CartBlock from "../cartBlock/cartBlock";


const COUNTERS = [
    {id:1, label: 'transaction', counters: 10203},
    {id:2, label: 'holders', counters: 4053},
    {id:3, label: 'multiplicatons', counters: 1224},
    {id:4, label: 'userProfiles', counters: 1502},
    {id:5, label: 'insurance', counters: 10203},
];


const SmartContractData = () => {

    const {t} = useTranslation()

    /** states*/
    const [totalSupply, setTotalSupply] = React.useState(0.0);
    const [multiBalance, setMultiBalance] = React.useState(0.0)
    const [contractBalance, setContractBalance] = React.useState(0.0)
    const [holders, setHolders] = React.useState<number>(0)
    const [transactions, setTransactions] = React.useState<number>(0)

    const {loggedIn, account, provider} = useAppSelector(state => state.authSlice)

    /** functions*/
    async function getTokenHoldersCount() {
        try {
            const response = await axios.get('https://api.arbiscan.io/api', {
                params: {
                    module: 'account',
                    action: 'tokenholderlist',
                    contractaddress: '0x1635b6413d900D85fE45C2541342658F4E982185', // Адрес контракта токена
                    page: 1,
                    offset: 1000, // Максимальное количество держателей на странице
                    apikey: '2U5WS2IBB4WYBA99AJZ8P69YTD4BZJMURW',
                },
            });

            const holders = response.data.result;
            const holdersCount = holders.length;
            // console.log(`Количество держателей токена: ${holdersCount}`);
            return holdersCount;
        } catch (error) {
            console.error('Ошибка при получении количества держателей:', error);
        }
    }

    async function getTotalTransactions() {
        try {
            let totalTransactions = 0;
            let page = 1;
            let hasMore = true;

            while (hasMore) {
                const response = await axios.get('https://api.arbiscan.io/api', {
                    params: {
                        module: 'account',
                        action: 'tokentx',
                        contractaddress: '0x1635b6413d900D85fE45C2541342658F4E982185', // Адрес контракта токена
                        page: page,
                        offset: 1000, // Максимальное количество транзакций на странице
                        apikey: '2U5WS2IBB4WYBA99AJZ8P69YTD4BZJMURW',
                    },
                });

                const transactions = response.data.result;
                totalTransactions += transactions.length;

                // Если количество транзакций меньше, чем offset, значит это последняя страница
                if (transactions.length < 1000) {
                    hasMore = false;
                } else {
                    page++;
                }
            }

            // console.log(`Общее количество транзакций: ${totalTransactions}`);
            return totalTransactions;
        } catch (error) {
            console.error('Ошибка при получении количества транзакций:', error);
        }
    }

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


            // Получаем количество держателей токена
            const holdersCount = await getTokenHoldersCount();
            // console.log(`Количество держателей токена: ${holdersCount}`);
            setHolders(holdersCount)
            // Получаем общее количество транзакций
            const totalTransactions = await getTotalTransactions();
            // console.log(`Общее количество транзакций: ${totalTransactions}`);
            setTransactions(totalTransactions);


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
                <h3 className={cls.subTitle}>{t("justClick")}</h3>
            </div>
            <div className={cls.body_block}>
                <div className={cls.cycle_info}>
                    <img className={cls.image} src="/_.gif" alt="Example GIF"/>
                    {COUNTERS?.length >= 1 && COUNTERS.map((item) => (
                        <div key={item.id} className={`${cls.cover_text_into} ${cls[item.label]}`}>
                            <div className={cls.text}>
                                {item.label === 'holders' && holders}
                                {item.label === 'transaction' && transactions}
                                {item.label !== 'holders' && item.label !== 'transaction' && item.counters}
                            </div>

                            <h3 className={cls.title}>{t(item.label)}</h3>
                        </div>
                    ))}
                </div>
                <div className={cls.chart_block}>
                    <ChartBlock visibility={true} indicator = {'noAuth'} />
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





