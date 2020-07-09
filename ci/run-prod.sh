#!/bin/bash
yarn install
yarn run build
exec npm run prod
