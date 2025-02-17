import React, {useEffect, useState} from "react";
import {Line, LineChart, ResponsiveContainer, YAxis} from "recharts";
import {useAppSelector} from "../../shared/redux/hooks/hooks";
import cls from "./chart.module.scss";
import axios from "axios";

const CustomizedDot = (props) => {
    const {cx, cy, index, data} = props;
    const isFirst = index === 0;
    const isLast = index === data.length - 1;

    // Кастомизация только для первой и последней точки
    if (!isFirst && !isLast) return null;

    return (
        <circle
            cx={cx}
            cy={cy}
            r={6}
            fill={isFirst ? "#7c84e5" : "#fc46aa"}
            stroke="white"
            style={{filter: "drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.3))"}}
        />
    );
};

interface IChartProps {
    indicator?: 'noAuth'
    visibility: boolean
}

function ChartBlock({indicator, visibility}: IChartProps) {

    const [chartData, setChartData] = useState([])
    const [shownDataChart, setShownDataChart] = useState([])
    const [chartStart, setChartStart] = useState(0.0)
    const [chartStartDate, setChartStartDate] = useState('')
    const [chartEnd, setChartEnd] = useState(0.0)
    const [chartEndDate, setChartEndDate] = useState('')
    const [chartDelta, setChartDelta] = useState<any>(0.0)
    const [firstTick, setFirstTick] = useState(0.0)
    const [zero, setZero] = useState(false)
    const [thirty, setThirty] = useState(false)
    const [ninety, setNinety] = useState(false)
    const [oneEighty, setOneEighty] = useState(false)
    const [threeSixty, setThreeSixty] = useState(false)
    const [chartPeriod, setChartPeriod] = useState(31)
    const [chartLine, setChartLine] = useState([])
    const [chartOptions, setChartOptions] = useState({
        chart: {
            type: 'line',
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            },
            dropShadow: {
                enabled: true,
                top: 4,
                left: 4,
                blur: 3,
                opacity: 0.2
            },
            sparkline: {
                enabled: true
            }
        },
        colors: ['#47c999'],
        stroke: {
            curve: 'straight',
            width: 3
        },
        grid: {
            show: false,
            padding: {
                left: 15,
                right: 15,
                bottom: 15
            }
        },
        xaxis: {
            show: false,
            labels: {
                show: false
            },
            tooltip: {
                enabled: false
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
            show: false,
            labels: {
                show: false,
            }
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            enabled: false
        }
    })

    /** states */
    const {sttRates} = useAppSelector(state => state.authSlice)

    /** functions*/
    /** для смены периода графика*/
    async function changeChartPeriod(period) {
        setChartPeriod(period)
        let shownData = null

        if (!sttRates) {
            const result = await axios.get('https://stt.market/rates')
            shownData = result?.data?.map(el => ({
                date: el.date,
                tick: parseFloat(el.tick.toFixed(7))
            }));
        } else {
            shownData = sttRates
        }

        let cl = []
        shownData = shownData.slice(period * -1)
        shownData[0] = {"tick": shownData[0]["tick"], "date": shownData[0]["date"], visible: true}
        shownData[shownData.length - 1] = {
            "tick": shownData[shownData.length - 1]["tick"],
            "date": shownData[shownData.length - 1]["date"],
            visible: true
        }
        const startDate = shownData[0]["date"]
        const endDate = shownData[shownData.length - 1]["date"]
        const startValue = shownData[0]["tick"]
        const endValue = shownData[shownData.length - 1]["tick"]
        const delta = ((endValue - startValue) / startValue * 100).toFixed(1)
        for (const sd in shownData) {
            cl.push(shownData[sd]["tick"])
        }
        setChartLine(cl)
        setShownDataChart(shownData)
        setChartStart(startValue.toFixed(7))
        setChartStartDate(startDate)
        setChartEnd(endValue.toFixed(7))
        setChartEndDate(endDate)
        setChartDelta(delta)
        setFirstTick(shownData[0]["tick"])
        setZero(false)
        setThirty(false)
        setNinety(false)
        setOneEighty(false)
        setThreeSixty(false)
        if (period === 0) {
            setZero(true)
        } else if (period === 366) {
            setThreeSixty(true)
        } else if (period === 181) {
            setOneEighty(true)
        } else if (period === 91) {
            setNinety(true)
        } else if (period === 31) {
            setThirty(true)
        }
    }

    /** по умолчанию период - месяц*/
    useEffect(() => {
        changeChartPeriod(31)
    }, [sttRates]);

    return (
        <div className={!indicator ? visibility ? cls.hidden : cls.showed : cls.showAllTime}>
            <div
                className={`${indicator == 'noAuth' ? cls.wrapper_transparent : cls.wrapper} ${!indicator ? visibility  ? cls.wrapper_big : cls.wrapper_compact : ''}`}>
                <div className={`${visibility ? cls.block_chart_label : cls.block_chart_label_compact}`}>
                    {visibility && <div className={cls.main_block__header_number}>{firstTick} STT</div>}
                    <div
                        className={`${!indicator ? visibility ? cls.main_block__header_number : cls.main_block__header_number_compact : cls.main_block__header_number_show}`}>{chartEnd} STT
                    </div>
                </div>

                <div className={`${!indicator ? visibility ? cls.chart_data_delta : cls.chart_data_delta_compact : cls.chart_data_delta_main}`}>+ {chartDelta}%
                </div>
                <ResponsiveContainer className={cls.cover_chart_block} height="100%" width="100%"

                >
                    <LineChart data={shownDataChart}
                               margin={{top: 15, right: 20, left: -30, bottom: 15}}
                    >
                        <defs>
                            <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#7c84e5"/>
                                <stop offset="100%" stopColor="#fc46aa"/>
                            </linearGradient>
                        </defs>
                        <YAxis style={{fontFamily: 'Ubuntu, sans-serif', fontSize: '.5rem'}}
                               domain={[firstTick, 'dataMax']}
                               tick={false}
                               stroke={"transparent"}/>
                        <Line
                            type="monotone"
                            strokeLinejoin="round"
                            dataKey="tick"
                            stroke="url(#lineColor)"
                            strokeWidth={2}
                            dot={<CustomizedDot data={shownDataChart}/>}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
                {visibility &&
                    <div className={cls.chart_data}>
                        <span>{chartStartDate}</span>
                        <span>today</span>
                    </div>
                }
                <div className={`${visibility ? cls.cover_btn_time : cls.cover_btn_time_compact}`}>
                    <div className={zero ? `${cls.period_button} ${cls.active}` : `${cls.period_button}`}
                         onClick={() => changeChartPeriod(0)}>All
                    </div>
                    <div className={threeSixty ? `${cls.period_button} ${cls.active}` : `${cls.period_button}`}
                         onClick={() => changeChartPeriod(366)}>1Y
                    </div>
                    <div className={oneEighty ? `${cls.period_button} ${cls.active}` : `${cls.period_button}`}
                         onClick={() => changeChartPeriod(181)}>6m
                    </div>
                    <div className={ninety ? `${cls.period_button} ${cls.active}` : `${cls.period_button}`}
                         onClick={() => changeChartPeriod(91)}>3m
                    </div>
                    <div className={thirty ? `${cls.period_button} ${cls.active}` : `${cls.period_button}`}
                         onClick={() => changeChartPeriod(31)}>1m
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChartBlock