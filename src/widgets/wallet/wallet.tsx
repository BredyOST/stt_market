import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import {
    exchangeContractAddress,
    tokenContractAbi, tokenContractAbiCb31, tokenContractAddress, tokenContractAddressCb31,
    usdtContractAbi,
    usdtContractAddress
} from "../../helpers/contracts";
import {useAppDispatch, useAppSelector} from "../../shared/redux/hooks/hooks";
import cls from './wallet.module.scss';
import {authActions} from "../../shared/redux/slices/authSlice/authSlice";
import {ReactComponent as SvgArrowRight} from "./../../assets/svg/arrow-rigth.svg";
import {ReactComponent as SvgSwap} from "./../../assets/svg/swap.svg";
import {ReactComponent as SvgDonation} from "./../../assets/svg/donation.svg";
import {ReactComponent as SvgGift} from "./../../assets/svg/gift.svg";
import CustomButton from "../../shared/ui/сustomButton/CustomButton";
import {modalAddProfileActions} from "../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice";
import SendTokens from "../../feautures/modalWindows/sendTokens/sendTokens";
import Modal from "../../shared/ui/modal/modal";
import Portal from "../../shared/ui/portal/portal";
import Swap from "../../feautures/modalWindows/swap/swap";
import Donation from "../../feautures/modalWindows/donation/donation";


