const { Pool, Client } = require('pg')
const pool = new Pool({
  user: 'fmmrwrckibcckt',
  host: 'ec2-3-234-85-177.compute-1.amazonaws.com',
  database: 'dbv99d6ao84r1h',
  password: '8acbd1259ab012e375a68cb8cb56b58ded91c472ac3c4e809191eb4c02c06b3a',
  port: 5432,
})




const express = require('express')
var path = require('path');
const app = express()
const port = 3000
app.get('/', (req, res) => {
  const sql = `CREATE TABLE accounts (
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