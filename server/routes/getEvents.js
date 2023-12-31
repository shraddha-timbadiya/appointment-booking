const router = require("express").Router();
const db = require("../db");
const staticConfig = require("../staticConfig");
const moment = require("moment-timezone");
moment.tz.setDefault(staticConfig.timezone);

router.route("/").post((req, res) => {
  const {startDate,endDate} = req.body
  reqStart = new Date(moment(startDate).hour(0).minute(0).second(0));
  reqEnd = new Date(moment(endDate).hour(23).minute(59).second(59));

  // reqStart = moment(req.body.reqStart)
  //   .set({ hour: 0, minute: 0, second: 0 })
  //   // .tz(staticConfig.timezone)
  //   .toDate();
  // reqEnd = moment(req.body.reqEnd)
  //   .set({ hour: 23, minute: 59, second: 59 })
  //   // .tz(staticConfig.timezone)
  //   .toDate();
  console.log(reqStart);
  console.log(reqEnd);
  let eventsList = [];
  db.collection("test")
    .where("dateTime", ">", reqStart)
    .where("dateTime", "<", reqEnd)
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        eventsList.push(doc.data());
      });
      eventsList.map((event) => {
        event.dateTime = event.dateTime.toDate();
        event.dateTime = moment
          .tz(event.dateTime, staticConfig.timezone)
          .format();
      });
      res.json(eventsList);
    });
});

module.exports = router;
