/**
 * @loggedIn - состояние авторизации
 * @account - номер кошелька
 * @provider - провайдер авторизованного пользователя
 * @wallet - номер кошелька
 * */

export interface AuthSchemaState {
    loggedIn: boolean;
    account: any;
    provider:any;
    wallet: string | null;
    sttRates: any | null;
    telegramCode: string | null;
    telegramValid: any;
    telegramUsername:null | string;
    withoutWallet: boolean;
    allowLogin: boolean;
    sourceToken: string;
    targetToken: string ;
    walletKit:any;
    isLoader:boolean;
    chosenFavouritesIdReals: number | null,
    hasUpliner: boolean,
    tabRealsOrServices: number
    donationToken: string
    profilesWithServices: any
    activeSlideCards: number;
}