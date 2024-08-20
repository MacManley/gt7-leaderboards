// File: rawsportleaderboard.js

const fs = require('fs');
const { parse } = require('json2csv');

const fetchDataAndSaveToCsv = async (result, CarClass, ID) => {
    try {
      const currentRoundId = result.current_round_id;
      const fields = [
        'rank', 'totalPoints', 'userID', 'nickname', 'onlineID', 
        'countryCode', 'driverRatingID', 'sportmanshipRatingID', 'classID', 'manufacturerID',
        ...Array.from({ length: currentRoundId }, (_, i) => `round_${i + 1}`)
      ];
  
      const transformedData = result.users.map(user => {
        const roundPoints = user.points.reduce((object, point, index) => {
          object[`round_${index + 1}`] = point.valid ? point.value : 0;
          return object;

        }, {});
  
        return {
          rank: user.rank,
          totalPoints: user.total_point,
          userID: user.user.user_id,
          nickname: user.user.nick_name,
          onlineID: user.user.np_online_id,
          countryCode: user.user.country_code,
          driverRatingID: user.user.driver_rating,
          sportmanshipRatingID: user.user.sportsmanship_rating,
          classID: CarClass,
          manufacturerID: user.user.manufacturer_id,
          ...roundPoints
        };
      });
      const csv = parse(transformedData, { fields });
  
      // Save CSV
      fs.writeFileSync(`rawdrivers${ID}.csv`, csv);
      console.log('CSV file has been saved.');
    } catch (error) {
      console.error('Error fetching data or saving to CSV:', error);
    }
  };

const checkDrivers = async (seasonId, CarClass, Region) => {
  let checkDriversUrl;
  
  if (Region != 'undefined') {
    checkDriversUrl = `https://static.gt7.game.gran-turismo.com/championship/user_ranking/${seasonId}/${CarClass}/0/${Region}/w0.json`;
  } else {
    checkDriversUrl = `https://static.gt7.game.gran-turismo.com/championship/user_ranking/${seasonId}/${CarClass}/w0.json`;
  }
  
  try {
    const response = await fetch(checkDriversUrl);
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      if (data.result.users) {
        await fetchDataAndSaveToCsv(data.result, CarClass, seasonId);
      }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
};

const inputSeasonID = process.argv[2];
const inputCarClass = process.argv[3];
const inputRegion = process.argv[4];

const seasonID = Number(inputSeasonID)
const CarClass = Number(inputCarClass);
const Region = String(inputRegion);

if (!seasonID) {
  console.log('Invalid season ID. Please enter a valid number.');
  process.exit(1); 
} else if (!CarClass) {
  console.log('Invalid car class. Please enter a valid number.');
} else {
  checkDrivers(seasonID, CarClass, Region);
}
