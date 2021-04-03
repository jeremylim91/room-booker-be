// const hasher = require('../utils/passwordRelatedFns.js');
import getHashedString from '../utils/passwordRelatedFns.mjs';

export default function initUsersController(db) {
  const index = async (req, res) => {
    try {
      const allUsers = await db.User.findAll({
        where: {
          isDeleted: false,
        },
        attributes: ['id', 'username'],
      });
      res.send(allUsers);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteUser = async (req, res) => {
    const { usersToDelete } = req.body;

    const listOfUserIdsToDelete = [];
    usersToDelete.forEach((elem) => listOfUserIdsToDelete.push(elem.id));

    try {
      const userInstance = await db.User.update(
        { isDeleted: true },
        {
          where:
          { id: listOfUserIdsToDelete },
        },
      );
      console.log(userInstance);
      res.send();
    } catch (error) {
      console.log(error);
    }
  };
  const createUser = async (req, res) => {
    const {
      email, username, password, isAdmin,
    } = req.body.localState;
    console.log(email);
    console.log(username);
    console.log(password);
    console.log(isAdmin);

    try {
      const userInstance = await db.User.create({
        email,
        username,
        password: getHashedString(password || 'password1'),
        isAdmin,
      });

      res.send();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
    deleteUser,
    createUser,
  };
}
