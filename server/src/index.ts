// node modules
import { Elysia } from "elysia";
import parse from "csv-simple-parser";
import { html } from "@elysiajs/html";
import { cors } from "@elysiajs/cors";
// src modules
//import compressor from "./compressor.ts";

//const PORT = process.env.PORT || 4444;
const PORT = 4444;


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

app.use(cors());
app.use(html());

app.get("/", () => Bun.file("./public/index.html"));

// this works
app.get("/pecharunt", () => Bun.file("./pokemon_art/1025.png"));

// but this doesn't?
// make routes based on csv file
let i = 1;
const dirPath = "./pokemon_art/";
for(const row of csv) {
    //console.log(row);
    let name: string = row.name.toLowerCase().toString();
    if(name.includes(" ")) {
        name = name.replace(" ", "+");
    }
    const routePath: string = `/${name}`;
    const filePath: string = `${dirPath}${row.file}`;
    console.log(`route: ${routePath} for ${filePath}`);
    //app.get(routePath, () => compressor(filePath));
    app.get(routePath, () => Bun.file(filePath));
    if(i === 996) {
        break;
    }
    i++;
}

// port
app.listen(PORT)


// hello we up
console.log(
    `Frontend is running at  http://${app.server?.hostname}:${app.server?.port}/bulbasaur`
);