import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { products, categories } from "../data/products";
import 'bootstrap/dist/css/bootstrap.min.css';

const Products = () => {
    const [productList, setProductList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [currentUser, setCurrentUser] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        setProductList(products);
        const session = localStorage.getItem('session');
        if (session) {
            setCurrentUser(session);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('session');
        setCurrentUser(null);
        navigate('/login');
    };

  
    const filteredProducts = selectedCategory === 0 
        ? productList 
        : productList.filter(p => p.category_id === selectedCategory);

    return (
        <div style={{ backgroundColor: "#fdfaf5", minHeight: "100vh" }}>
            <nav className="navbar navbar-expand-lg navbar-dark navbar-custom shadow-sm">
                <div className="container">
                    <Link to="/" className="navbar-brand brand-text fs-3 fw-bold">
                        Bella <span>Ristorante</span>
                    </Link>
                    
                    <div className="d-flex align-items-center gap-4">
                        <div className="d-none d-md-flex gap-4">
                            <Link to="/" className="text-decoration-none text-white small opacity-75">Главная</Link>
                            <Link to="/products" className="text-decoration-none text-white small fw-bold">Меню</Link>
                            <Link to="/main" className="text-decoration-none text-white small opacity-75">Мои заказы</Link>
                        </div>

                        <div className="ms-3 d-flex gap-2">
                            {currentUser ? (
                                <div className="d-flex align-items-center gap-3">
                                    <span className="text-white-50 small">👤 {currentUser}</span>
                                    <button onClick={handleLogout} className="btn btn-outline-light btn-sm px-3 rounded-pill">Выйти</button>
                                </div>
                            ) : (
                                <Link to="/login" className="btn btn-warning btn-sm px-4 fw-bold rounded-pill" style={{ backgroundColor: '#c5a059', border: 'none' }}>
                                    Вход
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container py-5">
              
                <div className="mb-5">
                    <h1 className="display-5 fw-bold mb-2" style={{ fontFamily: 'Playfair Display', color: '#1a1a1a' }}>Наше меню</h1>
                    <p className="text-muted">Выбирайте услуги и записывайтесь на удобное время</p>
                </div>
                <div className="d-flex gap-2 mb-5 overflow-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                    <button 
                        className={`category-btn shadow-sm ${selectedCategory === 0 ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(0)}
                    >
                        Все
                    </button>
                    {categories.map(cat => (
                        <button 
                            key={cat.id}
                            className={`category-btn shadow-sm ${selectedCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

             
                <div className="row g-4">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((item) => (
                            <div className="col-12 col-md-6 col-lg-4" key={item.id}>
                                <div className="card product-card shadow-sm h-100 p-3">
                                   
                                    <div className="text-center mb-3" style={{ background: '#f8f9fa', borderRadius: '20px', padding: '30px' }}>
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            style={{ width: '120px', height: '120px', objectFit: 'contain' }} 
                                        />
                                    </div>

                                    <div className="card-body p-0">
                                        <div className="mb-2 d-flex gap-2">
                                            <span className="badge bg-light text-success border small">🌿 Популярное</span>
                                            {item.price > 1000 && <span className="badge bg-light text-danger border small">🔥 VIP</span>}
                                        </div>
                                        
                                        <h5 className="fw-bold mb-1" style={{ color: '#1a1a1a' }}>{item.name}</h5>
                                        <p className="text-muted small mb-4" style={{ minHeight: '40px' }}>
                                            {item.description}
                                        </p>
                                        
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="price-tag">{item.price} сом</span>
                                            <button 
                                                className="btn btn-dark px-4 py-2 fw-bold" 
                                                style={{ borderRadius: '12px', fontSize: '0.9rem' }}
                                                onClick={() => navigate('/main', { state: { serviceName: item.name } })}
                                            >
                                                + Записаться
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <p className="text-muted fs-5">В этой категории пока нет услуг.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;