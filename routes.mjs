import { resolve } from 'path';
import db from './models/index.mjs';

import initRoomsController from './controllers/rooms.mjs';
import initUsersController from './controllers/users.mjs';
import initBookingsController from './controllers/users.mjs';

export default function routes(app) {
  const UsersController = initUsersController(db);
  // app.post('/orders', OrdersController.create);
  // app.get('/orders', OrdersController.index);

  const RoomsController = initRoomsController(db);
  app.get('/rooms', RoomsController.index);

  const BookingsController = initBookingsController(db);
  // app.get('/rooms', RoomsController.index);

  // special JS page. Include the webpack index.html file
  app.get('/home', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
}
