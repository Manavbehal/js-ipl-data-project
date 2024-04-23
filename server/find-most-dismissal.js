const fs = require('fs');
const csv = require('csv-parser');

function findMostDismissals(deliveriesCsvPath) {
    let dismissalCount = {};

   
    fs.createReadStream(deliveriesCsvPath)
        .pipe(csv())
        .on('data', (row) => {
            const bowler = row.bowler;
            const dismissedBatsman = row.player_dismissed;

           
            if (dismissedBatsman && dismissedBatsman !== ' ') {
                const dismissalKey = `${bowler} to ${dismissedBatsman}`;

                if (!dismissalCount[dismissalKey]) {
                    dismissalCount[dismissalKey] = 0;
                }
                dismissalCount[dismissalKey]++;
            }
        })
        .on('end', () => {
            
            let highestDismissals = 0;
            let mostDismissedPlayer = '';

            for (const key in dismissalCount) {
                if (dismissalCount[key] > highestDismissals) {
                    highestDismissals = dismissalCount[key];
                    mostDismissedPlayer = key;
                }
            }

            const result = {
                mostDismissedPlayer: mostDismissedPlayer,
                dismissalCount: highestDismissals
            };

            fs.writeFileSync('../public/output/mostDismissedPlayer.json', JSON.stringify(result, null, 2));
            console.log('Result written to output/mostDismissedPlayer.json');
        });
}


findMostDismissals('../data/deliveries.csv');
