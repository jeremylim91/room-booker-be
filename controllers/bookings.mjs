export default function initBookingsController(db) {
  console.log('inside initBookingsController');

  // display all the bookings related to a specific room
  const index = async (req, res) => {
    const { roomId } = req.params;
    try {
      const bookings = await db.Booking.findAll();
      res.send(bookings);
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
        userId: 1, /* Update this after login implemented */
        roomId,
        startTime,
        endTime,
        agenda,
      });
      console.log('newBookingInstance is:');
      console.log(newBookingInstance);
      attendees.forEach((attendee) => {
        // db.User.addMeetings([newBookingInstance, attendee.id]);
        newBookingInstance.addUser(attendee.id);
      });
    } catch (error) {
      console.log(error);
    }
    res.send();
  };
  return {
    index,
    add,
  };
}
