# Minisite Template

A single page node and ejs application that can be cloned to make a new community minisite. You can see a demo of the site at [http://minisite-template.herokuapp.com](http://minisite-template.herokuapp.com).

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
