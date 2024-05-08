/*
import {Dex} from '@pkmn/dex';

const mons = Dex.species.all();
mons.forEach(pokemon => {
    if(pokemon.isNonstandard === null) {
        //console.log(pokemon);
        console.log(pokemon.name);
        const position = pokemon.name.indexOf("-");
        if (position !== -1) {
            const sliced = pokemon.name.slice(position);
            console.log(`${pokemon.num}${sliced}.png`);
        } else {
            console.log(`${pokemon.num}.png`);
        }

        
    }
});
*/

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const directoryPath = "../pokemon_art"
const filePaths = await getFiles(directoryPath);

// borrowed from some stack overflow page
async function getFiles( directoryPath: string ) {
    try {
        // returns a JS array of just short/local file-names, not paths.
        const fileNames = await readdir( directoryPath ); 
        const filePaths = fileNames.map( fn => join( directoryPath, fn ) );
        return filePaths;
    }
    catch (err) {
        console.error( err );
    }
}

// Regular expression to match numeric and non-numeric parts
const pattern = /(\d+)|([^\d]+)/g;

// elper function to split a string into segments
function splitIntoSegments(filename: string) {
    return filename.match(pattern) || [];
}

// sort strings alphanumerically
function naturalSort(a: string, b: string) {
    
    // replace "../pokemon_art/1024-t.png", to get "1024-t"
    let a1: string = a.replace("../pokemon_art/", "");
    let a2: string = a1.replace(".png", "");
    let b1: string = b.replace("../pokemon_art/", "");
    let b2: string = b1.replace(".png", "");

    // split into segments by -
    const posA = a2.indexOf("-");
    let segmentsA: string[] = [];
    if(posA !== -1) {
        segmentsA.push(a2.slice(0, posA));
        segmentsA.push(a2.slice(posA));
    } else {
        segmentsA.push(a2);
        segmentsA.push("0");
    }
    const posB = b2.indexOf("-");
    let segmentsB: string[] = [];
    if(posB !== -1) {
        segmentsB.push(b2.slice(0, posB));
        segmentsB.push(b2.slice(posB));
    } else {
        segmentsB.push(b2);
        segmentsB.push("0");
    }
    
    //console.log("a: ", segmentsA);
    //console.log("b: ", segmentsB);

    for (let i = 0; i < Math.max(segmentsA.length, segmentsB.length); i++) {
        const A = segmentsA[i];
        const B = segmentsB[i];

        if (A !== B) {
            const isNumberA = !isNaN(parseInt(A));
            const isNumberB = !isNaN(parseInt(B));
    
            if (isNumberA && isNumberB) {
                if (parseInt(A) !== parseInt(B)) {
                    // compare numeric segments numerically
                    return parseInt(A) - parseInt(B); 
                }
            } else if (!isNumberA && !isNumberB) {
                // compare non-numeric segments lexicographically
                return A.localeCompare(B);
            } else if (!isNumberA) {
                // non-numeric segment comes after numeric segment
                return 1;
            } else {
                // numeric segment comes before non-numeric segment
                return -1; 
            }
        }
    }

    // both filenames are equal
    return 0;
}

if(filePaths) {
    filePaths.sort(naturalSort);
}

console.log(filePaths);