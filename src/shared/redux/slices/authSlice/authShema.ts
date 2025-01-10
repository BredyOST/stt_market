

/**
 * @login - состояние авторизации
 * @account - номер кошелька
 * @provider - провайдер авторизованного пользователя
 * @wallet - номер кошелька
 * */

export interface AuthSchemaState {
    loggedIn: boolean;
    account: any;
    provider:any;
    wallet: string | null;
}