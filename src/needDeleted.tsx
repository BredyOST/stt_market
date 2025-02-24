import React from 'react';
import axios from 'axios';
import {
    arbitrumCurrent,
    exchangeContractAddress,
    tokenContractAbi,
    tokenContractAddress,
    usdtContractAbi,
    usdtContractAddress,
} from './helpers/contracts';
import { ethers } from 'ethers';
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';

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
            const result = await window.ethereum.request({ method: 'eth_chainId' });
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
            console.log('Error fetching chain ID', error);
        }
    }

    /** app*/
    function handleChainChanged(_chainId) {
        // We recommend reloading the page, unless you must do otherwise
        window.location.reload();
    }

    function chainChange() {
        window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: arbitrumCurrent,
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
    }, []);
    /** */

    const switchToArbitrum = async () => {
        // try {
        //   await walletKit.request({
        //     method: 'wallet_switchEthereumChain',
        //     params: [{ chainId: '0xa4b1' }], // 0xa4b1 — это 42161 в шестнадцатеричном формате
        //   });
        // } catch (error) {
        //   if (error.code === 4902) {
        //     await walletKit.request({
        //       method: 'wallet_addEthereumChain',
        //       params: [
        //         {
        //           chainId: '0xa4b1',
        //           chainName: 'Arbitrum One',
        //           nativeCurrency: {
        //             name: 'Ether',
        //             symbol: 'ETH',
        //             decimals: 18,
        //           },
        //           rpcUrls: ['https://arb1.arbitrum.io/rpc'],
        //           blockExplorerUrls: ['https://arbiscan.io'],
        //         },
        //       ],
        //     });
        //   } else {
        //     console.error('Ошибка при переключении сети:', error);
        //   }
        // }
    };

    return (
        <div>
            <div>из header</div>
            {/*<div className={cls.wallet_header_telegram}>*/}
            {/*    {!props.withoutWallet*/}
            {/*        ? <>*/}
            {/*{telegramUsername !== ''*/}
            {/*    ? <>*/}
            {/*        <div className={"notifications-btn"} style={{marginRight: 20}}*/}
            {/*             onClick={safetyCheck}><i className="fa-solid fa-shield-check"*/}
            {/*                                      style={{cursor: "pointer", marginBottom: 0}}></i>*/}
            {/*        </div>*/}
            {/*        <Modal size="sm" show={safetyModalShow} onHide={() => setSafetyModalShow(false)}*/}
            {/*               aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal"}*/}
            {/*               centered>*/}
            {/*            <Modal.Body>*/}
            {/*                <div className={"stt_modal_header"}>*/}
            {/*                    <div style={{width: 50}}></div>*/}
            {/*                    <div className={"close_btn"} onClick={() => setSafetyModalShow(false)}>*/}
            {/*                        <i className="fa-solid fa-xmark"></i>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className={"help-wrapper telegram-wrapper"}*/}
            {/*                     style={{paddingLeft: 0, paddingRight: 0}}>*/}
            {/*                    <i className="fa-solid fa-shield-check"*/}
            {/*                       style={{fontSize: '3.5rem', color: '#efefef'}}></i>*/}
            {/*                    <p style={{*/}
            {/*                        fontSize: '1.1rem',*/}
            {/*                        marginBottom: 20,*/}
            {/*                        marginTop: 10*/}
            {/*                    }}>Safe<br/>Connection Check</p>*/}
            {/*                    <p style={{fontSize: '.8rem', marginTop: 0, fontWeight: 400}}>Safety*/}
            {/*                        notification has been sent<br/>to your connected Telegram*/}
            {/*                        account<br/><span style={{*/}
            {/*                            fontWeight: 700,*/}
            {/*                            fontSize: '1rem'*/}
            {/*                        }}>{telegramUsername}</span></p>*/}
            {/*                    <p style={{fontSize: '.8rem', marginTop: 0, fontWeight: 400}}>If you*/}
            {/*                        have not received it,<br/>we recommend that you do not<br/>perform*/}
            {/*                        any actions on the site</p>*/}

            {/*                    <Button className="modal-button" onClick={() => setSafetyModalShow(false)}>Ok</Button>*/}
            {/*                </div>*/}
            {/*            </Modal.Body>*/}
            {/*        </Modal>*/}
            {/*        <div className={"notifications-btn"} onClick={() => setShowTelegramChangeModal(true)}><i className="fa-solid fa-bell" style={{background: "none", cursor: "pointer", marginBottom: 0, color: '#47c999'}}></i></div>*/}
            {/*        <Modal size="sm" show={showTelegramChangeModal} onHide={() => setShowTelegramChangeModal(false)} aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal telegram-set-modal"} centered >*/}
            {/*            <Modal.Body>*/}
            {/*                    <div style={{width:50}}></div>*/}
            {/*                    <div className={"notification_header"}>NOTIFICATIONS</div>*/}
            {/*                    <div className={"close_btn"} onClick={() => setShowTelegramChangeModal(false)}>*/}
            {/*                        <i className="fa-solid fa-xmark"></i>*/}
            {/*                    </div>*/}
            {/*                <div className={"help-wrapper telegram-wrapper"} style={{paddingLeft: 0, paddingRight: 0}}>*/}
            {/*                    <p style={{fontSize: '.9rem'}}>Address ****{props.account.substr(props.account.length - 4)} linked to<br/>Telegram account</p>*/}

            {/*                    <h6 style={{marginBottom: 40, fontSize: '1.5rem', color: '#008279'}}><span style={{fontWeight: 700}}>{telegramUsername}</span></h6>*/}

            {/*                    <Button className="modal-button"  onClick={changeTelegram}>Disable</Button>*/}
            {/*                </div>*/}
            {/*            </Modal.Body>*/}
            {/*        </Modal>*/}
            {/*    </>*/}
            {/*    : <>*/}
            {/*        <div className={"notifications-btn"} style={{marginRight: 0}} onClick={() => setSafetyModalShow(true)}><i className="fa-solid fa-shield-check" style={{cursor: "pointer", marginBottom: 0}}></i></div>*/}
            {/*        <Modal size="sm" show={safetyModalShow} onHide={() => setSafetyModalShow(false)} aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal"} centered >*/}
            {/*            <Modal.Body>*/}
            {/*                <div className={"stt_modal_header"}>*/}
            {/*                    <div style={{width:50}}></div>*/}
            {/*                    <div className={"close_btn"} onClick={() => setSafetyModalShow(false)}>*/}
            {/*                        <i className="fa-solid fa-xmark"></i>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*                <div className={"help-wrapper telegram-wrapper"} style={{paddingLeft: 0, paddingRight: 0}}>*/}
            {/*                    <i className="fa-solid fa-shield-check" style={{fontSize: '3.5rem', color: '#efefef'}}></i>*/}
            {/*                    <p style={{fontSize: '1.1rem', marginBottom: 20, marginTop: 10}}>Safe<br/>Connection Check</p>*/}
            {/*                    <p style={{fontSize: '.8rem', marginTop: 0, fontWeight: 400}}>Safety connection check function<br/>is available only when Telegram<br/>notifications are enabled</p>*/}

            {/*                    <h6 style={{marginBottom: 40, fontSize: '1.3rem', color: '#008279'}}><a href={"https://t.me/stt_info_bot"} target="_blank" rel="noopener noreferrer" style={{color: '#008279', textDecoration: "none"}}><span style={{fontWeight: 700}}>@stt_info_bot</span></a></h6>*/}

            {/*                    <Button className="modal-button"  onClick={() => setSafetyModalShow(false)}>Ok</Button>*/}
            {/*                </div>*/}
            {/*            </Modal.Body>*/}
            {/*        </Modal>*/}
            {/*        <div className={"notifications-btn"} onClick={prepareTelegram}><i className="fa-solid fa-bell" style={{background: "none", cursor: "pointer", marginBottom: 0}}></i></div>*/}
            {/*        <Modal size="sm" show={showTelegramModal} onHide={() => setShowTelegramModal(false)} aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal"} centered>*/}
            {/*            <Modal.Body style={{paddingTop: 0}}>*/}
            {/*                <div className={"stt_modal_header"}>*/}
            {/*                    <div style={{width:50}}></div>*/}
            {/*                    <div className={"notification_header"}>NOTIFICATIONS</div>*/}
            {/*                    <div className={"close_btn"} onClick={() => setShowTelegramModal(false)}>*/}
            {/*                        <i className="fa-solid fa-xmark"></i>*/}
            {/*                    </div>*/}

            {/*                </div>*/}
            {/*                <div className={"help-wrapper telegram-wrapper"} style={{paddingLeft: 0, paddingRight: 0}}>*/}

            {/*                    <p style={{fontSize: '.9rem'}}>Join telegram bot via<br/>link below</p>*/}
            {/*                    <h6 style={{marginBottom: 40, fontSize: '1.3rem', color: '#008279'}}><a href={"https://t.me/stt_info_bot"} target="_blank" rel="noopener noreferrer" style={{color: '#008279', textDecoration: "none"}}><span style={{fontWeight: 700}}>@stt_info_bot</span></a></h6>*/}

            {/*                    <p style={{fontSize: '.9rem', marginTop: 40}}>Send to the bot<br/>the code below</p>*/}
            {/*                    <h3>{telegramCode}</h3>*/}
            {/*                    <p style={{fontSize: '.85rem', fontWeight: 400, marginTop: 0}}>Code will expire in<br/><Countdown date={new Date(telegramValid * 1000)} /></p>*/}

            {/*                    <Button className="modal-button" onClick={() => checkTelegram(true)}>I Sent</Button>*/}
            {/*                </div>*/}
            {/*            </Modal.Body>*/}
            {/*        </Modal>*/}
            {/*    </>*/}
            {/*}*/}
            {/*        <Toast onClose={() => setToastCompleteShow(false)} show={toastCompleteShow} onClick={() => setToastCompleteShow(false)} autohide delay={5000} className={"complete-toast"}>*/}
            {/*            <Toast.Body>*/}
            {/*                <i className="fa-solid fa-circle-check" style={{fontSize: '6rem', margin: 20, color: '#96fac5'}}></i>*/}
            {/*                <p style={{fontWeight: 600}}>SUCCESS</p>*/}
            {/*                <p className={"complete-toast-text"}>Please, refresh the page</p>*/}
            {/*            </Toast.Body>*/}
            {/*        </Toast>*/}
            {/*        <Toast onClose={() => setToastErrorShow(false)} show={toastErrorShow} onClick={() => setToastErrorShow(false)} autohide delay={5000}  className={"complete-toast"}>*/}
            {/*            <Toast.Body>*/}
            {/*                <i className="fa-solid fa-circle-xmark" style={{fontSize: '6rem', margin: 20, color: '#ff968f'}}></i>*/}
            {/*                <p className={"toast-err"} style={{fontWeight: 600, color: '#dc3545'}}>ERROR</p>*/}
            {/*                <p className={"complete-toast-text"}>{toastText}</p>*/}
            {/*            </Toast.Body>*/}
            {/*        </Toast>*/}
            {/*      </>*/}

            {/*    : <></>*/}
            {/*}*/}
            {/*</div>*/}
            {/*</div>*/}

            <div>из app</div>
            {true ? (
                <></>
            ) : (
                // <div className="App full-screen">
                //   <div className="bubbles">
                //     {BUBBLE_COUNT.length >=1 && BUBBLE_COUNT.map((item) =>
                //       <div key={item} className="bubble"></div>
                //     )}
                //   </div>
                //   <h1>STT Market</h1>
                //   <div style={{ display : 'flex', flexDirection:'column', justifyContent:'center' }}>
                //     <div id="logo-container" style={{ paddingTop: 6 }} />
                //     {allowLogin
                //         ? <div className={"loginThunk-btn"} onClick={handleLogin}><img src={"/stt-logo.svg"} alt={''}/>LOGIN</div>
                //         : <div className={"loginThunk-btn"} style={{fontSize: '1.5rem', padding: 0}}><i className="fa-duotone fa-spinner fa-spin icon-in-btn"></i></div>
                //     }
                //     {/*<Button className="meta-btn" variant="outline-secondary" size="lg" onClick={handleLogin}>Login with Wallet</Button><br/>*/}
                //     {metamaskFound
                //         ? <a href={"#!"} className={"chainLink"} onClick={chainChange}>Change network to<br/>ARBITRUM</a>
                //         : <div></div>
                //     }
                //   </div>
                // </div>
                <React.Fragment>
                    {/*<Modal show={showLoading} fullscreen={true} onHide={() => setShowLoading(false)}*/}
                    {/*       className={"preloading-modal"}>*/}
                    {/*  <Modal.Body>*/}
                    {/*    <div className={"preloader"}>*/}
                    {/*      <Grid*/}
                    {/*          height="80"*/}
                    {/*          width="80"*/}
                    {/*          color="#ffffff"*/}
                    {/*          ariaLabel="grid-loading"*/}
                    {/*          radius="12.5"*/}
                    {/*          wrapperStyle={{}}*/}
                    {/*          wrapperClass=""*/}
                    {/*          visible={true}*/}
                    {/*      />*/}
                    {/*    </div>*/}
                    {/*  </Modal.Body>*/}
                    {/*</Modal>*/}
                    {/*<div className={`container-sm `}>*/}
                    {/*<Row>*/}
                    {/*<Col xs={12} className='headerCover'>*/}
                    {/*<Header withoutWallet={withoutWallet} account={account} className={'btnShowHeader'}/>*/}
                    {/*<button onClick={showHeader} ><SvgArrow className='svgArrow'/></button>*/}
                    {/*</Col>*/}
                    {/*</Row>*/}
                    {/*<Row className='hiddenList'>*/}
                    {/*  <Col xs={12} md={6} lg={4} style={{marginBottom: 30}}>*/}
                    {/*    <Wallet withoutWallet={withoutWallet} account={account} provider={provider} />*/}
                    {/*  </Col>*/}
                    {/*  <Col xs={12} md={6} lg={4} style={{marginBottom: 30}}>*/}
                    {/*    <ChartBlock account={account} chartData={sttRates} />*/}
                    {/*  </Col>*/}
                    {/*  <Col xs={12} md={6} lg={4} style={{marginBottom: 30}}>*/}
                    {/*    <Donation account={account} withoutWallet={withoutWallet} />*/}
                    {/*  </Col>*/}
                    {/*  <Col xs={12} md={6} lg={4} style={{marginBottom: 30}}>*/}
                    {/*    <Swap account={account} withoutWallet={withoutWallet} />*/}
                    {/*  </Col>*/}
                    {/*  <Col xs={12} md={6} lg={4} style={{marginBottom: 30}}>*/}
                    {/*    <Insurance account={account} withoutWallet={withoutWallet} />*/}
                    {/*  </Col>*/}
                    {/*  <Col xs={12} md={6} lg={4} style={{marginBottom: 30}}>*/}
                    {/*    <Info account={account} withoutWallet={withoutWallet} />*/}
                    {/*  </Col>*/}
                    {/*  {!withoutWallet*/}
                    {/*    ? <Col xs={12} style={{marginBottom: 30}}>*/}
                    {/*        <History account={account} withoutWallet={withoutWallet} />*/}
                    {/*      </Col>*/}
                    {/*    : <Modal size="sm" show={showWwModal} onHide={() => setWwModal(false)} aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal"} centered >*/}
                    {/*        <Modal.Body>*/}
                    {/*          <div className={"stt_modal_header"}>*/}

                    {/*          </div>*/}
                    {/*          <div className={"help-wrapper telegram-wrapper"} style={{paddingLeft: 0, paddingRight: 0}}>*/}
                    {/*            <img src={"/img/lock.png"} alt={''} style={{width: 80, marginTop: 70}} />*/}
                    {/*            <p style={{fontSize: '1.1rem', marginBottom: 20, marginTop: 30, color: '#888888'}}>Authorization</p>*/}
                    {/*            <p style={{fontSize: '.8rem', marginTop: 0, fontWeight: 400, marginBottom: 25}}>To use full functionality, loginThunk to the<br/>website with the browser of your crypto<br/>wallet</p>*/}
                    {/*            <a href={"/loginThunk.pdf"} target={"_blank"} rel={"noreferrer"} style={{fontSize: '.8rem', marginTop: 0, fontWeight: 500, display: "block", marginBottom: 45, color: '#47c999'}}>Instructions</a>*/}

                    {/*            <Button className="modal-button"  onClick={() => setWwModal(false)}>Ok</Button>*/}
                    {/*          </div>*/}
                    {/*        </Modal.Body>*/}
                    {/*      </Modal>*/}
                    {/*  }*/}
                    {/*</Row>*/}
                    {/*<SttBonus withoutWallet={withoutWallet} account={account} provider={provider}/>*/}
                    {/*<Reels/>*/}
                    {/*<Map/>*/}
                    {/*<OpenModalAddProfile account={account}/>*/}
                    {/*<Col xs={12}>*/}
                    {/*  <h5 className={"history_title"}>Got any questions?</h5>*/}
                    {/*  <a className="convert-btn convert-action-btn contact-btn" href="https://t.me/stt_info_bot" target="_blank" rel="noopener noreferrer">Contact Us</a>*/}
                    {/*</Col>*/}
                    {/*</div>*/}
                </React.Fragment>
            )}

            <div>wallet</div>
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
            {/*                use full functionality, loginThunk to the<br/>website with the browser of your*/}
            {/*                crypto<br/>wallet*/}
            {/*            </p>*/}
            {/*            <a href={"/loginThunk.pdf"} target={"_blank"} rel={"noreferrer"} style={{*/}
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
            {/*                            use full functionality, loginThunk to the<br/>website with the browser of your crypto<br/>wallet*/}
            {/*                        </p>*/}
            {/*                        <a href={"/loginThunk.pdf"} target={"_blank"} rel={"noreferrer"} style={{*/}
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

            <div>chart</div>

            {/*<div className={"main-block eth-card"}>*/}
            {/*    <div className={"main-block__header"}>DYNAMICS*/}
            {/*        <div className={"main-block__header-number"}>{chartEnd}</div>*/}
            {/*    </div>*/}
            {/*    <div className={"chart_data-delta"}>+ {chartDelta}%</div>*/}
            {/*    /!*<Chart type={"line"} options={chartOptions} series={[{data: chartLine}]} height={'200px'} />*!/*/}
            {/*    <ResponsiveContainer height={180} width="100%">*/}
            {/*        <LineChart data={shownDataChart}*/}
            {/*                   margin={{top: 5, right: 20, left: -30, bottom: 15}}>*/}
            {/*            <YAxis style={{fontFamily: 'Ubuntu, sans-serif', fontSize: '.5rem'}}*/}
            {/*                   domain={[firstTick, 'dataMax']} tick={false} stroke={"transparent"}/>*/}
            {/*            <Line type="monotone" strokeLinejoin="round" dataKey="tick" stroke="#31d59b" strokeWidth={2}*/}
            {/*                  dot={<CustomizedDot/>} isAnimationActive={false}/>*/}
            {/*        </LineChart>*/}
            {/*    </ResponsiveContainer>*/}
            {/*    /!*<div className={"main-block__header-number"}>{firstTick}</div>*!/*/}
            {/*    /!*<div className={"chart_data-dates"}>*!/*/}
            {/*    /!*    <span>{chartStartDate}</span>*!/*/}
            {/*    /!*    <span>today</span>*!/*/}
            {/*    /!*</div>*!/*/}
            {/*</div>*/}
            {/*<Row>*/}
            {/*    <Col style={{width: '20%'}}>*/}
            {/*        <div className={zero ? "period-button eth-card _active" : "period-button eth-card"}*/}
            {/*             onClick={() => changeChartPeriod(0)}>All*/}
            {/*        </div>*/}
            {/*    </Col>*/}
            {/*    <Col style={{width: '20%'}}>*/}
            {/*        <div className={threeSixty ? "period-button eth-card _active" : "period-button eth-card"}*/}
            {/*             onClick={() => changeChartPeriod(366)}>1Y*/}
            {/*        </div>*/}
            {/*    </Col>*/}
            {/*    <Col style={{width: '20%'}}>*/}
            {/*        <div className={oneEighty ? "period-button eth-card _active" : "period-button eth-card"}*/}
            {/*             onClick={() => changeChartPeriod(181)}>6m*/}
            {/*        </div>*/}
            {/*    </Col>*/}
            {/*    <Col style={{width: '20%'}}>*/}
            {/*        <div className={ninety ? "period-button eth-card _active" : "period-button eth-card"}*/}
            {/*             onClick={() => changeChartPeriod(91)}>3m*/}
            {/*        </div>*/}
            {/*    </Col>*/}
            {/*    <Col style={{width: '20%'}}>*/}
            {/*        <div className={thirty ? "period-button eth-card _active" : "period-button eth-card"}*/}
            {/*             onClick={() => changeChartPeriod(31)}>1m*/}
            {/*        </div>*/}
            {/*    </Col>*/}
            {/*</Row>*/}
        </div>
    );
};

export default NeedDeleted;
