const jwt = require('jsonwebtoken');

const verifyRefreshToken = (req, res, next) => {
  try {
    const { refreshToken } = req.cookies; // достаем по ключу рефреш токен
    const { user } = jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN);
    res.locals.user = user;
    next();
  } catch (error) {
    console.log('Invalid refresh token');
    res.sendStatus(401);
  }
};

const verifyAccessToken = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1]; // Получаем токен из заголовка

    if (!accessToken) {
      return res.sendStatus(401); // Токен отсутствует
    }

    const { user } = jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN); // Проверяем токен
    res.locals.user = user; // Сохраняем данные пользователя
    next(); // Передаём управление следующему middleware
  } catch (error) {
    console.log('Invalid access token');
    res.sendStatus(401); // Токен недействителен
  }
};

module.exports = { verifyRefreshToken, verifyAccessToken };
