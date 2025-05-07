import { Route, Routes } from 'react-router-dom';
// import './App.css';
import ThemePage from './components/ThemePage/ThemePage';
import Profile from './components/Profile/Profile';
import Progress from './components/Progress/Progress';
import Register from './components/Register/Register';
import LogRegister from './components/LogRegister/LogRegister';
import CardGame from './components/CardGame/CardGame';
import NavBar from './components/NavBar/NavBar';
import Results from './components/Results/Results';
import { useEffect, useState } from 'react';
import axiosInstance, { setAccessToken } from './services/axiosInstance';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser && savedUser !== 'undefined'
      ? JSON.parse(savedUser)
      : null;
  });
  const updateUser = (newUser) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  useEffect(() => {
    (async function () {
      try {
        const res = await axiosInstance.get('/token/refresh');
        if (res.data) {
          updateUser(res.data.user);
          setAccessToken(res.data.accessToken);
        }
      } catch (error) {
        console.error('Ошибка при обновлении токена:', error);
      }
    })();
  }, []);

  return (
    <>
      <NavBar user={user} setUser={setUser} />
      <Routes>
        <Route
          path="/profile"
          element={<Profile user={user} updateUser={updateUser} />}
        />
        <Route path="/progress" element={<Progress user={user} />} />
        <Route path="/results/user/:userId" element={<Results user={user} />} />
        <Route path="/results" element={<Results user={user} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<LogRegister setUser={setUser} />} />
        <Route path="/theme" element={<ThemePage user={user} />} />
        <Route path="/card/:themeId" element={<CardGame user={user} />} />
      </Routes>
    </>
  );
}

export default App;
