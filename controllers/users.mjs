export default function initUsersController(db) {
  const index = async (req, res) => {
    try {
      const allUsers = await db.User.findAll({
        where: {
          is_deleted: false,
        },
        attributes: ['id', 'username'],
      });
      res.send(allUsers);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteUser = async (req, res) => {
    try {
      const userInstance = await db.User.findByPk(req.body.userId);
      userInstance.isDeleted = true;
      await userInstance.save();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
    deleteUser,
  };
}
