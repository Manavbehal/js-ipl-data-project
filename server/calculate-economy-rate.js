const fs = require('fs');
const csv = require('csv-parser');

function calculateEconomyRate(deliveriesCsvPath, outputPath) {
    let bowlerStats = {};

  
    fs.createReadStream(deliveriesCsvPath)
        .pipe(csv())
        .on('data', (row) => {
            const bowler = row.bowler;
            const totalRuns = parseInt(row.total_runs);
            const isWideBall = row.wide_runs !== '0';
            const isNoBall = row.noball_runs !== '0';
            
           
            if (!isWideBall && !isNoBall) {
                if (!bowlerStats[bowler]) {
                    bowlerStats[bowler] = { runs: 0, balls: 0 };
                }
                bowlerStats[bowler].runs += totalRuns;
                bowlerStats[bowler].balls++;
            }
        })
        .on('end', () => {
          
            for (const bowler in bowlerStats) {
                const { runs, balls } = bowlerStats[bowler];
                bowlerStats[bowler].economyRate = (runs / balls) * 6;
            }

           
            const topBowlers = Object.entries(bowlerStats)
                .sort(([, a], [, b]) => a.economyRate - b.economyRate)
                .slice(0, 10)
                .reduce((obj, [key, value]) => {
                    obj[key] = value;
                    return obj;
                }, {});

          
            fs.writeFileSync(outputPath, JSON.stringify(topBowlers, null, 2));
            console.log('Result written to', outputPath);
        });
}


calculateEconomyRate('../data/deliveries.csv', '../public/output/calculateEconomicalBowler.json');
