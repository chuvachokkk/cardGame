import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axiosInstance from '../../services/axiosInstance';
import '../CreateCard/CreateCard.css'; 

const CreateCard = ({ userId }) => {
  const [english, setEnglish] = useState('');
  const [russian, setRussian] = useState('');
  const [themeId, setThemeId] = useState('');
  const [image, setImage] = useState(null);
  const [themes, setThemes] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchThemes = async () => {
    try {
      const response = await axiosInstance.get('/theme');
      setThemes(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке тем:', error);
      setError('Ошибка при загрузке тем.');
    }
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError('Пользователь не авторизован');
      return;
    }
    const formData = new FormData();
    formData.append('english', english);
    formData.append('russian', russian);
    formData.append('themeId', themeId);
    formData.append('userId', userId);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axiosInstance.post('/card/cards', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Карточка успешно создана!');
      setError('');
      setEnglish('');
      setRussian('');
      setThemeId('');
      setImage(null);
    } catch (error) {
      console.error('Ошибка при создании карточки:', error);
      setError('Ошибка при создании карточки.');
      setMessage('');
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  return (
    <Form onSubmit={handleCreateCard} className="create-card-form">
      <h3>Создать новую карточку</h3>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group controlId="formEnglish" className="mb-3">
        <Form.Label>Английское слово</Form.Label>
        <Form.Control
          type="text"
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formRussian" className="mb-3">
        <Form.Label>Русский перевод</Form.Label>
        <Form.Control
          type="text"
          value={russian}
          onChange={(e) => setRussian(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formTheme" className="mb-3">
        <Form.Label>Тема</Form.Label>
        <Form.Select
          value={themeId}
          onChange={(e) => setThemeId(e.target.value)}
          required
        >
          <option value="">Выберите тему</option>
          {themes.map((theme) => (
            <option key={theme.id} value={theme.id}>
              {theme.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="formImage" className="mb-3">
        <Form.Label>Изображение (опционально)</Form.Label>
        <Form.Control
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100 create-card-button">
        Создать карточку
      </Button>
    </Form>
  );
};

export default CreateCard;