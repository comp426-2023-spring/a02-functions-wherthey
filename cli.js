#!/usr/bin/env node

import minimist from 'minimist'
import moment from 'moment-timezone'
import fetch from 'node-fetch'

let latitude
let longitude
const args = minimist(process.argv.slice(2))

if (args.h) {
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`)
    process.exit(0);
}

function coordinatesValidate(coordinate) {
    if(isNaN(parseFloat(coordinate))){
        process.exit(0)
    }
    return coordinate
}


if (args.n) {
	latitude = coordinatesValidate(args.n)
} else if (args.s) {
	latitude = -coordinatesValidate(args.s)
}


if (!latitude) {
	console.log("Latitude must be in range")
	process.exit(0)
}


if (args.e) {
    longitude = coordinatesValidate(args.e)
} else if (args.w) {
    longitude = -coordinatesValidate(args.w)
}


if (!longitude) {
	console.log("Longitude must be in range")
	process.exit(0);
}

var timezone = moment.tz.guess()
if (args.z) {
	timezone = args.z;
} else {
	timezone = timezone;
}

var url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=precipitation_hours&timezone=${timezone}&current_weather=true`
var response = await fetch(url);
const data = await response.json();


const days = args.d 

if (days == 0) {
  console.log("today.")
} else if (days > 1) {
  console.log("in " + days + " days.")
} else {
  console.log("tomorrow.")
}

if (args.j) {
    console.log(data);
    process.exit(0);
}