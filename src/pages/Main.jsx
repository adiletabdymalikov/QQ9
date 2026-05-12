import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; 

function Main() {
   
    const [notes, setNotes] = useState([]);
    const [appointment, setAppointment] = useState({ date: '', time: '', service: 'Выбранное блюдо' });
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation(); 

    const API_URL = 'https://6a01fa240d92f63dd25323c7.mockapi.io/t/ad';

    useEffect(() => {
        const session = localStorage.getItem('session');
        if (!session) {
            navigate('/login');
        } else {
            setCurrentUser(session);
            fetchNotes(session);
            
           
            if (location.state?.serviceName) {
                setAppointment(prev => ({ ...prev, service: location.state.serviceName }));
            }
        }
    }, [navigate, location]);

  
    const fetchNotes = async (username) => {
        try {
            const response = await axios.get(API_URL);
            if (response.status === 200) {
                const myNotes = response.data.filter(note => note.username === username);
                setNotes(myNotes);
            }
        } catch (error) { console.error(error); }
    }

    
    const postAppointment = async (e) => {
        e.preventDefault();
        if (!appointment.date || !appointment.time) return alert("Выберите дату и время доставки!");
        try {
            const response = await axios.post(API_URL, {
                heading: `Заказ: ${appointment.service}`,
                description: `Доставка на: ${appointment.date} в ${appointment.time}`,
                username: currentUser,
                date: appointment.date,
                time: appointment.time
            });
            if (response.status === 201 || response.status === 200) {
                alert("Заказ успешно оформлен!");
                setAppointment({ date: '', time: '', service: 'Выбранное блюдо' });
                fetchNotes(currentUser);
            }
        } catch (error) { console.error(error); }
    }

    const handleLogout = () => {
        localStorage.removeItem('session');
        navigate('/login');
    };

    return (
        <div style={{ backgroundColor: "#fdfaf5", minHeight: "100vh", padding: "40px 20px" }}>
            <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
                
             
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 style={{ fontFamily: 'Playfair Display', fontWeight: 'bold' }}>Bella <span style={{color: '#c5a059'}}>Ristorante</span></h2>
                        {currentUser && <small className="text-muted">Аккаунт: <b>{currentUser}</b></small>}
                    </div>
                    <div className="d-flex gap-2">
                        <Link to="/products" className="btn btn-sm btn-outline-dark rounded-pill px-3">Вернуться в меню</Link>
                        <button onClick={handleLogout} className="btn btn-sm btn-danger rounded-pill px-3">Выйти</button>
                    </div>
                </div>

              
                <div className="card p-4 shadow-sm mb-5" style={{ borderRadius: '25px', border: 'none', background: '#fff' }}>
                    <h4 className="mb-4" style={{ fontWeight: 'bold' }}>Оформление заказа</h4>
                    <form onSubmit={postAppointment}>
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>Блюдо</label>
                            <input 
                                type="text" 
                                className="form-control form-control-lg bg-light" 
                                style={{ borderRadius: '12px', border: 'none' }}
                                value={appointment.service} 
                                onChange={(e) => setAppointment({...appointment, service: e.target.value})}
                            />
                        </div>
                        
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label small fw-bold text-uppercase">Дата доставки</label>
                                <input 
                                    type="date" 
                                    className="form-control form-control-lg" 
                                    style={{ borderRadius: '12px' }}
                                    value={appointment.date} 
                                    onChange={(e) => setAppointment({ ...appointment, date: e.target.value })} 
                                    required 
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label small fw-bold text-uppercase">Время</label>
                                <input 
                                    type="time" 
                                    className="form-control form-control-lg" 
                                    style={{ borderRadius: '12px' }}
                                    value={appointment.time} 
                                    onChange={(e) => setAppointment({ ...appointment, time: e.target.value })} 
                                    required 
                                />
                            </div>
                        </div>
                        
                        <button type="submit" className="btn btn-dark w-100 fw-bold py-3 mt-3 shadow" style={{ borderRadius: '15px', backgroundColor: '#1a1a1a' }}>
                            ПОДТВЕРДИТЬ ЗАКАЗ
                        </button>
                    </form>
                </div>

               
                <div className="history">
                    <h5 className="mb-4" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                        <span style={{ width: '30px', height: '2px', background: '#c5a059', marginRight: '10px' }}></span>
                        История ваших заказов
                    </h5>
                    
                    {notes.length > 0 ? (
                        <div className="row g-3">
                            {notes.slice().reverse().map((item) => (
                                <div className="col-12" key={item.id}>
                                    <div className="card p-3 shadow-sm" style={{ borderRadius: '15px', border: 'none', borderLeft: '6px solid #c5a059' }}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <div className="fw-bold fs-5" style={{ color: '#1a1a1a' }}>{item.heading}</div>
                                                <div className="text-muted small">{item.description}</div>
                                            </div>
                                            <span className="badge bg-light text-dark border rounded-pill px-3 py-2">Готовится</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-5 bg-white shadow-sm" style={{ borderRadius: '20px' }}>
                            <p className="text-muted mb-0">У вас пока нет активных заказов.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Main;