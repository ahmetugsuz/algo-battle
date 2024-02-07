import React from 'react'
import {BrowserRouter as Routes, Route} from 'react-router-dom';
import OptionPage from './OptionPage';
import HomePage from './HomePage'
export default  () => {
  return (

    <Routes>
        <Route exact path="/" element={<HomePage />}/>
        <Route path="/optionpage" element={<OptionPage />} />
    </Routes>

  )
}

 
