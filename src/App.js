import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home" 
import CreateBet from './Pages/Create_bet/CreateBet';
import BettingPage from './Pages/Betting/BettingPage';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/create-bet" element={<CreateBet/>}/>
          <Route exact path="/bet/:uid" element={<BettingPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}
export default App;