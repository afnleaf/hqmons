import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { Dex } from '@pkmn/dex';
//"@pkmn/dex": "^0.9.4",
//"@pkmn/types": "^4.0.0",

// borrowed from some stack overflow page
async function getFiles(directoryPath: string) {
    try {
        // returns a JS array of just short/local file-names, not paths.
        const fileNames = await readdir(directoryPath); 
        const filePaths = fileNames.map(fn => join('', fn));
        return filePaths;
    }
    catch(err) {
        console.error(err);
    }
}

// sort strings alphanumerically
function naturalSort(a: string, b: string) {
    
    // replace "../pokemon_art/1024-t.png", to get "1024-t"
    //let a1: string = a.replace("../pokemon_art/", "");
    let a2: string = a.replace(".png", "");
    //let b1: string = b.replace("../pokemon_art/", "");
    let b2: string = b.replace(".png", "");

    // split into segments by -
    const posA = a2.indexOf("-");
    let segmentsA: string[] = [];
    if(posA !== -1) {
        segmentsA.push(a2.slice(0, posA));
        segmentsA.push(a2.slice(posA+1));
    } else {
        segmentsA.push(a2);
        segmentsA.push("0");
    }
    const posB = b2.indexOf("-");
    let segmentsB: string[] = [];
    if(posB !== -1) {
        segmentsB.push(b2.slice(0, posB));
        segmentsB.push(b2.slice(posB+1));
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

const directoryPath = "../pokemon_art";
const filePaths = await getFiles(directoryPath);

//console.log(filePaths);

const allPokemon: string[] = [];

let i = 1;
const mons = Dex.species.all();
mons.forEach(pokemon => {
    //allPokemon.push(pokemon.name);
    //console.log(pokemon);
    //console.log(pokemon.name);
    allPokemon.push(pokemon.name);
    /*
    const position = pokemon.name.indexOf("-");
    if (position !== -1) {
        const sliced = pokemon.name.slice(position);
        console.log(`${pokemon.num}${sliced}.png`);
    } else {
        console.log(`${pokemon.num}.png`);
    }
    */
});


if(filePaths) {
    filePaths.sort(naturalSort);
    
    for (let i = 0; i < Math.max(allPokemon.length, filePaths.length); i++) {
        console.log(`${allPokemon[i]},${filePaths[i]}`);
    }
    
    //console.log(filePaths);
}
