import React from 'react';
import cls from './sliderVideo.module.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Mousewheel, Pagination} from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import {ReactComponent as SvgClose} from '../../assets/svg/close.svg';
import 'swiper/css';
import 'swiper/css/pagination';
import {profiles} from "../../pages/reels/reels";
import VideoCard from "../../feautures/videoCard/videoCard";
import CustomButton from "../../shared/ui/сustomButton/CustomButton";
import {IModalWindowStatesSchema} from "../../shared/redux/slices/modalWindowStatesSlice/modalWindowStatesSchema";
import {useAppDispatch, useAppSelector} from "../../shared/redux/hooks/hooks";
import {modalAddProfileActions} from "../../shared/redux/slices/modalWindowStatesSlice/modalWindowStateSlice";
import {ReactComponent as SvgSoundOff} from "./../../assets/svg/soundOffvg.svg";
import {ReactComponent as SvgGenerationLink} from "../../assets/svg/share.svg";
import {ReactComponent as SvgReceivePayment} from "./../../assets/svg/receivePayment.svg";
import {ReactComponent as SvgFavourite} from "../../assets/svg/favorites.svg";
import {ReactComponent as SvgChain} from "./../../assets/svg/chainLink.svg";

interface ISliderVideoProps {
    show: boolean;
}

const SliderVideo = ({show}: ISliderVideoProps) => {

    const dispatch = useAppDispatch()

    /** states */
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [progress, setProgress] = React.useState<number>(0);
    const [isHovered, setIsHovered] = React.useState<boolean>(false);
    const [soundOn, setSoundOn] = React.useState<boolean>(true)
    const { chosenFavouritesIdReals } = useAppSelector(state => state.authSlice)
    const [hideMenu, setHideMenu] = React.useState<boolean>(false);
    /** actions*/
    const {closeModal, openModal} = modalAddProfileActions

    /** для закрытия попапа*/
    const closeRealsList = () => {
        const modalRealsList:string = 'modalReals'
        dispatch(closeModal({modalName: modalRealsList as keyof IModalWindowStatesSchema}))
    }

    /** Определяем индекс начального слайда */
    const initialSlideIndex = profiles.findIndex(video => video.profile_data.id === chosenFavouritesIdReals) || 0;
    const [swiperInstance, setSwiperInstance] = React.useState<any>(null);

    /** Устанавливаем активный слайд при изменении `chosenFavouritesIdReals` */
    React.useEffect(() => {
        if (swiperInstance) {
            const newIndex = profiles.findIndex(video => video.profile_data.id === chosenFavouritesIdReals);
            if (newIndex !== -1) {
                swiperInstance.slideTo(newIndex); // Переключаем слайд
            }
        }
    }, [chosenFavouritesIdReals, swiperInstance]);


    const hideOrShowMenuReals = () => {
        setHideMenu(prevState => !prevState);
    }

    if(!show) return null;

    return (
        <div className={`${cls.overlay} ${show && cls.open}`}>
            <CustomButton onClick={closeRealsList} classnameWrapper={cls.wrapper_btn} classNameBtn={cls.cover_btn} type='button'>
                <SvgClose className={cls.close_svg} />
            </CustomButton>
            <Swiper
                modules={[Navigation, Mousewheel]} // Подключаем модули
                direction={'vertical'}
                slidesPerView={1}
                spaceBetween={5}
                mousewheel={{ forceToAxis: true, sensitivity: 0.5 }}
                pagination={{ clickable: true }}
                style={{ height: '100vh' }}
                className={cls.swiper}
                initialSlide={initialSlideIndex}
                onSwiper={setSwiperInstance}
                touchRatio={1}
                simulateTouch={true}
                threshold={20}
            >
                    {profiles.map((video) => (
                        <SwiperSlide key={video.profile_data.id}>
                            <div className={cls.body}>
                                <div className={cls.item_video_cover}>
                                    <VideoCard
                                        classNameWrap={cls.item_video}
                                        classNameCover={cls.video}
                                        videoUrl={video.video_data}
                                        posterUrl={'./../../assets/video.mp4'}
                                        muted={true}
                                        controls={false}
                                        startPointerEnter={false}
                                        autoPlay={true}
                                        profile = {video}
                                    />
                                    <div className={cls.btn_cover_block}>
                                        <div className={`${cls.basic} ${hideMenu ? cls.show : cls.hide}`}>
                                            <CustomButton type='button' classnameWrapper={cls.wrapperSvg}
                                                          classNameBtn={``}>
                                                <SvgChain className={`${cls.svg} ${cls.sizeChain}`}/>
                                            </CustomButton>
                                            <CustomButton type='button' classnameWrapper={cls.wrapperSvg}
                                                          classNameBtn={``}>
                                                <SvgReceivePayment className={`${cls.svg} ${cls.sizePayment}`}/>
                                            </CustomButton>
                                            <CustomButton type='button' classnameWrapper={cls.wrapperSvg}
                                                          classNameBtn={``}>
                                                <SvgSoundOff className={`${cls.svg} ${cls.sizeSound}`}/>
                                            </CustomButton>
                                            <CustomButton type='button' classnameWrapper={cls.wrapperSvg}
                                                          classNameBtn={``}>
                                                <SvgGenerationLink className={`${cls.svg} ${cls.sizeLink}`}/>
                                            </CustomButton>
                                            <div className={cls.cover_btn_followers}>
                                                <CustomButton type='button' classnameWrapper={cls.wrapperSvg}
                                                              classNameBtn={``}>
                                                    <SvgFavourite className={`${cls.svg} ${cls.sizeFavourite}`}/>
                                                </CustomButton>
                                                <div className={cls.followers}>1000</div>
                                            </div>
                                        </div>
                                        <CustomButton onClick={hideOrShowMenuReals} type='button' classnameWrapper={cls.wrapperSvg}
                                                      classNameBtn={`${cls.svg}`}>
                                            <div className={hideMenu ? cls.expand_icon_show : cls.expand_icon_hide}></div>
                                        </CustomButton>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div>
    );
};

export default SliderVideo;