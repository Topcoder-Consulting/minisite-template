# Minisite Template

A single page node and ejs application that can be cloned to make a new community minisite. You can see a demo of the site at [http://minisite-template.herokuapp.com](http://minisite-template.herokuapp.com). The page displays a list of challenges from the tc api (filtered by a regex) plus a leaderboard for the community. Both are configurable. 

The original HTML templates are included in case you need to use them.

## Setup

    // clone the repo
    // switch to the repo
    npm install
    node app.js
    // open http://localhost:3000

## Configuration

index.ejs - contains all of the code and text for the site. Feel free to change as needed. There is a section to display a list of challenge from the tcapi and a leaderboard from the tc-leaderboard app.

app.js - the node application that runs the site. It has a couple of settings near the top that defines the URLs for the challenges endpoint and the leaderboard endpoint.

# Challenges List

The endpoint for the tc challenges api can either be set in app.js or as a heroku env variable. There is also regex expression setup to filter the list of challenges by challenge name. Again, this can either be set in app.js or as a heroku env variable. This allows you to, for instance, only show challenges with the name 'Docusign' or 'Asteroids' or 'idolondemand' in the table. If no matching challenges are found, the page will display some text telling them 

By default the results of the API call are cached for 2 minutes. I would recommend changing the cache setting to some more substantial like 30 or 60 minutes.

# Leaderboard

The endpoint for the leaderboard api can either be set in app.js or as a heroku env variable. You'll want to create a new leaderboard for the new community before you get started. You can use the demo leaderbaord from tc-leaderbaord for testing if you'd like for testing. The instructions for creating a new leadboard are on the tc-leaderboard readme. It's simple.