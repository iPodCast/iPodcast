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
  // var searchQuery = 'https://itunes.apple.com/search?term=the+tim+ferris+show'//pass in searchQuery
  var targetObj = {
    'artworkUrl60':'artworkUrl60',
    'artistName':'artistName',
    'collectionName':'collectionName',
    'episodes':[]
  }
  var episodeList = {
    'title':'title',
    'description':'description',
    'enclosure':'enclosure[0].$'
  }

  var searchQuery = 'https://itunes.apple.com/search?term=npr'

  request(searchQuery, function (error, response, body) {//call the iTunes API
  if (error){
  console.log('hit error in first searchQuery when calling iTunes API',error)
  }
  console.log('expect body to be jsonObject from iTunes API',JSON.stringify(typeof body))

  var turnStringToObject = JSON.parse(body)
  console.log('expect turnStringToObject to be an object',turnStringToObject)

    var feedUrl = turnStringToObject.results[0].feedUrl//get feedUrl, go get XML file
    console.log('expect feedUrl to equal link to XML file',feedUrl)

    targetObj['artworkUrl60']=turnStringToObject.results[0].artworkUrl60
    targetObj['artistName']=turnStringToObject.results[0].artistName
    targetObj['collectionName']=turnStringToObject.results[0].collectionName

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
          // res.send(JSON.stringify(result.rss.channel[0].item.length))//returns 208
          // res.send(result.rss.channel[0].item[0].enclosure[0].$.url)//fiile path to each unique audio file and corresponding url.
          // targetObj['episodes']=result.rss.channel[0].item
          for(var i=0;i<result.rss.channel[0].item.length;i++){
            // console.log('i ran! expect title to be and episodeList to be: ',result.rss.channel[0].item[i].title[0],episodeList)
            episodeList['title']=result.rss.channel[0].item[i].title[0]
            // console.log('i ran! expect title to be and episodeList to be: ',result.rss.channel[0].item[i].title[0],episodeList)

            // console.log('i ran! expect descript to be: ',result.rss.channel[0].item[i].description[0],episodeList)
            episodeList['description']=result.rss.channel[0].item[i].description[0]
            // console.log('i ran! expect descript to be: ',result.rss.channel[0].item[i].description[0],episodeList)

            // console.log('BEFORE i ran! expect enclosure to be: ',result.rss.channel[0].item[i].enclosure[0].$,episodeList)
            episodeList['enclosure']=result.rss.channel[0].item[i].enclosure[0].$
            // console.log('AFTER i ran! expect enclosure to be: ',result.rss.channel[0].item[i].enclosure[0].$,episodeList)

            console.log('BEFORE expect complete episodeList',episodeList)
            console.log('BEFORE expect complete targetObj',targetObj)
            targetObj['episodes'].push(episodeList)
            console.log('AFTER expect complete targetObj',targetObj)
          }

          // res.send(result.rss.channel[0].item[0].enclosure[0].$)
          res.send(JSON.stringify(targetObj))
        });
      })
  })
})

app.listen(3000, ()=>{
  console.log('legion of doom')
})
