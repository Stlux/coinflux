import DataTable from 'react-data-table-component';
import CurrencyFormat from 'react-currency-format';
import floorToTwoDecimals, {darkTheme} from '../components/functions';
import CryptoInfo from '../components/crypto-info';
import {forPropsMain, columnsTypes, exchangeTypes, TableColumn} from '../components/interfaces';

export default function Main(props:forPropsMain){

    let linkToCoin = "/coindata/"; //link base

    darkTheme();

    const columns_data:TableColumn<columnsTypes>[] = [ //table wioth crypto data, property selector is converted to a string, becasuse it is A JSX element
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
            selector: (row:columnsTypes) => row.symbol as string, 
            sortable: true,
            width: '100px'
        },
        {
            name: 'Price (USD)',
            selector: (row:columnsTypes) => <CurrencyFormat thousandSeparator={true} displayType={'text'} value={row.current_price} prefix={'$'} /> as unknown as string,
        },
        {
            name: '24h',
            selector: (row:columnsTypes) => <CurrencyFormat thousandSeparator={true} displayType={'text'} value={row.price_change_24h} prefix={'$'} /> as unknown as string,
        },
        {
            name: '24h (%)',
            selector: (row:columnsTypes) => {

                return row.price_change_percentage_24h >= 0 ? // if price is positive -> green
                    (
                        <span style={{color: "green"}}>{row.price_change_percentage_24h}%</span> 
                    ) as unknown as string
                :  // else -> red
                    (
                        <span style={{color: "red"}}>{row.price_change_percentage_24h}%</span>
                    ) as unknown as string
            },
        },
        {
            name: '24h Volume',
            selector: (row:columnsTypes) => <CurrencyFormat thousandSeparator={true} displayType={'text'} value={row.total_volume} prefix={'$'} /> as unknown as string,
        },
        {
            name: 'Mkt Cap',
            selector: (row:columnsTypes) => <CurrencyFormat thousandSeparator={true} displayType={'text'} value={row.market_cap} prefix={'$'} /> as unknown as string,
        }
    ];

    const data = props.coinsData;

    const exData: exchangeTypes[] = props.exchangesData.map((item: any) => {
        return {
            id: item.id,
            name: item.name,
            url: item.url,
            image: item.image,
            trust_score: item.trust_score,
            trust_score_rank: item.trust_score_rank
        };
    }); //converting data type

    let exchanges = exData.slice(0, 9).map((val:exchangeTypes) => { // take only first 9 elements and map them to a JSX elements
        return(
            <li>
                <a href={val.url} target='_blank'>
                    <div className="exchange-img">
                            <img className='coin-image' src={val.image} alt={val.name} />
                    </div>

                    <div className="other-data">
                        <div className="exchange-name">
                            <b>{val.name}</b>
                        </div>
                        <div className='score'>
                            Trust Score: <span>{val.trust_score}</span> / 
                            Rank: <span>{val.trust_score_rank}</span>
                        </div>
                    </div>
                </a>
            </li>
        );
    });

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

                <div className='top-exchanges'>
                    <h1>Top Exchanges</h1>
                    <ul>
                        {exchanges}
                    </ul>
                </div>

                <div className="top-100-info-tab">
                    <h1>Top 100 coins</h1>
                    <div className='data-table'>
                        <DataTable 
                            columns={columns_data} 
                            data={data} 
                            theme={props.themeState ? "solarized" : ""}
                        />
                    </div>
                </div>

                <CryptoInfo/>

            </div>
        </>
    );
}