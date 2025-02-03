// import 'bootstrap/dist/css/bootstrap.min.css';
import './shared/styles/index.scss'
import React from "react";
import { useState} from "react";
import { ethers} from "ethers";
import {
  arbitrumCurrent, exchangeContractAddress,
  tokenContractAbi,
  tokenContractAddress,
  usdtContractAbi,
  usdtContractAddress
} from "./helpers/contracts";
import axios from "axios";
import * as PropTypes from "prop-types";
import {Grid} from "react-loader-spinner";
import OpenModalAddProfile from "./widgets/openModalAddProfile/openModalAddProfile";
import Reels from "./pages/reels/reels";
import Map from "./pages/map/map";
import {useAppDispatch, useAppSelector} from "./shared/redux/hooks/hooks";
import {authActions} from "./shared/redux/slices/authSlice/authSlice";
import InfoBlock from "./widgets/infoBlock/infoBlock";
import Favorites from "./pages/favorites/favorites";
import SmartContractData from "./widgets/smartContractData/smartContractData";
import {createWeb3Modal, defaultConfig, useWeb3ModalAccount, useWeb3ModalProvider} from '@web3modal/ethers/react'
import Header from "./widgets/header/header";
import Help from "./widgets/help/help";
import {ARBITRUM} from "./shared/const/index.const";
import {showAttention} from "./shared/helpers/attention";
import UnauthorizedUser from "./widgets/infoNoAuth/infoNoAuth";
import AuthorizedUser from "./widgets/infoBlock/infoBlock";
import {WalletKit} from "@reown/walletkit";
import Core from "@walletconnect/core";


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



// const supportedChains = [ARBITRUM];
//
// // 3. Create a metadata object
// const metadata = {
//   name: 'My Website',
//   description: 'My Website description',
//   url: 'https://mywebsite.com', // origin must match your domain & subdomain
//   icons: ['https://avatars.mywebsite.com/']
// }
//
// const projectId = 'd63219dbf5faf0a8dba4e3a892b1e2d1';
//
// // 4. Создание конфигурации Ethers
// /** ДЛЯ прода*/
//
// const ethersConfig = defaultConfig({
//   metadata,
//   enableEIP6963: true, // ✅ Разрешаем автоматическое обнаружение кошельков
//   enableInjected: true, // ✅ Поддержка MetaMask, Brave Wallet и др.
//   enableCoinbase: true, // ✅ Разрешаем Coinbase Wallet
//   rpcUrl: ARBITRUM.rpcUrl, // Основной RPC для Arbitrum
//   defaultChainId: ARBITRUM.chainId, // Сеть по умолчанию - Arbitrum One
// });
//
// // 5. Create a Web3Modal instance
// createWeb3Modal({
//   ethersConfig,
//   chains: supportedChains,
//   projectId,
//   enableAnalytics: true // Optional - defaults to your Cloud configuration
// })

const core = new Core({
  projectId: 'd63219dbf5faf0a8dba4e3a892b1e2d1'
})


