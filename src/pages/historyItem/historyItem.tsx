import React from 'react';
import './historyItem.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ethers } from 'ethers';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Toast from 'react-bootstrap/Toast';
import parse from 'html-react-parser';
import { arbitrumCurrent, tokenContractAddress, tokenContractAbi } from '../../helpers/contracts';
import axios from 'axios';
import { Grid } from 'react-loader-spinner';

export default class HistoryItem extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            historyData: {},
            copied: false,
            opacity: 1,
            preloader: { display: 'none' },
            toastCompleteShow: false,
            toastErrorShow: false,
            toastText: '',
            showHistoryModal: false,
            showOfferModal: false,
            showLoading: false,
        };
        this.showPreloader = this.showPreloader.bind(this);
        this.hidePreloader = this.hidePreloader.bind(this);
        this.prepareHistory = this.prepareHistory.bind(this);
    }

    showPreloader() {
        this.setState({ preloader: { display: 'flex' } });
    }

    proceedOffer() {}
    cancelOffer() {}

    hidePreloader() {
        this.setState({ preloader: { display: 'none' } });
    }

    prepareHistory(item, img_type, full_time) {
        this.setState({ showLoading: true });
        const current_provider = new ethers.BrowserProvider(window.ethereum);
        console.log(item);
        current_provider.getTransactionReceipt(item['txHash']).then((res) => {
            let recipient = res.logs.slice(-1)[0].topics[2];
            let decoded_recipient = res.from;
            if (res.logs.slice(-1)[0].topics.length < 3) {
                console.log('change');
            } else {
                decoded_recipient = ethers.AbiCoder.defaultAbiCoder().decode(['address'], recipient)[0];
            }
            item['from'] = res['from'];
            item['to'] = decoded_recipient;
            item['img_type'] = img_type;
            item['full_time'] = full_time.toString().replace(',', '');
            this.setState({ historyData: item });
            this.setState({ showHistoryModal: true });
            this.setState({ showLoading: false });
        });
    }

    componentDidMount() {
        this.setState({ opacity: 1 });
    }

    render() {
        return (
            <>
                {this.props.type !== '' ? (
                    <>
                        <div
                            className={
                                this.props.class === 'exchange'
                                    ? this.props.item.status === 'wait'
                                        ? 'history_card pending eth-card'
                                        : 'history_card eth-card'
                                    : 'history_card eth-card'
                            }
                            onClick={() => this.prepareHistory(this.props.item, this.props.img_type, this.props.full_time)}
                            style={{ opacity: this.state.opacity }}
                        >
                            {this.props.img_type === 'img' ? (
                                <div className={'history_card-img'} style={{ backgroundImage: `url(${this.props.img_url})` }} />
                            ) : (
                                <>{parse(this.props.img_url)}</>
                            )}
                            {this.props.cat_title !== '' ? (
                                <>
                                    <p className={'history_card-title'}>{parse(this.props.cat_title.toString().replace('<br/>', ' '))}</p>
                                </>
                            ) : (
                                <>
                                    <p className={'history_card-type'}>
                                        {this.props.class === 'exchange' ? parse('EXCHANGE<br/>USDT - STT') : this.props.type}
                                    </p>
                                </>
                            )}

                            {this.props.type === 'Transfer In' ? (
                                <p className={'history_card-amount green-text'}>
                                    {this.props.modifier}
                                    <span>
                                        {parseFloat(this.props.amount.toString().replace(',', '.')).toFixed(2).toString().replace('.', ',')}
                                    </span>
                                </p>
                            ) : (
                                <p className={'history_card-amount'}>
                                    {this.props.modifier}
                                    <span>
                                        {parseFloat(this.props.amount.toString().replace(',', '.')).toFixed(2).toString().replace('.', ',')}
                                    </span>
                                </p>
                            )}
                            {/*<p className={"history_card-time"}>{this.props.time}</p>*/}
                        </div>
                    </>
                ) : (
                    <div className={'history_card'} style={{ opacity: this.state.opacity }}>
                        {this.props.img_type === 'img' ? (
                            <div className={'history_card-img'} style={{ backgroundImage: `url(${this.props.img_url})` }} />
                        ) : (
                            <>{parse(this.props.img_url)}</>
                        )}
                        {this.props.cat_title !== '' ? (
                            <>
                                <p className={'history_card-title'}>{parse(this.props.cat_title.toString().replace('<br/>', ' '))}</p>
                            </>
                        ) : (
                            <>
                                <p className={'history_card-type'}>{this.props.type}</p>
                            </>
                        )}

                        <p className={'history_card-amount'}>
                            {this.props.modifier}
                            <span>
                                {parseFloat(this.props.amount.toString().replace(',', '.')).toFixed(2).toString().replace('.', ',')}
                            </span>
                        </p>

                        {/*<p className={"history_card-time"}>{this.props.time}</p>*/}
                    </div>
                )}
                <Modal
                    show={this.state.showHistoryModal}
                    // onHide={() => handleCloseComplete()}
                    aria-labelledby='info-title'
                    centered
                    className={
                        this.state.historyData.class === 'exchange'
                            ? this.props.item.status === 'wait'
                                ? 'history-modal-instance pending telegram-modal'
                                : 'history-modal-instance telegram-modal'
                            : 'history-modal-instance telegram-modal'
                    }
                    // size={"md"}
                >
                    <Modal.Body style={{ padding: 0 }}>
                        <div className={'preloader'} style={this.state.preloader}>
                            <Grid
                                height='80'
                                width='80'
                                color='#ffffff'
                                ariaLabel='grid-loading'
                                radius='12.5'
                                wrapperStyle={{}}
                                wrapperClass=''
                                visible={true}
                            />
                        </div>
                        <div className={'stt_modal_header'}>
                            <div style={{ width: 50 }}></div>
                            <div className={'notification_header'}>{this.state.historyData.type}</div>
                            <div className={'close_btn'} onClick={() => this.setState({ showHistoryModal: false })}>
                                <i className='fa-solid fa-xmark'></i>
                            </div>
                        </div>
                        <div className={'help-wrapper history-modal'}>
                            {this.state.historyData.class === 'out' ? (
                                <>
                                    {this.state.historyData.img_type === 'img' ? (
                                        <>
                                            <div
                                                className={'history-modal-img'}
                                                style={{ backgroundImage: `url(${this.state.historyData.img_url})` }}
                                            />
                                        </>
                                    ) : (
                                        <>{this.state.historyData.img_url ? <>{parse(this.state.historyData.img_url)}</> : <></>}</>
                                    )}

                                    <CopyToClipboard text={this.state.historyData.to} onCopy={() => this.setState({ copied: true })}>
                                        <span className={'history-modal-text'}>{this.state.historyData.to}</span>
                                    </CopyToClipboard>

                                    <span className={'history-modal-amount'}>
                                        -{' '}
                                        {parseFloat(this.state.historyData.amount.toString().replace(',', '.'))
                                            .toFixed(2)
                                            .toString()
                                            .replace('.', ',')}{' '}
                                        STT
                                    </span>
                                    <span className={'history-modal-time'}>{this.state.historyData.full_time}</span>

                                    <span className={'history-modal-helper'}>Hash </span>
                                    <CopyToClipboard text={this.state.historyData.txHash} onCopy={() => this.setState({ copied: true })}>
                                        <span className={'history-modal-text'}>{this.state.historyData.txHash}</span>
                                    </CopyToClipboard>
                                </>
                            ) : this.state.historyData.class === 'in' ? (
                                <>
                                    {this.state.historyData.img_type === 'img' ? (
                                        <>
                                            <div
                                                className={'history-modal-img'}
                                                style={{ backgroundImage: `url(${this.state.historyData.img_url})` }}
                                            />
                                        </>
                                    ) : (
                                        <>{this.state.historyData.img_url ? <>{parse(this.state.historyData.img_url)}</> : <></>}</>
                                    )}
                                    <CopyToClipboard text={this.state.historyData.from} onCopy={() => this.setState({ copied: true })}>
                                        <span className={'history-modal-text'}>{this.state.historyData.from}</span>
                                    </CopyToClipboard>
                                    <span className={'history-modal-amount green-text'}>
                                        +{' '}
                                        {parseFloat(this.state.historyData.amount.toString().replace(',', '.'))
                                            .toFixed(2)
                                            .toString()
                                            .replace('.', ',')}{' '}
                                        STT
                                    </span>
                                    <span className={'history-modal-time'}>{this.state.historyData.full_time}</span>

                                    <span className={'history-modal-helper'}>Hash </span>
                                    <CopyToClipboard text={this.state.historyData.txHash} onCopy={() => this.setState({ copied: true })}>
                                        <span className={'history-modal-text'}>{this.state.historyData.txHash}</span>
                                    </CopyToClipboard>
                                </>
                            ) : this.state.historyData.class === 'swap' ? (
                                <>
                                    {this.state.historyData.img_type === 'img' ? (
                                        <>
                                            <div
                                                className={'history-modal-img'}
                                                style={{ backgroundImage: `url(${this.state.historyData.img_url})` }}
                                            />
                                        </>
                                    ) : (
                                        <>{this.state.historyData.img_url ? <>{parse(this.state.historyData.img_url)}</> : <></>}</>
                                    )}
                                    <span className={'history-modal-amount'}>
                                        -{' '}
                                        {parseFloat(this.state.historyData.amount.toString().replace(',', '.'))
                                            .toFixed(2)
                                            .toString()
                                            .replace('.', ',')}{' '}
                                        STT
                                    </span>
                                    <span className={'history-modal-time'}>{this.state.historyData.full_time}</span>

                                    <span className={'history-modal-helper'}>Hash </span>
                                    <CopyToClipboard text={this.state.historyData.txHash} onCopy={() => this.setState({ copied: true })}>
                                        <span className={'history-modal-text'}>{this.state.historyData.txHash}</span>
                                    </CopyToClipboard>
                                </>
                            ) : this.state.historyData.class === 'exchange' ? (
                                <>
                                    <p className={'history-modal-type'}>{this.state.historyData.type}</p>
                                    {this.state.historyData.subtype === 'send' ? (
                                        <>
                                            <p className={'history-modal-helper'} style={{ marginBottom: 0 }}>
                                                Получено
                                            </p>
                                            <p className={'history-modal-amount'}>
                                                {parseFloat(this.state.historyData.usdt.toString().replace(',', '.'))
                                                    .toFixed(2)
                                                    .toString()
                                                    .replace('.', ',')}{' '}
                                                USDT
                                            </p>
                                            <p className={'history-modal-time'}>{this.state.historyData.full_time_usdt}</p>
                                            <p className={'history-modal-helper'}>От</p>
                                            <CopyToClipboard
                                                text={this.state.historyData.origin}
                                                onCopy={() => this.setState({ copied: true })}
                                            >
                                                <p className={'history-modal-text'}>{this.state.historyData.origin}</p>
                                            </CopyToClipboard>
                                            <p className={'history-modal-helper'}>Хэш </p>
                                            <CopyToClipboard
                                                text={this.state.historyData.usdt_hash}
                                                onCopy={() => this.setState({ copied: true })}
                                            >
                                                <p className={'history-modal-text'}>{this.state.historyData.usdt_hash}</p>
                                            </CopyToClipboard>

                                            {this.state.historyData.status === 'full' ? (
                                                <>
                                                    <div className={'history-exchange-completed'}>
                                                        <p className={'history-modal-helper'} style={{ marginBottom: 0 }}>
                                                            Отправлено
                                                        </p>
                                                        <p className={'history-modal-amount'}>
                                                            {parseFloat(this.state.historyData.stt.toString().replace(',', '.'))
                                                                .toFixed(2)
                                                                .toString()
                                                                .replace('.', ',')}{' '}
                                                            STT
                                                        </p>
                                                        <p className={'history-modal-time'}>{this.state.historyData.full_time_stt}</p>
                                                        <p className={'history-modal-helper'}>От</p>
                                                        <CopyToClipboard
                                                            text={this.state.historyData.sender}
                                                            onCopy={() => this.setState({ copied: true })}
                                                        >
                                                            <p className={'history-modal-text'}>{this.state.historyData.sender}</p>
                                                        </CopyToClipboard>
                                                        <p className={'history-modal-helper'}>Хэш </p>
                                                        <CopyToClipboard
                                                            text={this.state.historyData.stt_hash}
                                                            onCopy={() => this.setState({ copied: true })}
                                                        >
                                                            <p className={'history-modal-text'}>{this.state.historyData.stt_hash}</p>
                                                        </CopyToClipboard>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className={'history-exchange-completed'}>
                                                        <p className={'history-modal-helper'} style={{ marginBottom: 0 }}>
                                                            К отправке
                                                        </p>
                                                        <p className={'history-modal-amount'}>
                                                            {parseFloat(this.state.historyData.stt.toString().replace(',', '.'))
                                                                .toFixed(2)
                                                                .toString()
                                                                .replace('.', ',')}{' '}
                                                            STT
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <p className={'history-modal-helper'} style={{ marginBottom: 0 }}>
                                                Отправлено
                                            </p>
                                            <p className={'history-modal-amount'}>
                                                {parseFloat(this.state.historyData.usdt.toString().replace(',', '.'))
                                                    .toFixed(2)
                                                    .toString()
                                                    .replace('.', ',')}{' '}
                                                USDT
                                            </p>
                                            <p className={'history-modal-time'}>{this.state.historyData.full_time_usdt}</p>
                                            <p className={'history-modal-helper'}>Кому</p>
                                            <CopyToClipboard
                                                text={this.state.historyData.sender}
                                                onCopy={() => this.setState({ copied: true })}
                                            >
                                                <p className={'history-modal-text'}>{this.state.historyData.sender}</p>
                                            </CopyToClipboard>
                                            <p className={'history-modal-helper'}>Хэш </p>
                                            <CopyToClipboard
                                                text={this.state.historyData.usdt_hash}
                                                onCopy={() => this.setState({ copied: true })}
                                            >
                                                <p className={'history-modal-text'}>{this.state.historyData.usdt_hash}</p>
                                            </CopyToClipboard>

                                            {this.state.historyData.status === 'full' ? (
                                                <>
                                                    <div className={'history-exchange-completed'}>
                                                        <p className={'history-modal-helper'} style={{ marginBottom: 0 }}>
                                                            Получено
                                                        </p>
                                                        <p className={'history-modal-amount'}>
                                                            {parseFloat(this.state.historyData.stt.toString().replace(',', '.'))
                                                                .toFixed(2)
                                                                .toString()
                                                                .replace('.', ',')}{' '}
                                                            STT
                                                        </p>
                                                        <p className={'history-modal-time'}>{this.state.historyData.full_time_stt}</p>
                                                        <p className={'history-modal-helper'}>От</p>
                                                        <CopyToClipboard
                                                            text={this.state.historyData.sender}
                                                            onCopy={() => this.setState({ copied: true })}
                                                        >
                                                            <p className={'history-modal-text'}>{this.state.historyData.sender}</p>
                                                        </CopyToClipboard>
                                                        <p className={'history-modal-helper'}>Хэш </p>
                                                        <CopyToClipboard
                                                            text={this.state.historyData.stt_hash}
                                                            onCopy={() => this.setState({ copied: true })}
                                                        >
                                                            <p className={'history-modal-text'}>{this.state.historyData.stt_hash}</p>
                                                        </CopyToClipboard>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className={'history-exchange-completed'}>
                                                        <p className={'history-modal-helper'}>К получению</p>
                                                        <p className={'history-modal-amount'}>
                                                            {parseFloat(this.state.historyData.stt.toString().replace(',', '.'))
                                                                .toFixed(2)
                                                                .toString()
                                                                .replace('.', ',')}{' '}
                                                            STT
                                                        </p>

                                                        <p className={'history-modal-helper'} style={{ marginBottom: 0, marginTop: 20 }}>
                                                            Статус
                                                        </p>
                                                        <p className={'history-modal-helper'} style={{ marginBottom: 0, fontWeight: 600 }}>
                                                            в обработке
                                                        </p>
                                                        <p className={'history-modal-helper'} style={{ marginBottom: 0 }}>
                                                            (обычно не более 24 часов)
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
                                </>
                            ) : (
                                <></>
                            )}
                            <Button
                                className='convert-btn convert-action-btn close-common-btn ok-btn'
                                style={{ marginTop: 30 }}
                                variant='success'
                                onClick={() => this.setState({ showHistoryModal: false })}
                            >
                                Ok
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
                {this.props.class === 'offer' ? (
                    <>
                        <Modal
                            show={this.state.showOfferModal}
                            // onHide={() => handleCloseComplete()}
                            aria-labelledby='info-title'
                            centered
                            className={'history-modal-instance pending'}
                            // size={"md"}
                        >
                            <Modal.Body>
                                <div className={'preloader'} style={this.state.preloader}>
                                    <Grid
                                        height='80'
                                        width='80'
                                        color='#ffffff'
                                        ariaLabel='grid-loading'
                                        radius='12.5'
                                        wrapperStyle={{}}
                                        wrapperClass=''
                                        visible={true}
                                    />
                                </div>
                                <div className={'help-wrapper history-modal'}>
                                    <p className={'history-modal-type'}>{this.props.item.type}</p>
                                    <div className={'history-modal-img'} style={{ backgroundImage: `url(${this.props.item.img_url})` }} />
                                    <p className={'history-modal-title'}>{this.props.item.partner}</p>
                                    <p className={'history-modal-amount'}>
                                        {parseFloat(this.props.item.stt.toString().replace(',', '.'))
                                            .toFixed(2)
                                            .toString()
                                            .replace('.', ',')}{' '}
                                        STT
                                    </p>
                                    <p className={'history-modal-time'} style={{ marginTop: 5 }}>
                                        с учетом комиссии 1%
                                    </p>

                                    <a
                                        href={this.props.item.item_link}
                                        className={'btn-success convert-btn history-modal-link action-common-btn'}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                    >
                                        За что перевод?
                                    </a>
                                    {/*<p className={"history-modal-time"}>{this.props.item.created}</p>*/}
                                    <p className={'history-modal-helper'} style={{ fontSize: '.65rem', width: '90%', margin: 'auto' }}>
                                        Для перевода вам потребуется некоторое количество ETH (Arbitrum) для оплаты комиссии сети, а также
                                        комиссия в STT в размере 1% от суммы перевода. Пожалуйста, позаботьтесь об этом заранее.
                                    </p>

                                    <Button
                                        className='convert-btn convert-action-btn'
                                        style={{ marginTop: 30 }}
                                        variant='success'
                                        onClick={() => this.proceedOffer()}
                                    >
                                        Продолжить
                                    </Button>
                                    <Button
                                        className='convert-btn convert-action-btn'
                                        style={{ marginTop: 15, backgroundColor: '#ff9999' }}
                                        variant='success'
                                        onClick={() => this.cancelOffer()}
                                    >
                                        Отказаться
                                    </Button>
                                    <Button
                                        className='convert-btn convert-action-btn close-common-btn'
                                        style={{ marginTop: 15 }}
                                        variant='success'
                                        onClick={() => this.setState({ showOfferModal: false })}
                                    >
                                        Закрыть
                                    </Button>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </>
                ) : (
                    <></>
                )}

                <Modal
                    show={this.state.showLoading}
                    fullscreen={true}
                    onHide={() => this.setState({ showLoading: false })}
                    className={'preloading-modal'}
                >
                    <Modal.Body>
                        <div className={'preloader'}>
                            <Grid
                                height='80'
                                width='80'
                                color='#ffffff'
                                ariaLabel='grid-loading'
                                radius='12.5'
                                wrapperStyle={{}}
                                wrapperClass=''
                                visible={true}
                            />
                        </div>
                    </Modal.Body>
                </Modal>

                <Toast
                    onClose={() => this.setState({ copied: false })}
                    show={this.state.copied}
                    onClick={() => this.setState({ copied: false })}
                    autohide
                    delay={3000}
                    className={'complete-toast'}
                    style={{ position: 'fixed' }}
                >
                    <Toast.Body>
                        <i className='fa-solid fa-circle-check' style={{ fontSize: '6rem', margin: 20, color: '#96fac5' }}></i>
                        <p style={{ fontWeight: 600 }}>COPIED</p>
                    </Toast.Body>
                </Toast>
                <Toast
                    onClose={() => this.setState({ toastCompleteShow: false })}
                    show={this.state.toastCompleteShow}
                    onClick={() => this.setState({ toastCompleteShow: false })}
                    autohide
                    delay={5000}
                    className={'complete-toast'}
                >
                    <Toast.Body>
                        <i className='fa-solid fa-circle-check' style={{ fontSize: '6rem', margin: 20, color: '#96fac5' }}></i>
                        <p style={{ fontWeight: 600 }}>SUCCESS</p>
                        <p className={'complete-toast-text'}>Please, refresh the page</p>
                    </Toast.Body>
                </Toast>
                <Toast
                    onClose={() => this.setState({ toastErrorShow: false })}
                    show={this.state.toastErrorShow}
                    onClick={() => this.setState({ toastErrorShow: false })}
                    autohide
                    delay={5000}
                    className={'complete-toast'}
                >
                    <Toast.Body>
                        <i className='fa-solid fa-circle-xmark' style={{ fontSize: '6rem', margin: 20, color: '#ff968f' }}></i>
                        <p className={'toast-err'} style={{ fontWeight: 600, color: '#dc3545' }}>
                            ERROR
                        </p>
                        <p className={'complete-toast-text'}>{this.state.toastText}</p>
                    </Toast.Body>
                </Toast>
            </>
        );
    }
}
