#!/bin/bash

PORT=4000

echo "Checking if port $PORT is in use..."

PIDS=$(lsof -ti tcp:$PORT)

if [ -n "$PIDS" ]; then
  echo "Killing process(es) on port $PORT: $PIDS"
  kill -9 $PIDS
else
  echo "Port $PORT is free"
fi

echo "Starting dev server..."
npx nodemon app.js

