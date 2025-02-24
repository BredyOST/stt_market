/**
 * @loggedIn - состояние авторизации
 * @account - номер кошелька
 * @provider - провайдер авторизованного пользователя
 * @wallet - номер кошелька
 * */

export interface AuthSchema {
    loggedIn: boolean;
    signer: any;
    account: any;
    provider: any;
    wallet: string | null;
    sttRates: any | null;
    telegramCode: string | null;
    telegramValid: any;
    telegramUsername: null | string;
    withoutWallet: boolean;
    allowLogin: boolean;
    sourceToken: string;
    targetToken: string;
    walletKit: any;
    isLoader: boolean;
    chosenFavouritesIdReals: number | null;
    hasUpliner: boolean;
    tabRealsOrServices: number;
    donationToken: string;
    profilesWithServices: any;
    activeSlideCards: number;
    erc20FromReals: string;
    transferToTheShop: boolean | null;
    donateWalletFromReals: string | null;
    walletFromSendTokensForm: string | null;
    textInfo: string;
}
