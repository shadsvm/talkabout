import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Teams from './components/Teams';
import Add from './components/Add';

import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Chat from './components/Chat';
import Profile from './pages/Profile';

function App() {


  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            
            <Route path='/' exact element={<Landing />} />
            <Route path='/*' element={<NotFound />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />

            <Route path='/t' element={<Dashboard />}>
              <Route path=':ID' element={<Chat />} />
              <Route path='add' element={<Add />} />
              <Route path='teams' element={<Teams />} />
              <Route path='profile' element={<Profile />} />
            </Route>


          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
