var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');
var xml2js = require('xml2js')
var $ = require('jquery')
// var fs
//eval(require('fs').readFileSync('./xml.js', 'utf8'));
//var xml = require('./parseme.xml')
//var xml = require('./xml')
// import xml from './parseme.xml'
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'DELETE');
  next();
});


app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/search', (req, res)=>{
  console.log('expect req.body to equal obj with property searchQuery and url',req.body)
  console.log('expect req.body.searchQuery to equal url',req.body.searchQuery)
  var searchQuery = 'https://itunes.apple.com/search?term=the+tim+ferris+show'//pass in searchQuery

  request(searchQuery, function (error, response, body) {//call the iTunes API
  if (error){
    console.log('hit error in first searchQuery when calling iTunes API',error)
  }
  console.log('expect body to be jsonObject from iTunes API',JSON.stringify(typeof body))

  var turnStringToObject = JSON.parse(body)
  console.log('expect turnStringToObject to be an object',turnStringToObject)

    var feedUrl = turnStringToObject.results[0].feedUrl//get feedUrl, go get XML file
    console.log('expect feedUrl to equal link to XML file',feedUrl)

    request(feedUrl, function(error, response, body){
    if (error){
      console.log('hit error in second searchQuery when fetching XML file',error)
    }
    console.log('expect body to be XML file',body)

    var returnedXMLFile = body//returnedXMLfile
    console.log('expect returnedXMLFile to be XML file',returnedXMLFile)

    var parser = new xml2js.Parser();
    parser.parseString(returnedXMLFile, function (err, result) {//pass it intoParseString
    console.log('expect result to be parsedXML file as JSON',result)
          res.send(result.rss.channel[0].item[1])
        });
      })
  })
})

app.listen(3000, ()=>{
  console.log('legion of doom')
})
