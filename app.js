const mysql = require('mysql');
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 5000

let replyUpcomingEventsArray = []
let replyTomorrowEventsArray = []
let replyTodayEventsArray = []
let replyUpcomingEventsObj = {}
let replyTomorrowEventsObj = {}
let replyTodayEventsObj = {}

  // First you need to create a connection to the db
  const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'secret',
    database: 'bario',
    multipleStatements: true
  });

  con.connect((err) => {
    if(err){
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');
  });

  con.query('SELECT * FROM events WHERE date > NOW() + 1 ORDER BY date DESC LIMIT 5; SELECT * FROM events WHERE date(date) = CURDATE() LIMIT 5; SELECT * FROM events WHERE date(date) = CURDATE() + 1', (err,rows) => {
    if(err) throw err;

    console.log('Data received from Db:\n');
    console.log(rows[0]);
    console.log(rows[1]);
    console.log(rows[2]);

    rows[0].forEach( (row) => {
      replyUpcomingEventsObj = {
        title: row.name,
        imageurl: '',
        subtitle: row.location,
        buttons: []
      };
      console.log(`${row.name} is in ${row.location}`);
      console.log(replyUpcomingEventsObj);
      replyUpcomingEventsArray.push( replyUpcomingEventsObj );
      console.log(replyUpcomingEventsArray);
      return replyUpcomingEventsArray;
    });

    rows[1].forEach( (todaysevent) => {
      replyTodayEventsObj = {
        title: todaysevent.name,
        imageurl: '',
        subtitle: todaysevent.location,
        buttons: []
      };
      console.log(`${todaysevent.name} is in ${todaysevent.location}`);
      console.log(replyTodayEventsObj);
      replyTodayEventsArray.push( replyTodayEventsObj );
      console.log(replyUpcomingEventsArray);
      return replyTodayEventsArray;
    })

    rows[2].forEach( (tomevents) => {
      replyTomorrowEventsObj = {
        title: tomevents.name,
        imageurl: '',
        subtitle: tomevents.location,
        buttons: []
      };
      console.log(`${tomevents.name} is in ${tomevents.location}`);
      console.log(replyTomorrowEventsObj);
      replyTomorrowEventsArray.push( replyTomorrowEventsObj );
      console.log(replyUpcomingEventsArray);
      return replyTomorrowEventsArray;
    })
    
    console.log(replyUpcomingEventsArray);
    console.log(replyTodayEventsArray);
    console.log(replyTomorrowEventsArray);
    return {replyUpcomingEventsArray, replyTodayEventsArray, replyTomorrowEventsArray};
  });
  console.log(replyUpcomingEventsArray);
  console.log(replyTodayEventsArray);
  console.log(replyTomorrowEventsArray);

  con.end((err) => {
    // The connection is terminated gracefully
    // Ensures all previously enqueued queries are still
    // before sending a COM_QUIT packet to the MySQL server.
  });

app.use(bodyParser.json())

app.post('/upcoming', (req, res) => {
  console.log(req.body)
  console.log(replyUpcomingEventsArray)

  res.send({
    replies: [{
      type: 'list',
      content: {
        elements: replyUpcomingEventsArray,
        buttons: []
      },
    }],
    conversation: {
      memory: { key: 'value' }
    }
  })
})

app.post('/today', (req, res) => {
  console.log(req.body)
  console.log(replyTodayEventsArray)

  res.send({
    replies: [{
      type: 'list',
      content: {
        elements: replyTodayEventsArray,
        buttons: []
      },
    }],
    conversation: {
      memory: { key: 'value' }
    }
  })
})

app.post('/tomorrow', (req, res) => {
  console.log(req.body)
  console.log(replyTomorrowEventsArray)

  res.send({
    replies: [{
      type: 'list',
      content: {
        elements: replyTomorrowEventsArray,
        buttons: []
      },
    }],
    conversation: {
      memory: { key: 'value' }
    }
  })
})

app.post('/errors', (req, res) => {
  console.log(req.body)
  res.send()
})

app.listen(port, () => {
  console.log('Server is running on port 5000')
})
