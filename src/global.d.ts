// global.d.ts
interface Window {
    ethereum?: any;
}

// Если это глобальные объявления, то нужно использовать `declare global`
declare global {
    interface Window {
        ethereum?: any;
    }
}
