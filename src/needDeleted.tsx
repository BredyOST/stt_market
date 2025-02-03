import React from 'react';
import axios from "axios";
import {
    arbitrumCurrent, exchangeContractAddress,
    tokenContractAbi,
    tokenContractAddress,
    usdtContractAbi,
    usdtContractAddress
} from "./helpers/contracts";
import {ethers} from "ethers";

const NeedDeleted = () => {

    // async function prepareTelegram() {
    //     try {
    //         const data = {'account': account}
    //         const response = await axios.post('https://stt.market/api/notifications/create/', data)
    //         if(response.status === 200) {
    //             let dd = response.data
    //             if (dd.status === 400) {
    //                 setToastText(dd.message)
    //                 setToastErrorShow(true)
    //
    //             } else if (dd.status === 200) {
    //                 setTelegramValid(dd.valid)
    //                 setTelegramCode(dd.code)
    //                 setShowTelegramModal(true)
    //             }
    //         }
    //     } catch(err) {
    //         console.log(err);
    //     }
    // }

    // async function changeTelegram() {
    //     try {
    //         const data = {'account': account}
    //         const response = await axios.post('https://stt.market/api/notifications/change/', data)
    //         if(response.status === 200) {
    //             let dd = response.data
    //             if (dd.status === 400) {
    //                 setToastText(dd.message)
    //                 setToastErrorShow(true)
    //             } else if (dd.status === 200) {
    //                 dispatch((addTelegramUsername('')))
    //                 // setTelegramUsername('')
    //                 setShowTelegramChangeModal(false)
    //                 prepareTelegram()
    //             }
    //         }
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    // async function checkTelegram(requested=false) {
    //     try {
    //         const data = {'account': props.account}
    //         const response = await axios.post('https://stt.market/api/notifications/check/', data)
    //         if (response.status === 200) {
    //             let dd = response.data
    //             dispatch(addTelegramUsername(dd.username))
    //             // setTelegramUsername(dd.username)
    //             if (requested) {
    //                 if (dd.username !== '') {
    //                     setShowTelegramModal(false)
    //                     setToastCompleteShow(true)
    //                 } else {
    //                     setToastText('Are you sure you have sent the code?')
    //                     setToastErrorShow(true)
    //                 }
    //             }
    //         }
    //     } catch(err) {
    //         console.log(err);
    //     }
    // }

    async function handleLogin() {

        try {
            const result = await window.ethereum.request({ method: "eth_chainId" });
            // if (result === arbitrumCurrent[0]['chainId'] || result === 42161) {
            //     try {
            //         const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            //         if (accounts[0]) {
            //             const res_acc = ethers.getAddress(accounts[0]);
            //             const provider = new BrowserProvider(window.ethereum); // Провайдер MetaMask
            //             const signer = await provider.getSigner(); // Подписант
            //             const balance = await provider.getBalance(res_acc); // Получаем баланс в wei
            //             const ref = await provider.getSigner(res_acc);
            //             // setLogin(true);
            //             // setAccount(res_acc);
            //             console.log(`acc ${res_acc}`);
            //             // setProvider(provider);
            //             dispatch(changeStateLoggedIn(true))
            //             // dispatch(addWallet(res_acc))
            //             dispatch(addProvider(provider))
            //             dispatch(addProvider(provider))
            //             dispatch(addAccount(res_acc))
            //         } else {
            //             console.error("Account address is null or undefined.");
            //         }
            //     } catch (error) {
            //         console.log("Could not detect Account", error);
            //     }
            // } else {
            //     alert('Please, connect to Arbitrum Network (' + result + ') does not match with (' + arbitrumCurrent[0]['chainId'] + ')');
            //     handleLogout();
            // }
        } catch (error) {
            console.log("Error fetching chain ID", error);
        }
    }

    /** app*/
    function handleChainChanged(_chainId) {
        // We recommend reloading the page, unless you must do otherwise
        window.location.reload();
    }

    function chainChange() {
        window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: arbitrumCurrent
        });
    }

    React.useEffect(() => {
        // if (window.ethereum && window.ethereum.isMetaMask) {
        //     setMetamaskFound(true)
        // } else {
        //     setMetamaskFound(false)
        //     setTimeout(function () {
        //         setWwModal(true)
        //     }, 3000)
        //     setInterval(function () {
        //         setWwModal(true)
        //     }, 600000)
        // }
        //
        // let rates = []
        //
        // axios.get('https://stt.market/rates')
        //     .then(res => {
        //         res.data.forEach(el => rates.push({date: el.date, tick: parseFloat(el.tick.toFixed(7))}))
        //         if (window.ethereum) {
        //             window.ethereum.request({method: "eth_chainId"}).then((result) => {
        //                 if (result === arbitrumCurrent[0]['chainId'] || result === 42161) {
        //                     const provider_balance = new ethers.BrowserProvider(window.ethereum)
        //                     const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider_balance);
        //                     const usdtContract = new ethers.Contract(usdtContractAddress, usdtContractAbi, provider_balance);
        //                     let fullSt = 0.0
        //                     let fullUs = 0.0
        //
        //                     const getChart = async () => {
        //                         await contract.totalSupply().then(res => {
        //                             fullSt = Number(res) / Math.pow(10, 9)
        //                         })
        //                         await usdtContract.balanceOf(exchangeContractAddress).then(res => {
        //                             fullUs = Number(res) / Math.pow(10, 6)
        //                         })
        //                         let latest_rate = parseFloat((fullUs / fullSt).toFixed(7))
        //                         const today = new Date();
        //                         const yyyy = today.getFullYear();
        //                         let mm:any = today.getMonth() + 1; // Months start at 0!
        //                         let dd:any = today.getDate();
        //                         if (dd < 10) dd = '0' + dd;
        //                         if (mm < 10) mm = '0' + mm;
        //                         const formattedToday = dd + '.' + mm + '.' + yyyy;
        //                         rates.push({"tick": latest_rate, "date": formattedToday})
        //                         dispatch(addSttRates(rates))
        //                     }
        //                     getChart()
        //                     // setSttRates(rates)
        //                     dispatch(addAllowLogin(true))
        //                     // setAllowLogin(true)
        //                 } else {
        //                     dispatch(addAllowLogin(true))
        //                     // setAllowLogin(true)
        //                 }
        //             })
        //         } else {
        //             // setSttRates(rates)
        //             dispatch(addSttRates(rates))
        //             dispatch(addWithoutWallet(true))
        //             // setWithoutWallet(true)
        //             dispatch(changeStateLoggedIn(true))
        //         }
        //     })
    }, [])
    /** */


    return (
        <div>

        </div>
    );
};

export default NeedDeleted;