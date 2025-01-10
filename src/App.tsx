import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import './App.css';
import './bubbles.css'
import {useEffect, useState} from "react";
import {BrowserProvider, ethers} from "ethers";
import {
  arbitrumCurrent, exchangeContractAddress,
  tokenContractAbi,
  tokenContractAddress,
  usdtContractAbi,
  usdtContractAddress
} from "./helpers/contracts";
import axios from "axios";
import {Button, Col, Modal, Row} from "react-bootstrap";
import * as PropTypes from "prop-types";
import {Grid} from "react-loader-spinner";
import Header from "./widgets/header/header";
import Wallet from "./pages/wallet/wallet";
import Donation from "./pages/donation/donation";
import Swap from "./pages/swap/swap";
import Insurance from "./pages/insurance/insurance";
import Info from "./pages/info/info";
import History from "./pages/history/history";
import OpenModalAddProfile from "./widgets/openModalAddProfile/openModalAddProfile";
import SttBonus from "./pages/sttBonus/sttBonus";
import Reels from "./pages/reels/reels";
import Map from "./pages/map/map";
import {ReactComponent as SvgArrow} from "./assets/svg/arrow.svg";
import {BUBBLE_COUNT} from "./shared/const/index.const";
import {useAppDispatch, useAppSelector} from "./shared/redux/hooks/hooks";
import {authActions} from "./shared/redux/slices/authSlice/authSlice";
import ChartBlock from "./pages/chart/chart";

Grid.propTypes = {
  wrapperClass: PropTypes.string,
  visible: PropTypes.bool,
  color: PropTypes.string,
  wrapperStyle: PropTypes.shape({}),
  width: PropTypes.string,
  radius: PropTypes.string,
  height: PropTypes.string,
  ariaLabel: PropTypes.string
};

