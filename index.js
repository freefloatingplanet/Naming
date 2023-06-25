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
  asyncfunc(keyword,res);
});

// csv読み込みが非同期なのでawaitを使うために非同期関数を定義する
const asyncfunc = async(keyword,res) => {
  let retJson = [];
  for(const csvType of conf.availableCsvType){
    await csv().fromFile(conf[csvType]).then((rows)=>{
      // 検索対象のキーを選出
      let keys = Object.keys(rows[0]).filter((key) => {
        if(conf.searchKeys.includes(key)){
          return key
        }
      });
      // 検索条件を含む行を抽出
      rows = rows.filter((row) => {
        //let keys = Object.keys(row);
        for(let key of keys){
          if(row[key].indexOf(keyword) != -1){
            return row["辞書種別"] = csvType;
          }          
        }
      })
      retJson = retJson.concat(rows);
    })
  }
  res.send(retJson);
}
