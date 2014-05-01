var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('my-application');
var _ = require("lodash");
var moment = require('moment');
var timeout = require('request-timeout');
var NodeCache = require( "node-cache" );

// config settings for the minisite
var challengesEndpoint = process.env.CHALLENGES_ENDPOINT ||  "http://api.topcoder.com/v2/develop/challenges?pageSize=10";
var leaderboardEndpoint = process.env.LEADERBOARD_ENDPOINT || "http://tc-leaderboard.herokuapp.com/demo";
// filters the list of challenges to display by this regex -- currently returns all
var regex = process.env.CHALLENGE_REGEX || "";
// cache tc api calls
var apiCache = new NodeCache( { stdTTL: 100, checkperiod: process.env.CACHE_EXPIRY || 120 } ); // expires in seconds

var port = process.env.PORT || 3000; 
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', port);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// fetches a list of challenges as json and exposes it to the ejs
var challenges = function(req, res, next) {
  // check for timeouts
  timeout(req, res, 10)
  // if request times out, return empty array
  req.on('timeout', function() {
    console.log('****** Challenge request timed out ******');
    req.challenges = [];
    return next();
  })  

  // if we find the value in the cache, return it
  apiCache.get( "challenges", function( err, value ){

    // return the challenges from the cache
    if( !err && !_.isEmpty(value)){
      req.challenges = value.challenges;
      // make sure we gracefully handle an errors
      if(typeof req.challenges == 'undefined') req.challenges = [];
      console.log('=== Returning challenges from cache');
      return next();
    // call the api
    } else {
      console.log('=== Fetching challenges from API');
      http.get(challengesEndpoint, function(res){
          var data = '';
          res.on('data', function (chunk){
              data += chunk;
          });
          res.on('end',function(){
              var challenges = JSON.parse(data).data;
              // remove the challenges that don't match the regex
              var challengeNameRegex = new RegExp(regex);
              _.remove(challenges, function(c) { return challengeNameRegex.exec(c.challengeName) == null; });
              req.challenges = challenges;
              // cache the results
              apiCache.set( "challenges", challenges);
              return next();
          })
      })   

    }
  });      
}

// fetches a leaderboard as json and exposes it to the ejs
var leaderboard = function(req, res, next) {
  http.get(leaderboardEndpoint, function(res){
      var data = '';
      res.on('data', function (chunk){
          data += chunk;
      });
      res.on('end',function(){
          var leaderboard = JSON.parse(data);
          req.leaderboard = leaderboard;
          return next();
      })
  })
}

app.get('/', challenges, leaderboard, function(req, res){
  res.render('index', { 
    challenges: req.challenges,
    leaderboard: req.leaderboard
  });
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// add a function that can be exposed in the ejs file
app.locals({
  ordinal  : function(rank) {
    var s=["th","st","nd","rd"]
    var v=rank%100;
    return rank+(s[(v-20)%10]||s[v]||s[0]);
  }
});

// add a function that can be exposed in the ejs file
app.locals({
  formatTime  : function(s) {
    return moment.utc(s).format('MMMM Do YYYY, h:mm:ss a');
  }
});

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
