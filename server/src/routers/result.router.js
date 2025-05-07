const router = require('express').Router();
const { Result, Theme } = require('../../db/models');

router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const results = await Result.findAll({
      where: { userId },
      include: [{ model: Theme, attributes: ['name'] }],
    });

    console.log('Results from DB:', results);

    const formattedResults = results.map((result) => ({
      themeId: result.themeId,
      themeName: result.Theme.name,
      correctAnswers: result.result || 0,
      totalCards: result.totalCards || 1,
    }));

    console.log('Formatted Results:', formattedResults);

    res.json(formattedResults);
  } catch (error) {
    console.error('Ошибка при загрузке результатов:', error);
    res.status(500).json({ error: 'Ошибка при загрузке результатов' });
  }
});

router.get('/user/:userId/theme/:themeId', async (req, res) => {
  const { userId, themeId } = req.params;

  try {
    const results = await Result.findAll({
      where: { userId, themeId },
    });

    res.json(results);
  } catch (error) {
    console.error('Ошибка при загрузке результатов:', error);
    res.status(500).json({ error: 'Ошибка при загрузке результатов' });
  }
});

module.exports = router;
