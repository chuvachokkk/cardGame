import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import axiosInstance, { setAccessToken } from '../../services/axiosInstance';
import '../LogRegister/LogRegister.css';

function LogRegister({ setUser }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/auth/login', {
        name: login,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        navigate('/theme');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Неверный логин или пароль');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Form className="p-4 border rounded shadow" style={{ width: '300px' }}>
        <h2 className="mb-4 text-center">Вход / Регистрация</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {isAuthenticated ? (
          <Button
            variant="danger"
            onClick={handleLogout}
            className="w-100 mb-2"
          >
            Выход
          </Button>
        ) : (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Логин:</Form.Label>
              <Form.Control
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Введите логин"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Пароль:</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
              />
            </Form.Group>
            <Button
              variant="primary"
              onClick={handleLogin}
              className="w-100 mb-2"
            >
              Войти
            </Button>
            <Button
              variant="success"
              onClick={handleRegister}
              className="w-100 mb-2"
            >
              Регистрация
            </Button>
          </>
        )}
      </Form>
    </div>
  );
}

export default LogRegister;
