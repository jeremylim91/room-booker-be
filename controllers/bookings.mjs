export default function initBookingsController(db) {
  // display all the bookings related to a specific room
  const index = async (req, res) => {
    try {
      const bookings = await db.Booking.findAll();
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
    console.log('loggedInUserId is:');
    console.log(loggedInUserId);
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

    console.log('attendees is:');
    console.log(attendees);
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
    console.log('bookingId is:');
    console.log(bookingId);

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
    const { bookingId } = req.body;
    console.log('bookingId is:');
    console.log(bookingId);

    try {
      // get the instance of this booking
      const bookingInstance = await db.Booking.update(
        { isDeleted: true },
        {
          where:
          { bookingId },
        },
      );

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
  };
}
