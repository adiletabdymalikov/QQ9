import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios' 

export function Login({ setCurrentUser }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  
  const API_URL = 'https://6a01fa240d92f63dd25323c7.mockapi.io/t/ad';

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
     
      const response = await axios.get(API_URL);
      const users = response.data;
      
      
      const user = users.find(u => 
        u.username.toLowerCase() === form.username.toLowerCase() && 
        u.password === form.password
      );

      if (!user) {
        setLoading(false);
        return setError('Неверный логин или пароль');
      }
      
     
      localStorage.setItem('session', user.username);
      if (setCurrentUser) setCurrentUser(user);
      
      navigate('/main');
    } catch (err) {
      console.error(err);
      setError('Ошибка при входе. Проверьте соединение.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (localStorage.getItem('session') != null) {
      navigate('/main');
    }
  }, [navigate]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow border-0 p-4" style={{ width: 380, borderRadius: 20 }}>
        
        <div className="text-center mb-4">
          <h4 className="fw-bold mb-0">Вход (Cloud)</h4>
          <p className="text-muted small">Введите данные из MockAPI</p>
        </div>

        {error && <div className="alert alert-danger py-2 small text-center">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label small fw-bold">ЛОГИН</label>
            <input
              className="form-control bg-light border-0 py-2"
              placeholder="username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold">ПАРОЛЬ</label>
            <input
              type="password"
              className="form-control bg-light border-0 py-2"
              placeholder="••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm" disabled={loading}>
            {loading ? 'Проверка...' : 'Войти'}
          </button>
        </form>

        <hr className="my-4" />
        <p className="text-center text-muted small mb-0">
          Нет аккаунта? <Link to="/register" className="text-primary fw-bold text-decoration-none">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  )
}

export default Login;