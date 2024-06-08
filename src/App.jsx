import React from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Error from './pages/error'
import Home from './pages/home'

import Orders from './pages/order'


const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/orders' element={<Orders />}></Route>
        <Route path='*' element={<Error />}></Route>
      </Routes>
    </>
  )
}
export default App
