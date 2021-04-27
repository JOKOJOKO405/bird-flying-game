const { Pool, Client } = require('pg')
const pool = new Pool({
  user: 'jokojoko405',
  host: 'localhost',
  database: 'example-db',
  password: '',
  port: 5432,
})

const express = require('express')
var path = require('path');
const app = express()
const port = 5500

const bodyParser = require("body-parser");
const router = express.Router();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.get('/', (req, res) => {
//   const sql = `CREATE TABLE account (
//     user_id serial PRIMARY KEY,
//     username VARCHAR ( 50 ) UNIQUE NOT NULL,
//     score VARCHAR ( 50 ) NOT NULL,
//     created_on TIMESTAMP NOT NULL,
//     last_login TIMESTAMP 
//     );`
//     const result = pool.query(sql, (err, res) => {
//       console.log(err, res)
//       pool.end()
//     })
//     console.log(result)
//     res.send('Hello World!')
// })
// app.get('/game', (req, res) => {
//   res.sendFile(path.join(__dirname + '/index.html'));
// })
router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  console.debug(__dirname);
  //__dirname : It will resolve to your project folder.
});
app.post('/post_score', (req, res) => {
  pool.query(`INSERT INTO account (username, score, created_on, last_login) VALUES ( '${req.body.name}', ${req.body.score}, now(), now())`, (err, res) => {
    if(err) {
      return console.error(err.stack)
    }
    // console.log(req.body.name)
  })
})
app.use(express.static('public'))
app.use('/', router);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



