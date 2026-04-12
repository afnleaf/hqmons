// download_megas.ts
// Downloads official artwork from PokeAPI for each Pokemon in new_megas.txt
// Tries mega form name first, falls back to existing mega, then base Pokemon.
// Usage: bun run download_megas.ts

import { mkdir } from "fs/promises";

const INPUT = "../new_megas.txt";
const OUTPUT_DIR = "../new_megas_images";
const API_BASE = "https://pokeapi.co/api/v2/pokemon";
const DELAY_MS = 300; // be nice to the API

// ---------- name parsing ----------

interface Parsed {
    original: string;
    pokemon: string;   // base species e.g. "raichu"
    suffix: string;    // X / Y / Z or ""
    form: string;      // parenthetical e.g. "Original Color" or ""
}

function parseMegaName(line: string): Parsed {
    let rest = line.replace(/^Mega\s+/, "");

    // extract parenthetical form: "Tatsugiri (Curly Form)"
    let form = "";
    const parenMatch = rest.match(/\s*\((.+?)\)/);
    if (parenMatch) {
        form = parenMatch[1];
        rest = rest.replace(/\s*\(.+?\)/, "").trim();
    }

    // extract trailing X / Y / Z suffix
    let suffix = "";
    const suffixMatch = rest.match(/\s+([XYZ])$/);
    if (suffixMatch) {
        suffix = suffixMatch[1];
        rest = rest.replace(/\s+[XYZ]$/, "").trim();
    }

    return {
        original: line,
        pokemon: rest.toLowerCase(),
        suffix: suffix.toLowerCase(),
        form,
    };
}

// ---------- candidate API names ----------

function getCandidates(p: Parsed): string[] {
    const names: string[] = [];

    // extract form key if present (e.g. "Curly Form" -> "curly")
    const formKey = p.form
        ? p.form.toLowerCase().replace(/\s*(form|color)\s*/g, "").trim().replace(/\s+/g, "-")
        : "";

    // 1. form-specific mega (e.g. tatsugiri-curly-mega, magearna-original-mega)
    if (formKey) {
        names.push(`${p.pokemon}-${formKey}-mega`);
    }

    // 2. standard mega name (e.g. raichu-mega-x, clefable-mega)
    if (p.suffix) {
        names.push(`${p.pokemon}-mega-${p.suffix}`);
    } else {
        names.push(`${p.pokemon}-mega`);
    }

    // 3. for Z variants, try existing mega (absol-mega already exists)
    if (p.suffix === "z") {
        names.push(`${p.pokemon}-mega`);
    }

    // 4. base with form variant (tatsugiri-curly, magearna-original, etc.)
    if (formKey) {
        names.push(`${p.pokemon}-${formKey}`);
    }

    // 5. base pokemon
    names.push(p.pokemon);

    return names;
}

// ---------- PokeAPI fetch ----------

interface FetchResult {
    matchedName: string;
    artworkUrl: string;
}

async function tryFetch(candidates: string[]): Promise<FetchResult | null> {
    for (const name of candidates) {
        try {
            const resp = await fetch(`${API_BASE}/${name}`);
            if (!resp.ok) continue;
            const data = await resp.json() as any;
            const url = data.sprites?.other?.["official-artwork"]?.front_default;
            if (url) {
                return { matchedName: name, artworkUrl: url };
            }
        } catch {
            // try next candidate
        }
    }
    return null;
}

async function downloadImage(url: string, dest: string) {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Failed to download image: ${resp.status}`);
    const buf = await resp.arrayBuffer();
    await Bun.write(dest, buf);
}

// ---------- filename helper ----------

function toFilename(original: string): string {
    return original
        .toLowerCase()
        .replace(/[()]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/(^-|-$)/g, "");
}

// ---------- main ----------

const lines = (await Bun.file(INPUT).text())
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

await mkdir(OUTPUT_DIR, { recursive: true });

console.log(`Found ${lines.length} Pokemon to download.\n`);

let downloaded = 0;
let failed = 0;

for (const line of lines) {
    const parsed = parseMegaName(line);
    const candidates = getCandidates(parsed);

    process.stdout.write(`${line} → trying: ${candidates.join(", ")} ... `);

    const result = await tryFetch(candidates);

    if (result) {
        const filename = `${toFilename(line)}.png`;
        const dest = `${OUTPUT_DIR}/${filename}`;
        await downloadImage(result.artworkUrl, dest);
        console.log(`OK (${result.matchedName}) → ${filename}`);
        downloaded++;
    } else {
        console.log("FAILED - not found in PokeAPI");
        failed++;
    }

    // rate limit
    await Bun.sleep(DELAY_MS);
}

console.log(`\nDone. Downloaded: ${downloaded}, Failed: ${failed}`);
