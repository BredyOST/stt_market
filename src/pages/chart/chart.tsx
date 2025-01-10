import './chart.scss'
import React, {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import {Line, LineChart, ResponsiveContainer, YAxis} from "recharts";


const CustomizedDot = (props) => {
    const { cx, cy, stroke, payload, value } = props;
    let aa = [stroke, value]
    aa.toString()
    if (payload.visible) {
        return (
            <svg x={cx - 4} y={cy - 4} width={8} height={8} fill="white">
                <g transform="translate(4 4)">
                    <circle r="4" fill="#31d59b" />
                    <circle r="2" fill="#31d59b" />
                </g>
            </svg>
        );
    }

    return null;
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



    function changeChartPeriod(period) {
        setChartPeriod(period)
        let shownData = props.chartData
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
        if (props.chartData) {
            changeChartPeriod(31)
        }
    }, []);

    return (
        <React.Fragment>
        <div className={"main-block eth-card"}>
            <div className={"main-block__header"}>DYNAMICS<div className={"main-block__header-number"}>{chartEnd}</div></div>
            <div className={"chart_data-delta"}>+ {chartDelta}%</div>
            {/*<Chart type={"line"} options={chartOptions} series={[{data: chartLine}]} height={'200px'} />*/}
            <ResponsiveContainer height={180} width="100%">
                <LineChart data={shownDataChart}
                           margin={{ top: 5, right: 20, left: -30, bottom: 15 }}>
                    <YAxis style={{fontFamily: 'Ubuntu, sans-serif', fontSize: '.5rem'}} domain={[firstTick, 'dataMax']} tick={false}  stroke={"transparent"} />
                    <Line type="monotone" strokeLinejoin="round" dataKey="tick" stroke="#31d59b" strokeWidth={2} dot={<CustomizedDot />} isAnimationActive={false} />
                </LineChart>
            </ResponsiveContainer>
            <div className={"main-block__header-number"}>{firstTick}</div>
            <div className={"chart_data-dates"}>
                <span>{chartStartDate}</span>
                <span>today</span>
            </div>
        </div>
        <Row>
            <Col style={{width: '20%'}}>
                <div className={zero ? "period-button eth-card _active" : "period-button eth-card"} onClick={() => changeChartPeriod(0)}>All</div>
            </Col>
            <Col style={{width: '20%'}}>
                <div className={threeSixty ? "period-button eth-card _active" : "period-button eth-card"} onClick={() => changeChartPeriod(366)}>1Y</div>
            </Col>
            <Col style={{width: '20%'}}>
                <div className={oneEighty ? "period-button eth-card _active" : "period-button eth-card"} onClick={() => changeChartPeriod(181)}>6m</div>
            </Col>
            <Col style={{width: '20%'}}>
                <div className={ninety ? "period-button eth-card _active" : "period-button eth-card"} onClick={() => changeChartPeriod(91)}>3m</div>
            </Col>
            <Col style={{width: '20%'}}>
                <div className={thirty ? "period-button eth-card _active" : "period-button eth-card"} onClick={() => changeChartPeriod(31)}>1m</div>
            </Col>
        </Row>
        </React.Fragment>
    )
}

export default ChartBlock