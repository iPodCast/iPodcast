var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var request = require('request');
var fs = require('fs');
var xml2js = require('xml2js')
var $ = require('jquery')
var data = require('./db.js')


app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('./client'));//check if correct.

app.use(function(req,res,next){
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

app.get('/main', function(req,res){
  //expect to send all of the podcasts stored in db.js
  console.log('this is req.query',req.query)
  res.send(JSON.stringify(req.query))
})

app.post('/main', function(req,res){
  //saves new podcast

  console.log('this is req.body',req.body)
  res.send(JSON.stringify(data))
})

app.delete('/main', function(req,res){
  //deletes from db

  data.splice(req.body.index,1)
  res.send(JSON.stringify(data))
})

app.get('/search', (req, res)=>{
  console.log('expect req.body to equal obj with property searchQuery and url', req.query.test)

  //object we will build and return at end of this get request.
  var targetObj = {
    'artworkUrl60':'artworkUrl60',
    'artistName':'artistName',
    'collectionName':'collectionName',
    'episodes':[]
  }

  //input parameter in our GET request
  var searchQuery = req.query.test

  //call the iTunes API
  request(searchQuery, function (error, response, body) {
  if (error){
  console.log('hit error in first searchQuery when calling iTunes API',error)
  }

  //need to filter through this. return first that is a podcast?
  var turnStringToObject = JSON.parse(body)
  console.log('turnStringToObject.results',turnStringToObject.results)

  var targetPodcast={}

  //returns first podcast identified in result from iTunes API request
  var filteredForPodcasts = turnStringToObject.results
  for(var i=0;i<filteredForPodcasts.length;i++){
    if(filteredForPodcasts[i].kind==="podcast"){
      targetPodcast=filteredForPodcasts[i]
      break;
    }
  }

    //populate targetObj with information from iTunes and also get feedUrl, to go get XML file with all our target audio files.
    var feedUrl = targetPodcast.feedUrl
    targetObj['artworkUrl60']=targetPodcast.artworkUrl60
    targetObj['artistName']=targetPodcast.artistName
    targetObj['collectionName']=targetPodcast.collectionName

    //another Get request with feedUrl, link where all episodes are.
    request(feedUrl, function(error, response, body){
    if (error){
      console.log('hit error in second searchQuery when fetching XML file',error)
    }

    //returnedXMLfile
    var returnedXMLFile = body

    //parse XML file with this
    var parser = new xml2js.Parser();
    parser.parseString(returnedXMLFile, function (err, result) {//pass it intoParseString
          for(var i=0;i<result.rss.channel[0].item.length;i++){
            var episodeList = {
              'title':'title',
              'description':'description',
              'enclosure':'enclosure[0].$'
            }
            episodeList['title']=result.rss.channel[0].item[i].title[0]
            episodeList['description']=result.rss.channel[0].item[i].description[0]
            episodeList['enclosure']=result.rss.channel[0].item[i].enclosure[0].$

            targetObj['episodes'].push(episodeList)
          }
          res.send(JSON.stringify(targetObj))
        });
      })
  })
})

app.get('/', function (req, res) {
  res.send('hola World')
})

app.listen(3000, function(){
  console.log('hola mundo.')
})
