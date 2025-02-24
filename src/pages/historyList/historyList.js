import './historyList.css';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useState } from 'react';
import { ethers } from 'ethers';
import { Grid } from 'react-loader-spinner';
import ScrollContainer from 'react-indiana-drag-scroll';
import HistoryItem from '../historyItem/historyItem';
import { exchangeContractAddress } from '../../shared/const/contracts';

const HistoryList = forwardRef(function (props, ref) {
    const [s_history, setHistory] = useState(props.history);
    const [historyWidth, setHistoryWidth] = useState(props.historyWidth);
    const [loadHistoryShow, setLoadHistoryShow] = useState(props.loadHistoryShow);
    const [historyLoading, setHistoryLoading] = useState(props.historyLoading);
    const [s_leftScroll, setLeftScroll] = useState(props.leftScroll);

    async function handleHistory(len = 5) {
        console.log(len);
        if (props.fullHistory.length > 0) {
            if (historyLoading === false) {
                setHistoryLoading(true);
                props.changeHistoryLoading(true);
            }
            let leftScroll = s_leftScroll;
            if (s_history.length > 0) {
                leftScroll = s_history.length * 190 - 20;
                setLeftScroll(leftScroll);
                props.changeLeftScroll(s_history.length * 190 - 20);
            }
            const itemsOnList = len;
            const acc = props.account;
            const ph = props.p_a_list;
            const a_list = props.a_list;

            const current_provider = new ethers.BrowserProvider(window.ethereum);

            let history = s_history;
            const start_length = history.length;
            const new_hash_list = props.fullHistory;

            let end_length = history.length + itemsOnList;
            if (end_length >= new_hash_list.length) {
                end_length = new_hash_list.length;
            }

            for (const ctrResult of new_hash_list.slice(start_length, end_length)) {
                if (ctrResult['type'] === 'ЗАПРОС ПЕРЕВОДА') {
                    let record = ctrResult;
                    record['class'] = 'offer';
                    console.log(record);
                    history.push(record);
                } else if (ctrResult['type'] !== 'КОНВЕРТАЦИЯ USDT - STT') {
                    try {
                        const transaction = await current_provider.getTransactionReceipt(ctrResult['hash']);
                        let recipient = transaction.logs.slice(-1)[0].topics[2];
                        let decoded_recipient = transaction.from;
                        console.log(recipient);
                        if (transaction.logs.slice(-1)[0].topics.length < 3) {
                            console.log('change');
                            recipient = transaction.logs.slice(-1)[0].topics[0];
                        } else {
                            decoded_recipient = ethers.AbiCoder.defaultAbiCoder().decode(['address'], recipient)[0];
                        }
                        if (decoded_recipient !== acc || ctrResult['type'] === 'Transfer In') {
                            let decoded = 0.0;
                            if ('amount' in ctrResult) {
                                decoded = ctrResult['amount'];
                            } else {
                                console.log(transaction.logs.slice(-1)[0].data);
                                decoded =
                                    parseFloat(
                                        ethers.AbiCoder.defaultAbiCoder().decode(['uint'], transaction.logs.slice(-1)[0].data).toString()
                                    ) / Math.pow(10, 9);
                            }
                            let timestamp = (await current_provider.getBlock(transaction.blockNumber)).timestamp * 1000;
                            let time = new Date(timestamp);
                            let date = time.toLocaleDateString('en-GB', {
                                // you can use undefined as first argument
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                            });
                            let date_full = time.toLocaleDateString('en-GB', {
                                // you can use undefined as first argument
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                            });

                            if (decoded_recipient !== acc && a_list.includes(decoded_recipient)) {
                                let target = ph[decoded_recipient];
                                let item = target[0];
                                let record = {
                                    img_url: item['img_url'],
                                    img_type: 'img',
                                    cat_title: item['cat_title'],
                                    link: item['link'],
                                    type: ctrResult['type'],
                                    modifier: ctrResult['modifier'],
                                    class: ctrResult['class'],
                                    amount: decoded.toString().replace('.', ','),
                                    time: date,
                                    full_time: date_full,
                                    txHash: ctrResult['hash'],
                                    timestamp: timestamp,
                                };
                                history.push(record);
                            } else if (transaction['from'] !== acc && a_list.includes(transaction['from'])) {
                                let target = ph[transaction['from']];
                                let item = target[0];
                                let record = {
                                    img_url: item['img_url'],
                                    img_type: 'img',
                                    cat_title: item['cat_title'],
                                    link: item['link'],
                                    type: ctrResult['type'],
                                    modifier: ctrResult['modifier'],
                                    class: ctrResult['class'],
                                    amount: decoded.toString().replace('.', ','),
                                    time: date,
                                    full_time: date_full,
                                    txHash: ctrResult['hash'],
                                    timestamp: timestamp,
                                };
                                history.push(record);
                            } else {
                                let icon = '<i class="fa-light fa-circle-question"></i>';
                                if (ctrResult['type'] === 'Transfer Out') {
                                    icon = '<i class="fa-duotone fa-arrow-up-from-arc"></i>';
                                } else if (ctrResult['type'] === 'Transfer In' || ctrResult['type'] === 'Комиссия') {
                                    icon = '<i class="fa-duotone fa-arrow-down-to-arc"></i>';
                                } else if (ctrResult['type'] === 'Эмиссия') {
                                    icon = '<i class="fa-duotone fa-circle-plus"></i>';
                                }
                                let record = {
                                    img_url: icon,
                                    img_type: 'icon',
                                    cat_title: '',
                                    link: '',
                                    type: ctrResult['type'],
                                    modifier: ctrResult['modifier'],
                                    class: ctrResult['class'],
                                    amount: decoded.toString().replace('.', ','),
                                    time: date,
                                    full_time: date_full,
                                    txHash: ctrResult['hash'],
                                    timestamp: timestamp,
                                };
                                history.push(record);
                            }
                        } else if (ctrResult['type'] === 'Swap') {
                            if (transaction.to === ethers.getAddress(exchangeContractAddress)) {
                                let timestamp = (await current_provider.getBlock(transaction.blockNumber)).timestamp * 1000;
                                let time = new Date(timestamp);
                                let date = time.toLocaleDateString('en-GB', {
                                    // you can use undefined as first argument
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                });
                                let date_full = time.toLocaleDateString('en-GB', {
                                    // you can use undefined as first argument
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                });
                                let sum_result = 0.0;
                                for (let i = 1; i <= transaction.logs.length - 1; i++) {
                                    let recipient = transaction.logs[i].topics[2];
                                    console.log(recipient);
                                    let decoded_recipient = ethers.AbiCoder.defaultAbiCoder().decode(['address'], recipient)[0];
                                    if (
                                        ethers.getAddress(decoded_recipient) !== ethers.getAddress(exchangeContractAddress) &&
                                        ethers.getAddress(decoded_recipient) !== ethers.getAddress(acc)
                                    ) {
                                        let decoded =
                                            parseFloat(
                                                ethers.AbiCoder.defaultAbiCoder().decode(['uint'], transaction.logs[i].data).toString()
                                            ) / Math.pow(10, 9);
                                        sum_result += decoded;
                                    }
                                }
                                const amount = sum_result.toFixed(2);
                                let record = {
                                    img_url: '<i class="fa-duotone fa-arrows-rotate"></i>',
                                    img_type: 'icon',
                                    cat_title: '',
                                    link: '',
                                    type: ctrResult['type'],
                                    modifier: ctrResult['modifier'],
                                    class: ctrResult['class'],
                                    amount: amount.toString().replace('.', ','),
                                    time: date,
                                    full_time: date_full,
                                    txHash: ctrResult['hash'],
                                    timestamp: timestamp,
                                };
                                history.push(record);
                            }
                        }
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    let record = ctrResult;
                    let timestamp = (await current_provider.getBlock(ctrResult['block'])).timestamp * 1000;
                    let time = new Date(timestamp);
                    let date = time.toLocaleDateString('en-GB', {
                        // you can use undefined as first argument
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    });
                    let date_full = time.toLocaleDateString('en-GB', {
                        // you can use undefined as first argument
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    });
                    let timestamp_usdt = (await current_provider.getBlock(ctrResult['usdt_block'])).timestamp * 1000;
                    let time_usdt = new Date(timestamp_usdt);
                    let date_usdt = time_usdt.toLocaleDateString('en-GB', {
                        // you can use undefined as first argument
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    });
                    let date_full_usdt = time_usdt.toLocaleDateString('en-GB', {
                        // you can use undefined as first argument
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    });
                    record['img_url'] = '<i class="fa-duotone fa-arrows-rotate"></i>';
                    record['img_type'] = 'icon';
                    record['cat_title'] = '';
                    record['link'] = '';
                    record['timestamp'] = timestamp;
                    record['amount'] = ctrResult['stt'].toString().replace('.', ',');
                    record['class'] = 'exchange';
                    record['time'] = date;
                    record['full_time'] = date_full;
                    record['time_usdt'] = date_usdt;
                    record['full_time_usdt'] = date_full_usdt;
                    record['txHash'] = ctrResult['usdt_hash'];
                    if (ctrResult['status'] === 'full') {
                        let timestamp_stt = (await current_provider.getBlock(ctrResult['stt_block'])).timestamp * 1000;
                        let time_stt = new Date(timestamp_stt);
                        let date_stt = time_stt.toLocaleDateString('en-GB', {
                            // you can use undefined as first argument
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                        });
                        let date_full_stt = time_stt.toLocaleDateString('en-GB', {
                            // you can use undefined as first argument
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        });
                        record['time_stt'] = date_stt;
                        record['full_time_stt'] = date_full_stt;
                        record['txHash'] = ctrResult['stt_hash'];
                    }
                    history.push(record);
                }
            }
            // history.sort(dynamicSort("timestamp"))
            console.log(history);
            if (history.length > 0) {
                setHistoryLoading(false);
                setHistory(history);
                setHistoryWidth(history.length * 190 + 100);
                props.setEvents(history);
                props.setWidth(history.length * 190 + 100);
                props.changeHistoryLoading(false);
                document.getElementsByClassName('history_wrapper')[0].scrollLeft = leftScroll;
                props.changeLeftScroll(leftScroll);
            }

            if (history.length < new_hash_list.length) {
                setLoadHistoryShow(true);
                setHistoryWidth(history.length * 190 + 100);
                props.setWidth(history.length * 190 + 100);
                props.setAddShow(true);
                props.changeHistoryLoading(false);
                document.getElementsByClassName('history_wrapper')[0].scrollLeft = leftScroll;
                props.changeLeftScroll(leftScroll);
            } else {
                setLoadHistoryShow(false);
                setHistoryWidth(history.length * 190 + 100);
                props.setWidth(history.length * 190 + 100);
                props.setAddShow(false);
                props.changeHistoryLoading(false);
                document.getElementsByClassName('history_wrapper')[0].scrollLeft = leftScroll;
                props.changeLeftScroll(leftScroll);
            }
        } else {
            setHistoryLoading(false);
            props.changeHistoryLoading(false);
        }
    }

    useImperativeHandle(ref, () => ({
        getHistory(len) {
            setTimeout(function () {
                handleHistory(len);
            }, 400);
        },
    }));

    useEffect(() => {
        if (!historyLoading) {
            document.getElementsByClassName('history_wrapper')[0].scrollLeft = s_leftScroll;
        }
    }, [s_leftScroll, historyLoading]);

    function setScrollPosition() {
        const pos = document.getElementsByClassName('history_wrapper')[0].scrollLeft;
        props.changeLeftScroll(pos);
    }

    return (
        <>
            {historyLoading ? (
                <div className={'history-preloader-block'}>
                    <i
                        className='fa-regular fa-arrows-rotate fa-spin'
                        style={{ display: 'block', margin: '75px auto 0', fontSize: 62, color: '#888888', textAlign: 'center' }}
                    ></i>
                </div>
            ) : (
                <>
                    <ScrollContainer
                        style={{ display: 'block', overflowX: 'auto', paddingTop: 25 }}
                        className={'history_wrapper'}
                        id={'scrollable-history-wrapper'}
                        onEndScroll={() => setScrollPosition()}
                    >
                        <div className={'col-12 partners'} style={{ width: `${historyWidth}px`, margin: 'auto', height: 250 }}>
                            {s_history.map((item, i) => (
                                <HistoryItem
                                    key={i}
                                    cat_title={item['cat_title']}
                                    img_url={item['img_url']}
                                    time={item['time']}
                                    full_time={item['full_time']}
                                    type={item['type']}
                                    modifier={item['modifier']}
                                    amount={item['amount']}
                                    class={item['class']}
                                    txhash={item['txHash']}
                                    item={item}
                                    img_type={item['img_type']}
                                />
                            ))}
                            {s_history.length === 0 ? (
                                <>
                                    {props.historyNeedLoad ? (
                                        <div
                                            className={'history_card'}
                                            style={{
                                                cursor: 'default',
                                                backgroundColor: 'transparent',
                                                justifyContent: 'center',
                                                width: 230,
                                                paddingTop: 80,
                                                height: 150,
                                            }}
                                        >
                                            <i className='fa-light fa-receipt'></i>
                                            <div
                                                className={'history_button'}
                                                onClick={() => handleHistory(5)}
                                                style={{ justifyContent: 'center', cursor: 'pointer' }}
                                            >
                                                <p>Load</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className={'history_card'}
                                            style={{
                                                cursor: 'default',
                                                backgroundColor: 'transparent',
                                                justifyContent: 'center',
                                                width: 200,
                                                paddingTop: 70,
                                                height: 75,
                                            }}
                                        >
                                            <i className='fa-light fa-receipt'></i>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {loadHistoryShow ? (
                                        <div className={'history_load'}>
                                            <div className={'load-more'} onClick={() => handleHistory(5)}>
                                                <i className='fa-solid fa-plus'></i>
                                            </div>
                                        </div>
                                    ) : (
                                        <></>
                                    )}
                                </>
                            )}
                        </div>
                    </ScrollContainer>
                </>
            )}
        </>
    );
});

export default HistoryList;
