import './shared/styles/index.scss'
import React from "react";
import {
  exchangeContractAddress,
  tokenContractAbi,
  tokenContractAddress,
  usdtContractAbi,
  usdtContractAddress
} from "./helpers/contracts";
import axios from "axios";
import OpenModalAddProfile from "./widgets/openModalAddProfile/openModalAddProfile";
import Reels from "./pages/reels/reels";
import Map from "./pages/map/map";
import {useAppDispatch, useAppSelector} from "./shared/redux/hooks/hooks";
import {authActions} from "./shared/redux/slices/authSlice/authSlice";
import Favorites from "./pages/favorites/favorites";
import SmartContractData from "./widgets/smartContractData/smartContractData";
import Header from "./widgets/header/header";
import Help from "./widgets/help/help";
import {ARBITRUM} from "./shared/const/index.const";
import {showAttention} from "./shared/helpers/attention";
import UnauthorizedUser from "./widgets/infoNoAuth/infoNoAuth";
import AuthorizedUser from "./widgets/infoBlock/infoBlock";
import {ethers} from "ethers";
import {createAppKit, useAppKitAccount, useAppKitNetwork, useAppKitProvider} from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { arbitrum } from '@reown/appkit/networks'
import {ToastContainer} from "react-toastify";
import History from "./pages/history/history";
import SliderVideo from "./widgets/sliderVideo/sliderVideo";


const projectId = 'd63219dbf5faf0a8dba4e3a892b1e2d1'

// 2. Set the networks
const networks = [arbitrum  ]

// 3. Create a metadata object
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/']
}

// 4. Create a AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  networks: [arbitrum],
  metadata,
  projectId,
  features: {
    analytics: true // Optional - defaults to your Cloud configuration
  }
})

function App() {

  const dispatch = useAppDispatch()

  /** states */
  const {loggedIn, account, provider } = useAppSelector(state => state.authSlice)

  /** actions*/
  const {changeStateLoggedIn, addAccount, addProvider, addSttRates, addWithoutWallet, addAllowLogin, addTelegramUsername, addWalletKit} = authActions;

  /** appkit*/
  const { address, isConnected  } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')
  const { caipNetwork, caipNetworkId, chainId, switchNetwork } = useAppKitNetwork()

  /** functions*/
  /** проверка подключенного телеграмма*/
  async function checkTelegram(): Promise<void> {
    try {
      const data:{'account': string}  = {'account': account}
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
  async function getInfo(providerWallet:any): Promise<void> {
    const provider = new ethers.BrowserProvider(providerWallet);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    dispatch(changeStateLoggedIn(true))
    dispatch(addProvider(provider))
    dispatch(addAccount(userAddress))
  }
  /** функция получения информация для отображения графика STT token*/
  async function getRates(): Promise<void> {
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
    checkTelegram()
  }, []);

  /** получить информация для графика*/
  React.useEffect(() => {
    if(account) getRates()
  },[account])

  /** проверяем при авторизации к какой сети подключается пользователь*/
  React.useEffect(() => {
    if(walletProvider && chainId === ARBITRUM.chainId) {
      getInfo(walletProvider)
    }
  },[walletProvider])

  /** при смене сети или входе через кошелек проверяем chainid и меняем на арбитрум если требуется*/
  React.useEffect(() => {
    if (isConnected && chainId !== ARBITRUM.chainId) {
      showAttention(`Please, connect to Arbitrum Network (${ARBITRUM.chainId})`, 'error')
      switchNetwork(arbitrum)
    }
  }, [chainId, isConnected]);

  return (
      <>
        <div>
          <Header />
          {/*<SliderVideo/>*/}
          {!loggedIn
              ? <UnauthorizedUser/>
              : <AuthorizedUser/>
          }
          <div className={`cover__container`}>
            {!loggedIn && <SmartContractData/>}
            <Favorites/>
            <Reels/>
            <Map/>
            <OpenModalAddProfile account={account}/>
            <Help/>
            <History/>
          </div>
        </div>
        <ToastContainer />
      </>
  );
}

export default App;
