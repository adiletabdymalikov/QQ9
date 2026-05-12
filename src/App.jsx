import './App.css';
import { useState } from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main.jsx';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <BrowserRouter>
      <div className="App">
        
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/main" element={<Main />} />
          <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
        
          <Route path="/dashboard" element={<Dashboard currentUser={currentUser} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;