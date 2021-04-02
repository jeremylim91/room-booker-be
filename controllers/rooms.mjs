export default function initRoomsController(db) {
  // display all the rooms for user to see
  const index = async (req, res) => {
    try {
      const rooms = await db.Room.findAll();
      res.send(rooms);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
  };
}
