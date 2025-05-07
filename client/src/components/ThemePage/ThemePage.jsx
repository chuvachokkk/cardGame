import axiosInstance from '../../services/axiosInstance';
import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../ThemePage/ThemePage.css'; 

export default function ThemePage({ user }) {
  const [themeCard, setThemeCard] = useState([]);
  const [selectedThemeId, setSelectedThemeId] = useState(null); 
  const [hoveredThemeId, setHoveredThemeId] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get('/theme/all').then((theme) => {
      setThemeCard(theme.data);
      console.log(theme);
    });
  }, []);

  if (!user) {
    return (
      <div className="auth-message">
        Авторизуйтесь
      </div>
    );
  }

  const handleSelect = (id) => {
    setSelectedThemeId(id); 
    navigate(`/card/${id}`); 
  };

  return (
    <div className="theme-page-container">
      {themeCard.map((theme) => (
        <Card
          key={theme.id}
          className={`theme-card ${selectedThemeId === theme.id ? 'selected' : ''}`} 
          style={{
            backgroundColor: hoveredThemeId === theme.id ? 'yellow' : '' 
          }}
          onMouseEnter={() => setHoveredThemeId(theme.id)} 
          onMouseLeave={() => setHoveredThemeId(null)} 
        >
          <Card.Img
            variant="top"
            src={`http://localhost:3000${theme.imagePath}`} 
            className="theme-card-img"
          />
          <Card.Body
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Card.Title className="theme-card-title">
              {theme.name}
            </Card.Title>
            <Button
              variant="primary"
              onClick={() => handleSelect(theme.id)} 
              className="theme-card-button"
            >
              Выбрать
            </Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}