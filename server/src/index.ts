// node modules
import { Elysia } from "elysia";
import parse from "csv-simple-parser";
// src modules
import compressor from "./compressor.ts";

const PORT = process.env.PORT || 4444;

// parse csv file with binds
const filePath = "src/dict.csv";
const dictFile = Bun.file(filePath);
type pokepath = { 
    name: string, 
    file: string 
};
const csv: pokepath[] = parse(await dictFile.text(), {header: true}) as pokepath[];

// make elysia app
const app = new Elysia();

// make routes based on csv file
const dirPath = "/app/pokemon_art/";
for(const row of csv) {
    //console.log(row);
    const routePath: string = `/${row.name.toUpperCase().toString()}`;
    const filePath: string = `${dirPath}${row.file}`;
    console.log(`route: ${routePath} for ${filePath}`);
    //app.get(routePath, () => compressor(filePath));
    app.get(routePath, () => Bun.file(filePath));
}

// port
app.listen(PORT);

// hello we up
console.log(
    `Frontend is running at  http://${app.server?.hostname}:${app.server?.port}`
);