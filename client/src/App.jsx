import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'


function App() {
 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
