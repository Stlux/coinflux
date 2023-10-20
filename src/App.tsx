import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Header from "./components/header"
import Footer from "./components/footer"
import Main from './pages/main';
import CoinData from './pages/coindata';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {

  const [coins, updateCoins] = useState([]);
  const [globalData, updateGlobal] = useState({
    data: {
      total_market_cap: {
        usd: ""
      },
      active_cryptocurrencies: "",
      markets: "",
      total_volume: {
        usd: ""
      },
      market_cap_percentage: {
        btc: "",
        eth: ""
      }
    }
  });

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
  
    if (coins.length === 0) {
      gettingDataTop100Coins();
      gettingMainCryptoData();
    }
      
  }, []);

  return (
    <>
      <Header />

      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Main coinsData={coins} globalData={globalData}/>} />
          <Route path="/coindata/:id" element={<CoinData/>} />
        </Routes>
      </BrowserRouter>

      <Footer />
    </>
  )
}

export default App
