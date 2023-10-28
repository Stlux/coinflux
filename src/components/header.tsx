import { useEffect, useState } from "react";
import logo from "./../assets/logo.png"
import logoReversed from "./../assets/logo-reversed.png"
import axios from "axios"
import DataTable from 'react-data-table-component'
import {columnsTypes, TableColumn} from '../components/interfaces';

export default function Header(props:any){

    const[searchQuery, setSearchQuery] = useState("");
    const[searchQueryData, setSearchQueryData] = useState({
        coins: []
    });    

    function search(e:any){
        e.preventDefault()
        setSearchQuery(e.target.search.value)
    }

    useEffect(() => {
        async function gettingFromApi(){
            let response = await axios.get(`https://api.coingecko.com/api/v3/search?query=${searchQuery}`);
            setSearchQueryData(response.data);
        }

        gettingFromApi();
    }, [searchQuery])

    let urlToCoin = "/coindata/";
    const columns:TableColumn<columnsTypes>[] = [
        {
            name: 'Coin',
            selector: (row:columnsTypes) => <a href={urlToCoin + row.id}><img src={row.thumb} alt={`${row.id}`} className='coin-image-search'></img><span className='coin-name-search'>{row.name}</span></a> as unknown as string,
            width: "250px"
        },
        {
            name: 'Rank',
            selector: (row:columnsTypes) => <a href={urlToCoin + row.id}>{row.market_cap_rank}</a> as unknown as string
        },
    ];

    let newStyles = ( //putting those styles if the theme is toggled to 'dark'
        <style>
        {`
            body {
                background: #0e0e0e !important;
                color: white
            }
            .navbar, footer, .global-info-tab-elements{
                background: #1e1e1e !important;
                box-shadow: none !important;
            }
            .nav-center-part{
                color: white;
            }
            .toggler{
                box-shadow: none;
            }
            .global-info-tab-elements{
                box-shadow: 0px 0px 5px 2px #1e1e1e;
            }
            .tab-data-data{
                color: white;
            }
            aside{
                color: white;
            }
            .coin-image{
                box-shadow: none;
                background: #3e3e3e;
            }
            .chart-for-percentage{
                box-shadow: none;
            }
            .custom-tooltip {
                background-color: #1e1e1e;
            }
            .custom-tooltip p {
                color: white;
            }
            .top-exchanges li{
                background: #1e1e1e;
                box-shadow: none;
            }
            .top-exchanges li *{
                color: white;
            }
            .search-tab{
                box-shadow: none;
            }
        `}
        </style>
    );

    return(
        <>
            {
                props.themeState ? newStyles : "" // if theme is dark, set styles
            }
            <nav className="container navbar">
                <div className="nav-left-part">
                    <a href="/">
                        {
                        
                            props.themeState ? // show another logo, if theme is dark
                                (<img className="logo" src={logoReversed}></img>)
                            :
                                (<img className="logo" src={logo}></img>)
                        }
                    </a>
                </div>
                <div className="nav-center-part">
                    Today's Cryptocurrency Prices by <u>Coin Flux</u>
                </div>
                <div className="nav-right-part">
                    <button className="toggler" onClick={props.themeStateToggle}>🌙</button>

                    <form onSubmit={(e) => search(e)}>
                        <input type="text" id="search" className="search" placeholder="Search coins"/>
                        <button type="submit">Search</button>
                    </form>
                        {

                            searchQuery.length > 0 ? // show element if search query is more than 0
                            (<div className="search-tab"><DataTable columns={columns} data={searchQueryData.coins.slice(0, 10)}/></div>)
                            :
                            (<></>)
                        }
                </div>
            </nav>
        </>
    );
}