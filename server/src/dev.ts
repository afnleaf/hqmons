import {Dex} from '@pkmn/dex';

const mons = Dex.species.all();
mons.forEach(pokemon => {
    if(pokemon.isNonstandard === null) {
        console.log(pokemon.name);
    }
});