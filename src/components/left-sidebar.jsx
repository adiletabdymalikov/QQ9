const LeftSidebar = () => {
    return (
        <div className="bg-dark text-white p-3" style={{ minHeight: '100vh' }}>
            <h4>Меню</h4>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <a className="nav-link text-white" href="#">Главная</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link text-white" href="#">Продукты</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link text-white" href="#">Настройки</a>
                </li>
            </ul>
        </div>
    );
};

export default LeftSidebar;