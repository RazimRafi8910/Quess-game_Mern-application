import Navbar from './components/Navbar/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/Login';
import Game from './pages/gamepages/Game';
import Signup from './pages/Signup';
import { ToastContainer } from 'react-toastify';
import Admin from './pages/Admin';
import useAuth from './Hooks/useAuth';
import Loader from './components/Loader';
import AuthProtect from './components/AuthProtect';
import RoomsPage from './pages/gamepages/RoomsPage';
import GameLobby from './pages/gamepages/GameLobby';
import { useRef } from 'react';

function App() {
  const { loading } = useAuth();
  const location = useLocation();
  const renderCount = useRef<number>(0);

  //devolopment code
  renderCount.current += 1;


  if (loading) {
    return (
      <> <Loader/> </>
    )
  }

  return (
    <>
      <div className="app bg-gradient-to-t from-slate-950 from-50% to-emerald-950 to-90% min-h-screen">
        <Navbar />
        { renderCount && <p className='text-white'>render : { renderCount.current }</p>}
          <ToastContainer/>
          <Routes>
            <Route path='/' element={ <Home/> } />
            <Route path='/login' element={ <Login/> } />
            <Route path='/register' element={ <Signup/> } />
            <Route path='/admin' element={ <Admin/> } />
            <Route path='/game' element={<AuthProtect><Game /></AuthProtect>} />
            <Route path='/room' element={<AuthProtect><RoomsPage /></AuthProtect>} />
            <Route path='/lobby/:id' element={<AuthProtect><GameLobby/></AuthProtect>} />
          </Routes>
      </div>
    </>
  )
}

export default App