function App() {
  // const [provider, setProvider] = useState(null)
  // const [withoutWallet, setWithoutWallet] = useState(false)
  // const [showLoading, setShowLoading] = useState(false)
  // const [metamaskFound, setMetamaskFound] = useState(false)
  // const [sttRates, setSttRates] = useState([])
  // const [allowLogin, setAllowLogin] = useState(false)
  // const [showWwModal, setWwModal] = useState(false)

  const dispatch = useAppDispatch()

  /** states */
  const {loggedIn, account, provider } = useAppSelector(state => state.authSlice)

  /** actions*/
  const {changeStateLoggedIn, addAccount, addProvider, addSttRates, addWithoutWallet, addAllowLogin, addTelegramUsername, addWalletKit} = authActions;

  /** web3modal*/
  const { walletProvider } = useWeb3ModalProvider();
  const { chainId, isConnected } = useWeb3ModalAccount();

  /** functions*/


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


  // const switchToArbitrum = async () => {
  //   try {
  //     await window.ethereum.request({
  //       method: 'wallet_switchEthereumChain',
  //       params: [{ chainId: `0x${ARBITRUM.chainId.toString(16)}` }],
  //     });
  //   } catch (error) {
  //     // Если сеть не добавлена в кошелек, добавляем ее
  //     if (error.code === 4902) {
  //       await window.ethereum.request({
  //         method: 'wallet_addEthereumChain',
  //         params: [
  //           {
  //             chainId: `0x${ARBITRUM.chainId.toString(16)}`,
  //             chainName: ARBITRUM.name,
  //             nativeCurrency: {
  //               name: ARBITRUM.currency,
  //               symbol: ARBITRUM.currency,
  //               decimals: 18,
  //             },
  //             rpcUrls: [ARBITRUM.rpcUrl],
  //             blockExplorerUrls: [ARBITRUM.explorerUrl],
  //           },
  //         ],
  //       });
  //     }
  //   }
  // };

  /** проверка подключенного телеграмма*/
  async function checkTelegram(requested) {
    try {
      const data = {'account': account}
      const response = await axios.post('https://stt.market/api/notifications/check/', data)
      if (response.status === 200) {
        let dd = response.data
        if(dd?.username)  dispatch(addTelegramUsername(dd.username))

        // if (requested) {
        //   if (dd.username !== '') {
        //     closeModalTelegram()
        //     setToastCompleteShow(true)
        //   } else {
        //     setToastText('Are you sure you have sent the code?')
        //     setToastErrorShow(true)
        //   }
        // }
      }
    } catch(err) {
      console.log(err);
    }
  }

  /** получение провайдера и адреса кошелька*/
  async function getInfo(providerWallet) {
    const provider = new ethers.BrowserProvider(providerWallet);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    dispatch(changeStateLoggedIn(true))
    dispatch(addProvider(provider))
    dispatch(addAccount(userAddress))
  }

  /** функция получения информация для отображения графика STT token*/
  async function getRates() {
      try {
        const result = await axios.get('https://stt.market/rates')

        const rates = result?.data?.map(el => ({
          date: el.date,
          tick: parseFloat(el.tick.toFixed(7))
        }));

        if(window.ethereum && chainId === ARBITRUM?.chainId && provider) {
          const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider);
          const usdtContract = new ethers.Contract(usdtContractAddress, usdtContractAbi, provider);

          const fullSt = Number(await contract.totalSupply()) / Math.pow(10, 9);
          const fullUs = Number(await usdtContract.balanceOf(exchangeContractAddress)) / Math.pow(10, 6);
          const latest_rate = parseFloat((fullUs / fullSt).toFixed(7));

          const today = new Date();
          const formattedToday = today.toLocaleDateString('ru-RU');

          rates.push({ tick: latest_rate, date: formattedToday });

          dispatch(addSttRates(rates));
          dispatch(addAllowLogin(true));

        } else {
          dispatch(addSttRates(rates));
          dispatch(addWithoutWallet(true));
          dispatch(changeStateLoggedIn(true));
        }

      } catch(err) {
        console.log(err);
      }
  }

  /** hooks*/
  /** запуск проверки подключенного тг для уведомления*/
  React.useEffect(() => {
    checkTelegram(true)

  }, []);

  React.useEffect(() => {
    if(account) getRates()
  },[account])

  /** проверяем при авторизации к какой сети подключается пользователь*/
  React.useEffect(() => {
      if(walletProvider && chainId === ARBITRUM.chainId) {
        getInfo(walletProvider)
      }
    },[walletProvider])

  React.useEffect(() => {
    if (isConnected && chainId !== ARBITRUM.chainId) {
      showAttention(`Please, connect to Arbitrum Network (${ARBITRUM.chainId})`, 'warning')
      alert(`Please, connect to Arbitrum Network (${ARBITRUM.chainId})`);
      switchToArbitrum();
    }
  }, [chainId, isConnected]);


  /** добавить слушателя смены сети и кошелька а также сделать реконнект*/

  const [walletKit, setWalletKit] = useState(null);

  async function getWalletKit() {
    const walletKit = await WalletKit.init({
      core, // <- pass the shared `core` instance
      metadata: {
        name: 'Demo app',
        description: 'Demo Client as Wallet/Peer',
        url: 'https://reown.com/walletkit',
        icons: []
      }
    });
    setWalletKit(walletKit);
    // dispatch(addWalletKit(walletKit));
  }
  getWalletKit()

  return (
      <>
        <div>
          <Header walletKit={walletKit}/>
          {!loggedIn
              ? <UnauthorizedUser/>
              : <AuthorizedUser/>
          }
          <div className={`cover__container`}>
            {!loggedIn ? <SmartContractData/> : <div></div>}
            <Favorites/>
            <Reels/>
            <Map/>
            <OpenModalAddProfile account={account}/>
            <Help/>
          </div>
        </div>

        {loggedIn ? (
            <></>
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
              //         ? <div className={"login-btn"} onClick={handleLogin}><img src={"/stt-logo.svg"} alt={''}/>LOGIN</div>
              //         : <div className={"login-btn"} style={{fontSize: '1.5rem', padding: 0}}><i className="fa-duotone fa-spinner fa-spin icon-in-btn"></i></div>
              //     }
              //     {/*<Button className="meta-btn" variant="outline-secondary" size="lg" onClick={handleLogin}>Login with Wallet</Button><br/>*/}
              //     {metamaskFound
              //         ? <a href={"#!"} className={"chainLink"} onClick={chainChange}>Change network to<br/>ARBITRUM</a>
              //         : <div></div>
              //     }
              //   </div>
              // </div>
          ) : (
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
                  {/*            <p style={{fontSize: '.8rem', marginTop: 0, fontWeight: 400, marginBottom: 25}}>To use full functionality, login to the<br/>website with the browser of your crypto<br/>wallet</p>*/}
                  {/*            <a href={"/login.pdf"} target={"_blank"} rel={"noreferrer"} style={{fontSize: '.8rem', marginTop: 0, fontWeight: 500, display: "block", marginBottom: 45, color: '#47c999'}}>Instructions</a>*/}

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
        </>
        );
        }

        export default App;
