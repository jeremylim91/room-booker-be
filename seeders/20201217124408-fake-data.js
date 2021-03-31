// import { getRandomNumInRange, getRandomDateInRange } from '../utils/seederHelperFns.mjs';
const faker = require('faker');
const jsSHA = require('jssha');
const helpers = require('../utils/seederHelperFns.js');

const { getRandomDateInRange, getRandomNumInRange, removeSpacesInString } = helpers;
const sampleDate = getRandomDateInRange(new Date(2021, 2, 1), new Date(2021, 8, 1));

module.exports = {
  up: async (queryInterface) => {
    /*= =============================================
    USERS TABLE
    ============================================== */
    const usersList = [];
    const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
    shaObj.update('password');
    const hashedPassword = shaObj.getHash('HEX');

    for (let i = 0; i < 20; i += 1) {
      const name = faker.name.findName();
      usersList.push({
        username: name,
        email: `${removeSpacesInString(name)}@gmail.com`,
        password: hashedPassword,
        is_admin: false,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    usersList.push({
      username: 'jon',
      email: 'jon@gmail.com',
      password: hashedPassword,
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date(),
    });

    try {
      const result = await queryInterface.bulkInsert('users', usersList);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
    /*= =============================================
    ROOMS TABLE
    ============================================== */
    const roomsList = [];
    roomsList.push(
      {
        room_name: 'ONYX',
        max_occupancy: 10,
        opening_time: '08:00:00',
        closing_time: '19:00:00',
        thumbnail: 'https://blog.wearespaces.com/wp-content/uploads/2019/03/kloud-keppel-bay-tower-boardroom-event-venue-1050x700.jpeg',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        room_name: 'PARK',
        max_occupancy: 16,
        opening_time: '08:00:00',
        closing_time: '19:00:00',
        thumbnail: 'https://blog.wearespaces.com/wp-content/uploads/2019/03/the-working-capitol-on-keong-saik-the-workshop-event-venue-1.jpeg',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        room_name: 'HALO',
        max_occupancy: 25,
        opening_time: '08:00:00',
        closing_time: '19:00:00',
        thumbnail: 'https://blog.wearespaces.com/wp-content/uploads/2019/03/Screenshot-2019-03-26-at-5.17.01-PM.png',
        created_at: new Date(),
        updated_at: new Date(),
      },

    );

    try {
      const result = await queryInterface.bulkInsert('rooms', roomsList);
      console.log(result);
    } catch (error) {
      console.log(error);
    }

    /*= =============================================
    BOOKINGS TABLE
    ============================================== */

    const bookingsList = [];
    for (let i = 1; i < 20; i += 1) {
      const currDate1 = getRandomDateInRange(new Date(2021, 2, 1), new Date(2021, 8, 1));
      const currDate2 = getRandomDateInRange(new Date(2021, 2, 1), new Date(2021, 8, 1));

      bookingsList.push(
        {
          user_id: getRandomNumInRange(1, 10),
          room_id: getRandomNumInRange(1, 3),
          booking_date: currDate1,
          start_time: new Date(currDate1.setHours(9, 0, 0)),
          end_time: new Date(currDate1.setHours(10, 0, 0)),
          agenda: 'Team huddle',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: getRandomNumInRange(1, 10),
          room_id: getRandomNumInRange(1, 3),
          booking_date: currDate2,
          start_time: new Date(currDate2.setHours(14, 30, 0)),
          end_time: new Date(currDate2.setHours(15, 30, 0)),
          agenda: 'Sales pitch',
          created_at: new Date(),
          updated_at: new Date(),
        },
      );
    }

    try {
      const result = await queryInterface.bulkInsert('bookings', bookingsList);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
