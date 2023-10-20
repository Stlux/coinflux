import DataTable from 'react-data-table-component';
import CurrencyFormat from 'react-currency-format';
import floorToTwoDecimals from '../components/functions';

interface forPropsMain{ // <---
    coinsData: [],
    globalData: {
        data: {
            total_market_cap: {
                usd: number;
            },
            active_cryptocurrencies: number,
            markets: number,
            total_volume: {
                usd:number
            },
            market_cap_percentage: {
                btc:number,
                eth: number
            }
        }
    },
}

interface columnsTypes{
    id: number;
    thumb: string;
    name: string;
    market_cap_rank: number;
    image: string;
    symbol: string;
    current_price: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    total_volume: number;
    market_cap: number;
}

interface TableColumn<T> {
    name: string;
    selector: (row: T) => string | number; // Adjust this based on the type of data in your columns
    sortable?: boolean;
    width?: string;
}

export default function Main(props:forPropsMain){

    let linkToCoin = "/coindata/";

    const columns_data:TableColumn<columnsTypes>[] = [
        // {
        //     name: '#',
        //     selector: (row:columnsTypes) => props.coinsData.indexOf(row)+1, // <---
        //     sortable: true,
        //     width: '70px'
        // },
        {
            name: 'Image',
            selector: (row:columnsTypes) => <a href={linkToCoin + row.id}><img src={row.image} alt={`${row.id}`} className='coin-image'></img></a> as unknown as string,
            width: '100px'
        },
        {
            name: 'Coin',
            selector: (row:columnsTypes) => <a href={linkToCoin + row.id}><b>{row.name}</b></a> as unknown as string,
        },
        {
            name: 'Ticker',
            selector: (row:columnsTypes) => row.symbol,
            sortable: true,
            width: '100px'
        },
        {
            name: 'Price (USD)',
            selector: (row:columnsTypes) => <CurrencyFormat thousandSeparator={true} displayType={'text'} value={row.current_price} prefix={'$'} /> as unknown as string,
            sortable: true
        },
        {
            name: '24h',
            selector: (row:columnsTypes) => <CurrencyFormat thousandSeparator={true} displayType={'text'} value={row.price_change_24h} prefix={'$'} /> as unknown as string,
            sortable: true
        },
        {
            name: '24h (%)',
            selector: (row:columnsTypes) => {

                return row.price_change_percentage_24h >= 0 ?
                    (
                        <span style={{color: "green"}}>{row.price_change_percentage_24h}%</span> 
                    ) as unknown as string
                :  
                    (
                        <span style={{color: "red"}}>{row.price_change_percentage_24h}%</span>
                    ) as unknown as string
            },
            sortable: true
        },
        {
            name: '24h Volume',
            selector: (row:columnsTypes) => <CurrencyFormat thousandSeparator={true} displayType={'text'} value={row.total_volume} prefix={'$'} /> as unknown as string,
            sortable: true
        },
        {
            name: 'Mkt Cap',
            selector: (row:columnsTypes) => <CurrencyFormat thousandSeparator={true} displayType={'text'} value={row.market_cap} prefix={'$'} /> as unknown as string,
            sortable: true
        }
    ];

    const data = props.coinsData;

    return (
        <>
            <div className="container">

                <div className="global-info-tab">

                    <h1>Global crypto Info</h1>

                    <p>The global cryptocurrency market cap today is <b>${Math.floor(Math.floor(props.globalData.data.total_market_cap.usd)/1000000000000 * 100) / 100} Trillion</b></p>

                    <ul className='global-info-tab-elements'>
                        <li className='global-info-tab-element'>
                            Coins: <span>{props.globalData.data.active_cryptocurrencies}</span>
                        </li>
                        <li className='global-info-tab-element'>
                            Exchanges: <span>{props.globalData.data.markets}</span>
                        </li>
                        <li className='global-info-tab-element total-cap'>
                            Total Market Cap: <span><CurrencyFormat thousandSeparator={true} displayType={'text'} value={floorToTwoDecimals(props.globalData.data.total_market_cap.usd)} prefix={'$'} /></span>
                        </li>
                        <li className='global-info-tab-element total-cap-mob'>
                            Total Market Cap: <span><CurrencyFormat thousandSeparator={true} displayType={'text'} value={(Math.floor(Math.floor(props.globalData.data.total_market_cap.usd)/1000000000000 * 100) / 100)} prefix={'$'} /> Trillion</span>
                        </li>
                        <li className='global-info-tab-element'>
                            24 Volume: <span><CurrencyFormat thousandSeparator={true} displayType={'text'} value={floorToTwoDecimals(props.globalData.data.total_volume.usd)} prefix={'$'} /></span>
                        </li>
                        <li className='global-info-tab-element'>
                            Dominance: BTC <span>{floorToTwoDecimals(props.globalData.data.market_cap_percentage.btc)}%</span>, <span>ETH {floorToTwoDecimals(props.globalData.data.market_cap_percentage.eth)}%</span>
                        </li>
                    </ul>
                </div>

                <div className="top-100-info-tab">
                    <h1>Top 100 coins</h1>
                    <div className='data-table'>
                        <DataTable columns={columns_data} data={data}/>
                        </div>
                </div>

                <div className='information-about-crypto-section'>

                    <div className="about-crypto-section-child">
                        <h1 className="about-crypto-title">What is Crypto Market Cap?</h1>
                        <p className="about-crypto-data">Crypto market cap is the total value of all the coins of a particular cryptocurrency that have been mined or are in circulation. Market capitalization is used to determine the ranking of cryptocurrencies. The higher the market cap of a particular crypto coin, the higher its ranking and share of the market. Crypto market cap is calculated by multiplying the total number of coins in circulation by its current price. For instance, to calculate the market cap of Ethereum, all you need to do is multiply the total number of Ethereum in circulation by the current price of one Ethereum and you will get its market cap.</p>
                    </div>

                    <div className="about-crypto-section-child">
                        <h1 className="about-crypto-title">How to compare Cryptocurrencies Market Cap?</h1>
                        <p className="about-crypto-data">
                            Crypto market cap can be divided into three categories:
                        </p>
                        <ul>
                            <li>Large-cap cryptocurrencies (&gt;$10 billion)</li>
                            <li>Mid-cap Cryptocurrencies ($1 billion - $10 billion)</li>
                            <li>Small-cap cryptocurrencies (&lt;$1 billion)</li>
                        </ul>
                        <p>
                            As a financial metric, market cap allows you to compare the total circulating value of one cryptocurrency with another. Large cap cryptocurrencies such as Bitcoin and Ethereum have a market cap of over $10 billion. They typically consist of protocols that have demonstrated track records, and have a vibrant ecosystem of developers maintaining and enhancing the protocol, as well as building new projects on top of them. While market cap is a simple and intuitive comparison metric, it is not a perfect point of comparison. Some cryptocurrency projects may appear to have inflated market cap through price swings and the tokenomics of their supply. As such, it is best to use this metric as a reference alongside other metrics such as trading volume, liquidity, fully diluted valuation, and fundamentals during your research process.
                        </p>
                    </div>

                    <div className="about-crypto-section-child">
                        <h1 className="about-crypto-title">How does CoinFlux Calculate Cryptocurrency Prices?</h1>
                        <p className="about-crypto-data">The price is calculated using a global volume-weighted average price formula which is based on the pairings available on different exchanges of a particular crypto asset. For examples and more detailed information on how we track cryptocurrency prices and other metrics</p>
                    </div>

                    <div className="about-crypto-section-child">
                        <h1 className="about-crypto-title">What is Crypto Market Cap?</h1>
                        <p className="about-crypto-data">Crypto market cap is the total value of all the coins of a particular cryptocurrency that have been mined or are in circulation. Market capitalization is used to determine the ranking of cryptocurrencies. The higher the market cap of a particular crypto coin, the higher its ranking and share of the market. Crypto market cap is calculated by multiplying the total number of coins in circulation by its current price. For instance, to calculate the market cap of Ethereum, all you need to do is multiply the total number of Ethereum in circulation by the current price of one Ethereum and you will get its market cap.</p>
                    </div>

                    <div className="about-crypto-section-child">
                        <h1 className="about-crypto-title">Why are Cryptocurrency Prices Different on Exchanges?</h1>
                        <p className="about-crypto-data">You may notice that cryptocurrencies listed on different exchanges have different prices. The reasons for this are complex, but simply put cryptocurrencies are traded on different exchanges and across different markets with varying economic conditions, liquidity, trading pairs, and offerings (e.g. derivatives / leverage) which all influence price in their own way.</p>
                    </div>

                    <div className="about-crypto-section-child">
                        <h1 className="about-crypto-title">What is 24h Volume in the Table Above?</h1>
                        <p className="about-crypto-data">The 24h trading volume refers to the amount a cryptocurrency has been bought and sold on all exchanges within the last 24 hours on the spot market. For instance, if the 24h volume for Ethereum is $15 billion, it means that $15 billion worth of Ether had changed hands across all exchanges in the last 24 hours.</p>
                    </div>

                </div>

            </div>
        </>
    );
}