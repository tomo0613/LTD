#!/bin/bash

trap "kill 0" EXIT

echo "tsc: Starting compilation in watch mode"
npm run compile > /dev/null &
npm run devServer
wait
