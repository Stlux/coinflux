interface forGlobal{
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
  } // globalData interfaces

interface forPropsMain{
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
    themeState: string,
    exchangesData: [{}]
} // type of props of main component

interface columnsTypes{
    id: number;
    thumb: string;
    name: string;
    market_cap_rank: number;
    image?: string;
    symbol?: string;
    current_price: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    total_volume: number;
    market_cap: number;
} // types for coins list

interface exchangeTypes{
    id: string,
    name: string,
    url: string,
    image: string,
    trust_score: number,
    trust_score_rank: number
    trade_volume_24h_btc: number
} // types for exchange object

interface TableColumn<T> {
    name: string;
    selector: (row: T) => string | number; //could return only string or number
    sortable?: boolean;
    width?: string;
} // type of array of objects for coin list  

interface columnsTypesCoin{
    high_24h: {
        usd: number;
    };
    low_24h: {
        usd: number;
    };
    current_price: {
        usd: number;
    };
    market_cap: {
        usd: number;
    };
    total_volume: {
        usd: number;
    };
    fully_diluted_valuation: {
        usd: number;
    };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_60d: number;
    price_change_percentage_14d: number;
    price_change_percentage_30d: number;
    price_change_percentage_1y: number;
    circulating_supply: any;
    total_supply: any;
    max_supply: any;
}

export type{
    forGlobal,
    forPropsMain,
    columnsTypes,
    exchangeTypes,
    TableColumn,
    columnsTypesCoin
}