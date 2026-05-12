import { User } from '../../User.js'
import { useState } from 'react'

export function Dashboard({ currentUser }) {
  const [users, setUsers] = useState(User.getAll())

  function handleDelete(username) {
    if (!confirm(`Удалить пользователя ${username}?`)) return

    User.deleteUser(username)
    setUsers(User.getAll())
  }

  return (
    <div className="container py-5">
      <h4 className="fw-bold mb-4">
        <i className="bi bi-speedometer2 me-2 text-primary"></i>Панель управления
      </h4>

      <div className="row g-4 mb-4">
       
        <div className="col-sm-4">
          <div className="card border-0 shadow-sm text-center p-4" style={{ borderRadius: 12 }}>
            <i className="bi bi-people-fill text-primary" style={{ fontSize: 36 }}></i>
            <div className="fs-2 fw-bold mt-2">{users.length}</div>
            <div className="text-muted small">Пользователей</div>
          </div>
        </div>

       
        <div className="col-sm-4">
          <div className="card border-0 shadow-sm text-center p-4" style={{ borderRadius: 12 }}>
            <i className="bi bi-person-check-fill text-success" style={{ fontSize: 36 }}></i>
            
            <div className="fs-5 fw-bold mt-2">{currentUser?.username || "Загрузка..."}</div>
            <div className="text-muted small">Текущий пользователь</div>
          </div>
        </div>

       
        <div className="col-sm-4">
          <div className="card border-0 shadow-sm text-center p-4" style={{ borderRadius: 12 }}>
            <i className="bi bi-calendar-check text-warning" style={{ fontSize: 36 }}></i>
          
            <div className="fs-6 fw-bold mt-2">{currentUser?.createdAt || "--.--.----"}</div>
            <div className="text-muted small">Дата регистрации</div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
        <div className="card-body">
          <h6 className="fw-bold mb-3">Все пользователи</h6>

          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Логин</th>
                <th>Дата регистрации</th>
                <th>Действия</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u, i) => (
                <tr key={u.username}>
                  <td className="text-muted">{i + 1}</td>

                  <td>
                    {u.username}
                
                    {u.username === currentUser?.username && (
                      <span className="badge bg-primary ms-2">вы</span>
                    )}
                  </td>

                  <td className="text-muted small">{u.createdAt}</td>

                  <td>
                   
                    {u.username !== currentUser?.username ? (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(u.username)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    ) : (
                      <span className="text-muted small">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;