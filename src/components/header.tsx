import { useEffect, useState } from "react";
import logo from "./../assets/logo.png"
import axios from "axios"
import DataTable from 'react-data-table-component'

export default function Header(){

    const[theme, toggle] = useState(false);

    const[searchQuery, setSearchQuery] = useState("");
    const[searchQueryData, setSearchQueryData] = useState({
        coins: []
    });

    function toggleTheme():void{
        toggle(!theme);
    }

    function search(e){
        e.preventDefault()
        setSearchQuery(e.target.search.value)
    }

    useEffect(() => {
        async function gettingFromApi(){
            let response = await axios.get(`https://api.coingecko.com/api/v3/search?query=${searchQuery}`);
            setSearchQueryData(response.data);
        }

        gettingFromApi();
        console.log(searchQuery);
    }, [searchQuery])

    console.log(searchQueryData.coins);

    let urlToCoin = "/coindata/";
    const columns = [
        {
            name: 'Coin',
            selector: row => <a href={urlToCoin + row.id}><img src={row.thumb} alt={`${row.id}`} className='coin-image-search'></img><span className='coin-name-search'>{row.name}</span></a>,
            width: "250px"
        },
        {
            name: 'Rank',
            selector: row => <a href={urlToCoin + row.id}>{row.market_cap_rank}</a>
        },
    ];

    let newStyles = (
        <style>
        {`
            body {
                background: #0e0e0e !important;
                color: white
            }
            .navbar{
                background: #1e1e1e !important;
                box-shadow: none;
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
        `}
        </style>
    );

    return(
        <>
            {theme ? newStyles : ""}
            <nav className="container navbar">
                <div className="nav-left-part">
                    <img className="logo" src={logo}></img>
                </div>
                <div className="nav-center-part">
                    Today's Cryptocurrency Prices by <u>Coin Flux</u>
                </div>
                <div className="nav-right-part">
                    <button className="toggler" onClick={toggleTheme}>🌙</button>

                    <form onSubmit={(e) => search(e)}>
                        <input type="text" id="search" className="search" placeholder="Search coins"/>
                        <button type="submit">Search</button>
                    </form>
                        {

                            searchQuery.length > 0 ? 
                            (<div className="search-tab"><DataTable columns={columns} data={searchQueryData.coins.slice(0, 10)}/></div>)
                            :
                            (<></>)
                        }
                </div>
            </nav>
        </>
    );
}