# GT7 Sport Mode Leaderboard Scraper - CSV Data Saving and Graphing Scripts

This repository contains scripts to retrieve top 100 statistics from sport mode competitions. This can be sorted by region and car class. 

## Saved data:
```
rank
totalPoints
userID
nickname
onlineID
countryCode
driverRating
sportmanshipRating
class
manufacturer
round_n (points scored in individual races, where n is the race number)
```

## Quick Start (CSV Data Saving)

1. Clone this repository `git clone https://github.com/macmanley/gt7-leaderboards.git`
2. Run scripts with node.js. Pass in the parameters `ID`, `CarClass` and `Region (optional)`. 
3. The scripts shall now save a CSV with data pertaining to the top 100 drivers of your chosen event, region and car class.

Example: `node ongoingSportLeaderboard.js 1 2` 

Example: `node pastSportLeaderboard.js 727 1 CH`

Example: `node rawSportLeaderboard.js 727 1 IE`

> Note: for ongoingsportleaderboard.js, the ID parameter is not the seasonID, but it is the position at which the event is displayed on the sport page, so the event in 2nd position in the sport events list has an ID of 2.

## Quick Start (Graphing Scripts)

1. Clone this repository `git clone https://github.com/macmanley/gt7-leaderboards.git`
2. Run scripts with node.js. Pass in the parameters `ID`, `CarClass` and `Region (optional)`. 
3. The scripts shall now save a PNG of a graph comparing data between drivers. 
4. 

Example: `node chartManufacturers.js 1 2`

## Credits:
Credit to [ddm999](https://github.com/ddm999/gt7info) for manufacturer IDs


