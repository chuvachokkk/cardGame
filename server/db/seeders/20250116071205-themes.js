'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Themes',
      [
        {
          name: 'Еда',
          imagePath: '/uploads/themes/food.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Транспорт',
          imagePath: '/uploads/themes/transport.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Животные',
          imagePath: '/uploads/themes/animals.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Одежда',
          imagePath: '/uploads/themes/clothes.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Природа',
          imagePath: '/uploads/themes/nature.webp',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Спорт',
          imagePath: '/uploads/themes/sports.webp',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Профессии',
          imagePath: '/uploads/themes/professions.png',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Дом',
          imagePath: '/uploads/themes/home.jpeg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Технологии',
          imagePath: '/uploads/themes/tech.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Themes', null, {});
  },
};
