export default function initRoomsController(db) {
  // display all the rooms for user to see
  const index = async (request, response) => {
    try {
      const rooms = await db.Room.findAll();
      response.send({ rooms });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
  };
}
