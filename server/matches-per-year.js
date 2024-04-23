const fs = require('fs');
const csv = require('csv-parser');

function matchesPerYear(matchesCsvPath) {
    let matchesPerYearData = {};

    fs.createReadStream(matchesCsvPath)
        .pipe(csv())
        .on('data', (row) => {
            const season = row.season;
            if (season in matchesPerYearData) {
                matchesPerYearData[season]++;
            } else {
                matchesPerYearData[season] = 1;
            }
        })
        .on('end', () => {
          
            fs.writeFileSync('../public/output/matchesPerYear.json', JSON.stringify(matchesPerYearData, null, 2));
            console.log('Number of matches played per year:', matchesPerYearData);
        });
}


matchesPerYear('../data/matches.csv');
