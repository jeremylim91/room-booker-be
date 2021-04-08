export default function initBookingsController(db) {
  // display all the bookings related to a specific room
  const index = async (req, res) => {
    try {
      const bookings = await db.Booking.findAll({ where: { isDeleted: false } });
      res.send(bookings);
    } catch (error) {
      console.log(error);
    }
  };
  const bookingsByRoomId = async (req, res) => {
    try {
      const bookings = await db.Booking.findAll(
        {
          where: {
            roomId: req.params.roomId,
            isDeleted: false,
          },
        },
      );
      res.send(bookings);
    } catch (error) {
      console.log(error);
    }
  };

  const bookingsByUserId = async (req, res) => {
    const { loggedInUserId } = req.cookies;
    try {
      const userTaggedMeetings = await db.Booking.findAll(
        {
          where: {
            userId: loggedInUserId,
            isDeleted: false,
          },
        },
      );

      // get the user instance bsed on user's id in cookies
      const userInstance = await db.User.findByPk(req.cookies.loggedInUserId);
      const userBookedMeetings = await userInstance.getMeeting({ where: { isDeleted: false } });

      const userMtgs = { userBookedMeetings, userTaggedMeetings };
      res.send(userMtgs);
    } catch (error) {
      console.log(error);
    }
  };
  const add = async (req, res) => {
    const {
      roomId, startTime, endTime, agenda, attendees,
    } = req.body.meetingDetails;

    try {
      const newBookingInstance = await db.Booking.create({
        userId: req.cookies.loggedInUserId,
        roomId,
        startTime,
        endTime,
        agenda,
      });
      attendees.forEach((attendee) => {
        // db.User.addMeetings([newBookingInstance, attendee.id]);
        newBookingInstance.addAttendee(attendee.id);
      });
    } catch (error) {
      console.log(error);
    }
    res.send();
  };
  const getMtgAttendees = async (req, res) => {
    const { bookingId } = req.params;

    try {
      // get the instance of this booking
      const bookingInstance = await db.Booking.findByPk(parseInt(bookingId, 10));

      // query through table to find all attendees
      const mtgAttendees = await bookingInstance.getAttendee({ where: { isDeleted: false } });

      res.send(mtgAttendees);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteABooking = async (req, res) => {
  //  do a check to see if user is an admin, or is the ownwer of this booking

    const { bookingId } = req.body;

    // get the userId from cookies
    let { loggedInUserId } = req.cookies;
    loggedInUserId = parseInt(loggedInUserId, 10);

    try {
      // get a user instanced based on the userId
      const userInstance = await db.User.findByPk(loggedInUserId);

      // get a booking using the bookingId
      const bookingInstance = await db.Booking.findByPk(bookingId);

      // if user is not an admin and is not the room booker, don't let him cancel the booking
      if (userInstance.isAdmin === false && bookingInstance.userId !== loggedInUserId) {
        res.send('disallow');
        return;
      }
      // edit the col to show it is deleted
      bookingInstance.isDeleted = true;
      // save changes to the db
      await bookingInstance.save();
      res.send();
    } catch (error) {
      console.log(error);
    }
  };
  const updateBooking = async (req, res) => {
  //  do a check to see if user is an admin, or is the ownwer of this booking

    const { bookingId, agendaInputField: updatedAgenda, tagsProp: updatedAttendees } = req.body;
    // get the userId from cookies
    let { loggedInUserId } = req.cookies;
    loggedInUserId = parseInt(loggedInUserId, 10);

    try {
      // get a user instanced based on the userId
      const userInstance = await db.User.findByPk(loggedInUserId);

      // get a booking using the bookingId
      const bookingInstance = await db.Booking.findByPk(bookingId);

      // if user is not an admin and is not the room booker, don't let him cancel the booking
      if (userInstance.isAdmin === false && bookingInstance.userId !== loggedInUserId) {
        res.send('disallow');
        return;
      }
      // update the bookings table that the agenda has changed
      bookingInstance.agenda = updatedAgenda;
      await bookingInstance.save();

      // update the thru table to remove attendees
      bookingInstance.removeAttendee();

      updatedAttendees.forEach((attendee) => {
        bookingInstance.addAttendee(attendee.id);
      });

      // save changes to the db
      await bookingInstance.save();

      res.send();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
    add,
    bookingsByUserId,
    bookingsByRoomId,
    getMtgAttendees,
    deleteABooking,
    updateBooking,
  };
}
