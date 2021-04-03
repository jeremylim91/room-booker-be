import { resolve } from 'path';
import db from './models/index.mjs';

import initRoomsController from './controllers/rooms.mjs';
import initUsersController from './controllers/users.mjs';
import initBookingsController from './controllers/bookings.mjs';

export default function routes(app) {
  const UsersController = initUsersController(db);
  app.get('/users/findAll', UsersController.index);
  app.put('/users/delete/:userId', UsersController.deleteUser);

  const RoomsController = initRoomsController(db);
  app.get('/rooms', RoomsController.index);

  const BookingsController = initBookingsController(db);
  app.get('/bookings/:roomId', BookingsController.index);
  app.post('/bookings', BookingsController.add);

  // special JS page. Include the webpack index.html file
  app.get('/home', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
}
