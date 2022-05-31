import express, { json } from 'express';
const app = express();
app.use(express.json());
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cors from 'cors';
app.use(cors());
const PORT = process.env.PORT || 5000
import pool from './db.js';
import bcrypt, { compareSync } from 'bcrypt';

dotenv.config();

app.get('/', async (req, res) => {
  try {
    const users = await pool.query('SELECT * FROM users');
    res.json({ users: users.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
app.get('/api/GeneralEquipmentQuery', async (req, res) => {
  try {
    const equips = await pool.query('SELECT barcode_id, serial_number, equipment_type, category, project, equipment_status, equipment_group, borrower, equipment_location FROM equipments');
    res.json({ equips: equips.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
app.get('/api/GeneralEquipmentQueryBasic', async (req, res) => {
  try {
    const equips = await pool.query("SELECT equipment_type, category, equipment_location FROM equipments;");
    res.json({ equips: equips.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
app.get('/api/UserEquipQuery/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const equips = await pool.query(`SELECT intial_date, end_date, borrower, equipment_barcode, equipment_type, event_status FROM history WHERE borrower='${email}'`);
    res.json({ equips: equips.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
app.get('/api/GeneralEquipmentQueryBasicUser', async (req, res) => {
  try {
    const equips = await pool.query('SELECT barcode_id, serial_number, equipment_type, category, equipment_status, equipment_location FROM equipments');
    res.json({ equips: equips.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})
app.get('/api/AvailableEquipmentQuery', async (req, res) => {
  try {
    const equips = await pool.query('SELECT barcode_id, equipment_type, equipment_location, category FROM equipments WHERE equipment_status = ' + "'" + 'available'
      + "'" + ";");
    res.json({ equips: equips.rows });
  } catch (error) {
    console.log((error))
    res.status(500).json({ error: error.message });
  }
})

app.get('/api/RequestsQuery', async (req, res) => {
  try {
    const equips = await pool.query('SELECT intial_date, borrower, equipment_barcode, equipment_type FROM history WHERE event_status =' + "'requested';");
    res.json({ equips: equips.rows });

  } catch (error) {
    console.log((error))
    res.status(500).json({ error: error.message });
  }
})

app.get('/api/CheckInQuery', async (req, res) => {
  try {
    const equips = await pool.query('SELECT intial_date, end_date ,borrower, equipment_barcode, equipment_type, event_status FROM history WHERE event_status =' + "'checked out' Or event_status = 'Overdue';");
    res.json({ equips: equips.rows });

  } catch (error) {
    console.log((error))
    res.status(500).json({ error: error.message });
  }
})

app.get('/api/CheckedOutQuery', async (req, res) => {
  try {
    const equips = await pool.query('SELECT intial_date, borrower, equipment_barcode, equipment_type FROM history WHERE event_status =' + "'requested';");
    res.json({ equips: equips.rows });

  } catch (error) {
    console.log((error))
    res.status(500).json({ error: error.message });
  }
})

app.post('/api/RequestedEquipmentQuery', async (req, res) => {
  try {
    var email = req.body.email.toString();
    console.log(email)
    const equips = await pool.query('SELECT barcode_id, equipment_type, equipment_location, category FROM equipments WHERE requestedBy = ' + "'" + email + "'" + ";");
    res.json({ equips: equips.rows });
  } catch (error) {
    console.log((error))
    res.status(500).json({ error: error.message });
  }
})

app.get('/api/GeneralEquipmentQuery/:barcode_id', async (req, res) => {
  try {
    var bID = req.params.barcode_id;
    console.log(bID);
    const equips = await pool.query('SELECT * FROM equipments WHERE barcode_id = $1', [bID]);
    res.json({ equips: equips.rows });
  }
  catch (error) {
    res.end(error);
  }
});//

app.get('/api/GeneralUsersQuery', async (req, res) => {
  try {
    const equips = await pool.query('SELECT user_name, user_email, user_status FROM users');
    res.json({ equips: equips.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})


app.get('/api/GeneralUsersQuery/:user_id', async (req, res) => {
  try {
    var eID = req.params.user_id;
    console.log("getUsersQuery backend user_id");
    console.log(eID);
    const equips = await pool.query(`SELECT * FROM users WHERE user_id = '${eID}'`);
    res.json({ equips: equips.rows });

  }
  catch (error) {
    res.end(error);
  }
});

app.post("/api/DeleteEquip", async (req, res) => {

  var ID = req.body.BarcodeID;
  try {

    const deletedItem = await pool.query(`DELETE
                                          FROM equipments
                                          WHERE barcode_id = '${ID}'`);
    res.send("Deleted");
  }
  catch (err) {
    const deleteHistory = await pool.query(`DELETE
    FROM History
    WHERE equipment_barcode = '${ID}'`);
    const deletedItem = await pool.query(`DELETE
    FROM equipments
    WHERE barcode_id = '${ID}'`);
  }
})


app.post("/api/checkIn", async (req, res) => {

  var ID = req.body.BarcodeID;
  try {

    const deletedItem = await pool.query(`DELETE
                                          FROM History
                                          WHERE equipment_barcode = '${ID}'`);

    const changeEquipmentStatus = await pool.query('UPDATE equipments SET equipment_status = ' + "'available', project=''" + ', requestedBy ='
      + "'" + "'" + ", borrower = 'noborrower@email.com'" + ' where barcode_id =' + "'" + ID + "'" + ';')
    res.send("Checked In");
  }
  catch (err) {
    console.log(err)
  }
})


app.post("/api/updateUser", async (req, res) => {
  try {
    var oldData = req.body;
    var u_id = oldData.user_id;
    if (u_id == null) {
      res.send("none")
    }
    var u_email = oldData.email;
    var u_name = oldData.username;
    var u_pass = null;
    if (oldData.password) {
      u_pass = await bcrypt.hash(oldData.password, 10);
    }

    var u_status = oldData.status;

    var update = `UPDATE users SET `;
    var ucode = ` user_name='${u_name}'`;
    var pwcode = ` user_password='${u_pass}'`;
    var stscode = ` user_status='${u_status}'`;
    var wcode = ` WHERE user_email='${u_email}'`;
    var first = true;

    if (u_name) {
      if (first) {
        update = update + ucode;
        first = false;
      }
      else {
        update = update + ',' + ucode;
      }

    }
    if (u_pass) {
      if (first) {
        update = update + pwcode;
        first = false;
      }
      else {
        update = update + ',' + pwcode;
      }
    }
    if (u_status) {
      if (first) {
        update = update + stscode;
        first = false;
      }
      else {
        update = update + ',' + stscode;
      }
    }

    var finalUpdate = update + wcode;
    console.log(finalUpdate);
    const Eupdate = await pool.query(finalUpdate);
    res.json(Eupdate.rows[0]);

  }
  catch (err) {
    res.send("error")
  }

})

app.post("/api/updateEquip", async (req, res) => {
  try {

    //var eq_ser_num = oldData.serial_number;
    var oldData = req.body;
    var id = oldData.q;
    console.log(id)
    var eq_type = oldData.equipment_type;
    var eq_group = oldData.equipment_group;
    var eq_status = oldData.equipment_status;
    var eq_cat = oldData.category;
    var eq_proj = oldData.project;
    var eq_loc = oldData.location;

    //Trying to only change the
    //if (old_eq_ID && eq_ID && eq_group && eq_status && eq_cat && eq_proj && eq_loc && serial_number ) {

    var update = `UPDATE equipments SET `;
    var tcode = ` equipment_type='${eq_type}'`;
    var ccode = ` category='${eq_cat}'`;
    var pcode = ` project='${eq_proj}'`;
    var stcode = `equipment_status='${eq_status}'`;
    var gcode = ` equipment_group='${eq_group}'`;
    var lcode = ` equipment_location='${eq_loc}'`;
    var wcode = ` WHERE barcode_id='${id}'`;
    var first = true;
    if (eq_type) {
      if (first) {
        update = update + tcode;
        first = false;
      }
      else {
        update = update + "," + tcode;
      }

    }
    if (eq_cat) {
      if (first) {
        update = update + ccode;
        first = false;
      }
      else {
        update = update + "," + ccode;
      }
    }
    if (eq_proj) {
      if (first) {
        update = update + pcode;
        first = false;
      }
      else {
        update = update + "," + pcode;
      }
    }
    if (eq_status) {
      if (first) {
        update = update + stcode;
        first = false;
      }
      else {
        update = update + "," + stcode;
      }
    }
    if (eq_group) {
      if (first) {
        update = update + gcode;
        first = false;
      }
      else {
        update = update + "," + gcode;
      }
    }
    if (eq_loc) {
      if (first) {
        update = update + lcode;
        first = false;
      }
      else {
        update = update + "," + lcode;
      }
    }

    var finalUpdate = update + wcode;

    const Eupdate = await pool.query(finalUpdate);
    res.json(Eupdate.rows[0]);


  } catch (error) {
    res.send("error")
  }
})

app.post("/api/addEquipment", async (req, res) => {
  try {
    const { barcode_id, serial_number, equipment_type, category, project, equipment_status, equipment_group, location } = req.body;
    if ((barcode_id || serial_number || equipment_type || category || project || equipment_status || equipment_group || location) == "") {
      console.log("empty field(s)");
      res.end("Fill out all fields");
    }
    console.log('INSERT INTO equipments(barcode_id, serial_number, equipment_type, category, project, equipment_status, equipment_group, borrower, equipment_location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [barcode_id, serial_number, equipment_type, category, project, equipment_status, equipment_group, "noborrower@email.com", location]);

    const newEquipment = await pool.query('INSERT INTO equipments(barcode_id, serial_number, equipment_type, category, project, equipment_status, equipment_group, borrower, equipment_location, requestedBy) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [barcode_id, serial_number, equipment_type, category, project, equipment_status, equipment_group, "noborrower@email.com", location, " "]);
    res.json(newEquipment.rows[0]);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
})

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}


app.post("/api/RequestEquip", async (req, res) => {
  var user_email1 = req.body.email;
  var equipment_barcode = req.body.barcode_id;
  var row = await pool.query('SELECT equipment_type FROM equipments WHERE barcode_id = ' + "'" + equipment_barcode + "'" + ";");
  var equipment_type = row.rows[0].equipment_type;
  var date = (new Date().toLocaleDateString("en-US")) + ', ' + formatAMPM(new Date());
  await pool.query(
    'INSERT INTO History(intial_date, end_date, event_status, borrower, equipment_barcode, equipment_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [date, 'pending', 'requested', user_email1, equipment_barcode, equipment_type]);
  await pool.query('UPDATE equipments SET equipment_status = ' + "'requested'" + ', requestedBy =' + "'" + user_email1 + "'" + ' where barcode_id =' + "'" + equipment_barcode + "'" + ';')
  res.send("requested");



})
app.post("/api/AcceptRequestEquip", async (req, res) => {
  try {
    var user_email1 = req.body.email;
    var equipment_barcode = req.body.barcode_id;
    var intial_date = req.body.initial_date;
    var end_date = req.body.end_date;
    var equipment_Group = req.body.equipmentGroup;
    console.log(user_email1);
    var end_date_compare = req.body.end_date_compare;

    var row = await pool.query('SELECT requestedBy FROM equipments WHERE barcode_id = ' + "'" + equipment_barcode + "'" + ";");
    var user_email = row.rows[0].requestedby;
    const changeEquipmentStatus = await pool.query("UPDATE equipments SET equipment_status = 'checked out', borrower = " + "'" + user_email + "'" + ", project = " + "'" + equipment_Group + "'" + ", requestedBy =' ' " + ' where barcode_id =' + "'" + equipment_barcode + "'" + ';');
    const changeHistory = await pool.query('UPDATE History SET intial_date = ' + "'" + intial_date + "'" + ", end_date = " + "'" + end_date + "'" + ", event_status = 'checked out'" + ', borrower =' + "'" + user_email + "'" + ", end_date_compare_with_present = " + "'" + end_date_compare + "'" + ' where equipment_barcode =' + "'" + equipment_barcode + "'" + ';');

    res.send("requested");
  } catch (error) {
    console.log(error)

  }

})


app.post("/api/CancelRequestEquip", async (req, res) => {
  try {
    var equipment_barcode = req.body.barcode_id;
    var email = req.body.email
    var row = await pool.query('SELECT requestedBy FROM equipments WHERE barcode_id = ' + "'" + equipment_barcode + "'" + ";");
    const DeleteHistory = await pool.query("Delete From History Where borrower = '" + email + "' AND  " + "equipment_barcode =" + "'" + equipment_barcode + "';");

    const changeEquipmentStatus = await pool.query('UPDATE equipments SET equipment_status = ' + "'available'" + ', requestedBy =' + "'" + "'" + "Where RequestedBy = '" + email + "' AND  " + "barcode_id =" + "'" + equipment_barcode + "';")
    res.send("CanceledRequeste");

  } catch (error) {
    console.log(error)

  }
})

app.post("/api/CancelRequestEquipPro", async (req, res) => {
  try {
    var equipment_barcode = req.body.barcode_id;
    const DeleteHistory = await pool.query('Delete From History Where equipment_barcode =' + "'" + equipment_barcode + "';");
    const changeEquipmentStatus = await pool.query('UPDATE equipments SET equipment_status = ' + "'available'" + ', requestedBy =' + "'" + "'" + ' where barcode_id =' + "'" + equipment_barcode + "'" + ';')
    res.send("CanceledRequeste");
  } catch (error) {
    console.log(error)
  }
})



let refreshTokens = [] //has the refresh tokens
app.post("/api/refresh", (req, res) => {
  //take the refresh token from user
  const refreshToken = req.body.token

  //send error if there is no token or its invalid

  if (!refreshToken) return res.status(401).json("you are not authenticated!")
  if (!refreshTokens.includes(refreshToken)) {
    console.log(refreshTokens[0]);
    return res.status(403).json("refresh token is not valid!");
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
    error && console.log(error);

    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    //if everything ok create new access token, refresh and send to user

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateAccessToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken, refreshToken: newRefreshToken,
    })
  })

})

const generateAccessToken = (user) => {
  console.log(user.user_email)
  return jwt.sign({ id: user.user_id, status: user.user_status, email: user.user_email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "5s" }
  );
}

const generateRefereshToken = (user) => {
  return jwt.sign({ id: user.user_id, status: user.user_status },
    process.env.REFRESH_TOKEN_SECRET,
  );
}

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const users = await pool.query('SELECT * FROM users WHERE user_email = $1', [email]);
  if (users.rows.length === 0) return res.status(401).json({ error: "Email is incorrect." });
  const validPassword = await bcrypt.compare(password, users.rows[0].user_password);
  if (!validPassword) return res.status(401).json({ error: "Incorrect password." });
  console.log(users.rows[0])
  const accessToken = generateAccessToken(users.rows[0]);
  const refreshToken = generateRefereshToken(users.rows[0]);
  refreshTokens.push(refreshToken)

  res.json({
    username: users.rows[0].user_name,
    status: users.rows[0].user_status,
    userid: users.rows[0].user_id,
    accessToken,
    refreshToken,

  });
})




app.post('/api/signup', async (req, res) => {
  if (req.body.name == "" || req.body.email == "" || req.body.status == "") {
    res.end("Fill out all fields.");
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await pool.query('INSERT INTO users (user_name, user_email, user_password, user_status) VALUES($1, $2, $3, $4) RETURNING *',
      [req.body.name, req.body.email, hashedPassword, req.body.status]); //b means basic user, e equipment manager, a administator
    //passes back the request newUser and we send it back in json
    res.json({ users: newUser.rows[0] })
  } catch (error) {

    res.status(500).json({ error: error.message });
  }
})

app.post('/api/checkForOverdueEquipment', async (req, res) => {
  const currentDate = req.body.current_date;
  //const row = await pool.query('SELECT * FROM history');
  try {
    var now = new Date();
    var day = now.getDate().toString();

    if (day.length == 1) {
      day = '0' + day;
    }
    var mounth = now.getMonth() + 1;

    if (mounth.toString().length == 1) {
      mounth = '0' + mounth;
    }

    var hour = now.getUTCHours() - 7;
    if (hour.toString().length == 1) {
      hour = '0' + hour;
    }
    var minutes = now.getMinutes();
    if (minutes.toString().length == 1) {
      minutes = '0' + minutes;
    }

    var current = now.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles"
    })

    const updateDate = await pool.query(`UPDATE history * SET present_date='${current}'`);
    const currentDateQuery = await pool.query(`SELECT present_date FROM history`);
    const endDateQuery = await pool.query(`SELECT end_date FROM history`);

    for (var i = 0; i < currentDateQuery.rowCount; i++) {

      console.log(i);
      var DateTimeCurrent = currentDateQuery.rows[i]
      DateTimeCurrent = JSON.stringify(DateTimeCurrent).split(',')
      var DateCurrent = DateTimeCurrent[0];
      var dateCurrentParsed = JSON.stringify(DateCurrent).split('"');
      var theCurrentDate = dateCurrentParsed[4] || '';
      var theCurrentDateSplit = theCurrentDate.split('/');
      var monthCurrent = parseInt(theCurrentDateSplit[0]);
      var dayCurrent = parseInt(theCurrentDateSplit[1]);
      var yearCurrent = parseInt(theCurrentDateSplit[2]);
      console.log("current date:" + monthCurrent + dayCurrent + yearCurrent);

      var DateTimeEnd = endDateQuery.rows[i] || '';
      DateTimeEnd = JSON.stringify(DateTimeEnd).split(',');
      var DateEnd = DateTimeEnd[0] || '';
      var TimeEnd = DateTimeEnd[1] || ''; // 1:31:00 AM"}
      var TimeEndParsed = JSON.stringify(TimeEnd).split('"');
      var thisTimeEndParsed = TimeEndParsed[1];
      var trimmedTimeEndParsed = thisTimeEndParsed.substring(1, thisTimeEndParsed.length - 1);
      var TimeCurrent = DateTimeCurrent[1];
      var TimeCurrentParsed = JSON.stringify(TimeCurrent).split('"');
      var thisTimeCurrentParsed = TimeCurrentParsed[1];
      var trimmedTimeCurrentParsed = thisTimeCurrentParsed.substring(1, thisTimeCurrentParsed.length - 1);
      var dateEndParsed = JSON.stringify(DateEnd).split('"');
      var theEndDate = dateEndParsed[4];
      var theEndDateSplit = theEndDate.split('/');
      var monthEnd = theEndDateSplit[1];
      var dayEnd = theEndDateSplit[0];
      var yearEnd = theEndDateSplit[2];
      console.log("end date: " + monthEnd + dayEnd + yearEnd);
      var thisEndDate = dayEnd + '/' + monthEnd + '/' + yearEnd;
      var thisCurrentDate = monthCurrent + '/' + dayCurrent + '/' + yearCurrent;
      var timeAMEnd = trimmedTimeEndParsed.split(' ');
      var endTime = timeAMEnd[0];
      var endAMPM = timeAMEnd[1];
      var hourMinSecEnd = endTime.split(':');
      var hourEnd = hourMinSecEnd[0];
      var timeOfDayEnd = 0;
      if (timeAMEnd[1] == 'PM') {
        console.log("AM/PM: " + endAMPM);
        if (hourEnd == 12) {
          hourEnd = 0;
        }
        timeOfDayEnd = 1;
      }
      console.log("hourEnd: " + hourEnd);
      var minEnd = hourMinSecEnd[1];
      console.log("minEnd: " + minEnd);
      var secEnd = hourMinSecEnd[2];
      console.log("secEnd: " + secEnd);

      var timeAMCurrent = trimmedTimeCurrentParsed.split(' ');
      var CurrentTime = timeAMCurrent[0];
      var CurrentAMPM = timeAMCurrent[1];
      var hourMinSecCurrent = CurrentTime.split(':');
      var hourCurrent = hourMinSecCurrent[0];
      var timeOfDayCurrent = 0;
      if (timeAMCurrent[1] == 'PM') {
        console.log("AM/PM: " + CurrentAMPM);
        timeOfDayCurrent = 1;
        if (hourCurrent == 12) {
          hourCurrent = 0;
        }
      }
      console.log("hourCurrent: " + hourCurrent);
      var minCurrent = hourMinSecCurrent[1];
      console.log("minCurrent: " + minCurrent);
      var secCurrent = hourMinSecCurrent[2];
      console.log("secCurrent: " + secCurrent);
      thisEndDate = thisEndDate + ', ' + trimmedTimeEndParsed;
      thisCurrentDate = thisCurrentDate + ', ' + trimmedTimeCurrentParsed;
      console.log("the current_date: " + thisCurrentDate);
      console.log("the end_date: " + thisEndDate);

      if (parseInt(yearCurrent) > parseInt(yearEnd)) {
        const overDue = await pool.query(`UPDATE history SET event_status= 'Overdue' WHERE (end_date='${thisEndDate}' AND event_status='checked out')`);
        console.log("year bigger");
      } else if (parseInt(monthCurrent) > parseInt(monthEnd) && parseInt(yearCurrent) == parseInt(yearEnd)) {
        const overDue = await pool.query(`UPDATE history SET event_status= 'Overdue' WHERE (end_date='${thisEndDate}' AND event_status='checked out')`);
        console.log("month bigger");
      } else if (parseInt(dayCurrent) > parseInt(dayEnd) && parseInt(monthCurrent) == parseInt(monthEnd) && parseInt(yearCurrent) == parseInt(yearEnd)) {
        const overDue = await pool.query(`UPDATE history SET event_status= 'Overdue' WHERE (end_date='${thisEndDate}' AND event_status='checked out')`);
        console.log("day bigger/equal to: " + thisEndDate);
      }
      else if (timeOfDayCurrent > timeOfDayEnd && parseInt(dayCurrent) > parseInt(dayEnd) && parseInt(monthCurrent) == parseInt(monthEnd) && parseInt(yearCurrent) == parseInt(yearEnd)) {
        const overDue = await pool.query(`UPDATE history SET event_status= 'Overdue' WHERE (end_date='${thisEndDate}' AND event_status='checked out')`);
        console.log("AM/PM bigger/equal to: " + thisEndDate);
      }
      else if (hourCurrent > hourEnd && timeOfDayCurrent == timeOfDayEnd && parseInt(dayCurrent) == parseInt(dayEnd) && parseInt(monthCurrent) == parseInt(monthEnd) && parseInt(yearCurrent) == parseInt(yearEnd)) {
        const overDue = await pool.query(`UPDATE history SET event_status= 'Overdue' WHERE (end_date='${thisEndDate}' AND event_status='checked out')`);
        console.log("hour bigger/equal to: " + thisEndDate);
      }
      else if (parseInt(minCurrent) > parseInt(minEnd) && hourCurrent == hourEnd && timeOfDayCurrent == timeOfDayEnd && parseInt(dayCurrent) == parseInt(dayEnd) && parseInt(monthCurrent) == parseInt(monthEnd) && parseInt(yearCurrent) == parseInt(yearEnd)) {
        const overDue = await pool.query(`UPDATE history SET event_status= 'Overdue' WHERE (end_date='${thisEndDate}' AND event_status='checked out')`);
        console.log("minute bigger/equal to: " + thisEndDate);
      }
      else if (parseInt(secCurrent) >= parseInt(secEnd) && parseInt(minCurrent) == parseInt(minEnd) && hourCurrent == hourEnd && timeOfDayCurrent == timeOfDayEnd && parseInt(dayCurrent) == parseInt(dayEnd) && parseInt(monthCurrent) == parseInt(monthEnd) && parseInt(yearCurrent) == parseInt(yearEnd)) {
        const overDue = await pool.query(`UPDATE history SET event_status= 'Overdue' WHERE (end_date='${thisEndDate}' AND event_status='checked out')`);
        console.log("second bigger/equal to: " + thisEndDate);
      } else {
        console.log("else...");
      }
    }
    //const overDue = await pool.query("UPDATE history SET event_status= 'Overdue' WHERE (('" + current + "' > end_date) AND event_status='checked out')");
    //console.log("rows that were overdue: " + overDue.rowCount);
    //console.log("current date: " + updateDate.rowCount);
  } catch (err) {
    console.log(err);
  }
  res.json(1);
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
