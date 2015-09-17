#!/bin/bash

#
# Running the Node.js server.
#
pm2 start server.js 'dev' --no-daemon