function Wallet(props) {
    const [sttBalance, setSttBalance] = useState(0)
    const [usdtBalance, setUsdtBalance] = useState(0)
    const [etcBalance, setEthBalance] = useState(0)
    const [helpUsdtBalance, setHelpUsdtBalance] = useState(0)
    const [showWwModal, setWwModal] = useState(false)
    const [showModalSendTokens, setShowModalSendTokens] = useState(false)
    const [recipientAddress, setRecipientAddress] = useState('')

    const dispatch = useAppDispatch()

    /** STATES */
    const {provider, account} = useAppSelector(state => state.authSlice)
    const {modalSendTokens, modalSwap, modalDonation, isClosingModalSendTokens, isClosingModalSwap, isClosingModalDonation} = useAppSelector(state => state.modalWindow)

    /** ACTIONS*/
    const {changeStateLoggedIn, addAccount, addProvider, addSttRates, addWallet} = authActions;
    const {closeModal, openModal} = modalAddProfileActions


    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    useEffect(() => {
        if (account) {
            const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider);
            const usdtContract = new ethers.Contract(usdtContractAddress, usdtContractAbi, provider);

            // const provider_balance = new ethers.BrowserProvider(window.ethereum)
            // const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider_balance);
            // const usdtContract = new ethers.Contract(usdtContractAddress, usdtContractAbi, provider_balance);
            let totalSt = 0.0
            let totalUs = 0.0
            contract.totalSupply().then(res => {
                totalSt = +(Number(res) / Math.pow(10, 9)).toFixed(2)
                usdtContract.balanceOf(exchangeContractAddress).then(res => {
                    totalUs = +(Number(res) / Math.pow(10, 6)).toFixed(2)
                    contract.balanceOf(account).then(res => {
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
            usdtContract.balanceOf(account).then(res => {
                let walletUsdtBalance = (parseInt(String(parseFloat(String(Number(res) / Math.pow(10, 6))) * 100)) / 100).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ').replace('.', ',')
                setUsdtBalance(+walletUsdtBalance)
            })
            provider?.getBalance(account).then((balance) => {
                const balanceInEth = parseFloat(ethers.formatEther(balance)).toFixed(5).toString().replace('.', ',')
                setEthBalance(+balanceInEth)
                setEthBalance(Number(balanceInEth.replace(',', '.')))
            })
        }
    }, [account]);

    /**Functions*/
    /** для отображения попапа отправки токенов*/
    const showModalSendMoney = () => {
        const modalSendTokens:any = 'modalSendTokens'
        dispatch(openModal({modalName: modalSendTokens}))
    }
    /** для смены токенов*/
    const showModalSendSwap = () => {
        const modalSwapTokens:any = 'modalSwap'
        dispatch(openModal({modalName: modalSwapTokens}))
    }
    /** для доната*/
    const sendDonation = () => {
        const modalDonat:any = 'modalDonation'
        dispatch(openModal({modalName: modalDonat}))
    }

    return (
        <>
            <div className={cls.wrapper}>
                <div className={cls.coverPrice}>
                    <div className={cls.blockConvert}>
                        <div className={cls.help_usdt_balance}>{numberWithCommas(helpUsdtBalance)} USDT</div>
                        <div className={cls.help_usdt_balance}>{etcBalance} ETH</div>
                    </div>
                    <div className={cls.walletPrice}>
                        <a className={cls.wallet_card_balance}
                           href={account ? "https://arbiscan.io/address/" + account : "#!"}
                           target={account && "_blank"} rel={account && "noreferrer"}
                           onClick={() => setWwModal(account ? true : undefined)}
                        >
                            <span className={cls.stt_balance}>{numberWithCommas(sttBalance)} STT</span>
                            <span className={cls.stt_balnsce_usd}>12 $</span>
                        </a>

                    </div>
                    <div className={cls.blockBtns}>
                        <CustomButton classnameWrapper={cls.wrapBtn} classNameBtn={cls.btnSendToken} type='button' onClick={showModalSendMoney}>
                            <SvgArrowRight className={cls.btnSenTokensSvg}/>
                        </CustomButton>
                        <CustomButton classnameWrapper={cls.wrapBtn} classNameBtn={cls.btnSwap} type='button' onClick={showModalSendSwap}>
                            <SvgSwap className={cls.btnSwapSvg}/>
                        </CustomButton>
                        {/*<a className={cls.wallet_link} href={"https://t.me/tastyday_stt_purchase_bot"}*/}
                        {/*   target={"_blank"} rel={"noreferrer"}>*/}
                        {/*   <SvgSwap className={cls.btnSwap}/>*/}
                        {/*</a>*/}
                        <CustomButton classnameWrapper={cls.wrapBtn} classNameBtn={cls.btnDonation} type='button' onClick={sendDonation}>
                            <SvgDonation className={cls.btnDonationSvg}/>
                        </CustomButton>
                        <CustomButton classnameWrapper={cls.wrapBtn} classNameBtn={cls.gift} type='button'>
                            <SvgGift className={cls.btnDonationSvg}/>
                        </CustomButton>
                    </div>
                </div>
            </div>
            <Portal whereToAdd={document.body}>
                <Modal show={modalSendTokens} closing={isClosingModalSendTokens}>
                    <SendTokens/>
                </Modal>
            </Portal>
            <Portal whereToAdd={document.body}>
                <Modal show={modalSwap} closing={isClosingModalSwap}>
                    <Swap/>
                </Modal>
            </Portal>
            <Portal whereToAdd={document.body}>
                <Modal show={modalDonation} closing={isClosingModalDonation}>
                    <Donation/>
                </Modal>
            </Portal>

            {/*<Modal size="sm" show={showWwModal} onHide={() => setWwModal(false)}*/}
            {/*       aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal"}*/}
            {/*       centered>*/}
            {/*    <Modal.Body>*/}
            {/*        <div className={"stt_modal_header"}>*/}
            {/*        </div>*/}
            {/*        <div className={"help-wrapper telegram-wrapper"}*/}
            {/*             style={{paddingLeft: 0, paddingRight: 0}}>*/}
            {/*            <img src={"/img/lock.png"} alt={''} style={{width: 80, marginTop: 70}}/>*/}
            {/*            <p style={{*/}
            {/*                fontSize: '1.1rem',*/}
            {/*                marginBottom: 20,*/}
            {/*                marginTop: 30,*/}
            {/*                color: '#888888'*/}
            {/*            }}>Authorization</p>*/}
            {/*            <p style={{*/}
            {/*                fontSize: '.8rem',*/}
            {/*                marginTop: 0,*/}
            {/*                fontWeight: 400,*/}
            {/*                marginBottom: 25*/}
            {/*            }}>To*/}
            {/*                use full functionality, login to the<br/>website with the browser of your*/}
            {/*                crypto<br/>wallet*/}
            {/*            </p>*/}
            {/*            <a href={"/login.pdf"} target={"_blank"} rel={"noreferrer"} style={{*/}
            {/*                fontSize: '.8rem',*/}
            {/*                marginTop: 0,*/}
            {/*                fontWeight: 500,*/}
            {/*                display: "block",*/}
            {/*                marginBottom: 45,*/}
            {/*                color: '#47c999'*/}
            {/*            }}>Instructions</a>*/}
            {/*            <Button className="modal-button" onClick={() => setWwModal(false)}>Ok</Button>*/}
            {/*        </div>*/}
            {/*    </Modal.Body>*/}
            {/*</Modal>*/}



            {/*<div className={"wallet_card eth-card"}>*/}
            {/*    <div className={"wallet_card-stripe"}>*/}
            {/*        <span>{account ? '****' + account.substr(account.length - 4) : ''}</span>*/}
            {/*    </div>*/}
            {/*    {account*/}
            {/*        ? <a className={"wallet_card-balance"} href={"https://arbiscan.io/address/" + account}*/}
            {/*             target={"_blank"} rel={"noreferrer"}><span className={"stt-empty"}></span><span*/}
            {/*            className={"stt-balance"}>{numberWithCommas(sttBalance)}</span><span*/}
            {/*            className={"stt-arrow"}><img src={"/img/arrow-dark.png"} alt={''}*/}
            {/*                                         style={{width: 35}}/></span></a>*/}
            {/*        : <React.Fragment><a className={"wallet_card-balance"} href={"#!"} onClick={() => setWwModal(true)}><span*/}
            {/*            className={"stt-empty"}></span><span*/}
            {/*            className={"stt-balance"}>0.0</span><span className={"stt-arrow"}><img*/}
            {/*            src={"/img/arrow-dark.png"} alt={''} style={{width: 35}}/></span></a>*/}

            {/*            <Modal size="sm" show={showWwModal} onHide={() => setWwModal(false)}*/}
            {/*                   aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal"} centered>*/}
            {/*                <Modal.Body>*/}
            {/*                    <div className={"stt_modal_header"}>*/}
            {/*                    </div>*/}
            {/*                    <div className={"help-wrapper telegram-wrapper"}*/}
            {/*                         style={{paddingLeft: 0, paddingRight: 0}}>*/}
            {/*                        <img src={"/img/lock.png"} alt={''} style={{width: 80, marginTop: 70}}/>*/}
            {/*                        <p style={{*/}
            {/*                            fontSize: '1.1rem',*/}
            {/*                            marginBottom: 20,*/}
            {/*                            marginTop: 30,*/}
            {/*                            color: '#888888'*/}
            {/*                        }}>Authorization</p>*/}
            {/*                        <p style={{fontSize: '.8rem', marginTop: 0, fontWeight: 400, marginBottom: 25}}>To*/}
            {/*                            use full functionality, login to the<br/>website with the browser of your crypto<br/>wallet*/}
            {/*                        </p>*/}
            {/*                        <a href={"/login.pdf"} target={"_blank"} rel={"noreferrer"} style={{*/}
            {/*                            fontSize: '.8rem',*/}
            {/*                            marginTop: 0,*/}
            {/*                            fontWeight: 500,*/}
            {/*                            display: "block",*/}
            {/*                            marginBottom: 45,*/}
            {/*                            color: '#47c999'*/}
            {/*                        }}>Instructions</a>*/}

            {/*                        <Button className="modal-button" onClick={() => setWwModal(false)}>Ok</Button>*/}
            {/*                    </div>*/}
            {/*                </Modal.Body>*/}
            {/*            </Modal>*/}
            {/*        </React.Fragment>*/}
            {/*    }*/}
            {/*    <p className={"help-usdt-balance"}>~ {numberWithCommas(helpUsdtBalance)} USDT</p>*/}
            {/*    <div className={"balance_title"}>*/}
            {/*        <div className={"additional-balances"}>*/}
            {/*            <div><span>USDT</span> {numberWithCommas(usdtBalance)}</div>*/}
            {/*            <div><span>ETH</span> {etcBalance}</div>*/}
            {/*        </div>*/}
            {/*        <Button onClick={showModalSendMoney} className={'btn-send-tokens'}>send</Button>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/*<Row>*/}
            {/*    <Col xs={4}>*/}
            {/*        <a className={"wallet_link  eth-card"} href={"https://t.me/P2PSTT"} target={"_blank"} rel={"noreferrer"}>*/}
            {/*            <span>P2P</span>*/}
            {/*            <span><img src={"/img/arrow-dark.png"} alt={''} style={{width: 35}} /></span>*/}
            {/*        </a>*/}
            {/*    </Col>*/}
            {/*    <Col xs={8}>*/}
            {/*        <a className={"wallet_link  eth-card"} href={"https://t.me/tastyday_stt_purchase_bot"} target={"_blank"} rel={"noreferrer"}>*/}
            {/*            <span>Swap bot</span>*/}
            {/*            <span><img src={"/img/arrow-dark.png"} alt={''} style={{width: 35}} /></span>*/}
            {/*        </a>*/}
            {/*    </Col>*/}
            {/*</Row>*/}

            {/*<Modal size="sm" show={showModalSendTokens} onHide={() => showModalSendMoney()}*/}
            {/*       aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal"} centered>*/}
            {/*    <Modal.Body>*/}
            {/*            <div className={"stt_modal_header"}>*/}
            {/*                <div style={{width: 50}}></div>*/}
            {/*                <div className={"notification_header"}>SEND BONUSES</div>*/}
            {/*                <div className={"close_btn"} onClick={() => showModalSendMoney()}>*/}
            {/*                    <i className="fa-solid fa-xmark"></i>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        <div className={"help-wrapper telegram-wrapper"} style={{paddingLeft: 0, paddingRight: 0}}>*/}
            {/*            <CustomInput*/}
            {/*                placeholder='ERC20-счет пригласителя'*/}
            {/*                value={recipientAddress}*/}
            {/*                onChange={(e) => setRecipientAddress(e.target.value)}*/}
            {/*                type='text'*/}
            {/*                indicators={InputsIndicators.addSttBonus}*/}
            {/*                svg={<SvgQr className={cls.svgQr}/>}*/}
            {/*            >*/}
            {/*                confirm*/}
            {/*            </CustomInput>*/}
            {/*            <div style={{fontSize: '1.1rem', marginBottom: 20, marginTop: 10}}>0 STT<div/>15-2355,40</div>*/}
            {/*            <div style={{fontSize: '1.1rem', marginBottom: 20, marginTop: 10}}>0 STT<div/>15-2355,40</div>*/}
            {/*            <Button onClick={() => sendTokens("0xD60c6fdcF35fd8F33F0c2360439db89e117b869c", 10)} className={'btn-send-tokens'}>send</Button>*/}
            {/*        </div>*/}
            {/*    </Modal.Body>*/}
            {/*</Modal>*/}
        </>
    )
}

export default Wallet;