import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Header from "./components/header"
import Footer from "./components/footer"
import Main from './pages/main';
import CoinData from './pages/coindata';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {

  const [theme, toggle] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme ? JSON.parse(storedTheme) : false;
  });

  const [coins, updateCoins] = useState<[]>([]);

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
  });

  const [exchanges, setExchanges] = useState<[{}]>([
    {
      id: "",
      name: "",
      url: "",
      image: "",
      trust_score: 10,
      trust_score_rank: 1
    }
  ]);

  function toggleTheme():void{
    toggle(!theme);
  }

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(theme));
  }, [theme]);
  
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
  }

  useEffect(() => {

    async function gettingDataTop100Coins() {
      try {
        let response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&localization=false`);
        updateCoins(response.data);
        console.log("gettingDataTop100Coins");
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    async function gettingMainCryptoData() {
      try {
        let response = await axios.get(`https://api.coingecko.com/api/v3/global`);
        updateGlobal(response.data);
        console.log("gettingMainCryptoData");
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    async function gettingExchangesData() {
      try {
        let response = await axios.get(`https://api.coingecko.com/api/v3/exchanges`);
        setExchanges(response.data);
        console.log("gettingExchangesData");
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    if (coins.length === 0) {
      gettingDataTop100Coins();
      gettingMainCryptoData();
      gettingExchangesData();
    }
      
  }, []);

  return (
    <>
      <Header themeState={theme} themeStateToggle={toggleTheme} />

      <BrowserRouter>
        <Routes>
          <Route index element={<Main coinsData={coins} globalData={globalData} themeState={theme} exchangesData={exchanges}/>} />
          <Route path="/coindata/:id" element={<CoinData themeState={theme}/>} />
        </Routes>
      </BrowserRouter>

      <Footer themeState={theme}/>
    </>
  )
}

export default App
