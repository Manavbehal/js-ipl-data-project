const fs = require('fs');
const csv = require('csv-parser');

function findTopPlayerOfTheMatch(matchesCsvPath) {
    let potmAwardsPerSeason = {};


    fs.createReadStream(matchesCsvPath)
        .pipe(csv())
        .on('data', (row) => {
            const season = row.season;
            const potmPlayer = row.player_of_match;

            if (!potmAwardsPerSeason[season]) {
                potmAwardsPerSeason[season] = {};
            }

            if (!potmAwardsPerSeason[season][potmPlayer]) {
                potmAwardsPerSeason[season][potmPlayer] = 0;
            }

            potmAwardsPerSeason[season][potmPlayer]++;
        })
        .on('end', () => {
            const topPOTMPlayersBySeason = {};

            for (const season in potmAwardsPerSeason) {
                const potmPlayers = potmAwardsPerSeason[season];
                const maxAwards = Math.max(...Object.values(potmPlayers));
                const topPlayer = Object.keys(potmPlayers).find(player => potmPlayers[player] === maxAwards);
                topPOTMPlayersBySeason[season] = { player: topPlayer, awards: maxAwards };
            }

            fs.writeFileSync('../public/output/topPlayerOfTheMatch.json', JSON.stringify(topPOTMPlayersBySeason, null, 2));
            console.log('Result written to output');
        });
}
findTopPlayerOfTheMatch('../data/matches.csv');
