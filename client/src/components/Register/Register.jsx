import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import axiosInstance from '../../services/axiosInstance';
import '../Register/Register.css';

function Register() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (name.trim() === '') {
      setError('Логин не может быть пустым');
      return;
    }

    if (password.length < 2) {
      setError('Пароль должен содержать не менее 9 символов');
      return;
    }

    if (!/\d/.test(password)) {
      setError('Пароль должен содержать хотя бы одну цифру');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/register', {
        name: name,
        password,
      });

      if (response.status === 201) {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Ошибка регистрации');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Form className="p-4 border rounded shadow" style={{ width: '300px' }}>
        <h2 className="mb-4 text-center">Регистрация</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label>Логин:</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        <Form.Group className="mb-3">
          <Form.Label>Подтвердите пароль:</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Подтвердите пароль"
          />
        </Form.Group>
        <Button variant="success" onClick={handleRegister} className="w-100">
          Создать
        </Button>
      </Form>
    </div>
  );
}

export default Register;
