const fs = require('fs');
const csv = require('csv-parser');

function teamTossAndMatchWins(matchesCsvPath) {
    let tossAndMatchWins = {};

    
    fs.createReadStream(matchesCsvPath)
        .pipe(csv())
        .on('data', (row) => {
            const tossWinner = row.toss_winner;
            const matchWinner = row.winner;

         
            if (tossWinner && matchWinner) {
                if (!tossAndMatchWins[tossWinner]) {
                    tossAndMatchWins[tossWinner] = { tossWins: 0, matchWins: 0 };
                }
                
                tossAndMatchWins[tossWinner].tossWins++;

                if (tossWinner === matchWinner) {
                    tossAndMatchWins[tossWinner].matchWins++;
                }
            }
        })
        .on('end', () => {
           
            fs.writeFileSync('../public/output/tossAndMatchWins.json', JSON.stringify(tossAndMatchWins, null, 2));
            console.log('Result written to output/tossAndMatchWins.json');
        });
}


teamTossAndMatchWins('../data/matches.csv');
