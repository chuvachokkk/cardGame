import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Добавлен useParams
import { Container, Card, ProgressBar, Alert, Spinner } from 'react-bootstrap';
import axiosInstance from '../../services/axiosInstance';

const Results = ({ user }) => {
  const { userId } = useParams(); // теперь хук useParams работает
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId && user?.id) {
      navigate(`/results/user/${user.id}`);
    } else if (userId) {
      fetchUserResults();
    }
  }, [userId, user, navigate]);

  const fetchUserResults = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/result/user/${userId}`, {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
      console.log('Results from server:', response.data);

      setResults(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке результатов:', error);
      setError('Ошибка при загрузке результатов.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Мои результаты</h1>
      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : results.length > 0 ? (
        results.map((result) => {
          const correctAnswers = result.correctAnswers;
          const totalCards = result.totalCards;
          const progress = (correctAnswers / totalCards) * 100;

          return (
            <Card key={result.themeId} className="mb-4 p-3">
              <Card.Title>{result.themeName}</Card.Title>
              <Card.Text>
                Правильных ответов: {correctAnswers}
              </Card.Text>
              {/* <ProgressBar now={progress} label={`${Math.round(progress)}%`} /> */}
            </Card>
          );
        })
      ) : (
        <p className="text-center">Результаты отсутствуют.</p>
      )}
    </Container>
  );
};

export default Results;
