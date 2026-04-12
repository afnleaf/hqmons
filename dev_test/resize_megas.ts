// resize_megas.ts
// Resizes images in new_named_megas/ to 256x256 and saves to new_named_megas_256/
// Usage: bun run resize_megas.ts

import { mkdir } from "fs/promises";
import sharp from "sharp";

const INPUT_DIR = "../old_art_folder/new_named_megas";
const OUTPUT_DIR = "../old_art_folder/new_named_megas_256";
const SIZE = 256;

await mkdir(OUTPUT_DIR, { recursive: true });

const files = (await Array.fromAsync(new Bun.Glob("*.png").scan(INPUT_DIR))).sort();

await Promise.all(files.map(async (file) => {
    await sharp(`${INPUT_DIR}/${file}`)
        .resize(SIZE, SIZE)
        .toFile(`${OUTPUT_DIR}/${file}`);
    console.log(file);
}));

console.log(`\nDone. Resized ${files.length} images to ${SIZE}x${SIZE}.`);
