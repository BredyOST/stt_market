import './wallet.css'
import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import {
    exchangeContractAddress,
    tokenContractAbi, tokenContractAbiCb31, tokenContractAddress, tokenContractAddressCb31,
    usdtContractAbi,
    usdtContractAddress
} from "../../helpers/contracts";
import {Button, Col, Modal, Row} from "react-bootstrap";
import CustomInput from "../../shared/ui/customInput/customInput";
import cls from "../../widgets/sttBonusModule/styled/sttBonusModule.module.scss";
import {ReactComponent as SvgQr} from '../../assets/svg/qr.svg'
import {InputsIndicators} from "../../entities/uiInterfaces/uiInterfaces";

function Wallet(props) {
    const [sttBalance, setSttBalance] = useState(0)
    const [usdtBalance, setUsdtBalance] = useState(0)
    const [etcBalance, setEthBalance] = useState(0)
    const [helpUsdtBalance, setHelpUsdtBalance] = useState(0)
    const [showWwModal, setWwModal] = useState(false)
    const [showModalSendTokens, setShowModalSendTokens] = useState(false)
    const [recipientAddress, setRecipientAddress] = useState('')

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    useEffect(() => {
        if (props.account) {
            const acc = props.account
            const provider_balance = new ethers.BrowserProvider(window.ethereum)
            const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider_balance);
            const usdtContract = new ethers.Contract(usdtContractAddress, usdtContractAbi, provider_balance);
            let totalSt = 0.0
            let totalUs = 0.0
            contract.totalSupply().then(res => {
                totalSt = +(Number(res) / Math.pow(10, 9)).toFixed(2)
                usdtContract.balanceOf(exchangeContractAddress).then(res => {
                    totalUs = +(Number(res) / Math.pow(10, 6)).toFixed(2)
                    contract.balanceOf(acc).then(res => {
                        let stBalance:any = (parseFloat(String((Number(res) / Math.pow(10, 9)) - 0.01)).toFixed(2))
                        if (+stBalance < 0) {
                            stBalance = 0.0
                        }
                        let rate = totalUs / totalSt
                        let usBalance = (parseInt(String(parseFloat(String((rate * stBalance))) * 100)) /100)
                        setSttBalance(stBalance)
                        setHelpUsdtBalance(usBalance)

                    })
                })
            })
            usdtContract.balanceOf(acc).then(res => {
                let walletUsdtBalance = (parseInt(String(parseFloat(String(Number(res) / Math.pow(10, 6))) * 100)) / 100).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ').replace('.', ',')
                setUsdtBalance(+walletUsdtBalance)
            })
            provider_balance.getBalance(acc).then((balance) => {
                const balanceInEth = parseFloat(ethers.formatEther(balance)).toFixed(5).toString().replace('.', ',')
                setEthBalance(+balanceInEth)
            })
        }
    }, [props.account]);

    //
    // async function sendTokens(recipientAddress, amount) {
    //     const provider = props.provider// Провайдер (например, MetaMask)
    //     const signer = await provider.getSigner(); // Получаем подписанта
    //     const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer); // Контракт токена
    //     let decimals =  null; // Замените на количество десятичных знаков вашего токена
    //     // const balance = await contract.balanceOf(signer.address);
    //
    //     decimals = await contract.decimals().then(async (decimals) => {
    //         // console.log(`Decimals: ${decimals}`);
    //         const tokenAmount = ethers.parseUnits(amount.toString(), decimals); // Преобразуем в нужный формат
    //         console.log(tokenAmount)
    //         const allowanceBefore = await contract.allowance(await signer.getAddress(), recipientAddress);
    //         const txApprove = await contract.approve(recipientAddress, tokenAmount);
    //
    //         // Отправка токенов
    //         const tx = await contract.transfer(recipientAddress, tokenAmount);
    //         console.log(tx)
    //         console.log("Transaction sent:", tx.hash);
    //
    //         // // Ожидание подтверждения
    //         const receipt = await tx.wait();
    //         console.log("Transaction confirmed:", receipt);
    //
    //     }).catch((error) => {
    //         // console.error("Error fetching decimals:", error);
    //     });
    // }

    async function sendTokens(receiver, amount) {

        const providerMain = props.provider
        const provider = new ethers.BrowserProvider(window.ethereum);

        const signer = await providerMain.getSigner(); // Подписант (пользователь, который выполняет транзакции)
        const contractCommon = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer);
        const contract = await new ethers.Contract(tokenContractAddressCb31, tokenContractAbiCb31, signer);
        let decimals =  null; // Замените на количество десятичных знаков вашего токена

        decimals = await contractCommon.decimals().then(async (decimals) => {
            console.log(receiver)
            console.log(signer)

            const tokenAmount = ethers.parseUnits(amount.toString(), parseFloat(decimals)); // Преобразуем в нужный формат

            const connectedContract:any = await contract.connect(signer)

            const allowanceBefore = await contractCommon.allowance(await signer.getAddress(), receiver);
            console.log("Allowance before approve:", allowanceBefore.toString());
            console.log("Receiver in approve:", receiver);
            const txApprove = await contractCommon.approve(receiver, tokenAmount);
            console.log("Approve transaction sent:", txApprove.hash);
            console.log("Receiver in approve:", receiver);
            const receiptApprove = await txApprove.wait();
            console.log("Approve transaction confirmed:", receiptApprove);

            const allowanceAfter = await contractCommon.allowance(await signer.getAddress(), receiver);
            console.log("Allowance after approve:", allowanceAfter.toString());

            const balance = await contractCommon.balanceOf(await signer.getAddress());
            console.log("Balance:", balance.toString());

            console.log(balance) // 19996000000000n
            const allowance = await contractCommon.allowance(await signer.getAddress(), receiver);
            console.log(allowance) // 0n

            // Вызов метода paymentToTheShop
            try {
                const tx = await contract.paymentFromTheShop(receiver, tokenAmount);
                console.log("Transaction sent:", tx.hash);

                // Ждем подтверждения транзакции
                const receipt = await tx.wait();
                console.log("Transaction confirmed:", receipt);
            } catch (error) {
                console.error("Error sending payment:", error);
            }



        }).catch((error) => {
            //         // console.error("Error fetching decimals:", error);
        });

    }
    // async function sendTokens(receiver, amount) {
    //     const providerMain = props.provider;
    //     const provider = new ethers.BrowserProvider(window.ethereum);
    //
    //     const signer = await providerMain.getSigner(); // Подписант (пользователь, который выполняет транзакции)
    //     const contractCommon = new ethers.Contract(tokenContractAddress, tokenContractAbi, signer);
    //     const contract = new ethers.Contract(tokenContractAddressCb31, tokenContractAbiCb31, signer);
    //     let decimals = await contractCommon.decimals(); // Получаем количество десятичных знаков для токенов
    //
    //     console.log("Decimals:", decimals);
    //
    //     const tokenAmount = ethers.parseUnits(amount.toString(), decimals); // Преобразуем в нужный формат
    //
    //     // Проверка текущего allowance
    //     const allowanceBefore = await contractCommon.allowance(await signer.getAddress(), receiver);
    //     console.log("Allowance before approve:", allowanceBefore.toString());
    //
    //     // Используем обычные операторы для сравнения
    //     if (allowanceBefore < tokenAmount) {
    //         try {
    //             const txApprove = await contractCommon.approve(receiver, tokenAmount);
    //             console.log("Approve transaction sent:", txApprove.hash);
    //
    //             // Ждем подтверждения транзакции approve
    //             const receiptApprove = await txApprove.wait();
    //             console.log("Approve transaction confirmed:", receiptApprove);
    //         } catch (error) {
    //             console.error("Error during approve:", error);
    //             return; // Останавливаем выполнение, если approve не удается
    //         }
    //     }
    //
    //     // Проверяем баланс на адресе отправителя
    //     const balance = await contractCommon.balanceOf(await signer.getAddress());
    //     console.log("Balance:", balance.toString());
    //
    //     if (balance < tokenAmount) {
    //         console.log("Insufficient balance.");
    //         return; // Если баланса недостаточно, прекращаем выполнение
    //     }
    //
    //     // Вызов метода paymentToTheShop для перевода токенов
    //     try {
    //         const tx = await contract.paymentToTheShop(receiver, tokenAmount);
    //         console.log("Transaction sent:", tx.hash);
    //
    //         // Ждем подтверждения транзакции
    //         const receipt = await tx.wait();
    //         console.log("Transaction confirmed:", receipt);
    //     } catch (error) {
    //         console.error("Error sending payment:", error);
    //     }
    // }






    const showModalSendMoney = () => {
        setShowModalSendTokens(prev => !prev)
    }

    return (
        <React.Fragment>
            <div className={"wallet_card eth-card"}>
                <div className={"wallet_card-stripe"}>
                    <span>{props.account ? '****' + props.account.substr(props.account.length - 4) : ''}</span>
                </div>
                {props.account
                    ? <a className={"wallet_card-balance"} href={"https://arbiscan.io/address/" + props.account}
                         target={"_blank"} rel={"noreferrer"}><span className={"stt-empty"}></span><span
                        className={"stt-balance"}>{numberWithCommas(sttBalance)}</span><span
                        className={"stt-arrow"}><img src={"/img/arrow-dark.png"} alt={''}
                                                     style={{width: 35}}/></span></a>
                    : <React.Fragment><a className={"wallet_card-balance"} href={"#!"} onClick={() => setWwModal(true)}><span
                        className={"stt-empty"}></span><span
                        className={"stt-balance"}>0.0</span><span className={"stt-arrow"}><img
                        src={"/img/arrow-dark.png"} alt={''} style={{width: 35}}/></span></a>
                        <Modal size="sm" show={showWwModal} onHide={() => setWwModal(false)}
                               aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal"} centered>
                            <Modal.Body>
                                <div className={"stt_modal_header"}>
                                </div>
                                <div className={"help-wrapper telegram-wrapper"}
                                     style={{paddingLeft: 0, paddingRight: 0}}>
                                    <img src={"/img/lock.png"} alt={''} style={{width: 80, marginTop: 70}}/>
                                    <p style={{
                                        fontSize: '1.1rem',
                                        marginBottom: 20,
                                        marginTop: 30,
                                        color: '#888888'
                                    }}>Authorization</p>
                                    <p style={{fontSize: '.8rem', marginTop: 0, fontWeight: 400, marginBottom: 25}}>To
                                        use full functionality, login to the<br/>website with the browser of your crypto<br/>wallet
                                    </p>
                                    <a href={"/login.pdf"} target={"_blank"} rel={"noreferrer"} style={{
                                        fontSize: '.8rem',
                                        marginTop: 0,
                                        fontWeight: 500,
                                        display: "block",
                                        marginBottom: 45,
                                        color: '#47c999'
                                    }}>Instructions</a>

                                    <Button className="modal-button" onClick={() => setWwModal(false)}>Ok</Button>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </React.Fragment>
                }
                <p className={"help-usdt-balance"}>~ {numberWithCommas(helpUsdtBalance)} USDT</p>
                <div className={"balance_title"}>
                    <div className={"additional-balances"}>
                        <div><span>USDT</span> {numberWithCommas(usdtBalance)}</div>
                        <div><span>ETH</span> {etcBalance}</div>
                    </div>
                    <Button onClick={showModalSendMoney} className={'btn-send-tokens'}>send</Button>
                </div>
            </div>
            <Row>
                <Col xs={4}>
                    <a className={"wallet_link  eth-card"} href={"https://t.me/P2PSTT"} target={"_blank"} rel={"noreferrer"}>
                        <span>P2P</span>
                        <span><img src={"/img/arrow-dark.png"} alt={''} style={{width: 35}} /></span>
                    </a>
                </Col>
                <Col xs={8}>
                    <a className={"wallet_link  eth-card"} href={"https://t.me/tastyday_stt_purchase_bot"} target={"_blank"} rel={"noreferrer"}>
                        <span>Swap bot</span>
                        <span><img src={"/img/arrow-dark.png"} alt={''} style={{width: 35}} /></span>
                    </a>
                </Col>
            </Row>
            <Modal size="sm" show={showModalSendTokens} onHide={() => showModalSendMoney()}
                   aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal"} centered>
                <Modal.Body>
                        <div className={"stt_modal_header"}>
                            <div style={{width: 50}}></div>
                            <div className={"notification_header"}>SEND BONUSES</div>
                            <div className={"close_btn"} onClick={() => showModalSendMoney()}>
                                <i className="fa-solid fa-xmark"></i>
                            </div>
                        </div>
                    <div className={"help-wrapper telegram-wrapper"} style={{paddingLeft: 0, paddingRight: 0}}>
                        <CustomInput
                            placeholder='ERC20-счет пригласителя'
                            value={recipientAddress}
                            onChange={(e) => setRecipientAddress(e.target.value)}
                            type='text'
                            indicators={InputsIndicators.addSttBonus}
                            svg={<SvgQr className={cls.svgQr}/>}
                        >
                            confirm
                        </CustomInput>
                        <div style={{fontSize: '1.1rem', marginBottom: 20, marginTop: 10}}>0 STT<div/>15-2355,40</div>
                        <div style={{fontSize: '1.1rem', marginBottom: 20, marginTop: 10}}>0 STT<div/>15-2355,40</div>
                        <Button onClick={() => sendTokens("0xD60c6fdcF35fd8F33F0c2360439db89e117b869c", 10)} className={'btn-send-tokens'}>send</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    )
}

export default Wallet;