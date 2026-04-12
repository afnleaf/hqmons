// check_sizes.ts
// Prints width x height for each image in new_named_megas/
// Usage: bun run check_sizes.ts

import { imageSize } from "image-size";

const DIR = "../old_art_folder/new_named_megas";
const files = (await Array.fromAsync(new Bun.Glob("*.png").scan(DIR))).sort();

for (const file of files) {
    const buf = await Bun.file(`${DIR}/${file}`).arrayBuffer();
    const dims = imageSize(new Uint8Array(buf));
    const mismatch = dims.width === dims.height ? true : false;
    console.log(`${file}: ${dims.width} x ${dims.height} - ${mismatch}`);
    
}
