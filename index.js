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
const port = 5501

const bodyParser = require("body-parser");
const router = express.Router();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// index.htmlを返す処理
router.get('/',(req,res) => {
  res.sendFile(path.join(__dirname+'/index.html'));
});

// データ挿入
app.post('/post_score', async (req, res) => {
  try {
    const data = await pool.query(
      `INSERT INTO account (username, score, created_on, last_login) VALUES ( '${req.body.name}', ${req.body.score}, current_timestamp, current_timestamp)`
    )
    console.log('入ったなかみ', data)
  } catch (err) {
    console.error(err)
  } finally {
    console.log('post_score done!')
  }
})

// データ呼び出し
app.get('/get_score', async () => {
  try {
    const data = await pool.query(
      `SELECT username, score FROM account ORDER BY score DESC LIMIT 5`
    )
    console.log('そーとでーた', data.rows)
  } catch(err) {
    console.error(err)
  }
})


app.use(express.static('public'))
app.use('/', router);

app.listen(port)



