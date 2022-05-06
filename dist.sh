#!/bin/bash
mkdir dist
cp app.js index.html style.css dist

mkdir dist/img
cp -r img/jpg img/png dist/img

mkdir dist/data
cp data/data.json dist/data
