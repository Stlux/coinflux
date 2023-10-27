import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import axios from 'axios';
import CurrencyFormat from 'react-currency-format';
import floorToTwoDecimals, {darkTheme} from '../components/functions';
import DataTable from 'react-data-table-component'
import {TableColumn, columnsTypesCoin} from '../components/interfaces';

const CustomTooltip = ({ active, payload}:any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="custom-tooltip">
            <p>{`${data.time}`}</p>
            <p>Price: <b>${floorToTwoDecimals(data.price)}</b></p>
            </div>
        );
    }
    return null;
}; // custom tooltip for chart

export default function CoinData(props:any){

    darkTheme();

    const {id} = useParams(); // geting id of coin
    
    const [chart, setChart] = useState({prices : []}); // default chart
    const [chartTimeStamp, setChartTimeStamp] = useState(0); // updated chart (with selected timestap)
    const [coinData, updateCoinData] = useState({
        id: "",
        symbol: "",
        name: "",
        coingecko_rank: "",
        image: {
            small: ""
        },
        description: {
            en: ""
        },
        market_data: {
            high_24h: {
                usd: 0
            },
            low_24h: {
                usd: 0
            },
            current_price: {
                usd: 0
            },
            market_cap: {
                usd: 0
            },
            total_volume: {
                usd: 0
            },
            fully_diluted_valuation: {
                usd: 0
            },
            price_change_percentage_24h: 0,
            price_change_percentage_7d: 0,
            price_change_percentage_60d: 0,
            price_change_percentage_14d: 0,
            price_change_percentage_30d: 0,
            price_change_percentage_1y: 0,
            circulating_supply: "",
            total_supply: "",
            max_supply: 0,
        }
    }); //information about coin

    useEffect(() => {
        
        async function gettingChart(){
            let response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${chartTimeStamp}`);
            setChart(response.data);
        } // fetching chart data of a coin

        if(chartTimeStamp > 0){
            gettingChart();
        }

    }, [chartTimeStamp]); // run this only when chartTimeStamp is clicked, not at first render

    useEffect(() => {

        async function gettingFromApi(){
            let response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
            updateCoinData(response.data);
        } // getting data of a selected coin

        gettingFromApi();

        async function gettingChart(){
            let response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=30`);
            setChart(response.data);
        } // getting basic chart

        gettingChart();
        
    }, []);

    const data: object[] = [];

    chart.prices.map((val) => {
        let dataFormatted =  new Date(val[0]);
        data.push({ time: dataFormatted, price: val[1]}); // pushing formated data in new array of objects 
    });

    function getNeededTimeStap(val:number){
        setChartTimeStamp(val)
    } // onclick function to set state of updated chart

    let progressDifference:number = +coinData.market_data.high_24h.usd - +coinData.market_data.low_24h.usd;
    let progressValue:number = +coinData.market_data.current_price.usd - +coinData.market_data.low_24h.usd;
    // calculating difference and value for price bar

    let columns:TableColumn<columnsTypesCoin>[] = [  // data foir table (price percentage change in different timestamp)
        {
            name: '24h',
            selector: (row:columnsTypesCoin) => {
                return row.price_change_percentage_24h >= 0 ?
                    (
                        <span style={{color: "green"}}>{floorToTwoDecimals(row.price_change_percentage_24h)}%</span> 
                    ) as unknown as string
                :  
                    (
                        <span style={{color: "red"}}>{floorToTwoDecimals(row.price_change_percentage_24h)}%</span>
                    ) as unknown as string
            }
        },
        {
            name: '7d',
            selector: (row:columnsTypesCoin) => {
                return row.price_change_percentage_7d >= 0 ?
                    (
                        <span style={{color: "green"}}>{floorToTwoDecimals(row.price_change_percentage_7d)}%</span> 
                    ) as unknown as string
                :  
                    (
                        <span style={{color: "red"}}>{floorToTwoDecimals(row.price_change_percentage_7d)}%</span>
                    ) as unknown as string
            }
        },
        {
            name: '14d',
            selector: (row:columnsTypesCoin) => {
                return row.price_change_percentage_14d >= 0 ?
                    (
                        <span style={{color: "green"}}>{floorToTwoDecimals(row.price_change_percentage_14d)}%</span> 
                    ) as unknown as string
                :  
                    (
                        <span style={{color: "red"}}>{floorToTwoDecimals(row.price_change_percentage_14d)}%</span>
                    ) as unknown as string
            }
        },
        {
            name: '30d',
            selector: (row:columnsTypesCoin) => {
                return row.price_change_percentage_30d >= 0 ?
                    (
                        <span style={{color: "green"}}>{floorToTwoDecimals(row.price_change_percentage_30d)}%</span> 
                    ) as unknown as string
                :  
                    (
                        <span style={{color: "red"}}>{floorToTwoDecimals(row.price_change_percentage_30d)}%</span>
                    ) as unknown as string
            }
        },
        {
            name: '60d',
            selector: (row:columnsTypesCoin) => {
                return row.price_change_percentage_60d >= 0 ?
                    (
                        <span style={{color: "green"}}>{floorToTwoDecimals(row.price_change_percentage_60d)}%</span> 
                    ) as unknown as string
                :  
                    (
                        <span style={{color: "red"}}>{floorToTwoDecimals(row.price_change_percentage_60d)}%</span>
                    ) as unknown as string
            }
        },
        {
            name: '1y',
            selector: (row:columnsTypesCoin) => {
                return row.price_change_percentage_1y >= 0 ?
                    (
                        <span style={{color: "green"}}>{floorToTwoDecimals(row.price_change_percentage_1y)}%</span> 
                    ) as unknown as string
                :  
                    (
                        <span style={{color: "red"}}>{floorToTwoDecimals(row.price_change_percentage_1y)}%</span>
                    ) as unknown as string
            }
        }
    ]

    const dataArray: columnsTypesCoin[] = [coinData.market_data];

    return (
        <>
            <div className="container">

                <div className="top-info">
                    <div className="top-info-header">
                        <img className="coin-data-image" src={coinData.image.small}></img>
                        <h1 className="coin-data-name"><b>{coinData.name}</b></h1> 
                        <h2 className="coin-data-symbol">{coinData.symbol}</h2> 
                        <span className="coin-data-badge-rank">Rank #{coinData.coingecko_rank}</span> 
                    </div>
                    <div className="range">
                        <progress className="range-bar" value={progressValue} max={progressDifference}></progress>
                        <div className="data-under-bar">
                            <p><CurrencyFormat thousandSeparator={true} displayType={'text'} value={coinData.market_data.low_24h.usd} prefix={'$'} /></p>
                            <p><b>24H Price Change</b></p>
                            <p><CurrencyFormat thousandSeparator={true} displayType={'text'} value={coinData.market_data.high_24h.usd} prefix={'$'} /></p>
                        </div>
                    </div>
                </div>
                
                <main>
                    
                    <div className="left-data">
                        <div className="market-data">
                            <div className="price">
                                <b><CurrencyFormat thousandSeparator={true} displayType={'text'} value={coinData.market_data.current_price.usd} prefix={'$'} /></b>
                                {
                                
                                floorToTwoDecimals(coinData.market_data.price_change_percentage_24h) > 0 ? 
                                    (<span style={{color : "green"}}><b>↑ </b>{floorToTwoDecimals(coinData.market_data.price_change_percentage_24h)}%</span>)
                                :
                                    (<span  style={{color : "red"}}><b>↓ </b>{floorToTwoDecimals(coinData.market_data.price_change_percentage_24h)}%</span>)
                                }
                            </div>
                            <div className="other-market-data">
                                <ul className="first-tab-data">
                                    <li>
                                        <div className="tab-data-header">Market Cap</div>
                                        <div className="tab-data-data"><CurrencyFormat thousandSeparator={true} displayType={'text'} value={coinData.market_data.market_cap.usd} prefix={'$'} /></div>
                                    </li>
                                    <li>
                                        <div className="tab-data-header">24 Hour Trading Vol</div>
                                        <div className="tab-data-data"><CurrencyFormat thousandSeparator={true} displayType={'text'} value={coinData.market_data.total_volume.usd} prefix={'$'} /></div>
                                    </li>
                                    <li>
                                        <div className="tab-data-header">Fully Diluted Valuation</div>
                                        <div className="tab-data-data"><CurrencyFormat thousandSeparator={true} displayType={'text'} value={coinData.market_data.fully_diluted_valuation.usd} prefix={'$'} /></div>
                                    </li>
                                </ul>
                                <ul className="second-tab-data">
                                    <li>
                                        <div className="tab-data-header">Circulating Supply</div>
                                        <div className="tab-data-data"><CurrencyFormat thousandSeparator={true} displayType={'text'} value={coinData.market_data.circulating_supply}/></div>
                                    </li>
                                    <li>
                                        <div className="tab-data-header">Total Supply</div>
                                        <div className="tab-data-data"><CurrencyFormat thousandSeparator={true} displayType={'text'} value={coinData.market_data.total_supply}/></div>
                                    </li>
                                    <li>
                                        <div className="tab-data-header">Max Supply</div>
                                        {

                                            coinData.market_data.max_supply > 0 ?
                                                (<div className="tab-data-data"><CurrencyFormat thousandSeparator={true} displayType={'text'} value={coinData.market_data.max_supply}/></div>)
                                            :
                                                (<div className="tab-data-data">∞</div>)

                                        }
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="chart" style={{ width: '100%' }}>
                            
                            <div className="chart-top-data">
                                <h1>{coinData.name} Price chart</h1>

                                <div className="change-chart-data">
                                    <button className="change-chart-data-btn" onClick={() => getNeededTimeStap(180)}>180d</button>
                                    <button className="change-chart-data-btn" onClick={() => getNeededTimeStap(30)}>30d</button>
                                    <button className="change-chart-data-btn" onClick={() => getNeededTimeStap(7)}>7d</button>
                                    <button className="change-chart-data-btn" onClick={() => getNeededTimeStap(1)}>1d</button>
                                </div>
                            </div>
                            
                            <div className="responsive-chart">
                            
                            {/* Chart */}

                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                    <XAxis dataKey="time" tick={false} interval={0} />
                                    <YAxis domain={['auto', 'dataMax']}/>
                                    <Tooltip content={ <CustomTooltip /> }/>
                                    {
                                        props.themeState ? 
                                            (<Area type="monotone" dataKey="price" stroke="#23B981" fill="#192E1A" />)
                                        :
                                            (<Area type="monotone" dataKey="price" stroke="#23B981" fill="#E9F5E4" />)
                                    }
                                </AreaChart>
                            </ResponsiveContainer>
                            </div>
                            
                            {/* Data table */}
                            <div className="chart-for-percentage">
                                    <DataTable columns={columns} data={dataArray} theme={props.themeState ? "solarized" : ""}/>
                            </div>
                        </div>
                    </div>
                    
                    {/* Text about coin in a form of HTML */}
                    <aside dangerouslySetInnerHTML={{ __html: coinData.description.en }}></aside>

                </main>
            </div>
        </>
    );
}