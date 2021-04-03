const hasher = require('../utils/passwordRelatedFns.js');

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
      const userInstance = await db.User.findByPk(req.params.userId);
      userInstance.isDeleted = true;
      await userInstance.save();
      res.send();
    } catch (error) {
      console.log(error);
    }
  };
  const addUser = async (req, res) => {
    const {
      email, username, password, isAdmin,
    } = req.body.newUserDetails;
    try {
      const userInstance = await db.User.create({
        email,
        username,
        password: hasher.getHashedString(password || 'password1'),
        isAdmin,
      });
      userInstance.isDeleted = true;
      await userInstance.save();
      res.send();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
    deleteUser,
    addUser,
  };
}
