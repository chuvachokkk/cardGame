const router = require('express').Router();
const cookieConfig = require('../../configs/cookieConfig'); //! не забыть проверить пути
const { verifyRefreshToken } = require('../middleware/verifyToken'); //! не забыть проверить пути
const generateToken = require('../utils/generateToken'); //! не забыть проверить пути

router.get('/refresh', verifyRefreshToken, (req, res) => {
  try {
    const { user } = res.locals;
    const { accessToken, refreshToken } = generateToken({ user });

    res
      .cookie('refreshToken', refreshToken, cookieConfig.refresh)
      .json({ user: user, accessToken });
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});

module.exports = router;
