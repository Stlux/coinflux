import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Header from "./components/header"
import Footer from "./components/footer"
import Main from './pages/main';
import CoinData from './pages/coindata';
import {forGlobal} from './components/interfaces';
import { useState, useEffect } from 'react';
import axios from 'axios';
import loader from './assets/Rocket.gif';

function App() {

  const [coins, updateCoins] = useState<[]>([]); // list of coins data
  const [request, setErrorRequestAPI] = useState(false); // API request state

  const [loaderState, setLoader] = useState(true); // Loader state

  const [theme, toggle] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme ? JSON.parse(storedTheme) : false;
  }); // theme toggler state (used for all pages by local storage)

  const [globalData, updateGlobal] = useState<forGlobal>({
    data: {
      total_market_cap: {
        usd: 0
      },
      active_cryptocurrencies: 0,
      markets: 0,
      total_volume: {
        usd: 0
      },
      market_cap_percentage: {
        btc: 0,
        eth: 0
      }
    }
  }); // global data state with all needed parameters

  const [exchanges, setExchanges] = useState<[{}]>([
    {
      id: "",
      name: "",
      url: "",
      image: "",
      trust_score: 10,
      trust_score_rank: 1
    }
  ]); // list of exchanges (objects)

  function toggleTheme():void{
    toggle(!theme);
  } //theme toggler function

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]); // setting up theme by it's state

  useEffect(() => {

    async function gettingDataTop100Coins() {
      try {
        let response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&localization=false`);
        updateCoins(response.data);
      } catch (error) {
        showErrOnPage(); // toggle error state and displaying an error
      }
    } // fetching data with axios of top 100 coins

    async function gettingMainCryptoData() {
      try {
        let response = await axios.get(`https://api.coingecko.com/api/v3/global`);
        updateGlobal(response.data);
      } catch (error) {}
    } // fetching data with axios of main crypto data

    async function gettingExchangesData() {
      try {
        let response = await axios.get(`https://api.coingecko.com/api/v3/exchanges`);
        setExchanges(response.data);
      } catch (error) {}
    } // fetching data with axios of crypto exchanges

    function showErrOnPage(){
      setErrorRequestAPI(!request); 
    }; // setting error state function
  
    if (coins.length === 0) {
      gettingDataTop100Coins();
      gettingMainCryptoData();
      gettingExchangesData();
    } // calling functions
    
    const timer = setTimeout(() => {
      setLoader(false);
    }, 1000); // remove loader
    
    return () => clearTimeout(timer);

  }, []); // using effect only 1 time, while page is rendering

  function Loader(){
    return(
      <>
        <div className="wrapper-loader">
          <img className="loader-img" src={loader} alt="loader"></img>
        </div>
      </>
    );
  } // loader component

  return (
    <>
      {loaderState && <Loader /> /* Loader */} 
      <Header themeState={theme} themeStateToggle={toggleTheme} /> {/* header component */}

      {
        !request ? //if there is no error in api -> 
          (
            <BrowserRouter>
              <Routes>
                <Route index element={<Main coinsData={coins} globalData={globalData} themeState={theme} exchangesData={exchanges}/>} /> {/* main component */}
                <Route path="/coindata/:id" element={<CoinData themeState={theme}/>} /> {/* coindata component */}
              </Routes>
            </BrowserRouter>
          )
        : //else show error -> 
          (
            <>
              <center className="request-error">
                <div>
                  <h1>A lot of requests to API ⚙️</h1>
                  <h4>Wait a little bit and refresh the page</h4>
                </div>
              </center> 
            </>
          )
      }
      

      <Footer themeState={theme}/> {/* footer component */}
    </>
  )
}

export default App
