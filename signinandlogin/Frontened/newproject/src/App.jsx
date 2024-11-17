import { useState } from 'react'

import './App.css'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom'
import Signin from './Components/Signin'
import Login from './Components/Login'
import Dashboard from './Components/Dashboard'
import Product from './Components/product'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
      <Routes>
        <Route path='/' element={<Signin/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Dashboard' element={<Dashboard/>}/>
        <Route path='/Product' element={<Product/>}/>
      </Routes>
      </Router>
    </>
  )
}

export default App
