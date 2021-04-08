import { resolve } from 'path';
import db from './models/index.mjs';

import initRoomsController from './controllers/rooms.mjs';
import initUsersController from './controllers/users.mjs';
import initBookingsController from './controllers/bookings.mjs';
import { convertUserIdToHash } from './utils/passwordRelatedFns.mjs';

export default function bindRoutes(app) {
  // Middleware that checks if a user is authenticated
  app.use(async (req, res, next) => {
    req.middlewareLoggedIn = false;

    // check if loggedInUserId has been set as a cookie
    if (req.cookies.loggedInUserId) {
      // combine the loggedInUserId with a salt, then hash the string
      const hash = convertUserIdToHash(req.cookies.loggedInUserId);

      if (req.cookies.loggedInHash === hash) {
        const { loggedInUserId } = req.cookies;
        // Double check by finding this user in the database
        const chosenUser = await db.User.findByPk(loggedInUserId);
        if (!chosenUser) {
          res.status(503).send('Sorry an error has occurred');
        }
        req.middlewareLoggedIn = true;
        req.loggedInUserId = Number(req.cookies.loggedInUserId);
        req.loggedInEmail = chosenUser.email;
        // If hash is not valid, delete all cookies
      } else {
        res.clearCookie('loggedInHash', { secure: true, sameSite: 'None' });
        res.clearCookie('loggedInUserId', { secure: true, sameSite: 'None' });
        res.clearCookie('loggedInEmail', { secure: true, sameSite: 'None' });
      }
      next();
      return;
    }
    next();
  });

  // Check if user is logged in, else proceed
  const checkLoggedIn = async (req, res, next) => {
    if (req.middlewareLoggedIn === false) {
      res.status(503).send('You are not logged in');
      return;
    }
    next();
  };
  const UsersController = initUsersController(db);
  app.put('/signIn', UsersController.signIn);
  app.put('/signOut', UsersController.signOut);
  app.get('/users/findAll', checkLoggedIn, UsersController.index);
  app.put('/users/delete', checkLoggedIn, UsersController.deleteUser);
  app.post('/users/create', checkLoggedIn, UsersController.createUser);

  const RoomsController = initRoomsController(db);
  app.get('/rooms', RoomsController.index);

  const BookingsController = initBookingsController(db);
  app.get('/bookings/bookingsBasedOnRoomId/:roomId', checkLoggedIn, BookingsController.bookingsByRoomId);
  app.get('/bookings/all', checkLoggedIn, BookingsController.index);
  app.post('/bookings', checkLoggedIn, BookingsController.add);
  app.put('/bookings/deleteABooking', checkLoggedIn, BookingsController.deleteABooking);
  app.get('/bookings/bookingsByUserId', checkLoggedIn, BookingsController.bookingsByUserId);
  app.get('/bookings/mtgAttendees/:bookingId', checkLoggedIn, BookingsController.getMtgAttendees);
  app.put('/bookings/updateBooking', checkLoggedIn, BookingsController.updateBooking);

  // special JS page. Include the webpack index.html file
  app.get('/home', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
}
