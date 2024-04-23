const fs = require('fs');
const csv = require('csv-parser');

function matchesWonPerTeamPerYear(matchesCsvPath) {
    let matchesWonPerYearPerTeamData= {};

    fs.createReadStream(matchesCsvPath)
        .pipe(csv())
        .on('data', (row) => {
            const season = row.season;
            const winner = row.winner;
            
            if (winner) {
                if (!matchesWonPerYearPerTeamData[season]) {
                    matchesWonPerYearPerTeamData[season] = {};
                }
                
                if (matchesWonPerYearPerTeamData[season][winner]) {
                    matchesWonPerYearPerTeamData[season][winner]++;
                } else {
                    matchesWonPerYearPerTeamData[season][winner] = 1;
                }
            }
        })
        .on('end', () => {
           
            fs.writeFileSync('../public/output/matchesWonPerTeamPerYear.json', JSON.stringify(matchesWonPerYearPerTeamData, null, 2));
            console.log('Number of matches won per team per year:', matchesWonPerYearPerTeamData);
        });
}


matchesWonPerTeamPerYear('../data/matches.csv');
