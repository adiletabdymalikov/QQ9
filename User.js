export class User {
  constructor(username, password, createdAt = null) {
    this.username = username;
    this.password = password;
   
    this.createdAt = createdAt || new Date().toLocaleString('ru-RU');
  }

  
  checkPassword(password) {
    return this.password === password;
  }

 
  static getAll() {
    try {
      return JSON.parse(localStorage.getItem('users') || '[]');
    } catch (e) {
      console.error("Ошибка парсинга пользователей:", e);
      return [];
    }
  }

  
  static findByUsername(username) {
    if (!username) return null;
    const users = User.getAll();
   
    const data = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (!data) return null;

    
    return new User(data.username, data.password, data.createdAt);
  }

  
  static saveSession(username) {
    localStorage.setItem('session', username);
  }

 
  static clearSession() {
    localStorage.removeItem('session');
  }

  
  static getSessionUser() {
    const username = localStorage.getItem('session');
    if (!username) return null;
    return User.findByUsername(username);
  }

  
  save() {
    const users = User.getAll();
    
   
    const exists = users.find(u => u.username.toLowerCase() === this.username.toLowerCase());
    if (exists) {
      throw new Error('Пользователь с таким именем уже существует');
    }

    users.push({
      username: this.username,
      password: this.password,
      createdAt: this.createdAt
    });

    localStorage.setItem('users', JSON.stringify(users));
  }

  
  static initTestAccounts() {
    const users = User.getAll();
    
    if (users.length === 0) {
      const testUsers = [
        { username: "admin", password: "123" },
        { username: "user", password: "123" }
      ];

      const prepared = testUsers.map(u => ({
        ...u,
        createdAt: new Date().toLocaleString('ru-RU')
      }));

      localStorage.setItem("users", JSON.stringify(prepared));
      console.log("Тестовые аккаунты созданы: admin (123), user (123)");
    }
  }
}


User.initTestAccounts();