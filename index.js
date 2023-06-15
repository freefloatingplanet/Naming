const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser')
const fs = require('fs')
const readline = require('readline')
const conf = require('config')
const csv = require('csvtojson')

app.listen(conf.port, () => {
  console.log('Running at Port '+conf.port+'...');
});

// 静的ファイルのルーティング
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// 書き込み
app.get('/WeatherClock/CollectWeatherForecastData',(req,res) => {
  console.log(req.body);
});

// CSV取得
app.get('/Naming/SearchName',(req,res) => {
  console.log(req.query.keyword);
  let keyword = req.query.keyword;

  csv().fromFile(conf.naming).then((rows)=>{
    rows = rows.filter((row) => {
      let keys = Object.keys(row);
      for(let i = 0; i<keys.length; i++){
        if(row[keys[i]].indexOf(keyword) != -1){
          return row;
        }
      }
    })
    res.send(rows);
  }) 

});