function App() {
  const [provider, setProvider] = useState(null)
  const [withoutWallet, setWithoutWallet] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [metamaskFound, setMetamaskFound] = useState(false)
  const [sttRates, setSttRates] = useState([])
  const [allowLogin, setAllowLogin] = useState(false)
  const [showWwModal, setWwModal] = useState(false)

  const dispatch = useAppDispatch()

  /** states */
  const {loggedIn, account } = useAppSelector(state => state.authSlice)

  /** authActions*/
  const {changeStateLoggedIn, addAccount, addProvider, addWallet} = authActions;

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

// async function handleLogin() {
//
//     // const contractAbi = [
//     //   "function getReferrals(address user) public view returns (address[])",
//     //   "function getBalance(address user) public view returns (uint256)",
//     //   "function getReferralLink(address user) public view returns (string)"
//     // ];
//
//     if (window.ethereum) {
//         window.ethereum.request({method: "eth_chainId"}).then((result) => {
//             if (result === arbitrumCurrent[0]['chainId'] || result === 42161) {
//                 window.ethereum
//                     .request({ method: "eth_requestAccounts" })
//                     .then(async (result) => {
//                         const res_acc = ethers.getAddress(result[0])
//                         const provider = new BrowserProvider(window.ethereum); // Провайдер MetaMask
//                         const signer = await provider.getSigner(); // Подписант
//                         // console.log(signer);
//                         const balance = await provider.getBalance(res_acc); // Получаем баланс в wei
//                         const ref = await provider.getSigner(res_acc)
//                         // setProvider(provider);
//                         // setAccount(res_acc);
//                         dispatch(changeStateLogIn(true))
//                         dispatch(addNumberWallet(res_acc))
//                         setLogin(true);
//                     })
//                     .catch((error) => {
//                         console.log("Could not detect Account");
//                     });
//             } else {
//                 alert('Please, connect to Arbitrum Network (' + result + ') does not match with (' + arbitrumCurrent[0]['chainId'] + ')')
//                 handleLogout()
//             }
//         })
//     } else {
//         console.log("Need to install MetaMask");
//     }
// }

async function handleLogin() {
    console.log(2)
  try {
    const result = await window.ethereum.request({ method: "eth_chainId" });
    console.log(result);
    console.log(1)
    if (result === arbitrumCurrent[0]['chainId'] || result === 42161) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts[0]) {
          const res_acc = ethers.getAddress(accounts[0]);
          const provider = new BrowserProvider(window.ethereum); // Провайдер MetaMask
          const signer = await provider.getSigner(); // Подписант
          const balance = await provider.getBalance(res_acc); // Получаем баланс в wei
          const ref = await provider.getSigner(res_acc);
          // setLogin(true);
          // setAccount(res_acc);
          console.log(`acc ${res_acc}`);
          setProvider(provider);
          dispatch(changeStateLoggedIn(true))
          // dispatch(addWallet(res_acc))
          // dispatch(addProvider(provider))
          dispatch(addProvider(provider))
          dispatch(addAccount(res_acc))
        } else {
          console.error("Account address is null or undefined.");
        }
      } catch (error) {
        console.log("Could not detect Account", error);
      }
    } else {
      alert('Please, connect to Arbitrum Network (' + result + ') does not match with (' + arbitrumCurrent[0]['chainId'] + ')');
      handleLogout();
    }
  } catch (error) {
    console.log("Error fetching chain ID", error);
  }
}

  const handleLogout = () => {
    dispatch(changeStateLoggedIn(false))
    dispatch(addAccount(null))
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      setMetamaskFound(true)
    } else {
      setMetamaskFound(false)
      setTimeout(function () {
        setWwModal(true)
      }, 3000)
      setInterval(function () {
        setWwModal(true)
      }, 600000)
    }
    let rates = []

    axios.get('https://stt.market/rates')
        .then(res => {
          res.data.forEach(el => rates.push({date: el.date, tick: parseFloat(el.tick.toFixed(7))}))
          if (window.ethereum) {
            window.ethereum.request({method: "eth_chainId"}).then((result) => {
              if (result === arbitrumCurrent[0]['chainId'] || result === 42161) {
                const provider_balance = new ethers.BrowserProvider(window.ethereum)
                const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider_balance);
                const usdtContract = new ethers.Contract(usdtContractAddress, usdtContractAbi, provider_balance);
                let fullSt = 0.0
                let fullUs = 0.0
                const getChart = async () => {
                  await contract.totalSupply().then(res => {
                    fullSt = Number(res) / Math.pow(10, 9)
                  })
                  await usdtContract.balanceOf(exchangeContractAddress).then(res => {
                    fullUs = Number(res) / Math.pow(10, 6)
                  })
                  let latest_rate = parseFloat((fullUs / fullSt).toFixed(7))
                  const today = new Date();
                  const yyyy = today.getFullYear();
                  let mm:any = today.getMonth() + 1; // Months start at 0!
                  let dd:any = today.getDate();
                  if (dd < 10) dd = '0' + dd;
                  if (mm < 10) mm = '0' + mm;
                  const formattedToday = dd + '.' + mm + '.' + yyyy;
                  rates.push({"tick": latest_rate, "date": formattedToday})
                }
                getChart()
                setSttRates(rates)
                setAllowLogin(true)
              } else {
                setAllowLogin(true)
              }
            })
          } else {
            setSttRates(rates)
            setWithoutWallet(true)
            dispatch(changeStateLoggedIn(true))
          }
        })
  }, [])

  const [showList, setShowList] = React.useState(false)

  const showHeader = (e) => {
    setShowList(prev => !prev)
  }

  return (

    <div>
      {!loggedIn ? (
          <div className="App full-screen">
            <div className="bubbles">
              {BUBBLE_COUNT.length >=1 && BUBBLE_COUNT.map((item) =>
                <div key={item} className="bubble"></div>
              )}
            </div>
            <h1>STT Market</h1>
            <div style={{ display : 'flex', flexDirection:'column', justifyContent:'center' }}>
              <div id="logo-container" style={{ paddingTop: 6 }} />
              {allowLogin
                  ? <div className={"login-btn"} onClick={handleLogin}><img src={"/stt-logo.svg"} alt={''}/>LOGIN</div>
                  : <div className={"login-btn"} style={{fontSize: '1.5rem', padding: 0}}><i className="fa-duotone fa-spinner fa-spin icon-in-btn"></i></div>
              }
              {/*<Button className="meta-btn" variant="outline-secondary" size="lg" onClick={handleLogin}>Login with Wallet</Button><br/>*/}
              {metamaskFound
                  ? <a href={"#!"} className={"chainLink"} onClick={chainChange}>Change network to<br/>ARBITRUM</a>
                  : <div></div>
              }
            </div>
          </div>
      ) : (
          <React.Fragment>
            <Modal show={showLoading} fullscreen={true} onHide={() => setShowLoading(false)} className={"preloading-modal"}>
              <Modal.Body>
                <div className={"preloader"}>
                  <Grid
                      height="80"
                      width="80"
                      color="#ffffff"
                      ariaLabel="grid-loading"
                      radius="12.5"
                      wrapperStyle={{}}
                      wrapperClass=""
                      visible={true}
                  />
                </div>
              </Modal.Body>
            </Modal>
            <div className={`container-sm ${showList && 'show'}`}>
              <Row>
                <Col xs={12} className='headerCover'>
                  <Header withoutWallet={withoutWallet} account={account} className={'btnShowHeader'}/>
                  <button onClick={showHeader} ><SvgArrow className='svgArrow'/></button>
                </Col>
              </Row>
              <Row className='hiddenList'>
                <Col xs={12} md={6} lg={4} style={{marginBottom: 30}}>
                  <Wallet withoutWallet={withoutWallet} account={account} provider={provider} />
                </Col>
                <Col xs={12} md={6} lg={4} style={{marginBottom: 30}}>
                  <ChartBlock account={account} chartData={sttRates} />
                </Col>
                <Col xs={12} md={6} lg={4} style={{marginBottom: 30}}>
                  <Donation account={account} withoutWallet={withoutWallet} />
                </Col>
                <Col xs={12} md={6} lg={4} style={{marginBottom: 30}}>
                  <Swap account={account} withoutWallet={withoutWallet} />
                </Col>
                <Col xs={12} md={6} lg={4} style={{marginBottom: 30}}>
                  <Insurance account={account} withoutWallet={withoutWallet} />
                </Col>
                <Col xs={12} md={6} lg={4} style={{marginBottom: 30}}>
                  <Info account={account} withoutWallet={withoutWallet} />
                </Col>
                {!withoutWallet
                  ? <Col xs={12} style={{marginBottom: 30}}>
                      <History account={account} withoutWallet={withoutWallet} />
                    </Col>
                  : <Modal size="sm" show={showWwModal} onHide={() => setWwModal(false)} aria-labelledby="info-mod-title" className={"pre-form-modal telegram-modal"} centered >
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
                }
              </Row>
              <SttBonus withoutWallet={withoutWallet} account={account} provider={provider}/>
              <Reels/>
              <Map/>
              <OpenModalAddProfile account={account}/>
              <Col xs={12}>
                <h5 className={"history_title"}>Got any questions?</h5>
                <a className="convert-btn convert-action-btn contact-btn" href="https://t.me/stt_info_bot" target="_blank" rel="noopener noreferrer">Contact Us</a>
              </Col>
            </div>
          </React.Fragment>
      )}
    </div>
  );
}

export default App;
