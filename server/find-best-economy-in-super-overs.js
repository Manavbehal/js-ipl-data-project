const fs = require('fs');
const csv = require('csv-parser');

function findBestEconomyInSuperOvers(deliveriesCsvPath) {
    let superOverDeliveries = {};
    let bowlerStats = {};

    
    fs.createReadStream(deliveriesCsvPath)
        .pipe(csv())
        .on('data', (row) => {
            const isSuperOver = row.is_super_over === '1';
            const bowler = row.bowler;
            const runs = parseInt(row.total_runs);
            const extras = parseInt(row.extra_runs);

            if (isSuperOver) {
                const deliveryKey = `${bowler}-${row.match_id}`;

                if (!superOverDeliveries[deliveryKey]) {
                    superOverDeliveries[deliveryKey] = { runs: 0, balls: 0 };
                }

                superOverDeliveries[deliveryKey].runs += (runs - extras); 
                superOverDeliveries[deliveryKey].balls++;
            }
        })
        .on('end', () => {
           
            for (const key in superOverDeliveries) {
                const { runs, balls } = superOverDeliveries[key];
                const [bowlerName, matchId] = key.split('-');

                if (!bowlerStats[bowlerName]) {
                    bowlerStats[bowlerName] = { economyRate: 0 };
                }

                const economyRate = (runs / balls) * 6;
                bowlerStats[bowlerName].economyRate = economyRate;
            }

           
            let bestBowler = '';
            let bestEconomyRate = Infinity;

            for (const bowler in bowlerStats) {
                if (bowlerStats[bowler].economyRate < bestEconomyRate) {
                    bestBowler = bowler;
                    bestEconomyRate = bowlerStats[bowler].economyRate;
                }
            }

            const result = {
                bestBowler: bestBowler,
                economyRate: bestEconomyRate
            };

            fs.writeFileSync('../public/output/bestBowlerInSuperOvers.json', JSON.stringify(result, null, 2));
            console.log('Result written to output/bestBowlerInSuperOvers.json');
        });
}


findBestEconomyInSuperOvers('../data/deliveries.csv');
