const faker = require('faker');
const jsSHA = require('jssha');

module.exports = {
  up: async (queryInterface) => {
    const itemsList = [];

    for (let i = 0; i < 100; i += 1) {
      itemsList.push({
        username: faker.commerce.product(),
        email: faker.commerce.productDescription(),
        password: faker.commerce.price(),
        is_admin: faker.commerce.price(),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    try {
      const result = await queryInterface.bulkInsert('items', itemsList);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('items', null, {});
  },
};
