var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var request = require('request');
var fs = require('fs');
var xml2js = require('xml2js')
var $ = require('jquery')
var data = require('./db.js')
var _ = require('underscore')


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
  console.log('expect req.query to equal obj with property searchQuery', req.query.test)

  //url we will use for our GET request to the iTunesSearchAPI
  var searchQuery = req.query.test

  //call the iTunes API
  request(searchQuery, function (error, response, body) {
  if (error){
  console.log('hit error in first searchQuery when calling iTunes API',error)
  }

  //body returned from call to iTunesSearchAPI
  var iTunesSearchBody = JSON.parse(body)
  console.log('iTunesSearchBody.results',iTunesSearchBody.results)

  //filter only for podcasts found in body returned from call to iTunesSearchAPI
  var filterForPodcasts = _.filter(iTunesSearchBody.results, function(param){
    return param.kind==='podcast'
  })
  console.log('expect filterForPodcasts to be array',filterForPodcasts)

  if (filterForPodcasts.length===0){
    res.end('didnt work, try again.')
  } else {

    //this is the podcast object we want to build and return
    var podcast = {
      'artworkUrl60':'artworkUrl60',
      'artistName':'artistName',
      'collectionName':'collectionName',
      'episodes':[]
    }

    //populate podcast with properties from iTunesSearchAPI
    podcast.artworkUrl60 = filterForPodcasts[0].artworkUrl60
    podcast.artistName = filterForPodcasts[0].artistName
    podcast.collectionName = filterForPodcasts[0].collectionName

    //this is the url we use to fetch audio files for podcasts from iTunesSearchAPI
    var feedUrl = filterForPodcasts[0].feedUrl

    //get request with feedUrl to fetch episodes from podcast from iTunesSearchAPI
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

            podcast['episodes'].push(episodeList)
          }
          res.send(JSON.stringify(podcast))
        });
      })
    }
  })
})

app.get('/', function (req, res) {
  res.send('hola World')
})

app.listen(3000, function(){
  console.log('hola mundo.')
})
