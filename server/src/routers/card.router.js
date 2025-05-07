const router = require('express').Router();
const { where } = require('sequelize');
const { Card, Result, Theme } = require('../../db/models');
const { uploadCardImage } = require('../middleware/uploadCardImage');

// Получаем карточки, созданные пользователем
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const cards = await Card.findAll({ where: { userId } });
    res.json(cards);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Ошибка при загрузке карточек' });
  }
});

// Создание новой карточки
router.post('/cards', uploadCardImage.single('image'), async (req, res) => {
  const { english, russian, themeId, userId } = req.body;
  const imagePath = req.file ? `/uploads/cards/${req.file.filename}` : null;

  console.log('Received data:', {
    english,
    russian,
    themeId,
    userId,
    imagePath,
  });

  try {
    const card = await Card.create({
      english,
      russian,
      themeId,
      userId,
      imagePath,
    });
    res.json(card);
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(500).json({ error: 'Ошибка при создании карточки' });
  }
});

// Удаление карточки
router.delete('/cards/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Deleting card with ID:', id); // Отладочное сообщение
  try {
    await Card.destroy({ where: { id } });
    console.log('Card deleted successfully'); // Отладочное сообщение
    res.json({ message: 'Карточка успешно удалена' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Ошибка при удалении карточки' });
  }
});

// Получение прогресса пользователя
router.get('/results/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await Result.findAll({
      where: { userId },
      include: [{ model: Theme, attributes: ['name'] }],
    });

    const formatted = result.map((result) => ({
      themeId: result.themeId,
      themeName: result.Theme.name,
      result: result.result,
      totalCards: result.totalCards,
    }));
    res.json(formatted);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Ошибка при загрузке прогресса' });
  }
});

router.get('/:themeId', async (req, res) => {
  const { themeId } = req.params;

  try {
    const cards = await Card.findAll({ where: { themeId } });
    res.json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при загрузке карточек' });
  }
});

router.post('/card/check-answer', async (req, res) => {
  const { cardId, userAnswer, userId } = req.body;

  try {
    const card = await Card.findByPk(cardId);

    if (!card) {
      return res.status(404).json({ error: 'Карточка не найдена' });
    }

    const isCorrect = card.russian.toLowerCase() === userAnswer.toLowerCase();
    const result = await Result.findOne({
      where: { userId, themeId: card.themeId },
    });

    if (result) {
      if (isCorrect) {
        result.result += 1;
      }
      await result.save();
    } else {
      await Result.create({
        userId,
        themeId: card.themeId,
        result: isCorrect ? 1 : 0,
        totalCards: 1,
      });
    }

    res.json({ isCorrect, nextCard: await getNextCard(userId, card.themeId) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при проверке ответа' });
  }
});

router.post('/result', async (req, res) => {
  const { userId, cardId, isCorrect } = req.body;

  try {
    const card = await Card.findByPk(cardId);

    if (!card) {
      return res.status(404).json({ error: 'Карточка не найдена' });
    }

    const result = await Result.findOne({
      where: { userId, themeId: card.themeId },
    });

    if (result) {
      if (isCorrect) {
        result.result = (result.result || 0) + 1;
      }
      result.totalCards += 1;
      await result.save();
    } else {
      await Result.create({
        userId,
        themeId: card.themeId,
        result: isCorrect ? 1 : 0,
        totalCards: 1,
      });
    }

    res.json({ message: 'Результат успешно сохранен' });
  } catch (error) {
    console.error('Ошибка при сохранении результата:', error);
    res.status(500).json({ error: 'Ошибка при сохранении результата' });
  }
});

router.get('/theme/:themeId', async (req, res) => {
  const { themeId } = req.params;

  try {
    const cards = await Card.findAll({ where: { themeId } });
    res.json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при загрузке карточек' });
  }
});

module.exports = router;
