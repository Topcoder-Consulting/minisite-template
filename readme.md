# Minisite Template

A single page node and ejs application that can be cloned to make a new community minisite. You can see a demo of the site at [http://minisite-template.herokuapp.com](http://minisite-template.herokuapp.com). The page displays a list of challenges from the search API plus a leaderboard for the community. Both are configurable.

The original HTML templates are included in case you need to use them.

## Setup

    git clone git@github.com:cloudspokes/minisite-template.git mynewminisite
    cd mynewminisite
    npm install
    node app.js
    // open http://localhost:3000

## Configuration

index.ejs - contains all of the code and text for the site. Feel free to change as needed. There is a section to display a list of challenge from the tc-search api and a leaderboard from the tc-leaderboard api.

app.js - the node application that runs the site. It has a couple of settings near the top that defines the URLs for the challenges search endpoint,  the leaderboard endpoint and the community display name.

# Challenges List

The endpoint for the tc-search api can either be set in app.js or as a heroku env variable. If no matching challenges are found, the page will display some text telling them to check back.

# Leaderboard

The endpoint for the leaderboard api can either be set in app.js or as a heroku env variable. [See the tc-leaderboard repo page](https://github.com/cloudspokes/tc-leaderboard) for more info. You'll want to create a new leaderboard for the new community before you get started. You can use the demo leaderbaord from tc-leaderbaord for testing if you'd like for testing. The instructions for creating a new leadboard are on the tc-leaderboard readme. It's simple.
