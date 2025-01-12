import React from 'react';
import cls from './styled/sttBonus.module.scss'
import SttBonusModule from "../../widgets/sttBonusModule/sttBonusModule";
import {useTranslation} from "react-i18next";

interface ISttBonusProps {
    withoutWallet: any
    account: any
    provider: any
}


const SttBonus = ({withoutWallet, account, provider}:ISttBonusProps) => {

    const { t, i18n } = useTranslation();


    /**
     * @referrerAddress - рефер адресс
     * @signer - кого регистрируем
     * */


    // async function registerReferral(referrerAddress) {
    //     const providerMain = provider.provider; // Провайдер, например, MetaMask
    //     const signer = await providerMain.getSigner(); // Получаем подписанта
    //     console.log(signer)
    //     const userAddress = await signer.getAddress();
    //     // console.log(signer.address);
    //     // console.log(accountc)
    //     // console.log(signer)
    //
    //     const referralContractAbi = [
    //         {
    //             "inputs": [],
    //             "name": "getReferrer",
    //             "outputs": [
    //                 {
    //                     "internalType": "address",
    //                     "name": "",
    //                     "type": "address"
    //                 }
    //             ],
    //             "stateMutability": "view",
    //             "type": "function"
    //         },
    //         {
    //             "inputs": [
    //                 {
    //                     "internalType": "address",
    //                     "name": "referrer",
    //                     "type": "address"
    //                 }
    //             ],
    //             "name": "registerReferral",
    //             "outputs": [],
    //             "stateMutability": "nonpayable",
    //             "type": "function"
    //         }
    //     ];
    //
    //     const contract = new ethers.Contract(referrerAddress, referralContractAbi, signer); // Адрес контракта реферальной системы
    //
    //     // console.log(contract);
    //     // const referrer = await contract.getReferrer(account);
    //     // console.log(referrer);
    //
    //     const tx = await contract.registerReferral(referrerAddress); // Регистрируем реферала
    //     // console.log("Referral registered:", tx.hash);
    //
    //     // Ожидаем подтверждения транзакции
    //     // const receipt = await tx.wait();
    //     // console.log("Transaction confirmed:", receipt);
    // }

    // registerReferral('0x2')


    async function deploy() {
        // Получаем провайдер и signer (например, MetaMask)
        // const providerMain = provider;
        // const signer = await providerMain.getSigner();
        //
        // const bytecode = fs.readFileSync("path/to/ReferralSystemBytecode.bin", "utf8");
        //
        // console.log(signer);
        // // Создаем контрактный фабрику для деплоя
        // const factory = new ethers.ContractFactory(abi, bytecode, signer);

        // Разворачиваем контракт
        // const contract = await factory.deploy();

        // Ожидаем завершения деплоя
        // await contract.deployed();

        // console.log("Contract deployed to:", contract.address);
    }

    deploy()



    return (
        <div className={cls.wrapper}>
            <div className={cls.cover}>
                <h3 className={cls.title}>{t('Welcome to React')}</h3>
                <div className={cls.text}>{t('sttBonus')}</div>
            </div>
            <div className={cls.coverRight}>
                <SttBonusModule/>
            </div>
        </div>
    );
};

export default SttBonus;