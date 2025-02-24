import React from 'react';
import cls from './styled/sttBonusModule.module.scss';
import CustomInput from '../../shared/ui/customInput/customInput';
import CustomButton from '../../shared/ui/сustomButton/CustomButton';
import { useSearchParams } from 'react-router-dom';
import { ReactComponent as SvgQr } from './../../assets/svg/qr.svg';
import { useAppSelector } from '../../shared/redux/hooks/hooks';
import { IndicatorsForUi, InputsIndicators } from '../../entities/uiInterfaces/uiInterfaces';

const SttBonusModule = () => {
    /** при переходе реф системы будет сгенерирована ссылка типа http://localhost:3000/?partnerId=12345*/
    const [parentId, setParentId] = React.useState<string>('');
    const [value, setValue] = React.useState<string>(parentId ?? '');
    const [searchParams] = useSearchParams();
    const { wallet_number, login } = useAppSelector((state) => state.formsAddProfile);

    React.useEffect(() => {
        const parentId = searchParams.get('partnerId');
        setParentId(parentId); // Если найден partnerId, сохраняем его в состояние
    }, []);

    const addValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    return (
        <div className={cls.wrapper}>
            <div className={cls.inputCover}>
                <CustomInput
                    codeHasWritten={parentId && true}
                    placeholder='ERC20-счет пригласителя'
                    value={parentId ?? value}
                    disable={Boolean(parentId)}
                    onChange={(e) => setValue(e.target.value)}
                    type='text'
                    indicators={InputsIndicators.addSttBonus}
                    svg={<SvgQr className={cls.svgQr} />}
                >
                    confirm
                </CustomInput>
                {wallet_number && login}
                {!wallet_number && !login && parentId && (
                    <div className={cls.textAdditional}>Вам поступило приглашение от пользователя</div>
                )}
            </div>
            <div className={cls.downBlock}>
                <div className={cls.text}>
                    <div>1000 STT</div>
                    <div>+ комиссия сети</div>
                </div>
                <CustomButton type='button' indicator={IndicatorsForUi.sttBonus}>
                    {wallet_number && login ? 'send' : 'confirm'}
                </CustomButton>
            </div>
        </div>
    );
};

export default SttBonusModule;
