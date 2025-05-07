import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Alert } from 'react-bootstrap';
import axiosInstance from '../../services/axiosInstance';

const Progress = ({ user }) => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const fetchUserProgress = async () => {
    try {
      const response = await axiosInstance.get(`/results/user/${user.id}`);
      setResults(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке прогресса:', error);
      setError('Ошибка при загрузке прогресса.');
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchUserProgress();
    }
  }, [user]);
  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Мой прогресс</h1>
      {user ? (
        <Row>
          <Col md={8}>
            {results.length > 0 ? (
              results.map((result) => (
                <Card key={result.themeId} className="mb-4 p-3">
                  <Card.Title>{result.themeName}</Card.Title>
                  <Card.Text>
                    Изучено: {result.result} из {result.totalCards}
                  </Card.Text>
                  <ProgressBar
                    now={(result.result / result.totalCards) * 100}
                    label={`${Math.round(
                      (result.result / result.totalCards) * 100
                    )}%`}
                  />
                </Card>
              ))
            ) : (
              <p className="text-center">Прогресс отсутствует.</p>
            )}
          </Col>
        </Row>
      ) : (
        <Alert variant="warning" className="text-center">
          Пожалуйста, войдите в систему.
        </Alert>
      )}
    </Container>
  );
};

export default Progress;
