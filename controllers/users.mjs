// const hasher = require('../utils/passwordRelatedFns.js');
import { getHashedString, convertUserIdToHash } from '../utils/passwordRelatedFns.mjs';

// const domainOption = { domain: 'http://localhost:3000' };

export default function initUsersController(db) {
  const signIn = async (req, res) => {
    const { emailInput, passwordInput } = req.body;

    // hash the user-entered password so tt it can be compared against what we have in the db
    const hashedPassword = getHashedString(passwordInput);
    try {
      const userInstance = await db.User.findOne({
        where: {
          email: emailInput,
          password: hashedPassword,
          isDeleted: false,
        },
      });
      if (!userInstance) {
        res.send({ auth: false });
        return;
      }

      res.cookie('loggedInEmail', userInstance.email);
      res.cookie('loggedInUserId', userInstance.id);
      res.cookie('loggedInHash', convertUserIdToHash(userInstance.id));
      res.cookie('isAdmin', userInstance.dataValues.isAdmin);
      res.send({ auth: true, user: userInstance });
    } catch (err) {
      console.log(err);
    }
  };

  const signOut = async (req, res) => {
    res.clearCookie('loggedInHash');
    res.clearCookie('loggedInUserId');
    res.clearCookie('loggedInEmail');
    res.clearCookie('isAdmin');
    res.send({ message: 'signed out' });
  };

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
    signIn,
    signOut,
    index,
    deleteUser,
    createUser,
  };
}
