const fs = require('fs');
const csv = require('csv-parser');

function calculateStrikeRate(deliveriesCsvPath) {
    let batsmanStats = {};

   
    fs.createReadStream(deliveriesCsvPath)
        .pipe(csv())
        .on('data', (row) => {
            const batsman = row.batsman;
            const runs = parseInt(row.total_runs);
            const isWideBall = row.wide_runs !== '0';
            const isNoBall = row.noball_runs !== '0';
            
           
            if (!isWideBall && !isNoBall) {
                if (!batsmanStats[batsman]) {
                    batsmanStats[batsman] = { runs: 0, balls: 0 };
                }
                batsmanStats[batsman].runs += runs;
                batsmanStats[batsman].balls++;
            }
        })
        .on('end', () => {
            const strikeRateBySeason = {};

            
            for (const batsman in batsmanStats) {
                const { runs, balls } = batsmanStats[batsman];
                const strikeRate = (runs / balls) * 100;
               
                const season = "Season";

                if (!strikeRateBySeason[season]) {
                    strikeRateBySeason[season] = {};
                }

                strikeRateBySeason[season][batsman] = strikeRate;
            }

            fs.writeFileSync('../public/output/strikeRateBySeason.json', JSON.stringify(strikeRateBySeason, null, 2));
            console.log('Result written to output/strikeRateBySeason.json');
        });
}


calculateStrikeRate('../data/deliveries.csv');
