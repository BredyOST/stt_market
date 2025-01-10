import './info.css'
import React, {useEffect, useState} from "react";
import {Button, Col, Modal} from "react-bootstrap";
import {ethers} from "ethers";
import {
    exchangeContractAddress, newExchangeAbi, newExchangeAddress, reverseUsdtSttAbi, reverseUsdtSttAddress,
    tokenContractAbi,
    tokenContractAddress,
    usdtContractAbi,
    usdtContractAddress
} from "../../helpers/contracts";
import axios from "axios";


function Info(props) {
    const [totalSupply, setTotalSupply] = useState(0.0)
    const [contractBalance, setContractBalance] = useState(0.0)
    const [multiBalance, setMultiBalance] = useState(0.0)
    const [showWwModal, setWwModal] = useState(false)

    function handleBalances() {
        if (!props.withoutWallet) {
            if (props.account) {
                const provider_balance = new ethers.BrowserProvider(window.ethereum)
                const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider_balance);
                const usdtContract = new ethers.Contract(usdtContractAddress, usdtContractAbi, provider_balance);
                let totalSt = 0.0
                let totalUs = 0.0
                let fullSt = 0.0
                let fullUs = 0.0
                contract.totalSupply().then(res => {
                    totalSt = +(Number(res) / Math.pow(10, 9)).toFixed(2)
                    fullSt = Number(res) / Math.pow(10, 9)
                    usdtContract.balanceOf(exchangeContractAddress).then(res => {
                        totalUs = +(Number(res) / Math.pow(10, 6)).toFixed(2)
                        fullUs = Number(res) / Math.pow(10, 6)
                        setTotalSupply(+totalSt.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ').replace('.', ','))
                        setContractBalance(+totalUs.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ').replace('.', ','))
                        contract.balanceOf(reverseUsdtSttAddress).then((res) => {
                            let available = (parseFloat(String(Number(res) / Math.pow(10, 9))) - 0.01).toFixed(2)
                            setMultiBalance(+available.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ').replace('.', ','))
                        })
                    })
                })


            }
        } else {
            axios.get('https://api.arbiscan.io/api?module=stats&action=tokensupply&contractaddress=0x1635b6413d900D85fE45C2541342658F4E982185&apikey=2U5WS2IBB4WYBA99AJZ8P69YTD4BZJMURW').then((res) => {
                setTotalSupply(+(res.data.result / Math.pow(10,9)).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ').replace('.', ','))
                setTimeout(function () {
                    axios.get('https://api.arbiscan.io/api?module=account&action=tokenbalance&contractaddress=0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9&address=0x88af31e521fca0ed362582aa231189849f1e3b2e&apikey=2U5WS2IBB4WYBA99AJZ8P69YTD4BZJMURW').then((res) => {
                        setContractBalance(+(res.data.result / Math.pow(10,6)).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ').replace('.', ','))
                        setTimeout(function () {
                            axios.get('https://api.arbiscan.io/api?module=account&action=tokenbalance&contractaddress=0x1635b6413d900d85fe45c2541342658f4e982185&address=0x11F2754320C961f4fFbC0174C8B4587903F816Dc&apikey=2U5WS2IBB4WYBA99AJZ8P69YTD4BZJMURW').then((res) => {
                                setMultiBalance(+(res.data.result / Math.pow(10,9)).toFixed(2).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ').replace('.', ','))
                            })
                        }, 1000)
                    })
                }, 1000)
            })
        }
    }

    useEffect(() => {
        handleBalances()
    }, []);

    const tokenAddress = tokenContractAddress;
    const tokenSymbol = 'STT';
    const tokenName = 'SmartTradingToken'
    const tokenDecimals = 9;
    const tokenImage = 'https://stt.market/img/stt_logo.png';

    const usdtAddress = usdtContractAddress;
    const usdtSymbol = 'USDT';
    const usdtName = 'USDT'
    const usdtDecimals = 6;

    async function addToken() {
        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            const wasAdded = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                    options: {
                        address: tokenAddress, // The address that the token is at.
                        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                        name: tokenName,
                        decimals: tokenDecimals, // The number of decimals in the token
                        image: tokenImage, // A string url of the token logo
                    },
                },
            }).catch((error) => {
                console.log(error)
            });

            if (wasAdded) {
                console.log('Thanks for your interest!');
            } else {
                console.log('Your loss!');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function addUsdtToken() {
        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            const wasAdded = await window.ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                    options: {
                        address: usdtAddress, // The address that the token is at.
                        symbol: usdtSymbol, // A ticker symbol or shorthand, up to 5 chars.
                        name: usdtName,
                        decimals: usdtDecimals, // The number of decimals in the token
                    },
                },
            }).catch((error) => {
                console.log(error)
            });

            if (wasAdded) {
                console.log('Thanks for your interest!');
            } else {
                console.log('Your loss!');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={"row"}>
            <div className={"col-12"}>
                <a className={"balance_row eth-card"} href={"https://arbiscan.io/token/0x1635b6413d900D85fE45C2541342658F4E982185"} target={"_blank"}>
                    <div className={"balance_row-header"}>Total Supply</div>
                    <div className={"balance_row-value"}>{totalSupply} STT</div>
                    <img src={"/img/arrow-dark.png"} alt={''} style={{position: "absolute", width: 35, top: 12, right: 15}} />
                </a>
            </div>
            <div className={"col-12"}>
                <a className={"balance_row eth-card"} href={"https://arbiscan.io/address/0x88af31e521fca0ed362582aa231189849f1e3b2e"} target={"_blank"}>
                    <div className={"balance_row-header"}>Exchange Contract</div>
                    <div className={"balance_row-value"}>{contractBalance} USDT</div>
                    <img src={"/img/arrow-dark.png"} alt={''} style={{position: "absolute", width: 35, top: 12, right: 15}} />
                </a>
            </div>
            <div className={"col-12"}>
                <a className={"balance_row eth-card"} href={"https://arbiscan.io/address/0x11F2754320C961f4fFbC0174C8B4587903F816Dc"} target={"_blank"}>
                    <div className={"balance_row-header"}>STT Multiplication</div>
                    <div className={"balance_row-value"}>{multiBalance} STT</div>
                    <img src={"/img/arrow-dark.png"} alt={''} style={{position: "absolute", width: 35, top: 12, right: 15}} />
                </a>
            </div>
            {!props.withoutWallet
                ? <div className={"col-6"}>
                    <div className={"balance_col eth-card"} onClick={addToken}>
                        Import STT
                    </div>
                  </div>
                : <div className={"col-6"}>
                    <div className={"balance_col eth-card _disabled"} onClick={() => setWwModal(true)}>
                        Import STT
                    </div>
                  </div>
            }
            {!props.withoutWallet
                ? <div className={"col-6"}>
                    <div className={"balance_col eth-card"} onClick={addUsdtToken}>
                        Import USDT
                    </div>
                  </div>
                : <div className={"col-6"}>
                    <div className={"balance_col eth-card _disabled"} onClick={() => setWwModal(true)}>
                        Import USDT
                    </div>
                  </div>
            }
            <Modal size="sm" show={showWwModal} onHide={() => setWwModal(false)} aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal"} centered >
                <Modal.Body>
                    <div className={"stt_modal_header"}>


                    </div>
                    <div className={"help-wrapper telegram-wrapper"} style={{paddingLeft: 0, paddingRight: 0}}>
                        <img src={"/img/lock.png"} alt={''} style={{width: 80, marginTop: 70}} />
                        <p style={{fontSize: '1.1rem', marginBottom: 20, marginTop: 30, color: '#888888'}}>Authorization</p>
                        <p style={{fontSize: '.8rem', marginTop: 0, fontWeight: 400, marginBottom: 25}}>To use full functionality, login to the<br/>website with the browser of your crypto<br/>wallet</p>
                        <a href={"/login.pdf"} target={"_blank"} rel={"noreferrer"} style={{fontSize: '.8rem', marginTop: 0, fontWeight: 500, display: "block", marginBottom: 45, color: '#47c999'}}>Instructions</a>

                        <Button className="modal-button"  onClick={() => setWwModal(false)}>Ok</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Info