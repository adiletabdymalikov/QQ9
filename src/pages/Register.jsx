import axios from "axios"; 
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
   
    const [form, setForm] = useState({ username: '', phone: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const API_URL = 'https://6a01fa240d92f63dd25323c7.mockapi.io/t/ad';

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (form.username.length < 3) return setError('Имя слишком короткое');
        if (form.phone.length < 10) return setError('Введите корректный номер телефона');
        if (form.password !== form.confirm) return setError('Пароли не совпадают');

        setLoading(true);

        try {
            const checkResponse = await axios.get(API_URL);
            const existingUser = checkResponse.data.find(u => u.phone === form.phone);

            if (existingUser) {
                setLoading(false);
                return setError('Этот номер телефона уже занят');
            }

            const response = await axios.post(API_URL, {
                username: form.username,
                phone: form.phone, 
                password: form.password,
                createdAt: new Date().toLocaleString('ru-RU')
            });

            if (response.status === 201 || response.status === 200) {
                alert("Регистрация успешна!");
                navigate('/login');
            }

        } catch (err) {
            console.error(err);
            setError('Ошибка сервера. Попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('session')) {
            navigate('/main');
        }
    }, [navigate]);

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <div className="card p-4 shadow" style={{ width: '400px', borderRadius: '15px' }}>
                <h3 className="text-center mb-4">🆕 Регистрация</h3>
                
                {error && <div className="alert alert-danger p-2 small">{error}</div>}

                <form onSubmit={handleRegister}>
                   
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Name</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={form.username}
                            onChange={(e) => setForm({...form, username: e.target.value})}
                            required 
                        />
                    </div>

                   
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Телефон</label>
                        <input 
                            type="tel" 
                            className="form-control" 
                            placeholder="+996..."
                            value={form.phone}
                            onChange={(e) => setForm({...form, phone: e.target.value})}
                            required 
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label small fw-bold">ПАРОЛЬ</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={form.password}
                            onChange={(e) => setForm({...form, password: e.target.value})}
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label small fw-bold">ПОВТОР ПАРОЛЯ</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={form.confirm}
                            onChange={(e) => setForm({...form, confirm: e.target.value})}
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-success w-100 fw-bold"
                        disabled={loading}
                    >
                        {loading ? 'Создание...' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <Link to="/login" className="small text-decoration-none">Уже есть аккаунт? Войти</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;