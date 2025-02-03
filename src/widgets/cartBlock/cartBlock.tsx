import React from 'react';
import cls from './cartBlock.module.scss';

const arrayCart = [
    { id: 1, title: "MLM 1" },
    { id: 2, title: "MLM 2" },
    { id: 3, title: "MLM 3" },
    { id: 4, title: "MLM 4" },
];

const CartBlock = () => {
    const [activeSlide, setActiveSlide] = React.useState(0);

    /**для смены карточке*/
    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % arrayCart.length);
        }, 3000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className={cls.wrapper}>
            {arrayCart.map((item, index) => {
                const isActive = index === activeSlide;
                const position = isActive ? cls.activeCard : cls.inactiveCard;

                return (
                    <div key={item.id} className={`${cls.card} ${position}`}>
                        <div className={cls.imgCover}>
                            <img
                                src="/img/cart.jpg"
                                alt="каринка"
                                className={cls.image}
                            />
                        </div>
                        <div className={cls.subTitle}>{item.title}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default CartBlock;
