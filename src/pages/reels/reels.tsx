import React from 'react';
import CustomInput from "../../shared/ui/customInput/customInput";
import {ReactComponent as SvgQr} from '../../assets/svg/qr.svg'
import cls from './reels.module.scss'
import {InputsIndicators} from "../../entities/uiInterfaces/uiInterfaces";
import {profiles} from "../favorites/favorites";
import {ReactComponent as SvgLoadMore} from "./../../assets/svg/loading.svg";
import CustomButton from "../../shared/ui/сustomButton/CustomButton";
import VideoCard from "../../feautures/videoCard/videoCard";


const Reels = () => {

    const [realsForShow, setRealsForShow] = React.useState([]);
    const [counter, setCounter] = React.useState<number>(5)

    const showMoreReals = () => {
        if (+realsForShow.length - +counter <= 5) {
            setCounter(prev => prev + 5)
        } else {
            setCounter(prev => prev + (+realsForShow.length - +counter))
        }
    }

    React.useEffect(() => {
        setRealsForShow(profiles);
    }, [counter]);


    return (
        <div className={cls.wrapper}>
            <div className={cls.search_block}>
                <CustomInput classNameWrapper={cls.wrapperInputSearch} classNameInput={cls.inputSearch} type="text" placeholder="search"/>
                <SvgQr className={cls.svgQr}/>
            </div>
            <div className={cls.coverRealsBlock}>
                <div className={cls.creator_video}>
                    <VideoCard
                        classNameWrap={cls.videoCardMain}
                        classNameCover={cls.video}
                        videoUrl="/video.mp4"
                        posterUrl={'./../../assets/video.mp4'}
                    />
                </div>
                <div className={cls.reals_block}>
                    <div className={cls.video_container}>
                        {realsForShow?.length >= 1 &&
                            realsForShow.slice(0, 6).map((item: any, index) => {
                                    return <VideoCard
                                        classNameWrap={cls.videoCard}
                                        classNameCover={cls.videomain}
                                        key={item.id}
                                        videoUrl="/video.mp4"
                                        posterUrl={'./../../assets/video.mp4'}
                                    />
                            })}
                        {realsForShow?.length <= 5 &&
                            <CustomButton classnameWrapper={cls.btn_load_wrap}
                                          classNameBtn={cls.btn_load_more} type="button"
                                          onClick={showMoreReals}
                            >
                                        <SvgLoadMore className={cls.svg_load_more}/>
                            </CustomButton>
                        }
                        {/*{realsForShow?.length >= 1 &&*/}
                        {/*    realsForShow.slice(0, 6).map((item: any, index) => {*/}
                        {/*        const lastIndex = +realsForShow.length*/}
                        {/*        if (index !== lastIndex) {*/}
                        {/*            return <VideoCard*/}
                        {/*                classNameWrap={cls.videoCard}*/}
                        {/*                classNameCover={cls.videomain}*/}
                        {/*                key={item.id}*/}
                        {/*                videoUrl="/video.mp4"*/}
                        {/*                posterUrl={'./../../assets/video.mp4'}*/}
                        {/*            />*/}
                        {/*        } else {*/}
                        {/*            return <CustomButton classnameWrapper={cls.btn_load_wrap}*/}
                        {/*                                 classNameBtn={cls.btn_load_more} type="button"*/}
                        {/*                                 onClick={showMoreReals}>*/}
                        {/*                <SvgLoadMore className={cls.svg_load_more}/>*/}
                        {/*            </CustomButton>*/}
                        {/*        }*/}
                        {/*    })}*/}
                    </div>
                </div>
                {/*{realsForShow.length >= 6 &&*/}
                {/*    <div className={cls.reals_block}></div>*/}
                {/*}*/}
            </div>
        </div>
    );
};

export default Reels;


