import React from 'react';
import { Container, Navbar, Button } from 'react-bootstrap';
import logo from '../../image/logo.webp';
import { useNavigate } from 'react-router-dom';

function NavBar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (user) {
      navigate('/theme');
    } else {
      navigate('/'); 
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleResultsClick = () => {
    navigate('/results');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user'); 
    setUser(null);
    navigate('/');
  };

  return (
    <Navbar
      style={{ minHeight: '10vh', backgroundColor: '#FFD1DC' }}
      className="shadow-sm"
    >
      <Container>
        <Navbar.Brand onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          {' '}
          {/* Добавляем обработчик клика */}
          <img
            src={logo}
            alt="Логотип"
            style={{ height: '40px', width: 'auto' }}
          />
        </Navbar.Brand>

        <Navbar.Text className="mx-auto">
          <h3
            style={{
              margin: 0,
              color: '#FFA500',
              // fontFamily: 'Arial, sans-serif',
              fontWeight: 'bold',
            }}
          >
            Английский-легко! 😊
          </h3>
        </Navbar.Text>

        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Button
            variant="outline-warning"
            onClick={handleResultsClick}
            className="me-2"
            style={{
              color: '#FFA500',
              borderColor: '#FFA500',
              // fontFamily: 'Arial, sans-serif',
            }}
          >
            Результаты
          </Button>

          {user ? (
            <>
              <Button
                variant="warning"
                onClick={handleProfileClick}
                className="me-2"
                style={{
                  backgroundColor: '#FFA500',
                  borderColor: '#FFA500',
                  // fontFamily: 'Arial, sans-serif',
                }}
              >
                Привет, {user.name}!
              </Button>
              <Button
                variant="danger"
                onClick={handleLogout}
                style={{
                  // fontFamily: 'Arial, sans-serif',
                }}
              >
                Выход
              </Button>
            </>
          ) : (
            <Button
              variant="warning"
              onClick={handleProfileClick}
              style={{
                backgroundColor: '#FFA500',
                borderColor: '#FFA500',
                // fontFamily: 'Arial, sans-serif',
              }}
            >
              Профиль
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
