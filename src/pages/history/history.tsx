import './history.css'
import React, {useCallback, useEffect, useRef, useState} from "react";
import HistoryList from "../historyList/historyList";
import {tokenContractAbi, tokenContractAddress} from "../../helpers/contracts";
import {ethers} from "ethers";


function History(props) {
    const [history, setHistory] = useState([])
    const [fullHistory, setFullHistory] = useState([])
    const [historyWidth, setHistoryWidth] = useState(250)
    const [loadHistoryShow, setLoadHistoryShow] = useState(false)
    const [aList, setAList] = useState([])
    const [pAList, setPAList] = useState([])
    const [historyLoading, setHistoryLoading] = useState(false)
    const [totalSupply, setTotalSupply] = useState(0.0)
    const [contractBalance, setContractBalance] = useState(0.0)
    const [historyReady, setHistoryReady] = useState(false)
    const [historyNeedLoad, setHistoryNeedLoad] = useState(false)
    const [leftScroll, setLeftScroll] = useState(0)
    const historyRef = useRef<any>(null)

    function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            /* next line works with strings and numbers,
             * and you may want to customize it to your needs
             */
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    async function handleHistory(acc) {
        const current_provider = new ethers.BrowserProvider(window.ethereum)
        const contract = new ethers.Contract(tokenContractAddress, tokenContractAbi, current_provider);

        let history:any = []
        let full_list = []
        let full_hashes = []
        let hash_list = []
        let offers_list = []
        let pending_list = []

        try {
            const swapFilters = contract.filters.Transfer(acc, '0x0000000000000000000000000000000000000000')

            const swapResults = await contract.queryFilter(swapFilters, 98085403, "latest");
            for (const hash of swapResults) {
                hash_list.push({'hash': hash.transactionHash, 'type': 'Swap', 'modifier': '- ', 'class': 'swap', 'block': hash.blockNumber, 'priority': 1})
            }

            const filters = contract.filters.Transfer(acc)
            const ctrResults = await contract.queryFilter(filters, 98085403, "latest");
            for (const hash of ctrResults) {
                if (!full_hashes.includes(hash.transactionHash.toString().toLowerCase())) {
                    hash_list.push({
                        'hash': hash.transactionHash,
                        'type': 'Transfer Out',
                        'modifier': '- ',
                        'class': 'out',
                        'block': hash.blockNumber,
                        'priority': 1
                    })
                    full_hashes.push(hash.transactionHash)
                }
            }

            const incFilters = contract.filters.Transfer(null, acc)

            const incResults:any = await contract.queryFilter(incFilters, 98085403, "latest");
            for (const hash of incResults) {
                if (!full_hashes.includes(hash.transactionHash.toString().toLowerCase())) {
                    let amount = parseInt(hash.args[2].toString())  / Math.pow(10, 9)
                    if (hash.args[0].toString() !== '0x0000000000000000000000000000000000000000') {
                        hash_list.push({'hash': hash.transactionHash, 'type': 'Transfer In', 'modifier': '+ ', 'class': 'in', 'block': hash.blockNumber, 'priority': 1, 'amount': amount})
                    }
                }
            }

            let distinct = []
            let new_hash_list = []
            for (const i of hash_list) {
                if (distinct.includes(i['hash'])) {

                } else {
                    distinct.push(i['hash'])
                    new_hash_list.push(i)
                }
            }

            new_hash_list = new_hash_list.sort(dynamicSort("block")).reverse()
            full_list = full_list.concat(new_hash_list)


            let final_list = full_list.sort(dynamicSort("block")).reverse().slice(0, 50)
            final_list = [...pending_list, ...final_list]

            if (offers_list.length > 0) {
                final_list = [...offers_list, ...final_list]
            }

            setFullHistory(final_list)

            setHistoryReady(true)
            if (full_list.length > 0 && history.length === 0) {
                setHistoryNeedLoad(true)
            } else {
                setHistoryNeedLoad(false)
            }
            if (offers_list.length > 0) {
                console.log('start')
                historyRef.current.getHistory(offers_list.length)
            }

        } catch (e) {
            console.log(e)
            setFullHistory(full_list)
            setHistoryReady(true)
            // historyRef.current.getHistory()
        }

    }

    const setHistoryInParent = useCallback(val => {
        setHistory(val);
    }, [setHistory]);

    const setHistoryWidthInParent = useCallback(val => {
        setHistoryWidth(val);
    }, [setHistoryWidth]);

    const setHistoryShowInParent = useCallback(val => {
        setLoadHistoryShow(val);
    }, [setLoadHistoryShow]);

    const changeHistoryLoading = useCallback(val => {
        setHistoryLoading(val);
    }, [setHistoryLoading]);

    const changeLeftScroll = useCallback(val => {
        setLeftScroll(val);
    }, [setLeftScroll]);

    useEffect(() => {
        if (window.ethereum) {
            handleHistory(props.account)
        }
    }, []);

    return (
        <div className={"history_wrapper"} style={{height: 325}}>
            <h5 className={"history_title"}>Transactions</h5>
            <HistoryList history={history} historyWidth={historyWidth} fullHistory={fullHistory} loadHistoryShow={loadHistoryShow} a_list={aList} p_a_list={pAList} historyLoading={historyLoading} account={props.account} ready={historyReady} ref={historyRef} setWidth={setHistoryWidthInParent} setEvents={setHistoryInParent} setAddShow={setHistoryShowInParent} changeHistoryLoading={changeHistoryLoading} changeLeftScroll={changeLeftScroll} leftScroll={leftScroll} historyNeedLoad={historyNeedLoad} />
        </div>
    )
}

export default History