import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import axios from 'axios';
import CurrencyFormat from 'react-currency-format';
import floorToTwoDecimals from '../components/functions';
import DataTable, {createTheme} from 'react-data-table-component'

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
};


export default function CoinData(props:any){

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

    const data: object[] = [];

    chart.prices.map((val) => {
        let dataFormatted =  new Date(val[0]);
        data.push({ time: dataFormatted, price: val[1]});
    });

    function getNeededTimeStap(val:number){
        setChartTimeStrap(val)
    }

    let progressDifference:number = +coinData.market_data.high_24h.usd - +coinData.market_data.low_24h.usd;
    let progressValue:number = +coinData.market_data.current_price.usd - +coinData.market_data.low_24h.usd;

    interface columnsTypes{
        high_24h: {
            usd: any;
        };
        low_24h: {
            usd: any;
        };
        current_price: {
            usd: any;
        };
        market_cap: {
            usd: any;
        };
        total_volume: {
            usd: any;
        };
        fully_diluted_valuation: {
            usd: any;
        };
        price_change_percentage_24h: any;
        price_change_percentage_7d: any;
        price_change_percentage_60d: any;
        price_change_percentage_14d: any;
        price_change_percentage_30d: any;
        price_change_percentage_1y: any;
        circulating_supply: any;
        total_supply: any;
        max_supply: any;
    }

    interface TableColumn<T> {
        name: string;
        selector: (row: T) => string | number;
    }

    let columns:TableColumn<columnsTypes>[] = [
        {
            name: '24h',
            selector: (row:columnsTypes) => {
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
            selector: (row:columnsTypes) => {
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
            selector: (row:columnsTypes) => {
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
            selector: (row:columnsTypes) => {
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
            selector: (row:columnsTypes) => {
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
            selector: (row:columnsTypes) => {
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

    createTheme('solarized', {
        text: {
            primary: '#eee',
            secondary: '#fff',
        },
        background: {
            default: '#1e1e1e',
        },
        context: {
            background: '#1e1e1e',
            text: '#FFF',
        },
        divider: {
            default: '#3e3e3e',
        }
    }, 'dark');

    const dataArray: columnsTypes[] = [coinData.market_data];

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
                                    
                            <div className="chart-for-percentage">
                                    <DataTable columns={columns} data={dataArray} theme={props.themeState ? "solarized" : ""}/>
                            </div>
                        </div>
                    </div>
                    
                    <aside dangerouslySetInnerHTML={{ __html: coinData.description.en }}></aside>

                </main>
            </div>
        </>
    );
}