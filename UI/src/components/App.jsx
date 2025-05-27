import { useState } from 'react'
import {Routes, Route} from 'react-router-dom'
import Login from './Login.jsx'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/:username/games'/>
      <Route path='/:username/flappymatt'/>
    </Routes>
  )
}

export default App
