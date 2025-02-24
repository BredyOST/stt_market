import React, { useCallback, useEffect, useRef, useState } from 'react';
import { tokenContractAbi, tokenContractAddress } from '../../helpers/contracts';
import { ethers } from 'ethers';
import cls from './hystory.module.scss';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../shared/redux/hooks/hooks';
import { ReactComponent as SvgCheck } from './../../assets/svg/check.svg';
import { ReactComponent as SvgLongArrow } from './../../assets/svg/longArrow.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Portal from '../../shared/ui/portal/portal';
import Modal from '../../shared/ui/modal/modal';
import { ForFunc } from '../../entities/others';
import CustomButton from '../../shared/ui/сustomButton/CustomButton';
import TransferForm from '../../feautures/modalWindows/transferForm/transferForm';
import { useModal } from '../../shared/helpers/hooks';

function History(props) {
    const [history, setHistory] = useState([]);
    const [fullHistory, setFullHistory] = useState([]);
    const [historyWidth, setHistoryWidth] = useState(250);
    const [loadHistoryShow, setLoadHistoryShow] = useState(false);
    const [aList, setAList] = useState([]);
    const [pAList, setPAList] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [totalSupply, setTotalSupply] = useState(0.0);
    const [contractBalance, setContractBalance] = useState(0.0);
    const [historyReady, setHistoryReady] = useState(false);
    const [historyNeedLoad, setHistoryNeedLoad] = useState(false);
    const [leftScroll, setLeftScroll] = useState(0);
    const historyRef = useRef<any>(null);

    const dispatch = useAppDispatch();

    /** states */
    const { loggedIn, account, provider, isLoader } = useAppSelector((state) => state.authSlice);
    const { modalTransferForm, isClosingModalTransferForm } = useAppSelector((state) => state.modalWindow);
    const [activeTransaction, setActiveTransaction] = React.useState(null);

    const { t } = useTranslation();

    /** управление модальными окнами*/
    const { openModal } = useModal();

    /** FUNCTIONS*/
    /** для отображения попапа отправки токенов*/
    const showModal: ForFunc<any, void> = (item) => {
        setActiveTransaction(item);
        openModal('modalTransferForm');
    };

    function dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === '-') {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            /* next line works with strings and numbers,
             * and you may want to customize it to your needs
             */
            var result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
            return result * sortOrder;
        };
    }
    async function handleHistory(acc) {
        const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, provider);

        let history: any = [];
        let full_list = [];
        let full_hashes = [];
        let hash_list = [];
        let offers_list = [];
        let pending_list = [];

        try {
            const swapFilters = contract.filters.Transfer(acc, '0x0000000000000000000000000000000000000000');
            const swapResults: any = await contract.queryFilter(swapFilters, 98085403, 'latest');

            for (const hash of swapResults) {
                const block = await provider.getBlock(hash.blockNumber);
                const timestamp = new Date(block.timestamp * 1000);
                let amount = parseInt(hash.args[2].toString()) / Math.pow(10, 9);

                hash_list.push({
                    hash: hash.transactionHash,
                    type: 'Swap',
                    modifier: '- ',
                    class: 'swap',
                    block: hash.blockNumber,
                    priority: 1,
                    timestamp: timestamp,
                    amount: amount,
                    from: null,
                    to: null,
                });
            }

            //исходящие переводы
            const filters = contract.filters.Transfer(acc);

            const ctrResults: any = await contract.queryFilter(filters, 98085403, 'latest');

            for (const hash of ctrResults) {
                if (!full_hashes.includes(hash.transactionHash.toString().toLowerCase())) {
                    let amount = parseInt(hash.args[2].toString()) / Math.pow(10, 9);
                    const block = await provider.getBlock(hash.blockNumber);
                    const timestamp = new Date(block.timestamp * 1000);
                    hash_list.push({
                        hash: hash?.transactionHash,
                        type: 'Transfer Out',
                        modifier: '- ',
                        class: 'out',
                        block: hash?.blockNumber,
                        priority: 1,
                        timestamp: timestamp,
                        amount: amount,
                        from: hash?.topics[1],
                        to: hash?.topics[2],
                    });
                    full_hashes.push(hash.transactionHash);
                }
            }

            // запрос входящих
            const incFilters = contract.filters.Transfer(null, acc);
            const incResults: any = await contract.queryFilter(incFilters, 98085403, 'latest');

            for (const hash of incResults) {
                if (!full_hashes.includes(hash.transactionHash.toString().toLowerCase())) {
                    let amount = parseInt(hash.args[2].toString()) / Math.pow(10, 9);
                    if (hash.args[0].toString() !== '0x0000000000000000000000000000000000000000') {
                        const block = await provider.getBlock(hash.blockNumber);
                        const timestamp = new Date(block.timestamp * 1000);

                        hash_list.push({
                            hash: hash.transactionHash,
                            type: 'Transfer In',
                            modifier: '+ ',
                            class: 'in',
                            block: hash.blockNumber,
                            priority: 1,
                            amount: amount,
                            timestamp: timestamp,
                            from: hash?.topics[1],
                            to: hash?.topics[2],
                        });
                    }
                }
            }

            let distinct = [];
            let new_hash_list = [];
            for (const i of hash_list) {
                if (distinct.includes(i['hash'])) {
                } else {
                    distinct.push(i['hash']);
                    new_hash_list.push(i);
                }
            }

            new_hash_list = new_hash_list.sort(dynamicSort('block')).reverse();
            full_list = full_list.concat(new_hash_list);

            let final_list = full_list.sort(dynamicSort('block')).reverse().slice(0, 50);
            final_list = [...pending_list, ...final_list];

            if (offers_list.length > 0) {
                final_list = [...offers_list, ...final_list];
            }

            setFullHistory(final_list);
            setHistoryReady(true);

            if (full_list.length > 0 && history.length === 0) {
                setHistoryNeedLoad(true);
            } else {
                setHistoryNeedLoad(false);
            }
            if (offers_list.length > 0) {
                historyRef.current.getHistory(offers_list.length);
            }
        } catch (e) {
            console.log(e);
            setFullHistory(full_list);
            setHistoryReady(true);
            // historyRef.current.getHistory()
        }
    }

    const setHistoryInParent = useCallback(
        (val) => {
            setHistory(val);
        },
        [setHistory]
    );

    const setHistoryWidthInParent = useCallback(
        (val) => {
            setHistoryWidth(val);
        },
        [setHistoryWidth]
    );

    const setHistoryShowInParent = useCallback(
        (val) => {
            setLoadHistoryShow(val);
        },
        [setLoadHistoryShow]
    );

    const changeHistoryLoading = useCallback(
        (val) => {
            setHistoryLoading(val);
        },
        [setHistoryLoading]
    );

    const changeLeftScroll = useCallback(
        (val) => {
            setLeftScroll(val);
        },
        [setLeftScroll]
    );

    useEffect(() => {
        if (account) {
            handleHistory(account);
        }
    }, [account]);

    return (
        <div className={cls.wrapper}>
            <div className={cls.coverSubTitle}>
                <h3 className={cls.title}>{t('Transaction')}</h3>
            </div>
            {!fullHistory?.length && (
                <div className={cls.cover_check}>
                    <SvgCheck className={cls.svgCheck} />
                </div>
            )}
            <div className={cls.cover_list_slides}>
                <Swiper
                    slidesPerView={'auto'}
                    centeredSlides={true}
                    pagination={{
                        clickable: true,
                    }}
                    spaceBetween={20}
                    className='mySwiper'
                    loop={true}
                >
                    <div className={cls.cover}>
                        {fullHistory?.length > 0 &&
                            fullHistory?.map((item: any) => {
                                const background = item?.type === 'Transfer In' ? 'in' : item?.type === 'Transfer Out' ? 'out' : 'swap';

                                return (
                                    <SwiperSlide style={{ width: 'fit-content' }} key={item?.hash}>
                                        <CustomButton
                                            classnameWrapper={cls.cover_transaction}
                                            classNameBtn={cls.btn}
                                            onClick={() => showModal(item)}
                                            type='button'
                                        >
                                            <div className={cls.cover_in_btn}>
                                                <div className={cls.cover}>
                                                    <div className={`${cls.arrow_background} ${cls[background]}`}>
                                                        <SvgLongArrow className={cls.arrow} />
                                                    </div>
                                                </div>
                                                <h3 className={cls.type}>{item?.type}</h3>
                                                <div className={`${cls.salary} ${cls[background]}`}>
                                                    {item?.modifier} {item?.amount}
                                                </div>
                                            </div>
                                        </CustomButton>
                                    </SwiperSlide>
                                );
                            })}
                    </div>
                </Swiper>
            </div>
            <Portal whereToAdd={document.body}>
                <Modal show={modalTransferForm} closing={isClosingModalTransferForm}>
                    <TransferForm transaction={activeTransaction} />
                </Modal>
            </Portal>
            {/*<HistoryList history={history} historyWidth={historyWidth} fullHistory={fullHistory}*/}
            {/*             loadHistoryShow={loadHistoryShow} a_list={aList} p_a_list={pAList}*/}
            {/*             historyLoading={historyLoading} account={account} ready={historyReady}*/}
            {/*             ref={historyRef} setWidth={setHistoryWidthInParent} setEvents={setHistoryInParent}*/}
            {/*             setAddShow={setHistoryShowInParent} changeHistoryLoading={changeHistoryLoading}*/}
            {/*             changeLeftScroll={changeLeftScroll} leftScroll={leftScroll}*/}
            {/*             historyNeedLoad={historyNeedLoad}/>*/}
        </div>
    );
}

export default History;
