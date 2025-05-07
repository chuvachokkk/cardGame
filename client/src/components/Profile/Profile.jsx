import React, { useState, useEffect } from 'react';
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Card,
  Alert,
  ListGroup,
  Spinner,
} from 'react-bootstrap';
import axiosInstance from '../../services/axiosInstance';
import CreateCard from '../CreateCard/CreateCard';

const Profile = ({ user, updateUser }) => {
  const [username, setUsername] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [userQuests, setUserQuests] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('User prop:', user);
  }, [user]);

  const fetchUserCards = async () => {
    try {
      const response = await axiosInstance.get(`/card/user/${user.id}`);
      setUserQuests(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке карточек:', error);
      setError('Ошибка при загрузке карточек.');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/api/user/profile');
        updateUser(response.data.user);
        setUsername(response.data.user.name);
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [updateUser]);

  useEffect(() => {
    if (user) {
      fetchUserCards();
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.put(`/user/update/`, {
        newUsername: username,
      });

      if (response.status === 200) {
        setMessage('Профиль успешно обновлен!');
        setError('');
        updateUser({ ...user, name: username });
      }
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      setError(
        error.response?.data?.message || 'Ошибка при обновлении профиля'
      );
      setMessage('');
    }
  };

  const handleDeleteCard = async (cardId) => {
    console.log('Deleting card with ID:', cardId);
    try {
      await axiosInstance.delete(`/card/cards/${cardId}`);
      setUserQuests((prevQuests) =>
        prevQuests.filter((quest) => quest.id !== cardId)
      );
      setMessage('Карточка успешно удалена!');
      setError('');
    } catch (error) {
      console.error('Ошибка при удалении карточки:', error);
      setError('Ошибка при удалении карточки.');
      setMessage('');
    }
  };

  if (isLoading) {
    return (
      <Container className="my-3 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="my-3">
      <h1 className="text-center mb-3">Личный кабинет</h1>
      {user ? (
        <>
          <Row className="mb-3">
            <Col md={6}>
              <Card className="p-3 h-100">
                <h3 className="mb-3">Редактирование профиля</h3>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleUpdateProfile}>
                  <Form.Group controlId="formUsername" className="mb-2">
                    <Form.Label>Имя пользователя</Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formPassword" className="mb-2">
                    <Form.Label>Новый пароль</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Введите новый пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    Обновить профиль
                  </Button>
                </Form>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="p-3 h-100">
                <h3 className="mb-3">Создать новую карточку</h3>
                <CreateCard userId={user.id} />
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className="p-3">
                <h3 className="mb-3" style={{ fontSize: '18px' }}>
                  Добавленные карточки
                </h3>
                {userQuests.length > 0 ? (
                  <ListGroup style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {userQuests.map((quest) => (
                      <ListGroup.Item
                        key={quest.id}
                        style={{
                          padding: '10px',
                          marginBottom: '5px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}
                      >
                        <div
                          style={{ textAlign: 'center', marginBottom: '10px' }}
                        >
                          <strong>{quest.english}</strong> — {quest.russian}
                        </div>

                        {quest.imagePath && (
                          <img
                            src={`http://localhost:3000${quest.imagePath}`}
                            alt={quest.english}
                            style={{
                              width: '500px',
                              height: 'auto',
                              marginBottom: '10px',
                            }}
                          />
                        )}

                        <Button
                          variant="danger"
                          size="lg"
                          onClick={() => handleDeleteCard(quest.id)}
                          style={{ width: '150px' }}
                        >
                          Удалить
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className="text-center mb-0" style={{ fontSize: '14px' }}>
                    Вы еще не добавили ни одной карточки со словами.
                  </p>
                )}
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <Alert variant="warning" className="text-center">
          Пожалуйста, войдите в систему.
        </Alert>
      )}
    </Container>
  );
};

export default Profile;
