const fs = require('fs');
const csv = require('csv-parser');

function extraRunsConcededPerTeamInYear(matchesCsvPath, deliveriesCsvPath, year, outputPath) {
    let matchesInYear2016 = {};
    let extraRunsPerTeam = {};

    
    fs.createReadStream(matchesCsvPath)
        .pipe(csv())
        .on('data', (row) => {
            const matchId = row.id;
            const matchSeason = row.season;
            if (matchSeason === year) {
                matchesInYear2016[matchId] = true;
            }
        })
        .on('end', () => {
            fs.createReadStream(deliveriesCsvPath)
                .pipe(csv())
                .on('data', (row) => {
                    const matchId = row.match_id;
                    const bowlingTeam = row.bowling_team;
                    const extraRuns = parseInt(row.extra_runs);

                  
                    if (matchesInYear2016[matchId]) {
                        if (!extraRunsPerTeam[bowlingTeam]) {
                            extraRunsPerTeam[bowlingTeam] = 0;
                        }
                        extraRunsPerTeam[bowlingTeam] += extraRuns;
                    }
                })
                .on('end', () => {
                   
                    fs.writeFileSync(outputPath, JSON.stringify(extraRunsPerTeam, null, 2));
                    console.log('Result written to', outputPath);
                });
        });
}


extraRunsConcededPerTeamInYear('../data/matches.csv', '../data/deliveries.csv', '2016', '../public/output/extraRunConcededPerTeam.json');
