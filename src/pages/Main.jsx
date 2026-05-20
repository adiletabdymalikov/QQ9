import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import 'bootstrap/dist/css/bootstrap.min.css';

function Main() {
    const [notes, setNotes] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

   
    const [mealType, setMealType] = useState('Завтрак'); 
    const [productName, setProductName] = useState('');
    const [weight, setWeight] = useState(100);
    const [calories, setCalories] = useState('');
    const [proteins, setProteins] = useState('');
    const [fats, setFats] = useState('');
    const [carbs, setCarbs] = useState('');

    
    const [serverProducts, setServerProducts] = useState([]); 
    const [searchResults, setSearchResults] = useState([]); 
    const [showSuggestions, setShowSuggestions] = useState(false); 
    const [dailyGoal, setDailyGoal] = useState(2000);

    const [showMealModal, setShowMealModal] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const API_URL = 'https://6a01fa240d92f63dd25323c7.mockapi.io/t/ad';

    useEffect(() => {
        const session = localStorage.getItem('session');
        if (!session) {
            navigate('/login');
        } else {
            setCurrentUser(session);
            fetchNotes(session);
            fetchServerProducts();
            
            const savedGoal = localStorage.getItem(`dailyGoal_${session}`);
            if (savedGoal) setDailyGoal(Number(savedGoal));
        }
    }, [navigate]);

    const fetchServerProducts = async () => {
        try {
            const response = await axios.get(API_URL);
            if (response.status === 200) {
               
                const items = response.data.filter(item => item.name && !item.username);
                setServerProducts(items);
            }
        } catch (error) {
            console.error("Ошибка при получении базы продуктов с сервера:", error);
        }
    };

    const fetchNotes = async (username) => {
        try {
            const response = await axios.get(API_URL);
            if (response.status === 200) {
                const myNotes = response.data.filter(note => note.username === username);
                setNotes(myNotes);
            }
        } catch (error) { 
            console.error("Ошибка получения данных:", error); 
        }
    }
    const handleSearchChange = (value) => {
        setProductName(value);
        if (value.trim().length > 0) {
            const filtered = serverProducts.filter(product => 
                product.name.toLowerCase().includes(value.toLowerCase())
            );
            setSearchResults(filtered);
            setShowSuggestions(true);
        } else {
            setSearchResults([]);
            setShowSuggestions(false);
        }
    };
    const handleSelectProduct = (product) => {
        setProductName(product.name);
        setCalories(product.calories || '');
        setProteins(product.proteins || '');
        setFats(product.fats || '');
        setCarbs(product.carbs || '');
        setWeight(100); 
        setShowSuggestions(false); 
    };

    const totalCals = notes.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);
    const totalProteins = notes.reduce((sum, item) => sum + (Number(item.proteins) || 0), 0);
    const totalFats = notes.reduce((sum, item) => sum + (Number(item.fats) || 0), 0);
    const totalCarbs = notes.reduce((sum, item) => sum + (Number(item.carbs) || 0), 0);
    const progressPercent = Math.min((totalCals / dailyGoal) * 100, 100);

    const openAddMeal = (type) => {
        setMealType(type);
        setProductName('');
        setCalories('');
        setProteins('');
        setFats('');
        setCarbs('');
        setSearchResults([]);
        setShowSuggestions(false);
        setShowMealModal(true);
        fetchServerProducts(); 
    };

    const handleAddMealSubmit = async (e) => {
        e.preventDefault();
        if (!productName || !calories) return alert("Введите название и калорийность!");

        const ratio = Number(weight) / 100;

        try {
            const response = await axios.post(API_URL, {
                username: currentUser,
                heading: mealType, 
                description: `${productName} (${weight}г)`,
                calories: Math.round(Number(calories) * ratio),
                proteins: Number((Number(proteins || 0) * ratio).toFixed(1)),
                fats: Number((Number(fats || 0) * ratio).toFixed(1)),
                carbs: Number((Number(carbs || 0) * ratio).toFixed(1))
            });

            if (response.status === 201 || response.status === 200) {
                setShowMealModal(false);
                fetchNotes(currentUser);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveGoal = (e) => {
        e.preventDefault();
        localStorage.setItem(`dailyGoal_${currentUser}`, dailyGoal);
        setShowGoalModal(false);
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm("Удалить эту запись?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchNotes(currentUser);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('session');
        navigate('/login');
    };

    return (
        <div style={{ backgroundColor: "#edf7f2", minHeight: "100vh", fontFamily: "system-ui, sans-serif", paddingBottom: "60px" }}>
          
            <div className="container py-3 d-flex justify-content-between align-items-center" style={{ maxWidth: "700px" }}>
                <div>
                    <span className="badge bg-white text-success shadow-sm p-2 rounded-pill">🍎 Счётчик калорий</span>
                </div>
                {currentUser && (
                    <div className="d-flex align-items-center gap-2 bg-white px-3 py-1 rounded-pill shadow-sm">
                        <small className="text-muted">👤 {currentUser}</small>
                        <button onClick={handleLogout} className="btn btn-sm btn-link text-danger text-decoration-none p-0 ms-2" style={{ fontSize: "12px" }}>Выйти</button>
                    </div>
                )}
            </div>

            <div className="container" style={{ maxWidth: '650px', margin: '0 auto' }}>
            
                <div className="card p-4 text-white mb-3 shadow-sm" style={{ background: "linear-gradient(135deg, #2ecc71, #27ae60)", borderRadius: "24px", border: "none" }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <small className="opacity-75 text-uppercase fw-bold" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Дневная цель</small>
                            <h2 className="fw-bold m-0">{totalCals} / {dailyGoal} ккал</h2>
                        </div>
                        <button className="btn btn-light btn-sm rounded-pill fw-bold text-success px-3" onClick={() => setShowGoalModal(true)}>
                            🎯 Цель
                        </button>
                    </div>
                 
                    <div className="progress bg-white bg-opacity-25 my-3" style={{ height: "12px", borderRadius: "6px" }}>
                        <div className="progress-bar bg-white" style={{ width: `${progressPercent}%`, borderRadius: "6px" }}></div>
                    </div>
                    <small className="opacity-75">Осталось: {Math.max(dailyGoal - totalCals, 0)} ккал</small>
                </div>

                <div className="row g-2 mb-4 text-center">
                    <div className="col-4">
                        <div className="bg-white p-3 shadow-sm rounded-4">
                            <div className="text-muted small">Белки</div>
                            <span className="fw-bold text-primary">{totalProteins.toFixed(1)} г</span>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="bg-white p-3 shadow-sm rounded-4">
                            <div className="text-muted small">Жиры</div>
                            <span className="fw-bold text-warning">{totalFats.toFixed(1)} г</span>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="bg-white p-3 shadow-sm rounded-4">
                            <div className="text-muted small">Углеводы</div>
                            <span className="fw-bold text-danger">{totalCarbs.toFixed(1)} г</span>
                        </div>
                    </div>
                </div>

               
                {['Завтрак', 'Обед', 'Ужин', 'Перекус'].map((type) => {
                    const mealsOfType = notes.filter(n => n.heading === type);
                    const calsOfType = mealsOfType.reduce((s, i) => s + Number(i.calories), 0);

                    return (
                        <div key={type} className="bg-white p-3 rounded-4 shadow-sm mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex align-items-center gap-2">
                                    <h5 className="m-0 fw-bold">{type}</h5>
                                    {calsOfType > 0 && <span className="badge bg-light text-muted">{calsOfType} ккал</span>}
                                </div>
                               
                                <button className="btn btn-success btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }} onClick={() => openAddMeal(type)}>
                                    +
                                </button>
                            </div>

                            {mealsOfType.length > 0 ? (
                                <div className="border-top pt-2 mt-2">
                                    {mealsOfType.map(meal => (
                                        <div key={meal.id} className="d-flex justify-content-between align-items-center py-2 border-bottom border-light">
                                            <div>
                                                <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{meal.description}</div>
                                                <small className="text-muted" style={{ fontSize: '11px' }}>
                                                    Б: {meal.proteins}г | Ж: {meal.fats}г | У: {meal.carbs}г
                                                </small>
                                            </div>
                                            <div className="d-flex align-items-center gap-3">
                                                <span className="fw-bold text-success">{meal.calories} ккал</span>
                                                <button className="btn btn-sm btn-link text-danger p-0 text-decoration-none" onClick={() => handleDeleteItem(meal.id)}>🗑️</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <small className="text-muted d-block py-1">Записей нет</small>
                            )}
                        </div>
                    );
                })}
            </div>

            {showMealModal && (
                <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '450px' }}>
                        <div className="modal-content border-none shadow" style={{ borderRadius: '24px' }}>
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">Добавить в {mealType}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowMealModal(false)}></button>
                            </div>
                            <form onSubmit={handleAddMealSubmit}>
                                <div className="modal-body">
                                
                                    <div className="mb-3 position-relative">
                                        <label className="form-label small fw-bold text-muted">Поиск продукта (из MockAPI) *</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Начните вводить: Йогурт, Сыр..." 
                                            value={productName} 
                                            onChange={e => handleSearchChange(e.target.value)} 
                                            autoComplete="off"
                                            required 
                                        />
                                     
                                        {showSuggestions && searchResults.length > 0 && (
                                            <ul className="list-group position-absolute w-100 shadow mt-1" style={{ zIndex: 1100, maxHeight: '200px', overflowY: 'auto', borderRadius: '12px' }}>
                                                {searchResults.map((product) => (
                                                    <li 
                                                        key={product.id} 
                                                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center" 
                                                        style={{ cursor: 'pointer', fontSize: '14px' }}
                                                        onClick={() => handleSelectProduct(product)}
                                                    >
                                                        <span><strong>{product.name}</strong></span>
                                                        <span className="badge bg-success rounded-pill">{product.calories} ккал</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {showSuggestions && searchResults.length === 0 && (
                                            <ul className="list-group position-absolute w-100 shadow mt-1" style={{ zIndex: 1100 }}>
                                                <li className="list-group-item text-muted small">Ничего не найдено. Введите вручную ниже.</li>
                                            </ul>
                                        )}
                                    </div>

                                    <div className="row">
                                        <div className="col-6 mb-3">
                                            <label className="form-label small fw-bold text-muted">Порция (грамм)</label>
                                            <input type="number" className="form-control" value={weight} onChange={e => setWeight(e.target.value)} required />
                                        </div>
                                        <div className="col-6 mb-3">
                                            <label className="form-label small fw-bold text-muted">Калории (на 100г) *</label>
                                            <input type="number" className="form-control" value={calories} onChange={e => setCalories(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="row text-center">
                                        <div className="col-4">
                                            <label className="form-label small text-muted">Белки (г)</label>
                                            <input type="number" step="0.1" className="form-control form-control-sm" value={proteins} onChange={e => setProteins(e.target.value)} />
                                        </div>
                                        <div className="col-4">
                                            <label className="form-label small text-muted">Жиры (г)</label>
                                            <input type="number" step="0.1" className="form-control form-control-sm" value={fats} onChange={e => setFats(e.target.value)} />
                                        </div>
                                        <div className="col-4">
                                            <label className="form-label small text-muted">Углеводы (г)</label>
                                            <input type="number" step="0.1" className="form-control form-control-sm" value={carbs} onChange={e => setCarbs(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 pt-0">
                                    <button type="submit" className="btn btn-success w-100 py-2 fw-bold" style={{ borderRadius: '14px' }}>Добавить</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showGoalModal && (
                <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '350px' }}>
                        <div className="modal-content" style={{ borderRadius: '20px' }}>
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold">Дневная цель</h5>
                                <button type="button" className="btn-close" onClick={() => setShowGoalModal(false)}></button>
                            </div>
                            <form onSubmit={handleSaveGoal}>
                                <div className="modal-body">
                                    <label className="form-label small text-muted">Калории в день</label>
                                    <input type="number" className="form-control form-control-lg" value={dailyGoal} onChange={e => setDailyGoal(Number(e.target.value))} required />
                                    <div className="bg-light p-2 rounded-3 mt-3" style={{ fontSize: '11px' }}>
                                        💡 Рекомендации:<br/>
                                        • Женщины: 1800-2200 ккал<br/>
                                        • Мужчины: 2200-2500 ккал
                                    </div>
                                </div>
                                <div className="modal-footer border-0">
                                    <button type="submit" className="btn btn-success w-100" style={{ borderRadius: '12px' }}>Сохранить</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Main;
// test 