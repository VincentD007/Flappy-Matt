import {Routes, Route} from 'react-router-dom';
import Login from './Login.jsx';
import Home from './Home.jsx';

function App() {

  return (
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/home/:username' element={<Home/>}/>
    </Routes>
  )
}

export default App
