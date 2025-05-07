import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import { Card, Form, Button, Alert, Container, Image } from 'react-bootstrap';
import '../CardGame/CardGame.css';

const CardGame = ({ user }) => {
  const { themeId } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axiosInstance.get(`/card/${themeId}`);
        setCards(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке карточек:', error);
        setError('Ошибка при загрузке карточек');
      }
    };

    fetchCards();
  }, [themeId]);

  const handleCheckAnswer = async () => {
    const currentCard = cards[currentCardIndex];
    const isAnswerCorrect =
      currentCard.russian.toLowerCase() === userAnswer.toLowerCase();
    setIsCorrect(isAnswerCorrect);

    try {
      await axiosInstance.post('/card/result', {
        userId: user.id,
        cardId: currentCard.id,
        isCorrect: isAnswerCorrect,
      });
    } catch (error) {
      console.error('Ошибка при сохранении результата:', error);
    }

    setTimeout(() => {
      if (currentCardIndex + 1 < cards.length) {
        setCurrentCardIndex((prevIndex) => prevIndex + 1);
        setUserAnswer('');
        setIsCorrect(null);
      } else {
        navigate('/theme');
      }
    }, 1000);
  };

  const handleExit = () => {
    navigate('/theme');
  };

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (cards.length === 0) {
    return <Alert variant="info">Загрузка карточек...</Alert>;
  }

  const currentCard = cards[currentCardIndex];

  if (!currentCard) {
    return <Alert variant="warning">Карточки не найдены.</Alert>;
  }

  return (
<Container className="mt-1 container">
  <Card className="shadow card">
    <Card.Body className="card-body">
      <Card.Title className="text-center card-title">
        Карточка {currentCardIndex + 1} из {cards.length}
      </Card.Title>
      <div className="d-flex justify-content-center mb-3">
        <Image
          src={
            currentCard.imagePath
              ? `http://localhost:3000${currentCard.imagePath}`
              : 'https://blog.mann-ivanov-ferber.ru/wp-content/uploads/2017/11/untit.jpg'
          }
          fluid
          style={{ maxHeight: '1000px', objectFit: 'cover' }}
        />
      </div>
      <Card.Text className="text-center fs-4 card-text">
        Слово на английском: <strong>{currentCard.english}</strong>
      </Card.Text>
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Напиши на русском"
          className="text-center input-answer"
        />
      </Form.Group>
      <div className="d-grid gap-2">
        <Button
          variant="primary"
          onClick={handleCheckAnswer}
          size="lg"
          className="button-animate"
        >
          Проверить
        </Button>
        <Button
          variant="secondary"
          onClick={handleExit}
          size="lg"
          className="button-animate"
        >
          Выход
        </Button>
      </div>
      {isCorrect !== null && (
        <Alert
          variant={isCorrect ? 'success' : 'danger'}
          className="mt-3 text-center"
        >
          {isCorrect ? 'Правильно! 🎉' : 'Неверно 😢'}
        </Alert>
      )}
    </Card.Body>
  </Card>
</Container>
  );
};

export default CardGame;
