// update_dict.ts
// Prints new dict.csv entries for the new megas.
// Usage: bun run update_dict.ts
// Append: bun run update_dict.ts >> ../server/src/dict.csv

const MEGAS_FILE = "../new_megas.txt";
const DICT_CSV = "../server/src/dict.csv";

const formSuffixMap: Record<string, string> = {
    "curly form": "",
    "droopy form": "-d",
    "stretchy form": "-s",
    "original color": "-original",
};

// dict name suffix goes after -Mega: e.g. Tatsugiri-Mega-Droopy
const formDictMap: Record<string, string> = {
    "curly form": "",
    "droopy form": "-Droopy",
    "stretchy form": "-Stretchy",
    "original color": "-Original",
};

function parseMegaName(line: string) {
    let rest = line.replace(/^Mega\s+/, "");

    let form = "";
    const parenMatch = rest.match(/\s*\((.+?)\)/);
    if (parenMatch) {
        form = parenMatch[1].toLowerCase();
        rest = rest.replace(/\s*\(.+?\)/, "").trim();
    }

    let xyzSuffix = "";
    const suffixMatch = rest.match(/\s+([XYZ])$/);
    if (suffixMatch) {
        xyzSuffix = suffixMatch[1];
        rest = rest.replace(/\s+[XYZ]$/, "").trim();
    }

    return { pokemon: rest, xyzSuffix, form };
}

// dex lookup
const csvText = await Bun.file(DICT_CSV).text();
const dexLookup = new Map<string, string>();
for (const line of csvText.split("\n")) {
    const [name, file] = line.split(",");
    if (!name || !file) continue;
    const baseName = name.split("-")[0].toLowerCase();
    const match = file.match(/^(\d+)/);
    if (match && !dexLookup.has(baseName)) {
        dexLookup.set(baseName, match[1]);
    }
}

// generate
const megas = (await Bun.file(MEGAS_FILE).text())
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

for (const line of megas) {
    const { pokemon, xyzSuffix, form } = parseMegaName(line);
    const dex = dexLookup.get(pokemon.toLowerCase());
    if (!dex) {
        console.error(`SKIP: "${line}" — "${pokemon}" not in dict.csv`);
        continue;
    }

    // name: Pokemon-Mega[-X][-Form]
    let name = `${pokemon}-Mega`;
    if (xyzSuffix) name += `-${xyzSuffix}`;
    if (form && formDictMap[form]) name += formDictMap[form];

    // file: {dex}-mega[-x][-form].png
    let file = `${dex}-mega`;
    if (xyzSuffix) file += `-${xyzSuffix.toLowerCase()}`;
    if (form && formSuffixMap[form]) file += formSuffixMap[form];
    file += ".png";

    console.log(`${name},${file}`);
}
