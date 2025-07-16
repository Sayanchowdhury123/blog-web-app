import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Flex, Text, Button } from "@radix-ui/themes";
import { Route,  BrowserRouter as Router, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import Privateroute from './pages/Privateroute';

function App() {


  return (
    <>
    	<Router>
        <Routes>
          <Route path='/signup' element={<Signup/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/home' element={<Privateroute><Home/></Privateroute> } />
        </Routes>
      </Router>
    </>
  )
}

export default App;
