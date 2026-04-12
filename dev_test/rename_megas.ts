// rename_megas.ts
// Reads new_megas.txt, looks up each base Pokemon's dex number from dict.csv,
// and copies the downloaded image from new_megas_images/ to new_named_megas/
// with the correct {dex}-mega{-suffix}.png naming scheme.
// Usage: bun run rename_megas.ts

import { mkdir, copyFile } from "fs/promises";

const MEGAS_FILE = "../new_megas.txt";
const DICT_CSV = "../server/src/dict.csv";
const INPUT_DIR = "../new_megas_images";
const OUTPUT_DIR = "../new_named_megas";

// ---------- load dict.csv ----------

const csvText = await Bun.file(DICT_CSV).text();
const csvRows = csvText
    .split("\n")
    .slice(1) // skip header
    .filter((l) => l.trim().length > 0)
    .map((l) => {
        const [name, file] = l.split(",");
        return { name: name.trim(), file: file.trim() };
    });

// map base pokemon name (lowercase) -> dex number string
// e.g. "raichu" -> "26", "magearna" -> "801"
function getDexNumber(pokemonName: string): string | null {
    const lower = pokemonName.toLowerCase();
    for (const row of csvRows) {
        if (row.name.toLowerCase() === lower) {
            // extract the leading number from the filename: "26.png" -> "26", "801-original.png" -> "801"
            const match = row.file.match(/^(\d+)/);
            return match ? match[1] : null;
        }
    }
    return null;
}

// ---------- form suffix mapping ----------
// Maps parenthetical form descriptions to the suffix used in existing filenames.
// Derived from dict.csv: Tatsugiri-Droopy -> 978-d.png, Tatsugiri-Stretchy -> 978-s.png,
// Tatsugiri (default/curly) -> 978.png, Magearna-Original -> 801-original.png

const formSuffixMap: Record<string, string> = {
    "curly form": "",           // curly is the default tatsugiri form
    "droopy form": "-d",
    "stretchy form": "-s",
    "original color": "-original",
};

// ---------- parse mega name ----------

interface MegaEntry {
    original: string;
    pokemon: string;       // base species name e.g. "Raichu"
    xyzSuffix: string;     // "x", "y", "z", or ""
    form: string;          // lowercase form description e.g. "curly form" or ""
    srcFilename: string;   // filename in new_megas_images/
}

function toSrcFilename(original: string): string {
    return original
        .toLowerCase()
        .replace(/[()]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/(^-|-$)/g, "") + ".png";
}

function parseMegaName(line: string): MegaEntry {
    let rest = line.replace(/^Mega\s+/, "");

    let form = "";
    const parenMatch = rest.match(/\s*\((.+?)\)/);
    if (parenMatch) {
        form = parenMatch[1].toLowerCase();
        rest = rest.replace(/\s*\(.+?\)/, "").trim();
    }

    let xyzSuffix = "";
    const suffixMatch = rest.match(/\s+([XYZ])$/i);
    if (suffixMatch) {
        xyzSuffix = suffixMatch[1].toLowerCase();
        rest = rest.replace(/\s+[XYZ]$/i, "").trim();
    }

    return {
        original: line,
        pokemon: rest,
        xyzSuffix,
        form,
        srcFilename: toSrcFilename(line),
    };
}

// ---------- build dest filename ----------

function buildDestFilename(entry: MegaEntry): string | null {
    const dex = getDexNumber(entry.pokemon);
    if (!dex) return null;

    let suffix = "-mega";

    // add xyz suffix: -mega-x, -mega-z, etc.
    if (entry.xyzSuffix) {
        suffix += `-${entry.xyzSuffix}`;
    }

    // add form suffix: Tatsugiri droopy -> -mega-d, Magearna original -> -mega-original
    if (entry.form) {
        const formSuffix = formSuffixMap[entry.form];
        if (formSuffix !== undefined && formSuffix !== "") {
            suffix += formSuffix;
        }
        // curly form maps to "" so it's just -mega (the default)
    }

    return `${dex}${suffix}.png`;
}

// ---------- main ----------

const lines = (await Bun.file(MEGAS_FILE).text())
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

await mkdir(OUTPUT_DIR, { recursive: true });

let success = 0;
let failed = 0;

for (const line of lines) {
    const entry = parseMegaName(line);
    const destFilename = buildDestFilename(entry);

    if (!destFilename) {
        console.log(`SKIP  ${line} — base pokemon "${entry.pokemon}" not found in dict.csv`);
        failed++;
        continue;
    }

    const src = `${INPUT_DIR}/${entry.srcFilename}`;
    const dest = `${OUTPUT_DIR}/${destFilename}`;

    try {
        await copyFile(src, dest);
        console.log(`${entry.srcFilename} → ${destFilename}`);
        success++;
    } catch (e: any) {
        console.log(`FAIL  ${line} — ${e.message}`);
        failed++;
    }
}

console.log(`\nDone. Copied: ${success}, Failed: ${failed}`);
