// File: ongoingsportleaderboard.js

const fs = require('fs');
const { parse } = require('json2csv');

const fetchChampionshipsData = async (ID, CarClass, Region) => {
  const checkAvailableChampionshipsUrl = 'https://static.gt7.game.gran-turismo.com/championship/seasons/2/active.json';

  try {
    const response = await fetch(checkAvailableChampionshipsUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();

    if (data.result[ID]) {
      const seasonId = data.result[ID].season_id;
      console.log('The season_id for your selection is:', seasonId);

      checkDrivers(seasonId, CarClass, Region);
    } else {
      console.log('No season found for the entered number.');
    }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
};

const fetchDataAndSaveToCsv = async (result, CarClass, ID) => {
    try {
      const currentRoundId = result.current_round_id;
      const fields = [
        'rank', 'totalPoints', 'userID', 'nickname', 'onlineID', 
        'countryCode', 'driverRating', 'sportmanshipRating', 'class', 'manufacturer',
        ...Array.from({ length: currentRoundId }, (_, i) => `round_${i + 1}`)
      ];
  
      const maps = {
        sportsmanship: { 1: 'E', 2: 'D', 3: 'C', 4: 'B', 5: 'A', 6: 'S' },
        driver: { 1: 'E', 2: 'D', 3: 'C', 4: 'B', 5: 'A', 6: 'A+', 7: 'S' },
        class: {1: 'GT1', 2: 'GT2', 3: 'GT3' },
        manufacturer: { 3: 'Alfa Romeo',
          4: 'Aston Martin',
          5: 'Audi',
          6: 'BMW',
          7: 'Chevrolet',
          9: 'Citroen',
          10: 'Daihatsu',
          11: 'Dodge',
          12: 'Fiat',
          13: 'Ford',
          15: 'Honda',
          16: 'Hyundai',
          17: 'Jaguar',
          18: 'Lancia',
          21: 'Mazda',
          22: 'Mercedes-Benz',
          25: 'Mitsubishi',
          28: 'Nissan',
          30: 'Pagani',
          32: 'Peugeot',
          33: 'Gran Turismo',
          34: 'Renault',
          35: 'RUF',
          36: 'Shelby',
          38: 'Subaru',
          39: 'Suzuki',
          43: 'Toyota',
          44: 'TVR',
          46: 'Volkswagen',
          49: 'Infiniti',
          50: 'Lexus',
          51: 'MINI',
          52: 'Pontiac',
          55: 'Plymouth',
          57: 'Autobianchi',
          59: 'Amuse',
          65: 'DMC',
          69: 'Volvo',
          80: 'Caterham',
          86: 'Alpine',
          87: 'RE Amemiya',
          93: 'Chaparral',
          110: 'Ferrari',
          112: 'Lamborghini',
          113: 'Bugatti',
          114: 'Renault Sport',
          116: 'Maserati',
          117: 'McLaren',
          119: 'Tesla',
          121: 'KTM',
          125: 'Abarth',
          127: 'SRT',
          134: 'Zagato',
          135: 'Italdesign',
          136: 'Porsche',
          138: 'Fittipaldi Motors',
          139: 'GT Awards (SEMA)',
          140: 'De Tomaso',
          141: 'Radical',
          143: 'Super Formula (Dallara)',
          144: 'BAC',
          145: 'Willys',
          146: 'Jeep',
          147: 'Chris Holstrom Concepts',
          148: 'Eckert\'s Rod & Custom',
          149: 'Greddy',
          150: 'Wicked Fabrication',
          151: 'Roadster Shop',
          152: 'Genesis',
          153: 'AMG',
          154: 'DS AUTOMOBILES',
          155: 'NISMO',
          156: 'Greening Auto Company',
          157: 'Garage RCR',
          158: 'BVLGARI',
          159: 'Skoda',
          160: 'AFEELA'}
      };
  
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
          driverRating: maps.driver[user.user.driver_rating] || 'Unknown',
          sportmanshipRating: maps.sportsmanship[user.user.sportsmanship_rating] || 'Unknown',
          class: maps.class[CarClass] || 'Unknown',
          manufacturer: maps.manufacturer[user.user.manufacturer_id] || 'Unknown',
          ...roundPoints
        };
      });
      const csv = parse(transformedData, { fields });
  
      // Save CSV
      fs.writeFileSync(`drivers${ID}.csv`, csv);
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

const inputID = process.argv[2];
const inputCarClass = process.argv[3];
const inputRegion = process.argv[4];

const ID = Number(inputID);
const CarClass = Number(inputCarClass);
const Region = String(inputRegion);

if (!ID) {
  console.log('Invalid season ID. Please enter a valid number.');
  process.exit(1); 
} else if (!CarClass) {
  console.log('Invalid car class. Please enter a valid number.');
} else {
  fetchChampionshipsData(ID, CarClass, Region);
}
