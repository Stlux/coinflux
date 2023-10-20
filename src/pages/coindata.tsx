import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import axios from 'axios';
import CurrencyFormat from 'react-currency-format';
import floorToTwoDecimals from '../components/functions';

export default function CoinData(){

    const {id} = useParams();
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
                usd: ""
            },
            low_24h: {
                usd: ""
            },
            current_price: {
                usd: ""
            },
            market_cap: {
                usd: ""
            },
            total_volume: {
                usd: ""
            },
            fully_diluted_valuation: {
                usd: ""
            },
            price_change_percentage_24h: 0,
            circulating_supply: "",
            total_supply: "",
            max_supply: 0,
        }
    });
    const [chart, setChart] = useState({prices : []});
    const [chartTimeStrap, setChartTimeStrap] = useState(0);

    useEffect(() => {

        
        async function gettingChart(){
            let response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${chartTimeStrap}`);
            setChart(response.data);
        }

        if(chartTimeStrap > 0){
            gettingChart();
        }

    }, [chartTimeStrap]);

    useEffect(() => {

        async function gettingFromApi(){
            let response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
            updateCoinData(response.data);
        }

        gettingFromApi();

        async function gettingChart(){
            let response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=30`);
            setChart(response.data);
        }

        gettingChart();
        
    }, []);

    const data: object[] = []; // <---

    chart.prices.map((val) => {
        let dataFormatted =  new Date(val[0]);
        data.push({ time: dataFormatted, price: val[1]});
    });

    console.log(data);

    //const CustomizedDot = (props) => {};

    function getNeededTimeStap(val:number){
        setChartTimeStrap(val) // <<<<<<< ------------------- 
    }

    let progressDifference:number = +coinData.market_data.high_24h.usd - +coinData.market_data.low_24h.usd; // <---
    let progressValue:number = +coinData.market_data.current_price.usd - +coinData.market_data.low_24h.usd; // <---

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

                            <ResponsiveContainer width="100%" height={450}>
                                <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                    <XAxis dataKey="time" tick={false} interval={0} />
                                    <YAxis domain={['auto', 'dataMax']}/>
                                    <Tooltip />
                                    <Area type="monotone" dataKey="price" stroke="#23B981" fill="#E9F5E4" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    
                    <aside dangerouslySetInnerHTML={{ __html: coinData.description.en }}></aside>

                </main>
            </div>
        </>
    );
}