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

// serve index
app.get("/", () => compressor("./public/index.html"));

// make routes based on csv file
const dirPath = "./pokemon_art/";
for(const row of csv) {
    //console.log(row);
    let name: string = row.name.toLowerCase().toString();
    if(name.includes(" ")) {
        name = name.replace(" ", "%20");
    }
    if(name.includes("'")) {
        name = name.replace("'", "%27");
    }
    const routePath: string = `/${name}`;
    const filePath: string = `${dirPath}${row.file}`;
    console.log(`route: ${routePath} for ${filePath}`);
    app.get(routePath, () => compressor(filePath));
    //app.get(routePath, () => Bun.file(filePath));
}

// create the body
app.put("/home", () => {
    let html: string = ``;
    html += `
        <p>hello</p>
    `;
    return html;
});



// port
app.listen(PORT)

// hello we up
console.log(
    `Frontend is running at  http://${app.server?.hostname}:${app.server?.port}`
);