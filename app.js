var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('my-application');
var _ = require("lodash");
var request = require('request');
var moment = require('moment');
var RSS = require('rss');
var url = require('url') ;

// config settings for the minisite
var challengesEndpoint = process.env.CHALLENGES_ENDPOINT ||  "http://tc-search.herokuapp.com/challenges/search?q=challengeName:IDOL";
var leaderboardEndpoint = process.env.LEADERBOARD_ENDPOINT || "http://tc-leaderboard.herokuapp.com/demo";
var communityName = process.env.COMMUNITY_NAME || "Community Template";

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
  request(challengesEndpoint, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      req.challenges = JSON.parse(body);
    } else {
      req.challenges = [];
    }
    return next();
  });
}

// fetches a leaderboard as json and exposes it to the ejs
var leaderboard = function(req, res, next) {
  request(leaderboardEndpoint, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      req.leaderboard = JSON.parse(body);
    } else {
      req.leaderboard = [];
    }
    return next();
  });
}

app.get('/', challenges, leaderboard, function(req, res){
  res.render('index', { 
    challenges: req.challenges,
    leaderboard: req.leaderboard
  });
});

app.get('/challenges/rss', challenges, leaderboard, function(req, res){

  var feed = new RSS({
      title: communityName + ' Community Challenges',
      description: 'Open challenges for the ' + communityName + ' community.',
      feed_url: 'http://' + req.headers.host + '/challenges/rss',
      site_url: 'http://' + req.headers.host,
      image_url: 'http://www.topcoder.com/i/logo.png',
      author: '[topcoder]',
      copyright: '2014 Appirio',
      ttl: '60'
  });

  var challenges = [];
  request(challengesEndpoint, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      challenges = JSON.parse(body);
      _(challenges).forEach(function(c) { 

        feed.item({
            title:  c._source.challengeName,
            description: communityName + ' community '+c._type+' challenge: ' + c._source.challengeName,
            url:  "http://www.topcoder.com/challenge-details/"+c._source.challengeId+"?type="+c._type,
            date: c._source.postingDate
        });         

      });
    }
    res.set('Content-Type', 'text/xml');
    res.send(feed.xml());
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
