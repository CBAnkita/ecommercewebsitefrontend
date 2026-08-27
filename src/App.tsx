import React from 'react'
import Login from './Pages/Login'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Home from './Pages/HomeUser'
import ForgotPassword from "./Component/ForgotPassword";

function App() {

  return (
        <BrowserRouter>
          <Routes>
                <Route path='/' element={<Login/>}/>
              
                <Route path='/forgotpassword' element={<ForgotPassword/>}/>

                <Route path='/home' element={<Home/>}/>
          </Routes>
        
        </BrowserRouter>
    
  )
}

export default App