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
const port = 3000
app.get('/', (req, res) => {
  const sql = `CREATE TABLE testtable (
    user_id serial PRIMARY KEY,
    username VARCHAR ( 50 ) UNIQUE NOT NULL,
    password VARCHAR ( 50 ) NOT NULL,
    email VARCHAR ( 255 ) UNIQUE NOT NULL,
    created_on TIMESTAMP NOT NULL,
    last_login TIMESTAMP 
    );`
    const result = pool.query(sql, (err, res) => {
      console.log(err, res)
      pool.end()
    })
    console.log(result)
    res.send('Hello World!')
})
app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})