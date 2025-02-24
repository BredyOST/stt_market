import './shared/styles/index.scss';
import React from 'react';
import OpenModalAddProfile from './widgets/openModalAddProfile/openModalAddProfile';
import Reels from './pages/reels/reels';
import Map from './pages/map/map';
import { useAppSelector } from './shared/redux/hooks/hooks';
import SmartContractData from './widgets/smartContractData/smartContractData';
import Header from './widgets/header/header';
import Help from './widgets/help/help';
import { ARBITRUM } from './shared/const/index.const';
import { showAttention } from './shared/helpers/attention';
import UnauthorizedUser from './widgets/infoNoAuth/infoNoAuth';
import AuthorizedUser from './widgets/infoBlock/infoBlock';
import { BrowserProvider, ethers, Contract } from 'ethers';
import { createAppKit, useAppKitAccount, useAppKitNetwork, useAppKitProvider } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { arbitrum } from '@reown/appkit/networks';
import { ToastContainer } from 'react-toastify';
import History from './pages/history/history';
import SliderVideo from './widgets/sliderVideo/sliderVideo';
import Loader from './widgets/loader/loader';
import Portal from './shared/ui/portal/portal';
import '@reown/appkit-wallet-button/react';
import { useAuthState, useGetLocalStateForForms } from './shared/helpers/hooks';
import Services from './pages/services/services';
import cls from "./pages/addProfile/addProfile.module.scss";
import PreviewBlock from "./feautures/modalWindows/previewBlock/previewBlock";

const projectId = 'd63219dbf5faf0a8dba4e3a892b1e2d1';

// 3. Create a metadata object
const metadata = {
    name: 'My Website',
    description: 'My Website description',
    url: 'https://mywebsite.com', // origin must match your domain & subdomain
    icons: ['https://avatars.mywebsite.com/'],
};

// 4. Create a AppKit instance
createAppKit({
    adapters: [new EthersAdapter()],
    networks: [arbitrum],
    metadata,
    projectId,
    features: {
        analytics: true, // Optional - defaults to your Cloud configuration
        email: false, // default to true
        socials: false,
        swaps: false, // Optional - true by default
        send: false,
        onramp: false, // убрать buy cripto
    },
});

export const DONAT_ADDRESS = process.env.REACT_APP_DONATION_ERC;
export const FUNDING_WALLET_IQ_PUMP = process.env.REACT_APP_FUNDING_WALLET_ERC;

function App() {
    /** STATES */
    const { loggedIn, account, isLoader } = useAppSelector(({ authSlice }) => authSlice);
    const { modalReals } = useAppSelector(({ modalWindow }) => modalWindow);

    /** HOOKS */
    const updateAuthState = useAuthState();
    /** проверка хранилища для обновления данных формы если они не заполнены*/
    const { checkLocalStorage } = useGetLocalStateForForms();

    /** appkit*/
    const { isConnected } = useAppKitAccount();
    const { walletProvider } = useAppKitProvider('eip155');
    const { chainId, switchNetwork } = useAppKitNetwork();

    /** FUNCTIONS*/
    /** создание провайдера и получение адреса кошелька*/
    async function getInfo(providerWallet: any): Promise<void> {
        try {
            const ethersProvider = new BrowserProvider(providerWallet);
            const signer = await ethersProvider.getSigner();
            const userAddress = await signer.getAddress();

            updateAuthState('loggedIn', true);
            updateAuthState('provider', ethersProvider);
            updateAuthState('account', userAddress);
            // updateAuthState('signer', signer);
        } catch (err) {
            console.log(err);
        }
    }

    /** проверяем при авторизации к какой сети подключается пользователь*/
    React.useEffect(() => {
        if (walletProvider && chainId === ARBITRUM.chainId) {
            getInfo(walletProvider);
        }
    }, [walletProvider, chainId]);

    /** при смене сети или входе через кошелек проверяем chainid и меняем на арбитрум если требуется*/
    React.useEffect(() => {
        if (!isConnected) {
            updateAuthState('loggedIn', false);
            updateAuthState('provider', null);
            updateAuthState('account', null);
        } else if (chainId !== ARBITRUM.chainId) {
            showAttention(`Please, connect to Arbitrum Network (${ARBITRUM.chainId})`, 'error');
            switchNetwork(arbitrum);
        }
    }, [chainId, isConnected]);

    React.useEffect(() => {
        checkLocalStorage();
    }, []);

    return (
        <>
            <div className='wrapper'>
                <div>
                    <Header/>
                    {!loggedIn ? <UnauthorizedUser/> : <AuthorizedUser/>}
                    <div className={`cover__container`}>
                        {!loggedIn && <SmartContractData/>}
                        {/*<Services />*/}
                        {/*<Reels />*/}
                        <Map/>
                        {loggedIn && <OpenModalAddProfile account={account}/>}
                        <Help/>
                        {loggedIn && <History/>}
                    </div>
                </div>
                <ToastContainer/>
                <Portal whereToAdd={document.body}>
                    <Loader isLoading={isLoader}/>
                </Portal>
                <SliderVideo show={modalReals}/>
            </div>
            <ToastContainer/>
        </>
    );
}

export default App;
