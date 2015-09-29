#!/bin/bash

#
# Setup app.
#
npm install -g pm2
npm install

#
# Create SQLite table.
#
node app/setup.js
