require('dotenv').config({path: __dirname + '/.env'})
const { Client } = require('pg')
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
})

const express = require('express')
var path = require('path');
const app = express()
const port = 5502

const bodyParser = require("body-parser");
const router = express.Router();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// index.htmlを返す処理
router.get('/',(req,res) => {
  res.sendFile(path.join(__dirname+'/index.html'));
});
router.get('/game',(req,res) => {
  res.sendFile(path.join(__dirname+'/game.html'));
});
router.get('/score',(req,res) => {
  res.sendFile(path.join(__dirname+'/score.html'));
});

// データ挿入
app.post('/post_score', async (req, res) => {
  try {
    const users = await client.query(
      `SELECT username, score FROM account`
    )
    // 同じユーザーがいるか
    const isSameUser = users.rows.some(row => {
      return row.username === req.body.name
    })
    if(!isSameUser){
      await client.query(
        `INSERT INTO account (username, score, created_on, last_login) VALUES ( '${req.body.name}', ${req.body.score}, current_timestamp, current_timestamp)`
      )
    }else{
      await client.query(
        `UPDATE account SET "score"=${req.body.score}, "last_login"=current_timestamp WHERE "username"='${req.body.name}'`
      )
    }
  } catch (err) {
    console.error(err)
  }
  res.send("Received POST Data!");
})

// データ呼び出し
app.get('/get_score', async (req, res) => {
  const data = await client.query(
    `SELECT username, score FROM account ORDER BY score DESC LIMIT 5`
  )
  res.send(data); 
})


app.use(express.static('public'))
app.use('/', router);
app.use('/game.html', router);
app.use('/score.html', router);

app.listen(port)



