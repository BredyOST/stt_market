import './chart.scss'
import React, {useEffect, useState} from "react";
import {Line, LineChart, ResponsiveContainer, YAxis} from "recharts";
import {useAppSelector} from "../../shared/redux/hooks/hooks";
import cls from "./chart.module.scss";

const CustomizedDot = (props) => {
    const { cx, cy, index, data } = props;
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
            style={{ filter: "drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.3))" }} // Тень
        />
    );
};



function ChartBlock(props) {
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

    function changeChartPeriod(period) {
        console.log(2)
        console.log(period)
        setChartPeriod(period)
        let shownData = sttRates
        let cl = []
        shownData = shownData.slice(period * -1)
        shownData[0] = {"tick": shownData[0]["tick"], "date": shownData[0]["date"],  visible: true}
        shownData[shownData.length - 1] = {"tick": shownData[shownData.length - 1]["tick"], "date": shownData[shownData.length - 1]["date"], visible: true}
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

    useEffect(() => {
        if (sttRates) {
            changeChartPeriod(31)
        }
    }, [sttRates]);

    return (
        <>
            <div className={`${cls.wrapper} ${cls.ethCard}`}>
                <div className={cls.block_chart_label}>
                    <div className={cls.main_block__header_number}>{firstTick}</div>
                    <div className={cls.main_block__header_number}>{chartEnd}</div>
                </div>
                <div className={cls.chart_data_delta}>+ {chartDelta}%</div>
                <ResponsiveContainer className={cls.cover_chart_block} height={100} width="100%">
                    <LineChart data={shownDataChart}
                               margin={{ top: 15, right: 20, left: -30, bottom: 15 }}>
                        <defs>
                            <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#7c84e5" />
                                <stop offset="100%" stopColor="#fc46aa" />
                            </linearGradient>
                        </defs>
                        <YAxis style={{ fontFamily: 'Ubuntu, sans-serif', fontSize: '.5rem' }}
                               domain={[firstTick, 'dataMax']}
                               tick={false}
                               stroke={"transparent"} />
                        <Line
                            type="monotone"
                            strokeLinejoin="round"
                            dataKey="tick"
                            stroke="url(#lineColor)"
                            strokeWidth={2}
                            dot={<CustomizedDot data={shownDataChart} />}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
                <div className={"chart_data-dates"}>
                    <span>{chartStartDate}</span>
                    <span>today</span>
                </div>
                <div className={cls.cover_btn_time}>
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

            {/*<div className={"main-block eth-card"}>*/}
            {/*    <div className={"main-block__header"}>DYNAMICS*/}
            {/*        <div className={"main-block__header-number"}>{chartEnd}</div>*/}
            {/*    </div>*/}
            {/*    <div className={"chart_data-delta"}>+ {chartDelta}%</div>*/}
            {/*        /!*<Chart type={"line"} options={chartOptions} series={[{data: chartLine}]} height={'200px'} />*!/*/}
            {/*        <ResponsiveContainer height={180} width="100%">*/}
            {/*            <LineChart data={shownDataChart}*/}
            {/*                       margin={{top: 5, right: 20, left: -30, bottom: 15}}>*/}
            {/*                <YAxis style={{fontFamily: 'Ubuntu, sans-serif', fontSize: '.5rem'}}*/}
            {/*                       domain={[firstTick, 'dataMax']} tick={false} stroke={"transparent"}/>*/}
            {/*                <Line type="monotone" strokeLinejoin="round" dataKey="tick" stroke="#31d59b" strokeWidth={2}*/}
            {/*                      dot={<CustomizedDot/>} isAnimationActive={false}/>*/}
            {/*            </LineChart>*/}
            {/*        </ResponsiveContainer>*/}
            {/*        /!*<div className={"main-block__header-number"}>{firstTick}</div>*!/*/}
            {/*        /!*<div className={"chart_data-dates"}>*!/*/}
            {/*        /!*    <span>{chartStartDate}</span>*!/*/}
            {/*        /!*    <span>today</span>*!/*/}
            {/*        /!*</div>*!/*/}
            {/*    </div>*/}
            {/*    <Row>*/}
            {/*        <Col style={{width: '20%'}}>*/}
            {/*            <div className={zero ? "period-button eth-card _active" : "period-button eth-card"}*/}
            {/*                 onClick={() => changeChartPeriod(0)}>All*/}
            {/*            </div>*/}
            {/*        </Col>*/}
            {/*        <Col style={{width: '20%'}}>*/}
            {/*            <div className={threeSixty ? "period-button eth-card _active" : "period-button eth-card"}*/}
            {/*                 onClick={() => changeChartPeriod(366)}>1Y*/}
            {/*            </div>*/}
            {/*        </Col>*/}
            {/*        <Col style={{width: '20%'}}>*/}
            {/*            <div className={oneEighty ? "period-button eth-card _active" : "period-button eth-card"}*/}
            {/*                 onClick={() => changeChartPeriod(181)}>6m*/}
            {/*            </div>*/}
            {/*        </Col>*/}
            {/*        <Col style={{width: '20%'}}>*/}
            {/*            <div className={ninety ? "period-button eth-card _active" : "period-button eth-card"}*/}
            {/*                 onClick={() => changeChartPeriod(91)}>3m*/}
            {/*            </div>*/}
            {/*        </Col>*/}
            {/*        <Col style={{width: '20%'}}>*/}
            {/*            <div className={thirty ? "period-button eth-card _active" : "period-button eth-card"}*/}
            {/*                 onClick={() => changeChartPeriod(31)}>1m*/}
            {/*            </div>*/}
            {/*        </Col>*/}
            {/*    </Row>*/}
            </>
            )
            }

            export default ChartBlock