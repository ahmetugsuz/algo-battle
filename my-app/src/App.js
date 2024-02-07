import React from 'react';
import {BrowserRouter, BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import OptionPage from './Components/OptionPage';
import HomePage from './Components/HomePage'
import Arena from './Components/BattleSection';
import "./App.css";
import ResultPage from './Components/ResultPage';




export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />}/>
        <Route path="/optionpage" element={<OptionPage />} />
        <Route path='/arena' element={<Arena />} />
        <Route exact path='/resultpage' element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}